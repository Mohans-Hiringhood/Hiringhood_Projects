import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Divider, 
  Link,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  InputAdornment,
  IconButton,
  Collapse
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Briefcase as BriefcaseBusiness } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useAuth from '../../hooks/useAuth';
import AlertMessage from '../../components/common/AlertMessage';
import LoadingSpinner from '../../components/layout/LoadingSpinner';
import { APP_NAME } from '../../config';

const Register: React.FC = () => {
  const { register, error, loading, user, clearError } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const redirectPath = user.role === 'employer' ? '/employer/dashboard' : '/jobs';
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: 'jobSeeker',
      company: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
      role: Yup.string()
        .oneOf(['jobSeeker', 'employer'], 'Invalid role')
        .required('Role is required'),
      company: Yup.string().when('role', {
        is: 'employer',
        then: (schema) => schema.required('Company name is required'),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    onSubmit: async (values) => {
      await register(values);
    },
  });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm">
      <Box my={5} textAlign="center">
        <Box display="flex" justifyContent="center" mb={2}>
          <BriefcaseBusiness size={40} color="#3b82f6" />
        </Box>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Create your {APP_NAME} account
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Join our platform to find jobs or hire talent
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {error && (
          <AlertMessage
            severity="error"
            message={error}
            onClose={clearError}
          />
        )}

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Full Name"
            variant="outlined"
            margin="normal"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            disabled={loading}
          />

          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            variant="outlined"
            margin="normal"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            disabled={loading}
          />

          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControl component="fieldset" margin="normal" fullWidth>
            <FormLabel component="legend">I want to</FormLabel>
            <RadioGroup
              row
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
            >
              <FormControlLabel 
                value="jobSeeker" 
                control={<Radio />} 
                label="Find a job" 
              />
              <FormControlLabel 
                value="employer" 
                control={<Radio />} 
                label="Hire talent" 
              />
            </RadioGroup>
          </FormControl>

          <Collapse in={formik.values.role === 'employer'}>
            <TextField
              fullWidth
              id="company"
              name="company"
              label="Company Name"
              variant="outlined"
              margin="normal"
              value={formik.values.company}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.company && Boolean(formik.errors.company)}
              helperText={formik.touched.company && formik.errors.company}
              disabled={loading}
            />
          </Collapse>

          <Box mt={3}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? <LoadingSpinner size={24} message="" /> : 'Create Account'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" color="primary" fontWeight="medium">
                Sign in
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;