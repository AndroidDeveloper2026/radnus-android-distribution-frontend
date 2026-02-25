import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API/api";

export const addRetailer = createAsyncThunk(
  "retailer/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/api/retailers", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const retailerSlice = createSlice({
  name: "retailer",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addRetailer.pending, (state) => {
        state.loading = true;
      })
      .addCase(addRetailer.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(addRetailer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default retailerSlice.reducer;