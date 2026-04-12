// import React, { useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
// } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchDistributors } from '../../services/features/distributor/distributorSlice';
// import Header from '../../components/Header';
// import Color from '../../utils/constants/colors';
// import {
//   TrendingUp,
//   CalendarDays,
//   UsersRound,
//   UserCheck,
//   Timer,
//   IndianRupee,
//   Package,
//   AlertCircle,
//   BarChart3,
//   MapPin,
//   Box,
//   MessageSquare,
//   ChevronRight,
//   UserCog,
// } from 'lucide-react-native';

// const AdminDashboard = ({ navigation }) => {
//   const dispatch = useDispatch();
//   const { list: distributors, loading, error } = useSelector((state) => state.distributors);
//   const totalDistributors = distributors.length;

//   useEffect(() => {
//     dispatch(fetchDistributors());
//   }, [dispatch]);

//   const handleDistributorOnboarding = () => {
//     navigation.navigate('DistributorList');
//   };

//   // Helper to render icon with circle background
//   const renderIconWithCircle = (IconComponent, color, bgColor, size = 24) => (
//     <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
//       <IconComponent size={size} color={color} strokeWidth={1.8} />
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Header title="Admin Dashboard" showBackArrow={false} />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* 📊 OVERALL SALES */}
//         <Text style={styles.sectionTitle}>Overall Sales</Text>

//         <View style={styles.kpiRow}>
//           <View style={styles.kpiBox}>
//             {renderIconWithCircle(TrendingUp, Color.success, '#c6ffe1a0')}
//             <Text style={styles.kpiLabel}>Today Sales</Text>
//             <Text style={styles.kpiValue}>₹0</Text>
//           </View>

//           <View style={styles.kpiBox}>
//             {renderIconWithCircle(CalendarDays, '#BB5cf6', '#edcfff78')}
//             <Text style={styles.kpiLabel}>This Month</Text>
//             <Text style={styles.kpiValue}>₹0</Text>
//           </View>
//         </View>

//         <View style={styles.kpiRow}>
//           <TouchableOpacity
//             style={styles.kpiBox}
//             onPress={handleDistributorOnboarding}
//             activeOpacity={0.7}
//           >
//             {renderIconWithCircle(UsersRound, '#4b4efc', '#bebffe92')}
//             <Text style={styles.kpiLabel}>Total Distributors</Text>
//             {loading ? (
//               <ActivityIndicator size="small" color="#4b4efc" />
//             ) : error ? (
//               <Text style={styles.errorText}>Error</Text>
//             ) : (
//               <Text style={styles.kpiValue}>{totalDistributors}</Text>
//             )}
//           </TouchableOpacity>

//           <View style={styles.kpiBox}>
//             {renderIconWithCircle(UserCheck, '#F59E0B', '#fee7beb3')}
//             <Text style={styles.kpiLabel}>Active Retailers</Text>
//             <Text style={styles.kpiValue}>0</Text>
//           </View>
//         </View>

//         {/* ⚙️ OPERATIONS */}
//         <Text style={styles.sectionTitle}>Operations</Text>

//         <View style={styles.kpiRow}>
//           <View style={styles.kpiBox}>
//             {renderIconWithCircle(UserCog, '#0babf5', '#b4e7ffa6')}
//             <Text style={styles.kpiLabel}>Active FSE</Text>
//             <Text style={styles.kpiValue}>0</Text>
//           </View>

//           <View style={styles.kpiBox}>
//             {renderIconWithCircle(Timer, '#f55d0b', '#fac9ae71')}
//             <Text style={styles.kpiLabel}>Attendance Today</Text>
//             <Text style={styles.kpiValue}>0%</Text>
//           </View>
//         </View>

//         <View style={styles.kpiRow}>
//           <View style={styles.kpiBox}>
//             {renderIconWithCircle(IndianRupee, '#07a37f', '#b4f8d865')}
//             <Text style={styles.kpiLabel}>Pending Collections</Text>
//             <Text style={styles.kpiValue}>₹0</Text>
//           </View>

