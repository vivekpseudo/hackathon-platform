import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import ProtectedRoute from "./ProtectedRoute"; // Import ProtectedRoute

import "./App.css"; // Import your CSS file

function App() {
  return (
    <AuthProvider>
      {" "}
      {/* Wrap the Router with AuthProvider */}
      <Router>
        <Layout>
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
            <Route
              path="/admin/hackathons"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <HackathonManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/hackathons/create"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <HackathonFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/hackathons/:id/edit"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <HackathonFormPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
