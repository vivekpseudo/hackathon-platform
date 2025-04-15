import React from 'react';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
    return (
      <nav className="bg-white shadow-md py-4"> {/* Changed background to white and added shadow */}
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-blue-500">Hackathon Platform</Link> {/* Darker logo text */}
          <div>
            <Link to="/" className="px-4 hover:text-blue-500 text-gray-700">Home</Link> {/* Darker text */}
            <Link to="/hackathons" className="px-4 hover:text-blue-500 text-gray-700">Hackathons</Link>
            <Link to="/teams" className="px-4 hover:text-blue-500 text-gray-700">Teams</Link>
            <Link to="/judge/dashboard" className="px-4 hover:text-blue-500 text-gray-700">Judge Dashboard</Link>
            <Link to="/admin/hackathons" className="px-4 hover:text-blue-500 text-gray-700">Manage Hackathons</Link>
            <Link to="/login" className="px-4 hover:text-blue-500 text-gray-700">Login</Link>
            <Link to="/register" className="px-4 hover:text-blue-500 text-gray-700">Register</Link>
          </div>
        </div>
      </nav>
    );
  };

export default Navigation;