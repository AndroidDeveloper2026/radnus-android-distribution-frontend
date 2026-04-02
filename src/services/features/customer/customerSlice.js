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

// ✅ NEW — Delete customer by phone
export const deleteCustomer = createAsyncThunk(
  'customer/delete',
  async (phone, { rejectWithValue }) => {
    try {
      await API.delete(`/api/customers/${phone}`);
      return phone; // return phone to remove from list
    } catch (err) {
      const message =
        err.response?.data?.message || 'Network error. Check your connection.';
      return rejectWithValue(message);
    }
  }
);

// ✅ NEW — Update customer by phone
export const updateCustomer = createAsyncThunk(
  'customer/update',
  async ({ phone, data }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/api/customers/${phone}`, data);
      return res.data.customer;
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
    data:         null,
    list:         [],
    listState:    'idle',
    lookupState:  'idle',
    addState:     'idle',
    deleteState:  'idle',  // ✅ NEW
    updateState:  'idle',  // ✅ NEW
    error:        null,
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
    // ✅ NEW
    clearUpdateState(state) {
      state.updateState = 'idle';
      state.error       = null;
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
        state.list      = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.listState = 'error';
        state.error     = action.payload;
      });

    // ── deleteCustomer ✅ NEW ────────────────────────────
    builder
      .addCase(deleteCustomer.pending, (state) => {
        state.deleteState = 'loading';
        state.error       = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.deleteState = 'success';
        // Remove deleted customer from list instantly — no refetch needed
        state.list = state.list.filter(c => c.phone !== action.payload);
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.deleteState = 'error';
        state.error       = action.payload;
      });

    // ── updateCustomer ✅ NEW ────────────────────────────
    builder
      .addCase(updateCustomer.pending, (state) => {
        state.updateState = 'loading';
        state.error       = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.updateState = 'success';
        // Update the customer in list instantly — no refetch needed
        state.list = state.list.map(c =>
          c.phone === action.payload.phone ? action.payload : c
        );
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.updateState = 'error';
        state.error       = action.payload;
      });
  },
});

export const { resetCustomer, clearAddState, clearUpdateState } = customerSlice.actions;
export default customerSlice.reducer;