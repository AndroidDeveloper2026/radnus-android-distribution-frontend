
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  Home,
  LayoutDashboard,
  CircleUserRound,
  BarChart3,

} from "lucide-react-native";

/* SCREENS */
import HomeScreen from "../screens/Common/HomeScreen";
import ProfileSettings from "../screens/Common/ProfileSettings";
import AdminDashboardScreen from "../screens/AdminDashboard/AdminDashboardScreen";
import DistributorDashboard from "../screens/Distributor/DistributorDashboard";
import FSEDashboard from "../screens/FieldSalesExecutive/FSEDashboard";
import RetailerDashboard from "../screens/Retailer/RetailerDashboard";

const Tab = createBottomTabNavigator();

/* 🔐 ROLE CONFIG */
const ROLE_TABS = {
  Admin: [
    { name: "Dashboard", component: AdminDashboardScreen, icon: LayoutDashboard},
    { name: "Home", component: ProfileSettings, icon: Home },
    { name: "Profile", component: ProfileSettings, icon: CircleUserRound},
    { name: "Reports", component: ProfileSettings, icon: BarChart3 },
  ],

  Distributor: [
    { name: "Dashboard", component: DistributorDashboard, icon: LayoutDashboard },
    { name: "Home", component: ProfileSettings, icon: Home },
    { name: "Profile", component: ProfileSettings, icon: CircleUserRound},
    { name: "Reports", component: ProfileSettings, icon: BarChart3 },
  ],

  FSE: [
    { name: "Dashboard", component: FSEDashboard, icon:  LayoutDashboard },
    { name: "Home", component: ProfileSettings, icon: Home },
    { name: "Profile", component: ProfileSettings, icon: CircleUserRound},
    { name: "Reports", component: ProfileSettings, icon: BarChart3 },
  ],

  Retailer: [
    { name: "Dashboard", component: RetailerDashboard, icon:  LayoutDashboard},
    { name: "Home", component: ProfileSettings, icon: Home },
    { name: "Profile", component: ProfileSettings, icon: CircleUserRound},
    { name: "Reports", component: ProfileSettings, icon: BarChart3 },
  ],
};


const BottomTabs = ({ route }) => {
  const { role } = route.params; // 👈 role passed from Stack
  const tabs = ROLE_TABS[role] || [];

  console.log("--- bottom Tab (role)---", role)

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#D32F2F",
        tabBarInactiveTintColor: "#757575",
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      {tabs.map((tab) => (
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
