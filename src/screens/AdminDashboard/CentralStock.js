import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import styles from "./CentralStockStyle";
import Header from "../../components/Header";
import { Package, TrendingUp, TrendingDown } from "lucide-react-native";
import {
  getAllStock,
  getStockStatus,
  getTotalStockValue,
  getInwardHistory,
  getOutwardHistory,
  subscribeStock,
} from "../../utils/Stockstore";

// Format ₹ value compactly  e.g. 192500 → ₹1.92L
const formatValue = (num) => {
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
  if (num >= 1000)   return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
};

const STATUS_STYLE = {
  IN_STOCK:     { bg: "#E8F5E9", text: "#2E7D32" },
  LOW_STOCK:    { bg: "#FFF3E0", text: "#E65100" },
  OUT_OF_STOCK: { bg: "#FFEBEE", text: "#C62828" },
};

const CentralStock = () => {
  const [tab, setTab] = useState("OVERVIEW");


  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const unsub = subscribeStock(() => forceUpdate((n) => n + 1));
    return unsub;
  }, []);


  const overviewData  = getAllStock();
  const inwardData    = getInwardHistory();
  const outwardData   = getOutwardHistory();
  const totalValue    = getTotalStockValue();


  const renderOverview = ({ item }) => {
    const status      = getStockStatus(item.qty);
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
          </View>

          {/* ✅ Live status badge */}
          <View style={[overviewBadge.badge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[overviewBadge.text, { color: statusStyle.text }]}>
              {status.replace("_", " ")}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.valueRow}>
          <Text style={styles.label}>In Stock:</Text>
          <Text style={styles.bold}>{item.qty} units</Text>
        </View>

        <View style={styles.valueRow}>
          <Text style={styles.label}>Value:</Text>
          {/* ✅ Live calculated value */}
          <Text style={styles.bold}>{formatValue(item.qty * item.retailerPrice)}</Text>
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
          <Text style={styles.name}>
            {item.name} — {item.type === "INWARD" ? "Inward" : "Outward"}
          </Text>
          <Text style={styles.date}>{item.date}</Text>
          {item.note ? <Text style={styles.sku}>{item.note}</Text> : null}
        </View>

        <Text
          style={[
            styles.qty,
            item.type === "INWARD" ? styles.inward : styles.outward,
          ]}
        >
          {item.type === "INWARD" ? "+" : "-"}{item.qty} units
        </Text>
      </View>
    </View>
  );

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

      {/* OVERVIEW */}
      {tab === "OVERVIEW" && (
        <>
          {/* ✅ Live total stock value */}
          <View style={styles.totalCard}>
            <Text style={styles.totalValue}>{formatValue(totalValue)}</Text>
            <Text style={styles.totalLabel}>Total Stock Value</Text>
          </View>

          <FlatList
            data={overviewData}
            keyExtractor={(item) => item.id}
            renderItem={renderOverview}
            contentContainerStyle={styles.list}
          />
        </>
      )}

      {/* INWARD — ✅ live from store */}
      {tab === "INWARD" && (
        <FlatList
          data={inwardData}
          keyExtractor={(item) => item.id}
          renderItem={renderHistory}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={emptyStyle.text}>No inward records yet.</Text>
          }
        />
      )}

      {/* OUTWARD — ✅ live from store */}
      {tab === "OUTWARD" && (
        <FlatList
          data={outwardData}
          keyExtractor={(item) => item.id}
          renderItem={renderHistory}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={emptyStyle.text}>No outward records yet.</Text>
          }
        />
      )}
    </View>
  );
};

const overviewBadge = {
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  text: {
    fontSize: 10,
    fontWeight: "700",
  },
};

const emptyStyle = {
  text: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 40,
    fontSize: 13,
  },
};

export default CentralStock;