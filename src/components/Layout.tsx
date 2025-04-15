import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
      <div className="bg-white min-h-screen"> {/* Changed background to white */}
        <Navigation />
        <main className="container mx-auto py-8">
          {children}
        </main>
        <footer className="bg-gray-100 text-center py-4 text-sm text-gray-600"> {/* Adjusted footer background */}
          &copy; {new Date().getFullYear()} Hackathon Platform
        </footer>
      </div>
    );
  };

export default Layout;