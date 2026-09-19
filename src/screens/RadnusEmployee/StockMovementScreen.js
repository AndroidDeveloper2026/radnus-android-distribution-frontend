// import React, { useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { ArrowUp, ArrowDown } from 'lucide-react-native';
// import Header from '../../components/Header';
// import BaseStockMovement from './BaseStockMovement';
// import styles, { COLORS } from './StockMovementStyle';

// // Custom Tab Component
// const CustomTab = ({ activeTab, onSwitchTab }) => {
//   return (
//     <View style={styles.customTabContainer}>
//       <TouchableOpacity
//         style={[
//           styles.customTab,
//           activeTab === 'INWARD' && styles.customTabActive
//         ]}
//         onPress={() => onSwitchTab('INWARD')}
//         activeOpacity={0.7}
//       >
//         <ArrowUp 
//           size={16} 
//           color={activeTab === 'INWARD' ? '#fff' : COLORS.subText} 
//         />
//         <Text 
//           style={[
//             styles.customTabText,
//             activeTab === 'INWARD' && styles.customTabTextActive
//           ]}
//         >
//           Inward
//         </Text>
//       </TouchableOpacity>
      
//       <TouchableOpacity
//         style={[
//           styles.customTab,
//           activeTab === 'OUTWARD' && styles.customTabActive
//         ]}
//         onPress={() => onSwitchTab('OUTWARD')}
//         activeOpacity={0.7}
//       >
//         <ArrowDown 
//           size={16} 
//           color={activeTab === 'OUTWARD' ? '#fff' : COLORS.subText} 
//         />
//         <Text 
//           style={[
//             styles.customTabText,
//             activeTab === 'OUTWARD' && styles.customTabTextActive
//           ]}
//         >
//           Outward
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// // Main Component
// const StockMovementScreen = ({ navigation, route }) => {
//   const insets = useSafeAreaInsets();
//   const [activeTab, setActiveTab] = useState(route?.params?.initialTab || 'INWARD');

//   const handleSwitchTab = useCallback((tab) => {
//     setActiveTab(tab);
//   }, []);

//   return (
//     <SafeAreaView style={styles.safeContainer}>
//       <Header title="Stock Movement" showBackArrow navigation={navigation} />
      
//       <View style={styles.container}>
//         {/* Custom Tabs */}
//         <CustomTab activeTab={activeTab} onSwitchTab={handleSwitchTab} />
        
//         {/* Content based on active tab */}
//         <BaseStockMovement 
//           navigation={navigation} 
//           route={route} 
//           activeTab={activeTab}
//           title={activeTab === 'INWARD' ? 'Stock Movement - Inward' : 'Stock Movement - Outward'}
//           hideHeader={true}
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// export default StockMovementScreen;

// // // src/screens/RadnusEmployee/StockMovementScreen.js
// // import React, { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   ActivityIndicator,
// //   RefreshControl,
// //   ScrollView,
// //   FlatList,
// //   InteractionManager,
// // } from 'react-native';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // import {
// //   Search,
// //   X,
// //   Calendar,
// //   Package,
// //   ArrowUp,
// //   ArrowDown,
// //   User,
// //   UserCircle2,
// //   Clock,
// //   ChevronLeft,
// //   ChevronRight,
// //   PackageOpen,
// //   Receipt,
// // } from 'lucide-react-native';
// // import Header from '../../components/Header';
// // import { fetchProducts } from '../../services/features/products/productSlice';
// // import { fetchInvoices } from '../../services/features/retailer/invoiceSlice';
// // import styles, { COLORS } from './StockMovementStyle';

// // // ─── SUPER FAST HELPERS ──────────────────────────────────────────────
// // const formatValue = (num) => {
// //   const value = Number(num);
// //   if (isNaN(value)) return '₹0';
// //   if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
// //   if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
// //   return `₹${value.toFixed(2)}`;
// // };

// // const parseDate = (dateValue) => {
// //   if (!dateValue) return new Date();
// //   if (dateValue instanceof Date && !isNaN(dateValue)) return dateValue;
// //   if (typeof dateValue === 'string') {
// //     const parsed = new Date(dateValue);
// //     return !isNaN(parsed) ? parsed : new Date();
// //   }
// //   if (typeof dateValue === 'object' && dateValue.$date) {
// //     const parsed = new Date(dateValue.$date);
// //     return !isNaN(parsed) ? parsed : new Date();
// //   }
// //   return new Date();
// // };

