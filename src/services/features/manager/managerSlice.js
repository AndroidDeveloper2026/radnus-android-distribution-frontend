import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API/api";



/* CREATE */
export const addManager = createAsyncThunk(
  "manager/add",
  async (data) => {
    const res = await API.post("/api/managers", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }
);

/* GET */
export const getManagers = createAsyncThunk(
  "manager/get",
  async () => {
    const res = await API.get("/api/managers");
    return res.data;
  }
);

/* DELETE */
export const deleteManager = createAsyncThunk(
  "manager/delete",
  async (id) => {
    await API.delete(`${"/api/managers"}/${id}`);
    return id;
  }
);

/* UPDATE */
export const updateManager = createAsyncThunk(
  "manager/update",
  async ({ id, data }) => {
    const res = await API.put(`${"/api/managers"}/${id}`, data);
    return res.data;
  }
);

/* APPROVE */
export const approveManager = createAsyncThunk(
  "manager/approve",
  async (id) => {
    const res = await API.put(`${"/api/managers"}/${id}`, {
      status: "APPROVED",
    });
    return res.data;
  }
);

const managerSlice = createSlice({
  name: "manager",
  initialState: {
    list: [],
    loading: false,
  },
  extraReducers: builder => {
    builder
      .addCase(getManagers.pending, state => {
        state.loading = true;
      })
      .addCase(getManagers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(addManager.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(deleteManager.fulfilled, (state, action) => {
        state.list = state.list.filter(i => i._id !== action.payload);
      })
      .addCase(updateManager.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          i => i._id === action.payload._id
        );
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(approveManager.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          i => i._id === action.payload._id
        );
        if (index !== -1) state.list[index] = action.payload;
      });
  },
});

export default managerSlice.reducer;