import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import messaging from '@react-native-firebase/messaging';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { API_BASE_URL } from '@env';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { displayNotification } from './src/utils/notificationService';

const App = () => {
 console.log('--- APP js url ---',API_BASE_URL);
 
  useEffect(() => {

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