// // const formatDate = (date) => {
// //   const d = new Date(date);
// //   return `${String(d.getDate()).padStart(2, '0')}-${d.toLocaleString('en', { month: 'short' })}-${d.getFullYear()}`;
// // };

// // const formatTime = (date) => {
// //   const d = new Date(date);
// //   const hours = d.getHours();
// //   const minutes = String(d.getMinutes()).padStart(2, '0');
// //   const ampm = hours >= 12 ? 'pm' : 'am';
// //   return `${hours % 12 || 12}:${minutes} ${ampm}`;
// // };

// // const getNum = (obj, key, fallback = 0) => {
// //   if (obj?.[key] !== undefined && obj[key] !== null) {
// //     const val = Number(obj[key]);
// //     if (!isNaN(val)) return val;
// //   }
// //   return fallback;
// // };

// // const getStr = (obj, key, fallback = '') =>
// //   obj?.[key] !== undefined && obj[key] !== null ? String(obj[key]).trim() : fallback;

// // const getId = (obj) => {
// //   if (!obj) return '';
// //   if (typeof obj === 'string') return obj;
// //   if (obj.$oid) return obj.$oid;
// //   return obj._id || obj.id || '';
// // };

// // // ─── Constants ──────────────────────────────────────────────────────────────
// // const PERIOD_OPTIONS = [
// //   { value: 'all', label: 'All' },
// //   { value: 'today', label: 'Today' },
// //   { value: 'yesterday', label: 'Yesterday' },
// //   { value: 'last7days', label: 'Last 7 Days' },
// //   { value: 'thisWeek', label: 'This Week' },
// //   { value: 'thisMonth', label: 'This Month' },
// //   { value: 'lastMonth', label: 'Last Month' },
// //   { value: 'custom', label: 'Custom' },
// // ];

// // const ITEMS_PER_PAGE = 10;
// // const SEARCH_DEBOUNCE_MS = 250;

// // // ─── Date range function ──────────────────────────────────────────────────────
// // const getDateRangeFromPeriod = (period, fromDateText, toDateText) => {
// //   if (period === 'custom') {
// //     const fromDate = fromDateText ? new Date(fromDateText) : null;
// //     let toDate = toDateText ? new Date(toDateText) : null;
// //     if (toDate) toDate.setHours(23, 59, 59, 999);
// //     return { fromDate, toDate };
// //   }

// //   const now = new Date();
// //   const start = new Date();
// //   const end = new Date();

// //   switch (period) {
// //     case 'today':
// //       start.setHours(0, 0, 0, 0);
// //       end.setHours(23, 59, 59, 999);
// //       break;
// //     case 'yesterday':
// //       start.setDate(now.getDate() - 1);
// //       start.setHours(0, 0, 0, 0);
// //       end.setDate(now.getDate() - 1);
// //       end.setHours(23, 59, 59, 999);
// //       break;
// //     case 'last7days':
// //       start.setDate(now.getDate() - 7);
// //       start.setHours(0, 0, 0, 0);
// //       end.setHours(23, 59, 59, 999);
// //       break;
// //     case 'thisWeek':
// //       start.setDate(now.getDate() - now.getDay());
// //       start.setHours(0, 0, 0, 0);
// //       end.setDate(start.getDate() + 6);
// //       end.setHours(23, 59, 59, 999);
// //       break;
// //     case 'thisMonth':
// //       start.setDate(1);
// //       start.setHours(0, 0, 0, 0);
// //       end.setMonth(now.getMonth() + 1, 0);
// //       end.setHours(23, 59, 59, 999);
// //       break;
// //     case 'lastMonth':
// //       start.setMonth(now.getMonth() - 1, 1);
// //       start.setHours(0, 0, 0, 0);
// //       end.setMonth(now.getMonth(), 0);
// //       end.setHours(23, 59, 59, 999);
// //       break;
// //     default:
// //       return { fromDate: null, toDate: null };
// //   }
// //   return { fromDate: start, toDate: end };
// // };

// // // ─── COMPONENTS ─────────────────────────────────────────────────────────────

// // const PeriodChip = memo(({ option, active, onPress }) => (
// //   <TouchableOpacity
// //     style={[styles.periodChip, active && styles.periodChipActive]}
// //     onPress={onPress}
// //     activeOpacity={0.7}
// //   >
// //     <Text style={[styles.periodChipText, active && styles.periodChipTextActive]}>
// //       {option.label}
// //     </Text>
// //   </TouchableOpacity>
// // ));

