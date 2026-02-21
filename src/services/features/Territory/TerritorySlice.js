import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
import API from '../../API/api';

const TERRITORY = '/api/territory';

export const fetchTerritory = createAsyncThunk('territory/fetch', async () => {
  const res = await API.get('/api/territory');
  console.log('-- api territory -- ', res.data);

  return res.data;
});

// export const addDistrict = createAsyncThunk(
//   'territory/addDistrict',
//   async (data) => {
//     await API.post(`${TERRITORY}/district`, data);
//     return data;
//   }
// );

// export const addTaluk = createAsyncThunk(
//   'territory/addTaluk',
//   async (data) => {
//     await API.post(`${TERRITORY}/taluk`, data);
//     return data;
//   }
// );

// ADD TERRITORY
export const addTerritory = createAsyncThunk(
  'territory/add',
  async (data, { dispatch }) => {
    const res = await API.post(TERRITORY, data);

    // refresh list after add
    dispatch(fetchTerritory());

    return res.data;
  },
);

export const updateTerritory = createAsyncThunk(
  'territory/update',
  async ({ id, data }, { dispatch }) => {
    const res = await API.put(`/api/territory/${id}`, data);

    // refresh list
    dispatch(fetchTerritory());

    return res.data;
  },
);

// DELETE TALUK
export const deleteTaluk = createAsyncThunk(
  'territory/deleteTaluk',
  async (id, { dispatch }) => {
    await API.delete(`/api/territory/taluk/${id}`);
    dispatch(fetchTerritory());
  }
);

// DELETE DISTRICT
export const deleteDistrict = createAsyncThunk(
  'territory/deleteDistrict',
  async ({ state, district }, { dispatch }) => {
    await API.delete(`/api/territory/district`, {
      data: { state, district },
    });
    dispatch(fetchTerritory());
  }
);

// DELETE STATE
export const deleteState = createAsyncThunk(
  'territory/deleteState',
  async (stateName, { dispatch }) => {
    await API.delete(`/api/territory/state`, {
      data: { state: stateName },
    });
    dispatch(fetchTerritory());
  }
);

const territorySlice = createSlice({
  name: 'territory',
  initialState: {
    data: {},
    loading: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTerritory.pending, state => {
        state.loading = true;
      })
      .addCase(fetchTerritory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })

      .addCase(addTerritory.pending, state => {
        state.loading = true;
      })
      .addCase(addTerritory.fulfilled, state => {
        state.loading = false;
      })

      .addCase(updateTerritory.pending, state => {
        state.loading = true;
      })
      .addCase(updateTerritory.fulfilled, state => {
        state.loading = false;
      });
  },
});

export default territorySlice.reducer;
