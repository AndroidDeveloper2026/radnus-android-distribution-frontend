// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   Platform,
//   PermissionsAndroid,
//   Linking,
// } from 'react-native';
// import Geolocation from '@react-native-community/geolocation';
// import Header from '../../components/Header';
// import FSEHomeStyles from './FSEHomeStyle';
// import { useDispatch } from "react-redux";
// import { startTracking } from "../../services/features/fse/trackingSlice";
// import API from '../../services/API/api';

// const FSEHomeScreen = ({ navigation }) => {
//   const dispatch = useDispatch();
//   const userId = "user_123";
//   const [location, setLocation] = useState(null);
//   const [address, setAddress] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [attendanceMarked, setAttendanceMarked] = useState(false);

//   useEffect(() => {
//     requestLocationPermission();
//   }, []);

//   /* ---------------- PERMISSION ---------------- */
//   const requestLocationPermission = async () => {
//     try {
//       if (Platform.OS === 'android') {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         );

//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           getCurrentLocation();
//         } else {
//           Alert.alert(
//             'Permission Required',
//             'Location permission is required',
//           );
//         }
//       } else {
//         getCurrentLocation();
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   /* ---------------- GET LOCATION ---------------- */
//   const getCurrentLocation = () => {
//     setLoading(true);

//     Geolocation.getCurrentPosition(
//       position => {
//         const { latitude, longitude, accuracy } = position.coords;

//         setLocation({ latitude, longitude, accuracy });
//         setLoading(false);

//         // 🔥 fetch address
//         getAddress(latitude, longitude);
//       },
//       error => {
//         setLoading(false);
//         console.log('LOCATION ERROR:', error);

//         if (error.code === 1) {
//           Alert.alert('Permission Denied', 'Allow location permission');
//         } else if (error.code === 2) {
//           Alert.alert('GPS Off', 'Please enable GPS', [
//             {
//               text: 'Open Settings',
//               onPress: () => Linking.openSettings(),
//             },
//           ]);
//         } else if (error.code === 3) {
//           Alert.alert('Timeout', 'Retrying location...');
//           retryLocation();
//         } else {
//           Alert.alert('Error', 'Unable to fetch location');
//         }
//       },
//       {
//         enableHighAccuracy: false, // ✅ stable
//         timeout: 30000, // ✅ important
//         maximumAge: 10000,
//       },
//     );
//   };

//   /* ---------------- RETRY ---------------- */
//   const retryLocation = () => {
//     setTimeout(() => {
//       getCurrentLocation();
//     }, 2000);
//   };

//   /* ---------------- GET ADDRESS (FREE API) ---------------- */
//   const getAddress = async (lat, lng) => {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
//         {
//           headers: {
//             'User-Agent': 'FSEApp/1.0',
//           },
//         },
//       );

//       const data = await response.json();

//       if (data?.display_name) {
//         setAddress(data.display_name);
//       } else {
//         setAddress('Address not found');
//       }
//     } catch (error) {
//       console.log('ADDRESS ERROR:', error);
//       setAddress('Error fetching address');
//     }
//   };

//   const markAttendance = async () => {
//   if (!location) {
//     Alert.alert("Error", "Location not available");
//     return;
//   }

//   try {
//     setLoading(true);

//     // ✅ START SESSION
//     const res = await API.post("/session/start", {
//       userId,
//       latitude: location.latitude,
//       longitude: location.longitude,
//     });

//     const sessionId = res.data._id;

//     // ✅ START TRACKING
//     dispatch(startTracking(sessionId));

//     setAttendanceMarked(true);
//     setLoading(false);

//     Alert.alert("Success", "Day Started", [
//       {
//         text: "OK",
//         onPress: () =>
//           navigation.replace("MainTabs", {
//             screen: "Dashboard",
//           }),
//       },
//     ]);
//   } catch (err) {
//     setLoading(false);
//     Alert.alert("Error", "Failed to start day");
//   }
// };

//   /* ---------------- MARK ATTENDANCE ---------------- */
//   // const markAttendance = () => {
//   //   if (!location) {
//   //     Alert.alert('Error', 'Location not available');
//   //     return;
//   //   }

//   //   const payload = {
//   //     latitude: location.latitude,
//   //     longitude: location.longitude,
//   //     address,
//   //     time: new Date(),
//   //   };

//   //   console.log('Attendance:', payload);

//   //   setLoading(true);

//   //   setTimeout(() => {
//   //     setAttendanceMarked(true);
//   //     setLoading(false);

//   //     Alert.alert('Success', 'Attendance marked successfully', [
//   //       {
//   //         text: 'OK',
//   //         onPress: () =>
//   //           navigation.replace('MainTabs', {
//   //             screen: 'Dashboard',
//   //             params: { role: 'FSE' },
//   //           }),
//   //       },
//   //     ]);
//   //   }, 1000);
//   // };

//   return (
//     <View style={FSEHomeStyles.container}>
//       <Header title="Start Day" showBackArrow={false} />

//       <View style={FSEHomeStyles.content}>
//         <Text style={FSEHomeStyles.title}>Mark Attendance</Text>

//         {/* DATE */}
//         <View style={FSEHomeStyles.infoBox}>
//           <Text style={FSEHomeStyles.infoLabel}>Date</Text>
//           <Text style={FSEHomeStyles.infoValue}>
//             {new Date().toDateString()}
//           </Text>
//         </View>

//         {/* TIME */}
//         <View style={FSEHomeStyles.infoBox}>
//           <Text style={FSEHomeStyles.infoLabel}>Time</Text>
//           <Text style={FSEHomeStyles.infoValue}>
//             {new Date().toLocaleTimeString()}
//           </Text>
//         </View>

