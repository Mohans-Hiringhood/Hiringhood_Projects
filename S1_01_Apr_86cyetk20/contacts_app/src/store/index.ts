import { configureStore } from '@reduxjs/toolkit';
import contactsReducer, { ContactsState } from './contactsSlice';
import { loadState, saveState } from '../utils/storage';
import { debounce } from 'lodash';

export interface RootState {
  contacts: ContactsState;
}

const preloadedState = (): Partial<RootState> | undefined => {
  try {
    const loadedState = loadState();
    return loadedState ? { contacts: loadedState.contacts } : undefined;
  } catch (err) {
    console.warn('Failed to load state', err);
    return undefined;
  }
};

export const store = configureStore({
  reducer: {
    contacts: contactsReducer,
  },
  preloadedState: preloadedState(),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

store.subscribe(
  debounce(() => {
    saveState(store.getState());
  }, 1000)
);

export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;