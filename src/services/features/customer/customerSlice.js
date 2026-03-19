import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../API/api';

// Lookup single customer by phone
export const lookupCustomer = createAsyncThunk(
  'customer/lookup',
  async (phone, { rejectWithValue }) => {
    try {
      const res = await API.get(`/api/customers/${phone}`);
      return res.data.customer;
    } catch (err) {
      const message =
        err.response?.data?.message || 'Network error. Check your connection.';
      return rejectWithValue(message);
    }
  }
);

// Add new customer
export const addCustomer = createAsyncThunk(
  'customer/add',
  async (customerData, { rejectWithValue }) => {
    try {
      const res = await API.post('/api/customers', customerData);
      return res.data.customer;
    } catch (err) {
      const message =
        err.response?.data?.message || 'Network error. Check your connection.';
      return rejectWithValue(message);
    }
  }
);

// Fetch all customers
export const fetchAllCustomers = createAsyncThunk(
  'customer/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/api/customers');
      return res.data.customers;
    } catch (err) {
      const message =
        err.response?.data?.message || 'Network error. Check your connection.';
      return rejectWithValue(message);
    }
  }
);

// ── Slice ──────────────────────────────────────────────────

const customerSlice = createSlice({
  name: 'customer',
  initialState: {
    data:        null,    // single customer from lookup
    list:        [],      // all customers list
    listState:   'idle',  // idle | loading | success | error
    lookupState: 'idle',  // idle | loading | found | notfound | error
    addState:    'idle',  // idle | loading | success | error
    error:       null,
  },
  reducers: {
    resetCustomer(state) {
      state.data        = null;
      state.lookupState = 'idle';
      state.addState    = 'idle';
      state.error       = null;
    },
    clearAddState(state) {
      state.addState = 'idle';
      state.error    = null;
    },
  },
  extraReducers: (builder) => {

    // ── lookupCustomer ──────────────────────────────────
    builder
      .addCase(lookupCustomer.pending, (state) => {
        state.lookupState = 'loading';
        state.data        = null;
        state.error       = null;
      })
      .addCase(lookupCustomer.fulfilled, (state, action) => {
        state.lookupState = 'found';
        state.data        = action.payload;
      })
      .addCase(lookupCustomer.rejected, (state, action) => {
        state.lookupState =
          action.payload === 'Customer not found' ? 'notfound' : 'error';
        state.error = action.payload;
      });

    // ── addCustomer ─────────────────────────────────────
    builder
      .addCase(addCustomer.pending, (state) => {
        state.addState = 'loading';
        state.error    = null;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.addState    = 'success';
        state.lookupState = 'found';
        state.data        = action.payload;
        // Add new customer to top of list immediately
        if (action.payload) {
          state.list = [action.payload, ...state.list];
        }
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.addState = 'error';
        state.error    = action.payload;
      });

    // ── fetchAllCustomers ───────────────────────────────
    builder
      .addCase(fetchAllCustomers.pending, (state) => {
        state.listState = 'loading';
        state.error     = null;
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.listState = 'success';
        state.list      = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.listState = 'error';
        state.error     = action.payload;
      });
  },
});

export const { resetCustomer, clearAddState } = customerSlice.actions;
export default customerSlice.reducer;