// // const DateChip = memo(({ date, active, onPress }) => (
// //   <TouchableOpacity
// //     style={[styles.dateChip, active && styles.dateChipActive]}
// //     onPress={onPress}
// //     activeOpacity={0.7}
// //   >
// //     <Text style={[styles.dateChipText, active && styles.dateChipTextActive]}>
// //       {date}
// //     </Text>
// //   </TouchableOpacity>
// // ));

// // // ─── MovementItemRow - Optimized ─────────────────────────────────────────────
// // const MovementItemRow = memo(({ item, activeTab }) => {
// //   const isInward = activeTab === 'INWARD';

// //   return (
// //     <View style={styles.movementItem}>
// //       <View style={[styles.itemIcon, isInward ? styles.iconInward : styles.iconOutward]}>
// //         {isInward ? <ArrowUp size={16} color={COLORS.green} /> : <ArrowDown size={16} color={COLORS.red} />}
// //       </View>
// //       <View style={styles.itemDetails}>
// //         <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
// //         <View style={styles.itemMeta}>
// //           <Text style={styles.metaChip}>SKU: {item.sku}</Text>
// //           {item.invoiceNumber && item.invoiceNumber !== 'N/A' && (
// //             <View style={styles.metaInline}>
// //               <Receipt size={10} color={COLORS.subText} />
// //               <Text style={styles.metaChip}> {item.invoiceNumber}</Text>
// //             </View>
// //           )}
// //           {item.customerName && item.customerName !== 'N/A' && (
// //             <View style={styles.metaInline}>
// //               <User size={10} color={COLORS.subText} />
// //               <Text style={styles.metaChip}> {item.customerName}</Text>
// //             </View>
// //           )}
// //           {item.salesperson && item.salesperson !== 'N/A' && (
// //             <View style={styles.metaInline}>
// //               <UserCircle2 size={10} color={COLORS.subText} />
// //               <Text style={styles.metaChip}> {item.salesperson}</Text>
// //             </View>
// //           )}
// //           <View style={styles.metaInline}>
// //             <Clock size={10} color={COLORS.subText} />
// //             <Text style={styles.metaChip}> {item.time}</Text>
// //           </View>
// //         </View>
// //       </View>
// //       <View style={styles.itemQty}>
// //         <Text style={[styles.qtyValue, isInward ? styles.positive : styles.negative]}>
// //           {isInward ? '+' : '-'}{item.qty}
// //         </Text>
// //         <Text style={styles.unitPrice}>{formatValue(item.price)}</Text>
// //         <Text style={styles.totalVal}>{formatValue(item.totalValue)}</Text>
// //       </View>
// //     </View>
// //   );
// // });

// // // ─── MovementGroup - Optimized ──────────────────────────────────────────────────────
// // const MovementGroup = memo(({ group, activeTab }) => {
// //   return (
// //     <View style={styles.group}>
// //       <View style={styles.groupHeader}>
// //         <View style={styles.groupDateRow}>
// //           <Calendar size={14} color={COLORS.redDark} />
// //           <Text style={styles.groupDateText}>{group.date}</Text>
// //         </View>
// //         <View style={styles.groupStats}>
// //           <View style={styles.metaInline}>
// //             <Package size={12} color={COLORS.subText} />
// //             <Text style={styles.groupQty}> {group.totalQty} units</Text>
// //           </View>
// //           <Text style={styles.groupValue}>{formatValue(group.totalValue)}</Text>
// //         </View>
// //       </View>
// //       {group.items.map((item, idx) => (
// //         <MovementItemRow key={`${item.id}_${idx}`} item={item} activeTab={activeTab} />
// //       ))}
// //     </View>
// //   );
// // });

// // const SummaryCards = memo(({ activeTab, totalQty, totalValue, groupCount }) => (
// //   <View style={styles.summaryRow}>
// //     <View style={styles.summaryCard}>
// //       <Text style={styles.summaryLabel}>Total {activeTab === 'INWARD' ? 'Added' : 'Sold'}</Text>
// //       <Text style={styles.summaryValue}>{totalQty.toLocaleString()} units</Text>
// //     </View>
// //     <View style={styles.summaryCard}>
// //       <Text style={styles.summaryLabel}>Total Value</Text>
// //       <Text style={styles.summaryValue}>{formatValue(totalValue)}</Text>
// //     </View>
// //     <View style={styles.summaryCard}>
// //       <Text style={styles.summaryLabel}>Days</Text>
// //       <Text style={styles.summaryValue}>{groupCount}</Text>
// //     </View>
// //   </View>
// // ));

