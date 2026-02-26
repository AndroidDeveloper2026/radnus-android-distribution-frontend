import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../API/api';

// CREATE (FSE submits → PENDING)
export const createFSE = createAsyncThunk('fse/create', async data => {
  const res = await API.post('/api/fse', data);
  return res.data;
});

// GET ALL
export const getFSEs = createAsyncThunk('fse/getAll', async () => {
  const res = await API.get('/api/fse');
  return res.data;
});

// // UPDATE
// export const updateFSE = createAsyncThunk(
//   "fse/update",
//   async ({ id, data }) => {
//     const res = await API.put(`${'/api/fse'}/${id}`, data);
//     return res.data;
//   }
// );

// // DELETE
// export const deleteFSE = createAsyncThunk(
//   "fse/delete",
//   async (id) => {
//     await API.delete(`${'/api/fse'}/${id}`);
//     return id;
//   }
// );

export const deleteFSE = createAsyncThunk('fse/delete', async id => {
  await API.delete(`/api/fse/${id}`);
  return id;
});

// UPDATE (for reject)
export const updateFSE = createAsyncThunk(
  'fse/update',
  async ({ id, data }) => {
    const res = await API.put(`/api/fse/${id}`, data);
    return res.data;
  },
);

// APPROVE (Distributor only)
export const approveFSE = createAsyncThunk('fse/approve', async id => {
  const res = await API.patch(`${'/api/fse'}/approve/${id}`);
  return res.data;
});

const fseSlice = createSlice({
  name: 'fse',
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder

      // GET
      .addCase(getFSEs.fulfilled, (state, action) => {
        state.list = action.payload;
      })

      // CREATE
      .addCase(createFSE.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // // UPDATE
      // .addCase(updateFSE.fulfilled, (state, action) => {
      //   const index = state.list.findIndex(
      //     (f) => f._id === action.payload._id
      //   );
      //   if (index !== -1) state.list[index] = action.payload;
      // })

      // // DELETE
      // .addCase(deleteFSE.fulfilled, (state, action) => {
      //   state.list = state.list.filter(
      //     (f) => f._id !== action.payload
      //   );
      // })

      .addCase(deleteFSE.fulfilled, (state, action) => {
        state.list = state.list.filter(f => f._id !== action.payload);
      })

      .addCase(updateFSE.fulfilled, (state, action) => {
        const index = state.list.findIndex(f => f._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })

      // APPROVE
      .addCase(approveFSE.fulfilled, (state, action) => {
        const index = state.list.findIndex(f => f._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      });
  },
});

export default fseSlice.reducer;