//         {/* LOCATION */}
//         <View style={FSEHomeStyles.infoBox}>
//           <Text style={FSEHomeStyles.infoLabel}>Location</Text>

//           {location ? (
//             <>
//               <Text style={FSEHomeStyles.infoValue}>
//                 Lat: {location.latitude}
//               </Text>
//               <Text style={FSEHomeStyles.infoValue}>
//                 Long: {location.longitude}
//               </Text>

//               <Text style={FSEHomeStyles.infoAddressValue}>
//                 {address || 'Fetching address...'}
//               </Text>
//             </>
//           ) : (
//             <Text style={FSEHomeStyles.gpsStatus}>
//               {loading ? 'Fetching location...' : 'Tap retry'}
//             </Text>
//           )}
//         </View>

//         {/* RETRY BUTTON */}
//         {!location && (
//           <TouchableOpacity
//             style={FSEHomeStyles.secondaryBtn}
//             onPress={getCurrentLocation}
//           >
//             <Text style={FSEHomeStyles.secondaryText}>
//               Retry Location
//             </Text>
//           </TouchableOpacity>
//         )}

//         {/* START BUTTON */}
//         <TouchableOpacity
//           style={[
//             FSEHomeStyles.button,
//             (!location || loading || attendanceMarked) &&
//               FSEHomeStyles.buttonDisabled,
//           ]}
//           onPress={markAttendance}
//           disabled={!location || loading || attendanceMarked}
//         >
//           <Text style={FSEHomeStyles.buttonText}>
//             {attendanceMarked ? 'ATTENDANCE MARKED' : 'START DAY'}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default FSEHomeScreen;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Header from '../../components/Header';
import FSEHomeStyles from './FSEHomeStyle';
import { useDispatch, useSelector } from 'react-redux';
import { startTracking } from '../../services/features/fse/trackingSlice';
import API from '../../services/API/api'; // ✅ IMPORTANT

const FSEHomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userId = 'user_123';
  const user = useSelector(state => state.auth.user);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  const retryLocation = () => {
    setTimeout(() => {
      getCurrentLocation();
    }, 2000);
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  /* ---------------- PERMISSION ---------------- */
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        Alert.alert('Permission Required', 'Location permission is required');
      }
    } else {
      getCurrentLocation();
    }
  };

  /* ---------------- GET LOCATION ---------------- */
  const getCurrentLocation = () => {
    setLoading(true);

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        setLocation({ latitude, longitude });
        getAddress(latitude, longitude);
        setLoading(false);
      },
      error => {
        setLoading(false);

        if (error.code === 1) {
          Alert.alert('Permission Denied', 'Allow location permission');
        } else if (error.code === 2) {
          Alert.alert('GPS Off', 'Please enable GPS', [
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]);
        } else if (error.code === 3) {
          Alert.alert('Timeout', 'Retrying...');
          retryLocation();
        } else {
          Alert.alert('Error', 'Unable to fetch location');
        }
      },
      // error => {
      //   setLoading(false);
      //   Alert.alert('Error', 'Unable to fetch location');
      // },
      {
        enableHighAccuracy: true,
        timeout: 30000,
      },
    );
  };

  const getAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: { 'User-Agent': 'FSEApp/1.0' },
        },
      );

      const data = await response.json();

      setAddress(data?.display_name || 'Address not found');
    } catch (error) {
      setAddress('Error fetching address');
    }
  };

  /* ---------------- START DAY ---------------- */
  const markAttendance = async () => {
    if (!location) {
      Alert.alert('Error', 'Location not available');
      return;
    }

    try {
      setLoading(true);

      console.log('Sending:', {
        userId,
        latitude: location.latitude,
        longitude: location.longitude,
      });

      const res = await API.post('/api/session/start', {
        userId,
        latitude: location.latitude,
        longitude: location.longitude,
      });

      console.log('Response:', res.data);

      // if (!sessionId) return;

      const sessionId = res.data._id;

      dispatch(startTracking(sessionId));

      setAttendanceMarked(true);

      Alert.alert('Success', 'Day Started', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Dashboard'),
        },
      ]);
    } catch (err) {
      console.log('ERROR:', err?.response?.data || err.message);

      Alert.alert(
        'Error',
        err?.response?.data?.message || 'Failed to start day',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={FSEHomeStyles.container}>
      <Header title="Start Day" showBackArrow={false} />

      <View style={FSEHomeStyles.content}>
        <Text style={FSEHomeStyles.title}>Welcome, {user?.name || 'User'}</Text>
        <Text style={FSEHomeStyles.title}>Mark Attendance</Text>

        <View style={FSEHomeStyles.infoBox}>
          <Text>Date</Text>
          <Text>{new Date().toDateString()}</Text>
        </View>

        <View style={FSEHomeStyles.infoBox}>
          <Text>Time</Text>
          <Text>{new Date().toLocaleTimeString()}</Text>
        </View>

        <View style={FSEHomeStyles.infoBox}>
          <Text>Location</Text>

          {location ? (
            <>
              <Text>Lat: {location.latitude}</Text>
              <Text>Lng: {location.longitude}</Text>

              <Text style={FSEHomeStyles.infoAddressValue}>
                {address || 'Fetching address...'}
              </Text>
            </>
          ) : (
            <Text>{loading ? 'Fetching...' : 'Retry'}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            FSEHomeStyles.button,
            (!location || loading || attendanceMarked) &&
              FSEHomeStyles.buttonDisabled,
          ]}
          onPress={markAttendance}
          disabled={!location || loading || attendanceMarked}
        >
          <Text style={FSEHomeStyles.buttonText}>START DAY</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FSEHomeScreen;