// // // ─── PeriodChipRow ──────────────────────────────────────────────────
// // const PeriodChipRow = memo(({ periodFilter, onSelect }) => {
// //   const handlers = useMemo(
// //     () => PERIOD_OPTIONS.reduce((acc, o) => {
// //       acc[o.value] = () => onSelect(o.value);
// //       return acc;
// //     }, {}),
// //     [onSelect],
// //   );
// //   return (
// //     <ScrollView horizontal showsHorizontalScrollIndicator={false}>
// //       {PERIOD_OPTIONS.map((option) => (
// //         <PeriodChip
// //           key={option.value}
// //           option={option}
// //           active={periodFilter === option.value}
// //           onPress={handlers[option.value]}
// //         />
// //       ))}
// //     </ScrollView>
// //   );
// // });

// // // ─── DateChipRow ─────────────────────────────────────────────────────
// // const DateChipRow = memo(({ uniqueDates, selectedDate, onSelect, onClear }) => {
// //   const handlers = useMemo(
// //     () => uniqueDates.reduce((acc, date) => {
// //       acc[date] = () => onSelect(date);
// //       return acc;
// //     }, {}),
// //     [uniqueDates, onSelect],
// //   );
// //   return (
// //     <ScrollView horizontal showsHorizontalScrollIndicator={false}>
// //       {uniqueDates.map((date) => (
// //         <DateChip key={date} date={date} active={selectedDate === date} onPress={handlers[date]} />
// //       ))}
// //       {selectedDate ? (
// //         <TouchableOpacity style={styles.clearDateChip} onPress={onClear}>
// //           <X size={11} color={COLORS.redDark} />
// //           <Text style={styles.clearDateChipText}> Clear</Text>
// //         </TouchableOpacity>
// //       ) : null}
// //     </ScrollView>
// //   );
// // });

// // // ─── StockMovementHeader ─────────────────────────────────────────────────────
// // const StockMovementHeader = memo(({
// //   activeTab,
// //   onSwitchTab,
// //   searchValue,
// //   onSearchChange,
// //   onSearchClear,
// //   periodFilter,
// //   onPeriodSelect,
// //   hasActiveFilters,
// //   onResetFilters,
// //   showDateFilter,
// //   fromDateText,
// //   onFromDateChange,
// //   toDateText,
// //   onToDateChange,
// //   uniqueDates,
// //   selectedDate,
// //   onDateSelect,
// //   onDateClear,
// // }) => (
// //   <View>
// //     <View style={styles.tabRow}>
// //       {['INWARD', 'OUTWARD'].map((tab) => (
// //         <TouchableOpacity
// //           key={tab}
// //           style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
// //           onPress={() => onSwitchTab(tab)}
// //           activeOpacity={0.7}
// //         >
// //           {tab === 'INWARD'
// //             ? <ArrowUp size={15} color={activeTab === tab ? '#fff' : COLORS.subText} />
// //             : <ArrowDown size={15} color={activeTab === tab ? '#fff' : COLORS.subText} />}
// //           <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>
// //             {tab === 'INWARD' ? ' Inward' : ' Outward'}
// //           </Text>
// //         </TouchableOpacity>
// //       ))}
// //     </View>

// //     <View style={styles.searchWrapper}>
// //       <Search size={16} color={COLORS.subText} />
// //       <TextInput
// //         style={styles.searchInput}
// //         placeholder={`Search product, SKU${activeTab === 'OUTWARD' ? ', invoice, customer...' : '...'}`}
// //         placeholderTextColor={COLORS.muted}
// //         value={searchValue}
// //         onChangeText={onSearchChange}
// //         returnKeyType="search"
// //       />
// //       {searchValue ? (
// //         <TouchableOpacity onPress={onSearchClear} hitSlop={8}>
// //           <X size={16} color={COLORS.muted} />
// //         </TouchableOpacity>
// //       ) : null}
// //     </View>

// //     <View style={styles.filterRow}>
// //       <PeriodChipRow periodFilter={periodFilter} onSelect={onPeriodSelect} />
// //       {hasActiveFilters && (
// //         <TouchableOpacity style={styles.clearAllBtn} onPress={onResetFilters}>
// //           <Text style={styles.clearAllText}>Clear All</Text>
// //         </TouchableOpacity>
// //       )}
// //     </View>

// //     {showDateFilter && (
// //       <View style={styles.customDateRow}>
// //         <TextInput
// //           style={styles.dateInput}
// //           placeholder="From (YYYY-MM-DD)"
// //           placeholderTextColor={COLORS.muted}
// //           value={fromDateText}
// //           onChangeText={onFromDateChange}
// //         />
// //         <Text style={styles.dateSeparator}>→</Text>
// //         <TextInput
// //           style={styles.dateInput}
// //           placeholder="To (YYYY-MM-DD)"
// //           placeholderTextColor={COLORS.muted}
// //           value={toDateText}
// //           onChangeText={onToDateChange}
// //         />
// //       </View>
// //     )}

