import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import styles from "./EmployeeDashboardStyle";
import Header from "../../components/Header";
import Icons from "../../components/Icon";

const EmployeeDashboard = ({ navigation }) => {

  const stats = {
    todaySales: 0,
    stockValue: 0,
    pendingCollections: 0,
    activeFSE: 0,
  };

  return (
    <View style={styles.container}>
      <Header title="Radnus Employee Dashboard" showBackArrow={false} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* WELCOME */}
        <View style={styles.welcomeBox}>
          <Text style={styles.welcome}>Welcome, Employee</Text>
          <Text style={styles.subWelcome}>Business Overview</Text>
        </View>


        {/* STATS GRID */}

        <View style={styles.grid}>

          <StatCard
            icon={
              <Icons
                name={"IndianRupee"}
                size={20}
                color="#2E7D32"
                circleSize={50}
                withCircle={true}
                backgroundColor="#d9f5df"
              />
            }
            value={`₹${stats.todaySales}`}
            label="Today Sales"
          />

          <StatCard
            icon={
              <Icons
                name={"Package"}
                size={20}
                color="#D32F2F"
                circleSize={50}
                withCircle={true}
                backgroundColor="#ffd6d6"
              />
            }
            value={`₹${stats.stockValue}`}
            label="Stock Value"
          />

          <StatCard
            icon={
              <Icons
                name={"Wallet"}
                size={20}
                color="#F9A825"
                circleSize={50}
                withCircle={true}
                backgroundColor="#fff3cd"
              />
            }
            value={`₹${stats.pendingCollections}`}
            label="Pending Collections"
          />

          <StatCard
            icon={
              <Icons
                name={"Users"}
                size={20}
                color="#1976D2"
                circleSize={50}
                withCircle={true}
                backgroundColor="#d6e8ff"
              />
            }
            value={stats.activeFSE}
            label="Active FSE"
          />

        </View>


        {/* QUICK ACTIONS */}

        <Text style={styles.sectionTitle}>Quick Actions</Text>


        <QuickAction
          icon={
            <Icons
              name={"Package"}
              size={20}
              color="#D32F2F"
              circleSize={40}
              withCircle={true}
              // backgroundColor="#ffd6d6"
            />
          }
          label="Stock Summary"
          onPress={() => navigation.navigate("StockVisibility")}
        />


        <QuickAction
          icon={
            <Icons
              name={"Plus"}
              size={20}
              color="#2E7D32"
              circleSize={40}
              withCircle={true}
              // backgroundColor="#d9f5df"
            />
          }
          label="FSE Onboading"
          onPress={() => navigation.navigate("FSEOnboarding")}
        />


        <QuickAction
          icon={
            <Icons
              name={"Users"}
              size={20}
              color="#1976D2"
              circleSize={40}
              withCircle={true}
              // backgroundColor="#d6e8ff"
            />
          }
          label="Manage FSE"
          onPress={() => navigation.navigate("FSEManagement")}
        />


        <QuickAction
          icon={
            <Icons
              name={"ClipboardList"}
              size={20}
              color="#6A1B9A"
              circleSize={40}
              withCircle={true}
              // backgroundColor="#f1e0ff"
            />
          }
          label="Retailer Orders"
          onPress={() => navigation.navigate("OrderSuccess")}
        />


        <QuickAction
          icon={
            <Icons
              name={"Wallet"}
              size={20}
              color="#F9A825"
              circleSize={40}
              withCircle={true}
              backgroundColor="#fff3cd"
            />
          }
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
    <Text style={styles.kpiValue}>{value}</Text>
    <Text style={styles.kpiLabel}>{label}</Text>
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

export default EmployeeDashboard;