//           <View style={styles.kpiBox}>
//             {renderIconWithCircle(Package, '#F59E0B', '#fee7beb3')}
//             <Text style={styles.kpiLabel}>Non-Moving Stock</Text>
//             <Text style={styles.kpiValue}>₹0</Text>
//           </View>
//         </View>

//         {/* 🚨 ACTION REQUIRED */}
//         <Text style={styles.sectionTitle}>Action Required</Text>

//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => navigation.navigate('DistributorOnboardList')}
//           activeOpacity={0.7}
//         >
//           <View style={styles.navIconWrapper}>
//             <AlertCircle size={22} color="#EF4444" strokeWidth={1.8} />
//           </View>
//           <View style={styles.navTextContainer}>
//             <Text style={styles.navTitle}>Pending Approvals</Text>
//             <Text style={styles.navSubTitle}>
//               Distributor · FSE · Retailer requests
//             </Text>
//           </View>
//           <ChevronRight size={18} color="#9CA3AF" strokeWidth={1.8} />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => navigation.navigate('DistributorPerformance')}
//           activeOpacity={0.7}
//         >
//           <View style={styles.navIconWrapper}>
//             <BarChart3 size={22} color="#8B5CF6" strokeWidth={1.8} />
//           </View>
//           <View style={styles.navTextContainer}>
//             <Text style={styles.navTitle}>Distributor Performance</Text>
//             <Text style={styles.navSubTitle}>Sales · Stock · Incentives</Text>
//           </View>
//           <ChevronRight size={18} color="#9CA3AF" strokeWidth={1.8} />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => navigation.navigate('FSEPerformance')}
//           activeOpacity={0.7}
//         >
//           <View style={styles.navIconWrapper}>
//             <UserCheck size={22} color="#10B981" strokeWidth={1.8} />
//           </View>
//           <View style={styles.navTextContainer}>
//             <Text style={styles.navTitle}>FSE Performance</Text>
//             <Text style={styles.navSubTitle}>Attendance · Sales · Visits</Text>
//           </View>
//           <ChevronRight size={18} color="#9CA3AF" strokeWidth={1.8} />
//         </TouchableOpacity>

//         {/* 🧩 MASTER & CONTROL */}
//         <Text style={styles.sectionTitle}>Master & Control</Text>

