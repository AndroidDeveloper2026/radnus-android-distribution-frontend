import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
import API from '../../API/api';

// const API = "/api/products";

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async () => {
    const res = await API.get("/api/products");
    return res.data;
  }
);

export const addProduct = createAsyncThunk( 
  "products/add",
  async (formData) => {
    const res = await API.post("/api/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }
);

/* UPDATE */
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, formData }) => {
    const res = await API.put(`/api/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }
);

/* DELETE */
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id) => {
    await API.delete(`/api/products/${id}`);
    return id;
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
      })
      /* UPDATE */
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          item => item._id === action.payload._id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      /* DELETE */
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.list = state.list.filter(
          item => item._id !== action.payload
        );
      });
  },
});

export default productSlice.reducer;
