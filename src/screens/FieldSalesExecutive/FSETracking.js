import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import styles from '../../screens/FieldSalesExecutive/FSETrackingStyle';

const FSETracking = () => {
  const [routeCoords, setRouteCoords] = useState([]);
  const [distance, setDistance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoute();
  },);

  // 🔥 FETCH ROUTE DATA (Replace with API)
  const fetchRoute = async () => {
    try {
      // Dummy coordinates (replace with backend API)
      const data = [
        { latitude: 11.9416, longitude: 79.8083 },
        { latitude: 11.9450, longitude: 79.8150 },
        { latitude: 11.9500, longitude: 79.8200 },
        { latitude: 11.9550, longitude: 79.8250 },
        { latitude: 11.9600, longitude: 79.8300 },
      ];

      setRouteCoords(data);

      const totalDistance = calculateDistance(data);
      setDistance(totalDistance);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 📏 DISTANCE CALCULATION (KM)
  const calculateDistance = (coords) => {
    let total = 0;

    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];

      const R = 6371;
      const dLat = (curr.latitude - prev.latitude) * Math.PI / 180;
      const dLon = (curr.longitude - prev.longitude) * Math.PI / 180;

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(prev.latitude * Math.PI / 180) *
          Math.cos(curr.latitude * Math.PI / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      total += R * c;
    }

    return total.toFixed(2);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="red" />
        <Text>Loading route...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: routeCoords[0]?.latitude || 11.94,
          longitude: routeCoords[0]?.longitude || 79.80,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {routeCoords.length > 0 && (
          <>
            {/* ROUTE LINE */}
            <Polyline
              coordinates={routeCoords}
              strokeWidth={4}
              strokeColor="orange"
            />

            {/* START MARKER */}
            <Marker
              coordinate={routeCoords[0]}
              title="Start"
              pinColor="green"
            />

            {/* END MARKER */}
            <Marker
              coordinate={routeCoords[routeCoords.length - 1]}
              title="End"
              pinColor="red"
            />
          </>
        )}
      </MapView>

      {/* 📊 BOTTOM INFO CARD */}
      <View style={styles.bottomCard}>
        <Text style={styles.title}>FSE Route Summary</Text>
        <Text style={styles.text}>Distance: {distance} km</Text>
        <Text style={styles.text}>
          Points Captured: {routeCoords.length}
        </Text>
      </View>
    </View>
  );
};

export default FSETracking;
