import { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Paper,
  Divider,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../store/hooks';
import { updateProfile } from './profileSlice';

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    avatar: Yup.string().url('Invalid URL').nullable(),
  });

  const formik = useFormik({
    initialValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      avatar: currentUser?.avatar || '',
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(updateProfile(values));
      setIsEditing(false);
    },
  });

  const handleCancelEdit = () => {
    formik.resetForm();
    setIsEditing(false);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={formik.values.avatar || currentUser?.avatar}
              sx={{ width: 80, height: 80 }}
            />
            <Box>
              <Typography variant="h5">{currentUser?.name}</Typography>
              <Typography variant="body1" color="text.secondary">
                {currentUser?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentUser?.role}
              </Typography>
            </Box>
          </Box>
          
          {!isEditing ? (
            <IconButton onClick={() => setIsEditing(true)}>
              <EditIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={handleCancelEdit}>
                <CancelIcon color="error" />
              </IconButton>
              <IconButton 
                onClick={() => formik.handleSubmit()}
                disabled={formik.isSubmitting}
              >
                <SaveIcon color="primary" />
              </IconButton>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {isEditing ? (
          <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              id="name"
              name="name"
              label="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            
            <TextField
              fullWidth
              margin="normal"
              id="email"
              name="email"
              label="Email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            
            <TextField
              fullWidth
              margin="normal"
              id="avatar"
              name="avatar"
              label="Avatar URL"
              value={formik.values.avatar}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.avatar && Boolean(formik.errors.avatar)}
              helperText={formik.touched.avatar && formik.errors.avatar}
            />
          </Box>
        ) : (
          <Box>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Name:</strong> {currentUser?.name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Email:</strong> {currentUser?.email}
            </Typography>
            {currentUser?.avatar && (
              <Typography variant="body1">
                <strong>Avatar URL:</strong> {currentUser.avatar}
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ProfilePage;