import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
import API from '../../API/api';

const TERRITORY = '/api/territory';

export const fetchTerritory = createAsyncThunk(
  'territory/fetch',
  async () => {
    const res = await API.get("/api/territory");
    console.log('-- api territory -- ',res.data);
    
    return res.data;
  }
);

export const addDistrict = createAsyncThunk(
  'territory/addDistrict',
  async (data) => {
    await API.post(`${TERRITORY}/district`, data);
    return data;
  }
);

export const addTaluk = createAsyncThunk(
  'territory/addTaluk',
  async (data) => {
    await API.post(`${TERRITORY}/taluk`, data);
    return data;
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
      });
  },
});

export default territorySlice.reducer;
