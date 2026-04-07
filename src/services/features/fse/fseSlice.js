// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import API from '../../API/api';


// //create 
// export const createFSE = createAsyncThunk(
//   "fse/create",
//   async (data) => {
//     const res = await API.post("/api/fse", data, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return res.data;
//   }
// );

// // GET ALL
// export const getFSEs = createAsyncThunk('fse/getAll', async () => {
//   const res = await API.get('/api/fse');
//   return res.data;
// });

// //Delete
// export const deleteFSE = createAsyncThunk('fse/delete', async id => {
//   await API.delete(`/api/fse/${id}`);
//   return id;
// });

// // UPDATE (for reject)
// export const updateFSE = createAsyncThunk(
//   'fse/update',
//   async ({ id, data }) => {
//     const res = await API.put(`/api/fse/${id}`, data);
//     return res.data;
//   },
// );

// // APPROVE (Distributor only)
// export const approveFSE = createAsyncThunk('fse/approve', async id => {
//   const res = await API.patch(`${'/api/fse'}/approve/${id}`);
//   return res.data;
// });

// const fseSlice = createSlice({
//   name: 'fse',
//   initialState: {
//     list: [],
//     loading: false,
//   },
//   reducers: {},
//   extraReducers: builder => {
//     builder

//       // GET
//       .addCase(getFSEs.fulfilled, (state, action) => {
//         state.list = action.payload;
//       })

//       // CREATE
//       .addCase(createFSE.fulfilled, (state, action) => {
//         state.list.push(action.payload);
//       })

//       // // UPDATE
//       // .addCase(updateFSE.fulfilled, (state, action) => {
//       //   const index = state.list.findIndex(
//       //     (f) => f._id === action.payload._id
//       //   );
//       //   if (index !== -1) state.list[index] = action.payload;
//       // })

//       // // DELETE
//       // .addCase(deleteFSE.fulfilled, (state, action) => {
//       //   state.list = state.list.filter(
//       //     (f) => f._id !== action.payload
//       //   );
//       // })

//       .addCase(deleteFSE.fulfilled, (state, action) => {
//         state.list = state.list.filter(f => f._id !== action.payload);
//       })

//       .addCase(updateFSE.fulfilled, (state, action) => {
//         const index = state.list.findIndex(f => f._id === action.payload._id);
//         if (index !== -1) state.list[index] = action.payload;
//       })

//       // APPROVE
//       .addCase(approveFSE.fulfilled, (state, action) => {
//         const index = state.list.findIndex(f => f._id === action.payload._id);
//         if (index !== -1) state.list[index] = action.payload;
//       });
//   },
// });

// export default fseSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../API/api';

// CREATE
export const createFSE = createAsyncThunk(
  'fse/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post('/api/fse', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (err) {
      // ✅ FIX: propagate error message so UI can display it
      return rejectWithValue(err.response?.data?.message || 'Failed to create FSE');
    }
  }
);

// GET ALL
export const getFSEs = createAsyncThunk(
  'fse/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/api/fse');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch FSEs');
    }
  }
);

// DELETE
export const deleteFSE = createAsyncThunk(
  'fse/delete',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/api/fse/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete FSE');
    }
  }
);

// UPDATE (for reject)
export const updateFSE = createAsyncThunk(
  'fse/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/api/fse/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update FSE');
    }
  }
);

// APPROVE (Distributor only)
export const approveFSE = createAsyncThunk(
  'fse/approve',
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.patch(`/api/fse/approve/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to approve FSE');
    }
  }
);

const fseSlice = createSlice({
  name: 'fse',
  initialState: {
    list: [],
    loading: false, // ✅ FIX: added loading state for UI spinners
    error: null,    // ✅ FIX: added error state for UI error display
  },
  reducers: {
    // ✅ FIX: added manual error clear so UI can dismiss error banners
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder

      // ─── GET ALL ──────────────────────────────────────────────────────────
      .addCase(getFSEs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFSEs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getFSEs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ─── CREATE ───────────────────────────────────────────────────────────
      .addCase(createFSE.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFSE.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createFSE.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ─── DELETE ───────────────────────────────────────────────────────────
      .addCase(deleteFSE.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFSE.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(f => f._id !== action.payload);
      })
      .addCase(deleteFSE.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ─── UPDATE ───────────────────────────────────────────────────────────
      .addCase(updateFSE.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFSE.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(f => f._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateFSE.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ─── APPROVE ──────────────────────────────────────────────────────────
      .addCase(approveFSE.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveFSE.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(f => f._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(approveFSE.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = fseSlice.actions;
export default fseSlice.reducer;