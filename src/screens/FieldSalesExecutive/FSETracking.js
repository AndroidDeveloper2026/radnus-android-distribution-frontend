import React, { useEffect, useState } from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import API from '../../services/API/api';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../FieldSalesExecutive/FSETrackingStyle';
import Header from '../../components/Header';
import socket from '../../services/socket/socket';

const FSETracking = ({ route }) => {
  const sessionId = route?.params?.sessionId;
  const insets = useSafeAreaInsets();
  const [coords, setCoords] = useState([]);
  const [sessionData, setSessionData] = useState(null);
  const [distanceKm, setDistanceKm] = useState(0);
  const [isLive, setIsLive] = useState(true);

  // ✅ FETCH SESSION DATA INITIALLY & REAL-TIME UPDATES
  useEffect(() => {
    if (!sessionId) {

      return;
    }

    const fetchRoute = async () => {
      try {
        const res = await API.get(`/api/session/${sessionId}`);
        const data = res.data;

        if (!data) {

          return;
        }

        setSessionData(data);

        // ✅ Extract route coordinates [longitude, latitude] format for MapLibre
        if (data?.route && data.route.length > 0) {
          const routeData = data.route.map(p => [p.longitude, p.latitude]);
          setCoords(routeData);
        }

        // ✅ Set total distance
        setDistanceKm(data.totalDistanceKm || 0);


      } catch (err) {

      }
    };

    // ✅ Initial fetch
    fetchRoute();

    // ✅ Refresh every 5 seconds (aligned with tracking service)
    const interval = setInterval(fetchRoute, 5000);

    return () => clearInterval(interval);
  }, [sessionId]);

  // ✅ REAL-TIME SOCKET UPDATES
  useEffect(() => {
    const handleLocationUpdate = (data) => {
     

      setCoords(prevCoords => [
        ...prevCoords,
        [data.longitude, data.latitude]
      ]);

      setIsLive(true);
    };

    socket.on('users-location', handleLocationUpdate);

    return () => {
      socket.off('users-location', handleLocationUpdate);
    };
  }, []);

  // ✅ DETERMINE MAP CENTER
  const center = coords.length > 0 
    ? coords[coords.length - 1] 
    : [79.8289, 11.9352]; // Default center

  // ✅ FORMAT START TIME
  const startTime = sessionData?.startTime
    ? new Date(sessionData.startTime)
    : null;

  // ✅ FORMAT END TIME
  const endTime = sessionData?.endTime 
    ? new Date(sessionData.endTime) 
    : null;

  // ✅ DETERMINE STATUS
  const status = endTime ? 'Completed' : 'Active';

  // ✅ CALCULATE DURATION
  const getDuration = () => {
    if (!startTime) return '—';

    const end = endTime || new Date();
    const diffMs = end - startTime;
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;

    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <View style={styles.container}>
      <Header title="FSE Tracking" />

      <MapLibreGL.MapView
        style={styles.map}
        mapStyle="https://api.maptiler.com/maps/streets/style.json?key=3gTrSf36y6oirRLmBYot"
      >
        {/* ✅ CAMERA - FOLLOW CURRENT LOCATION */}
        <MapLibreGL.Camera 
          zoomLevel={16} 
          centerCoordinate={center}
          animationDuration={500}
        />

        {/* ✅ START MARKER */}
        {coords.length > 0 && (
          <MapLibreGL.PointAnnotation 
            id="start" 
            coordinate={coords[0]}
          />
        )}

        {/* ✅ CURRENT LOCATION MARKER */}
        {coords.length > 0 && (
          <MapLibreGL.PointAnnotation
            id="current"
            coordinate={coords[coords.length - 1]}
          />
        )}

        {/* ✅ ROUTE LINE */}
        {coords.length >= 2 && (
          <MapLibreGL.ShapeSource
            id="route"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: coords,
              },
            }}
          >
            <MapLibreGL.LineLayer
              id="line"
              style={{
                lineWidth: 5,
                lineColor: '#FF5722',
                lineJoin: 'round',
                lineCap: 'round',
              }}
            />
          </MapLibreGL.ShapeSource>
        )}
      </MapLibreGL.MapView>

      {/* ✅ BOTTOM SUMMARY CARD */}
      <View style={[styles.bottomCard, { paddingBottom: insets.bottom + 10 }]}>
        
        <View style={styles.headerRow}>
          <Text style={styles.title}>Today's Travel</Text>
          {isLive && <View style={styles.liveBadge} />}
        </View>

        {/* ✅ MAIN DISTANCE DISPLAY */}
        <Text style={styles.mainDistance}>
          {distanceKm.toFixed(2)} KM
        </Text>

        {/* ✅ INFO BOXES */}
        <View style={styles.infoRow}>
          
          {/* Distance */}
          <View style={styles.infoBox}>
            <Text style={styles.label}>Distance</Text>
            <Text style={styles.value}>{distanceKm.toFixed(2)} KM</Text>
          </View>

          {/* Start Time */}
          <View style={styles.infoBox}>
            <Text style={styles.label}>Start Time</Text>
            <Text style={styles.value}>
              {startTime?.toLocaleTimeString() || '—'}
            </Text>
          </View>

          {/* Duration */}
          <View style={styles.infoBox}>
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.value}>{getDuration()}</Text>
          </View>

          {/* Status */}
          <View style={styles.infoBox}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusRow}>
              <View 
                style={[
                  styles.statusDot, 
                  { backgroundColor: status === 'Active' ? '#4CAF50' : '#F44336' }
                ]} 
              />
              <Text style={styles.statusText}>{status}</Text>
            </View>
          </View>

        </View>

        {/* ✅ DATE */}
        <Text style={styles.date}>
          {startTime?.toDateString() || new Date().toDateString()}
        </Text>
      </View>
    </View>
  );
};

export default FSETracking;
