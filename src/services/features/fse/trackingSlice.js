import { createSlice } from '@reduxjs/toolkit';

const trackingSlice = createSlice({
  name: 'tracking',
  initialState: {
    isTracking: false,
    sessionId: null,
  },
  reducers: {
    startTracking: (state, action) => {
      state.isTracking = true;
      state.sessionId = action.payload;
    },
    stopTracking: (state) => {
      state.isTracking = false;
      state.sessionId = null;
    },
  },
});

export const { startTracking, stopTracking } = trackingSlice.actions;
export default trackingSlice.reducer;