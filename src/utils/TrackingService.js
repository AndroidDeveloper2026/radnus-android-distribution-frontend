// import Geolocation from '@react-native-community/geolocation';
// import API from '../services/API/api';

// let watchId = null;

// export const startLocationTracking = (sessionId) => {
//   watchId = Geolocation.watchPosition(
//     async position => {
//       const { latitude, longitude } = position.coords;

//       console.log('TRACKING:', latitude, longitude);

//       try {
//         await API.post('/api/session/location/update', {
//           sessionId,
//           latitude,
//           longitude,
//         });
//       } catch (e) {
//         console.log('TRACK ERROR:', e.message);
//       }
//     },
//     error => console.log(error),
//     {
//       enableHighAccuracy: true,
//       distanceFilter: 10,
//       interval: 5000,
//     }
//   );
// };

// export const stopLocationTracking = () => {
//   if (watchId !== null) {
//     Geolocation.clearWatch(watchId);
//   }
// };

// import Geolocation from '@react-native-community/geolocation';
// import API from '../services/API/api';

// let watchId = null;

// export const startLocationTracking = sessionId => {
//  watchId = Geolocation.watchPosition(
//    async position => {
//      const { latitude, longitude } = position.coords;

//      try {
//        await API.post('/api/location/update', {
//          sessionId,
//          latitude,
//          longitude,
//        });
//      } catch (e) {
//        console.log('Tracking error:', e.message);
//      }
//    },
//    error => console.log(error),
//    {
//      enableHighAccuracy: true,
//      distanceFilter: 5,
//      interval: 5000,
//      fastestInterval: 3000,
//    },
//  );
// };

// export const stopLocationTracking = () => {
//  if (watchId !== null) {
//    Geolocation.clearWatch(watchId);
//    watchId = null;
//  }
// };

import Geolocation from "@react-native-community/geolocation";
import socket from "../services/socket/socket";
import API from "../services/API/api";

let watchId = null;

export const startTrackingService = (userId, sessionId) => {

  watchId = Geolocation.watchPosition(

    async position => {

      const { latitude, longitude } = position.coords;

      socket.emit("send-location", {
        userId,
        sessionId,
        latitude,
        longitude
      });

      await API.post("/api/session/location/update", {
        userId,
        sessionId,
        latitude,
        longitude
      });

    },

    error => console.log(error),

    {
      enableHighAccuracy: true,
      distanceFilter: 10,
      interval: 10000
    }

  );

};

export const stopTrackingService = () => {

  if (watchId !== null) {
    Geolocation.clearWatch(watchId);
  }

};