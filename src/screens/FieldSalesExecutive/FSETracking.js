// import React, { useEffect, useState } from 'react';
// import MapLibreGL from '@maplibre/maplibre-react-native';
// import API from '../../services/API/api';
// import { Text, View } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import styles from '../FieldSalesExecutive/FSETrackingStyle';
// import Header from '../../components/Header';

// const FSETracking = ({ route }) => {
//   const sessionId = route?.params?.sessionId;
//   const insets = useSafeAreaInsets();
//   const [coords, setCoords] = useState([]);
//   const [sessionData, setSessionData] = useState(null);
//   const [distanceKm, setDistanceKm] = useState(0);

//   useEffect(() => {
//     if (!sessionId) return;

//     const fetchRoute = async () => {
//       try {
//         const res = await API.get(`/api/session/${sessionId}`);

//         const data = res.data;

//         setSessionData(data);

//         if (!data?.route) return;

//         const routeData = data.route.map(p => [p.longitude, p.latitude]);

//         setCoords(routeData);

//         setDistanceKm(data.totalDistanceKm || 0);
//       } catch (err) {
//         console.log('Route error:', err.message);
//       }
//     };

//     fetchRoute();

//     // const interval = setInterval(fetchRoute, 5000);

//     // return () => clearInterval(interval);
//   }, [sessionId]);

//   const center = coords.length ? coords[coords.length - 1] : [79.8289, 11.9352];

//   const startTime = sessionData?.startTime
//     ? new Date(sessionData.startTime)
//     : null;

//   const endTime = sessionData?.endTime ? new Date(sessionData.endTime) : null;

//   const status = endTime ? 'Completed' : 'Active';

//   return (
//     <View style={styles.container}>
//       <Header title={'FSE Tracking'} />

//       <MapLibreGL.MapView
//         style={styles.map}
//         mapStyle="https://api.maptiler.com/maps/streets/style.json?key=3gTrSf36y6oirRLmBYot"
//       >
//         <MapLibreGL.Camera zoomLevel={16} centerCoordinate={center} />

//         {/* Start Marker */}
//         {coords.length > 0 && (
//           <MapLibreGL.PointAnnotation id="start" coordinate={coords[0]} />
//         )}

//         {/* Current Marker */}
//         {coords.length > 0 && (
//           <MapLibreGL.PointAnnotation
//             id="current"
//             coordinate={coords[coords.length - 1]}
//           />
//         )}

//         {/* Route Line */}
//         {coords.length >= 2 && (
//           <MapLibreGL.ShapeSource
//             id="route"
//             shape={{
//               type: 'Feature',
//               geometry: {
//                 type: 'LineString',
//                 coordinates: coords,
//               },
//             }}
//           >
//             <MapLibreGL.LineLayer
//               id="line"
//               style={{
//                 lineWidth: 5,
//                 lineColor: '#ff3b30',
//                 lineJoin: 'round',
//                 lineCap: 'round',
//               }}
//             />
//           </MapLibreGL.ShapeSource>
//         )}
//       </MapLibreGL.MapView>

//       {/* Bottom Card */}
//       <View style={[styles.bottomCard,{ paddingBottom: insets.bottom + 10 },]}>
//         <Text style={styles.title}>Today's Travel</Text>

//         <Text style={styles.mainDistance}>
//           {distanceKm.toFixed(2)} KM
//         </Text>

//         <View style={styles.infoRow}>
//           <View style={styles.infoBox}>
//             <Text style={styles.label}>Distance</Text>
//             <Text style={styles.value}>{distanceKm.toFixed(2)} KM</Text>
//           </View>

//           <View style={styles.infoBox}>
//             <Text style={styles.label}>Start Time</Text>
//             <Text style={styles.value}>
//               {startTime?.toLocaleTimeString()}
//             </Text>
//           </View>

//           <View style={styles.infoBox}>
//             <Text style={styles.label}>Status</Text>

//             <View style={styles.statusRow}>
//               <View style={styles.statusDot} />
//               <Text style={styles.statusText}>{status}</Text>
//             </View>
//           </View>
//         </View>

//         <Text style={styles.date}>{startTime?.toDateString()}</Text>
//       </View>
//     </View>
//   );
// };

// export default FSETracking;
//--------------------------------

import React, { useEffect, useState } from "react";
import MapLibreGL from "@maplibre/maplibre-react-native";
import { View } from "react-native";
import Header from "../../components/Header";
import styles from "./FSETrackingStyle";
import io from "socket.io-client";
import { API_BASE_URL } from "@env";

MapLibreGL.setAccessToken(null);

const FSETracking = ({ route }) => {

 const sessionId = route?.params?.sessionId;

 const [points, setPoints] = useState([]);

 useEffect(() => {

   const socket = io(API_BASE_URL, {
     transports: ["websocket"]
   });

   socket.on("connect", () => {
     console.log("Socket connected:", socket.id);
   });

   socket.on("users-location", data => {

     console.log("LOCATION RECEIVED:", data);

     if (data.sessionId !== sessionId) return;

     const newPoint = [data.longitude, data.latitude];

     setPoints(prev => [...prev, newPoint]);

   });

   return () => socket.disconnect();

 }, []);

 const safeCoords = points.filter(
   c => Array.isArray(c) && c.length === 2
 );

 const center = safeCoords.length
   ? safeCoords[safeCoords.length - 1]
   : [79.8289, 11.9352];

 return (
   <View style={styles.container}>

     <Header title="FSE Tracking" />

     <MapLibreGL.MapView
       style={styles.map}
       mapStyle="https://api.maptiler.com/maps/streets/style.json?key=3gTrSf36y6oirRLmBYot"
     >

       <MapLibreGL.Camera
         zoomLevel={16}
         centerCoordinate={center}
       />

       {/* START MARKER */}
       {safeCoords.length > 0 && (
         <MapLibreGL.PointAnnotation id="start" coordinate={safeCoords[0]}>
           <View style={{
             width:16,
             height:16,
             borderRadius:10,
             backgroundColor:"green"
           }}/>
         </MapLibreGL.PointAnnotation>
       )}

       {/* CURRENT MARKER */}
       {safeCoords.length > 0 && (
         <MapLibreGL.PointAnnotation
           id="current"
           coordinate={safeCoords[safeCoords.length - 1]}
         >
           <View style={{
             width:18,
             height:18,
             borderRadius:10,
             backgroundColor:"red"
           }}/>
         </MapLibreGL.PointAnnotation>
       )}

       {/* ROUTE LINE */}
       {safeCoords.length >= 2 && (
         <MapLibreGL.ShapeSource
           id="routeSource"
           shape={{
             type: "Feature",
             geometry: {
               type: "LineString",
               coordinates: safeCoords
             }
           }}
         >
           <MapLibreGL.LineLayer
             id="routeLine"
             style={{
               lineColor: "#2563EB",
               lineWidth: 5
             }}
           />
         </MapLibreGL.ShapeSource>
       )}

     </MapLibreGL.MapView>

   </View>
 );
};

export default FSETracking;
