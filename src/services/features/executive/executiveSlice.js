import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../../API/api';

/* GET EXECUTIVES */

export const getExecutives = createAsyncThunk(
  "executive/getExecutives",
  async () => {
    const res = await API.get('/executives');
    return res.data;
  }
);

/* ADD EXECUTIVE */

export const addExecutive = createAsyncThunk(
  "executive/addExecutive",
  async (data) => {
    const res = await API.post('/executives', data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }
);

/* DELETE EXECUTIVE */

export const deleteExecutive = createAsyncThunk(
  "executive/deleteExecutive",
  async (id) => {
    await API.delete(`${API}/${id}`);
    return id;
  }
);

/* UPDATE EXECUTIVE */

export const updateExecutive = createAsyncThunk(
  "executive/updateExecutive",
  async ({ id, data }) => {
    const res = await API.put(`${API}/${id}`, data);
    return res.data;
  }
);

/* APPROVE EXECUTIVE */

export const approveExecutive = createAsyncThunk(
  "executive/approveExecutive",
  async (id) => {
    const res = await API.put(`${API}/${id}`, {
      status: "APPROVED",
    });
    return res.data;
  }
);

const executiveSlice = createSlice({
  name: "executive",

  initialState: {
    list: [],
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* GET */

      .addCase(getExecutives.pending, (state) => {
        state.loading = true;
      })

      .addCase(getExecutives.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })

      /* ADD */

      .addCase(addExecutive.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      /* DELETE */

      .addCase(deleteExecutive.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (e) => e._id !== action.payload
        );
      })

      /* UPDATE */

      .addCase(updateExecutive.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (e) => e._id === action.payload._id
        );

        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      /* APPROVE */

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