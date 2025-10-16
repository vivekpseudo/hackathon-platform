import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createCompetitionSubmission } from '../api/competitions';
import { toast, ToastContainer } from 'react-toastify';
import { getAuthToken, getUser } from '../libs/storageHelper';
import 'react-toastify/dist/ReactToastify.css';

interface TeamMember {
  Name: string;
  Email: string;
  Role: 'Leader' | 'Member';
}

const HackathonSubmissionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    TeamName: '',
    GitHub: '',
    Description: '',
    TeamMembers: [
      { Name: '', Email: '', Role: 'Leader' as 'Leader' | 'Member' }
    ]
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTeamMemberChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updated = [...prev.TeamMembers];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, TeamMembers: updated };
    });
  };

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      TeamMembers: [...prev.TeamMembers, { Name: '', Email: '', Role: 'Member' }]
    }));
  };

  const removeTeamMember = (index: number) => {
    if (formData.TeamMembers.length > 1) {
      setFormData(prev => ({
        ...prev,
        TeamMembers: prev.TeamMembers.filter((_, i) => i !== index)
      }));
    }
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const token = getAuthToken();
    console.log("🔑 Token exists:", !!token); // Debug
    console.log("🔑 Token value:", token?.substring(0, 20) + "..."); // Debug (first 20 chars)
    
    if (!token) {
      toast.error("You must be logged in to submit a project");
      setLoading(false);
      return;
    }

    const user = getUser();
    console.log("👤 User:", user); // Debug
    
    const userEmail = user?.email;

    const submissionData = {
      TeamName: formData.TeamName,
      GitHub: formData.GitHub,
      Description: formData.Description,
      TeamMembers: formData.TeamMembers,
    };

    console.log("📤 Submitting data:", submissionData); // Debug

    await createCompetitionSubmission(submissionData, Number(id), userEmail);

    toast.success("Submission successful!");

    setTimeout(() => {
      navigate("/hackathons-management");
    }, 2000);
  } catch (error: any) {
    console.error("❌ Submission error:", error);
    console.error("❌ Error response:", error?.response); // Debug
    console.error("❌ Error data:", error?.response?.data); // Debug
    const msg = error?.response?.data?.error?.message || error.message || "Failed to submit";
    toast.error(msg);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Submit Your Project</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Team Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.TeamName}
              onChange={(e) => handleChange('TeamName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your team name"
              required
            />
          </div>

          {/* GitHub Link */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              GitHub Repository <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={formData.GitHub}
              onChange={(e) => handleChange('GitHub', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://github.com/username/repo"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Project Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.Description}
              onChange={(e) => handleChange('Description', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={6}
              placeholder="Describe your project, its features, and technologies used..."
              required
            ></textarea>
          </div>

          {/* Team Members */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-gray-700 font-semibold">
                Team Members <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={addTeamMember}
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold"
              >
                + Add Member
              </button>
            </div>

            {formData.TeamMembers.map((member, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-700">Member {index + 1}</h3>
                  {formData.TeamMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTeamMember(index)}
                      className="text-red-500 hover:text-red-700 text-sm font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">Name</label>
                    <input
                      type="text"
                      value={member.Name}
                      onChange={(e) => handleTeamMemberChange(index, 'Name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="Member name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm mb-1">Email</label>
                    <input
                      type="email"
                      value={member.Email}
                      onChange={(e) => handleTeamMemberChange(index, 'Email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="member@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-gray-600 text-sm mb-1">Role</label>
                  <select
                    value={member.Role}
                    onChange={(e) => handleTeamMemberChange(index, 'Role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Leader">Leader</option>
                    <option value="Member">Member</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit Project'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/hackathons-management')}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HackathonSubmissionPage;