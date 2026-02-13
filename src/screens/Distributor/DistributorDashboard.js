
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import styles from "./DistributorDashboardStyle";
import Header from "../../components/Header";
import {
  IndianRupee,
  Package,
  Users,
  Wallet,
  ClipboardList,
} from "lucide-react-native";

const DistributorDashboard = ({ navigation }) => {
  const stats = {
    todaySales: 42500,
    stockValue: 152000,
    pendingCollections: 38000,
    activeFSE: 6,
  };

  return (
    <View style={styles.container}>
      <Header title="Distributor Dashboard" showBackArrow={false}/>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* WELCOME */}
        <View style={styles.welcomeBox}>
          <Text style={styles.welcome}>Welcome, Distributor</Text>
          <Text style={styles.subWelcome}>Business Overview</Text>
        </View>

        {/* STATS GRID */}
        <View style={styles.grid}>
          <StatCard
            icon={<IndianRupee size={18} color="#2E7D32" />}
            value={`₹${stats.todaySales}`}
            label="Today Sales"
          />

          <StatCard
            icon={<Package size={18} color="#D32F2F" />}
            value={`₹${stats.stockValue}`}
            label="Stock Value"
          />

          <StatCard
            icon={<Wallet size={18} color="#F9A825" />}
            value={`₹${stats.pendingCollections}`}
            label="Pending Collections"
          />

          <StatCard
            icon={<Users size={18} color="#1976D2" />}
            value={stats.activeFSE}
            label="Active FSE"
          />
        </View>

        {/* QUICK ACTIONS */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <QuickAction
          icon={<Package size={18} color="#D32F2F" />}
          label="Stock Summary"
          onPress={() => navigation.navigate("StockSummary")}
        />

        <QuickAction
          icon={<Users size={18} color="#1976D2" />}
          label="Manage FSE"
          onPress={() => navigation.navigate("FSEManagement")}
        />

        <QuickAction
          icon={<ClipboardList size={18} color="#2E7D32" />}
          label="Retailer Orders"
          onPress={() => navigation.navigate("Orders")}
        />

        <QuickAction
          icon={<Wallet size={18} color="#F9A825" />}
          label="Collections"
          onPress={() => navigation.navigate("Collections")}
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

export default DistributorDashboard;
