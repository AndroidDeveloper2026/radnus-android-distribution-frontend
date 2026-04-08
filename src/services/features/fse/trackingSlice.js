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


