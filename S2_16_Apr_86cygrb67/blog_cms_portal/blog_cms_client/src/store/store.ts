import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import postsReducer from '../features/posts/postsSlice';
import categoriesReducer from '../features/categories/categoriesSlice';
import usersReducer from '../features/users/usersSlice';
import profileReducer from '../features/profile/profileSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    posts: postsReducer,
    categories: categoriesReducer,
    users: usersReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;