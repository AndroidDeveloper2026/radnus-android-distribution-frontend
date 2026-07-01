// src/screens/RadnusEmployee/StockMovementUtils.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {
  Search,
  X,
  Calendar,
  Package,
  ArrowUp,
  ArrowDown,
  User,
  UserCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
  Receipt,
} from 'lucide-react-native';
import styles, { COLORS } from './StockMovementStyle';

// ─── Helper Functions ──────────────────────────────────────────────
export const formatValue = (num) => {
  const value = Number(num);
  if (isNaN(value)) return '₹0';
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toFixed(2)}`;
};

export const parseDate = (dateValue) => {
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

export const formatDate = (date) => {
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, '0')}-${d.toLocaleString('en', { month: 'short' })}-${d.getFullYear()}`;
};

export const formatTime = (date) => {
  const d = new Date(date);
  const hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  return `${hours % 12 || 12}:${minutes} ${ampm}`;
};

export const getNum = (obj, key, fallback = 0) => {
  if (obj?.[key] !== undefined && obj[key] !== null) {
    const val = Number(obj[key]);
    if (!isNaN(val)) return val;
  }
  return fallback;
};

export const getStr = (obj, key, fallback = '') =>
  obj?.[key] !== undefined && obj[key] !== null ? String(obj[key]).trim() : fallback;

export const getId = (obj) => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  if (obj.$oid) return obj.$oid;
  return obj._id || obj.id || '';
};

export const getDateRangeFromPeriod = (period, fromDateText, toDateText) => {
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

// ─── Constants ──────────────────────────────────────────────────────
export const PERIOD_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'thisWeek', label: 'This Week' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'custom', label: 'Custom' },
];

export const ITEMS_PER_PAGE = 10;
export const SEARCH_DEBOUNCE_MS = 250;

// ─── Shared Components ──────────────────────────────────────────────

export const PeriodChip = React.memo(({ option, active, onPress }) => (
  <TouchableOpacity
    style={[styles.periodChip, active && styles.periodChipActive]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[styles.periodChipText, active && styles.periodChipTextActive]}>
      {option.label}
    </Text>
  </TouchableOpacity>
));

export const DateChip = React.memo(({ date, active, onPress }) => (
  <TouchableOpacity
    style={[styles.dateChip, active && styles.dateChipActive]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[styles.dateChipText, active && styles.dateChipTextActive]}>
      {date}
    </Text>
  </TouchableOpacity>
));

export const MovementItemRow = React.memo(({ item, type }) => {
  const isInward = type === 'INWARD';

  return (
    <View style={styles.movementItem}>
      <View style={[styles.itemIcon, isInward ? styles.iconInward : styles.iconOutward]}>
        {isInward ? <ArrowUp size={16} color={COLORS.green} /> : <ArrowDown size={16} color={COLORS.red} />}
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
        <Text style={[styles.qtyValue, isInward ? styles.positive : styles.negative]}>
          {isInward ? '+' : '-'}{item.qty}
        </Text>
        <Text style={styles.unitPrice}>{formatValue(item.price)}</Text>
        <Text style={styles.totalVal}>{formatValue(item.totalValue)}</Text>
      </View>
    </View>
  );
});

export const MovementGroup = React.memo(({ group, type }) => {
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
      {group.items.map((item, idx) => (
        <MovementItemRow key={`${item.id}_${idx}`} item={item} type={type} />
      ))}
    </View>
  );
});

export const SummaryCards = React.memo(({ type, totalQty, totalValue, groupCount }) => (
  <View style={styles.summaryRow}>
    <View style={styles.summaryCard}>
      <Text style={styles.summaryLabel}>Total {type === 'INWARD' ? 'Added' : 'Sold'}</Text>
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

export const PeriodChipRow = React.memo(({ periodFilter, onSelect }) => {
  const handlers = React.useMemo(
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

export const DateChipRow = React.memo(({ uniqueDates, selectedDate, onSelect, onClear }) => {
  const handlers = React.useMemo(
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

export const EmptyState = React.memo(({ type, hasActiveFilters }) => (
  <View style={styles.emptyState}>
    <PackageOpen size={44} color={COLORS.muted} />
    <Text style={styles.emptyTitle}>No {type.toLowerCase()} records found</Text>
    <Text style={styles.emptySubtitle}>
      {hasActiveFilters
        ? 'Try changing your filters to see more results'
        : type === 'INWARD' 
          ? 'When you add new products, they will appear here'
          : 'When you create invoices, they will appear here'}
    </Text>
  </View>
));

export const PaginationFooter = React.memo(({ currentPage, totalPages, onPrev, onNext }) => {
  if (totalPages <= 1) return null;
  return (
    <View style={styles.pagination}>
      <TouchableOpacity
        style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
        onPress={onPrev}
        disabled={currentPage === 1}
        activeOpacity={0.7}
      >
        <ChevronLeft size={14} color={currentPage === 1 ? COLORS.muted : COLORS.red} />
        <Text style={styles.pageBtnText}> Previous</Text>
      </TouchableOpacity>
      <Text style={styles.pageInfo}>Page {currentPage} of {totalPages}</Text>
      <TouchableOpacity
        style={[styles.pageBtn, currentPage === totalPages && styles.pageBtnDisabled]}
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

// ─── Header Component ─────────────────────────────────────────────────────
export const StockMovementHeader = React.memo(({
  type,
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
        placeholder={`Search product, SKU${type === 'OUTWARD' ? ', invoice, customer...' : '...'}`}
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