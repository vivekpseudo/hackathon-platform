import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useLocalAuth } from "../context/AuthContext";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate } = useAuth(); // Get the login function
  const navigate = useNavigate();
  const { login } = useLocalAuth();

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    mutate(
      { email, password },
      {
        onSuccess: (data) => {
          login(data.user.isOrganizer ? "admin" : "user"); // Update context with user role
          // Redirect based on role
          if (data.user.isOrganizer) {
            navigate("/admin/hackathons");
          } else if (data.user.role === "judge") {
            navigate("/judge/dashboard");
          } else {
            navigate("/");
          }
        },
        onError: (error) => {
          // Handle login error (e.g., show a message)
          console.error("Login failed:", error);
          alert("Login failed. Please check your credentials and try again.");
        },
      }
    );
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Login</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white shadow-md rounded-md p-6"
      >
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
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
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
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
          <Link
            to="/register"
            className="inline-block align-baseline font-semibold text-blue-500 hover:text-blue-800"
          >
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
