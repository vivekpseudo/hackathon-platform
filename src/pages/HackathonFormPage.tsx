import React, { useState } from "react";
import { createCompetition } from "../api/competitions";
import { CompetitionFormInput } from "../types/competition";

function CreateHackathonForm() {
  const totalSteps = 7;
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<CompetitionFormInput>({
    Title: "",
    description: "",
    startDate: "",
    endDate: "",
    type: "",
    feeType: "",
    feePerMember: 0,
    feePerTeam: 0,
    isFeeForTeam: false,
    isActive: false,
    isCompleted: false,
    minMember: 2,
    maxMember: 4,
    competition_organiser: { name: "" },
    competition_contact: { contactName: "", email: "", phonenumber: "" },
    competition_rewards: [{ title: "" }],
    competition_timelines: [{ title: "", description: "", startDate: "", endDate: "" }],
    competition_category: [],
    images: [],
    helpDocs: [],
  });

  const handleChange = (field: string, value: any, parent?: string, index?: number) => {
    if (parent) {
      if (index !== undefined) {
        const updatedArray = [...(formData[parent as keyof typeof formData] as any)];
        updatedArray[index][field] = value;
        setFormData({ ...formData, [parent]: updatedArray });
      } else {
        setFormData({
          ...formData,
          [parent]: { ...(formData[parent as keyof typeof formData] as any), [field]: value },
        });
      }
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await createCompetition(formData);
      alert("✅ Hackathon created successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error saving hackathon:", error);
      alert("❌ Failed to save hackathon.);",
        setLoading(false));
    }
  };

  const renderPagination = () => (
    <div className="flex justify-between items-center mb-6">
      {Array.from({ length: totalSteps }, (_, idx) => {
        const step = idx + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        return (
          <div key={step} className="flex-1 flex items-center">
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${isCompleted
                  ? "bg-blue-500 border-blue-500 text-white"
                  : isActive
                    ? "border-blue-500 text-blue-500"
                    : "border-gray-300 text-gray-500"}`}
            >
              {step}
            </div>
            {step !== totalSteps && (
              <div className={`flex-1 h-1 ${step < currentStep ? "bg-blue-500" : "bg-gray-300"}`}></div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderStepForm = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Title</label>
              <input
                type="text"
                value={formData.Title}
                onChange={(e) => handleChange("Title", e.target.value)}
                className="w-full border border-gray-300 rounded p-2" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full border border-gray-300 rounded p-2" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Start Date</label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full border border-gray-300 rounded p-2" />
            </div>
            <div>
              <label className="block font-semibold mb-1">End Date</label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="w-full border border-gray-300 rounded p-2" />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Type</label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full border border-gray-300 rounded p-2" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Fee Type</label>
              <input
                type="text"
                value={formData.feeType}
                onChange={(e) => handleChange("feeType", e.target.value)}
                className="w-full border border-gray-300 rounded p-2" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-semibold mb-1">Fee Per Member</label>
                <input
                  type="number"
                  value={formData.feePerMember}
                  onChange={(e) => handleChange("feePerMember", Number(e.target.value))}
                  className="w-full border border-gray-300 rounded p-2" />
              </div>
              <div className="flex-1">
                <label className="block font-semibold mb-1">Fee Per Team</label>
                <input
                  type="number"
                  value={formData.feePerTeam}
                  onChange={(e) => handleChange("feePerTeam", Number(e.target.value))}
                  className="w-full border border-gray-300 rounded p-2" />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <label className="block font-semibold mb-2">Rewards</label>
            {formData.competition_rewards.map((reward, idx) => (
              <input
                key={idx}
                type="text"
                value={reward.title}
                onChange={(e) => handleChange("title", e.target.value, "competition_rewards", idx)}
                className="w-full border border-gray-300 rounded p-2 mb-2" />
            ))}
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <label className="block font-semibold mb-1">Organiser Name</label>
            <input
              type="text"
              value={formData.competition_organiser.name}
              onChange={(e) => handleChange("name", e.target.value, "competition_organiser")}
              className="w-full border border-gray-300 rounded p-2" />
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <label className="block font-semibold mb-1">Contact Name</label>
            <input
              type="text"
              value={formData.competition_contact.contactName}
              onChange={(e) => handleChange("contactName", e.target.value, "competition_contact")}
              className="w-full border border-gray-300 rounded p-2" />
            <label className="block font-semibold mb-1">Contact Email</label>
            <input
              type="email"
              value={formData.competition_contact.email}
              onChange={(e) => handleChange("email", e.target.value, "competition_contact")}
              className="w-full border border-gray-300 rounded p-2" />
            <label className="block font-semibold mb-1">Phone</label>
            <input
              type="text"
              value={formData.competition_contact.phonenumber}
              onChange={(e) => handleChange("phonenumber", e.target.value, "competition_contact")}
              className="w-full border border-gray-300 rounded p-2" />
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Review Hackathon Details</h2>

            <div>
              <h3 className="font-semibold">Title:</h3>
              <p>{formData.Title || "N/A"}</p>
            </div>

            <div>
              <h3 className="font-semibold">Description:</h3>
              <p>{formData.description || "N/A"}</p>
            </div>

            <div>
              <h3 className="font-semibold">Dates:</h3>
              <p>Start: {formData.startDate || "TBA"}</p>
              <p>End: {formData.endDate || "TBA"}</p>
            </div>

            <div>
              <h3 className="font-semibold">Type:</h3>
              <p>{formData.type || "N/A"}</p>
            </div>

            <div>
              <h3 className="font-semibold">Fee:</h3>
              <p>
                {formData.feeType || "N/A"} | Per Member: {formData.feePerMember} | Per Team: {formData.feePerTeam} | Team Fee?:{" "}
                {formData.isFeeForTeam ? "Yes" : "No"}
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Members:</h3>
              <p>Min: {formData.minMember}, Max: {formData.maxMember}</p>
            </div>

            <div>
              <h3 className="font-semibold">Organiser:</h3>
              <p>{formData.competition_organiser.name || "N/A"}</p>
            </div>

            <div>
              <h3 className="font-semibold">Contact:</h3>
              <p>
                {formData.competition_contact.contactName || "N/A"} | {formData.competition_contact.email || "N/A"} |{" "}
                {formData.competition_contact.phonenumber || "N/A"}
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Rewards:</h3>
              {formData.competition_rewards.length > 0 ? (
                <ul className="list-disc ml-5">
                  {formData.competition_rewards.map((r, idx) => (
                    <li key={idx}>{r.title || "No title"}</li>
                  ))}
                </ul>
              ) : (
                <p>N/A</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold">Timelines:</h3>
              {formData.competition_timelines.length > 0 ? (
                <ul className="list-disc ml-5">
                  {formData.competition_timelines.map((t, idx) => (
                    <li key={idx}>
                      {t.title || "No title"}: {t.startDate || "TBA"} - {t.endDate || "TBA"} <br />
                      {t.description || ""}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>N/A</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold">Categories:</h3>
              <p>{formData.competition_category.length > 0 ? formData.competition_category.join(", ") : "N/A"}</p>
            </div>

            <div>
              <h3 className="font-semibold">Images:</h3>
              <p>{formData.images.length > 0 ? formData.images.join(", ") : "N/A"}</p>
            </div>

            <div>
              <h3 className="font-semibold">Help Documents:</h3>
              <p>{formData.helpDocs.length > 0 ? formData.helpDocs.join(", ") : "N/A"}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      {renderPagination()}
      {renderStepForm()}
      <div className="flex justify-between mt-4">
        {currentStep > 1 && (
          <button
            onClick={prevStep}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Previous
          </button>
        )}
        {currentStep < totalSteps && (
          <button
            onClick={nextStep}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Next
          </button>
        )}
        {currentStep === totalSteps && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? "Saving..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
}

export default CreateHackathonForm;