//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => navigation.navigate('TerritoryMapping')}
//           activeOpacity={0.7}
//         >
//           <View style={styles.navIconWrapper}>
//             <MapPin size={22} color="#3B82F6" strokeWidth={1.8} />
//           </View>
//           <View style={styles.navTextContainer}>
//             <Text style={styles.navTitle}>Territory Management</Text>
//             <Text style={styles.navSubTitle}>
//               State · District · Taluk · Beat
//             </Text>
//           </View>
//           <ChevronRight size={18} color="#9CA3AF" strokeWidth={1.8} />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => navigation.navigate('ProductMaster')}
//           activeOpacity={0.7}
//         >
//           <View style={styles.navIconWrapper}>
//             <Box size={22} color="#F59E0B" strokeWidth={1.8} />
//           </View>
//           <View style={styles.navTextContainer}>
//             <Text style={styles.navTitle}>Product Master</Text>
//             <Text style={styles.navSubTitle}>Products · Pricing · MOQ</Text>
//           </View>
//           <ChevronRight size={18} color="#9CA3AF" strokeWidth={1.8} />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => navigation.navigate('CustomerListScreen')}
//           activeOpacity={0.7}
//         >
//           <View style={styles.navIconWrapper}>
//             <UsersRound size={22} color="#06B6D4" strokeWidth={1.8} />
//           </View>
//           <View style={styles.navTextContainer}>
//             <Text style={styles.navTitle}>Customer Details</Text>
//             <Text style={styles.navSubTitle}>Manage customer information</Text>
//           </View>
//           <ChevronRight size={18} color="#9CA3AF" strokeWidth={1.8} />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => navigation.navigate('AdminFeedbackScreen')}
//           activeOpacity={0.7}
//         >
//           <View style={styles.navIconWrapper}>
//             <MessageSquare size={22} color="#EC4899" strokeWidth={1.8} />
//           </View>
//           <View style={styles.navTextContainer}>
//             <Text style={styles.navTitle}>Admin Feedback</Text>
//             <Text style={styles.navSubTitle}>Customer feedback & reviews</Text>
//           </View>
//           <ChevronRight size={18} color="#9CA3AF" strokeWidth={1.8} />
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   scrollContent: {
//     paddingBottom: 32,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1F2937',
//     marginHorizontal: 16,
//     marginTop: 20,
//     marginBottom: 14,
//     letterSpacing: -0.3,
//     borderLeftWidth: 3,
//     borderLeftColor: Color.primary || '#3B82F6',
//     paddingLeft: 12,
//   },
//   kpiRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 12,
//     marginBottom: 16,
//   },
//   kpiBox: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 20,
//     paddingVertical: 16,
//     paddingHorizontal: 12,
//     marginHorizontal: 4,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//     borderWidth: 1,
//     borderColor: '#F0F2F5',
//   },
//   iconCircle: {
//     width: 52,
//     height: 52,
//     borderRadius: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   kpiLabel: {
//     fontSize: 13,
//     fontWeight: '500',
//     color: '#6B7280',
//     textAlign: 'center',
//     marginBottom: 6,
//   },
//   kpiValue: {
//     fontSize: 20,
//     fontWeight: '800',
//     color: '#1F2937',
//     textAlign: 'center',
//   },
//   errorText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#EF4444',
//     textAlign: 'center',
//   },
//   navItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 18,
//     paddingVertical: 14,
//     paddingHorizontal: 18,
//     marginHorizontal: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.03,
//     shadowRadius: 4,
//     elevation: 1,
//     borderWidth: 1,
//     borderColor: '#F0F2F5',
//   },
//   navIconWrapper: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: '#F9FAFB',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 14,
//   },
//   navTextContainer: {
//     flex: 1,
//   },
//   navTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1F2937',
//     marginBottom: 4,
//   },
//   navSubTitle: {
//     fontSize: 13,
//     fontWeight: '400',
//     color: '#6B7280',
//   },
// });

// export default AdminDashboard;


import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDistributors } from '../../services/features/distributor/distributorSlice';
import Header from '../../components/Header';
import Color from '../../utils/constants/colors';
import api from '../../services/API/api'; // <-- added import
import {
  TrendingUp,
  CalendarDays,
  UsersRound,
  UserCheck,
  Timer,
  IndianRupee,
  Package,
  AlertCircle,
  BarChart3,
  MapPin,
  Box,
  MessageSquare,
  ChevronRight,
  UserCog,
} from 'lucide-react-native';

