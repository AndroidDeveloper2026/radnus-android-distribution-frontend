
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import styles from "./CentralStockStyle";
import Header from "../../components/Header";
import {
  Package,
  TrendingUp,
  TrendingDown,
} from "lucide-react-native";

const OVERVIEW_DATA = [
  { id: "1", name: "Product A", sku: "RDN001", qty: 500, value: 42500 },
  { id: "2", name: "Product B", sku: "RDN002", qty: 500, value: 65000 },
  { id: "3", name: "Product C", sku: "RDN003", qty: 500, value: 85000 },
];

const INWARD_DATA = [
  { id: "1", name: "Product A", date: "30 Jan 2026", qty: 200 },
];

const OUTWARD_DATA = [
  { id: "1", name: "Product B - To Distributor", date: "29 Jan 2026", qty: 50 },
];

const CentralStock = () => {
  const [tab, setTab] = useState("OVERVIEW");

  const renderOverview = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.iconCircle}>
          <Package size={18} color="#D32F2F" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.sku}>SKU: {item.sku}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.valueRow}>
        <Text style={styles.label}>In Stock:</Text>
        <Text style={styles.bold}>{item.qty} units</Text>
      </View>

      <View style={styles.valueRow}>
        <Text style={styles.label}>Value:</Text>
        <Text style={styles.bold}>₹{item.value}</Text>
      </View>
    </View>
  );

  const renderInwardOutward = ({ item }, type) => (
    <View style={styles.historyCard}>
      <View style={styles.row}>
        {type === "INWARD" ? (
          <TrendingUp size={18} color="#2E7D32" />
        ) : (
          <TrendingDown size={18} color="#D32F2F" />
        )}

        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.name}>
            {item.name} - {type === "INWARD" ? "Inward" : ""}
          </Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>

        <Text
          style={[
            styles.qty,
            type === "INWARD" ? styles.inward : styles.outward,
          ]}
        >
          {type === "INWARD" ? "+" : "-"}
          {item.qty} units
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
            <Text
              style={[
                styles.tabText,
                tab === t && styles.activeTabText,
              ]}
            >
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* OVERVIEW */}
      {tab === "OVERVIEW" && (
        <>
          <View style={styles.totalCard}>
            <Text style={styles.totalValue}>₹15.2L</Text>
            <Text style={styles.totalLabel}>Total Stock Value</Text>
          </View>

          <FlatList
            data={OVERVIEW_DATA}
            keyExtractor={(item) => item.id}
            renderItem={renderOverview}
            contentContainerStyle={styles.list}
          />
        </>
      )}

      {/* INWARD */}
      {tab === "INWARD" && (
        <FlatList
          data={INWARD_DATA}
          keyExtractor={(item) => item.id}
          renderItem={(item) => renderInwardOutward(item, "INWARD")}
          contentContainerStyle={styles.list}
        />
      )}

      {/* OUTWARD */}
      {tab === "OUTWARD" && (
        <FlatList
          data={OUTWARD_DATA}
          keyExtractor={(item) => item.id}
          renderItem={(item) => renderInwardOutward(item, "OUTWARD")}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default CentralStock;
