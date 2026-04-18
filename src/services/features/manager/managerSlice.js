import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API/api";

export const getManagers = createAsyncThunk(
  "manager/getManagers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/api/managers");

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);


export const addManager = createAsyncThunk(
  "manager/addManager",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/api/managers", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);


export const deleteManager = createAsyncThunk(
  "manager/deleteManager",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/api/managers/${id}`);

      return id;
    } catch (error) {

      return rejectWithValue(error.response?.data);
    }
  }
);


export const updateManager = createAsyncThunk(
  "manager/updateManager",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/api/managers/${id}`, data);

      return res.data;
    } catch (error) {

      return rejectWithValue(error.response?.data);
    }
  }
);



const managerSlice = createSlice({
  name: "manager",

  initialState: {
    list: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(getManagers.pending, (state) => {
        state.loading = true;
      })

      .addCase(getManagers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })

      .addCase(getManagers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addManager.pending, (state) => {
        state.loading = true;
      })

      .addCase(addManager.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })

      .addCase(addManager.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteManager.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteManager.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(
          (manager) => manager._id !== action.payload
        );
      })

      .addCase(deleteManager.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateManager.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (m) => m._id === action.payload._id
        );

        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export default managerSlice.reducer;