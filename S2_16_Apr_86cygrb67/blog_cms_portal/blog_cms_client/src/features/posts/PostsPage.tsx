import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPosts, selectFilteredPosts, setFilters, setPagination, deletePost } from './postsSlice';
import { selectAllCategories } from '../categories/categoriesSlice';
import { fetchUsers, selectAllUsers } from '../users/usersSlice'; // Import from your users slice
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/dateUtils';
import ConfirmDialog from '../../components/ConfirmDialog';

const PostsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error, filters, pagination } = useAppSelector((state) => state.posts);
  const filteredPosts = useAppSelector(selectFilteredPosts);
  const categories = useAppSelector(selectAllCategories);
  const users = useAppSelector(selectAllUsers); // Get users from Redux store
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  // Fetch posts and initialize filters
  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(setFilters({ category: '', status: '', author: '' }));
  }, [dispatch]);

  // Fetch users if not already loaded
  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(setPagination({ page: newPage }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPagination({ rowsPerPage: parseInt(event.target.value, 10), page: 0 }));
  };

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    dispatch(setFilters({ [filterName]: value }));
  };

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (postToDelete) {
      try {
        await dispatch(deletePost(postToDelete)).unwrap();
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
    setOpenDeleteDialog(false);
  };

  if (status === 'loading' && !filteredPosts.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">
          Error loading posts: {error}
          <Button onClick={() => dispatch(fetchPosts())} sx={{ ml: 2 }}>
            Retry
          </Button>
        </Typography>
      </Box>
    );
  }

  if (filteredPosts.length === 0 && status === 'succeeded') {
    const hasFilters = Object.values(filters).some(val => val !== '');
    return (
      <Box textAlign="center" p={4}>
        <Typography variant="h6">
          {hasFilters ? 'No posts match your filters' : 'No posts found'}
        </Typography>
        {hasFilters && (
          <Button
            onClick={() => dispatch(setFilters({ category: '', status: '', author: '' }))}
            sx={{ mt: 1 }}
          >
            Clear Filters
          </Button>
        )}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/posts/new')}
          sx={{ mt: 2 }}
        >
          Create New Post
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Posts Management
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {/* Category filter */}
          <TextField
            select
            label="Category"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            sx={{ minWidth: 150 }}
            size="small"
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Status filter */}
          <TextField
            select
            label="Status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            sx={{ minWidth: 150 }}
            size="small"
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="published">Published</MenuItem>
          </TextField>

          {/* Author filter - now using real users */}
          <TextField
            select
            label="Author"
            value={filters.author}
            onChange={(e) => handleFilterChange('author', e.target.value)}
            sx={{ minWidth: 150 }}
            size="small"
          >
            <MenuItem value="">All Authors</MenuItem>
            {users
              .filter(user => !user.disabled) // Only show active users
              .map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
          </TextField>
        </Box>
      </Paper>

      {/* Rest of your component remains the same */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/posts/new')}
        >
          New Post
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Published</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPosts
              .slice(
                pagination.page * pagination.rowsPerPage,
                pagination.page * pagination.rowsPerPage + pagination.rowsPerPage
              )
              .map((post) => {
                const postAuthor = users.find(user => user.id === post.authorId);
                return (
                  <TableRow key={post.id}>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>{postAuthor?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      <Chip
                        label={post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        color={post.status === 'published' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(post.createdAt)}</TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="view"
                        onClick={() => navigate(`/posts/${post.id}`)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        aria-label="edit"
                        onClick={() => navigate(`/posts/${post.id}/edit`)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteClick(post.id)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredPosts.length}
        rowsPerPage={pagination.rowsPerPage}
        page={pagination.page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Post"
        content="Are you sure you want to delete this post? This action cannot be undone."
      />
    </Box>
  );
};

export default PostsPage;