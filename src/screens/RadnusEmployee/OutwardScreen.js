import React, { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  FlatList,
  InteractionManager,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Search,
  X,
  Calendar,
  Package,
  ArrowDown,
  User,
  UserCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
  Receipt,
} from 'lucide-react-native';
import Header from '../../components/Header';
import { fetchInvoices } from '../../services/features/retailer/invoiceSlice';
import styles, { COLORS } from './StockMovementStyle';

// ─── HELPERS ──────────────────────────────────────────────────────────────
const formatValue = (num) => {
  const value = Number(num);
  if (isNaN(value)) return '₹0';
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toFixed(0)}`;
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

const formatDate = (date) => {
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, '0')}-${d.toLocaleString('en', { month: 'short' })}-${d.getFullYear()}`;
};

const formatTime = (date) => {
  const d = new Date(date);
  const hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  return `${hours % 12 || 12}:${minutes} ${ampm}`;
};

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

// ─── Constants ──────────────────────────────────────────────────────────────
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
const SEARCH_DEBOUNCE_MS = 250;

// A single stable empty-array reference. Using `|| []` inline inside a
// useSelector creates a BRAND NEW array on every single store update (even
// unrelated ones), which defeats useSelector's ability to bail out of a
// re-render and forces this whole screen (search box, filters, list) to
// re-render more than necessary. Reusing one reference fixes that.
const EMPTY_ARRAY = [];

// Colors array for RefreshControl — hoisted so it isn't rebuilt every render.
const REFRESH_COLORS = [COLORS.red];

// ─── Precomputed style arrays ──────────────────────────────────────────────
// Building `[styles.a, cond && styles.b]` inline inside render creates a NEW
// array every time, even when `cond` hasn't changed. Since these arrays are
// passed as props to memo()'d children, React sees "a different prop" and
// re-renders the child anyway — silently defeating memo(). Precomputing both
// variants once and picking between the same two stable references fixes it.
const PERIOD_CHIP_INACTIVE = [styles.periodChip];
const PERIOD_CHIP_ACTIVE = [styles.periodChip, styles.periodChipActive];
const PERIOD_CHIP_TEXT_INACTIVE = [styles.periodChipText];
const PERIOD_CHIP_TEXT_ACTIVE = [styles.periodChipText, styles.periodChipTextActive];

const DATE_CHIP_INACTIVE = [styles.dateChip];
const DATE_CHIP_ACTIVE = [styles.dateChip, styles.dateChipActive];
const DATE_CHIP_TEXT_INACTIVE = [styles.dateChipText];
const DATE_CHIP_TEXT_ACTIVE = [styles.dateChipText, styles.dateChipTextActive];

const ICON_OUTWARD_STYLE = [styles.itemIcon, styles.iconOutward];
const QTY_NEGATIVE_STYLE = [styles.qtyValue, styles.negative];

const PAGE_BTN_ENABLED = [styles.pageBtn];
const PAGE_BTN_DISABLED = [styles.pageBtn, styles.pageBtnDisabled];

// The real cause of ongoing lag: a "group" (one calendar day) is a SINGLE row
// inside the outer FlatList. FlatList only virtualizes at the row level — so
// if one day has 200+ invoice line items, that entire day renders as one
// giant, non-virtualized block the instant it scrolls into view. That's the
// actual jank. We cap how many items render per day up front and let the
// user expand a day on demand, so no single row can ever be huge.
const GROUP_ITEM_INITIAL_CAP = 20;
const SHOW_MORE_BUTTON_STYLE = { paddingVertical: 10, alignItems: 'center' };
const SHOW_MORE_TEXT_STYLE = { color: COLORS.red, fontWeight: '600', fontSize: 13 };

// ─── Date range function ──────────────────────────────────────────────────────
const getDateRangeFromPeriod = (period, fromDateText, toDateText) => {
  if (period === 'custom') {
    const fromDate = fromDateText ? new Date(fromDateText) : null;
    let toDate = toDateText ? new Date(toDateText) : null;
    if (toDate) toDate.setHours(23, 59, 59, 999);
    return { fromDate, toDate };
  }

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
      return { fromDate: null, toDate: null };
  }
  return { fromDate: start, toDate: end };
};

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

