// src/screens/RadnusEmployee/ExcelExportScreen.js
import React, { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Alert,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Search,
  X,
  Calendar,
  Users,
  Receipt,
  Undo2,
  RefreshCcw,
  Package,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react-native';
import Header from '../../components/Header';
import { fetchInvoices } from '../../services/features/invoice/invoiceSlice';
import { fetchSalesReturns, fetchPurchaseReturns } from '../../services/features/returns/returnsSlice';
import { fetchProducts } from '../../services/features/products/productSlice';
import api from '../../services/API/api';
import {
  exportInvoicesToExcel,
  exportInvoiceItemsToExcel,
  exportSalesReturnsToExcel,
  exportSalesReturnItemsToExcel,
  exportPurchaseReturnsToExcel,
  exportProductsToExcel,
  exportCustomersToExcel,
} from '../../utils/excelExportRN';
import styles, { COLORS } from './ExcelExportStyle';

// ─── Constants (hoisted, never recreated) ─────────────────────────
const PERIOD_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'thisWeek', label: 'This Week' },
  { value: 'lastWeek', label: 'Last Week' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'custom', label: 'Custom' },
];

const REPORT_OPTIONS = [
  {
    id: 'invoices',
    title: 'Invoices',
    Icon: Receipt,
    description: 'Invoice details with customer info and payment modes',
    types: [
      { id: 'summary', name: 'Summary Report', description: 'Basic invoice information' },
      { id: 'detailed', name: 'Detailed Report', description: 'Invoice with item-wise details' },
    ],
  },
  {
    id: 'salesReturns',
    title: 'Sales Returns',
    Icon: Undo2,
    description: 'Sales return records with customer details',
    types: [
      { id: 'summary', name: 'Summary Report', description: 'Basic return information' },
      { id: 'detailed', name: 'Detailed Report', description: 'Returns with item-wise details' },
    ],
  },
  {
    id: 'purchaseReturns',
    title: 'Purchase Returns',
    Icon: RefreshCcw,
    description: 'Purchase return records with supplier details',
    types: [{ id: 'summary', name: 'Purchase Returns', description: 'Basic purchase return information' }],
  },
  {
    id: 'products',
    title: 'Products',
    Icon: Package,
    description: 'Product catalog with pricing and inventory',
    types: [{ id: 'summary', name: 'Products Report', description: 'Complete product list' }],
  },
  {
    id: 'customers',
    title: 'Customers',
    Icon: Users,
    description: 'Customer database with contact details',
    types: [{ id: 'summary', name: 'Customers Report', description: 'Complete customer list' }],
  },
];

const PREVIEW_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 300;

// ─── Pure helpers (hoisted) ────────────────────────────────────────
const sortByDate = (data, reportId) => {
  if (!data?.length) return data;
  const getField = (item) =>
    reportId === 'invoices' ? item.invoiceDate || item.createdAt : item.createdAt || item.invoiceDate;
  return [...data].sort((a, b) => {
    const da = new Date(getField(a));
    const db = new Date(getField(b));
    if (isNaN(da)) return 1;
    if (isNaN(db)) return -1;
    return da - db;
  });
};

const getDateRange = (period) => {
  const now = new Date();
  const start = new Date();
  const end = new Date();
  switch (period) {
    case 'today': start.setHours(0, 0, 0, 0); end.setHours(23, 59, 59, 999); break;
    case 'yesterday':
      start.setDate(now.getDate() - 1); start.setHours(0, 0, 0, 0);
      end.setDate(now.getDate() - 1); end.setHours(23, 59, 59, 999); break;
    case 'last7days': start.setDate(now.getDate() - 7); start.setHours(0, 0, 0, 0); break;
    case 'thisWeek':
      start.setDate(now.getDate() - now.getDay()); start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6); end.setHours(23, 59, 59, 999); break;
    case 'lastWeek': {
      const lw = new Date(now); lw.setDate(now.getDate() - 7);
      start.setDate(lw.getDate() - lw.getDay()); start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6); end.setHours(23, 59, 59, 999); break;
    }
    case 'thisMonth':
      start.setDate(1); start.setHours(0, 0, 0, 0);
      end.setMonth(now.getMonth() + 1, 0); end.setHours(23, 59, 59, 999); break;
    case 'lastMonth':
      start.setMonth(now.getMonth() - 1, 1); start.setHours(0, 0, 0, 0);
      end.setMonth(now.getMonth(), 0); end.setHours(23, 59, 59, 999); break;
    default: return null;
  }
  return { fromDate: start, toDate: end };
};

