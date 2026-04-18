import React, { useEffect, useState, useRef } from 'react';
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
import { CalendarDays, Clock, MapPin, Info, RefreshCw } from 'lucide-react-native';
import {
  getSessionId,
  setSessionId as saveSessionId,
} from '../../services/AuthStorage/authStorgage';

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

  const permissionChecked = useRef(false);
  const locationLoadedRef = useRef(false); // ✅ FIX: ref to track loaded state for iOS setTimeout

  useEffect(() => {
    const initialize = async () => {
      if (!permissionChecked.current) {
        permissionChecked.current = true;
        await requestLocationPermission();
      }
    };
    initialize();
  }, []); // ✅ FIX: permission requested once on mount, independent of user

  useEffect(() => {
    // ✅ FIX: session load is separate from permission — runs when user becomes available
    const loadSession = async () => {
      if (user?._id || user?.id) {
        await loadSavedSession();
      }
    };
    loadSession();
  }, [user]);

  const loadSavedSession = async () => {
    try {
      const savedSession = await getSessionId();
      if (savedSession) {
        setSessionId(savedSession);
        setAttendanceMarked(true);
        dispatch(startTracking(savedSession));
      } else {
        await checkTodaySession();
      }
    } catch (err) {

    }
  };

  const checkTodaySession = async () => {
    try {
      const userId = user?._id || user?.id;
      if (!userId) {

        return;
      }
      const res = await API.get(`/api/session/today/${userId}`);
      if (res.data) {
        setAttendanceMarked(true);
        setSessionId(res.data._id);
        dispatch(startTracking(res.data._id));
      }
    } catch (err) {

    }
  };

  const handleLocationError = error => {
    setLocationLoading(false);
    setRefreshingLocation(false);
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
    } else {
      Alert.alert(
        'Location Error',
        error.message || 'Unable to fetch location. Please try again.',
      );
    }
  };

  const fetchCurrentPosition = (onSuccess, onError) => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({ latitude, longitude, accuracy });
        getAddress(latitude, longitude);
        locationLoadedRef.current = true; // ✅ FIX: update ref so setTimeout knows we're done
        onSuccess?.();
      },
      error => {
        onError ? onError(error) : handleLocationError(error);
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 },
    );
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted) {
          getCurrentLocation(true);
          return;
        }

        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'We need your location to track your daily activity',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation(true);
        } else {
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
        Geolocation.requestAuthorization('whenInUse', () => {
          // Callback fires when user responds
          fetchCurrentPosition(
            () => setLocationLoading(false),
            error => handleLocationError(error),
          );
        });

        // ✅ FIX: use ref (not state) to avoid stale closure in setTimeout
        setTimeout(() => {
          if (!locationLoadedRef.current) {
            fetchCurrentPosition(
              () => setLocationLoading(false),
              error => handleLocationError(error),
            );
          }
        }, 2500);
      }
    } catch (err) {
      setLocationLoading(false);
      console.error('Permission error:', err);
    }
  };

  const getCurrentLocation = (isInitial = true) => {
    if (isInitial) {
      setLocationLoading(true);
    } else {
      setRefreshingLocation(true);
    }

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({ latitude, longitude, accuracy });
        getAddress(latitude, longitude);
        locationLoadedRef.current = true;
        if (isInitial) {
          setLocationLoading(false);
        } else {
          setRefreshingLocation(false);
        }
      },
      error => handleLocationError(error),
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 },
    );
  };

  const getAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        { headers: { 'User-Agent': 'FSEApp/1.0' } },
      );
      const data = await response.json();
      const fullAddress = data?.display_name || 'Address not found';
      setAddress(fullAddress);
    } catch {
      setAddress('Error fetching address');
    }
  };

  const getFreshGPSLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude, accuracy } = position.coords;
          const { timestamp } = position;
          resolve({ latitude, longitude, accuracy, timestamp });
        },
        error => reject(error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
      );
    });
  };

  const markAttendance = async () => {
    try {
      const userId = user?._id || user?.id;
      if (!userId) {
        Alert.alert('Error', 'User not found.');
        return;
      }

      setStartingDay(true);

      let freshLocation;
      try {
        freshLocation = await getFreshGPSLocation();
      } catch (gpsErr) {
        setStartingDay(false);
        Alert.alert(
          'GPS Error',
          'Unable to get your current location. Please try again.',
        );
        return;
      }

      const res = await API.post('/api/session/start', {
        userId,
        latitude: freshLocation.latitude,
        longitude: freshLocation.longitude,
      });
      const newSessionId = res.data._id;

      await saveSessionId(newSessionId);
      setSessionId(newSessionId);
      setAttendanceMarked(true);
      dispatch(startTracking(newSessionId));
      startTrackingService(userId, newSessionId);

      setStartingDay(false);
      navigation.navigate('FSETracking', { sessionId: newSessionId });
    } catch (err) {

      Alert.alert('Error', 'Failed to start day. Please try again.');
      setStartingDay(false);
    }
  };

  const handleStartDaybtn = () => {
    if (attendanceMarked && sessionId) {
      navigation.navigate('FSETracking', { sessionId });
    } else {
      markAttendance();
    }
  };

  const handleRefreshLocation = () => {
    getCurrentLocation(false);
  };

  const isButtonDisabled = !location || locationLoading || startingDay;

  return (
    <View style={FSEHomeStyles.container}>
      <Header title="Start Day" showBackArrow={false} />
      <View style={FSEHomeStyles.content}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Text style={FSEHomeStyles.title}>
            👋 Welcome! {user?.name || 'User'}
          </Text>
        </View>

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
                <ActivityIndicator size="small" color="#2563EB" />
              ) : location ? (
                <>
                  <Text style={FSEHomeStyles.cardValue}>
                    Lat: {location.latitude.toFixed(6)}
                  </Text>
                  <Text style={FSEHomeStyles.cardValue}>
                    Lng: {location.longitude.toFixed(6)}
                  </Text>
                  <Text style={FSEHomeStyles.address}>
                    {address || 'Fetching address...'}
                  </Text>
                  <TouchableOpacity
                    onPress={handleRefreshLocation}
                    disabled={refreshingLocation}
                    style={{ marginTop: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {refreshingLocation ? (
                        <ActivityIndicator size="small" color="#2563EB" style={{ marginRight: 4 }} />
                      ) : (
                        <RefreshCw size={16} color="#2563EB" style={{ marginRight: 4 }} />
                      )}
                      <Text style={{ color: '#2563EB', fontWeight: '600' }}>
                        {refreshingLocation ? 'Refreshing...' : 'Refresh Location'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={() => getCurrentLocation(true)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MapPin size={16} color="#2563EB" style={{ marginRight: 4 }} />
                    <Text style={[FSEHomeStyles.cardValue, { color: '#2563EB' }]}>
                      Tap to Get Location
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* INFO */}
        <View style={{
          backgroundColor: '#E3F2FD',
          padding: 10,
          borderRadius: 8,
          marginBottom: 16,
          borderLeftWidth: 4,
          borderLeftColor: '#2563EB',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Info size={16} color="#1565C0" style={{ marginRight: 6 }} />
          <Text style={{ color: '#1565C0', fontSize: 12, fontWeight: '500', flex: 1 }}>
            Fresh GPS location will be captured when you click "START DAY"
          </Text>
        </View>

        {/* START BUTTON */}
        <TouchableOpacity
          style={[FSEHomeStyles.startButton, isButtonDisabled && FSEHomeStyles.buttonDisabled]}
          onPress={handleStartDaybtn}
          disabled={isButtonDisabled}>
          {startingDay && (
            <ActivityIndicator size="small" color="#FFF" style={{ marginRight: 8 }} />
          )}
          <Text style={FSEHomeStyles.startButtonText}>
            {attendanceMarked
              ? 'Day Already Started — View Tracking'
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