import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const Navigation: React.FC = () => {
  const { isAuthenticated, userRole, logout } = useAuth(); // Get auth context

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-500">Innothon</Link>
        <div>
          <Link to="/" className="px-4 hover:text-blue-500 text-gray-700">Home</Link>
          <Link to="/hackathons" className="px-4 hover:text-blue-500 text-gray-700">Hackathons</Link>
          <Link to="/teams" className="px-4 hover:text-blue-500 text-gray-700">Teams</Link>

          {isAuthenticated && userRole === 'judge' && (
            <Link to="/judge/dashboard" className="px-4 hover:text-blue-500 text-gray-700">Judge Dashboard</Link>
          )}

          {isAuthenticated && userRole === 'admin' && (
            <Link to="/admin/hackathons" className="px-4 hover:text-blue-500 text-gray-700">Manage Hackathons</Link>
          )}

          {isAuthenticated ? (
            <button onClick={logout} className="px-4 hover:text-blue-500 text-gray-700">Logout</button>
          ) : (
            <>
              <Link to="/login" className="px-4 hover:text-blue-500 text-gray-700">Login</Link>
              <Link to="/register" className="px-4 hover:text-blue-500 text-gray-700">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;