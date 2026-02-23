import { Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import SelectRoleStyle from './SelectRoleStyle';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

const SelectRoleScreen = ({ navigation }) => {
  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }

    await messaging().requestPermission();
  };
  const handleUserLogin = async () => {
     await requestPermission(); 
    navigation.navigate('Login');
    // navigation.navigate('AdminRegister');

    // navigation.navigate('AdminDashboard');
    // navigation.navigate('FSEHome');
    // navigation.navigate('FSEDashboard');
    // navigation.navigate('ProductMaster');
    // navigation.navigate('AddProduct');
    // navigation.navigate('ProductList');
    // navigation.navigate('OrderCart');
    // navigation.navigate('OrderSuccess');
    // navigation.navigate('TerritoryManagement');

    // navigation.navigate('RetailerList');
    // navigation.navigate('RetailerProfile');
    // navigation.navigate('RetailerSalesTab');
    // navigation.navigate('CentralStock');
    // navigation.navigate('DistributorOnboarding');
    // navigation.navigate('RouteList');
    //  navigation.navigate('FSEManagement');
    //  navigation.navigate('ProfileSettings');
    // navigation.navigate('EditProfile');

    //  navigation.navigate('RetailerOnboarding');
    // navigation.navigate('EndDaySummary');
    //  navigation.navigate('StockVisibility');
    //  navigation.navigate('RetailerDashboard');
    //  navigation.navigate('DistributorDashboard');
    //  navigation.navigate('OrderBilling');
    //  navigation.navigate('HomeScreen');
    // navigation.navigate('AdminRegister');
    // navigation.navigate('Reports');

    //  navigation.navigate('TermsConditions');
  };

  const handleAdminLogin = async () => {
      await requestPermission(); 
    navigation.navigate('Admin');
  };

  return (
    <View style={SelectRoleStyle.container}>
      <View style={SelectRoleStyle.header}>
        <Text style={SelectRoleStyle.heading}>Choose Login Account</Text>
      </View>

      {/* LOGIN CARD */}
      <View style={SelectRoleStyle.card}>
        <Text style={SelectRoleStyle.title}>Select your login account</Text>
        <View style={SelectRoleStyle.loginContent}>
          <TouchableOpacity
            style={SelectRoleStyle.button}
            onPress={handleUserLogin}
          >
            <Text style={SelectRoleStyle.buttonText}>User</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={SelectRoleStyle.button}
            onPress={handleAdminLogin}
          >
            <Text style={SelectRoleStyle.buttonText}>Admin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SelectRoleScreen;
