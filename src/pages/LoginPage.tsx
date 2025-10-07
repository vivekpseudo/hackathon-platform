import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const authMutation = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    authMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          console.log("Login successful:", data);
          if (data.user.role === "judge") navigate("/judge/dashboard");
          else if (data.user.isOrganizer) navigate("/hackathons-management");
          else navigate("/hackathons");
        },
        onError: (err) => {
          console.error("Login failed:", err);
          alert("Login failed. Please check your credentials.");
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
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={authMutation.isLoading} 
            className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              authMutation.isLoading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-blue-500 hover:bg-blue-700 text-white"
            }`}
          >
            {authMutation.isLoading ? "Logging in..." : "Log In"}
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

