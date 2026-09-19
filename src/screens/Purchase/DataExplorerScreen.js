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
  Search, X, Filter, ChevronDown, Database,
  RefreshCw, CheckCircle,
} from 'lucide-react-native';
import Header from '../../components/Header';
import {
  fetchStockBatches,
  fetchFilterOptions,
  clearStockBatches,
} from '../../services/features/purchase/purchaseSlice';

// ─── Constants ────────────────────────────────────────────────────
const ACCENT = '#D32F2F';
const WHITE  = '#FFFFFF';
const BG     = '#F5F5F5';
const GREY   = '#555';
const BORDER = '#E5E7EB';

const PAGE_SIZE = 20;

const EXPIRY_OPTIONS     = [{ key: '', label: 'All' }, { key: 'valid', label: 'Valid' }, { key: 'expiring_soon', label: 'Expiring Soon' }, { key: 'expired', label: 'Expired' }, { key: 'no_expiry', label: 'No Expiry' }];
const PAYMENT_ST_OPTIONS = [{ key: '', label: 'All' }, { key: 'paid', label: 'Paid' }, { key: 'partial', label: 'Partial' }, { key: 'unpaid', label: 'Unpaid' }];
const PAYMENT_TY_OPTIONS = [{ key: '', label: 'All' }, { key: 'Credit', label: 'Credit' }, { key: 'Cash', label: 'Cash' }, { key: 'UPI', label: 'UPI' }, { key: 'Bank Transfer', label: 'Bank Transfer' }, { key: 'Cheque', label: 'Cheque' }];

// ─── Helpers ──────────────────────────────────────────────────────
const fmt     = v => Number(v || 0).toFixed(2);
const fmtDate = v => v ? new Date(v).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : '—';

const expiryColor = s => ({ valid: '#2E7D32', expiring_soon: '#E65100', expired: '#C62828', no_expiry: GREY }[s] || GREY);
const expiryBg    = s => ({ valid: '#E8F5E9', expiring_soon: '#FFF3E0', expired: '#FFEBEE', no_expiry: '#F5F5F5' }[s] || '#F5F5F5');
const payColor    = s => ({ paid: '#2E7D32', partial: '#E65100', unpaid: '#C62828' }[s] || GREY);
const payBg       = s => ({ paid: '#E8F5E9', partial: '#FFF3E0', unpaid: '#FFEBEE' }[s] || '#F5F5F5');

const Badge = ({ label, color, bg }) => (
  <View style={[s.badge, { backgroundColor: bg }]}>
    <Text style={[s.badgeText, { color }]}>{String(label || '').toUpperCase()}</Text>
  </View>
);

// ─── Default Filters ──────────────────────────────────────────────
const DEFAULT_FILTERS = {
  product: '', batchNo: '', purchaseEntry: '', supplier: '',
  rackNo: '', expiryStatus: '', paymentStatus: '', paymentType: '',
  fromDate: '', toDate: '',
};

