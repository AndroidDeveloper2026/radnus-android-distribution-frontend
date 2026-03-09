// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import API from '../../API/api';

// /* GET EXECUTIVES */

// export const getExecutives = createAsyncThunk(
//   'executive/getExecutives',
//   async () => {
//     const res = await API.get('/executives');
//     return res.data;
//   },
// );

// /* ADD EXECUTIVE */

// export const addExecutive = createAsyncThunk(
//   'executive/addExecutive',
//   async data => {
//     const res = await API.post('/executives', data, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });
//     return res.data;
//   },
// );

// export const deleteExecutive = createAsyncThunk(
//   'executive/deleteExecutive',
//   async id => {
//     await API.delete(`/executives/${id}`);
//     return id;
//   },
// );

// export const updateExecutive = createAsyncThunk(
//   'executive/updateExecutive',
//   async ({ id, data }) => {
//     const res = await API.put(`/executives/${id}`, data);
//     return res.data;
//   },
// );

// export const approveExecutive = createAsyncThunk(
//   'executive/approveExecutive',
//   async id => {
//     const res = await API.put(`/executives/${id}`, {
//       status: 'APPROVED',
//     });
//     return res.data;
//   },
// );

// const executiveSlice = createSlice({
//   name: 'executive',

//   initialState: {
//     list: [],
//     loading: false,
//   },

//   reducers: {},

//   extraReducers: builder => {
//     builder

//       /* GET */

//       .addCase(getExecutives.pending, state => {
//         state.loading = true;
//       })

//       .addCase(getExecutives.fulfilled, (state, action) => {
//         state.loading = false;
//         state.list = action.payload;
//       })

//       .addCase(getExecutives.rejected, state => {
//         state.loading = false;
//       })

//       /* ADD */

//       .addCase(addExecutive.fulfilled, (state, action) => {
//         state.list.push(action.payload);
//       })

//       /* DELETE */

//       .addCase(deleteExecutive.fulfilled, (state, action) => {
//         state.list = state.list.filter(e => e._id !== action.payload);
//       })

//       /* UPDATE */

//       .addCase(updateExecutive.fulfilled, (state, action) => {
//         const index = state.list.findIndex(e => e._id === action.payload._id);

//         if (index !== -1) {
//           state.list[index] = action.payload;
//         }
//       })

//       /* APPROVE */

//       .addCase(approveExecutive.fulfilled, (state, action) => {
//         const index = state.list.findIndex(e => e._id === action.payload._id);

//         if (index !== -1) {
//           state.list[index] = action.payload;
//         }
//       });
//   },
// });

// export default executiveSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API/api";

/* ================================
   GET EXECUTIVES
================================ */

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

/* ================================
   ADD EXECUTIVE
================================ */

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

/* ================================
   DELETE EXECUTIVE
================================ */

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

/* ================================
   UPDATE EXECUTIVE
================================ */

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

/* ================================
   APPROVE EXECUTIVE
================================ */

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

/* ================================
   SLICE
================================ */

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

      /* ================================
         GET EXECUTIVES
      ================================ */

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

      /* ================================
         DELETE EXECUTIVE
      ================================ */

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

      /* ================================
         UPDATE EXECUTIVE
      ================================ */

      .addCase(updateExecutive.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (e) => e._id === action.payload._id
        );

        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      /* ================================
         APPROVE EXECUTIVE
      ================================ */

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