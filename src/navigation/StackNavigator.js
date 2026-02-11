import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from '../screens/Splash/SplashScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import OtpScreen from '../screens/Auth/OtpScreen';
import SelectRoleScreen from '../screens/Auth/SelectRoleScreen';
import AdminScreen from '../screens/Auth/AdminScreen';
import FSEHomeScreen from '../screens/FieldSalesExecutive/FSEHomeScreen';
import FSEDashboard from '../screens/FieldSalesExecutive/FSEDashboard';
import ProductMaster from '../screens/AdminDashboard/ProductsMaster';
import AddProduct from '../screens/AdminDashboard/AddProduct';
import ProductList from '../screens/Products/ProductList';
import OrderCart from '../screens/OrderProduct/OrderCart';
import OrderSuccess from '../screens/OrderProduct/OrderSuccessScreen';
import TerritoryManagement from '../screens/TerritoryManagement/TerritoryManagement';
import RetailerList from '../screens/Retailer/RetailerList';
import RetailerProfile from '../screens/Retailer/RetailerProfile';
import RetailerSalesTab from '../screens/Retailer/RetailerSalesTab';
import CentralStock from '../screens/AdminDashboard/CentralStock';
import DistributorOnboarding from '../screens/Distributor/DistributorOnboarding';
import RouteList from '../screens/FieldSalesExecutive/RouteList';
import FSEManagement from '../screens/FieldSalesExecutive/FSEManagement';
import ProfileSettings from '../screens/Common/ProfileSettings';
import EditProfile from '../screens/Common/EditProfile';
//-- checking --
import AdminDashboardScreen from '../screens/AdminDashboard/AdminDashboardScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelectRole"
        component={SelectRoleScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Admin"
        component={AdminScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OtpScreen"
        component={OtpScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FSEHome"
        component={FSEHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FSEDashboard"
        component={FSEDashboard}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ProductMaster"
        component={ProductMaster}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AddProduct"
        component={AddProduct}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ProductList"
        component={ProductList}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="OrderCart"
        component={OrderCart}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="OrderSuccess"
        component={OrderSuccess}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="TerritoryManagement"
        component={TerritoryManagement}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="RetailerList"
        component={RetailerList}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="RetailerProfile"
        component={RetailerProfile}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="RetailerSalesTab"
        component={RetailerSalesTab}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="CentralStock"
        component={CentralStock}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="DistributorOnboarding"
        component={DistributorOnboarding}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="RouteList"
        component={RouteList}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="FSEManagement"
        component={FSEManagement}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ProfileSettings"
        component={ProfileSettings}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
