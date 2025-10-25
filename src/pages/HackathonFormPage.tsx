import React, { useState, useEffect } from "react";
import { createCompetition } from "../api/competitions";
import { useLocalAuth } from "../context/AuthContext";
import { CompetitionFormInput } from "../types/competition";
import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { Editor as TiptapEditorType } from "@tiptap/core";

// Step Components
import DescriptionStep from "../components/Hackathonsteps/DescriptionStep";
import TimelineStep from "../components/Hackathonsteps/TimelineStep";
import RewardsStep from "../components/Hackathonsteps/RewardsStep";
import OrganizerStep from "../components/Hackathonsteps/OrganizerStep";
import ContactStep from "../components/Hackathonsteps/ContactStep";
import ReviewStep from "../components/Hackathonsteps/ReviewStep";

const steps = ["Description", "Timeline", "Rewards", "Organiser", "Contact", "Review"];

const CreateHackathonForm: React.FC = () => {
  const { user } = useLocalAuth();
  const [step, setStep] = useState(1);
  const totalSteps = steps.length;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const submittingRef = React.useRef(false);

  const [formData, setFormData] = useState<CompetitionFormInput>({
    Title: "",
    description: "",
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
    competition_category: [1],
    competition_contact: { contactName: "", email: "", phonenumber: "" },
    competition_organiser: {
      name: user?.username || "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      entityType: "Individual",
    },
    competition_rewards: [
      { title: "", description: "", amount: "", isCash: false, position: "" }
    ],
    competition_timelines: [
      { title: "", description: "", startDate: "", endDate: "", type: "Online" }
    ],
    competition_result: "",
    helpDocs: [],
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.description || "<p></p>",
    onUpdate: ({ editor }: { editor: TiptapEditorType }) => setFormData((prev) => ({ ...prev, description: editor.getHTML() })),
  });

  useEffect(() => () => editor?.destroy(), [editor]);

 

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData((prev) => {
      const parentValue = prev[parent as keyof CompetitionFormInput];
      return {
        ...prev,
        [parent]: { ...(typeof parentValue === 'object' && parentValue !== null ? parentValue : {}), [field]: value },
      };
    });
  };

  const handleArrayChange = (parent: string, index: number, value: any, field?: string) => {
    setFormData((prev) => {
      const updated = [...(prev[parent as keyof CompetitionFormInput] as any[])];
      if (typeof updated[index] !== "object" || updated[index] === null) updated[index] = {};
      if (field) updated[index] = { ...updated[index], [field]: value };
      else updated[index] = value;
      return { ...prev, [parent]: updated };
    });
  };

  const addArrayItem = (parent: string, item: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: [...(prev[parent as keyof CompetitionFormInput] as any[]), item],
    }));
  };

  const removeArrayItem = (parent: string, index: number) => {
    setFormData((prev) => {
      const updated = [...(prev[parent as keyof CompetitionFormInput] as any[])];
      updated.splice(index, 1);
      return { ...prev, [parent]: updated };
    });
  };

  // Step Navigation
  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // Manual Publish Handler
  const handlePublish = async () => {
    if (loading || submittingRef.current) {
      console.log("Already submitting, ignoring duplicate submission");
      return;
    }

    submittingRef.current = true;
    setLoading(true);
    setMessage("");

    try {
      console.log("Starting hackathon creation process...");
      console.log("Current user:", user);

      // Validate user is logged in
      if (!user?.id) {
        setMessage("You must be logged in to create a hackathon");
        setLoading(false);
        submittingRef.current = false;
        return;
      }

      // Validate required fields
      if (!formData.Title?.trim()) {
        setMessage("Title is required");
        setLoading(false);
        submittingRef.current = false;
        return;
      }

      if (!formData.startDate || !formData.endDate) {
        setMessage("Start Date and End Date are required");
        setLoading(false);
        submittingRef.current = false;
        return;
      }

      const hasValidTimeline = formData.competition_timelines.some(
        (t) => t.title && t.startDate && t.endDate
      );

      if (!hasValidTimeline) {
        setMessage("At least one valid timeline is required");
        setLoading(false);
        submittingRef.current = false;
        return;
      }

      toast.info("This competition will be published for everyone", {
        position: "top-center",
        autoClose: 3000,
      });

      console.log("Validation passed, creating competition...");
      console.log("Form data:", formData);

      const response = await createCompetition(formData, user);

      console.log("Backend response:", response);

      setMessage("Hackathon published successfully! Redirecting...");
      setIsPublished(true);
      submittingRef.current = false;
      console.log("Hackathon creation complete!");

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = "/hackathons-management";
      }, 2000);

    } catch (error: any) {
      console.error("Error creating hackathon:", error);
      const status = error?.response?.status;
      const errorMsg = error?.response?.data?.error?.message;
      const errorDetails = error?.response?.data?.error?.details;

      let userMessage = "";

      if (status === 403) {
        userMessage = "Access forbidden. You may not have permission to create hackathons.";
      } else if (status === 401) {
        userMessage = "Unauthorized. Please log in again.";
      } else if (status === 400) {
        if (errorDetails?.errors) {
          const errors = errorDetails.errors
            .map((err: any) => {
              const path = err.path?.join(".") || "unknown";
              const message = err.message || "validation error";
              return `${path}: ${message}`;
            })
            .join(", ");
          userMessage = `Validation errors: ${errors}`;
        } else if (errorMsg) {
          userMessage = errorMsg;
        } else {
          userMessage = "Invalid data. Please check all fields.";
        }
      } else {
        userMessage = errorMsg || "Failed to publish hackathon. Please try again.";
      }

      setMessage(`Error: ${userMessage}`);
      console.error("Full error details:", { status, message: errorMsg, details: errorDetails });
      submittingRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  // Stepper UI
  const renderStepper = () => (
    <div className="flex items-center mb-6">
      {steps.map((title, idx) => {
        const current = idx + 1;
        const isActive = step === current;
        const isCompleted = step > current;
        return (
          <React.Fragment key={current}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                  isCompleted
                    ? "bg-blue-500 border-blue-500 text-white"
                    : isActive
                    ? "border-blue-500 text-blue-500"
                    : "border-gray-300 text-gray-500"
                }`}
              >
                {current}
              </div>
              <span className="text-xs mt-1">{title}</span>
            </div>
            {current !== totalSteps && (
              <div className={`flex-1 h-1 ${current < step ? "bg-blue-500" : "bg-gray-300"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  // Step Forms
  const renderStepForm = () => {
    switch (step) {
      case 1:
        return <DescriptionStep formData={formData} setFormData={setFormData} editor={editor} />;
      case 2:
        return (
          <TimelineStep
            formData={formData}
            handleArrayChange={handleArrayChange}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
          />
        );
      case 3:
        return (
          <RewardsStep
            formData={formData}
            handleArrayChange={handleArrayChange}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
          />
        );
      case 4:
        return <OrganizerStep formData={formData} handleNestedChange={handleNestedChange} />;
      case 5:
        return <ContactStep formData={formData} handleNestedChange={handleNestedChange} />;
      case 6:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 shadow rounded-lg mt-10">
      <h1 className="text-2xl font-semibold mb-6 text-center">Create New Hackathon</h1>
      {renderStepper()}

      <form className="space-y-4">
        {renderStepForm()}

        <div className="flex justify-between mt-6">
          {step > 1 && !isPublished && (
            <button
              type="button"
              onClick={prevStep}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              disabled={loading}
            >
              Back
            </button>
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            >
              Next
            </button>
          ) : (
            !isPublished && (
              <button
                type="button"
                onClick={handlePublish}
                disabled={loading}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed ml-auto"
              >
                {loading ? "Publishing..." : "Publish"}
              </button>
            )
          )}
        </div>
      </form>

      {message && (
        <div
          className={`mt-4 p-4 rounded-lg text-center ${
            message.startsWith("Error")
              ? "bg-red-100 border border-red-400 text-red-700"
              : "bg-green-100 border border-green-400 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <ToastContainer />

      {message && (
        <div
          className={`mt-4 p-4 rounded-lg text-center ${
            message.startsWith("Error")
              ? "bg-red-100 border border-red-400 text-red-700"
              : "bg-green-100 border border-green-400 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default CreateHackathonForm;
export default CreateHackathonForm;