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
import { Package, TrendingUp, TrendingDown, Boxes, BarChart3 } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../services/features/products/productSlice";
import { fetchInvoices } from "../../services/features/retailer/invoiceSlice";

// Format ₹ value compactly
const formatValue = (num) => {
  if (isNaN(num)) return "₹0";
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`; 
  return `₹${num}`;
};

const STATUS_STYLE = {
  IN_STOCK: { bg: "#E8F5E9", text: "#2E7D32" },
  LOW_STOCK: { bg: "#FFF3E0", text: "#E65100" },
  OUT_OF_STOCK: { bg: "#FFEBEE", text: "#C62828" },
};

const CentralStock = () => {
  const [tab, setTab] = useState("OVERVIEW");
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  // Get data from Redux
  const { list: products, loading: productsLoading } = useSelector(
    (state) => state.products || { list: [] }
  );
  const { data: invoices, loading: invoicesLoading } = useSelector(
    (state) => state.invoice || { data: [] }
  );

  useEffect(() => {
    loadData();
  }, [dispatch]);

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

  // ─── Calculate Current Stock (Starting from moq, reduce by sales) ───
  const stockMap = useMemo(() => {
    if (!products.length) return {};

    // Initialize stock with moq as the base stock quantity
    const stock = {};
    products.forEach((product) => {
      stock[product._id] = {
        ...product,
        currentStock: product.moq || 0,
        totalOutward: 0,
      };
    });

    // Process OUTWARD (Sales from invoices) - REDUCE stock
    invoices.forEach((invoice) => {
      invoice.items.forEach((item) => {
        if (stock[item.productId]) {
          stock[item.productId].currentStock -= item.qty;
          stock[item.productId].totalOutward += item.qty;
        }
      });
    });

    // Ensure stock never goes negative
    Object.keys(stock).forEach((id) => {
      stock[id].currentStock = Math.max(0, stock[id].currentStock);
    });

    return stock;
  }, [products, invoices]);

  // ─── Overview Data ───
  const overviewData = useMemo(() => {
    return Object.values(stockMap).map((item) => ({
      id: item._id,
      name: item.name,
      sku: item.sku,
      qty: item.currentStock,
      walkinPrice: item.walkinPrice,
      moq: item.moq,
      rackNo: item.rackNo,
      batchNo: item.batchNo,
    }));
  }, [stockMap]);

  // ─── INWARD Data (New products added) ───
  const inwardData = useMemo(() => {
    if (!products.length) return [];
    
    // Products that have been added (all products are inward when created)
    const inward = products.map((product) => ({
      id: `inward_${product._id}`,
      type: "INWARD",
      name: product.name,
      sku: product.sku,
      qty: product.moq || 0,
      price: product.walkinPrice,
      date: product.createdAt ? new Date(product.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
      time: product.createdAt ? new Date(product.createdAt).toLocaleTimeString() : new Date().toLocaleTimeString(),
      note: `Product added to stock`,
      totalValue: (product.moq || 0) * product.walkinPrice,
    }));
    
    return inward.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [products]);

  // ─── OUTWARD Data (Sales from invoices) ───
  const outwardData = useMemo(() => {
    if (!invoices.length) return [];
    
    const outward = [];
    invoices.forEach((invoice) => {
      invoice.items.forEach((item) => {
        outward.push({
          id: `outward_${invoice._id}_${item.productId}`,
          type: "OUTWARD",
          name: item.name,
          sku: item.sku || "N/A",
          qty: item.qty,
          price: item.price,
          date: new Date(invoice.createdAt).toLocaleDateString(),
          time: new Date(invoice.createdAt).toLocaleTimeString(),
          invoiceNumber: invoice.invoiceNumber,
          paymentMode: invoice.paymentMode,
          note: `Invoice: ${invoice.invoiceNumber} | Payment: ${invoice.paymentMode}`,
          totalValue: item.qty * item.price,
        });
      });
    });
    
    return outward.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [invoices]);

  // ─── Total Stock Value ───
  const totalValue = useMemo(() => {
    return overviewData.reduce((sum, item) => {
      return sum + (item.qty * item.walkinPrice);
    }, 0);
  }, [overviewData]);

  // ─── Summary Statistics ───
  const summaryStats = useMemo(() => {
    const totalProducts = overviewData.length;
    const totalUnits = overviewData.reduce((sum, item) => sum + item.qty, 0);
    const totalSold = outwardData.reduce((sum, item) => sum + item.qty, 0);
    const totalAdded = inwardData.reduce((sum, item) => sum + item.qty, 0);

    return {
      totalProducts,
      totalUnits,
      totalSold,
      totalAdded,
    };
  }, [overviewData, outwardData, inwardData]);

  const getStockStatus = (currentStock, moq) => {
    if (currentStock <= 0) return "OUT_OF_STOCK";
    if (currentStock < moq) return "LOW_STOCK";
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
          <Text style={styles.bold}>{item.qty} units</Text>
        </View>

        <View style={styles.valueRow}>
          <Text style={styles.label}>MOQ:</Text>
          <Text style={styles.bold}>{item.moq} units</Text>
        </View>

        <View style={styles.valueRow}>
          <Text style={styles.label}>Stock Value:</Text>
          <Text style={styles.bold}>{formatValue(item.qty * item.walkinPrice)}</Text>
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
          {item.invoiceNumber && (
            <Text style={styles.sku}>Invoice: {item.invoiceNumber}</Text>
          )}
          {item.paymentMode && (
            <Text style={styles.sku}>Payment: {item.paymentMode}</Text>
          )}
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text
            style={[
              styles.qty,
              item.type === "INWARD" ? styles.inward : styles.outward,
            ]}
          >
            {item.type === "INWARD" ? "+" : "-"}{item.qty} units
          </Text>
          <Text style={styles.price}>
            {formatValue(item.price)}/unit
          </Text>
          <Text style={styles.totalAmount}>
            Total: {formatValue(item.totalValue)}
          </Text>
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
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.activeTabText]}>
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* OVERVIEW TAB */}
      {tab === "OVERVIEW" && (
        <>
          {/* ✅ IMPROVED RED CARD - Compact with better details */}
          <View style={styles.totalCard}>
            {/* Main Amount */}
            <Text style={styles.totalValue}>{formatValue(totalValue)}</Text>
            
            {/* Subtitle */}
            <Text style={styles.totalLabel}>Total Stock Value (Walkin Price)</Text>

            {/* Summary Statistics with Icons */}
            <View style={styles.summaryRow}>
              {/* Products Count */}
              <View style={styles.summaryItem}>
                <View style={styles.summaryItemLeft}>
                  <Boxes size={14} color="#FFFFFF" />
                  <Text style={styles.summaryText}>Products</Text>
                </View>
                <View style={styles.summaryItemRight}>
                  <Text style={styles.summaryValue}>{summaryStats.totalProducts}</Text>
                </View>
              </View>

              {/* Total Units */}
              <View style={styles.summaryItem}>
                <View style={styles.summaryItemLeft}>
                  <BarChart3 size={14} color="#FFFFFF" />
                  <Text style={styles.summaryText}>Units</Text>
                </View>
                <View style={styles.summaryItemRight}>
                  <Text style={styles.summaryValue}>{summaryStats.totalUnits}</Text>
                </View>
              </View>

              {/* Sold Units */}
              <View style={styles.summaryItem}>
                <View style={styles.summaryItemLeft}>
                  <TrendingDown size={14} color="#FFFFFF" />
                  <Text style={styles.summaryText}>Sold</Text>
                </View>
                <View style={styles.summaryItemRight}>
                  <Text style={styles.summaryValue}>{summaryStats.totalSold}</Text>
                </View>
              </View>

              {/* Added Units */}
              <View style={styles.summaryItem}>
                <View style={styles.summaryItemLeft}>
                  <TrendingUp size={14} color="#FFFFFF" />
                  <Text style={styles.summaryText}>Added</Text>
                </View>
                <View style={styles.summaryItemRight}>
                  <Text style={styles.summaryValue}>{summaryStats.totalAdded}</Text>
                </View>
              </View>
            </View>
          </View>

          <FlatList
            data={overviewData}
            keyExtractor={(item) => item.id}
            renderItem={renderOverview}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <Text style={emptyStyle.text}>No products found</Text>
            }
          />
        </>
      )}

      {/* INWARD TAB - Shows products added to stock */}
      {tab === "INWARD" && (
        <FlatList
          data={inwardData}
          keyExtractor={(item) => item.id}
          renderItem={renderHistory}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={emptyStyle.container}>
              <Text style={emptyStyle.text}>No inward records yet</Text>
              <Text style={emptyStyle.subText}>
                When you add new products, they will appear here
              </Text>
            </View>
          }
        />
      )}

      {/* OUTWARD TAB - Shows products sold via invoices */}
      {tab === "OUTWARD" && (
        <FlatList
          data={outwardData}
          keyExtractor={(item) => item.id}
          renderItem={renderHistory}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={emptyStyle.container}>
              <Text style={emptyStyle.text}>No outward records yet</Text>
              <Text style={emptyStyle.subText}>
                When you create invoices and sell products, they will appear here
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const emptyStyle = {
  container: {
    padding: 20,
    alignItems: 'center',
    marginTop: 40,
  },
  text: {
    textAlign: "center",
    color: "#aaa",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  subText: {
    textAlign: "center",
    color: "#ccc",
    fontSize: 12,
    lineHeight: 18,
  },
};

export default CentralStock;