const PeriodChip = memo(({ option, active, onPress }) => (
  <TouchableOpacity
    style={active ? PERIOD_CHIP_ACTIVE : PERIOD_CHIP_INACTIVE}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={active ? PERIOD_CHIP_TEXT_ACTIVE : PERIOD_CHIP_TEXT_INACTIVE}>
      {option.label}
    </Text>
  </TouchableOpacity>
));

const DateChip = memo(({ date, active, onPress }) => (
  <TouchableOpacity
    style={active ? DATE_CHIP_ACTIVE : DATE_CHIP_INACTIVE}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={active ? DATE_CHIP_TEXT_ACTIVE : DATE_CHIP_TEXT_INACTIVE}>
      {date}
    </Text>
  </TouchableOpacity>
));

// ─── MovementItemRow ─────────────────────────────────────────────────────────────
const MovementItemRow = memo(({ item }) => {
  return (
    <View style={styles.movementItem}>
      <View style={ICON_OUTWARD_STYLE}>
        <ArrowDown size={16} color={COLORS.red} />
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.itemMeta}>
          <Text style={styles.metaChip}>SKU: {item.sku}</Text>
          {item.invoiceNumber && item.invoiceNumber !== 'N/A' && (
            <View style={styles.metaInline}>
              <Receipt size={10} color={COLORS.subText} />
              <Text style={styles.metaChip}> {item.invoiceNumber}</Text>
            </View>
          )}
          {item.customerName && item.customerName !== 'N/A' && (
            <View style={styles.metaInline}>
              <User size={10} color={COLORS.subText} />
              <Text style={styles.metaChip}> {item.customerName}</Text>
            </View>
          )}
          {item.salesperson && item.salesperson !== 'N/A' && (
            <View style={styles.metaInline}>
              <UserCircle2 size={10} color={COLORS.subText} />
              <Text style={styles.metaChip}> {item.salesperson}</Text>
            </View>
          )}
          <View style={styles.metaInline}>
            <Clock size={10} color={COLORS.subText} />
            <Text style={styles.metaChip}> {item.time}</Text>
          </View>
        </View>
      </View>
      <View style={styles.itemQty}>
        <Text style={QTY_NEGATIVE_STYLE}>-{item.qty}</Text>
        <Text style={styles.unitPrice}>{formatValue(item.price)}</Text>
        <Text style={styles.totalVal}>{formatValue(item.totalValue)}</Text>
      </View>
    </View>
  );
});

