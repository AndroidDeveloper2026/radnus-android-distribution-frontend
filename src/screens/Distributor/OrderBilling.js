import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux"; // ✅ ADDED
import { ClipboardList, CheckCircle, Truck } from "lucide-react-native";
import styles from "./OrderBillingStyle";
import Header from "../../components/Header";
import { reduceStock } from "../../services/features/products/productSlice"; // ✅ ADDED

const TABS = ["PENDING", "APPROVED", "DISPATCHED"];

const INITIAL_ORDERS = [
  {
    id: "ORD-2001",
    retailer: "Sri Lakshmi Mobiles",
    amount: 18500,
    status: "PENDING",
    approvedBy: null,
    approvedDate: null,
    dispatchedBy: null,
    dispatchedDate: null,
    items: [{ productId: "prod123", name: "Fast Charger", qty: 5 }], // ✅ ensure productId exists
  },
  {
    id: "ORD-2002",
    retailer: "Mobile World",
    amount: 24500,
    status: "APPROVED",
    approvedBy: "Admin",
    approvedDate: new Date().toISOString(),
    dispatchedBy: null,
    dispatchedDate: null,
    items: [{ productId: "prod456", name: "Cable", qty: 10 }],
  },
];

const STATUS_COLORS = {
  PENDING: { bg: "#FFF3E0", text: "#E65100" },
  APPROVED: { bg: "#E8F5E9", text: "#2E7D32" },
  DISPATCHED: { bg: "#F3E5F5", text: "#6A1B9A" },
};

const OrderBilling = () => {
  const dispatch = useDispatch(); // ✅ ADDED
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState("PENDING");

  // ✅ Approve (unchanged)
  const handleApprove = (orderId) => {
    Alert.alert("Approve Order", `Approve ${orderId}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Approve",
        onPress: () => {
          setOrders((prev) =>
            prev.map((o) =>
              o.id === orderId
                ? {
                    ...o,
                    status: "APPROVED",
                    approvedBy: "Admin",
                    approvedDate: new Date().toISOString(),
                  }
                : o
            )
          );
        },
      },
    ]);
  };

  // ✅ Dispatch – now reduces stock via API
  const handleDispatch = async (order) => {
    // Prepare items for stock reduction (must match the format expected by reduceStock)
    const stockItems = order.items.map(item => ({
      productId: item.productId,   // ✅ must match the field name in your DB
      qty: item.qty,
    }));

    try {
      // ✅ Call real stock reduction API
      await dispatch(reduceStock(stockItems)).unwrap();

      // Update order status locally
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? {
                ...o,
                status: "DISPATCHED",
                dispatchedBy: "Admin",
                dispatchedDate: new Date().toISOString(),
              }
            : o
        )
      );

      Alert.alert("Success", "Order dispatched and stock updated.");
    } catch (err) {
      Alert.alert("Stock Error", err.message || "Failed to reduce stock");
    }
  };

  // Filter by tab
  const filteredOrders = orders.filter((o) => o.status === activeTab);

  const renderItem = ({ item }) => {
    const statusColor = STATUS_COLORS[item.status];

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconCircle}>
            <ClipboardList size={18} color="#D32F2F" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.orderId}>Order #{item.id}</Text>
            <Text style={styles.retailer}>{item.retailer}</Text>
            <Text style={styles.amount}>
              ₹{item.amount.toLocaleString()}
            </Text>

            {item.approvedBy && (
              <Text style={styles.metaText}>
                Approved by {item.approvedBy} on{" "}
                {new Date(item.approvedDate).toLocaleDateString()}
              </Text>
            )}

            {item.dispatchedBy && (
              <Text style={styles.metaText}>
                Dispatched by {item.dispatchedBy} on{" "}
                {new Date(item.dispatchedDate).toLocaleDateString()}
              </Text>
            )}
          </View>

          <View
            style={[
              styles.badge,
              { backgroundColor: statusColor.bg },
            ]}
          >
            <Text style={{ color: statusColor.text, fontSize: 11 }}>
              {item.status}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {item.status === "PENDING" && (
            <TouchableOpacity
              style={styles.approveBtn}
              onPress={() => handleApprove(item.id)}
            >
              <CheckCircle size={14} color="#FFF" />
              <Text style={styles.btnText}>Approve</Text>
            </TouchableOpacity>
          )}

          {item.status === "APPROVED" && (
            <TouchableOpacity
              style={styles.dispatchBtn}
              onPress={() => handleDispatch(item)}
            >
              <Truck size={14} color="#FFF" />
              <Text style={styles.btnText}>Dispatch</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Order Billing" />
      <View style={styles.tabContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

export default OrderBilling;