import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Post, MOCK_POSTS, MOCK_USERS } from '../../utils/constants';
import { RootState } from '../../store/store';

interface PostsState {
  posts: Post[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: {
    category: string;
    status: string;
    author: string;
  };
  pagination: {
    page: number;
    rowsPerPage: number;
  };
}

// Helper function to load posts from localStorage
const loadPostsFromStorage = (): Post[] => {
  try {
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts);
      // Merge with mock posts if localStorage is empty
      return parsedPosts.length > 0 ? parsedPosts : MOCK_POSTS;
    }
    return MOCK_POSTS;
  } catch (error) {
    console.error('Failed to parse posts from localStorage', error);
    return MOCK_POSTS;
  }
};

const initialState: PostsState = {
  posts: loadPostsFromStorage(),
  status: 'idle',
  error: null,
  filters: {
    category: '',
    status: '',
    author: '',
  },
  pagination: {
    page: 0,
    rowsPerPage: 10,
  },
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return loadPostsFromStorage();
});

export const addPost = createAsyncThunk(
  'posts/addPost',
  async (newPost: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>, { getState }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const state = getState() as RootState;
    
    const post: Post = {
      ...newPost,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: state.auth.user || MOCK_USERS[0],
    };
    return post;
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async (updatedPost: Post) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      ...updatedPost,
      updatedAt: new Date().toISOString(),
    };
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return postId;
  }
);

export const selectPostById = (state: RootState, postId: string) => {
  return state.posts.posts.find(post => post.id === postId);
};

export const selectAllCategories = (state: RootState) => {
  return state.categories.categories;
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<PostsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 0;
    },
    setPagination: (state, action: PayloadAction<Partial<PostsState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    // Add new reducer to sync with localStorage
    syncPostsWithStorage: (state) => {
      localStorage.setItem('posts', JSON.stringify(state.posts));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch posts';
      })
      .addCase(addPost.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts.unshift(action.payload);
        localStorage.setItem('posts', JSON.stringify(state.posts));
      })
      .addCase(addPost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to add post';
      })
      .addCase(updatePost.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.posts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        localStorage.setItem('posts', JSON.stringify(state.posts));
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update post';
      })
      .addCase(deletePost.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = state.posts.filter(post => post.id !== action.payload);
        localStorage.setItem('posts', JSON.stringify(state.posts));
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete post';
      });
  },
});

export const { setFilters, setPagination, syncPostsWithStorage } = postsSlice.actions;

export const selectFilteredPosts = (state: RootState) => {
  const { posts, filters } = state.posts;
  return posts.filter(post => {
    return (
      (filters.category === '' || post.category === filters.category) &&
      (filters.status === '' || post.status === filters.status) &&
      (filters.author === '' || post.author.id === filters.author)
    );
  });
};

export default postsSlice.reducer;