// //     {uniqueDates.length > 0 && (
// //       <View style={styles.quickDateSection}>
// //         <Text style={styles.quickDateLabel}>Quick Date:</Text>
// //         <DateChipRow
// //           uniqueDates={uniqueDates}
// //           selectedDate={selectedDate}
// //           onSelect={onDateSelect}
// //           onClear={onDateClear}
// //         />
// //       </View>
// //     )}
// //   </View>
// // ));

// // const EmptyState = memo(({ activeTab, hasActiveFilters }) => (
// //   <View style={styles.emptyState}>
// //     <PackageOpen size={44} color={COLORS.muted} />
// //     <Text style={styles.emptyTitle}>No {activeTab.toLowerCase()} records found</Text>
// //     <Text style={styles.emptySubtitle}>
// //       {hasActiveFilters
// //         ? 'Try changing your filters to see more results'
// //         : `When you ${activeTab === 'INWARD' ? 'add new products' : 'create invoices'}, they will appear here`}
// //     </Text>
// //   </View>
// // ));

// // const PaginationFooter = memo(({ currentPage, totalPages, onPrev, onNext }) => {
// //   if (totalPages <= 1) return null;
// //   return (
// //     <View style={styles.pagination}>
// //       <TouchableOpacity
// //         style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
// //         onPress={onPrev}
// //         disabled={currentPage === 1}
// //         activeOpacity={0.7}
// //       >
// //         <ChevronLeft size={14} color={currentPage === 1 ? COLORS.muted : COLORS.red} />
// //         <Text style={styles.pageBtnText}> Previous</Text>
// //       </TouchableOpacity>
// //       <Text style={styles.pageInfo}>Page {currentPage} of {totalPages}</Text>
// //       <TouchableOpacity
// //         style={[styles.pageBtn, currentPage === totalPages && styles.pageBtnDisabled]}
// //         onPress={onNext}
// //         disabled={currentPage === totalPages}
// //         activeOpacity={0.7}
// //       >
// //         <Text style={styles.pageBtnText}>Next </Text>
// //         <ChevronRight size={14} color={currentPage === totalPages ? COLORS.muted : COLORS.red} />
// //       </TouchableOpacity>
// //     </View>
// //   );
// // });

// // // ─── Main Screen Component ──────────────────────────────────────────────────

// // const StockMovementScreen = ({ navigation, route }) => {
// //   const dispatch = useDispatch();
// //   const insets = useSafeAreaInsets();

// //   // ─── State ──────────────────────────────────────────────────────────────────
// //   const [activeTab, setActiveTab] = useState(route?.params?.initialTab === 'OUTWARD' ? 'OUTWARD' : 'INWARD');
// //   const [refreshing, setRefreshing] = useState(false);
// //   // searchTerm = what's shown in the TextInput (updates instantly).
// //   // debouncedSearchTerm = what's actually used to filter (updates after a short pause).
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
// //   const [selectedDate, setSelectedDate] = useState(null);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [periodFilter, setPeriodFilter] = useState('all');
// //   const [showDateFilter, setShowDateFilter] = useState(false);
// //   const [fromDateText, setFromDateText] = useState('');
// //   const [toDateText, setToDateText] = useState('');
// //   const [isInitialLoading, setIsInitialLoading] = useState(true);

// //   const flatListRef = useRef(null);
// //   const searchTimeoutRef = useRef(null);

// //   // ─── Redux Selectors ──────────────────────────────────────────────────────
// //   const products = useSelector((state) => state.products?.list || []);
// //   const invoices = useSelector((state) => state.invoice?.data || []);

// //   // ─── Data Loading ──────────────────────────────────────────────────────────
// //   const loadData = useCallback(async (force = false) => {
// //     const tasks = [];
// //     if (force || products.length === 0) tasks.push(dispatch(fetchProducts()));
// //     if (force || invoices.length === 0) tasks.push(dispatch(fetchInvoices({ filter: 'all' })));
// //     if (tasks.length) await Promise.all(tasks);
// //   }, [dispatch, products.length, invoices.length]);

// //   useEffect(() => {
// //     let cancelled = false;
// //     const task = InteractionManager.runAfterInteractions(async () => {
// //       if (cancelled) return;
// //       await loadData();
// //       if (!cancelled) setIsInitialLoading(false);
// //     });
// //     return () => {
// //       cancelled = true;
// //       task.cancel?.();
// //     };
// //   }, []);

