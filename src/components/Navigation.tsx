import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'; // Import icons

const Navigation: React.FC = () => {
  const { isAuthenticated, userRole, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-500">Innothon</Link>
        <div className="hidden md:flex items-center space-x-4"> {/* Desktop navigation */}
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

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-gray-500 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md mt-2 rounded-md p-4">
          <Link to="/" className="block py-2 hover:bg-gray-100 rounded-md text-gray-700" onClick={toggleMobileMenu}>Home</Link>
          <Link to="/hackathons" className="block py-2 hover:bg-gray-100 rounded-md text-gray-700" onClick={toggleMobileMenu}>Hackathons</Link>
          <Link to="/teams" className="block py-2 hover:bg-gray-100 rounded-md text-gray-700" onClick={toggleMobileMenu}>Teams</Link>

          {isAuthenticated && userRole === 'judge' && (
            <Link to="/judge/dashboard" className="block py-2 hover:bg-gray-100 rounded-md text-gray-700" onClick={toggleMobileMenu}>Judge Dashboard</Link>
          )}

          {isAuthenticated && userRole === 'admin' && (
            <Link to="/admin/hackathons" className="block py-2 hover:bg-gray-100 rounded-md text-gray-700" onClick={toggleMobileMenu}>Manage Hackathons</Link>
          )}

          {isAuthenticated ? (
            <button onClick={() => { logout(); toggleMobileMenu(); }} className="block py-2 hover:bg-gray-100 rounded-md text-gray-700 w-full text-left">Logout</button>
          ) : (
            <>
              <Link to="/login" className="block py-2 hover:bg-gray-100 rounded-md text-gray-700" onClick={toggleMobileMenu}>Login</Link>
              <Link to="/register" className="block py-2 hover:bg-gray-100 rounded-md text-gray-700" onClick={toggleMobileMenu}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;