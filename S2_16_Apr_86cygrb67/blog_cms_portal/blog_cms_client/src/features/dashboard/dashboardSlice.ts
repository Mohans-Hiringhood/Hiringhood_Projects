import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardStats } from '../../api/dashboardApi';
import { DashboardStats } from '../../types';
import { fetchCategories } from '../categories/categoriesSlice';
import { fetchUsers } from '../users/usersSlice';
import { fetchPosts } from '../posts/postsSlice';

interface DashboardState {
  stats: DashboardStats | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  status: 'idle',
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async () => {
    const response = await getDashboardStats();
    return response;
  }
);

export const initializeDashboard = createAsyncThunk(
  'dashboard/initialize',
  async (_, { dispatch }) => {
    await Promise.all([
      dispatch(fetchPosts()),
      dispatch(fetchCategories()),
      dispatch(fetchUsers())
    ]);
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch dashboard stats';
      });
  },
});

export default dashboardSlice.reducer;