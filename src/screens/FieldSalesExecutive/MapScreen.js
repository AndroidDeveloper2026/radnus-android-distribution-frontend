import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';
import { setUsers } from '../redux/locationSlice';
import socket from '../services/socket';
import useLocationTracking from '../hooks/useLocationTracking';

const MapScreen = () => {
  const dispatch = useDispatch();
  const { users, myLocation } = useSelector((state) => state.location);

  const userId = 'user_123'; // replace with real user ID

  useLocationTracking(userId);

  useEffect(() => {
    socket.on('users-location', (data) => {
      dispatch(setUsers(data));
    });

    return () => socket.off('users-location');
  }, [dispatch]);

  if (!myLocation) return null;

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={myLocation}>

        {/* 🌍 OpenStreetMap */}
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />

        {/* 👤 Me */}
        <Marker coordinate={myLocation} title="Me" pinColor="blue" />

        {/* 👥 Others */}
        {Object.keys(users).map((id) => (
          <Marker
            key={id}
            coordinate={{
              latitude: users[id].latitude,
              longitude: users[id].longitude,
            }}
            title={id}
          />
        ))}

      </MapView>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});