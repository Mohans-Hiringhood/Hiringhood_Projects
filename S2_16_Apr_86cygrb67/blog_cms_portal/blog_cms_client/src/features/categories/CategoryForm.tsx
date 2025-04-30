import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { Category } from '../../types';

interface CategoryFormProps {
  category: Category | null;
  onSubmit: (values: Omit<Category, 'id'> | Category) => void;
  onCancel: () => void;
}

const CategoryForm = ({ category, onSubmit, onCancel }: CategoryFormProps) => {
  const formik = useFormik({
    initialValues: {
      name: category?.name || '',
      slug: category?.slug || '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Required')
        .max(50, 'Must be 50 characters or less'),
      slug: Yup.string()
        .required('Required')
        .matches(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
    }),
    onSubmit: (values) => {
      const categoryData = category
        ? { ...values, id: category.id }
        : values;
      onSubmit(categoryData);
    },
  });

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{ mt: 1, minWidth: 400 }}
    >
      <TextField
        fullWidth
        id="name"
        name="name"
        label="Category Name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        id="slug"
        name="slug"
        label="Slug"
        value={formik.values.slug}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.slug && Boolean(formik.errors.slug)}
        helperText={
          formik.touched.slug && formik.errors.slug
            ? formik.errors.slug
            : 'URL-friendly version of the name'
        }
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? (
            <CircularProgress size={24} />
          ) : category ? (
            'Update Category'
          ) : (
            'Add Category'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default CategoryForm;