import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
} from "react-native";
import styles from "./StockVisibilityStyle";
import Header from "../../components/Header";
import { Package, CheckCircle, AlertTriangle, XCircle } from "lucide-react-native";
import {
  getAllStock,
  getStockStatus,
  subscribeStock,
} from "../../utils/Stockstore";

const StockVisibility = () => {

  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const unsub = subscribeStock(() => forceUpdate((n) => n + 1));
    return unsub;
  }, []);


  const stockData = getAllStock().map((item) => ({
    ...item,
    status: getStockStatus(item.qty),   // derived live
  }));

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        {/* ICON */}
        <View style={styles.iconCircle}>
          <Package size={18} color="#D32F2F" />
        </View>

        {/* PRODUCT INFO */}
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.sku}>SKU: {item.sku}</Text>
        </View>

        {/* ✅ Status derived from live qty */}
        <View style={styles.statusBox}>
          {item.status === "IN_STOCK" && (
            <>
              <CheckCircle size={16} color="#2E7D32" />
              <Text style={styles.inStock}>{item.qty}</Text>
            </>
          )}

          {item.status === "LOW_STOCK" && (
            <>
              <AlertTriangle size={16} color="#F57C00" />
              <Text style={styles.lowStock}>{item.qty}</Text>
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


  const inStockCount    = stockData.filter((i) => i.status === "IN_STOCK").length;
  const lowStockCount   = stockData.filter((i) => i.status === "LOW_STOCK").length;
  const outOfStockCount = stockData.filter((i) => i.status === "OUT_OF_STOCK").length;

  return (
    <View style={styles.container}>
      <Header title="Stock Visibility" />

      {/* INFO BANNER */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Stock shown is distributor availability.
          Actual dispatch depends on order approval.
        </Text>
      </View>

      {/* ✅ Live summary row */}
      <View style={summaryStyle.row}>
        <SummaryChip label="In Stock"  count={inStockCount}    color="#2E7D32" bg="#E8F5E9" />
        <SummaryChip label="Low"       count={lowStockCount}   color="#E65100" bg="#FFF3E0" />
        <SummaryChip label="Out"       count={outOfStockCount} color="#C62828" bg="#FFEBEE" />
      </View>

      <FlatList
        data={stockData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const SummaryChip = ({ label, count, color, bg }) => (
  <View style={[summaryStyle.chip, { backgroundColor: bg }]}>
    <Text style={[summaryStyle.count, { color }]}>{count}</Text>
    <Text style={[summaryStyle.label, { color }]}>{label}</Text>
  </View>
);

const summaryStyle = {
  row: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
  },
  chip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 10,
  },
  count: {
    fontSize: 18,
    fontWeight: "700",
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
};

export default StockVisibility;