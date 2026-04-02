import { enableScreens } from 'react-native-screens';
enableScreens();
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import messaging from '@react-native-firebase/messaging';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/store/store';
// import { API_BASE_URL } from '@env';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { displayNotification } from './src/utils/notificationService';

import { checkAuth } from './src/services/features/auth/authSlice';

// Separate component to use dispatch
const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check authentication when app starts
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("FCM MESSAGE:", JSON.stringify(remoteMessage, null, 2));
      await displayNotification(remoteMessage);
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log("Opened from background:", remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log("Opened from killed state:", remoteMessage);
        }
      });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;