// //   // ─── Search debounce ───────────────────────────────────────────────────────
// //   // TextInput updates `searchTerm` immediately so typing feels instant.
// //   // The expensive filter/group work only runs against `debouncedSearchTerm`,
// //   // which updates SEARCH_DEBOUNCE_MS after the user stops typing.
// //   useEffect(() => {
// //     if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
// //     searchTimeoutRef.current = setTimeout(() => {
// //       setDebouncedSearchTerm(searchTerm);
// //       setCurrentPage(1);
// //       flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
// //     }, SEARCH_DEBOUNCE_MS);
// //     return () => clearTimeout(searchTimeoutRef.current);
// //   }, [searchTerm]);

// //   const handleSearchChange = useCallback((text) => {
// //     setSearchTerm(text);
// //   }, []);

// //   const handleSearchClear = useCallback(() => {
// //     setSearchTerm('');
// //     setDebouncedSearchTerm('');
// //     setCurrentPage(1);
// //     flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
// //   }, []);

// //   // ─── STAGE 1: Build raw items ────────────────────────────────────────────
// //   // Only re-runs when the source data or the active tab changes — NOT on
// //   // every keystroke, filter tweak, or page change. This is the expensive
// //   // part (date parsing/formatting over every product/invoice line), so it's
// //   // isolated from anything that changes more often.
// //   const rawItems = useMemo(() => {
// //     if (isInitialLoading || (!products.length && !invoices.length)) return [];

// //     let raw = [];
// //     const isInward = activeTab === 'INWARD';

// //     if (isInward) {
// //       const len = products.length;
// //       for (let i = 0; i < len; i++) {
// //         const product = products[i];
// //         const qty = getNum(product, 'moq', 0);
// //         if (qty > 0) {
// //           const createdAt = parseDate(product.createdAt);
// //           const price = getNum(product, 'walkinPrice', 0);
// //           raw.push({
// //             id: `in_${getId(product)}`,
// //             name: getStr(product, 'name'),
// //             sku: getStr(product, 'sku'),
// //             qty,
// //             price,
// //             date: createdAt,
// //             dateStr: formatDate(createdAt),
// //             time: formatTime(createdAt),
// //             totalValue: qty * price,
// //           });
// //         }
// //       }
// //     } else {
// //       const len = invoices.length;
// //       for (let i = 0; i < len; i++) {
// //         const invoice = invoices[i];
// //         const invDate = parseDate(invoice.createdAt);
// //         const items = invoice.items || [];
// //         const itemsLen = items.length;
// //         for (let j = 0; j < itemsLen; j++) {
// //           const item = items[j];
// //           const qty = getNum(item, 'qty');
// //           if (qty > 0) {
// //             const price = getNum(item, 'price');
// //             raw.push({
// //               id: `out_${getId(invoice)}_${j}`,
// //               name: getStr(item, 'name', 'N/A'),
// //               sku: getStr(item, 'sku', 'N/A'),
// //               qty,
// //               price,
// //               date: invDate,
// //               dateStr: formatDate(invDate),
// //               time: formatTime(invDate),
// //               invoiceNumber: getStr(invoice, 'invoiceNumber', 'N/A'),
// //               customerName: getStr(invoice, 'customerName', 'N/A'),
// //               salesperson: getStr(invoice, 'salesperson', 'N/A'),
// //               totalValue: qty * price,
// //             });
// //           }
// //         }
// //       }
// //     }

// //     raw.sort((a, b) => a.date - b.date);
// //     return raw;
// //   }, [activeTab, products, invoices, isInitialLoading]);

// //   // ─── Quick-date chips ───────────────────────────────────────────────────
// //   // Depends only on rawItems, so it doesn't recompute when the user searches
// //   // or changes the period/date filters.
// //   const uniqueDates = useMemo(() => {
// //     const dateMap = new Map();
// //     const rawLen = rawItems.length;
// //     for (let i = 0; i < rawLen && dateMap.size < 30; i++) {
// //       const item = rawItems[i];
// //       if (!dateMap.has(item.dateStr)) {
// //         dateMap.set(item.dateStr, item.date.getTime());
// //       }
// //     }
// //     return [...dateMap.entries()]
// //       .sort((a, b) => a[1] - b[1])
// //       .slice(0, 8)
// //       .map(([dateStr]) => dateStr);
// //   }, [rawItems]);

