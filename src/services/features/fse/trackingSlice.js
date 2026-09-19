import { createSlice } from "@reduxjs/toolkit";

const trackingSlice = createSlice({

  name: "tracking",

  initialState: {
    sessionId: null,
    tracking: false,
    recovered: false,     // true when this session was resumed after app restart/crash
    recovering: false,    // true while the app is actively checking for an orphaned session
  },

  reducers: {

    startTracking: (state, action) => {
      state.sessionId = action.payload;
      state.tracking = true;
      state.recovered = false;
    },

    // ✅ Resume tracking for a session recovered on app start (e.g. after a crash)
    resumeTracking: (state, action) => {
      state.sessionId = action.payload;
      state.tracking = true;
      state.recovered = true;
    },

    setRecovering: (state, action) => {
      state.recovering = action.payload;
    },

    stopTracking: state => {
      state.sessionId = null;
      state.tracking = false;
      state.recovered = false;
      state.recovering = false;
    }

  }

});

export const { startTracking, resumeTracking, setRecovering, stopTracking } = trackingSlice.actions;

export default trackingSlice.reducer;
