import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // In a real application, you would send this data to a backend for authentication
    console.log('Login data:', { email, password });
    alert(`Logging in with Email: ${email}, Password: ${password}`);
    // After successful login, you would typically redirect the user
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow-md rounded-md p-6">
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Log In
          </button>
          <Link to="/register" className="inline-block align-baseline font-semibold text-blue-500 hover:text-blue-800">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;