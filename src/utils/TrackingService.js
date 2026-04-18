import Geolocation from '@react-native-community/geolocation';
import API from '../services/API/api';
import { getSocket } from '../services/socket/socket'; // ✅ use getSocket(), not default import

let watchId = null;
let isTracking = false; // ✅ FIX: guard against double-start leak

export const startTrackingService = (userId, sessionId) => {
  // ✅ FIX: if already tracking, stop old watcher cleanly before starting new one
  if (watchId !== null) {
    Geolocation.clearWatch(watchId);
    watchId = null;
  }

  if (isTracking) {
    // console.log('⚠️ Tracking already active, restarting for new session:', sessionId);
  }

  isTracking = true;

  watchId = Geolocation.watchPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      const timestamp = new Date();

      try {
        await API.post('/api/location/update', {
          userId,
          sessionId,
          latitude,
          longitude,
          timestamp,
        });

        getSocket().emit('send-location', {
          sessionId,
          latitude,
          longitude,
          timestamp,
        });

      } catch (error) {
       
      }
    },
    (error) => {

    },
    {
      enableHighAccuracy: true,
      distanceFilter: 5,
      interval: 5000,
      fastestInterval: 2000,
      showsBackgroundLocationIndicator: true,
    }
  );


};

export const stopTrackingService = () => {
  if (watchId !== null) {
    Geolocation.clearWatch(watchId);
    watchId = null;
    isTracking = false;
  }
};

export const isTrackingActive = () => isTracking;

