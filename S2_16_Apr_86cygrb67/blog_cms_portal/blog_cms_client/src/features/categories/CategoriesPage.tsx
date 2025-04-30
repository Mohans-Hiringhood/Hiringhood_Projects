import { useState } from 'react';
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
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from './categoriesSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryForm from './CategoryForm';
import { Category } from '../../types';

const CategoriesPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { categories, status, error } = useAppSelector((state) => state.categories);
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOpenForm = (category: Category | null = null) => {
    setCurrentCategory(category);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setCurrentCategory(null);
  };

  const handleSubmit = async (categoryData: Omit<Category, 'id'> | Category) => {
    try {
      if ('id' in categoryData) {
        await dispatch(updateCategory(categoryData)).unwrap();
        setSnackbar({
          open: true,
          message: 'Category updated successfully',
          severity: 'success',
        });
      } else {
        await dispatch(addCategory(categoryData)).unwrap();
        setSnackbar({
          open: true,
          message: 'Category added successfully',
          severity: 'success',
        });
      }
      handleCloseForm();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to save category',
        severity: 'error',
      });
    }
  };

  const handleDeleteClick = (category: Category) => {
    setCurrentCategory(category);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (currentCategory) {
      try {
        await dispatch(deleteCategory(currentCategory.id)).unwrap();
        setSnackbar({
          open: true,
          message: 'Category deleted successfully',
          severity: 'success',
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.message || 'Failed to delete category',
          severity: 'error',
        });
      }
      setOpenDeleteDialog(false);
      setCurrentCategory(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (status === 'loading') {
    return <Typography>Loading categories...</Typography>;
  }

  if (status === 'failed') {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Categories Management
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Add Category
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Posts</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>{category.postCount || 0}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleOpenForm(category)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteClick(category)}
                    disabled={!!category.postCount}
                  >
                    <DeleteIcon color={category.postCount ? 'disabled' : 'error'} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openForm} onClose={handleCloseForm}>
        <DialogTitle>
          {currentCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <CategoryForm
            category={currentCategory}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {currentCategory?.postCount
              ? `Cannot delete "${currentCategory.name}" because it has ${currentCategory.postCount} posts.`
              : `Are you sure you want to delete "${currentCategory?.name}"?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={!!currentCategory?.postCount}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoriesPage;