import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../API/api';

// ─── Async Thunks ───────────────────────────────────────────────

export const fetchInvoices = createAsyncThunk(
  'invoice/fetchInvoices',
  async (filter = 'all', { rejectWithValue }) => {
    try {
      const res = await API.get(`/api/invoices?filter=${filter}`);
      console.log('--- fetchInvoices ---', res.data);
      return { filter, data: res.data };
    } catch (err) {
      console.log('--- fetchInvoices (err) ---', err);
      return rejectWithValue(err.response?.data?.msg || 'Failed to fetch invoices');
    }
  },
);

export const fetchInvoiceCounts = createAsyncThunk(
  'invoice/fetchInvoiceCounts',
  async (_, { rejectWithValue }) => {
    try {
      const filters = ['all', 'today', 'week', 'month'];
      const results = await Promise.all(
        filters.map(f =>
          API.get(`/api/invoices?filter=${f}`)
            .then(r => r.data.length)
            .catch(() => 0),
        ),
      );
      console.log('--- fetchInvoiceCounts ---', results);
      return {
        all: results[0],
        today: results[1],
        week: results[2],
        month: results[3],
      };
    } catch (err) {
      console.log('--- fetchInvoiceCounts (err) ---', err);
      return rejectWithValue(err.response?.data?.msg || 'Failed to fetch counts');
    }
  },
);

// ─── Slice ───────────────────────────────────────────────────────

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState: {
    data: [],
    counts: { all: 0, today: 0, week: 0, month: 0 },
    loading: false,
    error: null,
  },
  reducers: {
    clearInvoices: state => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // fetchInvoices
      .addCase(fetchInvoices.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchInvoiceCounts
      .addCase(fetchInvoiceCounts.fulfilled, (state, action) => {
        state.counts = action.payload;
      });
  },
});

export const { clearInvoices } = invoiceSlice.actions;
export default invoiceSlice.reducer;