import { RootState } from '../store';
import { Contact } from '../types/contact'


interface PersistedState {
  contacts?: {
    contacts: Contact[];
  };
}

// Load state from localStorage
export const loadState = (): PersistedState | undefined => {
  try {
    const serializedState = localStorage.getItem('contactsAppState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState) as PersistedState;
  } catch (err) {
    console.warn('Failed to load state from localStorage', err);
    return undefined;
  }
};

// Save state to localStorage
export const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('contactsAppState', serializedState);
  } catch (err) {
    console.warn('Failed to save state to localStorage', err);
  }
};