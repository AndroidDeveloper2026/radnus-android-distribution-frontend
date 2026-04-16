import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../API/api';

// GET LOGS
export const fetchActivityLogs = createAsyncThunk(
  'activity/fetchLogs',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/activity-logs');
      console.log("API RESPONSE:", res.data);
      return res.data; // must be array
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// CREATE LOG
export const createActivityLog = createAsyncThunk(
  'activity/createLog',
  async (logData, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/activity-logs', logData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const activitySlice = createSlice({
  name: 'activity',
  initialState: {
    logs: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchActivityLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.loading = false;

        console.log("API RESPONSE:", action.payload); // ✅ DEBUG

        state.logs = Array.isArray(action.payload)
          ? action.payload
          : action.payload.logs || []; // ✅ SAFE FIX
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload?.error || 'Failed to fetch logs';
      });
  },
});

export default activitySlice.reducer;