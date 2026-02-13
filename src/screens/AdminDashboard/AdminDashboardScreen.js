import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import styles from "./AdminDashboardStyle";
import Header from "../../components/Header";
import Icons from "../../components/Icon";
import Color from "../../utils/constants/colors"

// import { TrendingUp, Users, UserCheck, Package, AlertCircle, BarChart3 } from 'lucide-react-native';


const AdminDashboard = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header title="Admin Dashboard" showBackArrow={false} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* 📊 OVERALL SALES */}
          <Text style={styles.sectionTitle}>Overall Sales</Text>

          <View style={styles.kpiRow}>
            <View style={styles.kpiBox}>
              <Icons name={"TrendingUp"} size={25} color={Color.success} circleSize={55} withCircle={true} backgroundColor="#c6ffe1a0"/>
              <Text style={styles.kpiLabel}>Today Sales</Text>
              <Text style={styles.kpiValue}>₹ 1,25,000</Text>
            </View>

            <View style={styles.kpiBox}>
               <Icons name={"CalendarDays"} size={25} color="#BB5cf6" circleSize={55} withCircle={true} backgroundColor="#edcfff78"/>
              <Text style={styles.kpiLabel}>This Month</Text>
              <Text style={styles.kpiValue}>₹ 18,40,000</Text>
            </View>
          </View>

          <View style={styles.kpiRow}>
            <View style={styles.kpiBox}>
                <Icons name={"UsersRound"} size={25} color="#4b4efc" circleSize={55} withCircle={true} backgroundColor="#bebffe92"/>
              <Text style={styles.kpiLabel}>Total Distributors</Text>
              <Text style={styles.kpiValue}>32</Text>
            </View>

            <View style={styles.kpiBox}>
                <Icons name={"UserCheck"} size={25} color="#F59E0B" circleSize={55} withCircle={true} backgroundColor="#fee7beb3"/>
              <Text style={styles.kpiLabel}>Active Retailers</Text>
              <Text style={styles.kpiValue}>1,248</Text>
            </View>
          </View>

          {/* ⚙️ OPERATIONS */}
          <Text style={styles.sectionTitle}>Operations</Text>

          <View style={styles.kpiRow}>
            <View style={styles.kpiBox}>
              <Icons name={"UserCheck"} size={25} color="#0babf5" circleSize={55} withCircle={true} backgroundColor="#b4e7ffa6"/>
              <Text style={styles.kpiLabel}>Active FSE</Text>
              <Text style={styles.kpiValue}>86</Text>
            </View>

            <View style={styles.kpiBox}>
              <Icons name={"Timer"} size={25} color="#f55d0b" circleSize={55} withCircle={true} backgroundColor="#fac9ae71"/>
              <Text style={styles.kpiLabel}> Attendance Today</Text>
              <Text style={styles.kpiValue}>92%</Text>
            </View>
          </View>

          <View style={styles.kpiRow}>
            <View style={styles.kpiBox}>
              <Icons name={"IndianRupee"} size={25} color="#07a37f" circleSize={55} withCircle={true} backgroundColor="#b4f8d865"/>
              <Text style={styles.kpiLabel}>Pending Collections</Text>
              <Text style={styles.kpiValue}>₹ 3,40,000</Text>
            </View>

            <View style={styles.kpiBox}>
              <Icons name={"Package"} size={25} color="#F59E0B" circleSize={55} withCircle={true} backgroundColor="#fee7beb3"/>
              <Text style={styles.kpiLabel}>Non-Moving Stock</Text>
              <Text style={styles.kpiValue}>₹ 1,10,000</Text>
            </View>
          </View>

          {/* 🚨 ACTION REQUIRED */}
          <Text style={styles.sectionTitle}>Action Required</Text>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("AdminApprovals")}
          >
            <Text style={styles.navTitle}>Pending Approvals</Text>
            <Text style={styles.navSubTitle}>
              Distributor · FSE · Retailer requests
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("DistributorPerformance")}
          >
            <Text style={styles.navTitle}>Distributor Performance</Text>
            <Text style={styles.navSubTitle}>
              Sales · Stock · Incentives
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("FSEPerformance")}
          >
            <Text style={styles.navTitle}>FSE Performance</Text>
            <Text style={styles.navSubTitle}>
              Attendance · Sales · Visits
            </Text>
          </TouchableOpacity>

          {/* 🧩 MASTER & CONTROL */}
          <Text style={styles.sectionTitle}>Master & Control</Text>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("TerritoryManagement")}
          >
            <Text style={styles.navTitle}>Territory Management</Text>
            <Text style={styles.navSubTitle}>
              State · District · Taluk · Beat
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("ProductMaster")}
          >
            <Text style={styles.navTitle}>Product Master</Text>
            <Text style={styles.navSubTitle}>
              Products · Pricing · MOQ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("Reports")}
          >
            <Text style={styles.navTitle}>Reports</Text>
            <Text style={styles.navSubTitle}>
              Sales · Stock · Incentives
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
};

export default AdminDashboard;
