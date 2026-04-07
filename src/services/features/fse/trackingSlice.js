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

// import Geolocation from "@react-native-community/geolocation";
// import API from "../services/API/api";
// import socket from "../services/socket/socket";

// let intervalId = null;
// // ✅ FIX: guard flag to prevent overlapping GPS calls stacking up
// let isFetchingLocation = false;

// // ✅ REAL-TIME LOCATION TRACKING SERVICE
// export const startTrackingService = (userId, sessionId) => {

//   // ✅ Clear any existing interval before starting a new one
//   if (intervalId) {
//     clearInterval(intervalId);
//     intervalId = null;
//   }

//   // ✅ Reset the overlap guard
//   isFetchingLocation = false;

//   // ✅ Fetch GPS location every 5 seconds
//   intervalId = setInterval(() => {

//     // ✅ FIX: skip this tick if previous GPS call is still in-flight
//     //         prevents async GPS calls from stacking up and draining memory/battery
//     if (isFetchingLocation) {
//       console.log("⏩ Skipping tick — previous location fetch still in progress");
//       return;
//     }

//     isFetchingLocation = true;

//     Geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;
//         const timestamp = new Date();

//         try {
//           // ✅ Send location to backend via API
//           await API.post("/api/location/update", {
//             userId,
//             sessionId,
//             latitude,
//             longitude,
//             timestamp
//           });

//           // ✅ Also emit via Socket.io for real-time updates
//           socket.emit("send-location", {
//             sessionId,
//             latitude,
//             longitude,
//             timestamp
//           });

//           console.log(
//             `✅ Location updated: [${latitude.toFixed(4)}, ${longitude.toFixed(4)}]`
//           );

//         } catch (error) {
//           console.log("❌ Location update error:", error.message);
//         } finally {
//           // ✅ FIX: always release the guard whether API succeeded or failed
//           isFetchingLocation = false;
//         }
//       },

//       (error) => {
//         console.log("❌ GPS error:", error);
//         // ✅ FIX: release guard on GPS error too so next tick can retry
//         isFetchingLocation = false;
//       },

//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 0,
//       }
//     );

//   }, 5000); // ✅ Every 5 seconds

//   console.log("🚀 Tracking service started for session:", sessionId);
// };

// // ✅ STOP LOCATION TRACKING SERVICE
// export const stopTrackingService = () => {
//   if (intervalId) {
//     clearInterval(intervalId);
//     intervalId = null;
//     // ✅ FIX: reset guard on stop so service starts cleanly next time
//     isFetchingLocation = false;
//     console.log("🛑 Tracking service stopped");
//   }
// };

// // ✅ PAUSE/RESUME TRACKING (optional)
// export const pauseTrackingService = () => {
//   if (intervalId) {
//     clearInterval(intervalId);
//     intervalId = null;
//     isFetchingLocation = false;
//     console.log("⏸️  Tracking service paused");
//   }
// };

// export const resumeTrackingService = (userId, sessionId) => {
//   startTrackingService(userId, sessionId);
// };