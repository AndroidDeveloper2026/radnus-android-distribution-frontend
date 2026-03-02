// import { useEffect } from 'react';
// import Geolocation from 'react-native-geolocation-service';
// import { PermissionsAndroid, Platform, Alert } from 'react-native';
// import { useDispatch } from 'react-redux';
// import { setMyLocation } from '../../services/features/fse/locationSlice';
// import socket from '../../services/socket/socket';
// import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

// export default function useLocationTracking(userId, sessionId, isTracking) {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (!isTracking || !sessionId) return;

//     startLocationFlow();

//   }, [isTracking, sessionId]);

//   const startLocationFlow = async () => {
//     const hasPermission = await requestPermission();
//     if (!hasPermission) return;

//     const gpsEnabled = await enableGPS();
//     if (!gpsEnabled) return;

//     startTracking();
//   };

//   // 🔐 Permission
//   const requestPermission = async () => {
//     if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//       );

//       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//         Alert.alert('Permission Required', 'Enable location permission');
//         return false;
//       }
//     }
//     return true;
//   };

//   // 📍 Enable GPS
//   const enableGPS = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
//           interval: 10000,
//           fastInterval: 5000,
//         });
//         return true;
//       } catch (err) {
//         Alert.alert('GPS Required', 'Please enable GPS');
//         return false;
//       }
//     }
//     return true;
//   };

//   // 🚀 Start tracking
//   const startTracking = () => {
//     const watchId = Geolocation.watchPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;

//         const location = {
//           latitude,
//           longitude,
//           latitudeDelta: 0.01,
//           longitudeDelta: 0.01,
//         };

//         // ✅ Update Redux (for MapScreen)
//         dispatch(setMyLocation(location));

//         // ✅ Send to backend WITH sessionId
//         socket.emit('send-location', {
//           userId,
//           sessionId, // 🔥 IMPORTANT
//           latitude,
//           longitude,
//         });
//       },
//       (error) => {
//         console.log('Location error:', error);
//       },
//       {
//         enableHighAccuracy: true,
//         distanceFilter: 10,
//         interval: 5000,
//         fastestInterval: 2000,
//         forceRequestLocation: true,
//       }
//     );

//     // ✅ Cleanup when stop tracking
//     return () => Geolocation.clearWatch(watchId);
//   };
// }