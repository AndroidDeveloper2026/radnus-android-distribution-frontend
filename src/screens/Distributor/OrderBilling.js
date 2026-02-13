import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import styles from "./OrderBillingStyle";
import Header from "../../components/Header";
import {
  ClipboardList,
  CheckCircle,
  FileText,
  Truck,
} from "lucide-react-native";

const ORDER_DATA = [
  {
    id: "ORD-2001",
    retailer: "Sri Lakshmi Mobiles",
    amount: 18500,
    status: "PENDING", // PENDING | APPROVED | INVOICED | DISPATCHED
  },
  {
    id: "ORD-2002",
    retailer: "Mobile World",
    amount: 24500,
    status: "APPROVED",
  },
];

const OrderBilling = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        {/* ICON */}
        <View style={styles.iconCircle}>
          <ClipboardList size={18} color="#D32F2F" />
        </View>

        {/* ORDER INFO */}
        <View style={{ flex: 1 }}>
          <Text style={styles.orderId}>Order #{item.id}</Text>
          <Text style={styles.retailer}>{item.retailer}</Text>
          <Text style={styles.amount}>
            ₹{item.amount.toLocaleString()}
          </Text>
        </View>

        {/* STATUS */}
        <Text style={styles.status}>{item.status}</Text>
      </View>

      {/* ACTIONS */}
      <View style={styles.actions}>
        {item.status === "PENDING" && (
          <TouchableOpacity style={styles.approveBtn}>
            <CheckCircle size={14} color="#FFF" />
            <Text style={styles.btnText}>Approve</Text>
          </TouchableOpacity>
        )}

        {item.status === "APPROVED" && (
          <TouchableOpacity style={styles.invoiceBtn}>
            <FileText size={14} color="#FFF" />
            <Text style={styles.btnText}>Generate Invoice</Text>
          </TouchableOpacity>
        )}

        {item.status === "INVOICED" && (
          <TouchableOpacity style={styles.dispatchBtn}>
            <Truck size={14} color="#FFF" />
            <Text style={styles.btnText}>Dispatch</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Order Billing" />

      <FlatList
        data={ORDER_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default OrderBilling;
