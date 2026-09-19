
// FSEHomeScreen.js - CORRECTED VERSION WITH BACKGROUND LOCATION

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
  ScrollView,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Header from '../../components/Header';
import FSEHomeStyles from './FSEHomeStyle';
import { useDispatch, useSelector } from 'react-redux';
import { startTracking, resumeTracking, setRecovering } from '../../services/features/fse/trackingSlice';
import API from '../../services/API/api';
import { useLocationTracking } from '../../utils/hooks/useLocationTracking';

import {
  CalendarDays,
  Clock,
  MapPin,
  Info,
  RefreshCw,
  Lock,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Hand,
} from 'lucide-react-native';
import {
  getSessionId,
  setSessionId as saveSessionId,
  clearSessionId,
  hasAcknowledgedLocationDisclosure,
  setLocationDisclosureAcknowledged,
} from '../../services/AuthStorage/authStorgage';
import LocationDisclosureModal from '../../components/LocationDisclosureModal';

const FSEHomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const { recovering } = useSelector(state => state.tracking);
  
  const {
    distance,
    isTracking,
    startTracking: hookStartTracking,
    endTracking: hookEndTracking,
  } = useLocationTracking();

  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [startingDay, setStartingDay] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [refreshingLocation, setRefreshingLocation] = useState(false);
  const [sessionCheckError, setSessionCheckError] = useState(null);
  const [lockedStartLocation, setLockedStartLocation] = useState(null);
  const [gpsAccuracyWarning, setGpsAccuracyWarning] = useState(false);
  const [gpsStatus, setGpsStatus] = useState('checking');
  const [showLocationDisclosure, setShowLocationDisclosure] = useState(false);

  const permissionChecked = useRef(false);
  const locationLoadedRef = useRef(false);

  // Location Disclosure
  useEffect(() => {
    const initialize = async () => {
      if (permissionChecked.current) return;
      permissionChecked.current = true;

      const userId = user?._id || user?.id;
      const alreadyAcknowledged = await hasAcknowledgedLocationDisclosure(userId);

      if (alreadyAcknowledged) {
        await requestLocationPermission();
      } else {
        setLocationLoading(false);
        setShowLocationDisclosure(true);
      }
    };
    initialize();
  }, [user]);

  const handleDisclosureAllow = async () => {
    const userId = user?._id || user?.id;
    await setLocationDisclosureAcknowledged(userId);
    setShowLocationDisclosure(false);
    setLocationLoading(true);
    await requestLocationPermission();
  };

  const handleDisclosureDeny = () => {
    setShowLocationDisclosure(false);
    setLocationLoading(false);
    Alert.alert(
      'Location Required',
      'Radnus Connect needs location access to record attendance and track your route during your workday.',
    );
  };

  // Session Recovery
  useEffect(() => {
    const loadSession = async () => {
      if (user?._id || user?.id) {
        await recoverOrLoadSession();
      }
    };
    loadSession();
  }, [user]);

  const recoverOrLoadSession = async () => {
    dispatch(setRecovering(true));
    setSessionCheckError(null);

    try {
      const userId = user?._id || user?.id;
      if (!userId) return;

      let localSessionId = null;
      try {
        localSessionId = await getSessionId();
      } catch (storageErr) {
        console.error('Failed to read local sessionId:', storageErr);
      }

      if (localSessionId) {
        try {
          const res = await API.get(`/api/session/${localSessionId}`);
          const session = res.data;

          if (session && session.status === 'ACTIVE') {
            console.log('✅ Resuming session:', localSessionId);
            setSessionId(localSessionId);
            setAttendanceMarked(true);
            if (session.startLocation) {
              setLockedStartLocation(session.startLocation);
            }
            dispatch(resumeTracking(localSessionId));
            
            // START GPS TRACKING
            const uid = user?._id || user?.id;
            if (uid) await hookStartTracking(uid, localSessionId, true);
            
            return;
          }

          console.log(`Session ${localSessionId} no longer active`);
          await clearSessionId();
        } catch (err) {
          if (err.response?.status === 404) {
            await clearSessionId();
          } else {
            console.error('Failed to verify session:', err);
          }
        }
      }

      await checkTodaySession();
    } finally {
      dispatch(setRecovering(false));
    }
  };

  const checkTodaySession = async () => {
    try {
      const userId = user?._id || user?.id;
      if (!userId) return;

      const res = await API.get(`/api/session/today/${userId}`);
      if (res.data) {
        console.log('✅ Found today session:', res.data._id);
        setAttendanceMarked(true);
        setSessionId(res.data._id);
        if (res.data.startLocation) {
          setLockedStartLocation(res.data.startLocation);
        }
        await saveSessionId(res.data._id);
        dispatch(resumeTracking(res.data._id));
        
        // START GPS TRACKING
        const uid = user?._id || user?.id;
        if (uid) await hookStartTracking(uid, res.data._id, true);
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Failed to check session:', err);
        setSessionCheckError('Could not verify session. Try again.');
      }
    }
  };

  const handleLocationError = error => {
    setLocationLoading(false);
    setRefreshingLocation(false);
    setGpsStatus('failed');
    console.error('Location error:', error);
    
    if (error.code === 1) {
      Alert.alert('Permission Denied', 'Allow location permission in settings');
    } else if (error.code === 2) {
      Alert.alert('GPS Off', 'Enable GPS to continue');
    } else if (error.code === 3) {
      Alert.alert('GPS Timeout', 'GPS is taking too long. Try again.');
    }
  };

  const getCurrentLocation = (isInitial = true, useHighAccuracy = true) => {
    if (isInitial) {
      setLocationLoading(true);
    } else {
      setRefreshingLocation(true);
    }

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log('✅ Location updated:', { latitude, longitude, accuracy });
        setLocation({ latitude, longitude, accuracy });
        setLocationAccuracy(accuracy);
        setGpsStatus('working');
        
        if (accuracy > 50) {
          setGpsAccuracyWarning(true);
        } else {
          setGpsAccuracyWarning(false);
        }
        
        getAddress(latitude, longitude);
        locationLoadedRef.current = true;
        if (isInitial) {
          setLocationLoading(false);
        } else {
          setRefreshingLocation(false);
        }
      },
      error => {
        if (error.code === 3 && useHighAccuracy) {
          console.log('Retrying with low accuracy...');
          getCurrentLocation(isInitial, false);
          return;
        }
        handleLocationError(error);
      },
      {
        enableHighAccuracy: useHighAccuracy,
        timeout: useHighAccuracy ? 20000 : 15000,
        maximumAge: useHighAccuracy ? 0 : 60000,
      },
    );
  };

  const getAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        { headers: { 'User-Agent': 'FSEApp/1.0' } },
      );
      const data = await response.json();
      setAddress(data?.display_name || 'Address not found');
    } catch (err) {
      console.error('Failed to fetch address:', err);
      setAddress('Unable to fetch address');
    }
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
            buttonPositive: 'OK',
          },
        );
        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation(true);
        } else {
          setLocationLoading(false);
          Alert.alert('Permission Required', 'Location permission is required');
        }
      } else {
        Geolocation.requestAuthorization('whenInUse');
        setTimeout(() => getCurrentLocation(true), 2500);
      }
    } catch (err) {
      setLocationLoading(false);
      console.error('Permission error:', err);
    }
  };

  // ✅ BACKGROUND LOCATION PERMISSION (Android 10+)
  const requestBackgroundLocation = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 29) {
      try {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          { 
            title: 'Background Location', 
            message: 'Required for route tracking when app is closed.', 
            buttonPositive: 'OK' 
          }
        );
        return result === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Background location permission error:', err);
        return false;
      }
    }
    return true;
  };

  const getFreshGPSLocation = () => {
    return new Promise((resolve, reject) => {
      console.log('📡 Getting fresh GPS location...');
      
      let attempts = 0;
      const maxAttempts = 10;
      let bestLocation = null;
      let bestAccuracy = Infinity;

      const attemptGPS = (useHighAccuracy = true) => {
        attempts++;
        console.log(`GPS attempt ${attempts}/${maxAttempts}`);

        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            console.log(`GPS result:`, { latitude, longitude, accuracy });
            
            if (!bestLocation || accuracy < bestAccuracy) {
              bestAccuracy = accuracy;
              bestLocation = { latitude, longitude, accuracy, timestamp: position.timestamp };
            }

            if (accuracy < 100 || attempts >= 5) {
              console.log(`✅ Accepting GPS (${accuracy}m)`);
              resolve(bestLocation);
            } else if (attempts < maxAttempts) {
              setTimeout(() => attemptGPS(!useHighAccuracy), 1000);
            }
          },
          (error) => {
            console.log(`GPS attempt ${attempts} failed:`, error.message);
            
            if (attempts < maxAttempts) {
              setTimeout(() => attemptGPS(!useHighAccuracy), 2000);
            } else if (bestLocation) {
              resolve(bestLocation);
            } else {
              reject(error);
            }
          },
          { 
            enableHighAccuracy: useHighAccuracy, 
            timeout: useHighAccuracy ? 15000 : 20000,
            maximumAge: useHighAccuracy ? 0 : 30000
          }
        );
      };

      attemptGPS(true);
    });
  };

  const markAttendance = async () => {
    const userId = user?._id || user?.id;
    if (!userId) {
      Alert.alert('Error', 'User not found. Please log in again.');
      return;
    }

    const acknowledged = await hasAcknowledgedLocationDisclosure(userId);
    if (!acknowledged) {
      setShowLocationDisclosure(true);
      return;
    }

    // ✅ Request background location permission before starting
    const backgroundGranted = await requestBackgroundLocation();
    if (!backgroundGranted) {
      Alert.alert(
        'Background Location Required',
        'Background location is required for continuous route tracking. Please enable it in settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }

    setStartingDay(true);

    let freshLocation;
    try {
      freshLocation = await getFreshGPSLocation();
      console.log('✅ Final GPS location:', freshLocation);
    } catch (gpsErr) {
      setStartingDay(false);
      Alert.alert(
        'GPS Error',
        'Unable to get location. Go outside and try again.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: markAttendance },
        ],
      );
      return;
    }

    if (freshLocation.accuracy > 100) {
      Alert.alert(
        'Low GPS Accuracy',
        `Accuracy: ${Math.round(freshLocation.accuracy)}m. Try again?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Try Again', onPress: markAttendance },
          { text: 'Continue', onPress: () => proceedWithStart(userId, freshLocation) },
        ]
      );
      setStartingDay(false);
      return;
    }

    proceedWithStart(userId, freshLocation);
  };

  const proceedWithStart = async (userId, location) => {
    setStartingDay(true);

    try {
      console.log('📤 Starting session with location:', location);
      const res = await API.post('/api/session/start', {
        userId,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      const newSessionId = res.data._id;
      console.log('✅ Session created:', newSessionId);

      const locked = res.data.startLocation || {
        latitude: location.latitude,
        longitude: location.longitude,
      };
      setLockedStartLocation(locked);

      await saveSessionId(newSessionId);
      setSessionId(newSessionId);
      setAttendanceMarked(true);
      dispatch(startTracking(newSessionId));
      
      // ✅ START GPS TRACKING (background location already granted)
      await hookStartTracking(userId, newSessionId, false);
      
      console.log('📍 Location tracking started. Distance:', distance);
      
      setStartingDay(false);

      navigation.navigate('FSETracking', {
        sessionId: newSessionId,
        startLocation: locked,
      });
    } catch (err) {
      console.error('Failed to start day:', err);
      const message = err.response?.data?.message || 'Failed to start day. Please try again.';
      Alert.alert('Error', message, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Retry', onPress: () => proceedWithStart(userId, location) },
      ]);
      setStartingDay(false);
    }
  };

  const handleStartDaybtn = () => {
    if (attendanceMarked && sessionId) {
      navigation.navigate('FSETracking', {
        sessionId,
        startLocation: lockedStartLocation,
      });
    } else {
      markAttendance();
    }
  };

  const handleRefreshLocation = () => {
    getCurrentLocation(false);
  };

  const isButtonDisabled = attendanceMarked
    ? (!sessionId || recovering)
    : (!location || locationLoading || startingDay || gpsStatus === 'failed');

  return (
    <View style={FSEHomeStyles.container}>
      <LocationDisclosureModal
        visible={showLocationDisclosure}
        onAllow={handleDisclosureAllow}
        onDeny={handleDisclosureDeny}
      />
      <Header title="Start Day" showBackArrow={false} />
      <ScrollView
        contentContainerStyle={[FSEHomeStyles.content, { paddingBottom: 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        
        {/* WELCOME */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Hand size={22} color="#D97706" style={{ marginRight: 8 }} />
          <Text style={FSEHomeStyles.title}>
            Welcome! {user?.name || 'User'}
          </Text>
        </View>

        <Text style={FSEHomeStyles.sectionTitle}>Mark Attendance</Text>

        {/* ERROR BANNER */}
        {sessionCheckError && (
          <View style={{
            backgroundColor: '#FEF2F2',
            padding: 10,
            borderRadius: 8,
            marginBottom: 12,
            borderLeftWidth: 4,
            borderLeftColor: '#DC2626',
          }}>
            <Text style={{ color: '#DC2626', fontSize: 12, marginBottom: 6 }}>
              {sessionCheckError}
            </Text>
            <TouchableOpacity onPress={checkTodaySession}>
              <Text style={{ color: '#DC2626', fontSize: 12, fontWeight: '700' }}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* DISTANCE DISPLAY - NEW FEATURE */}
        {isTracking && (
          <View style={{
            backgroundColor: '#DCFCE7',
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
            borderLeftWidth: 4,
            borderLeftColor: '#16A34A',
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CheckCircle size={16} color="#16A34A" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#16A34A', fontSize: 12, fontWeight: '500' }}>
                  Tracking Active
                </Text>
                <Text style={{ color: '#16A34A', fontSize: 14, fontWeight: '700', marginTop: 4 }}>
                  Distance: {distance}
                </Text>
              </View>
            </View>
          </View>
        )}

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
              <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                <Text style={FSEHomeStyles.cardLabel}>
                  {attendanceMarked ? 'Start Location' : 'Current Location'}
                </Text>
                {attendanceMarked && lockedStartLocation && (
                  <View style={FSEHomeStyles.lockedBadge}>
                    <Lock size={11} color="#fff" style={{ marginRight: 3 }} />
                    <Text style={FSEHomeStyles.lockedBadgeText}>LOCKED</Text>
                  </View>
                )}
              </View>
              
              {attendanceMarked && lockedStartLocation ? (
                <>
                  <Text style={FSEHomeStyles.cardValue}>
                    Lat: {Number(lockedStartLocation.latitude).toFixed(6)}
                  </Text>
                  <Text style={FSEHomeStyles.cardValue}>
                    Lng: {Number(lockedStartLocation.longitude).toFixed(6)}
                  </Text>
                  <Text style={FSEHomeStyles.address}>
                    This is your start point for today.
                  </Text>
                </>
              ) : locationLoading ? (
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

        {/* INFO BANNER */}
        <View style={{
          backgroundColor: attendanceMarked ? '#DCFCE7' : '#E3F2FD',
          padding: 10,
          borderRadius: 8,
          marginBottom: 16,
          borderLeftWidth: 4,
          borderLeftColor: attendanceMarked ? '#16A34A' : '#2563EB',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          {attendanceMarked ? (
            <CheckCircle size={16} color="#16A34A" style={{ marginRight: 6 }} />
          ) : (
            <Info size={16} color="#1565C0" style={{ marginRight: 6 }} />
          )}
          <Text style={{ color: attendanceMarked ? '#16A34A' : '#1565C0', fontSize: 12, fontWeight: '500', flex: 1 }}>
            {attendanceMarked
              ? 'Tracking is active and distance is being calculated.'
              : 'A fresh GPS location will be captured and locked when you click START DAY.'}
          </Text>
        </View>

        {/* START DAY BUTTON */}
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

        {/* TRACKING STATUS */}
        {attendanceMarked && sessionId && (
          <View style={{
            marginTop: 12,
            padding: 10,
            backgroundColor: '#F0FDF4',
            borderRadius: 8,
            alignItems: 'center',
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#22C55E',
                marginRight: 8,
              }} />
              <Text style={{ color: '#16A34A', fontSize: 12, fontWeight: '600' }}>
                Tracking Active — Session: {sessionId.slice(-6)}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default FSEHomeScreen;