import React, { useEffect, useState } from "react";
import { EditorContent } from "@tiptap/react";
import type { Editor as TiptapEditorType } from "@tiptap/core";
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Heading2,
  Undo,
  Redo,
  Code,
  Quote,
  X,
  Upload,
  AlertCircle
} from "lucide-react";

interface Props {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  editor: TiptapEditorType | null;
}

interface MenuBarProps {
  editor: TiptapEditorType | null;
}

/**
 * Rich text editor toolbar with formatting options
 */
const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  if (!editor) return null;

  const buttonClass = (isActive: boolean) =>
    `p-2 rounded transition-colors ${
      isActive 
        ? "bg-blue-500 text-white shadow-sm" 
        : "text-gray-600 hover:bg-gray-100"
    } disabled:opacity-50 disabled:cursor-not-allowed`;

  const dividerClass = "w-px h-6 bg-gray-300 mx-1";

  return (
    <div className="border border-gray-300 border-b-0 rounded-t-lg bg-gradient-to-r from-gray-50 to-gray-100 p-3 flex flex-wrap gap-0.5">
      {/* Text Formatting */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive("bold"))}
        title="Bold (Ctrl+B)"
      >
        <Bold size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive("italic"))}
        title="Italic (Ctrl+I)"
      >
        <Italic size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={buttonClass(editor.isActive("strike"))}
        title="Strikethrough"
      >
        <Strikethrough size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={buttonClass(editor.isActive("code"))}
        title="Inline Code"
      >
        <Code size={18} />
      </button>

      <div className={dividerClass} />

      {/* Block Elements */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 2 }))}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive("bulletList"))}
        title="Bullet List"
      >
        <List size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive("orderedList"))}
        title="Numbered List"
      >
        <ListOrdered size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={buttonClass(editor.isActive("blockquote"))}
        title="Blockquote"
      >
        <Quote size={18} />
      </button>

      <div className={dividerClass} />

      {/* History */}
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className={buttonClass(false)}
        title="Undo (Ctrl+Z)"
      >
        <Undo size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className={buttonClass(false)}
        title="Redo (Ctrl+Y)"
      >
        <Redo size={18} />
      </button>
    </div>
  );
};

/**
 * File upload section for help documentation
 */
const HelpDocsSection: React.FC<{
  helpDocFiles: File[];
  onFilesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}> = ({ helpDocFiles, onFilesChange, onRemoveFile }) => {
  const totalSize = helpDocFiles.reduce((acc, file) => acc + file.size, 0);
  const maxSize = 500 * 1024 * 1024; // 500MB total

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Help Documentation</h3>
          <p className="text-sm text-gray-600">Upload guides, resources, and documents for participants</p>
        </div>

        {/* Upload Area */}
        <label className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer group">
          <Upload size={24} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">PDF, Images, Word, Excel up to 50MB each</p>
          </div>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
            onChange={onFilesChange}
            className="hidden"
          />
        </label>

        {/* File List */}
        {helpDocFiles.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">
                Uploaded Files ({helpDocFiles.length})
              </p>
              <span className="text-xs text-gray-500">
                {(totalSize / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>

            <div className="space-y-2">
              {helpDocFiles.map((file, index) => {
                const fileIcon = file.type.startsWith("image/") ? "🖼️" : "📄";
                
                return (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-lg flex-shrink-0">{fileIcon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveFile(index)}
                      className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                      title="Remove file"
                    >
                      <X size={18} />
                    </button>
                  </div>
                );
              })}
            </div>

            {totalSize > maxSize && (
              <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">
                  Total file size exceeds the limit. Please remove some files.
                </p>
              </div>
            )}
          </div>
        )}

        {helpDocFiles.length === 0 && (
          <p className="text-xs text-gray-500 text-center py-4">No files selected</p>
        )}
      </div>
    </div>
  );
};

/**
 * Description step component for hackathon form
 */
