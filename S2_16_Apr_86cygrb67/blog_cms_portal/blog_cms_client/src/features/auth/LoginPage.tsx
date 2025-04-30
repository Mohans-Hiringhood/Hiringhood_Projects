import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../store/hooks';
import { login } from '../../api/authApi';
import { setCredentials } from './authSlice';
import { useNavigate } from 'react-router-dom';

interface LoginFormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string().required('Required'),
});

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting, setErrors }: FormikHelpers<LoginFormValues>
  ) => {
    try {
      const { user, token } = await login(values.email, values.password);
      
      // Save to localStorage (mock)
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update Redux state
      dispatch(setCredentials({ user, token }));
      
      // Redirect to dashboard
      navigate('/');
    } catch (error) {
      setErrors({ email: 'Invalid credentials', password: 'Invalid credentials' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Box
        sx={{
          width: 400,
          p: 4,
          bgcolor: 'background.paper',
          boxShadow: 1,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Login
        </Typography>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <Field
                as={TextField}
                name="email"
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <Field
                as={TextField}
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 2 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default LoginPage;