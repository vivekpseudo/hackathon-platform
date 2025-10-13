import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetCompetition } from "../hooks/useCompetitions";
import { useLocalAuth } from "../context/AuthContext";
import { registerParticipant, registerParticipantWithTeam, createTeam } from "../api/competitions";

const HackathonJoinPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const navigate = useNavigate();
  const { user } = useLocalAuth();

  const { data, isLoading, isError, error } = useGetCompetition(numericId);

  // Form states
  const [registrationType, setRegistrationType] = useState<"individual" | "team" | null>(null);
  const [formData, setFormData] = useState({
    name: user?.username || "",
    email: user?.email || "",
    phone: "",
    profileImage: null as File | null,
    teamName: "",
    teamLeader: "",
  });
  const [teamMembers, setTeamMembers] = useState<Array<{
    name: string;
    email: string;
    phone: string;
  }>>([]);
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
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }));
    }
  };

  const handleAddTeamMember = () => {
    setTeamMembers(prev => [...prev, { name: "", email: "", phone: "" }]);
  };

  const handleTeamMemberChange = (index: number, field: string, value: string) => {
    setTeamMembers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveTeamMember = (index: number) => {
    setTeamMembers(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registrationType) {
      alert("Please select a registration type");
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    if (registrationType === "team") {
      if (!formData.teamName.trim() || !formData.teamLeader.trim()) {
        alert("Please enter team name and team leader");
        return;
      }
      if (teamMembers.length === 0) {
        alert("Please add at least one team member");
        return;
      }
    }

    try {
      setIsSubmitting(true);

      if (registrationType === "individual") {
        // Individual registration
        await registerParticipant({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          registrationType: "Individual",
        });
        
      } else if (registrationType === "team") {
        // Team registration - first create team, then add participants
        
        // Step 1: Register team leader as participant
        const leaderResponse = await registerParticipantWithTeam({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        });
        
        const leaderId = leaderResponse.data?.data?.id;
        console.log("Team leader registered with ID:", leaderId);

        // Step 2: Register other team members
        const participantIds = [leaderId];
        
        for (const member of teamMembers) {
          const memberResponse = await registerParticipantWithTeam({
            name: member.name,
            email: member.email,
            phone: member.phone,
          });
          const memberId = memberResponse.data?.data?.id;
          participantIds.push(memberId);
          console.log("Team member registered with ID:", memberId);
        }

        // Step 3: Create team with all participants
        await createTeam({
          name: formData.teamName,
          teamLeader: leaderId,
          participantIds: participantIds,
        });
      }

      alert("Successfully registered for the hackathon!");
      navigate(`/hackathon/${numericId}`);
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
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          {hackathon?.Title || "Hackathon"}
        </h1>
        <div className="flex gap-6 text-gray-700">
          <p>
            <span className="font-semibold">Starts:</span> {hackathon?.startDate ? new Date(hackathon.startDate).toLocaleDateString() : "TBA"}
          </p>
          <p>
            <span className="font-semibold">Ends:</span> {hackathon?.endDate ? new Date(hackathon.endDate).toLocaleDateString() : "TBA"}
          </p>
        </div>
      </div>

      {/* Join Button */}
      <div className="mb-8">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
        >
          Join Existing Team
        </button>
      </div>

      {/* Registration Form */}
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <form onSubmit={handleSubmit}>
          {/* Registration Type Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Registration Type</h2>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                <input
                  type="radio"
                  name="registrationType"
                  value="individual"
                  checked={registrationType === "individual"}
                  onChange={() => setRegistrationType("individual")}
                  className="mr-3 w-4 h-4"
                />
                <span className="font-semibold text-gray-800">Individual</span>
              </label>

              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                <input
                  type="radio"
                  name="registrationType"
                  value="team"
                  checked={registrationType === "team"}
                  onChange={() => setRegistrationType("team")}
                  className="mr-3 w-4 h-4"
                />
                <span className="font-semibold text-gray-800">Team Member</span>
              </label>
            </div>
          </div>

          {/* Personal Information */}
          {registrationType && (
            <>
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Team Information - Show only for team registration */}
              {registrationType === "team" && (
                <div className="mb-8 bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Team Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Team Name *
                      </label>
                      <input
                        type="text"
                        name="teamName"
                        value={formData.teamName}
                        onChange={handleInputChange}
                        placeholder="Enter team name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Team Leader *
                      </label>
                      <input
                        type="text"
                        name="teamLeader"
                        value={formData.teamLeader}
                        onChange={handleInputChange}
                        placeholder="Enter team leader name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Team Members */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">Team Members</h3>
                    {teamMembers.map((member, index) => (
                      <div key={index} className="mb-4 p-4 bg-white border border-gray-300 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                          <input
                            type="text"
                            placeholder="Name"
                            value={member.name}
                            onChange={(e) => handleTeamMemberChange(index, "name", e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <input
                            type="email"
                            placeholder="Email"
                            value={member.email}
                            onChange={(e) => handleTeamMemberChange(index, "email", e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <input
                            type="tel"
                            placeholder="Phone"
                            value={member.phone}
                            onChange={(e) => handleTeamMemberChange(index, "phone", e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveTeamMember(index)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded transition"
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handleAddTeamMember}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
                    >
                      Add Team Member
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/hackathon/${numericId}`)}
                  className="flex-1 bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                >
                  Back
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default HackathonJoinPage;