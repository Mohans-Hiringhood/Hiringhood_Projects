import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User, Role } from '../../types';
import { MOCK_USERS } from '../../utils/constants';
import { RootState } from '../../store/store';

const USERS_STORAGE_KEY = 'blog-cms-users';

const loadUsersFromStorage = (): User[] => {
  try {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    return storedUsers ? JSON.parse(storedUsers) : MOCK_USERS;
  } catch (error) {
    console.error('Failed to parse users from localStorage', error);
    return MOCK_USERS;
  }
};

const saveUsersToStorage = (users: User[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

interface UsersState {
  users: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UsersState = {
  users: loadUsersFromStorage(),
  status: 'idle',
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return loadUsersFromStorage();
  }
);

export const updateUserRole = createAsyncThunk(
  'users/updateUserRole',
  async ({ userId, role }: { userId: string; role: Role }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { userId, role };
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: string, { getState }) => {
    const state = getState() as RootState;
    const currentUser = state.auth.user;
    
    if (currentUser?.id === userId) {
      throw new Error('You cannot delete your own account');
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return userId;
  }
);

export const selectAllUsers = (state: RootState) => state.users.users;

export const toggleUserStatus = createAsyncThunk(
  'users/toggleUserStatus',
  async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return userId;
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (newUser: Omit<User, 'id' | 'disabled'> & { password: string }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const user = {
      ...newUser,
      id: Math.random().toString(36).substr(2, 9),
      disabled: false
    };
    return user;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
        saveUsersToStorage(state.users);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create user';
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const { userId, role } = action.payload;
        const user = state.users.find(user => user.id === userId);
        if (user) {
          user.role = role;
          saveUsersToStorage(state.users);
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
        saveUsersToStorage(state.users); // Update localStorage
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete user';
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const user = state.users.find(user => user.id === action.payload);
        if (user) {
          user.disabled = !user.disabled;
          saveUsersToStorage(state.users);
        }
      });
  },
});

export default usersSlice.reducer;