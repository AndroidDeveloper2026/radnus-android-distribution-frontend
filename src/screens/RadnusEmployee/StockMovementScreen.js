// src/screens/RadnusEmployee/StockMovementScreen.js
import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import { fetchProducts } from '../../services/features/products/productSlice';
import { fetchInvoices } from '../../services/features/retailer/invoiceSlice';
import styles from './StockMovementStyle';

// ─── Helpers (pure, hoisted out of component for perf) ────────────
const formatValue = (num) => {
  const value = Number(num);
  if (isNaN(value)) return '₹0';
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toFixed(2)}`;
};

const parseDate = (dateValue) => {
  if (!dateValue) return new Date();
  if (dateValue instanceof Date && !isNaN(dateValue)) return dateValue;
  if (typeof dateValue === 'string') {
    const parsed = new Date(dateValue);
    return !isNaN(parsed) ? parsed : new Date();
  }
  if (typeof dateValue === 'object' && dateValue.$date) {
    const parsed = new Date(dateValue.$date);
    return !isNaN(parsed) ? parsed : new Date();
  }
  return new Date();
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const formatTime = (date) =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const getNum = (obj, key, fallback = 0) => {
  if (obj?.[key] !== undefined && obj[key] !== null) {
    const val = Number(obj[key]);
    if (!isNaN(val)) return val;
  }
  return fallback;
};

const getStr = (obj, key, fallback = '') =>
  obj?.[key] !== undefined && obj[key] !== null ? String(obj[key]).trim() : fallback;

const getId = (obj) => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  if (obj.$oid) return obj.$oid;
  return obj._id || obj.id || '';
};

// ─── Constants ──────────────────────────────────────────────────
const PERIOD_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'thisWeek', label: 'This Week' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'custom', label: 'Custom' },
];

const ITEMS_PER_PAGE = 10;

const getDateRangeFromPeriod = (period) => {
  const now = new Date();
  const start = new Date();
  const end = new Date();
  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'yesterday':
      start.setDate(now.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(now.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;
    case 'last7days':
      start.setDate(now.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'thisWeek':
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    case 'thisMonth':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'lastMonth':
      start.setMonth(now.getMonth() - 1, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(now.getMonth(), 0);
      end.setHours(23, 59, 59, 999);
      break;
    default:
      return null;
  }
  return { fromDate: start, toDate: end };
};

// ─── Memoized sub-components (prevents re-render of whole list) ──
const PeriodChip = memo(({ option, active, onPress }) => (
  <TouchableOpacity
    style={[styles.periodChip, active && styles.periodChipActive]}
    onPress={onPress}
  >
    <Text style={[styles.periodChipText, active && styles.periodChipTextActive]}>
      {option.label}
    </Text>
  </TouchableOpacity>
));

const DateChip = memo(({ date, active, onPress }) => (
  <TouchableOpacity
    style={[styles.dateChip, active && styles.dateChipActive]}
    onPress={onPress}
  >
    <Text style={[styles.dateChipText, active && styles.dateChipTextActive]}>{date}</Text>
  </TouchableOpacity>
));

const MovementItemRow = memo(({ item, activeTab }) => (
  <View style={styles.movementItem}>
    <View style={[styles.itemIcon, activeTab === 'INWARD' ? styles.iconInward : styles.iconOutward]}>
      <Text style={styles.itemIconText}>{activeTab === 'INWARD' ? '↑' : '↓'}</Text>
    </View>
    <View style={styles.itemDetails}>
      <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
      <View style={styles.itemMeta}>
        <Text style={styles.metaChip}>SKU: {item.sku}</Text>
        {item.invoiceNumber && item.invoiceNumber !== 'N/A' && (
          <Text style={styles.metaChip}>INV: {item.invoiceNumber}</Text>
        )}
        {item.customerName && item.customerName !== 'N/A' && (
          <Text style={styles.metaChip}>👤 {item.customerName}</Text>
        )}
        {item.salesperson && item.salesperson !== 'N/A' && (
          <Text style={styles.metaChip}>🧑‍💼 {item.salesperson}</Text>
        )}
        <Text style={styles.metaChip}>🕐 {item.time}</Text>
      </View>
    </View>
    <View style={styles.itemQty}>
      <Text style={[styles.qtyValue, activeTab === 'INWARD' ? styles.positive : styles.negative]}>
        {activeTab === 'INWARD' ? '+' : '-'}{item.qty}
      </Text>
      <Text style={styles.unitPrice}>{formatValue(item.price)}</Text>
      <Text style={styles.totalVal}>{formatValue(item.totalValue)}</Text>
    </View>
  </View>
));

const MovementGroup = memo(({ group, activeTab }) => (
  <View style={styles.group}>
    <View style={styles.groupHeader}>
      <View style={styles.groupDateRow}>
        <Text style={styles.groupDateIcon}>📅</Text>
        <Text style={styles.groupDateText}>{group.date}</Text>
      </View>
      <View style={styles.groupStats}>
        <Text style={styles.groupQty}>📦 {group.totalQty} units</Text>
        <Text style={styles.groupValue}>{formatValue(group.totalValue)}</Text>
      </View>
    </View>
    {group.items.map((item, idx) => (
      <MovementItemRow key={`${item.id}_${idx}`} item={item} activeTab={activeTab} />
    ))}
  </View>
));

// ─── StockMovementScreen ──────────────────────────────────────────
const StockMovementScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState(route?.params?.initialTab === 'OUTWARD' ? 'OUTWARD' : 'INWARD');
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [periodFilter, setPeriodFilter] = useState('all');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [fromDateText, setFromDateText] = useState('');
  const [toDateText, setToDateText] = useState('');

  const { list: products = [], loading: productsLoading } =
    useSelector((state) => state.products) || {};
  const { data: invoices = [], loading: invoicesLoading } =
    useSelector((state) => state.invoice) || {};

  const loadData = useCallback(async () => {
    await Promise.all([
      dispatch(fetchProducts()),
      dispatch(fetchInvoices({ filter: 'all' })),
    ]);
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // ─── Build inward data from products ────────────────────────────
  const inwardData = useMemo(() => {
    if (!products.length) return [];
    return products
      .map((product) => {
        const createdAt = parseDate(product.createdAt);
        const qty = getNum(product, 'moq', 0);
        const price = getNum(product, 'walkinPrice', 0);
        return {
          id: `inward_${getId(product._id)}`,
          type: 'INWARD',
          name: getStr(product, 'name'),
          sku: getStr(product, 'sku'),
          qty,
          price,
          date: createdAt,
          dateStr: formatDate(createdAt),
          time: formatTime(createdAt),
          totalValue: qty * price,
        };
      })
      .sort((a, b) => a.date - b.date);
  }, [products]);

  // ─── Build outward data from invoices ───────────────────────────
  const outwardData = useMemo(() => {
    if (!invoices.length) return [];
    const outward = [];
    invoices.forEach((invoice) => {
      const invDate = parseDate(invoice.createdAt);
      (invoice.items || []).forEach((item) => {
        outward.push({
          id: `outward_${getId(invoice._id)}_${getId(item.productId)}`,
          type: 'OUTWARD',
          name: getStr(item, 'name', 'N/A'),
          sku: getStr(item, 'sku', 'N/A'),
          qty: getNum(item, 'qty'),
          price: getNum(item, 'price'),
          date: invDate,
          dateStr: formatDate(invDate),
          time: formatTime(invDate),
          invoiceNumber: getStr(invoice, 'invoiceNumber', 'N/A'),
          customerName: getStr(invoice, 'customerName', 'N/A'),
          salesperson: getStr(invoice, 'salesperson', 'N/A'),
          totalValue: getNum(item, 'qty') * getNum(item, 'price'),
        });
      });
    });
    return outward.sort((a, b) => a.date - b.date);
  }, [invoices]);

  // ─── Filtering ───────────────────────────────────────────────────
  const filterByDateRange = useCallback(
    (data) => {
      let fromDate = null;
      let toDate = null;
      if (periodFilter === 'custom') {
        fromDate = fromDateText ? new Date(fromDateText) : null;
        toDate = toDateText ? new Date(toDateText) : null;
        if (toDate) toDate.setHours(23, 59, 59, 999);
      } else if (periodFilter !== 'all') {
        const range = getDateRangeFromPeriod(periodFilter);
        if (range) { fromDate = range.fromDate; toDate = range.toDate; }
      }
      if (!fromDate && !toDate) return data;
      return data.filter((item) => {
        const d = new Date(item.date);
        if (isNaN(d)) return true;
        if (fromDate && d < fromDate) return false;
        if (toDate && d > toDate) return false;
        return true;
      });
    },
    [periodFilter, fromDateText, toDateText],
  );

  const filterBySearch = useCallback(
    (data) => {
      if (!searchTerm) return data;
      const term = searchTerm.toLowerCase();
      return data.filter(
        (item) =>
          item.name?.toLowerCase().includes(term) ||
          item.sku?.toLowerCase().includes(term) ||
          item.invoiceNumber?.toLowerCase().includes(term) ||
          item.customerName?.toLowerCase().includes(term) ||
          item.salesperson?.toLowerCase().includes(term),
      );
    },
    [searchTerm],
  );

  const filteredInward = useMemo(() => {
    let d = filterBySearch(filterByDateRange(inwardData));
    if (selectedDate) d = d.filter((i) => i.dateStr === selectedDate);
    return d;
  }, [inwardData, filterByDateRange, filterBySearch, selectedDate]);

  const filteredOutward = useMemo(() => {
    let d = filterBySearch(filterByDateRange(outwardData));
    if (selectedDate) d = d.filter((i) => i.dateStr === selectedDate);
    return d;
  }, [outwardData, filterByDateRange, filterBySearch, selectedDate]);

  const groupData = useCallback((data) => {
    const groups = {};
    data.forEach((item) => {
      if (!groups[item.dateStr]) {
        groups[item.dateStr] = { date: item.dateStr, items: [], totalQty: 0, totalValue: 0 };
      }
      groups[item.dateStr].items.push(item);
      groups[item.dateStr].totalQty += item.qty;
      groups[item.dateStr].totalValue += item.totalValue;
    });
    return Object.values(groups).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, []);

  const groupedInward = useMemo(() => groupData(filteredInward), [filteredInward, groupData]);
  const groupedOutward = useMemo(() => groupData(filteredOutward), [filteredOutward, groupData]);

  const currentData = activeTab === 'INWARD' ? groupedInward : groupedOutward;
  const totalPages = Math.max(1, Math.ceil(currentData.length / ITEMS_PER_PAGE));
  const paginatedData = useMemo(
    () => currentData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [currentData, currentPage],
  );

  const totalQty = useMemo(() => currentData.reduce((s, g) => s + g.totalQty, 0), [currentData]);
  const totalValue = useMemo(() => currentData.reduce((s, g) => s + g.totalValue, 0), [currentData]);

  const uniqueDates = useMemo(() => {
    const dates = new Set();
    inwardData.forEach((i) => dates.add(i.dateStr));
    outwardData.forEach((i) => dates.add(i.dateStr));
    return Array.from(dates).sort((a, b) => new Date(a) - new Date(b));
  }, [inwardData, outwardData]);

  const resetFilters = useCallback(() => {
    setPeriodFilter('all');
    setFromDateText('');
    setToDateText('');
    setShowDateFilter(false);
    setSearchTerm('');
    setSelectedDate(null);
    setCurrentPage(1);
  }, []);

  const hasActiveFilters =
    periodFilter !== 'all' || !!fromDateText || !!toDateText || !!searchTerm || !!selectedDate;

  const loading = productsLoading || invoicesLoading;

  const switchTab = useCallback((tab) => {
    setActiveTab(tab);
    setSelectedDate(null);
    setCurrentPage(1);
  }, []);

  const handlePeriodSelect = useCallback((value) => {
    setPeriodFilter(value);
    setShowDateFilter(value === 'custom');
    if (value !== 'custom') { setFromDateText(''); setToDateText(''); }
    setCurrentPage(1);
  }, []);

  const handleDateSelect = useCallback((date) => {
    setSelectedDate((prev) => (prev === date ? null : date));
    setCurrentPage(1);
  }, []);

  // ─── List header (everything above the groups) ───────────────────
  const ListHeader = useCallback(() => (
    <View>
      {/* Tabs */}
      <View style={styles.tabRow}>
        {['INWARD', 'OUTWARD'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            onPress={() => switchTab(tab)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>
              {tab === 'INWARD' ? '↑ Inward' : '↓ Outward'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder={`Search product, SKU${activeTab === 'OUTWARD' ? ', invoice, customer...' : '...'}`}
          placeholderTextColor="#a8a8a8"
          value={searchTerm}
          onChangeText={(v) => { setSearchTerm(v); setCurrentPage(1); }}
        />
        {searchTerm ? (
          <TouchableOpacity onPress={() => setSearchTerm('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Period filter */}
      <View style={styles.filterRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={PERIOD_OPTIONS}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <PeriodChip
              option={item}
              active={periodFilter === item.value}
              onPress={() => handlePeriodSelect(item.value)}
            />
          )}
        />
        {hasActiveFilters && (
          <TouchableOpacity style={styles.clearAllBtn} onPress={resetFilters}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Custom date range */}
      {showDateFilter && (
        <View style={styles.customDateRow}>
          <TextInput
            style={styles.dateInput}
            placeholder="From (YYYY-MM-DD)"
            placeholderTextColor="#a8a8a8"
            value={fromDateText}
            onChangeText={setFromDateText}
          />
          <Text style={styles.dateSeparator}>→</Text>
          <TextInput
            style={styles.dateInput}
            placeholder="To (YYYY-MM-DD)"
            placeholderTextColor="#a8a8a8"
            value={toDateText}
            onChangeText={setToDateText}
          />
        </View>
      )}

      {/* Quick date chips */}
      {uniqueDates.length > 0 && (
        <View style={styles.quickDateSection}>
          <Text style={styles.quickDateLabel}>Quick Date:</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={uniqueDates.slice(0, 8)}
            keyExtractor={(d) => d}
            renderItem={({ item: date }) => (
              <DateChip date={date} active={selectedDate === date} onPress={() => handleDateSelect(date)} />
            )}
            ListFooterComponent={
              selectedDate ? (
                <TouchableOpacity style={styles.clearDateChip} onPress={() => setSelectedDate(null)}>
                  <Text style={styles.clearDateChipText}>✕ Clear</Text>
                </TouchableOpacity>
              ) : null
            }
          />
        </View>
      )}

      {/* Summary */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total {activeTab === 'INWARD' ? 'Added' : 'Sold'}</Text>
          <Text style={styles.summaryValue}>{totalQty.toLocaleString()} units</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Value</Text>
          <Text style={styles.summaryValue}>{formatValue(totalValue)}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Days</Text>
          <Text style={styles.summaryValue}>{currentData.length}</Text>
        </View>
      </View>
    </View>
  ), [
    activeTab, searchTerm, periodFilter, hasActiveFilters, showDateFilter,
    fromDateText, toDateText, uniqueDates, selectedDate, totalQty, totalValue,
    currentData.length, switchTab, handlePeriodSelect, handleDateSelect, resetFilters,
  ]);

  const ListEmpty = useCallback(() => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📦</Text>
      <Text style={styles.emptyTitle}>No {activeTab.toLowerCase()} records found</Text>
      <Text style={styles.emptySubtitle}>
        {hasActiveFilters
          ? 'Try changing your filters to see more results'
          : `When you ${activeTab === 'INWARD' ? 'add new products' : 'create invoices'}, they will appear here`}
      </Text>
    </View>
  ), [activeTab, hasActiveFilters]);

  const ListFooter = useCallback(() => {
    if (totalPages <= 1) return null;
    return (
      <View style={styles.pagination}>
        <TouchableOpacity
          style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
          onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          <Text style={styles.pageBtnText}>‹ Previous</Text>
        </TouchableOpacity>
        <Text style={styles.pageInfo}>Page {currentPage} of {totalPages}</Text>
        <TouchableOpacity
          style={[styles.pageBtn, currentPage === totalPages && styles.pageBtnDisabled]}
          onPress={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          <Text style={styles.pageBtnText}>Next ›</Text>
        </TouchableOpacity>
      </View>
    );
  }, [totalPages, currentPage]);

  const renderGroup = useCallback(
    ({ item }) => <MovementGroup group={item} activeTab={activeTab} />,
    [activeTab],
  );

  const keyExtractor = useCallback((item) => item.date, []);

  return (
    <View style={styles.container}>
      <Header title="Stock Movement" showBackArrow navigation={navigation} />

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#c0392b" />
          <Text style={styles.loadingText}>Loading stock movement data...</Text>
        </View>
      ) : (
        <FlatList
          data={paginatedData}
          keyExtractor={keyExtractor}
          renderItem={renderGroup}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ListEmpty}
          ListFooterComponent={ListFooter}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 16 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#c0392b']} tintColor="#c0392b" />
          }
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={7}
          removeClippedSubviews
        />
      )}
    </View>
  );
};

export default StockMovementScreen;