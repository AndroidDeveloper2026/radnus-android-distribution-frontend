import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import styles from "./OrderBillingStyle";
import Header from "../../components/Header";
import { ClipboardList, CheckCircle, FileText, Truck } from "lucide-react-native";
import { deductOutward } from "../../utils/Stockstore";

const INITIAL_ORDERS = [
  {
    id: "ORD-2001",
    retailer: "Sri Lakshmi Mobiles",
    amount: 18500,
    status: "PENDING",
    invoiceNumber: "INV-2001",
    paymentMode: "cash",
    date: new Date().toISOString(),
    items: [
      { name: "Fast Charger 25W", sku: "FC-25W-01", retailerPrice: 850, qty: 5, moq: 5 },
    ],
  },
  {
    id: "ORD-2002",
    retailer: "Mobile World",
    amount: 24500,
    status: "APPROVED",
    invoiceNumber: "INV-2002",
    paymentMode: "credit",
    date: new Date().toISOString(),
    items: [
      { name: "Type-C Cable 1.5m", sku: "TC-CABLE-15", retailerPrice: 320, qty: 10, moq: 10 },
    ],
  },
];

const STATUS_COLORS = {
  PENDING:    { bg: "#FFF3E0", text: "#E65100" },
  APPROVED:   { bg: "#E8F5E9", text: "#2E7D32" },
  INVOICED:   { bg: "#E3F2FD", text: "#1565C0" },
  DISPATCHED: { bg: "#F3E5F5", text: "#6A1B9A" },
};

const OrderBilling = ({ navigation }) => {
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  const updateStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // PENDING → APPROVED
  const handleApprove = (orderId) => {
    Alert.alert("Approve Order", `Approve ${orderId}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Approve", onPress: () => updateStatus(orderId, "APPROVED") },
    ]);
  };

  // APPROVED → INVOICED + navigate to InvoiceScreen
  const handleGenerateInvoice = (order) => {
    updateStatus(order.id, "INVOICED");
    navigation.navigate("InvoiceScreen", {
      invoiceNumber: order.invoiceNumber,
      items:         order.items,
      total:         order.amount,
      paymentMode:   order.paymentMode,
      date:          order.date,
      buyerName:     order.retailer,
      buyerPhone:    "",
      buyerAddress:  "",
      buyerCity:     "",
      buyerState:    "",
      courierCharge: 80,
      salesperson:   "",
    });
  };

  // INVOICED → DISPATCHED + ✅ deduct stock from stockStore
  const handleDispatch = (order) => {
    Alert.alert("Mark as Dispatched", `Confirm dispatch for ${order.id}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Dispatch",
        onPress: () => {
          // ✅ Deduct stock — updates CentralStock & StockVisibility live
          const result = deductOutward(
            order.items,
            `Dispatched — Order ${order.id} to ${order.retailer}`
          );
          if (!result.success) {
            Alert.alert("Insufficient Stock", result.message);
            return;
          }
          updateStatus(order.id, "DISPATCHED");
        },
      },
    ]);
  };

  const renderItem = ({ item }) => {
    const statusColor = STATUS_COLORS[item.status] || STATUS_COLORS.PENDING;

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconCircle}>
            <ClipboardList size={18} color="#D32F2F" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.orderId}>Order #{item.id}</Text>
            <Text style={styles.retailer}>{item.retailer}</Text>
            <Text style={styles.amount}>₹{item.amount.toLocaleString()}</Text>
          </View>

          {/* Status badge */}
          <View style={[badgeStyle.badge, { backgroundColor: statusColor.bg }]}>
            <Text style={[badgeStyle.text, { color: statusColor.text }]}>
              {item.status}
            </Text>
          </View>
        </View>

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
              style={styles.invoiceBtn}
              onPress={() => handleGenerateInvoice(item)}
            >
              <FileText size={14} color="#FFF" />
              <Text style={styles.btnText}>Generate Invoice</Text>
            </TouchableOpacity>
          )}

          {item.status === "INVOICED" && (
            <TouchableOpacity
              style={styles.dispatchBtn}
              onPress={() => handleDispatch(item)}
            >
              <Truck size={14} color="#FFF" />
              <Text style={styles.btnText}>Dispatch</Text>
            </TouchableOpacity>
          )}

          {item.status === "DISPATCHED" && (
            <View style={badgeStyle.dispatchedRow}>
              <Truck size={14} color="#6A1B9A" />
              <Text style={badgeStyle.dispatchedText}>Dispatched</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Order Billing" />
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const badgeStyle = {
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
  },
  dispatchedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
  },
  dispatchedText: {
    color: "#6A1B9A",
    fontWeight: "600",
    fontSize: 13,
  },
};

export default OrderBilling;