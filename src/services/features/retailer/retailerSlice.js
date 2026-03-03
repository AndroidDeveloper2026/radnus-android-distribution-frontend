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

// GET
export const fetchRetailers = createAsyncThunk(
  "retailer/fetch",
  async () => {
    const res = await API.get("/api/retailers");
    return res.data;
  }
);

// UPDATE PROFILE
export const updateRetailer = createAsyncThunk(
  "retailer/update",
  async ({ id, data }) => {
    const res = await API.put(`/api/retailers/${id}`, data);
    return res.data;
  }
);

// UPDATE STATUS
export const updateStatus = createAsyncThunk(
  "retailer/status",
  async ({ id, status }) => {
    const res = await API.patch(`/api/retailers/${id}/status`, { status });
    return res.data;
  }
);

const retailerSlice = createSlice({
  name: "retailer",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchRetailers.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(updateRetailer.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          r => r._id === action.payload._id
        );
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          r => r._id === action.payload._id
        );
        if (index !== -1) state.list[index] = action.payload;
      });
  },
});

export default retailerSlice.reducer;