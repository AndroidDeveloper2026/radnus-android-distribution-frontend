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

// ─── Helper functions (unchanged) ────────────────────────────────
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

  // ✅ CORRECTED: Simple item cost total (matches web dashboard)
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

  // ✅ CORRECTED: Inward / Outward (matches web dashboard)
  const computeInwardOutward = useCallback(async () => {
    if (products.length === 0) return;
    setInwardOutwardLoading(true);
    try {
      const today = new Date();

      // Inward: sum moq of products created today
      let todayInward = 0;
      products.forEach(product => {
        const createdAt = parseDate(product.createdAt);
        if (isSameDay(createdAt, today)) {
          todayInward += getNum(product, 'moq', 0);
        }
      });

      // Outward: sum quantities from today's completed invoices
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

  useEffect(() => {
    fetchTodaySales();
    computeItemCost();
    computeInwardOutward();
  }, [fetchTodaySales, computeItemCost, computeInwardOutward]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchTodaySales(),
      computeItemCost(),
      computeInwardOutward(),
    ]);
    setRefreshing(false);
  }, [fetchTodaySales, computeItemCost, computeInwardOutward]);

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
            label="Inward (Today)"
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
            label="Outward (Today)"
            onPress={handleOutwardPress}
          />
        </View>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
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
              name="Wallet"
              size={20}
              color="#F9A825"
              circleSize={40}
              withCircle
            />
          }
          label="Reports"
          onPress={() => navigation.navigate('Reports')}
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