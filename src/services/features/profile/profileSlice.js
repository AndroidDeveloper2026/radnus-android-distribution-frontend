import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../API/api";

export const fetchProfile = createAsyncThunk(
  "profile/fetch",
  async () => {
    const res = await API.get("/api/profile/me");
    return res.data;
  }
);

// export const updateProfile = createAsyncThunk(
//   "profile/update",
//   async ({ role, data, photo }) => {
//     const formData = new FormData();

//     Object.keys(data).forEach(key => {
//       if (data[key] !== undefined && data[key] !== null) {
//         formData.append(key, data[key]);
//       }
//     });

//     formData.append("role", role);

//     if (photo) {
//       formData.append("photo", {
//         uri: photo.uri,
//         type: photo.type || "image/jpeg",
//         name: photo.name || `photo_${Date.now()}.jpg`,
//       });
//     }

//     const res = await API.put("/api/profile/me", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return res.data;
//   }
// );

export const updateProfile = createAsyncThunk(
  "profile/update",
  async ({ role, data, photo }) => {
    const formData = new FormData();

    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    formData.append("role", role);

    if (photo) {
      formData.append("photo", {
        uri: photo.uri,
        type: photo.type,
        name: photo.name,
      });
    }

    const res = await API.put("/api/profile/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: { data: null, loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default profileSlice.reducer;