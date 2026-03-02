// import React, { useEffect, useState } from 'react';
// import { View, Text, ActivityIndicator } from 'react-native';
// import MapView, { Polyline, Marker } from 'react-native-maps';
// import styles from '../../screens/FieldSalesExecutive/FSETrackingStyle';
// import { useSelector } from 'react-redux';
// import API from '../../services/API/api';

// const FSETracking = () => {
//   const [routeCoords, setRouteCoords] = useState([]);
//   const [distance, setDistance] = useState(0);
//   const [loading, setLoading] = useState(true);

//   const { sessionId } = useSelector(state => state.tracking);

//   // 🔥 FETCH ROUTE
//   useEffect(() => {
//     const fetchRoute = async () => {
//       try {
//         const res = await API.get(`/location/route/${sessionId}`);

//         // ✅ SAFE DATA HANDLING
//         const coords = (res.data || [])
//           .filter(item => item.latitude && item.longitude)
//           .map(item => ({
//             latitude: item.latitude,
//             longitude: item.longitude,
//           }));

//         setRouteCoords(coords);

//         if (coords.length > 1) {
//           setDistance(calculateDistance(coords));
//         } else {
//           setDistance(0);
//         }

//       } catch (error) {
//         console.log('Route error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (sessionId) {
//       fetchRoute();
//     } else {
//       setLoading(false);
//     }
//   }, [sessionId]);

//   // 📏 DISTANCE CALCULATION
//   const calculateDistance = coords => {
//     let total = 0;

//     for (let i = 1; i < coords.length; i++) {
//       const prev = coords[i - 1];
//       const curr = coords[i];

//       const R = 6371;
//       const dLat = ((curr.latitude - prev.latitude) * Math.PI) / 180;
//       const dLon = ((curr.longitude - prev.longitude) * Math.PI) / 180;

//       const a =
//         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos((prev.latitude * Math.PI) / 180) *
//           Math.cos((curr.latitude * Math.PI) / 180) *
//           Math.sin(dLon / 2) *
//           Math.sin(dLon / 2);

//       const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//       total += R * c;
//     }

//     return total.toFixed(2);
//   };

//   // 🔄 LOADING STATE
//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="red" />
//         <Text>Loading route...</Text>
//       </View>
//     );
//   }

//   // ❌ NO DATA STATE
//   if (!routeCoords || routeCoords.length === 0) {
//     return (
//       <View style={styles.loader}>
//         <Text>No tracking data available</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         initialRegion={{
//           latitude: routeCoords[0].latitude,
//           longitude: routeCoords[0].longitude,
//           latitudeDelta: 0.05,
//           longitudeDelta: 0.05,
//         }}
//       >
//         {/* ✅ DRAW ONLY IF VALID */}
//         {routeCoords.length > 1 && (
//           <>
//             <Polyline
//               coordinates={routeCoords}
//               strokeWidth={4}
//               strokeColor="orange"
//             />

//             <Marker
//               coordinate={routeCoords[0]}
//               title="Start"
//               pinColor="green"
//             />

//             <Marker
//               coordinate={routeCoords[routeCoords.length - 1]}
//               title="End"
//               pinColor="red"
//             />
//           </>
//         )}
//       </MapView>

//       {/* 📊 INFO CARD */}
//       <View style={styles.bottomCard}>
//         <Text style={styles.title}>FSE Route Summary</Text>
//         <Text style={styles.text}>Distance: {distance} km</Text>
//         <Text style={styles.text}>
//           Points Captured: {routeCoords.length}
//         </Text>
//       </View>
//     </View>
//   );
// };

// export default FSETracking;

// ---------- alredy working code old---------

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import Header from '../../components/Header';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

MapLibreGL.setAccessToken(null);

const FSETracking = () => {
 const insets = useSafeAreaInsets();
  // SAMPLE ROUTE
  const routeCoords = [
    { latitude: 11.9416, longitude: 79.8083 },
    { latitude: 11.9450, longitude: 79.8150 },
    // { latitude: 11.9500, longitude: 79.8200 },
    // { latitude: 11.9550, longitude: 79.8250 },
    // { latitude: 11.9600, longitude: 79.8300 },
  ];

  // Convert to [lng, lat]
  const coordinates = routeCoords.map(p => [
    p.longitude,
    p.latitude,
  ]);

  // DISTANCE CALCULATION (KM)
  const distance = useMemo(() => {
    let total = 0;

    for (let i = 1; i < routeCoords.length; i++) {
      const prev = routeCoords[i - 1];
      const curr = routeCoords[i];

      const R = 6371;
      const dLat = ((curr.latitude - prev.latitude) * Math.PI) / 180;
      const dLon = ((curr.longitude - prev.longitude) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((prev.latitude * Math.PI) / 180) *
          Math.cos((curr.latitude * Math.PI) / 180) *
          Math.sin(dLon / 2) ** 2;

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      total += R * c;
    }

    return total.toFixed(2);
  }, []);

  return (
    <View style={styles.container}>
      <Header title={'FSE MapView'}/>
      <MapLibreGL.MapView
        style={styles.map}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=3gTrSf36y6oirRLmBYot`}
      >

        {/* Camera */}
        <MapLibreGL.Camera
          zoomLevel={14}
          centerCoordinate={coordinates[0]}
        />

        {/* ROUTE */}
        <MapLibreGL.ShapeSource
          id="route"
          shape={{
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates,
            },
          }}
        >
          <MapLibreGL.LineLayer
            id="routeLine"
            style={{
              lineWidth: 5,
              lineColor: '#ff3b30', // 🔥 RED (like Strava)
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        </MapLibreGL.ShapeSource>

        {/* START */}
        <MapLibreGL.PointAnnotation
          id="start"
          coordinate={coordinates[0]}
        />

        {/* END */}
        <MapLibreGL.PointAnnotation
          id="end"
          coordinate={coordinates[coordinates.length - 1]}
        />

      </MapLibreGL.MapView>

      {/* 📊 BOTTOM CARD (STRAVA STYLE) */}
      <View style={[styles.card,{ paddingBottom: insets.bottom + 20 },]}>
        <Text style={styles.title}>Sunday Ride</Text>

        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Distance</Text>
            <Text style={styles.value}>{distance} km</Text>
          </View>

          <View>
            <Text style={styles.label}>Points</Text>
            <Text style={styles.value}>{routeCoords.length}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FSETracking;

const styles = StyleSheet.create({
  container: { flex: 1 },

  map: { flex: 1 },

  card: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    backgroundColor: '#fff',
    padding: 20,

    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    elevation: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  label: {
    color: '#777',
    fontSize: 14,
  },

  value: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

