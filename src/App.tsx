import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import HackathonsPage from './pages/HackathonsPage';
import HackathonDetailsPage from './pages/HackathonDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TeamFormationPage from './pages/TeamFormationPage';
import SubmissionReviewPage from './pages/SubmissionReviewPage';
import JudgeDashboardPage from './pages/JudgeDashboardPage';
import HackathonManagementPage from './pages/HackathonManagementPage'; // Import HackathonManagementPage
import HackathonFormPage from './pages/HackathonFormPage'; // Import HackathonFormPage

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hackathons" element={<HackathonsPage />} />
          <Route path="/hackathons/:id" element={<HackathonDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/teams" element={<TeamFormationPage />} />
          <Route path="/submissions/:id/review" element={<SubmissionReviewPage />} />
          <Route path="/judge/dashboard" element={<JudgeDashboardPage />} />
          {/* Admin Routes */}
          <Route path="/admin/hackathons" element={<HackathonManagementPage />} />
          <Route path="/admin/hackathons/create" element={<HackathonFormPage />} />
          <Route path="/admin/hackathons/:id/edit" element={<HackathonFormPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;