// ─── MovementGroup ──────────────────────────────────────────────────────────────
const MovementGroup = memo(({ group }) => {
  const [expanded, setExpanded] = useState(false);
  const displayItems = expanded ? group.items : group.items.slice(0, GROUP_ITEM_INITIAL_CAP);
  const remaining = group.items.length - displayItems.length;
  const handleShowMore = useCallback(() => setExpanded(true), []);

  return (
    <View style={styles.group}>
      <View style={styles.groupHeader}>
        <View style={styles.groupDateRow}>
          <Calendar size={14} color={COLORS.redDark} />
          <Text style={styles.groupDateText}>{group.date}</Text>
        </View>
        <View style={styles.groupStats}>
          <View style={styles.metaInline}>
            <Package size={12} color={COLORS.subText} />
            <Text style={styles.groupQty}> {group.totalQty} units</Text>
          </View>
          <Text style={styles.groupValue}>{formatValue(group.totalValue)}</Text>
        </View>
      </View>
      {displayItems.map((item, idx) => (
        <MovementItemRow key={`${item.id}_${idx}`} item={item} />
      ))}
      {remaining > 0 && (
        <TouchableOpacity style={SHOW_MORE_BUTTON_STYLE} onPress={handleShowMore} activeOpacity={0.7}>
          <Text style={SHOW_MORE_TEXT_STYLE}>Show {remaining} more</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

const SummaryCards = memo(({ totalQty, totalValue, groupCount }) => (
  <View style={styles.summaryRow}>
    <View style={styles.summaryCard}>
      <Text style={styles.summaryLabel}>Total Issued</Text>
      <Text style={styles.summaryValue}>{totalQty.toLocaleString()} units</Text>
    </View>
    <View style={styles.summaryCard}>
      <Text style={styles.summaryLabel}>Total Value</Text>
      <Text style={styles.summaryValue}>{formatValue(totalValue)}</Text>
    </View>
    <View style={styles.summaryCard}>
      <Text style={styles.summaryLabel}>Days</Text>
      <Text style={styles.summaryValue}>{groupCount}</Text>
    </View>
  </View>
));

// ─── PeriodChipRow ──────────────────────────────────────────────────
const PeriodChipRow = memo(({ periodFilter, onSelect }) => {
  const handlers = useMemo(
    () => PERIOD_OPTIONS.reduce((acc, o) => {
      acc[o.value] = () => onSelect(o.value);
      return acc;
    }, {}),
    [onSelect],
  );
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {PERIOD_OPTIONS.map((option) => (
        <PeriodChip
          key={option.value}
          option={option}
          active={periodFilter === option.value}
          onPress={handlers[option.value]}
        />
      ))}
    </ScrollView>
  );
});

// ─── DateChipRow ─────────────────────────────────────────────────────
const DateChipRow = memo(({ uniqueDates, selectedDate, onSelect, onClear }) => {
  const handlers = useMemo(
    () => uniqueDates.reduce((acc, date) => {
      acc[date] = () => onSelect(date);
      return acc;
    }, {}),
    [uniqueDates, onSelect],
  );
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {uniqueDates.map((date) => (
        <DateChip key={date} date={date} active={selectedDate === date} onPress={handlers[date]} />
      ))}
      {selectedDate ? (
        <TouchableOpacity style={styles.clearDateChip} onPress={onClear}>
          <X size={11} color={COLORS.redDark} />
          <Text style={styles.clearDateChipText}> Clear</Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
});

// ─── StockMovementHeader ─────────────────────────────────────────────────────
const StockMovementHeader = memo(({
  searchValue,
  onSearchChange,
  onSearchClear,
  periodFilter,
  onPeriodSelect,
  hasActiveFilters,
  onResetFilters,
  showDateFilter,
  fromDateText,
  onFromDateChange,
  toDateText,
  onToDateChange,
  uniqueDates,
  selectedDate,
  onDateSelect,
  onDateClear,
}) => (
  <View>
    <View style={styles.searchWrapper}>
      <Search size={16} color={COLORS.subText} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search product, SKU, invoice, customer..."
        placeholderTextColor={COLORS.muted}
        value={searchValue}
        onChangeText={onSearchChange}
        returnKeyType="search"
      />
      {searchValue ? (
        <TouchableOpacity onPress={onSearchClear} hitSlop={8}>
          <X size={16} color={COLORS.muted} />
        </TouchableOpacity>
      ) : null}
    </View>

    <View style={styles.filterRow}>
      <PeriodChipRow periodFilter={periodFilter} onSelect={onPeriodSelect} />
      {hasActiveFilters && (
        <TouchableOpacity style={styles.clearAllBtn} onPress={onResetFilters}>
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
      )}
    </View>

    {showDateFilter && (
      <View style={styles.customDateRow}>
        <TextInput
          style={styles.dateInput}
          placeholder="From (YYYY-MM-DD)"
          placeholderTextColor={COLORS.muted}
          value={fromDateText}
          onChangeText={onFromDateChange}
        />
        <Text style={styles.dateSeparator}>→</Text>
        <TextInput
          style={styles.dateInput}
          placeholder="To (YYYY-MM-DD)"
          placeholderTextColor={COLORS.muted}
          value={toDateText}
          onChangeText={onToDateChange}
        />
      </View>
    )}

    {uniqueDates.length > 0 && (
      <View style={styles.quickDateSection}>
        <Text style={styles.quickDateLabel}>Quick Date:</Text>
        <DateChipRow
          uniqueDates={uniqueDates}
          selectedDate={selectedDate}
          onSelect={onDateSelect}
          onClear={onDateClear}
        />
      </View>
    )}
  </View>
));

const EmptyState = memo(({ hasActiveFilters }) => (
  <View style={styles.emptyState}>
    <PackageOpen size={44} color={COLORS.muted} />
    <Text style={styles.emptyTitle}>No outward records found</Text>
    <Text style={styles.emptySubtitle}>
      {hasActiveFilters
        ? 'Try changing your filters to see more results'
        : 'When you create invoices, they will appear here'}
    </Text>
  </View>
));

const PaginationFooter = memo(({ currentPage, totalPages, onPrev, onNext }) => {
  if (totalPages <= 1) return null;
  return (
    <View style={styles.pagination}>
      <TouchableOpacity
        style={currentPage === 1 ? PAGE_BTN_DISABLED : PAGE_BTN_ENABLED}
        onPress={onPrev}
        disabled={currentPage === 1}
        activeOpacity={0.7}
      >
        <ChevronLeft size={14} color={currentPage === 1 ? COLORS.muted : COLORS.red} />
        <Text style={styles.pageBtnText}> Previous</Text>
      </TouchableOpacity>
      <Text style={styles.pageInfo}>Page {currentPage} of {totalPages}</Text>
      <TouchableOpacity
        style={currentPage === totalPages ? PAGE_BTN_DISABLED : PAGE_BTN_ENABLED}
        onPress={onNext}
        disabled={currentPage === totalPages}
        activeOpacity={0.7}
      >
        <Text style={styles.pageBtnText}>Next </Text>
        <ChevronRight size={14} color={currentPage === totalPages ? COLORS.muted : COLORS.red} />
      </TouchableOpacity>
    </View>
  );
});

// ─── Main Component ──────────────────────────────────────────────────

const OutwardScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  // ─── State ──────────────────────────────────────────────────────────────────
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [periodFilter, setPeriodFilter] = useState('all');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [fromDateText, setFromDateText] = useState('');
  const [toDateText, setToDateText] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const flatListRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // ─── Redux Selectors ──────────────────────────────────────────────────────
  // Use a stable EMPTY_ARRAY fallback instead of `|| []` — see comment above.
  const invoices = useSelector((state) => state.invoice?.data || EMPTY_ARRAY);

  // ─── Data Loading ──────────────────────────────────────────────────────────
  const loadData = useCallback(async (force = false) => {
    if (force || invoices.length === 0) {
      await dispatch(fetchInvoices({ filter: 'all' }));
    }
  }, [dispatch, invoices.length]);

  useEffect(() => {
    let cancelled = false;
    const task = InteractionManager.runAfterInteractions(async () => {
      if (cancelled) return;
      await loadData();
      if (!cancelled) setIsInitialLoading(false);
    });
    return () => {
      cancelled = true;
      task.cancel?.();
    };
  }, []);

  // ─── Search debounce ───────────────────────────────────────────────────────
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchTerm]);

  const handleSearchChange = useCallback((text) => {
    setSearchTerm(text);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setCurrentPage(1);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, []);

  // ─── STAGE 1: Build raw items ────────────────────────────────────────────
  const rawItems = useMemo(() => {
    if (isInitialLoading || !invoices.length) return [];

    let raw = [];
    const len = invoices.length;
    for (let i = 0; i < len; i++) {
      const invoice = invoices[i];
      const invDate = parseDate(invoice.createdAt);
      const items = invoice.items || [];
      const itemsLen = items.length;
      for (let j = 0; j < itemsLen; j++) {
        const item = items[j];
        const qty = getNum(item, 'qty');
        if (qty > 0) {
          const price = getNum(item, 'price');
          raw.push({
            id: `out_${getId(invoice)}_${j}`,
            name: getStr(item, 'name', 'N/A'),
            sku: getStr(item, 'sku', 'N/A'),
            qty,
            price,
            date: invDate,
            dateStr: formatDate(invDate),
            time: formatTime(invDate),
            invoiceNumber: getStr(invoice, 'invoiceNumber', 'N/A'),
            customerName: getStr(invoice, 'customerName', 'N/A'),
            salesperson: getStr(invoice, 'salesperson', 'N/A'),
            totalValue: qty * price,
          });
        }
      }
    }

    raw.sort((a, b) => a.date - b.date);
    return raw;
  }, [invoices, isInitialLoading]);

  // ─── Quick-date chips ───────────────────────────────────────────────────
  const uniqueDates = useMemo(() => {
    const dateMap = new Map();
    const rawLen = rawItems.length;
    for (let i = 0; i < rawLen && dateMap.size < 30; i++) {
      const item = rawItems[i];
      if (!dateMap.has(item.dateStr)) {
        dateMap.set(item.dateStr, item.date.getTime());
      }
    }
    return [...dateMap.entries()]
      .sort((a, b) => a[1] - b[1])
      .slice(0, 8)
      .map(([dateStr]) => dateStr);
  }, [rawItems]);

  // ─── Date range for the active period filter ────────────────────────────
  const dateRange = useMemo(
    () => getDateRangeFromPeriod(periodFilter, fromDateText, toDateText),
    [periodFilter, fromDateText, toDateText],
  );

  // ─── STAGE 2: Filter ──────────────────────────────────────────────────────
  const filteredItems = useMemo(() => {
    const { fromDate, toDate } = dateRange;
    const term = debouncedSearchTerm.toLowerCase().trim();

    if (!fromDate && !toDate && !term && !selectedDate) return rawItems;

    const result = [];
    const rawLen = rawItems.length;
    for (let i = 0; i < rawLen; i++) {
      const item = rawItems[i];
      if (selectedDate && item.dateStr !== selectedDate) continue;
      if (fromDate && item.date < fromDate) continue;
      if (toDate && item.date > toDate) continue;
      if (term) {
        const hay = `${item.name} ${item.sku} ${item.invoiceNumber || ''} ${item.customerName || ''} ${item.salesperson || ''}`.toLowerCase();
        if (!hay.includes(term)) continue;
      }
      result.push(item);
    }
    return result;
  }, [rawItems, dateRange, debouncedSearchTerm, selectedDate]);

  // ─── STAGE 3: Group + totals ──────────────────────────────────────────────
  const processedData = useMemo(() => {
    const groupsMap = {};
    const groupOrder = [];
    let totalQty = 0;
    let totalValue = 0;
    const filteredLen = filteredItems.length;

    for (let i = 0; i < filteredLen; i++) {
      const item = filteredItems[i];
      const dateStr = item.dateStr;
      let group = groupsMap[dateStr];
      if (!group) {
        group = { date: dateStr, items: [], totalQty: 0, totalValue: 0 };
        groupsMap[dateStr] = group;
        groupOrder.push(dateStr);
      }
      group.items.push(item);
      group.totalQty += item.qty;
      group.totalValue += item.totalValue;
      totalQty += item.qty;
      totalValue += item.totalValue;
    }

    const groups = groupOrder.map((d) => groupsMap[d]);
    return { groups, totalQty, totalValue };
  }, [filteredItems]);

  // ─── Pagination ────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(processedData.groups.length / ITEMS_PER_PAGE));

  const paginatedData = useMemo(
    () => processedData.groups.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [processedData.groups, currentPage],
  );

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData(true);
    setRefreshing(false);
  }, [loadData]);

  const handlePeriodSelect = useCallback((value) => {
    setPeriodFilter(value);
    setShowDateFilter(value === 'custom');
    if (value !== 'custom') {
      setFromDateText('');
      setToDateText('');
    }
    setCurrentPage(1);
  }, []);

  const handleDateSelect = useCallback((date) => {
    setSelectedDate((prev) => (prev === date ? null : date));
    setCurrentPage(1);
  }, []);

  const handleDateClear = useCallback(() => setSelectedDate(null), []);

  const resetFilters = useCallback(() => {
    setPeriodFilter('all');
    setFromDateText('');
    setToDateText('');
    setShowDateFilter(false);
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSelectedDate(null);
    setCurrentPage(1);
  }, []);

  const handlePrevPage = useCallback(() => setCurrentPage((p) => Math.max(1, p - 1)), []);
  const handleNextPage = useCallback(() => setCurrentPage((p) => Math.min(totalPages, p + 1)), [totalPages]);

  // ─── Memoized computed values ─────────────────────────────────────────────
  const hasActiveFilters = useMemo(
    () => periodFilter !== 'all' || !!fromDateText || !!toDateText || !!searchTerm || !!selectedDate,
    [periodFilter, fromDateText, toDateText, searchTerm, selectedDate],
  );

  // ─── Render Functions ──────────────────────────────────────────────────────
  const renderGroup = useCallback(
    ({ item }) => <MovementGroup group={item} />,
    [],
  );

  const keyExtractor = useCallback((item) => item.date, []);

  // ─── Memoized Header ──────────────────────────────────────────────────────
  const headerElement = useMemo(
    () => (
      <View>
        <StockMovementHeader
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          onSearchClear={handleSearchClear}
          periodFilter={periodFilter}
          onPeriodSelect={handlePeriodSelect}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={resetFilters}
          showDateFilter={showDateFilter}
          fromDateText={fromDateText}
          onFromDateChange={setFromDateText}
          toDateText={toDateText}
          onToDateChange={setToDateText}
          uniqueDates={uniqueDates}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          onDateClear={handleDateClear}
        />
        <SummaryCards
          totalQty={processedData.totalQty}
          totalValue={processedData.totalValue}
          groupCount={processedData.groups.length}
        />
      </View>
    ),
    [
      searchTerm, handleSearchChange, handleSearchClear,
      periodFilter, handlePeriodSelect, hasActiveFilters, resetFilters,
      showDateFilter, fromDateText, toDateText, uniqueDates,
      selectedDate, handleDateSelect, handleDateClear, processedData.totalQty,
      processedData.totalValue, processedData.groups.length,
    ],
  );

  const footerElement = useMemo(
    () => (
      <PaginationFooter
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
      />
    ),
    [currentPage, totalPages, handlePrevPage, handleNextPage],
  );

  const emptyElement = useMemo(
    () => <EmptyState hasActiveFilters={hasActiveFilters} />,
    [hasActiveFilters],
  );

  // ─── contentContainerStyle & refreshControl ────────────────────────────────
  // Both were previously created inline as new array/element literals on
  // EVERY render of this screen (e.g. every keystroke while typing in the
  // search box, before the debounce even fires). Passing a new prop
  // reference to FlatList every render forces it to redo internal work it
  // didn't need to. Memoizing them removes that per-keystroke overhead.
  const contentContainerStyle = useMemo(
    () => [styles.content, { paddingBottom: insets.bottom + 16 }],
    [insets.bottom],
  );

  const refreshControlElement = useMemo(
    () => (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        colors={REFRESH_COLORS}
        tintColor={COLORS.red}
      />
    ),
    [refreshing, onRefresh],
  );

  // ─── Loading State ─────────────────────────────────────────────────────────
  if (isInitialLoading) {
    return (
      <View style={styles.container}>
        <Header title="Stock Movement - Outward" showBackArrow navigation={navigation} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.red} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  // ─── Main Render ───────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <Header title="Stock Movement - Outward" showBackArrow navigation={navigation} />
      <FlatList
        ref={flatListRef}
        data={paginatedData}
        keyExtractor={keyExtractor}
        renderItem={renderGroup}
        ListHeaderComponent={headerElement}
        ListEmptyComponent={emptyElement}
        ListFooterComponent={footerElement}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControlElement}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={30}
        windowSize={9}
        removeClippedSubviews
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
      />
    </View>
  );
};

export default OutwardScreen;