// import { createSlice } from '@reduxjs/toolkit';
// import {
//   startLocationTracking,
//   stopLocationTracking,
// } from '../../../utils/TrackingService';

// const trackingSlice = createSlice({
//   name: 'tracking',
//   initialState: {
//     sessionId: null,
//     isTracking: false,
//   },
//   reducers: {
//     startTracking: (state, action) => {
//       state.sessionId = action.payload;
//       state.isTracking = true;

//       startLocationTracking(action.payload); // 🔥 START
//     },

//     stopTracking: state => {
//       stopLocationTracking(); // 🔥 STOP

//       state.sessionId = null;
//       state.isTracking = false;
//     },
//   },
// });

// export const { startTracking, stopTracking } = trackingSlice.actions;
// export default trackingSlice.reducer;

// import { createSlice } from '@reduxjs/toolkit';
// import {
//  startLocationTracking,
//  stopLocationTracking,
// } from '../../../utils/TrackingService';

// const trackingSlice = createSlice({
//  name: 'tracking',
//  initialState: {
//    sessionId: null,
//    isTracking: false,
//  },

//  reducers: {
//    startTracking: (state, action) => {
//      state.sessionId = action.payload;
//      state.isTracking = true;

//      startLocationTracking(action.payload);
//    },

//    stopTracking: state => {
//      stopLocationTracking();

//      state.sessionId = null;
//      state.isTracking = false;
//    },
//  },
// });

// export const { startTracking, stopTracking } = trackingSlice.actions;
// export default trackingSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";
// import Geolocation from "@react-native-community/geolocation";
// import API from "../../API/api";

// let watchId = null;

// export const startTracking = (sessionId) => async dispatch => {

//  watchId = Geolocation.watchPosition(
//    async position => {

//      const { latitude, longitude } = position.coords;

//      await API.post("/api/session/location/update", {
//        sessionId,
//        latitude,
//        longitude
//      });

//    },
//    error => {
//      console.log("Tracking error", error);
//    },
//    {
//      enableHighAccuracy: true,
//      distanceFilter: 5,
//      interval: 5000
//    }
//  );

// };

// export const stopTracking = () => dispatch => {
//  if (watchId !== null) {
//    Geolocation.clearWatch(watchId);
//  }
// };

// const trackingSlice = createSlice({
//  name: "tracking",
//  initialState: {},
//  reducers: {}
// });

// export default trackingSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

const trackingSlice = createSlice({

  name: "tracking",

  initialState: {
    sessionId: null,
    tracking: false
  },

  reducers: {

    startTracking: (state, action) => {
      state.sessionId = action.payload;
      state.tracking = true;
    },

    stopTracking: state => {
      state.sessionId = null;
      state.tracking = false;
    }

  }

});

export const { startTracking, stopTracking } = trackingSlice.actions;

export default trackingSlice.reducer;