import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import HackathonsPage from "./pages/HackathonsPage";
import HackathonDetailsPage from "./pages/HackathonDetailsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TeamFormationPage from "./pages/TeamFormationPage";
import SubmissionReviewPage from "./pages/SubmissionReviewPage";
import JudgeDashboardPage from "./pages/JudgeDashboardPage";
import HackathonManagementPage from "./pages/HackathonManagementPage";
import HackathonFormPage from "./pages/HackathonFormPage";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Import AuthProvider
import ProtectedRoute from "./ProtectedRoute"; // Import ProtectedRoute

import "./App.css"; // Import your CSS file

function AppRoutes() {
  const { role } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/hackathon-platform" element={<HomePage />} />
      <Route path="/hackathons" element={<HackathonsPage />} />
      <Route path="/hackathons/:id" element={<HackathonDetailsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/teams"
        element={
          <ProtectedRoute>
            <TeamFormationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/submissions/:id/review"
        element={
          <ProtectedRoute allowedRoles={["judge"]}>
            <SubmissionReviewPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/judge/dashboard"
        element={
          <ProtectedRoute allowedRoles={["judge"]}>
            <JudgeDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Hackathon Management accessible to ALL logged-in users */}
      <Route
        path="/hackathons-management"
        element={
          <ProtectedRoute>
            <HackathonManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hackathons-management/create"
        element={
          <ProtectedRoute>
            <HackathonFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hackathons-management/:id/edit"
        element={
          <ProtectedRoute>
            <HackathonFormPage />
          </ProtectedRoute>
        }
      />

      {/* Redirect any unknown paths */}
      <Route path="*" element={<Navigate to={role ? "/hackathons-management" : "/login"} />} />
    </Routes>
  );
}

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Layout>
            <AppRoutes />
          </Layout>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
