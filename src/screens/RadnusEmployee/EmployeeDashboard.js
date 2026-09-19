import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './EmployeeDashboardStyle';
import Header from '../../components/Header';
import Icons from '../../components/Icon';
import { fetchProducts } from '../../services/features/products/productSlice';
import api from '../../services/API/api';

// ─── Helper functions ────────────────────────────────────────────────
const formatValue = num => {
  const value = Number(num);
  if (isNaN(value) || value === undefined) return '₹0';
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toFixed(2)}`;
};

const getNum = (obj, key, fallback = 0) => {
  if (obj[key] !== undefined && obj[key] !== null) {
    const val = Number(obj[key]);
    if (!isNaN(val)) return val;
  }
  const spacedKey = key + ' ';
  if (obj[spacedKey] !== undefined && obj[spacedKey] !== null) {
    const val = Number(obj[spacedKey]);
    if (!isNaN(val)) return val;
  }
  return fallback;
};

const getId = obj => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  if (obj.$oid) return obj.$oid;
  if (obj._id) return getId(obj._id);
  return obj;
};

const parseDate = dateValue => {
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

const isSameDay = (d1, d2) =>
  d1.getDate() === d2.getDate() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getFullYear() === d2.getFullYear();

// ─── EmployeeDashboard ────────────────────────────────────────────
const EmployeeDashboard = ({ navigation }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const user = useSelector(state => state.auth.user);
  const { list: products = [] } = useSelector(state => state.products) || {};

  const [todaySales, setTodaySales] = useState(0);
  const [todaySalesLoading, setTodaySalesLoading] = useState(true);
  const [totalItemCostValue, setTotalItemCostValue] = useState(0);
  const [itemCostLoading, setItemCostLoading] = useState(true);
  const [totalInward, setTotalInward] = useState(0);
  const [totalOutward, setTotalOutward] = useState(0);
  const [inwardOutwardLoading, setInwardOutwardLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  // Fetch today's completed sales for the logged-in user
  const fetchTodaySales = useCallback(async () => {
    setTodaySalesLoading(true);
    try {
      const response = await api.get(
        `/api/invoices?filter=today&billerName=${user?.name || ''}`,
      );
      const invoices = response.data || [];
      const total = invoices
        .filter(inv => inv?.status === 'completed')
        .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
      setTodaySales(total);
    } catch (error) {
      console.error("Failed to fetch today's sales:", error);
      setTodaySales(0);
    } finally {
      setTodaySalesLoading(false);
    }
  }, [user?.name]);

  // Compute item cost total
  const computeItemCost = useCallback(() => {
    setItemCostLoading(true);
    try {
      let totalCost = 0;
      products.forEach(product => {
        const stock = getNum(product, 'stock') || getNum(product, 'moq', 0);
        const itemCost = getNum(product, 'itemCost', 0);
        totalCost += stock * itemCost;
      });
      setTotalItemCostValue(totalCost);
    } catch (error) {
      console.error('Failed to compute item cost:', error);
      setTotalItemCostValue(0);
    } finally {
      setItemCostLoading(false);
    }
  }, [products]);

  // Compute inward/outward
  const computeInwardOutward = useCallback(async () => {
    if (products.length === 0) return;
    setInwardOutwardLoading(true);
    try {
      const today = new Date();

      let todayInward = 0;
      products.forEach(product => {
        const createdAt = parseDate(product.createdAt);
        if (isSameDay(createdAt, today)) {
          todayInward += getNum(product, 'moq', 0);
        }
      });

      const response = await api.get('/api/invoices?filter=today');
      const todayInvoices = (response.data || []).filter(
        inv => inv.status !== 'draft',
      );
      let todayOutward = 0;
      todayInvoices.forEach(invoice => {
        (invoice.items || []).forEach(item => {
          todayOutward += getNum(item, 'qty', 0);
        });
      });

      setTotalInward(todayInward);
      setTotalOutward(todayOutward);
    } catch (error) {
      console.error('Failed to compute inward/outward:', error);
      setTotalInward(0);
      setTotalOutward(0);
    } finally {
      setInwardOutwardLoading(false);
    }
  }, [products]);

  // Load data on mount and when user changes
  useEffect(() => {
    if (user?.name) {
      fetchTodaySales();
    }
  }, [user?.name, fetchTodaySales]);

  // Compute derived values when products change
  useEffect(() => {
    if (products.length > 0) {
      computeItemCost();
      computeInwardOutward();
    }
  }, [products, computeItemCost, computeInwardOutward]);

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (user?.name) {
        await fetchTodaySales();
      }
      if (products.length > 0) {
        computeItemCost();
        await computeInwardOutward();
      }
    } finally {
      setRefreshing(false);
    }
  }, [user?.name, products, fetchTodaySales, computeItemCost, computeInwardOutward]);

  const handleTodaySalesPress = () => {
    navigation.navigate('InvoiceListScreen', { filter: 'today' });
  };

  const handleItemCostValuePress = () => {
    navigation.navigate('StockVisibility');
  };

  const handleInwardPress = () => {
    navigation.navigate('CentralStock');
  };

  const handleOutwardPress = () => {
    navigation.navigate('InvoiceListScreen', { filter: 'today' });
  };

  return (
    <View style={styles.container}>
      <Header title="Radnus Sales Dashboard" showBackArrow={false} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 10 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2E7D32']}
            tintColor="#2E7D32"
          />
        }
      >
        <View style={styles.welcomeBox}>
          <Text style={styles.welcome}>Welcome, {user?.name || 'User'}</Text>
          <Text style={styles.subWelcome}>Business Overview</Text>
        </View>

        <View style={styles.grid}>
          <StatCard
            icon={
              <Icons
                name="IndianRupee"
                size={20}
                color="#2E7D32"
                circleSize={50}
                withCircle
                backgroundColor="#d9f5df"
              />
            }
            value={
              todaySalesLoading ? (
                <ActivityIndicator size="small" color="#2E7D32" />
              ) : (
                `₹${todaySales.toLocaleString('en-IN')}`
              )
            }
            label="Today Sales"
            onPress={handleTodaySalesPress}
          />
          <StatCard
            icon={
              <Icons
                name="Coins"
                size={20}
                color="#F9A825"
                circleSize={50}
                withCircle
                backgroundColor="#fff3e0"
              />
            }
            value={
              itemCostLoading ? (
                <ActivityIndicator size="small" color="#F9A825" />
              ) : (
                `₹${Math.round(totalItemCostValue).toLocaleString('en-IN')}`
              )
            }
            label="Item Cost Total"
            onPress={handleItemCostValuePress}
          />
          <StatCard
            icon={
              <Icons
                name="TrendingUp"
                size={20}
                color="#2E7D32"
                circleSize={50}
                withCircle
                backgroundColor="#d9f5df"
              />
            }
            value={
              inwardOutwardLoading ? (
                <ActivityIndicator size="small" color="#2E7D32" />
              ) : (
                `${totalInward} units`
              )
            }
            label="Inward"
            onPress={handleInwardPress}
          />
          <StatCard
            icon={
              <Icons
                name="TrendingDown"
                size={20}
                color="#D32F2F"
                circleSize={50}
                withCircle
                backgroundColor="#ffd6d6"
              />
            }
            value={
              inwardOutwardLoading ? (
                <ActivityIndicator size="small" color="#D32F2F" />
              ) : (
                `${totalOutward} units`
              )
            }
            label="Outward"
            onPress={handleOutwardPress}
          />
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        {/* ─── General Actions ────────────────────────────── */}
        <QuickAction
          icon={
            <Icons
              name="Users"
              size={20}
              color="#1976D2"
              circleSize={40}
              withCircle
            />
          }
          label="Customer Details"
          onPress={() => navigation.navigate('CustomerListScreen')}
        />
        <QuickAction
          icon={
            <Icons
              name="ClipboardList"
              size={20}
              color="#d3602f"
              circleSize={40}
              withCircle
            />
          }
          label="Invoice History"
          onPress={() => navigation.navigate('InvoiceListScreen')}
        />
        <QuickAction
          icon={
            <Icons
              name="Plus"
              size={20}
              color="#680303"
              circleSize={40}
              withCircle
            />
          }
          label="ProductMaster"
          onPress={() => navigation.navigate('ProductMaster')}
        />
        <QuickAction
          icon={
            <Icons
              name="Package"
              size={20}
              color="#D32F2F"
              circleSize={40}
              withCircle
            />
          }
          label="Stock Summary"
          onPress={() => navigation.navigate('StockVisibility')}
        />
        <QuickAction
          icon={
            <Icons
              name="Plus"
              size={20}
              color="#2E7D32"
              circleSize={40}
              withCircle
            />
          }
          label="Order Cart"
          onPress={() => navigation.navigate('OrderCart')}
        />
        <QuickAction
          icon={
            <Icons
              name="ClipboardList"
              size={20}
              color="#6A1B9A"
              circleSize={40}
              withCircle
            />
          }
          label="Central Stock"
          onPress={() => navigation.navigate('CentralStock')}
        />
        <QuickAction
          icon={
            <Icons
              name="RotateCcw"
              size={20}
              color="#ce7d21"
              circleSize={40}
              withCircle
            />
          }
          label="Sales Return"
          onPress={() => navigation.navigate('SalesReturnScreen')}
        />
        <QuickAction
          icon={
            <Icons
              name="PackageX"
              size={20}
              color="#D32F2F"
              circleSize={40}
              withCircle
            />
          }
          label="Purchase Return"
          onPress={() => navigation.navigate('PurchaseReturnScreen')}
        />
        <QuickAction
          icon={
            <Icons
              name="Wallet"
              size={20}
              color="#F9A825"
              circleSize={40}
              withCircle
            />
          }
          label="Order Billing"
          onPress={() => navigation.navigate('OrderBilling')}
        />
        <QuickAction
          icon={
            <Icons
              name="BarChart"
              size={20}
              color="#1565C0"
              circleSize={40}
              withCircle
            />
          }
          label="Reports"
          onPress={() => navigation.navigate('Reports')}
        />

        <QuickAction
          icon={
            <Icons
              name="FileSpreadsheet"
              size={20}
              color="#2E7D32"
              circleSize={40}
              withCircle
            />
          }
          label="Excel Export"
          onPress={() => navigation.navigate('ExcelExportScreen')}
        />

        <QuickAction
          icon={
            <Icons
              name="ArrowUp"
              size={20}
              color="#2E7D32"
              circleSize={40}
              withCircle
            />
          }
          label="Inward"
          onPress={() => navigation.navigate('InwardScreen')}
        />
        <QuickAction
          icon={
            <Icons
              name="ArrowDown"
              size={20}
              color="#D32F2F"
              circleSize={40}
              withCircle
            />
          }
          label="Outward"
          onPress={() => navigation.navigate('OutwardScreen')}
        />
      </ScrollView>
    </View>
  );
};

const StatCard = ({ icon, value, label, onPress }) => (
  <TouchableOpacity
    style={styles.statCard}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.statIcon}>{icon}</View>
    <Text style={styles.kpiValue}>{value}</Text>
    <Text style={styles.kpiLabel}>{label}</Text>
  </TouchableOpacity>
);

const QuickAction = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.actionRow} onPress={onPress}>
    <View style={styles.actionLeft}>
      <View style={styles.actionIcon}>{icon}</View>
      <Text style={styles.actionText}>{label}</Text>
    </View>
    <Text style={styles.arrow}>›</Text>
  </TouchableOpacity>
);

export default EmployeeDashboard;

//----------------- 31.08.2026 -------------------------
// import React, { useCallback, useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   RefreshControl,
// } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import styles from './EmployeeDashboardStyle';
// import Header from '../../components/Header';
// import Icons from '../../components/Icon';
// import { fetchProducts } from '../../services/features/products/productSlice';
// import api from '../../services/API/api';

// // ─── Helper functions ────────────────────────────────────────────────
// const formatValue = num => {
//   const value = Number(num);
//   if (isNaN(value) || value === undefined) return '₹0';
//   if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
//   if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
//   return `₹${value.toFixed(2)}`;
// };

// const getNum = (obj, key, fallback = 0) => {
//   if (obj[key] !== undefined && obj[key] !== null) {
//     const val = Number(obj[key]);
//     if (!isNaN(val)) return val;
//   }
//   const spacedKey = key + ' ';
//   if (obj[spacedKey] !== undefined && obj[spacedKey] !== null) {
//     const val = Number(obj[spacedKey]);
//     if (!isNaN(val)) return val;
//   }
//   return fallback;
// };

// const getId = obj => {
//   if (!obj) return '';
//   if (typeof obj === 'string') return obj;
//   if (obj.$oid) return obj.$oid;
//   if (obj._id) return getId(obj._id);
//   return obj;
// };

// const parseDate = dateValue => {
//   if (!dateValue) return new Date();
//   if (dateValue instanceof Date && !isNaN(dateValue)) return dateValue;
//   if (typeof dateValue === 'string') {
//     const parsed = new Date(dateValue);
//     return !isNaN(parsed) ? parsed : new Date();
//   }
//   if (typeof dateValue === 'object' && dateValue.$date) {
//     const parsed = new Date(dateValue.$date);
//     return !isNaN(parsed) ? parsed : new Date();
//   }
//   return new Date();
// };

// const isSameDay = (d1, d2) =>
//   d1.getDate() === d2.getDate() &&
//   d1.getMonth() === d2.getMonth() &&
//   d1.getFullYear() === d2.getFullYear();

// // ─── EmployeeDashboard ────────────────────────────────────────────
// const EmployeeDashboard = ({ navigation }) => {
//   const dispatch = useDispatch();
//   const insets = useSafeAreaInsets();
//   const user = useSelector(state => state.auth.user);
//   const { list: products = [] } = useSelector(state => state.products) || {};

//   const [todaySales, setTodaySales] = useState(0);
//   const [todaySalesLoading, setTodaySalesLoading] = useState(true);
//   const [totalItemCostValue, setTotalItemCostValue] = useState(0);
//   const [itemCostLoading, setItemCostLoading] = useState(true);
//   const [totalInward, setTotalInward] = useState(0);
//   const [totalOutward, setTotalOutward] = useState(0);
//   const [inwardOutwardLoading, setInwardOutwardLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     if (products.length === 0) {
//       dispatch(fetchProducts());
//     }
//   }, [dispatch, products.length]);

//   // Fetch today's completed sales for the logged-in user
//   const fetchTodaySales = useCallback(async () => {
//     setTodaySalesLoading(true);
//     try {
//       const response = await api.get(
//         `/api/invoices?filter=today&billerName=${user?.name || ''}`,
//       );
//       const invoices = response.data || [];
//       const total = invoices
//         .filter(inv => inv?.status === 'completed')
//         .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
//       setTodaySales(total);
//     } catch (error) {
//       console.error("Failed to fetch today's sales:", error);
//       setTodaySales(0);
//     } finally {
//       setTodaySalesLoading(false);
//     }
//   }, [user?.name]);

//   // Compute item cost total
//   const computeItemCost = useCallback(() => {
//     setItemCostLoading(true);
//     try {
//       let totalCost = 0;
//       products.forEach(product => {
//         const stock = getNum(product, 'stock') || getNum(product, 'moq', 0);
//         const itemCost = getNum(product, 'itemCost', 0);
//         totalCost += stock * itemCost;
//       });
//       setTotalItemCostValue(totalCost);
//     } catch (error) {
//       console.error('Failed to compute item cost:', error);
//       setTotalItemCostValue(0);
//     } finally {
//       setItemCostLoading(false);
//     }
//   }, [products]);

//   // Compute inward/outward
//   const computeInwardOutward = useCallback(async () => {
//     if (products.length === 0) return;
//     setInwardOutwardLoading(true);
//     try {
//       const today = new Date();

//       let todayInward = 0;
//       products.forEach(product => {
//         const createdAt = parseDate(product.createdAt);
//         if (isSameDay(createdAt, today)) {
//           todayInward += getNum(product, 'moq', 0);
//         }
//       });

//       const response = await api.get('/api/invoices?filter=today');
//       const todayInvoices = (response.data || []).filter(
//         inv => inv.status !== 'draft',
//       );
//       let todayOutward = 0;
//       todayInvoices.forEach(invoice => {
//         (invoice.items || []).forEach(item => {
//           todayOutward += getNum(item, 'qty', 0);
//         });
//       });

//       setTotalInward(todayInward);
//       setTotalOutward(todayOutward);
//     } catch (error) {
//       console.error('Failed to compute inward/outward:', error);
//       setTotalInward(0);
//       setTotalOutward(0);
//     } finally {
//       setInwardOutwardLoading(false);
//     }
//   }, [products]);

//   useEffect(() => {
//     fetchTodaySales();
//     computeItemCost();
//     computeInwardOutward();
//   }, [fetchTodaySales, computeItemCost, computeInwardOutward]);

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await Promise.all([
//       fetchTodaySales(),
//       computeItemCost(),
//       computeInwardOutward(),
//     ]);
//     setRefreshing(false);
//   }, [fetchTodaySales, computeItemCost, computeInwardOutward]);

//   const handleTodaySalesPress = () => {
//     navigation.navigate('InvoiceListScreen', { filter: 'today' });
//   };

//   const handleItemCostValuePress = () => {
//     navigation.navigate('StockVisibility');
//   };

//   const handleInwardPress = () => {
//     navigation.navigate('CentralStock');
//   };

//   const handleOutwardPress = () => {
//     navigation.navigate('InvoiceListScreen', { filter: 'today' });
//   };

//   return (
//     <View style={styles.container}>
//       <Header title="Radnus Sales Dashboard" showBackArrow={false} />
//       <ScrollView
//         contentContainerStyle={[
//           styles.content,
//           { paddingBottom: insets.bottom + 10 },
//         ]}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#2E7D32']}
//             tintColor="#2E7D32"
//           />
//         }
//       >
//         <View style={styles.welcomeBox}>
//           <Text style={styles.welcome}>Welcome, {user?.name || 'User'}</Text>
//           <Text style={styles.subWelcome}>Business Overview</Text>
//         </View>

//         <View style={styles.grid}>
//           <StatCard
//             icon={
//               <Icons
//                 name="IndianRupee"
//                 size={20}
//                 color="#2E7D32"
//                 circleSize={50}
//                 withCircle
//                 backgroundColor="#d9f5df"
//               />
//             }
//             value={
//               todaySalesLoading ? (
//                 <ActivityIndicator size="small" color="#2E7D32" />
//               ) : (
//                 `₹${todaySales.toLocaleString('en-IN')}`
//               )
//             }
//             label="Today Sales"
//             onPress={handleTodaySalesPress}
//           />
//           <StatCard
//             icon={
//               <Icons
//                 name="Coins"
//                 size={20}
//                 color="#F9A825"
//                 circleSize={50}
//                 withCircle
//                 backgroundColor="#fff3e0"
//               />
//             }
//             value={
//               itemCostLoading ? (
//                 <ActivityIndicator size="small" color="#F9A825" />
//               ) : (
//                 `₹${Math.round(totalItemCostValue).toLocaleString('en-IN')}`
//               )
//             }
//             label="Item Cost Total"
//             onPress={handleItemCostValuePress}
//           />
//           <StatCard
//             icon={
//               <Icons
//                 name="TrendingUp"
//                 size={20}
//                 color="#2E7D32"
//                 circleSize={50}
//                 withCircle
//                 backgroundColor="#d9f5df"
//               />
//             }
//             value={
//               inwardOutwardLoading ? (
//                 <ActivityIndicator size="small" color="#2E7D32" />
//               ) : (
//                 `${totalInward} units`
//               )
//             }
//             label="Inward"
//             onPress={handleInwardPress}
//           />
//           <StatCard
//             icon={
//               <Icons
//                 name="TrendingDown"
//                 size={20}
//                 color="#D32F2F"
//                 circleSize={50}
//                 withCircle
//                 backgroundColor="#ffd6d6"
//               />
//             }
//             value={
//               inwardOutwardLoading ? (
//                 <ActivityIndicator size="small" color="#D32F2F" />
//               ) : (
//                 `${totalOutward} units`
//               )
//             }
//             label="Outward"
//             onPress={handleOutwardPress}
//           />
//         </View>

//         <Text style={styles.sectionTitle}>Quick Actions</Text>

//         {/* ─── General Actions ────────────────────────────── */}
//         <QuickAction
//           icon={
//             <Icons
//               name="Users"
//               size={20}
//               color="#1976D2"
//               circleSize={40}
//               withCircle
//             />
//           }
//           label="Customer Details"
//           onPress={() => navigation.navigate('CustomerListScreen')}
//         />
//         <QuickAction
//           icon={
//             <Icons
//               name="ClipboardList"
//               size={20}
//               color="#d3602f"
//               circleSize={40}
//               withCircle
//             />
//           }
//           label="Invoice History"
//           onPress={() => navigation.navigate('InvoiceListScreen')}
//         />
//         <QuickAction
//           icon={
//             <Icons
//               name="Plus"
//               size={20}
//               color="#680303"
//               circleSize={40}
//               withCircle
//             />
//           }
//           label="ProductMaster"
//           onPress={() => navigation.navigate('ProductMaster')}
//         />
//         <QuickAction
//           icon={
//             <Icons
//               name="Package"
//               size={20}
//               color="#D32F2F"
//               circleSize={40}
//               withCircle
//             />
//           }
//           label="Stock Summary"
//           onPress={() => navigation.navigate('StockVisibility')}
//         />
//         <QuickAction
//           icon={
//             <Icons
//               name="Plus"
//               size={20}
//               color="#2E7D32"
//               circleSize={40}
//               withCircle
//             />
//           }
//           label="Order Cart"
//           onPress={() => navigation.navigate('OrderCart')}
//         />
//         <QuickAction
//           icon={
//             <Icons
//               name="ClipboardList"
//               size={20}
//               color="#6A1B9A"
//               circleSize={40}
//               withCircle
//             />
//           }
//           label="Central Stock"
//           onPress={() => navigation.navigate('CentralStock')}
//         />
//         <QuickAction
//           icon={
//             <Icons
//               name="RotateCcw"
//               size={20}
//               color="#ce7d21"
//               circleSize={40}
//               withCircle
//             />
//           }
//           label="Sales Return"
//           onPress={() => navigation.navigate('SalesReturnScreen')}
//         />
//         <QuickAction
//           icon={
//             <Icons
//               name="PackageX"
//               size={20}
//               color="#D32F2F"
//               circleSize={40}
//               withCircle
//             />
//           }
//           label="Purchase Return"
//           onPress={() => navigation.navigate('PurchaseReturnScreen')}
//         />
//         <QuickAction
//           icon={
//             <Icons
//               name="Wallet"
//               size={20}
//               color="#F9A825"
//               circleSize={40}
//               withCircle
//             />
//           }
//           label="Order Billing"
//           onPress={() => navigation.navigate('OrderBilling')}
//         />
//         <QuickAction
//           icon={
//             <Icons
//               name="BarChart"
//               size={20}
//               color="#1565C0"
//               circleSize={40}
//               withCircle
//             />
//           }
//           label="Reports"
//           onPress={() => navigation.navigate('Reports')}
//         />
//         <QuickAction
//           icon={
//             <Icons
//               name="FileSpreadsheet"
//               size={20}
//               color="#2E7D32"
//               circleSize={40}
//               withCircle
//             />
//           }
//           label="Excel Export"
//           onPress={() => navigation.navigate('ExcelExportScreen')}
//         />

//         {/* ─── PURCHASE MODULE ACTIONS ────────────────────── */}
//         <Text style={styles.sectionTitle}>Purchase Module</Text>

//         <QuickAction
//           icon={
//             <Icons
//               name="ShoppingCart"
//               size={20}
//               color="#4CAF50"
//               circleSize={40}
//               withCircle
//               backgroundColor="#E8F5E9"
//             />
//           }
//           label="New Purchase Entry"
//           onPress={() => navigation.navigate('PurchaseEntryScreen')}
//         />
//         <QuickAction
//           icon={
//             <Icons
//               name="History"
//               size={20}
//               color="#FF9800"
//               circleSize={40}
//               withCircle
//               backgroundColor="#FFF3E0"
//             />
//           }
//           label="Purchase History"
//           onPress={() => navigation.navigate('PurchaseHistoryScreen')}
//         />
//         <QuickAction
//           icon={
//             <Icons
//               name="Clock"
//               size={20}
//               color="#9C27B0"
//               circleSize={40}
//               withCircle
//               backgroundColor="#F3E5F5"
//             />
//           }
//           label="Price History"
//           onPress={() => navigation.navigate('PurchasePriceHistoryScreen')}
//         />
//         <QuickAction
//           icon={
//             <Icons
//               name="Database"
//               size={20}
//               color="#2196F3"
//               circleSize={40}
//               withCircle
//               backgroundColor="#E3F2FD"
//             />
//           }
//           label="Data Explorer"
//           onPress={() => navigation.navigate('DataExplorerScreen')}
//         />

//         {/* ─── STOCK MOVEMENT ACTIONS ────────────────────── */}
//         <Text style={styles.sectionTitle}>Stock Movement</Text>

//         <QuickAction
//           icon={
//             <Icons
//               name="ArrowUp"
//               size={20}
//               color="#2E7D32"
//               circleSize={40}
//               withCircle
//               backgroundColor="#E8F5E9"
//             />
//           }
//           label="Inward"
//           onPress={() => navigation.navigate('InwardScreen')}
//         />
//         <QuickAction
//           icon={
//             <Icons
//               name="ArrowDown"
//               size={20}
//               color="#D32F2F"
//               circleSize={40}
//               withCircle
//               backgroundColor="#FFEBEE"
//             />
//           }
//           label="Outward"
//           onPress={() => navigation.navigate('OutwardScreen')}
//         />
//       </ScrollView>
//     </View>
//   );
// };

// // ─── StatCard Component ──────────────────────────────────────────
// const StatCard = ({ icon, value, label, onPress }) => (
//   <TouchableOpacity
//     style={styles.statCard}
//     onPress={onPress}
//     activeOpacity={0.7}
//   >
//     <View style={styles.statIcon}>{icon}</View>
//     <Text style={styles.kpiValue}>{value}</Text>
//     <Text style={styles.kpiLabel}>{label}</Text>
//   </TouchableOpacity>
// );

// // ─── QuickAction Component ──────────────────────────────────────
// const QuickAction = ({ icon, label, onPress }) => (
//   <TouchableOpacity style={styles.actionRow} onPress={onPress}>
//     <View style={styles.actionLeft}>
//       <View style={styles.actionIcon}>{icon}</View>
//       <Text style={styles.actionText}>{label}</Text>
//     </View>
//     <Text style={styles.arrow}>›</Text>
//   </TouchableOpacity>
// );

// export default EmployeeDashboard;
