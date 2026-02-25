import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: {},
  myLocation: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setMyLocation: (state, action) => {
      state.myLocation = action.payload;
    },
  },
});

export const { setUsers, setMyLocation } = locationSlice.actions;
export default locationSlice.reducer;