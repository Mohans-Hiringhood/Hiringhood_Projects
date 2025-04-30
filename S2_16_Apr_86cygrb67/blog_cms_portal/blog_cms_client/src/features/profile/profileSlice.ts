import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../types';

interface ProfileState {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProfileState = {
  user: null,
  status: 'idle',
  error: null,
};

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, this would be an API call
    return userId;
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (updatedUser: Partial<User>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, this would be an API call
    return updatedUser;
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // In a real app, you would set the user data from the API response
        // For now, we'll just mark it as loaded
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch profile';
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
        }
      });
  },
});

export default profileSlice.reducer;