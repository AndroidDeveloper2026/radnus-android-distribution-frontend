import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import FSEDashboardStyle from './FSEDashboardStyle';
import Header from '../../components/Header';

// You can replace these with SVG icons later
const Icon = ({ label }) => <Text style={{ fontSize: 18 }}>{label}</Text>;

const FSEDashboard = ({ navigation }) => {
  return (
    <View style={FSEDashboardStyle.container}>
      <Header title={'FSE Dashboard'} />

      <ScrollView>
        <View style={FSEDashboardStyle.content}>
          {/* WELCOME */}
          <Text style={FSEDashboardStyle.welcome}>Welcome, FSE User</Text>
          <Text style={FSEDashboardStyle.subtitle}>Today’s Overview</Text>

          {/* KPI ROW 1 */}
          <View style={FSEDashboardStyle.gridRow}>
            <View style={FSEDashboardStyle.card}>
              <View style={FSEDashboardStyle.iconCircle}>
                <Icon label="🎯" />
              </View>
              <Text style={FSEDashboardStyle.cardValue}>₹50,000</Text>
              <Text style={FSEDashboardStyle.cardLabel}>Today Target</Text>
            </View>

            <View style={FSEDashboardStyle.card}>
              <View style={FSEDashboardStyle.iconCircle}>
                <Icon label="📈" />
              </View>
              <Text style={FSEDashboardStyle.cardValue}>₹32,000</Text>
              <Text style={FSEDashboardStyle.cardLabel}>Achieved</Text>
            </View>
          </View>

          {/* KPI ROW 2 */}
          <View style={FSEDashboardStyle.gridRow}>
            <View style={FSEDashboardStyle.card}>
              <View style={FSEDashboardStyle.iconCircle}>
                <Icon label="💰" />
              </View>
              <Text style={FSEDashboardStyle.cardValue}>₹8,000</Text>
              <Text style={FSEDashboardStyle.cardLabel}>
                Pending Collections
              </Text>
            </View>

            <View style={FSEDashboardStyle.card}>
              <View style={FSEDashboardStyle.iconCircle}>
                <Icon label="🏪" />
              </View>
              <Text style={FSEDashboardStyle.cardValue}>12</Text>
              <Text style={FSEDashboardStyle.cardLabel}>
                Retailers to Visit
              </Text>
            </View>
          </View>

          {/* QUICK ACTIONS */}
          <Text style={FSEDashboardStyle.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={FSEDashboardStyle.actionItem}
            onPress={() => navigation.navigate('RetailerList')}
          >
            <Icon label="👥" />
            <Text style={FSEDashboardStyle.actionText}>View Retailer List</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={FSEDashboardStyle.actionItem}
            onPress={() => navigation.navigate('RetailerOnboarding')}
          >
            <Icon label="➕" />
            <Text style={FSEDashboardStyle.actionText}>Add New Retailer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={FSEDashboardStyle.actionItem}
            onPress={() => navigation.navigate('OrderBooking')}
          >
            <Icon label="🛒" />
            <Text style={FSEDashboardStyle.actionText}>Book Order</Text>
          </TouchableOpacity>

          {/* Mapp screen */}
          <TouchableOpacity
            style={FSEDashboardStyle.actionItem}
            onPress={() => navigation.navigate('MapScreen')}
          >
            <Icon label="🛒" />
            <Text style={FSEDashboardStyle.actionText}>Mapscreen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={FSEDashboardStyle.actionItem}
            onPress={() => navigation.navigate('FSETracking')}
          >
            <Icon label="🛒" />
            <Text style={FSEDashboardStyle.actionText}>FSETracking</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={FSEDashboardStyle.actionItem}
            onPress={() => navigation.navigate('EndDaySummary')}
          >
            <Icon label="⏹️" />
            <Text style={FSEDashboardStyle.actionText}>End Day Summary</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default FSEDashboard;
