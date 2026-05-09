import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styles from "./StockVisibilityStyle";
import Header from "../../components/Header";
import { Package, CheckCircle, AlertTriangle, XCircle } from "lucide-react-native";
import { fetchProducts } from "../../services/features/products/productSlice";
import { fetchInvoices } from "../../services/features/retailer/invoiceSlice";

const LOW_STOCK_THRESHOLD = 10;

// Same helpers as web for consistency
const getNum = (obj, key, fallback = 0) => {
  if (obj?.[key] !== undefined && obj?.[key] !== null) {
    const val = Number(obj[key]);
    if (!isNaN(val)) return val;
  }
  const spacedKey = key + ' ';
  if (obj?.[spacedKey] !== undefined && obj?.[spacedKey] !== null) {
    const val = Number(obj[spacedKey]);
    if (!isNaN(val)) return val;
  }
  return fallback;
};

const getStr = (obj, key, fallback = '') => {
  if (obj?.[key] !== undefined && obj?.[key] !== null) return String(obj[key]).trim();
  const spacedKey = key + ' ';
  if (obj?.[spacedKey] !== undefined && obj?.[spacedKey] !== null) return String(obj[spacedKey]).trim();
  return fallback;
};

const getId = (obj) => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  if (obj.$oid) return obj.$oid;
  return obj._id || obj.id;
};

const StockVisibility = () => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);

  const { list: products = [], loading: productsLoading } = useSelector(state => state.products) || {};
  const { data: invoices = [], loading: invoicesLoading } = useSelector(state => state.invoice) || {};

  const loadData = async () => {
    await Promise.all([
      dispatch(fetchProducts()),
      dispatch(fetchInvoices("all")),
    ]);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // 📊 Compute available stock = moq - sold
  const stockData = useMemo(() => {
    if (!products.length) return [];

    const stockMap = new Map();
    products.forEach(product => {
      const id = getId(product._id);
      const moq = getNum(product, 'moq', 0);
      stockMap.set(id, {
        id,
        name: getStr(product, 'name'),
        sku: getStr(product, 'sku'),
        availableStock: moq,
      });
    });

    invoices.forEach(invoice => {
      (invoice.items || []).forEach(item => {
        const prodId = getId(item.productId);
        if (stockMap.has(prodId)) {
          const sold = getNum(item, 'qty', 0);
          const current = stockMap.get(prodId).availableStock;
          stockMap.get(prodId).availableStock = Math.max(0, current - sold);
        }
      });
    });

    return Array.from(stockMap.values()).map(item => ({
      ...item,
      status: item.availableStock <= 0 ? 'OUT_OF_STOCK'
            : item.availableStock <= LOW_STOCK_THRESHOLD ? 'LOW_STOCK'
            : 'IN_STOCK'
    }));
  }, [products, invoices]);

  const inStockCount    = stockData.filter(i => i.status === "IN_STOCK").length;
  const lowStockCount   = stockData.filter(i => i.status === "LOW_STOCK").length;
  const outOfStockCount = stockData.filter(i => i.status === "OUT_OF_STOCK").length;

  const filteredData = useMemo(() => {
    if (!activeFilter) return stockData;
    return stockData.filter(item => item.status === activeFilter);
  }, [stockData, activeFilter]);

  const handleFilterPress = (filter) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.iconCircle}>
          <Package size={18} color="#D32F2F" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.sku}>SKU: {item.sku}</Text>
        </View>
        <View style={styles.statusBox}>
          {item.status === "IN_STOCK" && (
            <>
              <CheckCircle size={16} color="#2E7D32" />
              <Text style={styles.inStock}>{item.availableStock}</Text>
            </>
          )}
          {item.status === "LOW_STOCK" && (
            <>
              <AlertTriangle size={16} color="#F57C00" />
              <Text style={styles.lowStock}>{item.availableStock}</Text>
            </>
          )}
          {item.status === "OUT_OF_STOCK" && (
            <>
              <XCircle size={16} color="#C62828" />
              <Text style={styles.outStock}>Out</Text>
            </>
          )}
        </View>
      </View>
    </View>
  );

  if (productsLoading || invoicesLoading) {
    return (
      <View style={styles.container}>
        <Header title="Stock Visibility" />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#D32F2F" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Stock Visibility" />
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Stock shown is distributor availability. Actual dispatch depends on order approval.
        </Text>
      </View>

      <View style={summaryStyle.row}>
        <SummaryChip
          label="In Stock"
          count={inStockCount}
          color="#2E7D32"
          bg="#E8F5E9"
          active={activeFilter === "IN_STOCK"}
          onPress={() => handleFilterPress("IN_STOCK")}
        />
        <SummaryChip
          label="Low"
          count={lowStockCount}
          color="#E65100"
          bg="#FFF3E0"
          active={activeFilter === "LOW_STOCK"}
          onPress={() => handleFilterPress("LOW_STOCK")}
        />
        <SummaryChip
          label="Out"
          count={outOfStockCount}
          color="#C62828"
          bg="#FFEBEE"
          active={activeFilter === "OUT_OF_STOCK"}
          onPress={() => handleFilterPress("OUT_OF_STOCK")}
        />
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              {activeFilter
                ? `No products with "${activeFilter.replace('_', ' ')}" status.`
                : "No products found."}
            </Text>
          </View>
        }
      />
    </View>
  );
};

// Same chip component as before – unchanged
const SummaryChip = ({ label, count, color, bg, active, onPress }) => (
  <TouchableOpacity
    style={[
      summaryStyle.chip,
      { backgroundColor: bg },
      active && summaryStyle.activeChip,
    ]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[summaryStyle.count, { color }]}>{count}</Text>
    <Text style={[summaryStyle.label, { color }]}>{label}</Text>
  </TouchableOpacity>
);

const summaryStyle = {
  row: { flexDirection: "row", paddingHorizontal: 16, paddingBottom: 12, gap: 12 },
  chip: {
    flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 12,
    borderWidth: 1.5, borderColor: "transparent",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
  },
  activeChip: { borderColor: "#D32F2F", borderWidth: 2, backgroundColor: "#FFF8E1", transform: [{ scale: 1.02 }] },
  count: { fontSize: 20, fontWeight: "700" },
  label: { fontSize: 12, fontWeight: "600", marginTop: 4, letterSpacing: 0.3 },
};

export default StockVisibility;