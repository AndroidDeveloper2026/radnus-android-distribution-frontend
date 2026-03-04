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
import {startTrackingService} from '../../utils/TrackingService';

const FSEHomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  // const userId = 'user_123';
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
    checkTodaySession();
  }, []);

  const checkTodaySession = async () => {
    try {
      const res = await API.get(`/api/session/today/${user._id}`);

      if (res.data) {
        setAttendanceMarked(true);

        dispatch(startTracking(res.data._id));
      }
    } catch (err) {
      console.log(err.message);
    }
  };

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

  // mark attendeance
  // const markAttendance = async () => {
  //   if (!location) {
  //     Alert.alert('Error', 'Location not available');
  //     return;
  //   }

  //   try {
  //     const res = await API.post('/api/session/start', {
  //       userId: user._id,
  //       latitude: location.latitude,
  //       longitude: location.longitude,
  //     });

  //     const sessionId = res.data._id;

  //     dispatch(startTracking(sessionId));
  //     setAttendanceMarked(true);

  //     navigation.navigate('FSETracking', { sessionId });
  //   } catch (err) {
  //     if (err?.response?.data?.message === 'Day already started') {
  //       setAttendanceMarked(true);

  //       navigation.navigate('FSETracking', {
  //         sessionId: err.response.data.sessionId,
  //       });
  //     } else {
  //       Alert.alert('Error', 'Failed to start day');
  //     }
  //   }
  // };

//   const markAttendance = async () => {

//  if (!location) {
//    Alert.alert("Location not available");
//    return;
//  }

//  try {

//    const res = await API.post("/api/session/start", {
//      userId: user._id,
//      latitude: location.latitude,
//      longitude: location.longitude
//    });

//    const sessionId = res.data._id;

//    dispatch(startTracking(sessionId));

//    navigation.navigate("FSETracking", { sessionId });

//  } catch (err) {
//    Alert.alert("Error starting session");
//  }
// };

const markAttendance = async () => {

 try {

   const res = await API.post('/api/session/start', {
     userId: user._id,
     latitude: location.latitude,
     longitude: location.longitude,
   });

   const sessionId = res.data._id;

   if (!sessionId) {
     alert("Session not created");
     return;
   }

   navigation.navigate('FSETracking', { sessionId });

 } catch (err) {
   console.log(err);
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
          <Text style={FSEHomeStyles.buttonText}>
            {attendanceMarked ? 'Day Already Started' : 'START DAY'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FSEHomeScreen;