// //   // ─── Date range for the active period filter ────────────────────────────
// //   const dateRange = useMemo(
// //     () => getDateRangeFromPeriod(periodFilter, fromDateText, toDateText),
// //     [periodFilter, fromDateText, toDateText],
// //   );

// //   // ─── STAGE 2: Filter ──────────────────────────────────────────────────────
// //   // Runs against the already-built rawItems, so it's cheap even for large
// //   // datasets. Only depends on filter/search state, not on data rebuilding.
// //   const filteredItems = useMemo(() => {
// //     const { fromDate, toDate } = dateRange;
// //     const term = debouncedSearchTerm.toLowerCase().trim();

// //     if (!fromDate && !toDate && !term && !selectedDate) return rawItems;

// //     const result = [];
// //     const rawLen = rawItems.length;
// //     for (let i = 0; i < rawLen; i++) {
// //       const item = rawItems[i];
// //       if (selectedDate && item.dateStr !== selectedDate) continue;
// //       if (fromDate && item.date < fromDate) continue;
// //       if (toDate && item.date > toDate) continue;
// //       if (term) {
// //         const hay = `${item.name} ${item.sku} ${item.invoiceNumber || ''} ${item.customerName || ''} ${item.salesperson || ''}`.toLowerCase();
// //         if (!hay.includes(term)) continue;
// //       }
// //       result.push(item);
// //     }
// //     return result;
// //   }, [rawItems, dateRange, debouncedSearchTerm, selectedDate]);

// //   // ─── STAGE 3: Group + totals ──────────────────────────────────────────────
// //   const processedData = useMemo(() => {
// //     const groupsMap = {};
// //     const groupOrder = [];
// //     let totalQty = 0;
// //     let totalValue = 0;
// //     const filteredLen = filteredItems.length;

// //     for (let i = 0; i < filteredLen; i++) {
// //       const item = filteredItems[i];
// //       const dateStr = item.dateStr;
// //       let group = groupsMap[dateStr];
// //       if (!group) {
// //         group = { date: dateStr, items: [], totalQty: 0, totalValue: 0 };
// //         groupsMap[dateStr] = group;
// //         groupOrder.push(dateStr);
// //       }
// //       group.items.push(item);
// //       group.totalQty += item.qty;
// //       group.totalValue += item.totalValue;
// //       totalQty += item.qty;
// //       totalValue += item.totalValue;
// //     }

// //     const groups = groupOrder.map((d) => groupsMap[d]);
// //     return { groups, totalQty, totalValue };
// //   }, [filteredItems]);

// //   // ─── Pagination ────────────────────────────────────────────────────────────
// //   const totalPages = Math.max(1, Math.ceil(processedData.groups.length / ITEMS_PER_PAGE));

// //   const paginatedData = useMemo(
// //     () => processedData.groups.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
// //     [processedData.groups, currentPage],
// //   );

// //   // ─── Handlers ──────────────────────────────────────────────────────────────
// //   const onRefresh = useCallback(async () => {
// //     setRefreshing(true);
// //     await loadData(true);
// //     setRefreshing(false);
// //   }, [loadData]);

// //   const switchTab = useCallback((tab) => {
// //     setActiveTab(tab);
// //     setSelectedDate(null);
// //     setCurrentPage(1);
// //     setSearchTerm('');
// //     setDebouncedSearchTerm('');
// //     flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
// //   }, []);

// //   const handlePeriodSelect = useCallback((value) => {
// //     setPeriodFilter(value);
// //     setShowDateFilter(value === 'custom');
// //     if (value !== 'custom') {
// //       setFromDateText('');
// //       setToDateText('');
// //     }
// //     setCurrentPage(1);
// //   }, []);

// //   const handleDateSelect = useCallback((date) => {
// //     setSelectedDate((prev) => (prev === date ? null : date));
// //     setCurrentPage(1);
// //   }, []);

// //   const handleDateClear = useCallback(() => setSelectedDate(null), []);

// //   const resetFilters = useCallback(() => {
// //     setPeriodFilter('all');
// //     setFromDateText('');
// //     setToDateText('');
// //     setShowDateFilter(false);
// //     setSearchTerm('');
// //     setDebouncedSearchTerm('');
// //     setSelectedDate(null);
// //     setCurrentPage(1);
// //   }, []);

// //   const handlePrevPage = useCallback(() => setCurrentPage((p) => Math.max(1, p - 1)), []);
// //   const handleNextPage = useCallback(() => setCurrentPage((p) => Math.min(totalPages, p + 1)), [totalPages]);

