import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import styles from './EmployeeDashboardStyle';
import Header from '../../components/Header';
import Icons from '../../components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const EmployeeDashboard = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const stats = {
    todaySales: 0,
    stockValue: 0,
    pendingCollections: 0,
    activeFSE: 0,
  };

  return (
    <View style={styles.container}>
      <Header title="Radnus Sales Dashboard" showBackArrow={false} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 10 }, // 80 = tab bar height
        ]}
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
                name={'IndianRupee'}
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
                name={'Package'}
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
                name={'Wallet'}
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
                name={'Users'}
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
              name={'Users'}
              size={20}
              color="#1976D2"
              circleSize={40}
              withCircle={true}
              // backgroundColor="#d6e8ff"
            />
          }
          label="Customer Details"
          onPress={() => navigation.navigate('CustomerListScreen')}
        />

        <QuickAction
          icon={
            <Icons
              name={'ClipboardList'}
              size={20}
              color="#d3602f"
              circleSize={40}
              withCircle={true}
              // backgroundColor="#ffd6d6"
            />
          }
          label="Invoice History"
          onPress={() => navigation.navigate('InvoiceListScreen')}
        />

        <QuickAction
          icon={
            <Icons
              name={'Package'}
              size={20}
              color="#D32F2F"
              circleSize={40}
              withCircle={true}
              // backgroundColor="#ffd6d6"
            />
          }
          label="Stock Summary"
          onPress={() => navigation.navigate('StockVisibility')}
        />

        <QuickAction
          icon={
            <Icons
              name={'Plus'}
              size={20}
              color="#2E7D32"
              circleSize={40}
              withCircle={true}
              // backgroundColor="#d9f5df"
            />
          }
          label="Order Cart"
          onPress={() => navigation.navigate('OrderCart')}
        />

        <QuickAction
          icon={
            <Icons
              name={'Users'}
              size={20}
              color="#1976D2"
              circleSize={40}
              withCircle={true}
              // backgroundColor="#d6e8ff"
            />
          }
          label="Retailer Sales"
          onPress={() => navigation.navigate('RetailerSalesTab')}
        />

        <QuickAction
          icon={
            <Icons
              name={'ClipboardList'}
              size={20}
              color="#6A1B9A"
              circleSize={40}
              withCircle={true}
              // backgroundColor="#f1e0ff"
            />
          }
          label="Central Stock"
          onPress={() => navigation.navigate('CentralStock')}
        />

        <QuickAction
          icon={
            <Icons
              name={'Wallet'}
              size={20}
              color="#F9A825"
              circleSize={40}
              withCircle={true}
              // backgroundColor="#fff3cd"
            />
          }
          label="Order Billing"
          onPress={() => navigation.navigate('OrderBilling')}
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
