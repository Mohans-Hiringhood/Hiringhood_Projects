import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

const AdminRoute = () => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;