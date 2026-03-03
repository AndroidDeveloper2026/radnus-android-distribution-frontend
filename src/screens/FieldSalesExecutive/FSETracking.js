// import React, { useEffect, useState } from 'react';
// import MapLibreGL from '@maplibre/maplibre-react-native';
// import API from '../../services/API/api';
// import { Text, View } from 'react-native';

// const FSETracking = ({ route }) => {
//   const sessionId = route?.params?.sessionId;
//   const [coords, setCoords] = useState([]);

//   useEffect(() => {
//     const interval = setInterval(async () => {
//       const res = await API.get(`/api/session/${sessionId}`);

//       const routeData = res.data.route.map(p => [p.longitude, p.latitude]);

//       setCoords(routeData);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   if (!sessionId) {
//     return (
//       <View>
//         <Text>No session found</Text>
//       </View>
//     );
//   }

//   return (
//     <MapLibreGL.MapView style={{ flex: 1 }} mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=3gTrSf36y6oirRLmBYot`}>
//       <MapLibreGL.Camera
//         zoomLevel={14}
//         centerCoordinate={coords.length ? coords[0] : [79.8289, 11.9352]}
//       />

//       {coords.length >= 2 && (
//         <MapLibreGL.ShapeSource
//           id="route"
//           shape={{
//             type: 'Feature',
//             geometry: {
//               type: 'LineString',
//               coordinates: coords,
//             },
//           }}
//         >
//           <MapLibreGL.LineLayer
//             id="line"
//             style={{ lineWidth: 4, lineColor: 'red' }}
//           />
//         </MapLibreGL.ShapeSource>
//       )}
//     </MapLibreGL.MapView>
//   );
// };

// export default FSETracking;

import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import API from '../../services/API/api';

MapLibreGL.setAccessToken(null);

const FSETracking = ({ route }) => {
 const sessionId = route?.params?.sessionId;

 const [coords, setCoords] = useState([]);

 useEffect(() => {
   if (!sessionId) return;

   const interval = setInterval(async () => {
     try {
       const res = await API.get(`/api/session/${sessionId}`);
       const session = res.data;

       // ✅ START LOCATION
       const start = session.startLocation
         ? [
             [
               session.startLocation.longitude,
               session.startLocation.latitude,
             ],
           ]
         : [];

       // ✅ ROUTE POINTS
       const routePoints = (session.route || []).map(p => [
         p.longitude,
         p.latitude,
       ]);

       // ✅ COMBINE BOTH
       const fullCoords = [...start, ...routePoints];

       setCoords(fullCoords);
     } catch (err) {
       console.log('MAP ERROR:', err.message);
     }
   }, 5000);

   return () => clearInterval(interval);
 }, [sessionId]);

 if (!sessionId) {
   return (
     <View>
       <Text>No session found</Text>
     </View>
   );
 }

 return (
   <MapLibreGL.MapView
     style={{ flex: 1 }}
     mapStyle="https://api.maptiler.com/maps/streets/style.json?key=3gTrSf36y6oirRLmBYot"
   >
     {/* CAMERA */}
     <MapLibreGL.Camera
       zoomLevel={14}
       centerCoordinate={
         coords.length ? coords[0] : [79.8289, 11.9352]
       }
     />

     {/* ✅ START MARKER */}
     {coords.length >= 1 && (
       <MapLibreGL.PointAnnotation id="start" coordinate={coords[0]}>
         <View
           style={{
             width: 12,
             height: 12,
             backgroundColor: 'green',
             borderRadius: 6,
             borderWidth: 2,
             borderColor: '#fff',
           }}
         />
       </MapLibreGL.PointAnnotation>
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
             lineWidth: 4,
             lineColor: '#ff3b30',
             lineCap: 'round',
             lineJoin: 'round',
           }}
         />
       </MapLibreGL.ShapeSource>
     )}

     {/* ✅ END MARKER (optional) */}
     {coords.length >= 2 && (
       <MapLibreGL.PointAnnotation
         id="end"
         coordinate={coords[coords.length - 1]}
       >
         <View
           style={{
             width: 12,
             height: 12,
             backgroundColor: 'red',
             borderRadius: 6,
             borderWidth: 2,
             borderColor: '#fff',
           }}
         />
       </MapLibreGL.PointAnnotation>
     )}
   </MapLibreGL.MapView>
 );
};

export default FSETracking;

