import React, { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import type { Editor as TiptapEditorType } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { createCompetitionSubmission } from "../api/competitions";
import { getAuthToken } from "../libs/storageHelper";
import { toast, ToastContainer } from "react-toastify";
import {
  Trash2,
  Plus,
  Users,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

// ---------------- TYPES ----------------
interface TeamMember {
  Name: string;
  Email: string;
  Role: "Leader" | "Member";
}

interface SubmissionFormData {
  TeamName: string;
  GitHub: string;
  Description: any;
  SubmissionDate: string;
  TeamMembers: TeamMember[];
}

// ---------------- COMPONENTS ----------------

/** TipTap Rich Text Editor */
const DescriptionEditor: React.FC<{
  value: any;
  onChange: (content: any) => void;
}> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "<p></p>",
    onUpdate: ({ editor }: { editor: TiptapEditorType }) => {
      onChange(editor.getJSON());
    },
  });

  if (!editor) return null;

  const buttonClass = (isActive: boolean) =>
    `px-3 py-1.5 rounded text-sm transition-colors ${
      isActive
        ? "bg-blue-500 text-white"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={buttonClass(editor.isActive("bold"))}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={buttonClass(editor.isActive("italic"))}
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={buttonClass(editor.isActive("strike"))}
          title="Strike"
        >
          S
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={buttonClass(editor.isActive("bulletList"))}
          title="Bullet List"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={buttonClass(editor.isActive("orderedList"))}
          title="Numbered List"
        >
          1.
        </button>
      </div>
      <div className="p-4 min-h-[200px] bg-white focus-within:ring-2 focus-within:ring-blue-500">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

/** Team Member Card */
const TeamMemberCard: React.FC<{
  member: TeamMember;
  index: number;
  total: number;
  onChange: (field: string, value: string) => void;
  onRemove: () => void;
}> = ({ member, index, total, onChange, onRemove }) => (
  <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold flex items-center justify-center">
          {index + 1}
        </div>
        <h3 className="font-semibold text-gray-900">Team Member</h3>
      </div>
      {total > 1 && (
        <button
          type="button"
          onClick={onRemove}
          className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
          title="Remove member"
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>

    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={member.Name}
          onChange={(e) => onChange("Name", e.target.value)}
          placeholder="Full name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={member.Email}
          onChange={(e) => onChange("Email", e.target.value)}
          placeholder="member@example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
        <select
          value={member.Role}
          onChange={(e) =>
            onChange("Role", e.target.value as "Leader" | "Member")
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="Leader">Leader</option>
          <option value="Member">Member</option>
        </select>
      </div>
    </div>
  </div>
);

// ---------------- MAIN PAGE ----------------

const HackathonSubmissionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SubmissionFormData>({
    TeamName: "",
    GitHub: "",
    Description: null,
    SubmissionDate: "",
    TeamMembers: [{ Name: "", Email: "", Role: "Leader" }],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ---------------- HELPERS ----------------
  const isValidGitHubUrl = (url: string): boolean => {
    try {
      const u = new URL(url);
      return u.hostname.includes("github.com");
    } catch {
      return false;
    }
  };

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.TeamName.trim()) newErrors.TeamName = "Team name is required";
    if (!formData.GitHub.trim())
      newErrors.GitHub = "GitHub repository is required";
    else if (!isValidGitHubUrl(formData.GitHub))
      newErrors.GitHub = "Please enter a valid GitHub URL";

    if (!formData.Description)
      newErrors.Description = "Project description is required";

    if (!formData.SubmissionDate)
      newErrors.SubmissionDate = "Submission date and time is required";

    const validMembers = formData.TeamMembers.filter(
      (m) => m.Name.trim() && m.Email.trim()
    );
    if (validMembers.length === 0)
      newErrors.TeamMembers = "At least one member required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleFieldChange = (field: keyof SubmissionFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr[field];
        return newErr;
      });
    }
  };

  const handleTeamMemberChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => {
      const updated = [...prev.TeamMembers];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, TeamMembers: updated };
    });
  };

  const addTeamMember = () =>
    setFormData((prev) => ({
      ...prev,
      TeamMembers: [...prev.TeamMembers, { Name: "", Email: "", Role: "Member" }],
    }));

  const removeTeamMember = (index: number) =>
    setFormData((prev) => {
      if (prev.TeamMembers.length > 1)
        return {
          ...prev,
          TeamMembers: prev.TeamMembers.filter((_, i) => i !== index),
        };
      return prev;
    });

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);

    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("You must be logged in to submit a project");
        setLoading(false);
        return;
      }

      const validTeamMembers = formData.TeamMembers.filter(
        (m) => m.Name.trim() && m.Email.trim()
      );

      const submissionData = {
        TeamName: formData.TeamName,
        GitHub: formData.GitHub,
        Description: formData.Description,
        SubmissionDate: new Date(formData.SubmissionDate).toISOString(), // match backend spelling
        TeamMembers: validTeamMembers[0], // backend expects single object
      };

      console.log("Submitting data:", JSON.stringify(submissionData, null, 2));

      await createCompetitionSubmission(submissionData, Number(id));

      toast.success("Project submitted successfully!");
      setTimeout(() => navigate("/hackathons-management"), 2000);
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error(
        err?.response?.data?.error?.message ||
          err.message ||
          "Failed to submit project"
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RENDER ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Submit Your Project
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* TEAM DETAILS */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-blue-600" />
              <h2 className="text-xl font-semibold">Project Details</h2>
            </div>

            {/* Team Name */}
            <div>
              <label className="font-semibold text-gray-700">
                Team Name *
              </label>
              <input
                type="text"
                value={formData.TeamName}
                onChange={(e) => handleFieldChange("TeamName", e.target.value)}
                className={`w-full px-4 py-2 mt-2 border rounded-lg ${
                  errors.TeamName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.TeamName && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={16} /> {errors.TeamName}
                </p>
              )}
            </div>

            {/* GitHub */}
            <div>
              <label className="font-semibold text-gray-700">
                GitHub Repository *
              </label>
              <input
                type="url"
                value={formData.GitHub}
                onChange={(e) => handleFieldChange("GitHub", e.target.value)}
                placeholder="https://github.com/username/repo"
                className={`w-full px-4 py-2 mt-2 border rounded-lg ${
                  errors.GitHub ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.GitHub && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={16} /> {errors.GitHub}
                </p>
              )}
            </div>

            {/* Submission Date */}
            <div>
              <label className="font-semibold text-gray-700">
                Submission Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.SubmissionDate}
                onChange={(e) =>
                  handleFieldChange("SubmissionDate", e.target.value)
                }
                className={`w-full px-4 py-2 mt-2 border rounded-lg ${
                  errors.SubmissionDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.SubmissionDate && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={16} /> {errors.SubmissionDate}
                </p>
              )}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText /> Project Description
            </h2>
            <DescriptionEditor
              value={formData.Description}
              onChange={(val) => handleFieldChange("Description", val)}
            />
            {errors.Description && (
              <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                <AlertCircle size={16} /> {errors.Description}
              </p>
            )}
          </div>

          {/* TEAM MEMBERS */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Users /> Team Members
              </h2>
              <button
                type="button"
                onClick={addTeamMember}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Plus size={18} /> Add Member
              </button>
            </div>

            {errors.TeamMembers && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                <AlertCircle size={18} className="text-red-600" />
                <p className="text-sm text-red-700">{errors.TeamMembers}</p>
              </div>
            )}

            <div className="space-y-4">
              {formData.TeamMembers.map((member, index) => (
                <TeamMemberCard
                  key={index}
                  member={member}
                  index={index}
                  total={formData.TeamMembers.length}
                  onChange={(field, val) =>
                    handleTeamMemberChange(index, field, val)
                  }
                  onRemove={() => removeTeamMember(index)}
                />
              ))}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} /> Submit Project
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/hackathons-management")}
              className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold rounded-lg"
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