import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuthToken, getUser } from './libs/storageHelper';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const location = useLocation();
  const token = getAuthToken();
  const user = getUser();

  console.log(' ProtectedRoute - Auth Check:', {
    hasToken: !!token,
    hasUser: !!user,
    userBlocked: user?.blocked,
    userRole: user?.role,
    allowedRoles,
    currentPath: location.pathname
  });

  // Check if user is authenticated
  if (!token || !user) {
    console.log(' No authentication found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is blocked
  if (user.blocked) {
    console.log('User is blocked');
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Account Blocked</h1>
        <p className="text-gray-600">Your account has been blocked. Please contact support.</p>
      </div>
    );
  }

  // Check role permissions if specified
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role?.name || user.role; // Handle both object and string role
    
    if (!allowedRoles.includes(userRole)) {
      console.log('User role not allowed:', userRole);
      return (
        <div className="container mx-auto py-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      );
    }
  }

  console.log(' Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;