const DescriptionStep: React.FC<Props> = ({
  formData,
  setFormData,
  editor,
}) => {
  const [helpDocFiles, setHelpDocFiles] = useState<File[]>([]);
  const [descriptionWarning, setDescriptionWarning] = useState(false);

  // Sync editor content with formData.description - Use useCallback to prevent dependency issues
  useEffect(() => {
    if (!editor) return;

    const updateDescription = () => {
      const json = editor.getJSON();
      console.log("📝 Editor content updated:", json);
      
      setFormData((prev: any) => {
        const updated = { ...prev, description: json };
        console.log("✅ FormData description set to:", updated.description);
        return updated;
      });

      // Check if description has meaningful content
      const hasContent =
        json?.content?.some((node: any) =>
          node?.content?.some((child: any) => child?.text?.trim())
        );
      setDescriptionWarning(!hasContent);
    };

    // Subscribe to editor updates
    editor.on("update", updateDescription);
    console.log("📌 Editor update listener attached");

    return () => {
      editor.off("update", updateDescription);
      console.log("📌 Editor update listener removed");
    };
  }, [editor, setFormData]);

  // Load existing description into editor on first render
  useEffect(() => {
    if (!editor || !formData.description) return;

    const currentContent = editor.getJSON();
    const hasContent = currentContent.content && currentContent.content.length > 0;

    // Only set content if editor is empty and we have description to load
    if (!hasContent && formData.description?.content) {
      editor.commands.setContent(formData.description);
      console.log("✅ Loaded existing description into editor");
    }
  }, [editor, formData.description]);

  const handleHelpDocFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setHelpDocFiles((prev) => [...prev, ...newFiles]);
    }
    e.target.value = "";
  };

  const removeHelpDocFile = (index: number) => {
    setHelpDocFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Update formData when helpDocFiles change
  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      helpDocs: helpDocFiles.length > 0 ? helpDocFiles : null,
    }));
  }, [helpDocFiles, setFormData]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full" />
          </div>
          <p className="text-gray-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-semibold text-gray-900">
          Competition Title
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          id="title"
          type="text"
          name="Title"
          value={formData.Title}
          onChange={(e) =>
            setFormData((prev: any) => ({ ...prev, Title: e.target.value }))
          }
          placeholder="Enter an engaging title for your hackathon"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          required
        />
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="startDate" className="block text-sm font-semibold text-gray-900">
            Start Date
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id="startDate"
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) =>
              setFormData((prev: any) => ({ ...prev, startDate: e.target.value }))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="endDate" className="block text-sm font-semibold text-gray-900">
            End Date
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id="endDate"
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) =>
              setFormData((prev: any) => ({ ...prev, endDate: e.target.value }))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
      </div>

      {/* Status Flags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-900">Is Active</label>
          <div className="flex gap-4">
            {[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ].map(({ label, value }) => (
              <label key={String(value)} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="isActive"
                  checked={formData.isActive === value}
                  onChange={() =>
                    setFormData((prev: any) => ({ ...prev, isActive: value }))
                  }
                  className="w-4 h-4 text-blue-500"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-900">Is Completed</label>
          <div className="flex gap-4">
            {[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ].map(({ label, value }) => (
              <label key={String(value)} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="isCompleted"
                  checked={formData.isCompleted === value}
                  onChange={() =>
                    setFormData((prev: any) => ({ ...prev, isCompleted: value }))
                  }
                  className="w-4 h-4 text-blue-500"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Category & Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-semibold text-gray-900">
            Category
          </label>
          <select
            id="category"
            value={formData.competition_category?.[0] || ""}
            onChange={(e) => {
              const value = e.target.value ? [Number(e.target.value)] : [1];
              setFormData((prev: any) => ({
                ...prev,
                competition_category: value,
              }));
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          >
            <option value="">Select a category</option>
            <option value={1}>Hackathon</option>
            <option value={2}>Conference</option>
            <option value={3}>Workshop</option>
            <option value={4}>Competition</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="type" className="block text-sm font-semibold text-gray-900">
            Format
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) =>
              setFormData((prev: any) => ({ ...prev, type: e.target.value }))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          >
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {/* Team Size */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="minMembers" className="block text-sm font-semibold text-gray-900">
            Minimum Team Size
          </label>
          <input
            id="minMembers"
            type="number"
            min="1"
            value={formData.minMember}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                minMember: Number(e.target.value),
              }))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="maxMembers" className="block text-sm font-semibold text-gray-900">
            Maximum Team Size
          </label>
          <input
            id="maxMembers"
            type="number"
            min="1"
            value={formData.maxMember}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                maxMember: Number(e.target.value),
              }))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="feeType" className="block text-sm font-semibold text-gray-900">
              Participation Fee
            </label>
            <select
              id="feeType"
              value={formData.feeType}
              onChange={(e) =>
                setFormData((prev: any) => ({ ...prev, feeType: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            >
              <option value="Free">Free</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          {formData.feeType === "Paid" && (
            <div className="space-y-2">
              <label htmlFor="feePerMember" className="block text-sm font-semibold text-gray-900">
                Fee Per Member
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-gray-600">$</span>
                <input
                  id="feePerMember"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.feePerMember}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      feePerMember: Number(e.target.value),
                    }))
                  }
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {formData.feeType === "Paid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="feePerTeam" className="block text-sm font-semibold text-gray-900">
                Fee Per Team
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-gray-600">$</span>
                <input
                  id="feePerTeam"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.feePerTeam}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      feePerTeam: Number(e.target.value),
                    }))
                  }
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900">
                Apply Fee Per Team
              </label>
              <div className="flex gap-4">
                {[
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ].map(({ label, value }) => (
                  <label key={String(value)} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="isFeeForTeam"
                      checked={formData.isFeeForTeam === value}
                      onChange={() =>
                        setFormData((prev: any) => ({ ...prev, isFeeForTeam: value }))
                      }
                      className="w-4 h-4 text-blue-500"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Description Editor */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <label className="block text-sm font-semibold text-gray-900">
            Detailed Description
            <span className="text-red-500 ml-1">*</span>
          </label>
          <span className="text-xs text-gray-500">Required</span>
        </div>

        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <MenuBar editor={editor} />
          <div className="border-t border-gray-300 p-4 min-h-[250px] bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50">
            <EditorContent editor={editor} />
          </div>
        </div>

        {descriptionWarning && (
          <div className="flex gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              Add a detailed description to help participants understand your event better.
            </p>
          </div>
        )}

      </div>

      {/* Help Documentation */}
      <HelpDocsSection
        helpDocFiles={helpDocFiles}
        onFilesChange={handleHelpDocFilesChange}
        onRemoveFile={removeHelpDocFile}
      />
    </div>
  );
};

export default DescriptionStep;