import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import useAuth from './hooks/useAuth';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import JobsList from './pages/jobs/JobsList';
import JobDetails from './pages/jobs/JobDetails';
import ProfilePage from './pages/profile/ProfilePage';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import PostJob from './pages/employer/PostJob';
import EditJob from './pages/employer/EditJob';
import EmployerJobs from './pages/employer/EmployerJobs';
import JobApplications from './pages/employer/JobApplications';
import MyApplications from './pages/jobseeker/MyApplications';
import NotFound from './pages/NotFound';

// Protected route components
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode, 
  isAllowed: boolean,
  redirectPath?: string 
}> = ({ 
  children, 
  isAllowed,
  redirectPath = '/login'
}) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const { user, loading } = useAuth();
  const isEmployer = user?.role === 'employer';
  const isJobSeeker = user?.role === 'jobSeeker';

  // If auth is still loading, don't render routes yet
  if (loading) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#f9fafb',
      }}
    >
      <Header />
      
      <Box sx={{ flexGrow: 1 }}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          
          {/* Protected routes for all authenticated users */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute isAllowed={!!user}>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          {/* Job seeker routes */}
          <Route 
            path="/applications" 
            element={
              <ProtectedRoute isAllowed={isJobSeeker}>
                <MyApplications />
              </ProtectedRoute>
            } 
          />
          
          {/* Employer routes */}
          <Route 
            path="/employer/dashboard" 
            element={
              <ProtectedRoute isAllowed={isEmployer}>
                <EmployerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employer/post-job" 
            element={
              <ProtectedRoute isAllowed={isEmployer}>
                <PostJob />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employer/jobs" 
            element={
              <ProtectedRoute isAllowed={isEmployer}>
                <EmployerJobs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employer/jobs/:id/edit" 
            element={
              <ProtectedRoute isAllowed={isEmployer}>
                <EditJob />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employer/jobs/:id/applications" 
            element={
              <ProtectedRoute isAllowed={isEmployer}>
                <JobApplications />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default App;