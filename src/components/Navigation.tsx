import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocalAuth } from "../context/AuthContext";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

interface MenuItem {
  label: string;
  to: string;
  roles?: string[]; // Optional array of roles
}

const Navigation: React.FC = () => {
  const { isAuthenticated, userRole, logout } = useLocalAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Define navigation items
  const menuItems: MenuItem[] = [
    { label: "Home", to: "/" },
    { label: "Hackathons", to: "/hackathons" },
    { label: "Teams", to: "/teams", roles: ["user", "admin", "judge"] },
    { label: "Judge Dashboard", to: "/judge/dashboard", roles: ["judge"] },
    { label: "Manage Hackathons", to: "/hackathons-management", roles: ["user", "admin", "judge"] },
  ];

  // Filter menu items based on role
  const filteredMenuItems = menuItems.filter(
    (item) => !item.roles || (isAuthenticated && item.roles.includes(userRole!))
  );

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-500 grid grid-flow-col gap-2">
          <span className="sr-only">InnoThon</span>
          <img className="h-12 w-auto bg-orange-100 rounded" src="logo.png" alt="logo" />
          <div className="text-3xl content-center">InnoThon</div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {filteredMenuItems.map((item) => (
            <Link key={item.to} to={item.to} className="px-4 hover:text-blue-500 text-gray-700">
              {item.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <button onClick={logout} className="px-4 hover:text-blue-500 text-gray-700">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="px-4 hover:text-blue-500 text-gray-700">Login</Link>
              <Link to="/register" className="px-4 hover:text-blue-500 text-gray-700">Register</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-500 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white mt-2 rounded-md p-4 space-y-2">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="block py-2 hover:bg-gray-100 rounded-md text-gray-700"
              onClick={toggleMobileMenu}
            >
              {item.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                toggleMobileMenu();
              }}
              className="block py-2 hover:bg-gray-100 rounded-md text-gray-700 w-full text-left"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="block py-2 hover:bg-gray-100 rounded-md text-gray-700" onClick={toggleMobileMenu}>
                Login
              </Link>
              <Link to="/register" className="block py-2 hover:bg-gray-100 rounded-md text-gray-700" onClick={toggleMobileMenu}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;