const AdminDashboard = ({ navigation }) => {
  const dispatch = useDispatch();
  const { list: distributors, loading, error } = useSelector((state) => state.distributors);
  const totalDistributors = distributors.length;

  // State for today's sales
  const [todaySales, setTodaySales] = useState(0);
  const [todaySalesLoading, setTodaySalesLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch today's sales (same logic as EmployeeDashboard)
  const fetchTodaySales = useCallback(async () => {
    setTodaySalesLoading(true);
    try {
      const response = await api.get('/api/invoices?filter=today');
      const invoices = response.data || [];
      const total = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
      setTodaySales(total);
    } catch (error) {
      console.error('Failed to fetch today\'s sales:', error);
      setTodaySales(0);
    } finally {
      setTodaySalesLoading(false);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchDistributors());
    fetchTodaySales();
  }, [dispatch, fetchTodaySales]);

  // Manual refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(fetchDistributors()),
      fetchTodaySales(),
    ]);
    setRefreshing(false);
  }, [dispatch, fetchTodaySales]);

  const handleDistributorOnboarding = () => {
    navigation.navigate('DistributorList');
  };

  // Helper to render icon with circle background
  const renderIconWithCircle = (IconComponent, color, bgColor, size = 24) => (
    <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
      <IconComponent size={size} color={color} strokeWidth={1.8} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Admin Dashboard" showBackArrow={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Color.primary || '#3B82F6']}
            tintColor={Color.primary || '#3B82F6'}
          />
        }
      >
        {/* 📊 OVERALL SALES */}
        <Text style={styles.sectionTitle}>Overall Sales</Text>

        <View style={styles.kpiRow}>
          <TouchableOpacity
            style={styles.kpiBox}
            onPress={() => navigation.navigate('InvoiceListScreen', { filter: 'today' })}
            activeOpacity={0.7}
          >
            {renderIconWithCircle(TrendingUp, Color.success, '#c6ffe1a0')}
            <Text style={styles.kpiLabel}>Today Sales</Text>
            {todaySalesLoading ? (
              <ActivityIndicator size="small" color={Color.success} />
            ) : (
              <Text style={styles.kpiValue}>₹{todaySales}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.kpiBox}>
            {renderIconWithCircle(CalendarDays, '#BB5cf6', '#edcfff78')}
            <Text style={styles.kpiLabel}>This Month</Text>
            <Text style={styles.kpiValue}>₹0</Text>
          </View>
        </View>

        <View style={styles.kpiRow}>
          <TouchableOpacity
            style={styles.kpiBox}
            onPress={handleDistributorOnboarding}
            activeOpacity={0.7}
          >
            {renderIconWithCircle(UsersRound, '#4b4efc', '#bebffe92')}
            <Text style={styles.kpiLabel}>Total Distributors</Text>
            {loading ? (
              <ActivityIndicator size="small" color="#4b4efc" />
            ) : error ? (
              <Text style={styles.errorText}>Error</Text>
            ) : (
              <Text style={styles.kpiValue}>{totalDistributors}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.kpiBox}>
            {renderIconWithCircle(UserCheck, '#F59E0B', '#fee7beb3')}
            <Text style={styles.kpiLabel}>Active Retailers</Text>
            <Text style={styles.kpiValue}>0</Text>
          </View>
        </View>

        {/* ⚙️ OPERATIONS */}
        <Text style={styles.sectionTitle}>Operations</Text>

        <View style={styles.kpiRow}>
          <View style={styles.kpiBox}>
            {renderIconWithCircle(UserCog, '#0babf5', '#b4e7ffa6')}
            <Text style={styles.kpiLabel}>Active FSE</Text>
            <Text style={styles.kpiValue}>0</Text>
          </View>

          <View style={styles.kpiBox}>
            {renderIconWithCircle(Timer, '#f55d0b', '#fac9ae71')}
            <Text style={styles.kpiLabel}>Attendance Today</Text>
            <Text style={styles.kpiValue}>0%</Text>
          </View>
        </View>

        <View style={styles.kpiRow}>
          <View style={styles.kpiBox}>
            {renderIconWithCircle(IndianRupee, '#07a37f', '#b4f8d865')}
            <Text style={styles.kpiLabel}>Pending Collections</Text>
            <Text style={styles.kpiValue}>₹0</Text>
          </View>

          <View style={styles.kpiBox}>
            {renderIconWithCircle(Package, '#F59E0B', '#fee7beb3')}
            <Text style={styles.kpiLabel}>Non-Moving Stock</Text>
            <Text style={styles.kpiValue}>₹0</Text>
          </View>
        </View>

        {/* 🚨 ACTION REQUIRED */}
        <Text style={styles.sectionTitle}>Action Required</Text>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('DistributorOnboardList')}
          activeOpacity={0.7}
        >
          <View style={styles.navIconWrapper}>
            <AlertCircle size={22} color="#EF4444" strokeWidth={1.8} />
          </View>
          <View style={styles.navTextContainer}>
            <Text style={styles.navTitle}>Pending Approvals</Text>
            <Text style={styles.navSubTitle}>
              Distributor · FSE · Retailer requests
            </Text>
          </View>
          <ChevronRight size={18} color="#9CA3AF" strokeWidth={1.8} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('DistributorPerformance')}
          activeOpacity={0.7}
        >
          <View style={styles.navIconWrapper}>
            <BarChart3 size={22} color="#8B5CF6" strokeWidth={1.8} />
          </View>
          <View style={styles.navTextContainer}>
            <Text style={styles.navTitle}>Distributor Performance</Text>
            <Text style={styles.navSubTitle}>Sales · Stock · Incentives</Text>
          </View>
          <ChevronRight size={18} color="#9CA3AF" strokeWidth={1.8} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('FSEPerformance')}
          activeOpacity={0.7}
        >
          <View style={styles.navIconWrapper}>
            <UserCheck size={22} color="#10B981" strokeWidth={1.8} />
          </View>
          <View style={styles.navTextContainer}>
            <Text style={styles.navTitle}>FSE Performance</Text>
            <Text style={styles.navSubTitle}>Attendance · Sales · Visits</Text>
          </View>
          <ChevronRight size={18} color="#9CA3AF" strokeWidth={1.8} />
        </TouchableOpacity>

        {/* 🧩 MASTER & CONTROL */}
        <Text style={styles.sectionTitle}>Master & Control</Text>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('TerritoryMapping')}
          activeOpacity={0.7}
        >
          <View style={styles.navIconWrapper}>
            <MapPin size={22} color="#3B82F6" strokeWidth={1.8} />
          </View>
          <View style={styles.navTextContainer}>
            <Text style={styles.navTitle}>Territory Management</Text>
            <Text style={styles.navSubTitle}>
              State · District · Taluk · Beat
            </Text>
          </View>
          <ChevronRight size={18} color="#9CA3AF" strokeWidth={1.8} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('ProductMaster')}
          activeOpacity={0.7}
        >
          <View style={styles.navIconWrapper}>
            <Box size={22} color="#F59E0B" strokeWidth={1.8} />
          </View>
          <View style={styles.navTextContainer}>
            <Text style={styles.navTitle}>Product Master</Text>
            <Text style={styles.navSubTitle}>Products · Pricing · MOQ</Text>
          </View>
          <ChevronRight size={18} color="#9CA3AF" strokeWidth={1.8} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('CustomerListScreen')}
          activeOpacity={0.7}
        >
          <View style={styles.navIconWrapper}>
            <UsersRound size={22} color="#06B6D4" strokeWidth={1.8} />
          </View>
          <View style={styles.navTextContainer}>
            <Text style={styles.navTitle}>Customer Details</Text>
            <Text style={styles.navSubTitle}>Manage customer information</Text>
          </View>
          <ChevronRight size={18} color="#9CA3AF" strokeWidth={1.8} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('AdminFeedbackScreen')}
          activeOpacity={0.7}
        >
          <View style={styles.navIconWrapper}>
            <MessageSquare size={22} color="#EC4899" strokeWidth={1.8} />
          </View>
          <View style={styles.navTextContainer}>
            <Text style={styles.navTitle}>Admin Feedback</Text>
            <Text style={styles.navSubTitle}>Customer feedback & reviews</Text>
          </View>
          <ChevronRight size={18} color="#9CA3AF" strokeWidth={1.8} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 14,
    letterSpacing: -0.3,
    borderLeftWidth: 3,
    borderLeftColor: Color.primary || '#3B82F6',
    paddingLeft: 12,
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  kpiBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F2F5',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  kpiLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 6,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
    textAlign: 'center',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F0F2F5',
  },
  navIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  navTextContainer: {
    flex: 1,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  navSubTitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
  },
});

export default AdminDashboard;