import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API/api";

// GET
export const fetchFeedbacks = createAsyncThunk(
  "feedback/fetch",
  async () => {
    const res = await API.get("/api/feedback");
    return res.data;
  }
);

// CREATE
export const createFeedback = createAsyncThunk(
  "feedback/create",
  async (data) => {
    const res = await API.post("/api/feedback", data);
    return res.data;
  }
);

// UPDATE
export const updateFeedbackStatus = createAsyncThunk(
  "feedback/update",
  async ({ id, status }) => {
    const res = await API.put(`/api/feedback/${id}`, { status });
    return res.data;
  }
);

// DELETE (optional)
export const deleteFeedback = createAsyncThunk(
  "feedback/delete",
  async (id) => {
    await API.delete(`/api/feedback/${id}`);
    return id;
  }
);

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchFeedbacks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })

      // CREATE
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })

      // UPDATE
      .addCase(updateFeedbackStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (f) => f._id === action.payload._id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (f) => f._id !== action.payload
        );
      });
  },
});

export default feedbackSlice.reducer;
