import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectPostById, addPost, updatePost } from './postsSlice';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { selectAllCategories } from './postsSlice';

const PostFormPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const DRAFT_KEY = `post-draft-${postId || 'new'}`;
  const isEditing = !!postId;
  const post = useAppSelector((state) => selectPostById(state, postId || ''));
  const [tagInput, setTagInput] = useState('');
  const categories = useAppSelector(selectAllCategories);
  const { status } = useAppSelector((state) => state.posts);

  const formik = useFormik({
    initialValues: {
      title: post?.title || '',
      content: post?.content || '',
      category: post?.category || '',
      tags: post?.tags || [],
      status: post?.status || 'draft',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Required').min(5, 'Too short'),
      content: Yup.string().required('Required').min(20, 'Too short'),
      category: Yup.string().required('Required'),
      status: Yup.string().required('Required'),
      tags: Yup.array().of(Yup.string().min(2, 'Tag too short')),
    }),
    onSubmit: async (values) => {
      try {
        if (isEditing && post) {
          await dispatch(updatePost({
            ...post,
            ...values,
            updatedAt: new Date().toISOString(),
          })).unwrap();
        } else {
          await dispatch(addPost({
            title: values.title,
            content: values.content,
            category: values.category,
            tags: values.tags,
            status: values.status,
            author: {
              id: '',
              name: '',
              email: '',
              password: undefined,
              role: 'admin',
              avatar: undefined,
              disabled: undefined,
              lastLogin: undefined
            }
          })).unwrap();
        }

        if (!isEditing) {
          localStorage.removeItem(DRAFT_KEY);
        }
        navigate('/posts');
      } catch (error) {
        console.error('Failed to save post:', error);
      }
    },
  });

  useEffect(() => {
    if (!isEditing) {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        const confirmLoad = window.confirm('Do you want to restore your unsaved draft?');
        if (confirmLoad) {
          formik.setValues(JSON.parse(savedDraft));
        } else {
          localStorage.removeItem(DRAFT_KEY);
        }
      }
    }
  }, [isEditing, DRAFT_KEY]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isEditing && (formik.dirty || formik.values.status === 'draft')) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formik.values));
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [formik.values, formik.dirty, isEditing, DRAFT_KEY]);

  const handleAddTag = () => {
    if (tagInput && !formik.values.tags.includes(tagInput)) {
      formik.setFieldValue('tags', [...formik.values.tags, tagInput]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    formik.setFieldValue(
      'tags',
      formik.values.tags.filter((tag: string) => tag !== tagToRemove)
    );
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Typography variant="h4" component="h1" gutterBottom>
        {isEditing ? 'Edit Post' : 'Create New Post'}
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            id="content"
            name="content"
            label="Content"
            multiline
            rows={10}
            value={formik.values.content}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.content && Boolean(formik.errors.content)}
            helperText={formik.touched.content && formik.errors.content}
            sx={{ mb: 3 }}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formik.values.category}
              label="Category"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.category && Boolean(formik.errors.category)}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              name="status"
              value={formik.values.status}
              label="Status"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.status && Boolean(formik.errors.status)}
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
              {formik.values.tags.map((tag: string) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag and press Enter"
              />
              <Button
                variant="outlined"
                onClick={handleAddTag}
                disabled={!tagInput}
              >
                Add
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/posts')}
              disabled={status === 'loading'}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={status === 'loading' || !formik.dirty}
            >
              {status === 'loading' ? (
                <CircularProgress size={24} />
              ) : isEditing ? (
                'Update Post'
              ) : (
                'Create Post'
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default PostFormPage;