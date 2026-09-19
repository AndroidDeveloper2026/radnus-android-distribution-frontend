import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search, X, TrendingUp, TrendingDown, Minus,
  ChevronRight, ChevronDown, ChevronUp, Filter,
  Package, Calendar, BarChart2,
} from 'lucide-react-native';
import Header from '../../components/Header';
import {
  fetchProductPriceHistory,
  clearPriceHistory,
} from '../../services/features/purchase/purchaseSlice';
import { fetchProducts } from '../../services/features/products/productSlice';

// ─── Constants ────────────────────────────────────────────────────
const ACCENT = '#D32F2F';
const WHITE  = '#FFFFFF';
const BG     = '#F5F5F5';
const GREY   = '#555';
const BORDER = '#E5E7EB';

// ─── Helpers ──────────────────────────────────────────────────────
const fmt     = v  => Number(v || 0).toFixed(2);
const fmtDate = v  => v ? new Date(v).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : '—';

const trendIcon = (current, prev) => {
  if (!prev) return <Minus size={14} color={GREY} />;
  if (current > prev) return <TrendingUp  size={14} color="#C62828" />;
  if (current < prev) return <TrendingDown size={14} color="#2E7D32" />;
  return <Minus size={14} color={GREY} />;
};

// ─── Stat Card ────────────────────────────────────────────────────
const StatCard = ({ label, value, color }) => (
  <View style={s.statCard}>
    <Text style={s.statLabel}>{label}</Text>
    <Text style={[s.statValue, color && { color }]}>{value}</Text>
  </View>
);

