import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { checkAuth } from '../api/authApi';

const PrivateRoute = () => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const isAuthenticated = user || checkAuth();

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;