
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

/* SCREENS */
import HomeScreen from "../screens/home/HomeScreen";
import CentralStock from "../screens/stock/CentralStock";
import ReportsDashboard from "../screens/reports/ReportsDashboard";
import RetailerList from "../screens/retailer/RetailerList";
import OrdersScreen from "../screens/orders/OrdersScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator();

/* 🔐 ROLE CONFIG */
const ROLE_TABS = {
  MASTER_ADMIN: [
    { name: "Home", component: HomeScreen, icon: "home-outline" },
    { name: "Stock", component: CentralStock, icon: "warehouse" },
    { name: "Reports", component: ReportsDashboard, icon: "chart-box-outline" },
    { name: "Profile", component: ProfileScreen, icon: "account-outline" },
  ],

  ADMIN: [
    { name: "Home", component: HomeScreen, icon: "home-outline" },
    { name: "Stock", component: CentralStock, icon: "warehouse" },
    { name: "Reports", component: ReportsDashboard, icon: "chart-box-outline" },
  ],

  MARKETING_MANAGER: [
    { name: "Home", component: HomeScreen, icon: "home-outline" },
    { name: "Reports", component: ReportsDashboard, icon: "chart-box-outline" },
  ],

  MARKETING_EXECUTIVE: [
    { name: "Home", component: HomeScreen, icon: "home-outline" },
    { name: "Retailers", component: RetailerList, icon: "storefront-outline" },
  ],

  DISTRIBUTOR: [
    { name: "Home", component: HomeScreen, icon: "home-outline" },
    { name: "Stock", component: CentralStock, icon: "warehouse" },
    { name: "Retailers", component: RetailerList, icon: "storefront-outline" },
    { name: "Reports", component: ReportsDashboard, icon: "chart-box-outline" },
  ],

  FSE: [
    { name: "Home", component: HomeScreen, icon: "home-outline" },
    { name: "Retailers", component: RetailerList, icon: "storefront-outline" },
    { name: "Orders", component: OrdersScreen, icon: "clipboard-text-outline" },
  ],

  RETAILER: [
    { name: "Home", component: HomeScreen, icon: "home-outline" },
    { name: "Orders", component: OrdersScreen, icon: "cart-outline" },
    { name: "Profile", component: ProfileScreen, icon: "account-outline" },
  ],
};

const BottomTabs = ({ role }) => {
  const tabs = ROLE_TABS[role] || [];

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
          backgroundColor: "#FFFFFF",
          elevation: 12,
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
            tabBarIcon: ({ color }) => (
              <Icon
                name={tab.icon}
                size={22}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default BottomTabs;
