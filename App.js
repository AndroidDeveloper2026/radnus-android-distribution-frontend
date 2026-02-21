import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
// import Config from 'react-native-config';
// import { Alert, PermissionsAndroid, Platform } from 'react-native';
// import { getMessaging } from '@react-native-firebase/messaging';
import messaging from '@react-native-firebase/messaging';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { API_BASE_URL } from '@env';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { displayNotification } from './src/utils/notificationService';

const App = () => {
  console.log('----- API base url----', API_BASE_URL);

  // useEffect(() => {
  //   const unsubscribe = getMessaging().onMessage(async remoteMessage => {
  //     Alert.alert(
  //       remoteMessage.notification.title,
  //       remoteMessage.notification.body,
  //     );
  //   });

  //   return unsubscribe;
  // }, []);

  useEffect(() => {
    // requestPermission();

    // Foreground message
    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    //   console.log('Foreground message:', remoteMessage);

    //   Alert.alert(
    //     remoteMessage.notification?.title || 'Notification',
    //     remoteMessage.notification?.body || ''
    //   );
    // });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground message:', remoteMessage);

      await displayNotification(remoteMessage);
    });

    // When app opened from background by tapping notification
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Opened from background:', remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Opened from killed state:', remoteMessage);
        }
      });

    // When app opened from killed state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Opened from killed state:', remoteMessage);
        }
      });

    return unsubscribe;
  }, []);

  // const requestPermission = async () => {
  //   if (Platform.OS === 'android') {
  //     await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  //     );
  //   }

  //   await messaging().requestPermission();
  // };

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
