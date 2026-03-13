import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import FSEDashboardStyle from './FSEDashboardStyle';
import Header from '../../components/Header';
import Icons from '../../components/Icon';
import {
  Target,
  TrendingUp,
  IndianRupee,
  Store,
  Users,
  Plus,
  ShoppingCart,
  Map,
  MapPin,
  Square,
} from 'lucide-react-native';
// import colors from '../../utils/constants/colors';
import { useSelector } from 'react-redux';

const FSEDashboard = ({ navigation }) => {
  const user = useSelector(state => state.auth.user);
  return (
    <View style={FSEDashboardStyle.container}>
      <Header title={'FSE Dashboard'} />

      <ScrollView>
        <View style={FSEDashboardStyle.content}>
          {/* WELCOME */}
          <Text style={FSEDashboardStyle.welcome}>👋 Hi, {user?.name || 'User'}</Text>
          <Text style={FSEDashboardStyle.subtitle}>Today’s Overview</Text>

          {/* KPI ROW 1 */}
          {/* KPI ROW 1 */}
          <View style={FSEDashboardStyle.kpiRow}>
            <View style={FSEDashboardStyle.kpiBox}>
              <Icons
                name={'Target'}
                size={25}
                color="#D32F2F"
                circleSize={55}
                withCircle={true}
                backgroundColor="#fed2d2"
              />
              <Text style={FSEDashboardStyle.cardValue}>₹0</Text>
              <Text style={FSEDashboardStyle.cardLabel}>Today Target</Text>
            </View>

            <View style={FSEDashboardStyle.kpiBox}>
              <Icons
                name={'TrendingUp'}
                size={25}
                color="#2E7D32"
                circleSize={55}
                withCircle={true}
                backgroundColor="#d2f5da"
              />
              <Text style={FSEDashboardStyle.cardValue}>₹0</Text>
              <Text style={FSEDashboardStyle.cardLabel}>Achieved</Text>
            </View>
          </View>

          {/* KPI ROW 2 */}
          <View style={FSEDashboardStyle.kpiRow}>
            <View style={FSEDashboardStyle.kpiBox}>
              <Icons
                name={'IndianRupee'}
                size={25}
                color="#F57C00"
                circleSize={55}
                withCircle={true}
                backgroundColor="#ffe6c7"
              />
              <Text style={FSEDashboardStyle.cardValue}>₹0</Text>
              <Text style={FSEDashboardStyle.cardLabel}>
                Pending Collections
              </Text>
            </View>

            <View style={FSEDashboardStyle.kpiBox}>
              <Icons
                name={'Store'}
                size={25}
                color="#1976D2"
                circleSize={55}
                withCircle={true}
                backgroundColor="#d9eaff"
              />
              <Text style={FSEDashboardStyle.cardValue}>0</Text>
              <Text style={FSEDashboardStyle.cardLabel}>
                Retailers to Visit
              </Text>
            </View>
          </View>

          <Text style={FSEDashboardStyle.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={FSEDashboardStyle.actionItem}
            onPress={() => navigation.navigate('RetailerList')}
          >
            <Users size={20} color="#1976D2" />
            <Text style={FSEDashboardStyle.actionText}>View Retailer List</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={FSEDashboardStyle.actionItem}
            onPress={() => navigation.navigate('RetailerOnboarding')}
          >
            <Plus size={20} color="#2E7D32" />
            <Text style={FSEDashboardStyle.actionText}>Add New Retailer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={FSEDashboardStyle.actionItem}
            onPress={() => navigation.navigate('OrderCart')}
          >
            <ShoppingCart size={20} color="#F57C00" />
            <Text style={FSEDashboardStyle.actionText}>Book Order</Text>
          </TouchableOpacity>

          {/* Map screen */}
          <TouchableOpacity
            style={FSEDashboardStyle.actionItem}
            onPress={() => navigation.navigate('MapScreen')}
          >
            <Map size={20} color="#5E35B1" />
            <Text style={FSEDashboardStyle.actionText}>Mapscreen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={FSEDashboardStyle.actionItem}
            onPress={() => navigation.navigate('FSETracking')}
          >
            <MapPin size={20} color="#D32F2F" />
            <Text style={FSEDashboardStyle.actionText}>FSE Tracking</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={FSEDashboardStyle.actionItem}
            onPress={() => navigation.navigate('EndDaySummary')}
          >
            <Square size={20} color="#455A64" />
            <Text style={FSEDashboardStyle.actionText}>End Day Summary</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default FSEDashboard;