// //   // ─── Memoized computed values ─────────────────────────────────────────────
// //   const hasActiveFilters = useMemo(
// //     () => periodFilter !== 'all' || !!fromDateText || !!toDateText || !!searchTerm || !!selectedDate,
// //     [periodFilter, fromDateText, toDateText, searchTerm, selectedDate],
// //   );

// //   // ─── Render Functions ──────────────────────────────────────────────────────
// //   const renderGroup = useCallback(
// //     ({ item }) => <MovementGroup group={item} activeTab={activeTab} />,
// //     [activeTab],
// //   );

// //   const keyExtractor = useCallback((item) => item.date, []);

// //   // ─── Memoized Header ──────────────────────────────────────────────────────
// //   const headerElement = useMemo(
// //     () => (
// //       <View>
// //         <StockMovementHeader
// //           activeTab={activeTab}
// //           onSwitchTab={switchTab}
// //           searchValue={searchTerm}
// //           onSearchChange={handleSearchChange}
// //           onSearchClear={handleSearchClear}
// //           periodFilter={periodFilter}
// //           onPeriodSelect={handlePeriodSelect}
// //           hasActiveFilters={hasActiveFilters}
// //           onResetFilters={resetFilters}
// //           showDateFilter={showDateFilter}
// //           fromDateText={fromDateText}
// //           onFromDateChange={setFromDateText}
// //           toDateText={toDateText}
// //           onToDateChange={setToDateText}
// //           uniqueDates={uniqueDates}
// //           selectedDate={selectedDate}
// //           onDateSelect={handleDateSelect}
// //           onDateClear={handleDateClear}
// //         />
// //         <SummaryCards
// //           activeTab={activeTab}
// //           totalQty={processedData.totalQty}
// //           totalValue={processedData.totalValue}
// //           groupCount={processedData.groups.length}
// //         />
// //       </View>
// //     ),
// //     [
// //       activeTab, switchTab, searchTerm, handleSearchChange, handleSearchClear,
// //       periodFilter, handlePeriodSelect, hasActiveFilters, resetFilters,
// //       showDateFilter, fromDateText, toDateText, uniqueDates,
// //       selectedDate, handleDateSelect, handleDateClear, processedData.totalQty,
// //       processedData.totalValue, processedData.groups.length,
// //     ],
// //   );

// //   const footerElement = useMemo(
// //     () => (
// //       <PaginationFooter
// //         currentPage={currentPage}
// //         totalPages={totalPages}
// //         onPrev={handlePrevPage}
// //         onNext={handleNextPage}
// //       />
// //     ),
// //     [currentPage, totalPages, handlePrevPage, handleNextPage],
// //   );

// //   const emptyElement = useMemo(
// //     () => <EmptyState activeTab={activeTab} hasActiveFilters={hasActiveFilters} />,
// //     [activeTab, hasActiveFilters],
// //   );

// //   // ─── Loading State ─────────────────────────────────────────────────────────
// //   if (isInitialLoading) {
// //     return (
// //       <View style={styles.container}>
// //         <Header title="Stock Movement" showBackArrow navigation={navigation} />
// //         <View style={styles.loadingContainer}>
// //           <ActivityIndicator size="large" color={COLORS.red} />
// //           <Text style={styles.loadingText}>Loading...</Text>
// //         </View>
// //       </View>
// //     );
// //   }

// //   // ─── Main Render ───────────────────────────────────────────────────────────
// //   return (
// //     <View style={styles.container}>
// //       <Header title="Stock Movement" showBackArrow navigation={navigation} />
// //       <FlatList
// //         ref={flatListRef}
// //         data={paginatedData}
// //         keyExtractor={keyExtractor}
// //         renderItem={renderGroup}
// //         ListHeaderComponent={headerElement}
// //         ListEmptyComponent={emptyElement}
// //         ListFooterComponent={footerElement}
// //         contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 16 }]}
// //         showsVerticalScrollIndicator={false}
// //         refreshControl={
// //           <RefreshControl
// //             refreshing={refreshing}
// //             onRefresh={onRefresh}
// //             colors={[COLORS.red]}
// //             tintColor={COLORS.red}
// //           />
// //         }
// //         initialNumToRender={5}
// //         maxToRenderPerBatch={5}
// //         updateCellsBatchingPeriod={30}
// //         windowSize={5}
// //         removeClippedSubviews
// //         keyboardShouldPersistTaps="handled"
// //         scrollEventThrottle={16}
// //         maintainVisibleContentPosition={{
// //           minIndexForVisible: 0,
// //         }}
// //       />
// //     </View>
// //   );
// // };

// // export default StockMovementScreen;