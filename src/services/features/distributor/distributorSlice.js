import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API/api";

/* ------------------ THUNKS ------------------ */

// GET ALL
export const fetchDistributors = createAsyncThunk(
  "distributors/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/api/distributors");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Fetch failed"
      );
    }
  }
);

// ADD
export const addDistributor = createAsyncThunk(
  "distributors/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/api/distributors", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Add failed"
      );
    }
  }
);

// UPDATE
export const updateDistributor = createAsyncThunk(
  "distributors/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/api/distributors/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Update failed"
      );
    }
  }
);

// DELETE
export const deleteDistributor = createAsyncThunk(
  "distributors/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/api/distributors/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Delete failed"
      );
    }
  }
);

// STATUS UPDATE
export const updateStatus = createAsyncThunk(
  "distributors/status",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await API.patch(
        `/api/distributors/${id}/status`,
        { status }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Status update failed"
      );
    }
  }
);

/* ------------------ SLICE ------------------ */

const distributorSlice = createSlice({
  name: "distributors",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchDistributors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistributors.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDistributors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addDistributor.pending, (state) => {
        state.loading = true;
      })
      .addCase(addDistributor.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(addDistributor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateDistributor.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (d) => d.id === action.payload.id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteDistributor.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (d) => d.id !== action.payload
        );
      })

      // STATUS
      .addCase(updateStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (d) => d.id === action.payload.id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export default distributorSlice.reducer;