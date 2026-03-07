import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API/api";

export const fetchProfile = createAsyncThunk(
 "profile/fetch",
 async () => {
   const res = await API.get("/api/profile/me");
   return res.data;
 }
);

const profileSlice = createSlice({
 name: "profile",
 initialState: {
   data: null,
 },
 extraReducers: (builder) => {
   builder.addCase(fetchProfile.fulfilled, (state, action) => {
     state.data = action.payload;
   });
 },
});

export default profileSlice.reducer;