// ─── Memoized sub-components ───────────────────────────────────────
const PeriodChip = memo(({ option, active, onPress }) => (
  <TouchableOpacity style={[styles.periodChip, active && styles.periodChipActive]} onPress={onPress}>
    <Text style={[styles.periodChipText, active && styles.periodChipTextActive]}>{option.label}</Text>
  </TouchableOpacity>
));

const SpChip = memo(({ label, active, onPress }) => (
  <TouchableOpacity style={[styles.spChip, active && styles.spChipActive]} onPress={onPress}>
    <Text style={[styles.spChipText, active && styles.spChipTextActive]}>{label}</Text>
  </TouchableOpacity>
));

const StatTile = memo(({ label, value }) => (
  <View style={styles.statCard}>
    <View style={styles.statDot} />
    <Text style={styles.statValue}>{value.toLocaleString()}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
));

const ReportCard = memo(({ report, count, loading, exporting, onView, onExport }) => {
  const isEmpty = !loading && count === 0;
  const ReportIcon = report.Icon;
  return (
    <View style={styles.reportCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconWrap}>
          <ReportIcon size={22} color={COLORS.red} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{report.title}</Text>
          <Text style={styles.cardDesc}>{report.description}</Text>
        </View>
        <View style={styles.countBadge}>
          {loading
            ? <ActivityIndicator size="small" color={COLORS.red} />
            : <Text style={styles.countText}>{count}</Text>}
          <Text style={styles.countLabel}>records</Text>
        </View>
      </View>

      {isEmpty && (
        <View style={styles.emptyHintRow}>
          <AlertTriangle size={13} color="#b45309" />
          <Text style={styles.emptyHint}> No data with current filters</Text>
        </View>
      )}

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.viewBtn, (isEmpty || loading) && styles.disabledBtn]}
          onPress={() => onView(report.id)}
          disabled={isEmpty || loading}
        >
          <Eye size={15} color={COLORS.red} />
          <Text style={styles.viewBtnText}> View Data</Text>
        </TouchableOpacity>

        {report.types.map((type) => {
          const key = `${report.id}-${type.id}`;
          const isExp = exporting === key;
          return (
            <TouchableOpacity
              key={type.id}
              style={[styles.exportBtn, (isEmpty || loading || !!exporting) && styles.disabledBtn]}
              onPress={() => onExport(report.id, type.id)}
              disabled={isEmpty || loading || !!exporting}
            >
              {isExp
                ? <ActivityIndicator size="small" color={COLORS.red} />
                : <Download size={15} color={COLORS.red} />}
              <View>
                <Text style={styles.exportBtnName}>{type.name}</Text>
                <Text style={styles.exportBtnDesc}>{type.description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}, (prev, next) =>
  prev.report.id === next.report.id &&
  prev.count === next.count &&
  prev.loading === next.loading &&
  prev.exporting === next.exporting,
);

const PreviewRow = memo(({ item, reportId }) => {
  if (reportId === 'invoices') {
    return (
      <View style={styles.previewRow}>
        <Text style={styles.previewMain}>{item.invoiceNumber || 'N/A'}</Text>
        <Text style={styles.previewSub}>{item.customerName} · ₹{item.totalAmount}</Text>
        <Text style={styles.previewMeta}>{item.salesperson} · {item.paymentMode}</Text>
      </View>
    );
  }
  if (reportId === 'products') {
    return (
      <View style={styles.previewRow}>
        <Text style={styles.previewMain}>{item.name}</Text>
        <Text style={styles.previewSub}>SKU: {item.sku} · MOQ: {item.moq}</Text>
        <Text style={styles.previewMeta}>Walk-in: ₹{item.walkinPrice}</Text>
      </View>
    );
  }
  if (reportId === 'customers') {
    return (
      <View style={styles.previewRow}>
        <Text style={styles.previewMain}>{item.name}</Text>
        <Text style={styles.previewSub}>{item.phone} · {item.type}</Text>
        <Text style={styles.previewMeta}>{item.city}</Text>
      </View>
    );
  }
  return (
    <View style={styles.previewRow}>
      <Text style={styles.previewMain}>{item.returnNumber || 'N/A'}</Text>
      <Text style={styles.previewSub}>{item.customerName || item.supplierName} · ₹{item.totalAmount}</Text>
      <Text style={styles.previewMeta}>{item.status}</Text>
    </View>
  );
});

// ─── Header content, isolated so text input doesn't re-render list ──
const ExportHeader = memo(({
  totalRecords,
  searchValue,
  onSearchChange,
  onSearchClear,
  uniqueSalespersons,
  salespersonFilter,
  onSpSelect,
  hasFilters,
  onResetFilters,
  periodFilter,
  onPeriodSelect,
  showDateFilter,
  fromDateText,
  onFromDateChange,
  toDateText,
  onToDateChange,
  reportCounts,
}) => (
  <View>
    <View style={styles.headerCard}>
      <View style={styles.headerText}>
        <Text style={styles.headerTitle}>Export Center</Text>
        <Text style={styles.headerSub}>Export your data as Excel files</Text>
      </View>
      <View style={styles.totalBadge}>
        <Text style={styles.totalBadgeValue}>{totalRecords.toLocaleString()}</Text>
        <Text style={styles.totalBadgeLabel}>Filtered Records</Text>
      </View>
    </View>

    <View style={styles.searchWrapper}>
      <Search size={16} color={COLORS.subText} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search by customer, invoice number, salesperson..."
        placeholderTextColor={COLORS.muted}
        defaultValue={searchValue}
        onChangeText={onSearchChange}
      />
      {searchValue ? (
        <TouchableOpacity onPress={onSearchClear} hitSlop={8}>
          <X size={16} color={COLORS.muted} />
        </TouchableOpacity>
      ) : null}
    </View>

    {uniqueSalespersons.length > 0 && (
      <View style={styles.section}>
        <View style={styles.sectionLabelRow}>
          <Users size={14} color={COLORS.redDark} />
          <Text style={styles.sectionLabel}> Filter by Salesperson</Text>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['', ...uniqueSalespersons]}
          keyExtractor={(item, idx) => item || `all_${idx}`}
          renderItem={({ item: sp }) => (
            <SpChip label={sp || 'All'} active={salespersonFilter === sp} onPress={() => onSpSelect(sp)} />
          )}
        />
      </View>
    )}

    <View style={styles.section}>
      <View style={styles.sectionRow}>
        <View style={styles.sectionLabelRow}>
          <Calendar size={14} color={COLORS.redDark} />
          <Text style={styles.sectionLabel}> Date Filter</Text>
        </View>
        {hasFilters && (
          <TouchableOpacity onPress={onResetFilters} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={PERIOD_OPTIONS}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => (
          <PeriodChip option={item} active={periodFilter === item.value} onPress={() => onPeriodSelect(item.value)} />
        )}
      />

      {showDateFilter && (
        <View style={styles.customDateRow}>
          <TextInput
            style={styles.dateInput}
            placeholder="From (YYYY-MM-DD)"
            placeholderTextColor={COLORS.muted}
            defaultValue={fromDateText}
            onChangeText={onFromDateChange}
          />
          <Text style={styles.dateSep}>→</Text>
          <TextInput
            style={styles.dateInput}
            placeholder="To (YYYY-MM-DD)"
            placeholderTextColor={COLORS.muted}
            defaultValue={toDateText}
            onChangeText={onToDateChange}
          />
        </View>
      )}
    </View>

    <View style={styles.statsGrid}>
      <StatTile label="Invoices" value={reportCounts.invoices} />
      <StatTile label="Sales Returns" value={reportCounts.salesReturns} />
      <StatTile label="Purch. Returns" value={reportCounts.purchaseReturns} />
      <StatTile label="Products" value={reportCounts.products} />
      <StatTile label="Customers" value={reportCounts.customers} />
    </View>
  </View>
));

// ─── ExcelExportScreen ─────────────────────────────────────────────
const ExcelExportScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { user } = useSelector((state) => state.auth);

  const [invoices, setInvoices] = useState([]);
  const [salesReturns, setSalesReturns] = useState([]);
  const [purchaseReturns, setPurchaseReturns] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState({
    invoices: false, salesReturns: false, purchaseReturns: false, products: false, customers: false,
  });
  const [exporting, setExporting] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [fromDateText, setFromDateText] = useState('');
  const [toDateText, setToDateText] = useState('');
  const [salespersonFilter, setSalespersonFilter] = useState('');
  const [uniqueSalespersons, setUniqueSalespersons] = useState([]);

  const [previewModal, setPreviewModal] = useState(null);
  const [previewPage, setPreviewPage] = useState(1);

  const searchDebounceRef = useRef(null);

  // ─── Fetch ──────────────────────────────────────────────────────
  const fetchAllData = useCallback(async () => {
    const billerName = user?.role === 'Radnus' ? user?.name : '';

    setLoading((p) => ({ ...p, invoices: true }));
    try {
      const result = await dispatch(fetchInvoices({ filter: 'all', billerName })).unwrap();
      const inv = Array.isArray(result?.data) ? result.data : [];
      setInvoices(inv);
      setUniqueSalespersons([...new Set(inv.map((i) => i.salesperson).filter(Boolean))].sort());
    } catch { setInvoices([]); }
    finally { setLoading((p) => ({ ...p, invoices: false })); }

    setLoading((p) => ({ ...p, salesReturns: true }));
    try {
      const result = await dispatch(fetchSalesReturns({ billerName })).unwrap();
      setSalesReturns(Array.isArray(result) ? result : []);
    } catch { setSalesReturns([]); }
    finally { setLoading((p) => ({ ...p, salesReturns: false })); }

    setLoading((p) => ({ ...p, purchaseReturns: true }));
    try {
      const result = await dispatch(fetchPurchaseReturns({ billerName })).unwrap();
      setPurchaseReturns(Array.isArray(result) ? result : []);
    } catch { setPurchaseReturns([]); }
    finally { setLoading((p) => ({ ...p, purchaseReturns: false })); }

    setLoading((p) => ({ ...p, products: true }));
    try {
      const result = await dispatch(fetchProducts()).unwrap();
      setProducts(Array.isArray(result) ? result : []);
    } catch { setProducts([]); }
    finally { setLoading((p) => ({ ...p, products: false })); }

    setLoading((p) => ({ ...p, customers: true }));
    try {
      const response = await api.get('/api/customers');
      setCustomers(Array.isArray(response?.data) ? response.data : []);
    } catch { setCustomers([]); }
    finally { setLoading((p) => ({ ...p, customers: false })); }
  }, [dispatch, user]);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  }, [fetchAllData]);

  // ─── Debounced search ─────────────────────────────────────────────
  const handleSearchChange = useCallback((text) => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => setSearchTerm(text), SEARCH_DEBOUNCE_MS);
  }, []);

  useEffect(() => () => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
  }, []);

  const handleSearchClear = useCallback(() => setSearchTerm(''), []);

  // ─── Filtering ──────────────────────────────────────────────────
  const resolvedDateRange = useMemo(() => {
    if (periodFilter === 'custom') {
      const from = fromDateText ? new Date(fromDateText) : null;
      const to = toDateText ? new Date(toDateText) : null;
      if (to) to.setHours(23, 59, 59, 999);
      return { from, to };
    }
    if (periodFilter !== 'all') {
      const range = getDateRange(periodFilter);
      return range ? { from: range.fromDate, to: range.toDate } : { from: null, to: null };
    }
    return { from: null, to: null };
  }, [periodFilter, fromDateText, toDateText]);

  const filterByDate = useCallback((data) => {
    if (!Array.isArray(data)) return [];
    const { from, to } = resolvedDateRange;
    if (!from && !to) return data;
    return data.filter((item) => {
      const d = new Date(item?.invoiceDate || item?.createdAt);
      if (isNaN(d)) return true;
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }, [resolvedDateRange]);

  const applyFilters = useCallback((data, reportId) => {
    let filtered = reportId !== 'products' && reportId !== 'customers' ? filterByDate(data) : data;
    if (salespersonFilter && (reportId === 'invoices' || reportId === 'salesReturns')) {
      filtered = filtered.filter((i) => i.salesperson === salespersonFilter);
    }
    if (reportId === 'invoices' && searchTerm) {
      const t = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (i) => i.customerName?.toLowerCase().includes(t) ||
               i.invoiceNumber?.toLowerCase().includes(t) ||
               i.salesperson?.toLowerCase().includes(t),
      );
    }
    return filtered;
  }, [filterByDate, salespersonFilter, searchTerm]);

  const getRaw = useCallback((reportId) => {
    switch (reportId) {
      case 'invoices': return invoices;
      case 'salesReturns': return salesReturns;
      case 'purchaseReturns': return purchaseReturns;
      case 'products': return products;
      case 'customers': return customers;
      default: return [];
    }
  }, [invoices, salesReturns, purchaseReturns, products, customers]);

  const filteredInvoices = useMemo(() => applyFilters(invoices, 'invoices'), [applyFilters, invoices]);
  const filteredSalesReturns = useMemo(() => applyFilters(salesReturns, 'salesReturns'), [applyFilters, salesReturns]);
  const filteredPurchaseReturns = useMemo(() => applyFilters(purchaseReturns, 'purchaseReturns'), [applyFilters, purchaseReturns]);

  const reportCounts = useMemo(() => ({
    invoices: filteredInvoices.length,
    salesReturns: filteredSalesReturns.length,
    purchaseReturns: filteredPurchaseReturns.length,
    products: products.length,
    customers: customers.length,
  }), [filteredInvoices, filteredSalesReturns, filteredPurchaseReturns, products, customers]);

  const totalRecords = useMemo(
    () => Object.values(reportCounts).reduce((s, v) => s + v, 0),
    [reportCounts],
  );

  // ─── Preview ─────────────────────────────────────────────────────
  const handleViewData = useCallback((reportId) => {
    const report = REPORT_OPTIONS.find((r) => r.id === reportId);
    const data = sortByDate(applyFilters(getRaw(reportId), reportId), reportId);
    setPreviewModal({ reportId, title: report?.title, data });
    setPreviewPage(1);
  }, [applyFilters, getRaw]);

  // ─── Export ──────────────────────────────────────────────────────
  const handleExport = useCallback(async (reportId, type) => {
    const key = `${reportId}-${type}`;
    setExporting(key);
    try {
      const raw = getRaw(reportId);
      const sorted = sortByDate(applyFilters([...raw], reportId), reportId);
      const suffix = salespersonFilter ? `_${salespersonFilter}` : '';
      const today = new Date().toISOString().split('T')[0];

      switch (reportId) {
        case 'invoices':
          type === 'summary'
            ? await exportInvoicesToExcel(sorted, `Invoices_Summary${suffix}_${today}`)
            : await exportInvoiceItemsToExcel(sorted, `Invoices_Detailed${suffix}_${today}`);
          break;
        case 'salesReturns':
          type === 'summary'
            ? await exportSalesReturnsToExcel(sorted, `Sales_Returns_Summary${suffix}_${today}`)
            : await exportSalesReturnItemsToExcel(sorted, `Sales_Returns_Detailed${suffix}_${today}`);
          break;
        case 'purchaseReturns':
          await exportPurchaseReturnsToExcel(sorted, `Purchase_Returns_${today}`);
          break;
        case 'products':
          await exportProductsToExcel(sorted, `Products_Report_${today}`);
          break;
        case 'customers':
          await exportCustomersToExcel(sorted, `Customers_Report_${today}`);
          break;
        default: break;
      }
    } catch (err) {
      console.error('Export error:', err);
      Alert.alert('Export Failed', 'Could not export the file. Please try again.');
    } finally {
      setExporting(null);
    }
  }, [getRaw, applyFilters, salespersonFilter]);

  const resetFilters = useCallback(() => {
    setPeriodFilter('all');
    setFromDateText('');
    setToDateText('');
    setShowDateFilter(false);
    setSearchTerm('');
    setSalespersonFilter('');
  }, []);

  const hasFilters = periodFilter !== 'all' || !!salespersonFilter || !!searchTerm;

  const handlePeriodSelect = useCallback((value) => {
    setPeriodFilter(value);
    setShowDateFilter(value === 'custom');
    if (value !== 'custom') { setFromDateText(''); setToDateText(''); }
  }, []);

  const handleSpSelect = useCallback((sp) => setSalespersonFilter(sp), []);

  // ─── Preview modal data ────────────────────────────────────────
  const previewItems = useMemo(
    () => previewModal ? previewModal.data.slice((previewPage - 1) * PREVIEW_PER_PAGE, previewPage * PREVIEW_PER_PAGE) : [],
    [previewModal, previewPage],
  );
  const previewTotal = previewModal ? Math.max(1, Math.ceil(previewModal.data.length / PREVIEW_PER_PAGE)) : 1;

  const renderPreviewItem = useCallback(
    ({ item }) => <PreviewRow item={item} reportId={previewModal?.reportId} />,
    [previewModal?.reportId],
  );
  const previewKeyExtractor = useCallback((item, idx) => `${item._id || item.id || idx}`, []);
  const handlePreviewPrev = useCallback(() => setPreviewPage((p) => Math.max(1, p - 1)), []);
  const handlePreviewNext = useCallback(() => setPreviewPage((p) => Math.min(previewTotal, p + 1)), [previewTotal]);
  const closePreview = useCallback(() => setPreviewModal(null), []);

  const renderReportCard = useCallback(({ item: report }) => (
    <ReportCard
      report={report}
      count={reportCounts[report.id]}
      loading={loading[report.id]}
      exporting={exporting}
      onView={handleViewData}
      onExport={handleExport}
    />
  ), [reportCounts, loading, exporting, handleViewData, handleExport]);

  const reportKeyExtractor = useCallback((item) => item.id, []);

  const headerElement = useMemo(() => (
    <ExportHeader
      totalRecords={totalRecords}
      searchValue={searchTerm}
      onSearchChange={handleSearchChange}
      onSearchClear={handleSearchClear}
      uniqueSalespersons={uniqueSalespersons}
      salespersonFilter={salespersonFilter}
      onSpSelect={handleSpSelect}
      hasFilters={hasFilters}
      onResetFilters={resetFilters}
      periodFilter={periodFilter}
      onPeriodSelect={handlePeriodSelect}
      showDateFilter={showDateFilter}
      fromDateText={fromDateText}
      onFromDateChange={setFromDateText}
      toDateText={toDateText}
      onToDateChange={setToDateText}
      reportCounts={reportCounts}
    />
  ), [
    totalRecords, searchTerm, handleSearchChange, handleSearchClear,
    uniqueSalespersons, salespersonFilter, handleSpSelect, hasFilters, resetFilters,
    periodFilter, handlePeriodSelect, showDateFilter, fromDateText, toDateText, reportCounts,
  ]);

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <Header title="Export Center" showBackArrow navigation={navigation} />

      <FlatList
        data={REPORT_OPTIONS}
        keyExtractor={reportKeyExtractor}
        renderItem={renderReportCard}
        ListHeaderComponent={headerElement}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.red]} tintColor={COLORS.red} />
        }
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews
        keyboardShouldPersistTaps="handled"
      />

      {/* ── Data Preview Modal ── */}
      <Modal visible={!!previewModal} animationType="slide" onRequestClose={closePreview}>
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{previewModal?.title} Data</Text>
            <TouchableOpacity onPress={closePreview} style={styles.modalCloseBtn}>
              <X size={16} color="#fff" />
              <Text style={styles.modalClose}> Close</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.modalCount}>{previewModal?.data?.length ?? 0} records (oldest first)</Text>

          <FlatList
            data={previewItems}
            keyExtractor={previewKeyExtractor}
            renderItem={renderPreviewItem}
            style={styles.modalBody}
            initialNumToRender={10}
            windowSize={5}
          />

          {previewTotal > 1 && (
            <View style={styles.modalPagination}>
              <TouchableOpacity
                style={[styles.pageBtn, previewPage === 1 && styles.pageBtnDisabled]}
                onPress={handlePreviewPrev}
                disabled={previewPage === 1}
              >
                <ChevronLeft size={14} color={previewPage === 1 ? COLORS.muted : COLORS.red} />
                <Text style={styles.pageBtnText}> Prev</Text>
              </TouchableOpacity>
              <Text style={styles.pageInfo}>Page {previewPage} of {previewTotal}</Text>
              <TouchableOpacity
                style={[styles.pageBtn, previewPage === previewTotal && styles.pageBtnDisabled]}
                onPress={handlePreviewNext}
                disabled={previewPage === previewTotal}
              >
                <Text style={styles.pageBtnText}>Next </Text>
                <ChevronRight size={14} color={previewPage === previewTotal ? COLORS.muted : COLORS.red} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default ExcelExportScreen;