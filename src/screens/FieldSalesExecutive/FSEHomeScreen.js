import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
  Linking,
  ActivityIndicator,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Header from '../../components/Header';
import FSEHomeStyles from './FSEHomeStyle';
import { useDispatch, useSelector } from 'react-redux';
import { startTracking } from '../../services/features/fse/trackingSlice';
import API from '../../services/API/api';
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
  const [startingDay, setStartingDay] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [refreshingLocation, setRefreshingLocation] = useState(false);

  useEffect(() => {
    console.log('🔐 Current user:', user);
    requestLocationPermission();
    checkTodaySession();
  }, []);

  // ✅ CHECK IF SESSION EXISTS FOR TODAY
  const checkTodaySession = async () => {
    try {
      const userId = user?._id || user?.id;

      if (!userId) {
        console.log('⚠️ User ID not available yet');
        return;
      }

      const res = await API.get(`/api/session/today/${userId}`);
      console.log('✅ Existing session found:', res.data);

      if (res.data) {
        setAttendanceMarked(true);
        setSessionId(res.data._id);
        dispatch(startTracking(res.data._id));
      }
    } catch (err) {
      console.log(
        'ℹ️ No existing session for today (this is normal):',
        err.response?.status,
      );
    }
  };

  /* ✅ REQUEST LOCATION PERMISSION */
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'We need your location to track your daily activity',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('✅ Location permission granted');
          getCurrentLocation();
        } else {
          console.log('❌ Location permission denied');
          setLocationLoading(false);
          Alert.alert(
            'Permission Required',
            'Location permission is required to start your day',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ],
          );
        }
      } else {
        // iOS
        getCurrentLocation();
      }
    } catch (err) {
      console.log('❌ Permission request error:', err);
      setLocationLoading(false);
    }
  };

  /* ✅ GET LOCATION - FETCH LAT & LONG FROM GPS */
  const getCurrentLocation = (isInitial = true) => {
    if (isInitial) {
      setLocationLoading(true);
    } else {
      setRefreshingLocation(true);
    }

    console.log('📍 Requesting GPS location...');

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude, accuracy } = position.coords;

        console.log('✅ GPS location received:', {
          latitude,
          longitude,
          accuracy,
        });
        setLocation({ latitude, longitude, accuracy });
        getAddress(latitude, longitude);

        if (isInitial) {
          setLocationLoading(false);
        } else {
          setRefreshingLocation(false);
        }
      },
      error => {
        if (isInitial) {
          setLocationLoading(false);
        } else {
          setRefreshingLocation(false);
        }

        console.log(
          '❌ GPS error code:',
          error.code,
          'message:',
          error.message,
        );

        if (error.code === 1) {
          Alert.alert(
            'Permission Denied',
            'Please allow location permission in app settings',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ],
          );
        } else if (error.code === 2) {
          Alert.alert('GPS Off', 'Please enable GPS to continue', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]);
        } else if (error.code === 3) {
          Alert.alert(
            'Location Timeout',
            'Taking too long to get GPS. Retrying...',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Retry', onPress: () => retryLocation() },
            ],
          );
        } else {
          Alert.alert(
            'Location Error',
            error.message || 'Unable to fetch location. Please try again.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Retry', onPress: () => getCurrentLocation(isInitial) },
            ],
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0, // ✅ Always get fresh location
      },
    );
  };

  const retryLocation = () => {
    console.log('🔄 Retrying location in 2 seconds...');
    setTimeout(() => {
      getCurrentLocation(true);
    }, 2000);
  };

  // ✅ GET ADDRESS FROM COORDINATES
  const getAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: { 'User-Agent': 'FSEApp/1.0' },
        },
      );

      const data = await response.json();
      const fullAddress = data?.display_name || 'Address not found';
      console.log('✅ Address fetched:', fullAddress);
      setAddress(fullAddress);
    } catch (error) {
      console.log('⚠️ Address fetch error:', error.message);
      setAddress('Error fetching address');
    }
  };

  // // ✅ GET FRESH GPS LOCATION WHEN START DAY IS CLICKED
  // const getFreshGPSLocation = () => {
  //   return new Promise((resolve, reject) => {
  //     console.log('📍 Getting FRESH GPS location for session start...');

  //     Geolocation.getCurrentPosition(
  //       position => {
  //         const { latitude, longitude, accuracy, timestamp } = position.coords;

  //         console.log('✅ FRESH GPS location captured:', {
  //           latitude: latitude.toFixed(6),
  //           longitude: longitude.toFixed(6),
  //           accuracy: accuracy.toFixed(2),
  //           timestamp: new Date(timestamp).toISOString(),
  //         });

  //         resolve({
  //           latitude,
  //           longitude,
  //           accuracy,
  //           timestamp,
  //         });
  //       },
  //       error => {
  //         console.log('❌ Error getting fresh GPS location:', error.message);
  //         reject(error);
  //       },
  //       {
  //         enableHighAccuracy: true,
  //         timeout: 15000,
  //         maximumAge: 0, // ✅ MUST get fresh location, never cached
  //       },
  //     );
  //   });
  // };

  const getFreshGPSLocation = () => {
    return new Promise((resolve, reject) => {
      console.log('📍 Getting FRESH GPS location for session start...');

      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude, accuracy } = position.coords;
          const { timestamp } = position;

          console.log('✅ FRESH GPS location captured:', {
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6),
            accuracy: accuracy.toFixed(2),
            timestamp: new Date(timestamp).toISOString(),
          });

          resolve({
            latitude,
            longitude,
            accuracy,
            timestamp,
          });
        },
        error => {
          console.log('❌ Error getting fresh GPS location:', error.message);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        },
      );
    });
  };

  // ✅ MARK ATTENDANCE AND START DAY
  const markAttendance = async () => {
    try {
      // ✅ STEP 1: Validate user
      const userId = user?._id || user?.id;

      if (!userId) {
        Alert.alert('Error', 'User not found. Please log in again.');
        console.log('❌ User ID missing:', user);
        return;
      }

      setStartingDay(true);

      // ✅ STEP 2: Get FRESH GPS location at the moment of clicking
      console.log('🎯 User clicked START DAY - getting fresh GPS location...');

      let freshLocation;
      try {
        freshLocation = await getFreshGPSLocation();
      } catch (err) {
        console.log('❌ Failed to get fresh GPS location:', err.message);
        Alert.alert(
          'Error',
          'Could not get current GPS location. Please enable GPS and try again.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Retry', onPress: () => markAttendance() },
          ],
        );
        setStartingDay(false);
        return;
      }

      console.log('🚀 Starting day with FRESH GPS data:', {
        userId: userId,
        latitude: freshLocation.latitude.toFixed(6),
        longitude: freshLocation.longitude.toFixed(6),
        accuracy: freshLocation.accuracy.toFixed(2),
      });

      // ✅ STEP 3: Call API to create session with fresh location
      const requestBody = {
        userId: userId,
        latitude: freshLocation.latitude,
        longitude: freshLocation.longitude,
      };

      console.log(
        '📤 Sending request to /api/session/start with FRESH GPS:',
        requestBody,
      );

      const res = await API.post('/api/session/start', requestBody);

      console.log('✅ Session created successfully:', res.data);

      const newSessionId = res.data._id;

      if (!newSessionId) {
        Alert.alert(
          'Error',
          'Session created but ID missing. Please try again.',
        );
        console.log('❌ Session ID missing in response:', res.data);
        setStartingDay(false);
        return;
      }

      // ✅ STEP 4: Update local state
      setSessionId(newSessionId);
      setAttendanceMarked(true);

      // ✅ STEP 5: Start Redux tracking
      dispatch(startTracking(newSessionId));
      console.log('✅ Redux tracking started for session:', newSessionId);

      // ✅ STEP 6: Start GPS tracking service (real-time tracking every 5 seconds)
      startTrackingService(userId, newSessionId);
      console.log('✅ GPS tracking service started for continuous tracking');

      // ✅ STEP 7: Navigate to tracking screen
      navigation.navigate('FSETracking', { sessionId: newSessionId });
    } catch (err) {
      console.log('❌ ERROR in markAttendance:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to start day. Please check your connection and try again.';

      Alert.alert('Error', errorMessage, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Retry', onPress: () => markAttendance() },
      ]);

      setStartingDay(false);
    }
  };

  // ✅ HANDLE START DAY BUTTON
  const handleStartDaybtn = () => {
    if (attendanceMarked && sessionId) {
      console.log('📍 Day already started, navigating to tracking');
      navigation.navigate('FSETracking', { sessionId });
    } else {
      console.log('🎯 Starting new day - getting fresh GPS location');
      markAttendance();
    }
  };

  // ✅ REFRESH LOCATION BUTTON
  const handleRefreshLocation = () => {
    console.log('🔄 Manually refreshing location');
    getCurrentLocation(false);
  };

  const isButtonDisabled =
    !location || locationLoading || attendanceMarked || startingDay;

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
              <Text style={FSEHomeStyles.cardLabel}>Current Location</Text>

              {locationLoading ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ActivityIndicator size="small" color="#2563EB" />
                  <Text style={[FSEHomeStyles.cardValue, { marginLeft: 8 }]}>
                    Getting location...
                  </Text>
                </View>
              ) : location ? (
                <>
                  <Text style={FSEHomeStyles.cardValue}>
                    Lat: {location.latitude.toFixed(6)}
                  </Text>

                  <Text style={FSEHomeStyles.cardValue}>
                    Lng: {location.longitude.toFixed(6)}
                  </Text>

                  <Text style={FSEHomeStyles.cardValue}>
                    Accuracy: {location.accuracy?.toFixed(2) || 'N/A'} m
                  </Text>

                  <Text style={FSEHomeStyles.address}>
                    {address || 'Fetching address...'}
                  </Text>

                  {/* REFRESH LOCATION BUTTON */}
                  <TouchableOpacity
                    onPress={handleRefreshLocation}
                    disabled={refreshingLocation}
                    style={{ marginTop: 8 }}
                  >
                    {refreshingLocation ? (
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <ActivityIndicator size="small" color="#2563EB" />
                        <Text style={{ color: '#2563EB', marginLeft: 4 }}>
                          Refreshing...
                        </Text>
                      </View>
                    ) : (
                      <Text style={{ color: '#2563EB', fontWeight: '600' }}>
                        🔄 Refresh Location
                      </Text>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={() => getCurrentLocation(true)}>
                  <Text style={[FSEHomeStyles.cardValue, { color: '#2563EB' }]}>
                    📍 Tap to Get Location
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* INFO TEXT */}
        <View
          style={{
            backgroundColor: '#E3F2FD',
            padding: 10,
            borderRadius: 8,
            marginBottom: 16,
            borderLeftWidth: 4,
            borderLeftColor: '#2563EB',
          }}
        >
          <Text style={{ color: '#1565C0', fontSize: 12, fontWeight: '500' }}>
            ℹ️ Fresh GPS location will be captured when you click "START DAY"
          </Text>
        </View>

        {/* START DAY BUTTON */}
        <TouchableOpacity
          style={[
            FSEHomeStyles.startButton,
            isButtonDisabled && FSEHomeStyles.buttonDisabled,
          ]}
          onPress={handleStartDaybtn}
          disabled={isButtonDisabled}
        >
          {startingDay ? <ActivityIndicator size="small" color="#FFF" /> : null}
          <Text style={FSEHomeStyles.startButtonText}>
            {attendanceMarked
              ? 'Day Already Started'
              : startingDay
              ? 'Getting GPS Location...'
              : 'START DAY'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FSEHomeScreen;
