
import React, { useEffect, useState, useRef, useCallback } from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import API from '../../services/API/api';
import { Text, View, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import styles from './FSETrackingStyle';
import Header from '../../components/Header';
import socket, { subscribeToSessionUpdates, unsubscribeFromSessionUpdates, onConnectionChange } from '../../services/socket/socket';
import { RefreshCw } from 'lucide-react-native';
import { getRoutePoints, getTotalDistance, getOfflineQueueSize } from '../../utils/HeadlessLocation';
import { formatDistance } from '../../utils/formatDistance';

const POLL_INTERVAL_MS = 10000;

const FSETracking = ({ route }) => {
  const sessionId = route?.params?.sessionId;
  const paramStartLocation = route?.params?.startLocation;

  const insets = useSafeAreaInsets();
  const [coords, setCoords] = useState([]);
  const [sessionData, setSessionData] = useState(null);
  const [lockedStart, setLockedStart] = useState(
    paramStartLocation ? [paramStartLocation.longitude, paramStartLocation.latitude] : null
  );
  const [distanceKm, setDistanceKm] = useState(0);
  const [isLive, setIsLive] = useState(true);
  const [socketHealthy, setSocketHealthy] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [pointCount, setPointCount] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [refreshing, setRefreshing] = useState(false);
  const [followUser, setFollowUser] = useState(true);
  const [pendingSync, setPendingSync] = useState(0);

  const pollIntervalRef = useRef(null);
  const mountedRef = useRef(true);
  const lastPointRef = useRef(null);
  const mapCameraRef = useRef(null);
  const [loadTookTooLong, setLoadTookTooLong] = useState(false);

  // ✅ SYNC STATUS MONITOR - Shows pending points
  useEffect(() => {
    const checkSyncStatus = async () => {
      if (!mountedRef.current) return;
      try {
        const size = await getOfflineQueueSize();
        setPendingSync(size);
      } catch (err) {
        // Silent fail
      }
    };
    
    checkSyncStatus();
    const interval = setInterval(checkSyncStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  // ✅ FETCH ROUTE (server reconciliation)
  const fetchRoute = useCallback(async () => {
    if (!sessionId || !mountedRef.current) return;
    try {
      const res = await API.get(`/api/session/${sessionId}`);
      const data = res.data;
      if (!data || !mountedRef.current) return;

      setSessionData(data);
      setLoadError(null);

      // ✅ Always update distance from server
      if (data.totalDistanceKm !== undefined) {
        const dist = parseFloat(data.totalDistanceKm);
        setDistanceKm(dist);
        console.log(`📏 Server distance: ${dist} km`);
      }
      
      if (data.pointCount !== undefined) setPointCount(data.pointCount);

      if (data.route?.length > 0) {
        const serverCoords = data.route.map(p => [p.longitude, p.latitude]);
        setCoords(prev => {
          if (serverCoords.length > prev.length) return serverCoords;
          return prev;
        });
        const last = data.route[data.route.length - 1];
        lastPointRef.current = { latitude: last.latitude, longitude: last.longitude };
      }

      if (!lockedStart && data.startLocation) {
        setLockedStart([data.startLocation.longitude, data.startLocation.latitude]);
      }
      setLastUpdateTime(Date.now());
    } catch (err) {
      if (mountedRef.current) setLoadError('Unable to refresh tracking data. Retrying…');
    }
  }, [sessionId, lockedStart]);

  // ✅ Hybrid route loading — local points draw the map instantly
  const loadHybridRoute = useCallback(async () => {
    try {
      // 1. Load local points immediately (fast)
      const localPoints = await getRoutePoints();
      const localDistance = await getTotalDistance();

      if (localPoints.length > 0) {
        const localCoords = localPoints.map(p => [p.longitude, p.latitude]);
        setCoords(localCoords);
        
        // Only set distance from local if server hasn't updated yet
        if (!sessionData || sessionData.totalDistanceKm === undefined) {
          setDistanceKm(localDistance);
          console.log(`📏 Local distance: ${localDistance} km`);
        }

        if (!lockedStart) {
          const first = localPoints[0];
          setLockedStart([first.longitude, first.latitude]);
        }
      }

      // 2. Always reconcile with server too
      await fetchRoute();

    } catch (err) {
      console.error('❌ Error loading hybrid route:', err);
    }
  }, [fetchRoute, lockedStart, sessionData]);

  // ✅ FORCE REBUILD
  const forceRebuildRoute = useCallback(async () => {
    if (!sessionId) return;
    try {
      setRefreshing(true);
      await API.post(`/api/session/rebuild/${sessionId}`);
      await fetchRoute();
    } catch (err) {
      Alert.alert('Error', 'Failed to rebuild route.');
    } finally {
      setRefreshing(false);
    }
  }, [sessionId, fetchRoute]);

  useFocusEffect(
    useCallback(() => {
      if (!sessionId) return undefined;
      mountedRef.current = true;
      
      loadHybridRoute();
      
      pollIntervalRef.current = setInterval(() => {
        if (mountedRef.current) {
          fetchRoute();
        }
      }, POLL_INTERVAL_MS);
      
      return () => {
        mountedRef.current = false;
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      };
    }, [sessionId, fetchRoute, loadHybridRoute]),
  );

  // ✅ SOCKET LIVE UPDATES
  useEffect(() => {
    if (!sessionId) return;

    const handleLocationUpdate = (data) => {
      if (!mountedRef.current || !data || data.isCached) return;

      if (typeof data.totalDistanceKm === 'number') {
        setDistanceKm(data.totalDistanceKm);
        console.log(`📏 Socket distance: ${data.totalDistanceKm} km`);
      }
      
      if (typeof data.pointCount === 'number') setPointCount(data.pointCount);

      if (data.latitude && data.longitude) {
        const newCoord = [data.longitude, data.latitude];
        setCoords(prev => {
          const last = prev[prev.length - 1];
          if (last && Math.abs(last[0] - newCoord[0]) < 0.000001 && Math.abs(last[1] - newCoord[1]) < 0.000001) {
            return prev;
          }
          return [...prev, newCoord];
        });
        setLastUpdateTime(Date.now());
        setIsLive(true);
        setSocketHealthy(true);
      }
    };

    socket.on('session-location', handleLocationUpdate);
    socket.on('users-location', handleLocationUpdate);
    subscribeToSessionUpdates(sessionId);

    const unsubscribeConn = onConnectionChange((connected) => {
      if (!mountedRef.current) return;
      setSocketHealthy(connected);
      setIsLive(connected);
      if (connected) {
        subscribeToSessionUpdates(sessionId);
        fetchRoute();
      }
    });

    return () => {
      socket.off('session-location', handleLocationUpdate);
      socket.off('users-location', handleLocationUpdate);
      unsubscribeFromSessionUpdates(sessionId);
      unsubscribeConn();
    };
  }, [sessionId, fetchRoute]);

  // ✅ CAMERA FOLLOW USER
  useEffect(() => {
    if (followUser && coords.length > 0 && mapCameraRef.current) {
      const last = coords[coords.length - 1];
      mapCameraRef.current.setCamera({
        centerCoordinate: last,
        animationDuration: 500,
        zoomLevel: 16,
      });
    }
  }, [coords, followUser]);

  // ✅ HEALTH MONITOR
  useEffect(() => {
    const healthCheck = setInterval(() => {
      if (!mountedRef.current) return;
      const timeSinceLastUpdate = Date.now() - lastUpdateTime;
      if (timeSinceLastUpdate > 45000 && coords.length > 1) {
        setSocketHealthy(false);
        fetchRoute();
      }
    }, 15000);
    return () => clearInterval(healthCheck);
  }, [coords.length, fetchRoute, lastUpdateTime]);

  // ✅ FORMAT DISTANCE USING UTILITY
  const formattedDistance = formatDistance(distanceKm);
  const formattedMainDistance = formatDistance(distanceKm);

  const center = coords.length > 0 ? coords[coords.length - 1] : lockedStart;
  const startTime = sessionData?.startTime ? new Date(sessionData.startTime) : null;
  const endTime = sessionData?.endTime ? new Date(sessionData.endTime) : null;
  const status = endTime ? 'Completed' : 'Active';

  const getDuration = () => {
    if (!startTime) return '—';
    const diffMs = (endTime || new Date()) - startTime;
    const mins = Math.floor(diffMs / 60000);
    const hrs = Math.floor(mins / 60);
    return hrs > 0 ? `${hrs}h ${mins % 60}m` : `${mins}m`;
  };

  // ✅ Loading timeout
  useEffect(() => {
    if (lockedStart) {
      setLoadTookTooLong(false);
      return undefined;
    }
    const t = setTimeout(() => {
      if (mountedRef.current) setLoadTookTooLong(true);
    }, 12000);
    return () => clearTimeout(t);
  }, [lockedStart, sessionId]);

  if (!sessionId) {
    return (
      <View style={styles.container}>
        <Header title="FSE Tracking" />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>No active session found.</Text>
        </View>
      </View>
    );
  }

  if (!lockedStart) {
    return (
      <View style={styles.container}>
        <Header title="FSE Tracking" />
        <View style={styles.centerContainer}>
          {loadTookTooLong ? (
            <>
              <Text style={styles.errorText}>
                {loadError || "Couldn't load start location. Check your connection and try again."}
              </Text>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={() => { setLoadTookTooLong(false); loadHybridRoute(); }}>
                <RefreshCw size={16} color="#2563EB" />
                <Text style={styles.refreshButtonText}>Retry</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text style={styles.loadingText}>Loading start location…</Text>
            </>
          )}
        </View>
      </View>
    );
  }

  const hasValidRoute = coords.length >= 2;

  return (
    <View style={styles.container}>
      <Header title="FSE Tracking" />

      <MapLibreGL.MapView style={styles.map}
        mapStyle="https://api.maptiler.com/maps/streets/style.json?key=3gTrSf36y6oirRLmBYot">
        
        <MapLibreGL.Camera
          ref={mapCameraRef}
          zoomLevel={16}
          centerCoordinate={center}
          animationMode="flyTo"
          animationDuration={500}
        />

        {lockedStart && (
          <MapLibreGL.PointAnnotation id="start" coordinate={lockedStart}>
            <View style={styles.startMarkerOuter}>
              <View style={styles.startMarkerInner} />
            </View>
          </MapLibreGL.PointAnnotation>
        )}

        {coords.length > 0 && (
          <MapLibreGL.PointAnnotation id="current" coordinate={coords[coords.length - 1]}>
            <View style={styles.currentMarkerOuter}>
              <View style={styles.currentMarkerInner} />
            </View>
          </MapLibreGL.PointAnnotation>
        )}

        {hasValidRoute && (
          <MapLibreGL.ShapeSource id="route" shape={{
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: coords }
          }}>
            <MapLibreGL.LineLayer id="line" style={{
              lineWidth: 5, lineColor: '#FF5722', lineJoin: 'round', lineCap: 'round'
            }} />
          </MapLibreGL.ShapeSource>
        )}
      </MapLibreGL.MapView>

      <View style={[styles.bottomCard, { paddingBottom: insets.bottom + 10 }]}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Today's Travel</Text>
          {isLive && <View style={styles.liveBadge} />}
          
          {/* ✅ Sync Status Indicator */}
          {pendingSync > 0 ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
              <ActivityIndicator size="small" color="#F59E0B" />
              <Text style={{ color: '#F59E0B', fontSize: 10, marginLeft: 4 }}>
                {pendingSync} pending
              </Text>
            </View>
          ) : (
            isLive && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' }} />
                <Text style={{ color: '#22C55E', fontSize: 10, marginLeft: 4 }}>Synced</Text>
              </View>
            )
          )}
          
          <Text style={styles.pointCount}>{pointCount} pts</Text>
        </View>

        {!socketHealthy && (
          <Text style={styles.offlineIndicator}>Live connection lost — updating via refresh.</Text>
        )}

        {/* ✅ FIXED: Use formatted distance */}
        <Text style={styles.mainDistance}>{formattedMainDistance}</Text>

        <TouchableOpacity
          style={[styles.refreshButton, refreshing && styles.refreshButtonDisabled]}
          onPress={forceRebuildRoute} disabled={refreshing}>
          <RefreshCw size={16} color="#2563EB" />
          <Text style={styles.refreshButtonText}>{refreshing ? 'Refreshing...' : 'Refresh Route'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ alignSelf: 'center', marginBottom: 8 }}
          onPress={() => setFollowUser(f => !f)}>
          <Text style={{ color: '#2563EB', fontWeight: '600', fontSize: 12 }}>
            {followUser ? '✓ Following User' : 'Tap to Follow User'}
          </Text>
        </TouchableOpacity>

        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.label}>Distance</Text>
            <Text style={styles.value}>{formattedDistance}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.label}>Start Time</Text>
            <Text style={styles.value}>{startTime?.toLocaleTimeString() || '—'}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.value}>{getDuration()}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: status === 'Active' ? '#4CAF50' : '#F44336' }]} />
              <Text style={[styles.statusText, { color: status === 'Active' ? '#4CAF50' : '#F44336' }]}>{status}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FSETracking;
