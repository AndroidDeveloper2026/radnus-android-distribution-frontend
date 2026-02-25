import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  Home,
  LayoutDashboard,
  CircleUserRound,
  BarChart3,
} from 'lucide-react-native';

/* SCREENS */
import HomeScreen from '../screens/Common/HomeScreen';
import Report from '../screens/Common/Reports';
import ProfileSettings from '../screens/Common/ProfileSettings';
import AdminDashboardScreen from '../screens/AdminDashboard/AdminDashboardScreen';
import DistributorDashboard from '../screens/Distributor/DistributorDashboard';
import FSEDashboard from '../screens/FieldSalesExecutive/FSEDashboard';
import RetailerDashboard from '../screens/Retailer/RetailerDashboard';
import FSEHomeScreen from '../screens/FieldSalesExecutive/FSEHomeScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

/* 🔐 ROLE CONFIG */
const ROLE_TABS = {
  Admin: [
    {
      name: 'Dashboard',
      component: AdminDashboardScreen,
      icon: LayoutDashboard,
    },
    { name: 'Home', component: HomeScreen, icon: Home },
    { name: 'Reports', component: Report, icon: BarChart3 },
    { name: 'Profile', component: ProfileSettings, icon: CircleUserRound },
  ],

  MarketingManager: [
    { name: 'Dashboard', component: RetailerDashboard, icon: LayoutDashboard },
    { name: 'Home', component: HomeScreen, icon: Home },
    { name: 'Reports', component: Report, icon: BarChart3 },
    { name: 'Profile', component: ProfileSettings, icon: CircleUserRound },
  ],

  MarketingExecutive: [
    { name: 'Dashboard', component: RetailerDashboard, icon: LayoutDashboard },
    { name: 'Home', component: HomeScreen, icon: Home },
    { name: 'Reports', component: Report, icon: BarChart3 },
    { name: 'Profile', component: ProfileSettings, icon: CircleUserRound },
  ],

  Distributor: [
    {
      name: 'Dashboard',
      component: DistributorDashboard,
      icon: LayoutDashboard,
    },
    { name: 'Home', component: HomeScreen, icon: Home },
    { name: 'Reports', component: Report, icon: BarChart3 },
    { name: 'Profile', component: ProfileSettings, icon: CircleUserRound },
  ],

  FSE: [
    { name: 'Home', component: FSEHomeScreen, icon: Home },
    { name: 'Dashboard', component: FSEDashboard, icon: LayoutDashboard },
    { name: 'Reports', component: Report, icon: BarChart3 },
    { name: 'Profile', component: ProfileSettings, icon: CircleUserRound },
  ],

  Retailer: [
    { name: 'Dashboard', component: RetailerDashboard, icon: LayoutDashboard },
    { name: 'Home', component: HomeScreen, icon: Home },
    { name: 'Reports', component: Report, icon: BarChart3 },
    { name: 'Profile', component: ProfileSettings, icon: CircleUserRound },
  ],
};

const BottomTabs = ({ route }) => {
  const insets = useSafeAreaInsets();
  // const { role } = route.params; // 👈 role passed from Stack
  const role = route?.params?.role;

  if (!role) return null;

  const tabs = ROLE_TABS[role] || [];

  console.log('--- bottom Tab (role)---', role);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#D32F2F',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          height: 60 + insets.bottom, //old value 85
          paddingBottom:insets.bottom, //old value 8
          paddingTop: 6, //old value 8
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      {tabs.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarIcon: ({ color, size }) => (
              <tab.icon color={color} size={size || 22} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default BottomTabs;
