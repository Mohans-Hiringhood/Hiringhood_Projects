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
  InputAdornment,
  IconButton
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Briefcase as BriefcaseBusiness } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useAuth from '../../hooks/useAuth';
import AlertMessage from '../../components/common/AlertMessage';
import LoadingSpinner from '../../components/layout/LoadingSpinner';
import { APP_NAME } from '../../config';

const Login: React.FC = () => {
  const { login, error, loading, user, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  
  // Get redirect path from location state or default to homepage
  const from = (location.state as any)?.from?.pathname || '/';
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const redirectPath = user.role === 'employer' ? '/employer/dashboard' : '/jobs';
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate]);
  
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
    }),
    onSubmit: async (values) => {
      await login(values.email, values.password);
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
          Welcome back to {APP_NAME}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sign in to access your account
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

          <Box mt={1} mb={3} textAlign="right">
            <Link component={RouterLink} to="/forgot-password" variant="body2" color="primary">
              Forgot your password?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? <LoadingSpinner size={24} message="" /> : 'Sign In'}
          </Button>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" color="primary" fontWeight="medium">
                Sign up now
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;