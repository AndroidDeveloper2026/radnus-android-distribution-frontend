import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import styles from "./CentralStockStyle";
import Header from "../../components/Header";
import { Package, TrendingUp, TrendingDown, Boxes, BarChart3, Calendar, Clock, CalendarDays } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../services/features/products/productSlice";
import { fetchInvoices } from "../../services/features/retailer/invoiceSlice";

// ─── HELPER: Format ₹ value ────────────────────────
const formatValue = (num) => {
  const value = Number(num);
  if (isNaN(value) || value === undefined) return "₹0";
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`; 
  return `₹${value.toFixed(2)}`;
};

// ─── HELPER: Parse MongoDB $date format or any date ────────────────────────
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

// ─── HELPER: Get numeric value (handles trailing space keys) ────────────────────────
const getNum = (obj, key, fallback = 0) => {
  // Try exact key
  if (obj[key] !== undefined && obj[key] !== null) {
    const val = Number(obj[key]);
    if (!isNaN(val)) return val;
  }
  // Try with trailing space (your JSON has "key ": value)
  const spacedKey = key + ' ';
  if (obj[spacedKey] !== undefined && obj[spacedKey] !== null) {
    const val = Number(obj[spacedKey]);
    if (!isNaN(val)) return val;
  }
  return fallback;
};

// ─── HELPER: Get string value (handles trailing space keys) ────────────────────────
const getStr = (obj, key, fallback = '') => {
  if (obj[key] !== undefined && obj[key] !== null) return String(obj[key]).trim();
  const spacedKey = key + ' ';
  if (obj[spacedKey] !== undefined && obj[spacedKey] !== null) return String(obj[spacedKey]).trim();
  return fallback;
};

// ─── HELPER: Get ID from MongoDB _id format ────────────────────────
const getId = (obj) => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  if (obj.$oid) return obj.$oid;
  return obj;
};

// ─── Date Filter Helpers ────────────────────────
const isSameDay = (d1, d2) => 
  d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

const isThisWeek = (date) => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0,0,0,0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23,59,59,999);
  return date >= start && date <= end;
};

const isThisMonth = (date) => {
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

const filterByTimeRange = (data, timeFilter) => {
  if (timeFilter === 'all') return data;
  const now = new Date();
  return data.filter(item => {
    const itemDate = item._createdAt;
    if (!itemDate || isNaN(itemDate.getTime())) return false;
    if (timeFilter === 'day') return isSameDay(itemDate, now);
    if (timeFilter === 'week') return isThisWeek(itemDate);
    if (timeFilter === 'month') return isThisMonth(itemDate);
    return true;
  });
};

const STATUS_STYLE = {
  IN_STOCK: { bg: "#E8F5E9", text: "#2E7D32" },
  LOW_STOCK: { bg: "#FFF3E0", text: "#E65100" },
  OUT_OF_STOCK: { bg: "#FFEBEE", text: "#C62828" },
};

const CentralStock = () => {
  const [tab, setTab] = useState("OVERVIEW");
  const [timeFilter, setTimeFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  const { list: products = [], loading: productsLoading } = useSelector(state => state.products) || {};
  const { data: invoices = [], loading: invoicesLoading } = useSelector(state => state.invoice) || {};

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    await Promise.all([
      dispatch(fetchProducts()),
      dispatch(fetchInvoices("all"))
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // ─── Calculate Current Stock (FIXED: proper key access) ───
  const stockMap = useMemo(() => {
    if (!products.length) return {};
    const stock = {};
    
    products.forEach((product) => {
      const pid = getId(product._id);
      stock[pid] = {
        ...product,
        currentStock: getNum(product, 'stock') || getNum(product, 'moq') || 0,
        totalOutward: 0,
        walkinPrice: getNum(product, 'walkinPrice'),
        moq: getNum(product, 'moq'),
        name: getStr(product, 'name'),
        sku: getStr(product, 'sku'),
        rackNo: getStr(product, 'rackNo'),
        batchNo: getStr(product, 'batchNo'),
      };
    });
    
    invoices.forEach((invoice) => {
      (invoice.items || []).forEach((item) => {
        const pid = getId(item.productId);
        if (stock[pid]) {
          stock[pid].currentStock -= getNum(item, 'qty');
          stock[pid].totalOutward += getNum(item, 'qty');
        }
      });
    });
    
    Object.keys(stock).forEach((id) => {
      stock[id].currentStock = Math.max(0, stock[id].currentStock);
    });
    return stock;
  }, [products, invoices]);

  // ─── Overview Data (FIXED) ───
  const overviewData = useMemo(() => {
    return Object.values(stockMap).map((item) => ({
      id: getId(item._id),
      name: item.name,
      sku: item.sku,
      qty: item.currentStock,
      walkinPrice: item.walkinPrice,
      moq: item.moq,
      rackNo: item.rackNo,
      batchNo: item.batchNo,
    }));
  }, [stockMap]);

  // ─── INWARD Data (FIXED: proper date parsing) ───
  const inwardData = useMemo(() => {
    if (!products.length) return [];
    return products.map((product) => {
      const createdAt = parseDate(product.createdAt);
      const qty = getNum(product, 'moq');
      const price = getNum(product, 'walkinPrice');
      return {
        id: `inward_${getId(product._id)}`,
        type: "INWARD",
        name: getStr(product, 'name'),
        sku: getStr(product, 'sku'),
        qty,
        price,
        date: createdAt.toLocaleDateString(),
        time: createdAt.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),
        note: `Product added to stock`,
        totalValue: qty * price,
        _createdAt: createdAt,
      };
    }).sort((a, b) => b._createdAt - a._createdAt);
  }, [products]);

  // ─── OUTWARD Data (FIXED: proper date parsing) ───
  const outwardData = useMemo(() => {
    if (!invoices.length) return [];
    const outward = [];
    invoices.forEach((invoice) => {
      const invDate = parseDate(invoice.createdAt);
      (invoice.items || []).forEach((item) => {
        outward.push({
          id: `outward_${getId(invoice._id)}_${getId(item.productId)}`,
          type: "OUTWARD",
          name: getStr(item, 'name', 'N/A'),
          sku: getStr(item, 'sku', 'N/A'),
          qty: getNum(item, 'qty'),
          price: getNum(item, 'price'),
          date: invDate.toLocaleDateString(),
          time: invDate.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),
          invoiceNumber: getStr(invoice, 'invoiceNumber', 'N/A'),
          paymentMode: getStr(invoice, 'paymentMode', 'N/A'),
          note: `Invoice: ${getStr(invoice, 'invoiceNumber', 'N/A')} | Payment: ${getStr(invoice, 'paymentMode', 'N/A')}`,
          totalValue: getNum(item, 'qty') * getNum(item, 'price'),
          _createdAt: invDate,
        });
      });
    });
    return outward.sort((a, b) => b._createdAt - a._createdAt);
  }, [invoices]);

  const filteredInward = useMemo(() => filterByTimeRange(inwardData, timeFilter), [inwardData, timeFilter]);
  const filteredOutward = useMemo(() => filterByTimeRange(outwardData, timeFilter), [outwardData, timeFilter]);

  // ─── Total Stock Value (FIXED: now uses proper walkinPrice) ───
  const totalValue = useMemo(() => {
    return overviewData.reduce((sum, item) => {
      const val = (item.qty || 0) * (item.walkinPrice || 0);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  }, [overviewData]);

  const summaryStats = useMemo(() => ({
    totalProducts: overviewData.length,
    totalUnits: overviewData.reduce((s, i) => s + (i.qty || 0), 0),
    totalSold: outwardData.reduce((s, i) => s + (i.qty || 0), 0),
    totalAdded: inwardData.reduce((s, i) => s + (i.qty || 0), 0),
  }), [overviewData, outwardData, inwardData]);

  const getStockStatus = (currentStock, moq) => {
    if ((currentStock || 0) <= 0) return "OUT_OF_STOCK";
    if ((currentStock || 0) < (moq || 0)) return "LOW_STOCK";
    return "IN_STOCK";
  };

  const renderOverview = ({ item }) => {
    const status = getStockStatus(item.qty, item.moq);
    const statusStyle = STATUS_STYLE[status];
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconCircle}>
            <Package size={18} color="#D32F2F" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.sku}>SKU: {item.sku}</Text>
            {item.rackNo ? <Text style={styles.sku}>Rack: {item.rackNo}</Text> : null}
          </View>
          <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.badgeText, { color: statusStyle.text }]}>
              {status.replace("_", " ")}
            </Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.valueRow}>
          <Text style={styles.label}>Current Stock:</Text>
          <Text style={styles.bold}>{item.qty || 0} units</Text>
        </View>
        <View style={styles.valueRow}>
          <Text style={styles.label}>MOQ:</Text>
          <Text style={styles.bold}>{item.moq || 0} units</Text>
        </View>
        <View style={styles.valueRow}>
          <Text style={styles.label}>Stock Value:</Text>
          <Text style={styles.bold}>{formatValue((item.qty || 0) * (item.walkinPrice || 0))}</Text>
        </View>
        <View style={styles.valueRow}>
          <Text style={styles.label}>Price/Unit:</Text>
          <Text style={styles.bold}>{formatValue(item.walkinPrice)}</Text>
        </View>
      </View>
    );
  };

  const renderHistory = ({ item }) => (
    <View style={styles.historyCard}>
      <View style={styles.row}>
        {item.type === "INWARD" ? (
          <TrendingUp size={18} color="#2E7D32" />
        ) : (
          <TrendingDown size={18} color="#D32F2F" />
        )}
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.sku}>
            {item.type === "INWARD" ? "Stock Added" : "Stock Removed"} • {item.date} at {item.time}
          </Text>
          <Text style={styles.date}>{item.note}</Text>
          {item.invoiceNumber && item.invoiceNumber !== 'N/A' && <Text style={styles.sku}>Invoice: {item.invoiceNumber}</Text>}
          {item.paymentMode && item.paymentMode !== 'N/A' && <Text style={styles.sku}>Payment: {item.paymentMode}</Text>}
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.qty, item.type === "INWARD" ? styles.inward : styles.outward]}>
            {item.type === "INWARD" ? "+" : "-"}{item.qty || 0} units
          </Text>
          <Text style={styles.price}>{formatValue(item.price)}/unit</Text>
          <Text style={styles.totalAmount}>Total: {formatValue(item.totalValue)}</Text>
        </View>
      </View>
    </View>
  );

  if (productsLoading || invoicesLoading) {
    return (
      <View style={styles.container}>
        <Header title="Central Stock" />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#D32F2F" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Central Stock" />

      {/* TABS */}
      <View style={styles.tabs}>
        {["OVERVIEW", "INWARD", "OUTWARD"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.activeTab]}
            onPress={() => { setTab(t); setTimeFilter("all"); }}
          >
            <Text style={[styles.tabText, tab === t && styles.activeTabText]}>
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* TIME FILTER */}
      {(tab === "INWARD" || tab === "OUTWARD") && (
        <View style={styles.timeFilterRow}>
          {[
            { key: 'all', label: 'All', icon: Calendar },
            { key: 'day', label: 'Day', icon: Clock },
            { key: 'week', label: 'Week', icon: CalendarDays },
            { key: 'month', label: 'Month', icon: Calendar },
          ].map((filter) => {
            const Icon = filter.icon;
            return (
              <TouchableOpacity
                key={filter.key}
                style={[styles.timeFilterBtn, timeFilter === filter.key && styles.timeFilterBtnActive]}
                onPress={() => setTimeFilter(filter.key)}
              >
                <Icon size={12} color={timeFilter === filter.key ? "#fff" : "#666"} />
                <Text style={[styles.timeFilterText, timeFilter === filter.key && styles.timeFilterTextActive]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* OVERVIEW TAB */}
      {tab === "OVERVIEW" && (
        <>
          <View style={styles.totalCard}>
            <Text style={styles.totalValue}>{formatValue(totalValue)}</Text>
            <Text style={styles.totalLabel}>Total Stock Value (Walkin Price)</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <View style={styles.summaryItemLeft}>
                  <Boxes size={14} color="#FFFFFF" />
                  <Text style={styles.summaryText}>Products</Text>
                </View>
                <Text style={styles.summaryValue}>{summaryStats.totalProducts}</Text>
              </View>
              <View style={styles.summaryItem}>
                <View style={styles.summaryItemLeft}>
                  <BarChart3 size={14} color="#FFFFFF" />
                  <Text style={styles.summaryText}>Units</Text>
                </View>
                <Text style={styles.summaryValue}>{summaryStats.totalUnits}</Text>
              </View>
              <View style={styles.summaryItem}>
                <View style={styles.summaryItemLeft}>
                  <TrendingDown size={14} color="#FFFFFF" />
                  <Text style={styles.summaryText}>Sold</Text>
                </View>
                <Text style={styles.summaryValue}>{summaryStats.totalSold}</Text>
              </View>
              <View style={styles.summaryItem}>
                <View style={styles.summaryItemLeft}>
                  <TrendingUp size={14} color="#FFFFFF" />
                  <Text style={styles.summaryText}>Added</Text>
                </View>
                <Text style={styles.summaryValue}>{summaryStats.totalAdded}</Text>
              </View>
            </View>
          </View>
          <FlatList
            data={overviewData}
            keyExtractor={(item) => item.id}
            renderItem={renderOverview}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={<Text style={emptyStyle.text}>No products found</Text>}
          />
        </>
      )}

      {/* INWARD TAB */}
      {tab === "INWARD" && (
        <FlatList
          data={filteredInward}
          keyExtractor={(item) => item.id}
          renderItem={renderHistory}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={emptyStyle.container}>
              <Text style={emptyStyle.text}>
                {timeFilter === 'all' ? 'No inward records yet' : `No records for ${timeFilter}`}
              </Text>
              <Text style={emptyStyle.subText}>
                {timeFilter === 'all' 
                  ? 'When you add new products, they will appear here'
                  : `Try changing the time filter to see more records`}
              </Text>
            </View>
          }
        />
      )}

      {/* OUTWARD TAB */}
      {tab === "OUTWARD" && (
        <FlatList
          data={filteredOutward}
          keyExtractor={(item) => item.id}
          renderItem={renderHistory}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={emptyStyle.container}>
              <Text style={emptyStyle.text}>
                {timeFilter === 'all' ? 'No outward records yet' : `No records for ${timeFilter}`}
              </Text>
              <Text style={emptyStyle.subText}>
                {timeFilter === 'all' 
                  ? 'When you create invoices and sell products, they will appear here'
                  : `Try changing the time filter to see more records`}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const emptyStyle = {
  container: { padding: 20, alignItems: 'center', marginTop: 40 },
  text: { textAlign: "center", color: "#aaa", fontSize: 14, fontWeight: "600", marginBottom: 10 },
  subText: { textAlign: "center", color: "#ccc", fontSize: 12, lineHeight: 18 },
};

export default CentralStock;