import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import styles from "./RetailerDashboardStyle";
import Header from "../../components/Header";
import {
  ShoppingCart,
  IndianRupee,
  Tag,
  ClipboardList,
  Package,
} from "lucide-react-native";

const RetailerDashboard = ({ navigation }) => {
  const stats = {
    lastOrder: 3200,
    outstanding: 5000,
    offers: 2,
    totalOrders: 45,
  };

  return (
    <View style={styles.container}>
      <Header title="Retailer Dashboard" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* WELCOME */}
        <View style={styles.welcomeBox}>
          <Text style={styles.welcome}>Welcome, Retailer User</Text>
          <Text style={styles.subWelcome}>Shop Management</Text>
        </View>

        {/* STATS GRID */}
        <View style={styles.grid}>
          <StatCard
            icon={<ShoppingCart size={18} color="#D32F2F" />}
            value={`₹${stats.lastOrder}`}
            label="Last Order"
          />
          <StatCard
            icon={<IndianRupee size={18} color="#F9A825" />}
            value={`₹${stats.outstanding}`}
            label="Outstanding Amount"
          />
          <StatCard
            icon={<Tag size={18} color="#2E7D32" />}
            value={stats.offers}
            label="Active Offers"
          />
          <StatCard
            icon={<ClipboardList size={18} color="#1976D2" />}
            value={stats.totalOrders}
            label="Total Orders"
          />
        </View>

        {/* CURRENT OFFERS */}
        <Text style={styles.sectionTitle}>Current Offers</Text>

        <View style={styles.offerCard}>
          <View>
            <Text style={styles.offerTitle}>
              10% Off on Product A
            </Text>
            <Text style={styles.offerSub}>
              Valid till Feb 28, 2026
            </Text>
          </View>

          <View style={styles.offerBadge}>
            <Text style={styles.offerBadgeText}>10% OFF</Text>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <QuickAction
          icon={<Package size={18} color="#D32F2F" />}
          label="View Product Catalog"
          onPress={() => navigation.navigate("ProductCatalog")}
        />

        <QuickAction
          icon={<ShoppingCart size={18} color="#2E7D32" />}
          label="Place New Order"
          onPress={() => navigation.navigate("PlaceOrder")}
        />

        <QuickAction
          icon={<ClipboardList size={18} color="#1976D2" />}
          label="View Order Status"
          onPress={() => navigation.navigate("OrderStatus")}
        />
      </ScrollView>
    </View>
  );
};

/* COMPONENTS */

const StatCard = ({ icon, value, label }) => (
  <View style={styles.statCard}>
    <View style={styles.statIcon}>{icon}</View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const QuickAction = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.actionRow} onPress={onPress}>
    <View style={styles.actionLeft}>
      <View style={styles.actionIcon}>{icon}</View>
      <Text style={styles.actionText}>{label}</Text>
    </View>
    <Text style={styles.arrow}>›</Text>
  </TouchableOpacity>
);

export default RetailerDashboard;
