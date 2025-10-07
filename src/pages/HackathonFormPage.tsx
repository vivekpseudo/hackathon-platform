import React, { useState } from "react";
import { createCompetition } from "../api/competitions";
import { CompetitionFormInput } from "../types/competition";

const CreateHackathonForm: React.FC = () => {
  const [formData, setFormData] = useState<CompetitionFormInput>({
    Title: "",
    startDate: "",
    endDate: "",
    isActive: true,
    isCompleted: false,
    type: "Online",
    minMember: 1,
    maxMember: 5,
    feeType: "Free",
    feePerMember: 0,
    feePerTeam: 0,
    isFeeForTeam: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      console.log("Submitting competition data:", formData);
      
      const res = await createCompetition(formData);
      console.log(" Competition created:", res);

      setMessage("Hackathon created successfully!");
      
      // Reset form
      setFormData({
        Title: "",
        startDate: "",
        endDate: "",
        isActive: true,
        isCompleted: false,
        type: "Online",
        minMember: 1,
        maxMember: 5,
        feeType: "Free",
        feePerMember: 0,
        feePerTeam: 0,
        isFeeForTeam: false,
      });
    } catch (error: any) {
      console.error(" Error creating competition:", error);
      console.error(" Response data:", error?.response?.data);
      console.error("Response status:", error?.response?.status);
      
      if (error?.response?.status === 403) {
        const errorMsg = error?.response?.data?.error?.message || "Access forbidden - check your permissions";
        setMessage(` ${errorMsg}`);
      } else if (error?.response?.status === 401) {
        setMessage(" Unauthorized - Please login first");
      } else {
        const errorMsg = error?.response?.data?.error?.message || "Failed to create competition";
        setMessage(` ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 shadow rounded-lg mt-10">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Create New Hackathon
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="Title"
            value={formData.Title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Start Date</label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">End Date</label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Min Members</label>
            <input
              type="number"
              name="minMember"
              value={formData.minMember}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Max Members</label>
            <input
              type="number"
              name="maxMember"
              value={formData.maxMember}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Fee Type</label>
          <select
            name="feeType"
            value={formData.feeType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Free">Free</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Fee Per Member</label>
            <input
              type="number"
              name="feePerMember"
              value={formData.feePerMember}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Fee Per Team</label>
            <input
              type="number"
              name="feePerTeam"
              value={formData.feePerTeam}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isFeeForTeam"
              checked={formData.isFeeForTeam}
              onChange={handleChange}
              className="mr-2"
            />
            Is Fee for Team?
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="mr-2"
            />
            Active
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="isCompleted"
              checked={formData.isCompleted}
              onChange={handleChange}
              className="mr-2"
            />
            Completed
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Hackathon"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center ${
            message.includes("Failed") || message.includes("🚫") || message.includes("❌")
              ? "text-red-500"
              : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default CreateHackathonForm;