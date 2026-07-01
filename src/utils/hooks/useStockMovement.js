// src/screens/RadnusEmployee/hooks/useStockMovement.js
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InteractionManager } from 'react-native';
import { 
  parseDate, formatDate, formatTime, getNum, getStr, getId,
  getDateRangeFromPeriod, SEARCH_DEBOUNCE_MS, ITEMS_PER_PAGE
} from '../../screens/RadnusEmployee/StockMovementUtils';
import { fetchProducts } from '../../services/features/products/productSlice';
import { fetchInvoices } from '../../services/features/retailer/invoiceSlice';

export const useStockMovement = (type) => {
  const dispatch = useDispatch();
  
  // ─── State ──────────────────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [periodFilter, setPeriodFilter] = useState('all');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [fromDateText, setFromDateText] = useState('');
  const [toDateText, setToDateText] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const flatListRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // ─── Redux Selectors ──────────────────────────────────────────────────────
  const products = useSelector((state) => state.products?.list || []);
  const invoices = useSelector((state) => state.invoice?.data || []);

  // ─── Data Loading ──────────────────────────────────────────────────────────
  const loadData = useCallback(async (force = false) => {
    const tasks = [];
    if (force || products.length === 0) tasks.push(dispatch(fetchProducts()));
    if (type === 'OUTWARD' && (force || invoices.length === 0)) {
      tasks.push(dispatch(fetchInvoices({ filter: 'all' })));
    }
    if (tasks.length) await Promise.all(tasks);
  }, [dispatch, products.length, invoices.length, type]);

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

  // ─── Build Raw Items ──────────────────────────────────────────────────────
  const rawItems = useMemo(() => {
    if (isInitialLoading) return [];
    
    let raw = [];
    const isInward = type === 'INWARD';

    if (isInward) {
      const len = products.length;
      for (let i = 0; i < len; i++) {
        const product = products[i];
        const qty = getNum(product, 'moq', 0);
        if (qty > 0) {
          const createdAt = parseDate(product.createdAt);
          const price = getNum(product, 'walkinPrice', 0);
          raw.push({
            id: `in_${getId(product)}`,
            name: getStr(product, 'name'),
            sku: getStr(product, 'sku'),
            qty,
            price,
            date: createdAt,
            dateStr: formatDate(createdAt),
            time: formatTime(createdAt),
            totalValue: qty * price,
          });
        }
      }
    } else {
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
    }

    raw.sort((a, b) => a.date - b.date);
    return raw;
  }, [type, products, invoices, isInitialLoading]);

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

  // ─── Date range ────────────────────────────────────────────────────────────
  const dateRange = useMemo(
    () => getDateRangeFromPeriod(periodFilter, fromDateText, toDateText),
    [periodFilter, fromDateText, toDateText],
  );

  // ─── Filter Items ──────────────────────────────────────────────────────────
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

  // ─── Group + totals ──────────────────────────────────────────────────────
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

  const handleSearchChange = useCallback((text) => {
    setSearchTerm(text);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setCurrentPage(1);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, []);

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

  const hasActiveFilters = useMemo(
    () => periodFilter !== 'all' || !!fromDateText || !!toDateText || !!searchTerm || !!selectedDate,
    [periodFilter, fromDateText, toDateText, searchTerm, selectedDate],
  );

  return {
    // Data
    rawItems,
    filteredItems,
    processedData,
    paginatedData,
    uniqueDates,
    totalPages,
    
    // State
    searchTerm,
    debouncedSearchTerm,
    selectedDate,
    currentPage,
    periodFilter,
    showDateFilter,
    fromDateText,
    toDateText,
    isInitialLoading,
    refreshing,
    hasActiveFilters,
    flatListRef,
    
    // Setters
    setFromDateText,
    setToDateText,
    
    // Handlers
    onRefresh,
    handleSearchChange,
    handleSearchClear,
    handlePeriodSelect,
    handleDateSelect,
    handleDateClear,
    resetFilters,
    handlePrevPage,
    handleNextPage,
  };
};