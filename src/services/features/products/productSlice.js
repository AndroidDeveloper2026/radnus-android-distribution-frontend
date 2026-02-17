import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://10.0.2.2:3000/api/products";

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async () => {
    const res = await axios.get(API);
    return res.data;
  }
);

export const addProduct = createAsyncThunk(
  "products/add",
  async (formData) => {
    const res = await axios.post(API, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      });
  },
});

export default productSlice.reducer;
