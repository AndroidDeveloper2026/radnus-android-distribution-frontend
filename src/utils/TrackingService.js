import Geolocation from '@react-native-community/geolocation';
import API from '../services/API/api';

let watchId = null;

export const startLocationTracking = (sessionId) => {
  watchId = Geolocation.watchPosition(
    async position => {
      const { latitude, longitude } = position.coords;

      console.log('TRACKING:', latitude, longitude);

      try {
        await API.post('/api/session/location/update', {
          sessionId,
          latitude,
          longitude,
        });
      } catch (e) {
        console.log('TRACK ERROR:', e.message);
      }
    },
    error => console.log(error),
    {
      enableHighAccuracy: true,
      distanceFilter: 10,
      interval: 5000,
    }
  );
};

export const stopLocationTracking = () => {
  if (watchId !== null) {
    Geolocation.clearWatch(watchId);
  }
};