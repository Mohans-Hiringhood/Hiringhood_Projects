import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../types';
import { MOCK_CATEGORIES, MOCK_POSTS } from '../../utils/constants';
import { RootState } from '../../store/store';

// LocalStorage helper functions
const LOCAL_STORAGE_KEY = 'categories';

const loadCategoriesFromLocalStorage = (): Category[] => {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn('Failed to load categories from localStorage', e);
    return [];
  }
};

const saveCategoriesToLocalStorage = (categories: Category[]) => {
  try {
    const serializedState = JSON.stringify(categories);
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
  } catch (e) {
    console.warn('Failed to save categories to localStorage', e);
  }
};

interface CategoriesState {
  categories: Category[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CategoriesState = {
  categories: loadCategoriesFromLocalStorage(),
  status: 'idle',
  error: null,
};

// Helper function to count posts per category
const countPostsPerCategory = () => {
  return MOCK_CATEGORIES.map(category => ({
    ...category,
    postCount: MOCK_POSTS.filter(post => post.category === category.name).length
  }));
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { getState }) => {
    const state = getState() as RootState;
    
    // Return existing categories if we have them
    if (state.categories.categories.length > 0) {
      return state.categories.categories;
    }
    
    // Otherwise load mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    const categories = countPostsPerCategory();
    saveCategoriesToLocalStorage(categories);
    return categories;
  }
);

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (newCategory: Omit<Category, 'id'>, { getState }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const category = {
      ...newCategory,
      id: Math.random().toString(36).substr(2, 9),
      postCount: 0, // Initialize with 0 posts
    };
    
    const state = getState() as RootState;
    const updatedCategories = [...state.categories.categories, category];
    saveCategoriesToLocalStorage(updatedCategories);
    
    return category;
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async (updatedCategory: Category, { getState }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const state = getState() as RootState;
    const updatedCategories = state.categories.categories.map(cat => 
      cat.id === updatedCategory.id ? updatedCategory : cat
    );
    saveCategoriesToLocalStorage(updatedCategories);
    
    return updatedCategory;
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (categoryId: string, { getState }) => {
    const state = getState() as RootState;
    const category = state.categories.categories.find(c => c.id === categoryId);
    
    if (category?.postCount && category.postCount > 0) {
      throw new Error('Cannot delete category with posts');
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const updatedCategories = state.categories.categories.filter(
      category => category.id !== categoryId
    );
    saveCategoriesToLocalStorage(updatedCategories);
    
    return categoryId;
  }
);

export const selectAllCategories = (state: RootState) => state.categories.categories;

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch categories';
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (category) => category.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (category) => category.id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete category';
      });
  },
});

export default categoriesSlice.reducer;