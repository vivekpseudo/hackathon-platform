import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-white min-h-screen flex flex-col"> {/* Added flex and flex-col */}
      <Navigation />
      <main className="container mx-auto p-8 flex-grow"> {/* Added flex-grow to main */}
        {children}
      </main>
      <footer className="bg-gray-100 text-center py-4 text-sm text-gray-600">
        &copy; {new Date().getFullYear()} Innothon
      </footer>
    </div>
  );
};

export default Layout;