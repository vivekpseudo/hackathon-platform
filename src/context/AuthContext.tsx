import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuthToken as rawGetAuthToken, logout as logoutHelper } from '../libs/storageHelper';
import { setAuthToken as setAxiosAuthToken, removeAuthToken } from '../libs/axios';

// Safe localStorage parsing
const safeParse = (value: string | null) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

// Wrapper functions
const getAuthToken = () => rawGetAuthToken();
const getUser = () => safeParse(localStorage.getItem('USER'));
const getUserRole = () => safeParse(localStorage.getItem('ROLE'));
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuthToken as rawGetAuthToken, logout as logoutHelper } from '../libs/storageHelper';
import { setAuthToken as setAxiosAuthToken, removeAuthToken } from '../libs/axios';

// Safe localStorage parsing
const safeParse = (value: string | null) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

// Wrapper functions
const getAuthToken = () => rawGetAuthToken();
const getUser = () => safeParse(localStorage.getItem('USER'));
const getUserRole = () => safeParse(localStorage.getItem('ROLE'));

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  user: any | null;
  login: (userData: any, token: string, role: string) => void;
  user: any | null;
  login: (userData: any, token: string, role: string) => void;
  logout: () => void;
  checkAuth: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  // Check authentication status from localStorage
  const checkAuth = () => {
    const token = getAuthToken();
    const storedUser = getUser();
    const storedRole = getUserRole();

    console.log('AuthContext - Checking auth:', { hasToken: !!token, hasUser: !!storedUser, role: storedRole });

    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
      setUserRole(storedRole || 'user'); // default role if missing
      setAxiosAuthToken(token);

      console.log('User authenticated:', storedUser.email || storedUser.username);
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
      console.log('No authentication found');
    }
  };

  const login = (userData: any, token: string, role: string): void => {
    console.log('AuthContext - Logging in user:', userData.email || userData.username);

    // Save to localStorage
    localStorage.setItem('AUTH_TOKEN', token);
    localStorage.setItem('USER', JSON.stringify(userData));
    localStorage.setItem('ROLE', JSON.stringify(role));

    setIsAuthenticated(true);
    setUser(userData);
    setUser(userData);
    setUserRole(role);
    setAxiosAuthToken(token);

    setAxiosAuthToken(token);

    console.log('User logged in with role:', role);
  };

  const logout = (): void => {
    console.log('AuthContext - Logging out user');
    logoutHelper(); // clear localStorage
    removeAuthToken();

    setIsAuthenticated(false);
    setUser(null);
    setUser(null);
    setUserRole(null);


    console.log('User logged out');

    window.location.href = '/login';
  };

  useEffect(() => {
    checkAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (['AUTH_TOKEN', 'USER', 'ROLE'].includes(e.key || '')) {
        console.log('Storage changed, rechecking auth');
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    userRole,
    user,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useLocalAuth = () => {
export const useLocalAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useLocalAuth must be used within an AuthProvider');
  if (!context) throw new Error('useLocalAuth must be used within an AuthProvider');
  return context;
};
