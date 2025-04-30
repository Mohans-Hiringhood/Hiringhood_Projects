import {
    Box,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
  } from '@mui/material';
  import { useFormik } from 'formik';
  import * as Yup from 'yup';
  import { Role, User } from '../../types';
  
  interface UserFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: Omit<User, 'id' | 'disabled'>) => void;
  }
  
  const UserForm = ({ open, onClose, onSubmit }: UserFormProps) => {
    const formik = useFormik({
      initialValues: {
        name: '',
        email: '',
        role: 'editor' as Role,
        avatar: '',
      },
      validationSchema: Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters'),
        role: Yup.string().required('Role is required'),
      }),
      onSubmit: (values) => {
        onSubmit(values);
      },
    });
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              id="name"
              name="name"
              label="Full Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <TextField
              margin="normal"
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formik.values.role}
                label="Role"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="editor">Editor</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              margin="normal"
              fullWidth
              id="avatar"
              name="avatar"
              label="Avatar URL (Optional)"
              value={formik.values.avatar}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => formik.handleSubmit()}
            variant="contained"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? <CircularProgress size={24} /> : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default UserForm;