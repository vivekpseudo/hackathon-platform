import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import HackathonsPage from "./pages/HackathonsPage"; // public listing
import HackathonDetailsPage from "./pages/HackathonDetailsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TeamFormationPage from "./pages/TeamFormationPage";
import SubmissionReviewPage from "./pages/SubmissionReviewPage";
import JudgeDashboardPage from "./pages/JudgeDashboardPage";
import AdminHackathonsPage from "./pages/AdminHackathonsPage"; // manage hackathons
import HackathonFormPage from "./pages/HackathonFormPage";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

import "./App.css";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/hackathon-platform" element={<HomePage />} />
              <Route path="/hackathons" element={<HackathonsPage />} />
              <Route path="/hackathons/:id" element={<HackathonDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected routes */}
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

              {/* Manage Hackathons page for logged-in users */}
              <Route
                path="/hackathons-management"
                element={
                  <ProtectedRoute>
                    <AdminHackathonsPage />
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
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
