import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;  // ✅ Use React.ReactNode instead of JSX.Element
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("authUser"); // Check if user is logged in

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
