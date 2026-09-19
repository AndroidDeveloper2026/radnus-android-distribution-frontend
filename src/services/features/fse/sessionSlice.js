import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../API/api';

// ─── FETCH ALL (paginated) ───────────────────────────────────────────────────
export const fetchAllSessions = createAsyncThunk(
  'session/fetchAll',
  async ({ page = 1, limit = 20, append = false } = {}, { rejectWithValue }) => {
    try {
      const res = await API.get('/api/session', { params: { page, limit } });
      // ✅ FIX: safely handle both { sessions: [...] } and [...] shapes
      const sessions = Array.isArray(res.data)
        ? res.data
        : (res.data?.sessions ?? []);
      const pagination = res.data?.pagination ?? {
        page,
        limit,
        total: sessions.length,
        totalPages: 1,
      };
      return { sessions, pagination, append };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Network error. Please try again.',
      );
    }
  },
);

// ─── FETCH NEXT PAGE (convenience for infinite scroll) ───────────────────────
export const fetchNextSessionsPage = createAsyncThunk(
  'session/fetchNextPage',
  async (_, { getState, dispatch, rejectWithValue }) => {
    const { session } = getState();
    const { pagination } = session;

    if (!pagination || pagination.page >= pagination.totalPages) {
      return rejectWithValue('No more pages');
    }

    return dispatch(
      fetchAllSessions({ page: pagination.page + 1, limit: pagination.limit, append: true }),
    ).unwrap();
  },
);

// ─── FETCH BY ID ─────────────────────────────────────────────────────────────
export const fetchSessionById = createAsyncThunk(
  'session/fetchById',
  async (sessionId, { rejectWithValue }) => {
    try {
      const res = await API.get(`/api/session/${sessionId}`);
      // ✅ FIX: handle both { session: {...} } and plain object shapes
      return res.data?.session ?? res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Network error. Please try again.',
      );
    }
  },
);

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    list: [],
    selected: null,
    listState: 'idle',   // idle | loading | success | error
    detailState: 'idle', // idle | loading | success | error
    loading: false,
    loadingMore: false,
    error: null,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 1,
    },
  },
  reducers: {
    clearSelectedSession(state) {
      state.selected = null;
      state.detailState = 'idle';
    },
    clearSessionError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // fetchAllSessions
      .addCase(fetchAllSessions.pending, (state, action) => {
        const isAppend = action.meta.arg?.append;
        if (isAppend) {
          state.loadingMore = true;
        } else {
          state.listState = 'loading';
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchAllSessions.fulfilled, (state, action) => {
        const { sessions, pagination, append } = action.payload;
        state.listState = 'success';
        state.loading = false;
        state.loadingMore = false;
        state.list = append ? [...state.list, ...sessions] : sessions;
        state.pagination = pagination;
      })
      .addCase(fetchAllSessions.rejected, (state, action) => {
        state.listState = 'error';
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload;
      })

      // fetchSessionById
      .addCase(fetchSessionById.pending, state => {
        state.detailState = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessionById.fulfilled, (state, action) => {
        state.detailState = 'success';
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchSessionById.rejected, (state, action) => {
        state.detailState = 'error';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedSession, clearSessionError } = sessionSlice.actions;
export default sessionSlice.reducer;
