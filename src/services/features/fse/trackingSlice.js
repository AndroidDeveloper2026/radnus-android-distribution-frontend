// import { createSlice } from '@reduxjs/toolkit';

// const trackingSlice = createSlice({
//   name: 'tracking',
//   initialState: {
//     isTracking: false,
//     sessionId: null,
//   },
//   reducers: {
//     startTracking: (state, action) => {
//       state.isTracking = true;
//       state.sessionId = action.payload;
//     },
//     stopTracking: (state) => {
//       state.isTracking = false;
//       state.sessionId = null;
//     },
//   },
// });

// export const { startTracking, stopTracking } = trackingSlice.actions;
// export default trackingSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import {
  startLocationTracking,
  stopLocationTracking,
} from '../../../utils/TrackingService';

const trackingSlice = createSlice({
  name: 'tracking',
  initialState: {
    sessionId: null,
    isTracking: false,
  },
  reducers: {
    startTracking: (state, action) => {
      state.sessionId = action.payload;
      state.isTracking = true;

      startLocationTracking(action.payload); // 🔥 START
    },

    stopTracking: state => {
      stopLocationTracking(); // 🔥 STOP

      state.sessionId = null;
      state.isTracking = false;
    },
  },
});

export const { startTracking, stopTracking } = trackingSlice.actions;
export default trackingSlice.reducer;