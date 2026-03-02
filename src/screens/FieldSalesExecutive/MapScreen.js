// import React, { useEffect } from 'react';
// import { View, StyleSheet } from 'react-native';
// import MapView, { Marker, UrlTile } from 'react-native-maps';
// import { useSelector, useDispatch } from 'react-redux';
// import { setUsers } from '../../services/features/fse/locationSlice';
// import socket from '../../services/socket/socket';
// import useLocationTracking from '../../utils/hooks/useLocationTracking';

// const MapScreen = () => {
//   const dispatch = useDispatch();
//   const { users, myLocation } = useSelector((state) => state.location);

//   const userId = 'user_123'; // replace with real user ID

//   useLocationTracking(userId);

//   useEffect(() => {
//     socket.on('users-location', (data) => {
//       dispatch(setUsers(data));
//     });

//     return () => socket.off('users-location');
//   }, [dispatch]);

//   if (!myLocation) return null;

//   return (
//     <View style={styles.container}>
//       <MapView style={styles.map} region={myLocation}>

//         {/* 🌍 OpenStreetMap */}
//         <UrlTile
//           urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
//           maximumZ={19}
//         />

//         {/* 👤 Me */}
//         <Marker coordinate={myLocation} title="Me" pinColor="blue" />

//         {/* 👥 Others */}
//         {Object.keys(users).map((id) => (
//           <Marker
//             key={id}
//             coordinate={{
//               latitude: users[id].latitude,
//               longitude: users[id].longitude,
//             }}
//             title={id}
//           />
//         ))}

//       </MapView>
//     </View>
//   );
// };

// export default MapScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   map: { flex: 1 },
// });

import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import Header from '../../components/Header';

MapLibreGL.setAccessToken(null);

const MapScreen = () => {
  return (
    <View style={styles.container}>
      <Header title={'FSE MapView'}/>
      <MapLibreGL.MapView
        style={styles.map}
        // mapStyle="https://demotiles.maplibre.org/style.json"
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=3gTrSf36y6oirRLmBYot`}
      >
        <MapLibreGL.Camera
          zoomLevel={14}
          centerCoordinate={[ 79.82899166666667,11.93527]}
        />

        <MapLibreGL.PointAnnotation
          id="marker"
          coordinate={[ 79.82899166666667,11.93527]}
        />

      </MapLibreGL.MapView>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});