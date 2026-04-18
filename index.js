/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { displayNotification } from './src/utils/notificationService';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    
  }
});

messaging().setBackgroundMessageHandler(async remoteMessage => {


  await displayNotification(remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
