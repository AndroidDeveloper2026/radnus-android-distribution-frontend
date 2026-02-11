import React from "react";
import {
  View,
  Text,
  FlatList,
} from "react-native";
import styles from "./StockVisibilityStyle";
import Header from "../../components/Header";
import { Package, CheckCircle, AlertTriangle } from "lucide-react-native";

const STOCK_DATA = [
  {
    id: "1",
    name: "Samsung Charger",
    sku: "SAM-CHR-01",
    availableQty: 120,
    status: "IN_STOCK", // IN_STOCK | LOW_STOCK | OUT_OF_STOCK
  },
  {
    id: "2",
    name: "Mobile Cover",
    sku: "COV-RED-02",
    availableQty: 8,
    status: "LOW_STOCK",
  },
  {
    id: "3",
    name: "Bluetooth Headset",
    sku: "BT-HS-05",
    availableQty: 0,
    status: "OUT_OF_STOCK",
  },
];

const StockVisibility = () => {
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

        {/* STATUS */}
        <View style={styles.statusBox}>
          {item.status === "IN_STOCK" && (
            <>
              <CheckCircle size={16} color="#2E7D32" />
              <Text style={styles.inStock}>
                {item.availableQty}
              </Text>
            </>
          )}

          {item.status === "LOW_STOCK" && (
            <>
              <AlertTriangle size={16} color="#F57C00" />
              <Text style={styles.lowStock}>
                {item.availableQty}
              </Text>
            </>
          )}

          {item.status === "OUT_OF_STOCK" && (
            <Text style={styles.outStock}>Out</Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Stock Availability" />

      {/* INFO BANNER */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Stock shown is distributor availability.
          Actual dispatch depends on order approval.
        </Text>
      </View>

      <FlatList
        data={STOCK_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default StockVisibility;
