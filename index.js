/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import locationTaskHandler from './src/tasks/locationTaskHandler';
import { startOfflineQueueAutoRetry } from './src/utils/HeadlessLocation';

// ✅ Registers the app's root component (standard RN boilerplate — unchanged).
AppRegistry.registerComponent(appName, () => App);

// ✅ FIX: Start the offline GPS-queue auto-retry loop once at app startup.
// Previously any points left in the local queue (e.g. after "Skip Sync &
// End Day", or a batch that partially failed) were never retried once
// tracking stopped — see HeadlessLocation.js for the full explanation.
// This retries on network reconnect and on a periodic timer, independent
// of whether a tracking session is currently active.
startOfflineQueueAutoRetry();

// ✅ Registers the "LocationTask" headless task.
//
// LocationTrackingService.java (native foreground service) gets a GPS fix
// from FusedLocationProviderClient, then starts LocationHeadlessTask.java
// (a HeadlessJsTaskService) with task name "LocationTask" and the fix's
// data (userId, sessionId, latitude, longitude, accuracy, timestamp, speed)
// as extras.
//
// React Native only runs a headless task if something on the JS side has
// registered a handler for the same task name — this line is that
// registration. Without it, every native location fix reaches the JS
// bridge with nowhere to go and is silently dropped, which is why
// sessions previously ended up with 0 route points / 0 distance despite
// the native service running correctly.
AppRegistry.registerHeadlessTask('LocationTask', () => locationTaskHandler);

// // //----------- 09.09.26 ----------------
// // /**
// //  * @format
// //  */

// // import { AppRegistry } from 'react-native';
// // import App from './App';
// // import { name as appName } from './app.json';
// // import locationTaskHandler from './src/tasks/locationTaskHandler';

// // // ✅ Registers the app's root component (standard RN boilerplate — unchanged).
// // AppRegistry.registerComponent(appName, () => App);

// // // ✅ Registers the "LocationTask" headless task.
// // //
// // // LocationTrackingService.java (native foreground service) gets a GPS fix
// // // from FusedLocationProviderClient, then starts LocationHeadlessTask.java
// // // (a HeadlessJsTaskService) with task name "LocationTask" and the fix's
// // // data (userId, sessionId, latitude, longitude, accuracy, timestamp, speed)
// // // as extras.
// // //
// // // React Native only runs a headless task if something on the JS side has
// // // registered a handler for the same task name — this line is that
// // // registration. Without it, every native location fix reaches the JS
// // // bridge with nowhere to go and is silently dropped, which is why
// // // sessions previously ended up with 0 route points / 0 distance despite
// // // the native service running correctly.
// // AppRegistry.registerHeadlessTask('LocationTask', () => locationTaskHandler);

// //------------ 01.09.2026 -------------------------
// // /**
// //  * @format
// //  * 
// //  * Updated index.js with proper background location tracking
// //  * Handles GPS tracking, push notifications, and background tasks
// //  */

// import { AppRegistry } from 'react-native';
// import App from './App';
// import { name as appName } from './app.json';
// import notifee, { EventType } from '@notifee/react-native';
// import messaging from '@react-native-firebase/messaging';
// import { displayNotification } from './src/utils/notificationService';

// // ✅ IMPORT: Background Location Handler
// import { sendBackgroundLocation } from './src/utils/HeadlessLocation';

// // ============================================
// // 1. NOTIFEE BACKGROUND HANDLER
// // ============================================
// notifee.onBackgroundEvent(async ({ type, detail }) => {
//   if (type === EventType.PRESS) {
//     console.log('📱 Notification pressed:', detail);
//     // Handle notification navigation here
//   }
// });

// // ============================================
// // 2. FIREBASE BACKGROUND MESSAGING
// // ============================================
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('📨 Background message received:', remoteMessage);
//   await displayNotification(remoteMessage);
// });

// // ============================================
// // 3. ✅ BACKGROUND LOCATION TRACKING
// // ============================================
// /**
//  * Register the headless task for background location tracking
//  * 
//  * This task is called by LocationTrackingService whenever a location update
//  * is received. It processes the location data, calculates distance, and stores
//  * the route information.
//  * 
//  * CRITICAL: This MUST be registered BEFORE the main app component
//  */
// AppRegistry.registerHeadlessTask(
//   'LocationTask',
//   () => sendBackgroundLocation
// );

// // ============================================
// // 4. MAIN APP REGISTRATION
// // ============================================
// /**
//  * Register the main React Native app
//  * This MUST be the last registration to avoid conflicts with headless tasks
//  */
// AppRegistry.registerComponent(appName, () => App);

// // ============================================
// // 5. LOG APP START
// // ============================================
// console.log('============================================');
// console.log('🚀 RadnusDistribution App Initialized');
// console.log('📍 Location Tracking: ENABLED');
// console.log('📲 Push Notifications: ENABLED');
// console.log('🔄 Background Tasks: REGISTERED');
// console.log('============================================');
