import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API/api";



export const getExecutives = createAsyncThunk(
  "executive/getExecutives",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/api/executives");


      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);



export const addExecutive = createAsyncThunk(
  "executive/addExecutive",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/api/executives/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });


      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);



export const deleteExecutive = createAsyncThunk(
  "executive/deleteExecutive",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/api/executives/${id}`);

      return id;
    } catch (error) {

      return rejectWithValue(error.response?.data);
    }
  }
);



export const updateExecutive = createAsyncThunk(
  "executive/updateExecutive",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/api/executives/${id}`, data);


      return res.data;
    } catch (error) {

      return rejectWithValue(error.response?.data);
    }
  }
);



export const approveExecutive = createAsyncThunk(
  "executive/approveExecutive",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.put(`/api/executives/${id}`, {
        status: "APPROVED",
      });

      return res.data;
    } catch (error) {

      return rejectWithValue(error.response?.data);
    }
  }
);



const executiveSlice = createSlice({
  name: "executive",

  initialState: {
    list: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder


      .addCase(getExecutives.pending, (state) => {
        state.loading = true;
      })

      .addCase(getExecutives.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })

      .addCase(getExecutives.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================================
         ADD EXECUTIVE
      ================================ */

      .addCase(addExecutive.pending, (state) => {
        state.loading = true;
      })

      .addCase(addExecutive.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })

      .addCase(addExecutive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })



      .addCase(deleteExecutive.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteExecutive.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(
          (executive) => executive._id !== action.payload
        );
      })

      .addCase(deleteExecutive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })



      .addCase(updateExecutive.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (e) => e._id === action.payload._id
        );

        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })



      .addCase(approveExecutive.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (e) => e._id === action.payload._id
        );

        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export default executiveSlice.reducer;