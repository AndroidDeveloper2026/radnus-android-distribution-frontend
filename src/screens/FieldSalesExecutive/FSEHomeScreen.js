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
import { startTrackingService } from '../../utils/TrackingService';
import { CalendarDays, Clock, MapPin } from 'lucide-react-native';

const FSEHomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [sessionId, setSessionId] = useState(null);

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
        setSessionId(res.data._id);
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

  // const markAttendance = async () => {
  //   try {
  //     const res = await API.post('/api/session/start', {
  //       userId: user._id,
  //       latitude: location.latitude,
  //       longitude: location.longitude,
  //     });

  //     const sessionId = res.data._id;

  //     if (!sessionId) {
  //       alert('Session not created');
  //       return;
  //     }

  //     setSessionId(sessionId);
  //     setAttendanceMarked(true);

  //     dispatch(startTracking(sessionId));
  //     startTrackingService(user._id, sessionId);

  //     navigation.navigate('FSETracking', { sessionId });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const markAttendance = async () => {
    try {
      const res = await API.post('/api/session/start', {
        userId: user._id,
        latitude: location.latitude,
        longitude: location.longitude,
      });

      const sessionId = res.data._id;

      dispatch(startTracking(sessionId));

      // start GPS tracking
      startTrackingService(user._id, sessionId);

      navigation.navigate('FSETracking', { sessionId });
    } catch (err) {
      console.log(err);
    }
  };

  const handleStartDaybtn = () => {
    if (attendanceMarked && sessionId) {
      navigation.navigate('FSETracking', { sessionId });
    } else {
      markAttendance();
    }
  };

  return (
    <View style={FSEHomeStyles.container}>
      <Header title="Start Day" showBackArrow={false} />
      <View style={FSEHomeStyles.content}>
        <Text style={FSEHomeStyles.title}>
          👋 Welcome! {user?.name || 'User'}
        </Text>

        <Text style={FSEHomeStyles.sectionTitle}>Mark Attendance</Text>

        {/* DATE CARD */}
        <View style={FSEHomeStyles.card}>
          <View style={FSEHomeStyles.cardRow}>
            <View style={FSEHomeStyles.iconBox}>
              <CalendarDays size={22} color="#D32F2F" />
            </View>

            <View>
              <Text style={FSEHomeStyles.cardLabel}>Date</Text>
              <Text style={FSEHomeStyles.cardValue}>
                {new Date().toDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* TIME CARD */}
        <View style={FSEHomeStyles.card}>
          <View style={FSEHomeStyles.cardRow}>
            <View style={FSEHomeStyles.iconBox}>
              <Clock size={22} color="#2563EB" />
            </View>

            <View>
              <Text style={FSEHomeStyles.cardLabel}>Time</Text>
              <Text style={FSEHomeStyles.cardValue}>
                {new Date().toLocaleTimeString()}
              </Text>
            </View>
          </View>
        </View>

        {/* LOCATION CARD */}
        <View style={FSEHomeStyles.card}>
          <View style={FSEHomeStyles.cardRow}>
            <View style={FSEHomeStyles.iconBox}>
              <MapPin size={22} color="#16A34A" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={FSEHomeStyles.cardLabel}>Location</Text>

              {location ? (
                <>
                  <Text style={FSEHomeStyles.cardValue}>
                    Lat: {location.latitude}
                  </Text>

                  <Text style={FSEHomeStyles.cardValue}>
                    Lng: {location.longitude}
                  </Text>

                  <Text style={FSEHomeStyles.address}>
                    {address || 'Fetching address...'}
                  </Text>
                </>
              ) : (
                <Text style={FSEHomeStyles.cardValue}>
                  {loading ? 'Fetching...' : 'Retry'}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* START DAY BUTTON */}
        <TouchableOpacity
          style={[
            FSEHomeStyles.startButton,
            (!location || loading || attendanceMarked) &&
              FSEHomeStyles.buttonDisabled,
          ]}
          onPress={handleStartDaybtn}
          disabled={!location || loading || attendanceMarked}
        >
          <Text style={FSEHomeStyles.startButtonText}>
            {attendanceMarked ? 'Day Already Started' : 'START DAY'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FSEHomeScreen;
