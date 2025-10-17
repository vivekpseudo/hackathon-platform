import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetCompetition } from "../hooks/useCompetitions";
import { useLocalAuth } from "../context/AuthContext";
import { 
  registerParticipant, 
  registerParticipantWithTeam, 
  createTeam,
  createCompetitionRegistration,
  uploadImage,
} from "../api/competitions";

const HackathonJoinPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const navigate = useNavigate();
  const { user } = useLocalAuth();

  const { data, isLoading, isError, error } = useGetCompetition(numericId);

  const [registrationType, setRegistrationType] = useState<"individual" | "team" | null>(null);
  const [formData, setFormData] = useState({
    name: user?.username || "",
    email: user?.email || "",
    phone: "",
    profileImage: null as File | null,
    teamName: "",
    teamLeader: "",
  });
  const [teamMembers, setTeamMembers] = useState<Array<{ name: string; email: string; phone: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) return <p>Loading hackathon details...</p>;
  if (isError) return <p>Error fetching hackathon: {error?.message || "Unknown error"}</p>;
  if (!data) return <p>No hackathon found with this ID.</p>;

  const hackathon = data?.data?.attributes || data?.attributes || data;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData(prev => ({ ...prev, profileImage: file }));
  };

  const handleAddTeamMember = () => setTeamMembers(prev => [...prev, { name: "", email: "", phone: "" }]);
  
  const handleTeamMemberChange = (index: number, field: string, value: string) => {
    setTeamMembers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };
  
  const handleRemoveTeamMember = (index: number) => setTeamMembers(prev => prev.filter((_, i) => i !== index));

  const handleJoinExistingTeam = () => {
    navigate('/teams');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registrationType) return alert("Please select a registration type");
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) 
      return alert("Please fill all required fields");
    if (registrationType === "team" && (!formData.teamName.trim() || !formData.teamLeader.trim() || teamMembers.length === 0))
      return alert("Please fill all team details and add at least one member");

    try {
      setIsSubmitting(true);

      // Upload profile image if available and get its ID
      let uploadedImageId: number | null = null;
      if (formData.profileImage) {
        const uploadedFile = await uploadImage(formData.profileImage);
        uploadedImageId = uploadedFile.id;
      }

      if (registrationType === "individual") {
        // Register individual participant
        const participantResponse = await registerParticipant({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          registrationType: "Individual",
          profileImage: uploadedImageId,
        });

        const participantId = participantResponse?.data?.data?.id || participantResponse?.data?.id;
        if (!participantId) return alert("Error: Could not create participant.");

        await createCompetitionRegistration(numericId, participantId);

      } else if (registrationType === "team") {
        // Register team leader
        const leaderResponse = await registerParticipantWithTeam({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          profileImage: uploadedImageId,
        });

        const leaderId = leaderResponse.data?.data?.id;
        if (!leaderId) return alert("Error: Could not create team leader.");

        const participantIds = [leaderId];

        // Register other team members
        for (const member of teamMembers) {
          const memberResp = await registerParticipantWithTeam(member);
          const memberId = memberResp.data?.data?.id;
          if (memberId) participantIds.push(memberId);
        }

        // Create team
        const teamResp = await createTeam({
          name: formData.teamName,
          teamLeader: leaderId,
          participantIds,
        });

        const teamId = teamResp.data?.data?.id;
        if (!teamId) return alert("Error: Could not create team.");

        await createCompetitionRegistration(numericId, leaderId, teamId);
      }

      alert("Successfully registered for the hackathon!");
      navigate(`/hackathons-management`);
    } catch (error) {
      console.error("Registration error:", error);
      alert("Error submitting registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Hackathon Header */}
      <div className="mb-8 bg-blue-50 p-6 rounded-lg border-l-4 border-blue-700">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">{hackathon?.Title || "Hackathon"}</h1>
        <div className="flex gap-6 text-gray-700">
          <p><span className="font-semibold">Starts:</span> {hackathon?.startDate ? new Date(hackathon.startDate).toLocaleDateString() : "TBA"}</p>
          <p><span className="font-semibold">Ends:</span> {hackathon?.endDate ? new Date(hackathon.endDate).toLocaleDateString() : "TBA"}</p>
        </div>
      </div>

      {/* Join Existing Team Button */}
      <div className="max-w-3xl mx-auto mb-6">
        <button
          onClick={handleJoinExistingTeam}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          Join Existing Team
        </button>
      </div>

      {/* Divider */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-gray-500 font-medium">OR</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Registration Form */}
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Registration</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Registration Type */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Registration Type</h2>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                <input type="radio" name="registrationType" value="individual" checked={registrationType === "individual"} onChange={() => setRegistrationType("individual")} className="mr-3 w-4 h-4" />
                <span className="font-semibold text-gray-800">Individual</span>
              </label>
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                <input type="radio" name="registrationType" value="team" checked={registrationType === "team"} onChange={() => setRegistrationType("team")} className="mr-3 w-4 h-4" />
                <span className="font-semibold text-gray-800">Team Member</span>
              </label>
            </div>
          </div>

          {/* Personal Info */}
          {registrationType && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" className="px-4 py-2 border rounded-lg" required />
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="px-4 py-2 border rounded-lg" required />
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" className="px-4 py-2 border rounded-lg" required />
                <div>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="px-4 py-2 border rounded-lg w-full" />
                  {formData.profileImage && <p className="text-sm text-green-600 mt-1">✓ {formData.profileImage.name}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Team Info */}
          {registrationType === "team" && (
            <div className="mb-8 bg-gray-50 p-6 rounded-lg">
              <input type="text" name="teamName" value={formData.teamName} onChange={handleInputChange} placeholder="Team Name" className="px-4 py-2 border rounded-lg mb-2 w-full" required />
              <input type="text" name="teamLeader" value={formData.teamLeader} onChange={handleInputChange} placeholder="Team Leader" className="px-4 py-2 border rounded-lg mb-4 w-full" required />

              <h3 className="font-semibold text-gray-700 mb-3">Team Members</h3>
              {teamMembers.map((member, idx) => (
                <div key={idx} className="mb-3 p-3 border rounded bg-white">
                  <input type="text" placeholder="Name" value={member.name} onChange={e => handleTeamMemberChange(idx, "name", e.target.value)} className="px-3 py-2 border rounded mb-1 w-full" />
                  <input type="email" placeholder="Email" value={member.email} onChange={e => handleTeamMemberChange(idx, "email", e.target.value)} className="px-3 py-2 border rounded mb-1 w-full" />
                  <input type="tel" placeholder="Phone" value={member.phone} onChange={e => handleTeamMemberChange(idx, "phone", e.target.value)} className="px-3 py-2 border rounded mb-2 w-full" />
                  <button type="button" onClick={() => handleRemoveTeamMember(idx)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Remove</button>
                </div>
              ))}
              <button type="button" onClick={handleAddTeamMember} className="bg-blue-500 text-white px-4 py-2 rounded">+ Add Team Member</button>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-green-500 text-white py-3 rounded hover:bg-green-600 disabled:opacity-50">
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <button type="button" onClick={() => navigate(`/hackathon/${numericId}`)} className="flex-1 bg-gray-500 text-white py-3 rounded hover:bg-gray-600">Back</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HackathonJoinPage;