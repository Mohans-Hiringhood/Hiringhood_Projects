import { Box } from '@mui/material';
import Header from '../components/Header';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

const DashboardLayout = () => {
  const { user } = useAppSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flex: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;