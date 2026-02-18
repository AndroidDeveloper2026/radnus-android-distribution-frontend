import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
// import Config from 'react-native-config';
import { Alert } from 'react-native';
import { getMessaging } from '@react-native-firebase/messaging';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { API_BASE_URL } from '@env';
import { SafeAreaProvider } from 'react-native-safe-area-context';


const App = () => {
  console.log('----- API base url----', API_BASE_URL);


  useEffect(() => {
    const unsubscribe = getMessaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
      );
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