// ─── Filter Modal ─────────────────────────────────────────────────
const FilterModal = ({ visible, onClose, filters, onApply, suppliers }) => {
  const [local, setLocal] = useState(filters);

  const f = (key, val) => setLocal(p => ({ ...p, [key]: val }));

  const handleApply = () => { onApply(local); onClose(); };
  const handleReset = () => {
    const cleared = { supplier: '', batchNo: '', invoiceNo: '', fromDate: '', toDate: '', minPrice: '', maxPrice: '', gst: '' };
    setLocal(cleared);
    onApply(cleared);
    onClose();
  };

  useEffect(() => { setLocal(filters); }, [filters]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={[s.sheet, { maxHeight: '88%' }]}>
          <View style={s.sheetHeader}>
            <Text style={s.sheetTitle}>Filter History</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={20} color={GREY} />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ paddingHorizontal: 20 }} keyboardShouldPersistTaps="handled">
            {[
              { label: 'Batch No.',    key: 'batchNo',   placeholder: 'e.g. B001' },
              { label: 'Invoice No.',  key: 'invoiceNo', placeholder: 'e.g. PUR-0042' },
              { label: 'From Date',    key: 'fromDate',  placeholder: 'YYYY-MM-DD' },
              { label: 'To Date',      key: 'toDate',    placeholder: 'YYYY-MM-DD' },
              { label: 'Min Price (₹)',key: 'minPrice',  placeholder: '0', keyboard: 'numeric' },
              { label: 'Max Price (₹)',key: 'maxPrice',  placeholder: '0', keyboard: 'numeric' },
              { label: 'GST %',        key: 'gst',       placeholder: 'e.g. 18',   keyboard: 'numeric' },
            ].map(row => (
              <View key={row.key}>
                <Text style={s.label}>{row.label}</Text>
                <TextInput
                  style={s.input}
                  placeholder={row.placeholder}
                  placeholderTextColor="#aaa"
                  keyboardType={row.keyboard || 'default'}
                  value={local[row.key] || ''}
                  onChangeText={v => f(row.key, v)}
                />
              </View>
            ))}

            {/* Supplier filter */}
            {suppliers.length > 0 && (
              <>
                <Text style={s.label}>Supplier</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', gap: 8, paddingVertical: 4 }}>
                    {[{ _id: '', name: 'All' }, ...suppliers].map(sup => (
                      <TouchableOpacity
                        key={sup._id}
                        style={[s.chip, local.supplier === sup._id && s.chipActive]}
                        onPress={() => f('supplier', sup._id)}>
                        <Text style={[s.chipText, local.supplier === sup._id && s.chipTextActive]}>
                          {sup.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </>
            )}
          </ScrollView>

          <View style={s.modalFooter}>
            <TouchableOpacity style={s.cancelBtn} onPress={handleReset}>
              <Text style={s.cancelBtnText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.submitBtn} onPress={handleApply}>
              <Filter size={14} color={WHITE} />
              <Text style={s.submitBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ─── History Entry Row ────────────────────────────────────────────
const HistoryRow = React.memo(({ entry, prevPrice, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={s.historyCard}>
      <TouchableOpacity
        style={s.historyHeader}
        onPress={() => setExpanded(p => !p)}
        activeOpacity={0.8}>
        <View style={{ flex: 1, gap: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={s.historyPrice}>₹{fmt(entry.purchasePrice)}</Text>
            {trendIcon(entry.purchasePrice, prevPrice)}
          </View>
          <Text style={s.historyMeta}>
            {fmtDate(entry.invoiceDate || entry.createdAt)}
            {entry.supplier?.name ? `  ·  ${entry.supplier.name}` : ''}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Text style={s.historyQty}>{entry.quantity} {entry.unit || 'pcs'}</Text>
          {entry.batchNo ? <Text style={s.historyBatch}>Batch: {entry.batchNo}</Text> : null}
          {expanded ? <ChevronUp size={14} color={GREY} /> : <ChevronDown size={14} color={GREY} />}
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={s.historyBody}>
          {[
            { label: 'Purchase No.',    value: entry.purchaseNumber || '—'     },
            { label: 'Invoice No.',     value: entry.invoiceNumber  || '—'     },
            { label: 'Batch No.',       value: entry.batchNo        || '—'     },
            { label: 'Rack No.',        value: entry.rackNo         || '—'     },
            { label: 'GST %',           value: entry.gst != null ? `${entry.gst}%` : '—' },
            { label: 'MRP',             value: entry.mrp            ? `₹${fmt(entry.mrp)}`            : '—' },
            { label: 'Distributor ₹',  value: entry.distributorPrice ? `₹${fmt(entry.distributorPrice)}` : '—' },
            { label: 'Retailer ₹',     value: entry.retailerPrice    ? `₹${fmt(entry.retailerPrice)}`    : '—' },
            { label: 'Walk-in ₹',      value: entry.walkinPrice      ? `₹${fmt(entry.walkinPrice)}`      : '—' },
            { label: 'Avail. Qty',      value: entry.availableQty != null ? String(entry.availableQty) : '—' },
          ].map(row => (
            <View key={row.label} style={s.bodyRow}>
              <Text style={s.bodyLabel}>{row.label}</Text>
              <Text style={s.bodyValue}>{row.value}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
});

// ─── Product List Screen ──────────────────────────────────────────
const ProductListView = ({ onSelectProduct }) => {
  const products = useSelector(s => s.products.list);
  const loading  = useSelector(s => s.products.loading);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(p =>
      p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q)
    );
  }, [products, search]);

  return (
    <View style={{ flex: 1 }}>
      <View style={s.searchRow}>
        <View style={s.searchWrapper}>
          <Search size={14} color="#aaa" />
          <TextInput
            style={s.searchInput}
            placeholder="Search by name or SKU…"
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <X size={14} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={ACCENT} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={p => p._id}
          contentContainerStyle={{ padding: 12, paddingBottom: 30 }}
          renderItem={({ item: p }) => (
            <TouchableOpacity style={s.productCard} onPress={() => onSelectProduct(p)} activeOpacity={0.85}>
              <View style={s.productIconBox}>
                <Package size={20} color={ACCENT} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.productName} numberOfLines={1}>{p.name}</Text>
                <Text style={s.productSub}>
                  {p.sku ? `SKU: ${p.sku}` : ''}
                  {p.category ? (p.sku ? `  ·  ${p.category}` : p.category) : ''}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 3 }}>
                <Text style={s.productPrice}>₹{fmt(p.purchasePrice || 0)}</Text>
                <Text style={{ fontSize: 10, color: '#aaa' }}>Purchase</Text>
              </View>
              <ChevronRight size={16} color="#ccc" />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={s.centerBox}>
              <Package size={40} color="#ccc" />
              <Text style={s.emptyText}>
                {search ? `No products matching "${search}"` : 'No products found.'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────
const defaultFilters = { supplier: '', batchNo: '', invoiceNo: '', fromDate: '', toDate: '', minPrice: '', maxPrice: '', gst: '' };

const PurchasePriceHistoryScreen = () => {
  const dispatch = useDispatch();
  const { productPriceHistory, priceHistoryLoading, priceHistoryError } = useSelector(s => s.purchase);
  const suppliers = useSelector(s => s.purchase.suppliers);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters,  setFilters]  = useState(defaultFilters);
  const [showFilter, setShowFilter] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (selectedProduct) {
      dispatch(fetchProductPriceHistory(selectedProduct._id));
    } else {
      dispatch(clearPriceHistory());
    }
  }, [selectedProduct, dispatch]);

  const handleBack = () => {
    setSelectedProduct(null);
    setFilters(defaultFilters);
  };

  const onRefresh = async () => {
    if (!selectedProduct) return;
    setRefreshing(true);
    await dispatch(fetchProductPriceHistory(selectedProduct._id));
    setRefreshing(false);
  };

  // ── Apply client-side filters to history
  const history = useMemo(() => {
    const raw = productPriceHistory?.history || [];
    return raw.filter(entry => {
      if (filters.supplier  && entry.supplier?._id  !== filters.supplier)              return false;
      if (filters.batchNo   && !entry.batchNo?.toLowerCase().includes(filters.batchNo.toLowerCase())) return false;
      if (filters.invoiceNo && !entry.purchaseNumber?.toLowerCase().includes(filters.invoiceNo.toLowerCase())) return false;
      if (filters.fromDate  && new Date(entry.invoiceDate || entry.createdAt) < new Date(filters.fromDate)) return false;
      if (filters.toDate    && new Date(entry.invoiceDate || entry.createdAt) > new Date(filters.toDate))   return false;
      if (filters.minPrice  && entry.purchasePrice < Number(filters.minPrice)) return false;
      if (filters.maxPrice  && entry.purchasePrice > Number(filters.maxPrice)) return false;
      if (filters.gst       && String(entry.gst) !== filters.gst)             return false;
      return true;
    });
  }, [productPriceHistory, filters]);

  // ── Stats
  const stats = useMemo(() => {
    const data = productPriceHistory;
    if (!data) return null;
    const prices = history.map(h => h.purchasePrice).filter(Boolean);
    return {
      currentPrice: data.currentPrice || 0,
      lowestPrice:  prices.length ? Math.min(...prices) : 0,
      highestPrice: prices.length ? Math.max(...prices) : 0,
      lastDate:     history[0] ? fmtDate(history[0].invoiceDate || history[0].createdAt) : '—',
      totalEntries: history.length,
    };
  }, [productPriceHistory, history]);

  const activeFilterCount = useMemo(() =>
    Object.values(filters).filter(v => v !== '').length, [filters]);

  // ── Product list view
  if (!selectedProduct) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['bottom']}>
        <Header title="Price History" />
        <ProductListView onSelectProduct={setSelectedProduct} />
      </SafeAreaView>
    );
  }

  // ── History detail view
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['bottom']}>
      <Header title="Price History" />

      {/* ── Product info card ── */}
      <View style={s.productInfoCard}>
        <View style={{ flex: 1 }}>
          <Text style={s.productInfoName} numberOfLines={1}>{selectedProduct.name}</Text>
          {selectedProduct.sku ? <Text style={s.productInfoSub}>SKU: {selectedProduct.sku}</Text> : null}
        </View>
        <TouchableOpacity style={s.backChip} onPress={handleBack}>
          <X size={13} color={ACCENT} />
          <Text style={s.backChipText}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* ── Current pricing row ── */}
      {selectedProduct && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 70 }}>
          <View style={s.priceRow}>
            {[
              { label: 'Purchase', value: selectedProduct.purchasePrice },
              { label: 'MRP',      value: selectedProduct.mrp },
              { label: 'Distrib.', value: selectedProduct.distributorPrice },
              { label: 'Retail',   value: selectedProduct.retailerPrice },
              { label: 'Walk-in',  value: selectedProduct.walkinPrice },
            ].map(p => (
              <View key={p.label} style={s.priceChip}>
                <Text style={s.priceChipLabel}>{p.label}</Text>
                <Text style={s.priceChipValue}>₹{fmt(p.value)}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {priceHistoryLoading ? (
        <ActivityIndicator size="large" color={ACCENT} style={{ marginTop: 40 }} />
      ) : priceHistoryError ? (
        <View style={s.centerBox}>
          <Text style={s.errorText}>{priceHistoryError}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={() => dispatch(fetchProductPriceHistory(selectedProduct._id))}>
            <Text style={s.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* ── Stats ── */}
          {stats && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 88 }}>
              <View style={s.statsRow}>
                <StatCard label="Current ₹"  value={`₹${fmt(stats.currentPrice)}`} color={ACCENT} />
                <StatCard label="Lowest ₹"   value={`₹${fmt(stats.lowestPrice)}`}  color="#2E7D32" />
                <StatCard label="Highest ₹"  value={`₹${fmt(stats.highestPrice)}`} color="#C62828" />
                <StatCard label="Last Date"   value={stats.lastDate} />
                <StatCard label="Purchases"   value={String(stats.totalEntries)} />
              </View>
            </ScrollView>
          )}

          {/* ── Filter bar ── */}
          <View style={s.filterBar}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <BarChart2 size={14} color={GREY} />
              <Text style={s.filterBarLabel}>
                {history.length} {history.length === 1 ? 'entry' : 'entries'}
              </Text>
            </View>
            <TouchableOpacity style={s.filterBarBtn} onPress={() => setShowFilter(true)}>
              <Filter size={13} color={activeFilterCount > 0 ? ACCENT : GREY} />
              <Text style={[s.filterBarBtnText, activeFilterCount > 0 && { color: ACCENT }]}>
                Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── History list ── */}
          <FlatList
            data={history}
            keyExtractor={(_, i) => String(i)}
            contentContainerStyle={{ padding: 12, paddingBottom: 30 }}
            renderItem={({ item, index }) => (
              <HistoryRow
                entry={item}
                index={index}
                prevPrice={index < history.length - 1 ? history[index + 1]?.purchasePrice : null}
              />
            )}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[ACCENT]} />}
            ListEmptyComponent={
              <View style={s.centerBox}>
                <Calendar size={40} color="#ccc" />
                <Text style={s.emptyText}>
                  {activeFilterCount > 0 ? 'No entries match the current filters.' : 'No price history found.'}
                </Text>
                {activeFilterCount > 0 && (
                  <TouchableOpacity style={s.clearFilterBtn} onPress={() => setFilters(defaultFilters)}>
                    <Text style={s.clearFilterBtnText}>Clear Filters</Text>
                  </TouchableOpacity>
                )}
              </View>
            }
          />
        </>
      )}

      {/* ── Filter Modal ── */}
      <FilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        onApply={setFilters}
        suppliers={suppliers}
      />
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  searchRow: { paddingHorizontal: 12, paddingVertical: 10 },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 13, color: '#212121', padding: 0 },

  productCard: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: ACCENT,
  },
  productIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFF3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productName:  { fontSize: 14, fontWeight: '700', color: '#212121', marginBottom: 2 },
  productSub:   { fontSize: 12, color: GREY },
  productPrice: { fontSize: 13, fontWeight: '700', color: ACCENT },

  productInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    margin: 12,
    borderRadius: 12,
    padding: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    gap: 10,
    borderLeftWidth: 4,
    borderLeftColor: ACCENT,
  },
  productInfoName: { fontSize: 15, fontWeight: '800', color: '#212121' },
  productInfoSub:  { fontSize: 12, color: GREY, marginTop: 2 },
  backChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ACCENT,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  backChipText: { fontSize: 12, color: ACCENT, fontWeight: '700' },

  priceRow:  { flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingBottom: 10 },
  priceChip: {
    backgroundColor: WHITE,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    elevation: 1,
    minWidth: 72,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  priceChipLabel: { fontSize: 10, color: GREY, fontWeight: '600', marginBottom: 2 },
  priceChipValue: { fontSize: 13, fontWeight: '800', color: '#212121' },

  statsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingBottom: 6 },
  statCard: {
    backgroundColor: WHITE,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    elevation: 1,
    minWidth: 85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  statLabel: { fontSize: 10, color: GREY, fontWeight: '600', marginBottom: 4 },
  statValue: { fontSize: 13, fontWeight: '800', color: '#212121' },

  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterBarLabel: { fontSize: 12, color: GREY, fontWeight: '600' },
  filterBarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: WHITE,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  filterBarBtnText: { fontSize: 12, color: GREY, fontWeight: '600' },

  historyCard: {
    backgroundColor: WHITE,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    overflow: 'hidden',
    borderLeftWidth: 3,
    borderLeftColor: ACCENT,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    gap: 10,
  },
  historyPrice: { fontSize: 16, fontWeight: '800', color: '#212121' },
  historyMeta:  { fontSize: 11, color: GREY, marginTop: 2 },
  historyQty:   { fontSize: 12, fontWeight: '700', color: '#212121' },
  historyBatch: { fontSize: 10, color: GREY },

  historyBody: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },
  bodyRow:   { flexDirection: 'row', justifyContent: 'space-between' },
  bodyLabel: { fontSize: 11, color: '#aaa', fontWeight: '600' },
  bodyValue: { fontSize: 12, color: '#212121', fontWeight: '600' },

  centerBox:  { alignItems: 'center', marginTop: 60, gap: 12, paddingHorizontal: 20 },
  emptyText:  { color: '#aaa', fontSize: 14, textAlign: 'center' },
  errorText:  { color: ACCENT, fontSize: 14, textAlign: 'center' },
  retryBtn:   { backgroundColor: ACCENT, borderRadius: 10, paddingHorizontal: 24, paddingVertical: 10 },
  retryText:  { color: WHITE, fontSize: 14, fontWeight: '700' },
  clearFilterBtn: { borderWidth: 1, borderColor: ACCENT, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 8 },
  clearFilterBtnText: { color: ACCENT, fontSize: 13, fontWeight: '700' },

  // Shared
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: WHITE, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%', borderTopWidth: 3, borderTopColor: ACCENT },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  sheetTitle:  { fontSize: 16, fontWeight: '800', color: '#212121' },
  label: { fontSize: 11, fontWeight: '700', color: GREY, marginBottom: 5, marginTop: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: '#212121' },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: '#F0F0F0', borderWidth: 1, borderColor: '#E0E0E0' },
  chipActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  chipText: { fontSize: 12, color: GREY, fontWeight: '500' },
  chipTextActive: { color: WHITE, fontWeight: '700' },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, padding: 16, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  cancelBtn: { borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 11 },
  cancelBtnText: { color: GREY, fontSize: 14, fontWeight: '600' },
  submitBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: ACCENT, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 11, gap: 6, elevation: 2 },
  submitBtnText: { color: WHITE, fontSize: 14, fontWeight: '700' },
});

export default PurchasePriceHistoryScreen;