// ─── Filter Modal ─────────────────────────────────────────────────
const FilterModal = ({ visible, onClose, filters, onApply, filterOptions }) => {
  const [local, setLocal] = useState(filters);
  const f = (key, val) => setLocal(p => ({ ...p, [key]: val }));

  useEffect(() => { setLocal(filters); }, [filters]);

  const handleApply = () => { onApply(local); onClose(); };
  const handleReset = () => { setLocal(DEFAULT_FILTERS); onApply(DEFAULT_FILTERS); onClose(); };

  const ChipRow = ({ label, options, filterKey }) => (
    <>
      <Text style={s.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 4 }}>
        <View style={{ flexDirection: 'row', gap: 6, paddingVertical: 4 }}>
          {options.map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[s.chip, local[filterKey] === opt.key && s.chipActive]}
              onPress={() => f(filterKey, opt.key)}>
              <Text style={[s.chipText, local[filterKey] === opt.key && s.chipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={[s.sheet, { maxHeight: '90%' }]}>
          <View style={s.sheetHeader}>
            <Text style={s.sheetTitle}>Filter Batches</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={20} color={GREY} />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ paddingHorizontal: 20 }} keyboardShouldPersistTaps="handled">
            <ChipRow label="Expiry Status"   options={EXPIRY_OPTIONS}     filterKey="expiryStatus"  />
            <ChipRow label="Payment Status"  options={PAYMENT_ST_OPTIONS} filterKey="paymentStatus" />
            <ChipRow label="Payment Type"    options={PAYMENT_TY_OPTIONS} filterKey="paymentType"   />

            {[
              { label: 'Product Name', key: 'product',       placeholder: 'Search product…' },
              { label: 'Batch No.',    key: 'batchNo',       placeholder: 'e.g. B001' },
              { label: 'Supplier',     key: 'supplier',      placeholder: 'Supplier name…'  },
              { label: 'Rack No.',     key: 'rackNo',        placeholder: 'e.g. R01' },
              { label: 'From Date',    key: 'fromDate',      placeholder: 'YYYY-MM-DD' },
              { label: 'To Date',      key: 'toDate',        placeholder: 'YYYY-MM-DD' },
            ].map(row => (
              <View key={row.key}>
                <Text style={s.label}>{row.label}</Text>
                <TextInput
                  style={s.input}
                  placeholder={row.placeholder}
                  placeholderTextColor="#aaa"
                  value={local[row.key] || ''}
                  onChangeText={v => f(row.key, v)}
                />
              </View>
            ))}
          </ScrollView>

          <View style={s.modalFooter}>
            <TouchableOpacity style={s.cancelBtn} onPress={handleReset}>
              <Text style={s.cancelBtnText}>Reset All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.submitBtn} onPress={handleApply}>
              <Filter size={14} color={WHITE} />
              <Text style={s.submitBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ─── Batch Detail Sheet ───────────────────────────────────────────
const DetailSheet = ({ visible, onClose, batch }) => {
  if (!batch) return null;

  const rows = [
    { label: 'Batch No.',        value: batch.batchNo        || '—' },
    { label: 'Product',          value: batch.productName    || batch.name || '—' },
    { label: 'SKU',              value: batch.sku            || '—' },
    { label: 'Purchase No.',     value: batch.purchaseNumber || '—' },
    { label: 'Invoice No.',      value: batch.invoiceNumber  || '—' },
    { label: 'Supplier',         value: batch.supplier?.name || '—' },
    { label: 'Inward Date',      value: fmtDate(batch.inwardDate || batch.createdAt) },
    { label: 'Expiry Status',    value: batch.expiryStatus   || '—' },
    { label: 'Payment Status',   value: batch.paymentStatus  || '—' },
    { label: 'Payment Type',     value: batch.paymentType    || '—' },
    { label: 'Due Amount',       value: batch.dueAmount != null ? `₹${fmt(batch.dueAmount)}` : '—' },
    { label: 'Rack No.',         value: batch.rackNo         || '—' },
    { label: 'Purchased Qty',    value: batch.purchasedQty   != null ? String(batch.purchasedQty)   : '—' },
    { label: 'Available Qty',    value: batch.availableQty   != null ? String(batch.availableQty)   : '—' },
    { label: 'Purchase Price ₹', value: `₹${fmt(batch.purchasePrice)}`  },
    { label: 'MRP ₹',            value: `₹${fmt(batch.mrp)}`            },
    { label: 'Distributor ₹',   value: `₹${fmt(batch.distributorPrice)}` },
    { label: 'Retailer ₹',      value: `₹${fmt(batch.retailerPrice)}`   },
    { label: 'Walk-in ₹',       value: `₹${fmt(batch.walkinPrice)}`     },
    { label: 'GST %',            value: batch.gst != null ? `${batch.gst}%` : '—' },
    { label: 'Created By',       value: batch.createdBy      || '—' },
    { label: 'Created At',       value: fmtDate(batch.createdAt)         },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={[s.sheet, { maxHeight: '88%' }]}>
          <View style={s.sheetHeader}>
            <View style={{ gap: 2, flex: 1 }}>
              <Text style={s.sheetTitle} numberOfLines={1}>{batch.productName || batch.name}</Text>
              {batch.batchNo ? <Text style={{ fontSize: 12, color: GREY }}>Batch: {batch.batchNo}</Text> : null}
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={20} color={GREY} />
            </TouchableOpacity>
          </View>

          {/* Status badges */}
          <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingVertical: 10 }}>
            <Badge label={batch.paymentStatus || 'unpaid'} color={payColor(batch.paymentStatus)} bg={payBg(batch.paymentStatus)} />
            {batch.expiryStatus && <Badge label={batch.expiryStatus} color={expiryColor(batch.expiryStatus)} bg={expiryBg(batch.expiryStatus)} />}
          </View>

          <ScrollView style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            <View style={s.detailGrid}>
              {rows.map(row => (
                <View key={row.label} style={s.detailItem}>
                  <Text style={s.detailLabel}>{row.label}</Text>
                  <Text style={s.detailValue}>{row.value}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// ─── Batch Card ───────────────────────────────────────────────────
const BatchCard = React.memo(({ item, onPress }) => {
  const availQty = item.availableQty ?? 0;
  const isLow    = availQty < 5;

  return (
    <TouchableOpacity style={s.card} onPress={() => onPress(item)} activeOpacity={0.85}>
      {/* Left */}
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={s.cardProduct} numberOfLines={1}>{item.productName || item.name}</Text>
        {item.batchNo ? <Text style={s.cardMeta}>Batch: {item.batchNo}</Text> : null}
        <Text style={s.cardMeta}>
          {item.supplier?.name || '—'}  ·  {fmtDate(item.inwardDate || item.createdAt)}
        </Text>
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
          <Badge label={item.paymentStatus || 'unpaid'} color={payColor(item.paymentStatus)} bg={payBg(item.paymentStatus)} />
          {item.expiryStatus && item.expiryStatus !== 'no_expiry' && (
            <Badge label={item.expiryStatus} color={expiryColor(item.expiryStatus)} bg={expiryBg(item.expiryStatus)} />
          )}
        </View>
      </View>

      {/* Right */}
      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        <Text style={s.cardPrice}>₹{fmt(item.purchasePrice)}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={[s.qtyDot, { backgroundColor: isLow ? '#C62828' : '#2E7D32' }]} />
          <Text style={[s.cardQty, { color: isLow ? '#C62828' : '#2E7D32' }]}>
            {availQty} avail
          </Text>
        </View>
        {item.rackNo ? <Text style={s.cardMeta}>Rack: {item.rackNo}</Text> : null}
      </View>
    </TouchableOpacity>
  );
});

// ─── Main Screen ──────────────────────────────────────────────────
const DataExplorerScreen = () => {
  const dispatch = useDispatch();
  const { stockBatches, stockBatchesLoading, stockBatchesError, stockBatchesTotalPages } =
    useSelector(s => s.purchase);

  const [search,      setSearch]      = useState('');
  const [filters,     setFilters]     = useState(DEFAULT_FILTERS);
  const [page,        setPage]        = useState(1);
  const [showFilter,  setShowFilter]  = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [refreshing,  setRefreshing]  = useState(false);

  const activeFilterCount = useMemo(() =>
    Object.values(filters).filter(v => v !== '').length, [filters]);

  // ── Build query params and load
  const buildParams = useCallback((pg = 1, f = filters, q = search) => ({
    ...f,
    search: q,
    page:   pg,
    limit:  PAGE_SIZE,
  }), [filters, search]);

  const load = useCallback((pg = 1, f = filters, q = search) => {
    dispatch(fetchStockBatches(buildParams(pg, f, q)));
  }, [dispatch, buildParams]);

  useEffect(() => {
    dispatch(fetchFilterOptions());
    return () => dispatch(clearStockBatches());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      load(1, filters, search);
    }, 350);
    return () => clearTimeout(timer);
  }, [search, filters]);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await dispatch(fetchStockBatches(buildParams(1)));
    setRefreshing(false);
  };

  const handleApplyFilters = useCallback(newFilters => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleLoadMore = () => {
    if (page < stockBatchesTotalPages && !stockBatchesLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      load(nextPage, filters, search);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['bottom']}>
      <Header title="Data Explorer" />

      {/* ── Search + Filter bar ── */}
      <View style={s.topBar}>
        <View style={s.searchWrapper}>
          <Search size={14} color="#aaa" />
          <TextInput
            style={s.searchInput}
            placeholder="Search product, batch, supplier…"
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

        <TouchableOpacity style={[s.filterBtn, activeFilterCount > 0 && s.filterBtnActive]} onPress={() => setShowFilter(true)}>
          <Filter size={15} color={activeFilterCount > 0 ? WHITE : GREY} />
          {activeFilterCount > 0 && (
            <View style={s.filterCount}>
              <Text style={s.filterCountText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={s.iconBtn} onPress={() => { setSearch(''); setFilters(DEFAULT_FILTERS); setPage(1); load(1, DEFAULT_FILTERS, ''); }}>
          <RefreshCw size={15} color={GREY} />
        </TouchableOpacity>
      </View>

      {/* ── Active filter chips ── */}
      {activeFilterCount > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.activeChipsRow}>
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', paddingRight: 12 }}>
            {Object.entries(filters).filter(([, v]) => v !== '').map(([key, val]) => (
              <TouchableOpacity
                key={key}
                style={s.activeChip}
                onPress={() => handleApplyFilters({ ...filters, [key]: '' })}>
                <Text style={s.activeChipText}>{key}: {val}</Text>
                <X size={10} color={ACCENT} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* ── Stats row ── */}
      <View style={s.statsRow}>
        <Database size={13} color={GREY} />
        <Text style={s.statsText}>
          {stockBatches.length} batch{stockBatches.length !== 1 ? 'es' : ''} loaded
          {stockBatchesTotalPages > 1 ? ` · Page ${page}/${stockBatchesTotalPages}` : ''}
        </Text>
      </View>

      {/* ── List ── */}
      {stockBatchesLoading && stockBatches.length === 0 ? (
        <ActivityIndicator size="large" color={ACCENT} style={{ marginTop: 40 }} />
      ) : stockBatchesError && stockBatches.length === 0 ? (
        <View style={s.centerBox}>
          <Text style={s.errorText}>{stockBatchesError}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={() => load()}>
            <Text style={s.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={stockBatches}
          keyExtractor={(item, i) => item._id || String(i)}
          contentContainerStyle={{ padding: 12, paddingBottom: 30 }}
          renderItem={({ item }) => <BatchCard item={item} onPress={setSelectedBatch} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[ACCENT]} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            stockBatchesLoading && stockBatches.length > 0
              ? <ActivityIndicator size="small" color={ACCENT} style={{ marginTop: 10 }} />
              : page < stockBatchesTotalPages
                ? (
                  <TouchableOpacity style={s.loadMoreBtn} onPress={handleLoadMore}>
                    <Text style={s.loadMoreText}>Load More</Text>
                    <ChevronDown size={14} color={ACCENT} />
                  </TouchableOpacity>
                )
                : null
          }
          ListEmptyComponent={
            !stockBatchesLoading && (
              <View style={s.centerBox}>
                <Database size={40} color="#ccc" />
                <Text style={s.emptyText}>
                  {activeFilterCount > 0 || search
                    ? 'No batches match the current filters.'
                    : 'No stock batches found.'}
                </Text>
                {(activeFilterCount > 0 || search) && (
                  <TouchableOpacity style={s.clearBtn}
                    onPress={() => { setSearch(''); setFilters(DEFAULT_FILTERS); }}>
                    <Text style={s.clearBtnText}>Clear Filters</Text>
                  </TouchableOpacity>
                )}
              </View>
            )
          }
        />
      )}

      {/* ── Filter Modal ── */}
      <FilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        onApply={handleApplyFilters}
        filterOptions={{}}
      />

      {/* ── Detail Sheet ── */}
      <DetailSheet
        visible={!!selectedBatch}
        onClose={() => setSelectedBatch(null)}
        batch={selectedBatch}
      />
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchWrapper: {
    flex: 1,
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
  filterBtn: {
    backgroundColor: WHITE,
    padding: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    position: 'relative',
  },
  filterBtnActive: { backgroundColor: ACCENT },
  filterCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#212121',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterCountText: { color: WHITE, fontSize: 9, fontWeight: '700' },
  iconBtn: {
    backgroundColor: WHITE,
    padding: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },

  activeChipsRow: { paddingLeft: 12, marginBottom: 4, maxHeight: 42 },
  activeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3F3',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    gap: 5,
  },
  activeChipText: { fontSize: 11, color: ACCENT, fontWeight: '600' },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 6,
    gap: 6,
  },
  statsText: { fontSize: 12, color: GREY, fontWeight: '500' },

  card: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    borderLeftWidth: 4,
    borderLeftColor: ACCENT,
    gap: 10,
  },
  cardProduct: { fontSize: 13, fontWeight: '700', color: '#212121' },
  cardMeta:    { fontSize: 11, color: GREY },
  cardPrice:   { fontSize: 14, fontWeight: '800', color: '#212121' },
  cardQty:     { fontSize: 12, fontWeight: '700' },
  qtyDot:      { width: 7, height: 7, borderRadius: 4 },

  badge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 },
  badgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.3 },

  centerBox: { alignItems: 'center', marginTop: 60, gap: 12, paddingHorizontal: 20 },
  emptyText: { color: '#aaa', fontSize: 14, textAlign: 'center' },
  errorText: { color: ACCENT, fontSize: 14, textAlign: 'center' },
  retryBtn:  { backgroundColor: ACCENT, borderRadius: 10, paddingHorizontal: 24, paddingVertical: 10 },
  retryText: { color: WHITE, fontSize: 14, fontWeight: '700' },
  clearBtn:  { borderWidth: 1, borderColor: ACCENT, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 8 },
  clearBtnText: { color: ACCENT, fontSize: 13, fontWeight: '700' },

  loadMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WHITE,
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 4,
    gap: 6,
    elevation: 1,
  },
  loadMoreText: { fontSize: 13, color: ACCENT, fontWeight: '700' },

  // Detail
  detailGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 16, paddingVertical: 10 },
  detailItem:  { width: '47%' },
  detailLabel: { fontSize: 10, fontWeight: '700', color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 3 },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#212121' },

  // Shared
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: WHITE, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%', borderTopWidth: 3, borderTopColor: ACCENT },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  sheetTitle: { fontSize: 16, fontWeight: '800', color: '#212121', flex: 1 },
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

export default DataExplorerScreen;