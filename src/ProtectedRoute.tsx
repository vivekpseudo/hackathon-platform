import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useLocalAuth } from './context/AuthContext';
import useUser from './hooks/useUser';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { getCurrentUser } = useUser();
  const {isPending, isSuccess, data: userData } = getCurrentUser;
  const location = useLocation();

  if (!isPending && (!isSuccess || userData.blocked)) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // if (allowedRoles && !allowedRoles.includes(userRole as string)) {
  //   // Redirect to a forbidden page or homepage if role is not allowed
  //   return <Navigate to="/forbidden" replace />; // You might want to create a Forbidden page
  // }

  return <>{children}</>;
};

export default ProtectedRoute;