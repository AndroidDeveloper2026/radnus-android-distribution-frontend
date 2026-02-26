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
// import FSEHomeStyles from './FSEHomeStyle';
// import Header from '../../components/Header';

// const FSEHomeScreen = ({ navigation }) => {
//   const [location, setLocation] = useState(null);
//   const [address, setAddress] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [attendanceMarked, setAttendanceMarked] = useState(false);

//   useEffect(() => {
//     requestLocationPermission();
//   }, []);

//   // ✅ REQUEST PERMISSION
//   const requestLocationPermission = async () => {
//     if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       );

//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         getCurrentLocation();
//       } else {
//         Alert.alert('Permission Required', 'Location permission is required');
//       }
//     } else {
//       getCurrentLocation();
//     }
//   };

//   // 🌍 FREE ADDRESS (FIXED VERSION)
//   const getAddressFromOSM = async (lat, lng) => {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
//         {
//           headers: {
//             'User-Agent': 'FSEApp/1.0 (support@yourapp.com)', // ✅ IMPORTANT
//             Accept: 'application/json',
//           },
//         },
//       );

//       const data = await response.json();

//       console.log('OSM DATA:', data);

//       if (data && data.display_name) {
//         setAddress(data.display_name);
//       } else {
//         setAddress('Address not found');
//       }
//     } catch (error) {
//       console.log('OSM ERROR:', error);
//       setAddress('Error fetching address');
//     }
//   };

//   // GET LOCATION
//   const getCurrentLocation = () => {
//     setLoading(true);

//     Geolocation.getCurrentPosition(
//       position => {
//         const lat = position.coords.latitude;
//         const lng = position.coords.longitude;

//         setLocation({
//           latitude: lat,
//           longitude: lng,
//         });

//         // ✅ SMALL DELAY (avoid rate-limit issues)
//         setTimeout(() => {
//           getAddressFromOSM(lat, lng);
//         }, 1000);

//         setLoading(false);
//       },
//       error => {
//         setLoading(false);

//         if (error.code === 1) {
//           Alert.alert('Permission Denied', 'Enable location permission');
//         } else if (error.code === 2) {
//           Alert.alert('Location Disabled', 'Please turn ON GPS', [
//             {
//               text: 'Open Settings',
//               onPress: () => Linking.openSettings(),
//             },
//             { text: 'Cancel', style: 'cancel' },
//           ]);
//         } else if (error.code === 3) {
//           Alert.alert('Timeout', 'Fetching location is taking too long');
//         }
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 20000,
//         maximumAge: 10000,
//       },
//     );
//   };

//   // ✅ MARK ATTENDANCE
//   const markAttendance = () => {
//     if (!location) {
//       Alert.alert('GPS Error', 'Location not captured');
//       return;
//     }

//     const payload = {
//       latitude: location.latitude,
//       longitude: location.longitude,
//       address: address,
//       time: new Date(),
//     };

//     console.log('Attendance Payload:', payload);

//     setLoading(true);

//     setTimeout(() => {
//       setAttendanceMarked(true);
//       setLoading(false);

//       Alert.alert('Success', 'Attendance marked successfully', [
//         {
//           text: 'OK',
//           onPress: () =>
//             navigation.replace('MainTabs', {
//               screen: 'Dashboard',
//               params: { role: 'FSE' },
//             }),
//         },
//       ]);
//     }, 1000);
//   };

//   return (
//     <View style={FSEHomeStyles.container}>
//       <Header title={'Start Day'} showBackArrow={false} />

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

//         {/* LOCATION + ADDRESS */}
//         <View style={FSEHomeStyles.infoBox}>
//           <Text style={FSEHomeStyles.infoLabel}>GPS Location</Text>

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
//             <Text style={FSEHomeStyles.gpsStatus}>Fetching location…</Text>
//           )}
//         </View>

//         {/* BUTTON */}
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

const FSEHomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  /* ---------------- PERMISSION ---------------- */
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          Alert.alert(
            'Permission Required',
            'Location permission is required',
          );
        }
      } else {
        getCurrentLocation();
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* ---------------- GET LOCATION ---------------- */
  const getCurrentLocation = () => {
    setLoading(true);

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude, accuracy } = position.coords;

        setLocation({ latitude, longitude, accuracy });
        setLoading(false);

        // 🔥 fetch address
        getAddress(latitude, longitude);
      },
      error => {
        setLoading(false);
        console.log('LOCATION ERROR:', error);

        if (error.code === 1) {
          Alert.alert('Permission Denied', 'Allow location permission');
        } else if (error.code === 2) {
          Alert.alert('GPS Off', 'Please enable GPS', [
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ]);
        } else if (error.code === 3) {
          Alert.alert('Timeout', 'Retrying location...');
          retryLocation();
        } else {
          Alert.alert('Error', 'Unable to fetch location');
        }
      },
      {
        enableHighAccuracy: false, // ✅ stable
        timeout: 30000, // ✅ important
        maximumAge: 10000,
      },
    );
  };

  /* ---------------- RETRY ---------------- */
  const retryLocation = () => {
    setTimeout(() => {
      getCurrentLocation();
    }, 2000);
  };

  /* ---------------- GET ADDRESS (FREE API) ---------------- */
  const getAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'User-Agent': 'FSEApp/1.0',
          },
        },
      );

      const data = await response.json();

      if (data?.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress('Address not found');
      }
    } catch (error) {
      console.log('ADDRESS ERROR:', error);
      setAddress('Error fetching address');
    }
  };

  /* ---------------- MARK ATTENDANCE ---------------- */
  const markAttendance = () => {
    if (!location) {
      Alert.alert('Error', 'Location not available');
      return;
    }

    const payload = {
      latitude: location.latitude,
      longitude: location.longitude,
      address,
      time: new Date(),
    };

    console.log('Attendance:', payload);

    setLoading(true);

    setTimeout(() => {
      setAttendanceMarked(true);
      setLoading(false);

      Alert.alert('Success', 'Attendance marked successfully', [
        {
          text: 'OK',
          onPress: () =>
            navigation.replace('MainTabs', {
              screen: 'Dashboard',
              params: { role: 'FSE' },
            }),
        },
      ]);
    }, 1000);
  };

  return (
    <View style={FSEHomeStyles.container}>
      <Header title="Start Day" showBackArrow={false} />

      <View style={FSEHomeStyles.content}>
        <Text style={FSEHomeStyles.title}>Mark Attendance</Text>

        {/* DATE */}
        <View style={FSEHomeStyles.infoBox}>
          <Text style={FSEHomeStyles.infoLabel}>Date</Text>
          <Text style={FSEHomeStyles.infoValue}>
            {new Date().toDateString()}
          </Text>
        </View>

        {/* TIME */}
        <View style={FSEHomeStyles.infoBox}>
          <Text style={FSEHomeStyles.infoLabel}>Time</Text>
          <Text style={FSEHomeStyles.infoValue}>
            {new Date().toLocaleTimeString()}
          </Text>
        </View>

        {/* LOCATION */}
        <View style={FSEHomeStyles.infoBox}>
          <Text style={FSEHomeStyles.infoLabel}>Location</Text>

          {location ? (
            <>
              <Text style={FSEHomeStyles.infoValue}>
                Lat: {location.latitude}
              </Text>
              <Text style={FSEHomeStyles.infoValue}>
                Long: {location.longitude}
              </Text>

              <Text style={FSEHomeStyles.infoAddressValue}>
                {address || 'Fetching address...'}
              </Text>
            </>
          ) : (
            <Text style={FSEHomeStyles.gpsStatus}>
              {loading ? 'Fetching location...' : 'Tap retry'}
            </Text>
          )}
        </View>

        {/* RETRY BUTTON */}
        {!location && (
          <TouchableOpacity
            style={FSEHomeStyles.secondaryBtn}
            onPress={getCurrentLocation}
          >
            <Text style={FSEHomeStyles.secondaryText}>
              Retry Location
            </Text>
          </TouchableOpacity>
        )}

        {/* START BUTTON */}
        <TouchableOpacity
          style={[
            FSEHomeStyles.button,
            (!location || loading || attendanceMarked) &&
              FSEHomeStyles.buttonDisabled,
          ]}
          onPress={markAttendance}
          disabled={!location || loading || attendanceMarked}
        >
          <Text style={FSEHomeStyles.buttonText}>
            {attendanceMarked ? 'ATTENDANCE MARKED' : 'START DAY'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FSEHomeScreen;


