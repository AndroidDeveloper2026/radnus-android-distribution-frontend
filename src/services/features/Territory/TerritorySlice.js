import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../API/api';

const TERRITORY = '/api/territory';

// ─── FETCH TERRITORY ──────────────────────────────────────────────────────
export const fetchTerritory = createAsyncThunk(
  'territory/fetch',
  async () => {
    const res = await API.get('/api/territory');
    return res.data;
  }
);

// ─── ADD TERRITORY ──────────────────────────────────────────────────────
export const addTerritory = createAsyncThunk(
  'territory/add',
  async (data, { dispatch }) => {
    const res = await API.post(TERRITORY, data);
    dispatch(fetchTerritory());
    return res.data;
  }
);

// ─── UPDATE TERRITORY ──────────────────────────────────────────────────────
export const updateTerritory = createAsyncThunk(
  'territory/update',
  async ({ id, data }, { dispatch }) => {
    const res = await API.put(`/api/territory/${id}`, data);
    dispatch(fetchTerritory());
    return res.data;
  }
);

// ─── DELETE TALUK ──────────────────────────────────────────────────────
export const deleteTaluk = createAsyncThunk(
  'territory/deleteTaluk',
  async (id, { dispatch }) => {
    await API.delete(`/api/territory/taluk/${id}`);
    dispatch(fetchTerritory());
  }
);

// ─── DELETE DISTRICT ──────────────────────────────────────────────────────
export const deleteDistrict = createAsyncThunk(
  'territory/deleteDistrict',
  async ({ state, district }, { dispatch }) => {
    await API.delete(`/api/territory/district`, {
      data: { state, district },
    });
    dispatch(fetchTerritory());
  }
);

// ─── DELETE STATE ──────────────────────────────────────────────────────
export const deleteState = createAsyncThunk(
  'territory/deleteState',
  async (stateName, { dispatch }) => {
    await API.delete(`/api/territory/state`, {
      data: { state: stateName },
    });
    dispatch(fetchTerritory());
  }
);

// ─── SLICE ──────────────────────────────────────────────────────
const territorySlice = createSlice({
  name: 'territory',
  initialState: {
    data: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTerritory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTerritory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || {};
      })
      .addCase(fetchTerritory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add
      .addCase(addTerritory.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTerritory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addTerritory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update
      .addCase(updateTerritory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTerritory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateTerritory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = territorySlice.actions;
export default territorySlice.reducer;

//++++++++++++++++++++++++++++++++++++++++++++++++++++++
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import API from '../../API/api';

// const TERRITORY = '/api/territory';

// export const fetchTerritory = createAsyncThunk('territory/fetch', async () => {
//   const res = await API.get('/api/territory');

//   return res.data;
// });

// // ADD TERRITORY
// export const addTerritory = createAsyncThunk(
//   'territory/add',
//   async (data, { dispatch }) => {
//     const res = await API.post(TERRITORY, data);

//     // refresh list after add
//     dispatch(fetchTerritory());

//     return res.data;
//   },
// );

// export const updateTerritory = createAsyncThunk(
//   'territory/update',
//   async ({ id, data }, { dispatch }) => {
//     const res = await API.put(`/api/territory/${id}`, data);

//     // refresh list
//     dispatch(fetchTerritory());

//     return res.data;
//   },
// );

// // DELETE TALUK
// export const deleteTaluk = createAsyncThunk(
//   'territory/deleteTaluk',
//   async (id, { dispatch }) => {
//     await API.delete(`/api/territory/taluk/${id}`);
//     dispatch(fetchTerritory());
//   }
// );

// // DELETE DISTRICT
// export const deleteDistrict = createAsyncThunk(
//   'territory/deleteDistrict',
//   async ({ state, district }, { dispatch }) => {
//     await API.delete(`/api/territory/district`, {
//       data: { state, district },
//     });
//     dispatch(fetchTerritory());
//   }
// );

// // DELETE STATE
// export const deleteState = createAsyncThunk(
//   'territory/deleteState',
//   async (stateName, { dispatch }) => {
//     await API.delete(`/api/territory/state`, {
//       data: { state: stateName },
//     });
//     dispatch(fetchTerritory());
//   }
// );

// const territorySlice = createSlice({
//   name: 'territory',
//   initialState: {
//     data: {},
//     loading: false,
//   },
//   reducers: {},
//   extraReducers: builder => {
//     builder
//       .addCase(fetchTerritory.pending, state => {
//         state.loading = true;
//       })
//       .addCase(fetchTerritory.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload;
//       })

//       .addCase(addTerritory.pending, state => {
//         state.loading = true;
//       })
//       .addCase(addTerritory.fulfilled, state => {
//         state.loading = false;
//       })

//       .addCase(updateTerritory.pending, state => {
//         state.loading = true;
//       })
//       .addCase(updateTerritory.fulfilled, state => {
//         state.loading = false;
//       });
//   },
// });

// export default territorySlice.reducer;
