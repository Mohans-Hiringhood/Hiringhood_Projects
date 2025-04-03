import { configureStore } from '@reduxjs/toolkit';
import recipesReducer from './recipesSlice';
import localStorageMiddleware, { loadState } from './persistenceMiddleware';

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    recipes: recipesReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(localStorageMiddleware),
  preloadedState: persistedState ? { recipes: persistedState } : undefined
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;