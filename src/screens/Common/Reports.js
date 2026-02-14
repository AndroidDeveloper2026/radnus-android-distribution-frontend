import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import styles from "./ReportsStyle";
import Header from "../../components/Header";
import {
  TrendingUp,
  BarChart2,
} from "lucide-react-native";

const Reports = () => {
  const [tab, setTab] = useState("Sales");

  return (
    <View style={styles.container}>
      <Header title="Reports" />

      {/* TABS */}
      <View style={styles.tabs}>
        {["Sales", "Taluk", "Distributor", "Stock"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.tab, tab === item && styles.activeTab]}
            onPress={() => setTab(item)}
          >
            <Text
              style={[
                styles.tabText,
                tab === item && styles.activeTabText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* SALES REPORT */}
      {tab === "Sales" && (
        <View style={styles.content}>
          <ReportCard
            icon={<TrendingUp size={18} color="#D32F2F" />}
            title="Total Sales"
            value="₹12.5L"
            sub="This month"
          />

          <ReportCard
            icon={<BarChart2 size={18} color="#D32F2F" />}
            title="Average Order Value"
            value="₹3,250"
            sub="Per order"
          />
        </View>
      )}

      {/* PLACEHOLDER FOR OTHER TABS */}
      {tab !== "Sales" && (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            {tab} report coming here
          </Text>
        </View>
      )}
    </View>
  );
};

const ReportCard = ({ icon, title, value, sub }) => (
  <View style={styles.card}>
    <View style={styles.iconCircle}>{icon}</View>

    <View style={{flex: 1}}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardSub}>{sub}</Text>
    </View>
  </View>
);

export default Reports;
