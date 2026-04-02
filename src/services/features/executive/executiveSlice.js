import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API/api";



export const getExecutives = createAsyncThunk(
  "executive/getExecutives",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/api/executives");

      console.log("GET EXECUTIVES:", res.data);

      return res.data;
    } catch (error) {
      console.log(
        "GET EXECUTIVES ERROR:",
        error.response?.data || error.message
      );
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

      console.log("--- ADD EXECUTIVE SUCCESS: ---", res.data);

      return res.data;
    } catch (error) {
      console.log(
        "ADD EXECUTIVE ERROR:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data);
    }
  }
);



export const deleteExecutive = createAsyncThunk(
  "executive/deleteExecutive",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/api/executives/${id}`);

      console.log("DELETE EXECUTIVE:", id);

      return id;
    } catch (error) {
      console.log(
        "DELETE EXECUTIVE ERROR:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data);
    }
  }
);



export const updateExecutive = createAsyncThunk(
  "executive/updateExecutive",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/api/executives/${id}`, data);

      console.log("UPDATE EXECUTIVE:", res.data);

      return res.data;
    } catch (error) {
      console.log(
        "UPDATE EXECUTIVE ERROR:",
        error.response?.data || error.message
      );
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

      console.log("APPROVE EXECUTIVE:", res.data);

      return res.data;
    } catch (error) {
      console.log(
        "APPROVE EXECUTIVE ERROR:",
        error.response?.data || error.message
      );
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