import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import DashboardLayout from '../layouts/DashboardLayout';
import HomePage from '../features/dashboard/HomePage';
import PrivateRoute from '../components/PrivateRoute';
import AdminRoute from '../components/AdminRoute';
import PostsPage from '../features/posts/PostsPage';
import PostDetailPage from '../features/posts/PostDetailPage';
import PostFormPage from '../features/posts/PostFormPage';
import CategoriesPage from '../features/categories/CategoriesPage';
import UsersPage from '../features/users/UsersPage';
import ProfilePage from '../features/profile/ProfilePage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<HomePage />} />
          <Route path="categories" element={<CategoriesPage />} />
          
          {/* Posts Routes */}
          <Route path="posts">
            <Route index element={<PostsPage />} />
            <Route path="new" element={<PostFormPage />} />
            <Route path=":postId" element={<PostDetailPage />} />
            <Route path=":postId/edit" element={<PostFormPage />} />
          </Route>

          <Route path="profile" element={<ProfilePage />} />

          {/* Admin-only Routes */}
          <Route element={<AdminRoute />}>
            <Route path="users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback Routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;