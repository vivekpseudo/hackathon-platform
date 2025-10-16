import React, { useEffect, useState } from "react";
import { EditorContent, type Editor } from "@tiptap/react";
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
  Upload
} from "lucide-react";

interface Props {
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    editor: Editor | null;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const buttonClass = (isActive: boolean) =>
    `p-2 rounded hover:bg-gray-100 transition-colors ${
      isActive ? "bg-blue-100 text-blue-600" : "text-gray-700"
    }`;

  return (
    <div className="border border-gray-300 rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-1">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive("bold"))}
        title="Bold"
      >
        <Bold size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive("italic"))}
        title="Italic"
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
        title="Code"
      >
        <Code size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

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

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className={buttonClass(false)}
        title="Undo"
      >
        <Undo size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className={buttonClass(false)}
        title="Redo"
      >
        <Redo size={18} />
      </button>
    </div>
  );
};

const DescriptionStep: React.FC<Props> = ({
    formData,
    setFormData,
    editor,
}) => {
    const [helpDocFiles, setHelpDocFiles] = useState<File[]>([]);
    const [helpDocUploading, setHelpDocUploading] = useState(false);

    // Sync editor content with formData.description
    useEffect(() => {
        if (!editor) return;

        const updateDescription = () => {
            const json = editor.getJSON();
            
            setFormData((prev: any) => ({
                ...prev,
                description: json
            }));
            
            console.log("📝 Description updated:", json);
        };

        editor.on('update', updateDescription);

        return () => {
            editor.off('update', updateDescription);
        };
    }, [editor, setFormData]);

    // Load existing description into editor
    useEffect(() => {
        if (!editor || !formData.description) return;

        const currentContent = editor.getJSON();
        const hasContent = currentContent.content && currentContent.content.length > 0;
        
        if (!hasContent && formData.description.content) {
            editor.commands.setContent(formData.description);
            console.log("📄 Loaded existing description into editor");
        }
    }, [editor, formData.description]);

    const handleHelpDocFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setHelpDocFiles(prev => [...prev, ...newFiles]);
        }
        // Reset input
        e.target.value = '';
    };

    const removeHelpDocFile = (index: number) => {
        setHelpDocFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Update formData when helpDocFiles change
    useEffect(() => {
        setFormData((prev: any) => ({
            ...prev,
            helpDocs: helpDocFiles.length > 0 ? helpDocFiles : null
        }));
    }, [helpDocFiles, setFormData]);

    if (!editor) {
        return <div className="text-gray-500">Loading editor...</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Title */}
            <div className="flex flex-col gap-2">
                <label className="font-semibold">Title *</label>
                <input
                    type="text"
                    name="Title"
                    value={formData.Title}
                    onChange={(e) =>
                        setFormData((prev: any) => ({ ...prev, Title: e.target.value }))
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Enter hackathon title"
                    required
                />
            </div>

            {/* Start & End Date */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label className="font-semibold">Start Date *</label>
                    <input
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) =>
                            setFormData((prev: any) => ({ ...prev, startDate: e.target.value }))
                        }
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="font-semibold">End Date *</label>
                    <input
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) =>
                            setFormData((prev: any) => ({ ...prev, endDate: e.target.value }))
                        }
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
            </div>

            {/* Active & Completed */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="font-semibold">Is Active</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-1">
                            <input
                                type="radio"
                                name="isActive"
                                checked={formData.isActive === true}
                                onChange={() =>
                                    setFormData((prev: any) => ({ ...prev, isActive: true }))
                                }
                            />
                            True
                        </label>
                        <label className="flex items-center gap-1">
                            <input
                                type="radio"
                                name="isActive"
                                checked={formData.isActive === false}
                                onChange={() =>
                                    setFormData((prev: any) => ({ ...prev, isActive: false }))
                                }
                            />
                            False
                        </label>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-semibold">Is Completed</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-1">
                            <input
                                type="radio"
                                name="isCompleted"
                                checked={formData.isCompleted === true}
                                onChange={() =>
                                    setFormData((prev: any) => ({ ...prev, isCompleted: true }))
                                }
                            />
                            True
                        </label>
                        <label className="flex items-center gap-1">
                            <input
                                type="radio"
                                name="isCompleted"
                                checked={formData.isCompleted === false}
                                onChange={() =>
                                    setFormData((prev: any) => ({ ...prev, isCompleted: false }))
                                }
                            />
                            False
                        </label>
                    </div>
                </div>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
                <label className="font-semibold">Competition Category</label>
                <select
                    value={formData.competition_category?.[0] || ""}
                    onChange={(e) => {
                        const value = e.target.value ? [Number(e.target.value)] : [1];
                        setFormData((prev: any) => ({
                            ...prev,
                            competition_category: value
                        }));
                    }}
                    className="w-full p-2 border rounded"
                >
                    <option value="">Select Category</option>
                    <option value={1}>Hackathon</option>
                    <option value={2}>Conference</option>
                    <option value={3}>Workshop</option>
                    <option value={4}>Competition</option>
                </select>
            </div>

            {/* Type */}
            <div className="flex flex-col gap-2">
                <label className="font-semibold">Type</label>
                <select
                    value={formData.type}
                    onChange={(e) =>
                        setFormData((prev: any) => ({ ...prev, type: e.target.value }))
                    }
                    className="w-full p-2 border rounded"
                >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                </select>
            </div>

            {/* Members */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label className="font-semibold">Minimum Members</label>
                    <input
                        type="number"
                        min="1"
                        value={formData.minMember}
                        onChange={(e) =>
                            setFormData((prev: any) => ({
                                ...prev,
                                minMember: Number(e.target.value),
                            }))
                        }
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="font-semibold">Maximum Members</label>
                    <input
                        type="number"
                        min="1"
                        value={formData.maxMember}
                        onChange={(e) =>
                            setFormData((prev: any) => ({
                                ...prev,
                                maxMember: Number(e.target.value),
                            }))
                        }
                        className="w-full p-2 border rounded"
                    />
                </div>
            </div>

            {/* Fee Section */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label className="font-semibold">Fee Type</label>
                    <select
                        value={formData.feeType}
                        onChange={(e) =>
                            setFormData((prev: any) => ({ ...prev, feeType: e.target.value }))
                        }
                        className="w-full p-2 border rounded"
                    >
                        <option value="Free">Free</option>
                        <option value="Paid">Paid</option>
                    </select>
                </div>

                {formData.feeType === "Paid" && (
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Fee Per Member</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.feePerMember}
                            onChange={(e) =>
                                setFormData((prev: any) => ({
                                    ...prev,
                                    feePerMember: Number(e.target.value),
                                }))
                            }
                            className="w-full p-2 border rounded"
                        />
                    </div>
                )}
            </div>

            {/* Fee per Team */}
            {formData.feeType === "Paid" && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Fee Per Team</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.feePerTeam}
                            onChange={(e) =>
                                setFormData((prev: any) => ({
                                    ...prev,
                                    feePerTeam: Number(e.target.value),
                                }))
                            }
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Is Fee For Team</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-1">
                                <input
                                    type="radio"
                                    name="isFeeForTeam"
                                    checked={formData.isFeeForTeam === true}
                                    onChange={() =>
                                        setFormData((prev: any) => ({ ...prev, isFeeForTeam: true }))
                                    }
                                />
                                True
                            </label>
                            <label className="flex items-center gap-1">
                                <input
                                    type="radio"
                                    name="isFeeForTeam"
                                    checked={formData.isFeeForTeam === false}
                                    onChange={() =>
                                        setFormData((prev: any) => ({ ...prev, isFeeForTeam: false }))
                                    }
                                />
                                False
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* Description with TipTap */}
            <div className="flex flex-col gap-2 mt-4">
                <label className="font-semibold">
                    Description
                    <span className="text-xs text-gray-500 ml-2 font-normal">
                        (Content is automatically saved as you type)
                    </span>
                </label>
                <div>
                    <MenuBar editor={editor} />
                    <div className="border border-gray-300 border-t-0 rounded-b-md p-3 min-h-[200px] prose max-w-none focus-within:ring-2 focus-within:ring-blue-500">
                        <EditorContent editor={editor} />
                    </div>
                </div>
                
                {formData.description && (
                    <details className="text-xs text-gray-500 mt-2">
                        <summary className="cursor-pointer">View JSON Content (Debug)</summary>
                        <pre className="bg-gray-100 p-2 rounded mt-1 overflow-auto">
                            {JSON.stringify(formData.description, null, 2)}
                        </pre>
                    </details>
                )}
            </div>

            {/* Help Docs Upload Section */}
            <div className="flex flex-col gap-2 mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <label className="font-semibold">Help Docs (Images/PDFs)</label>
                <p className="text-xs text-gray-600">Upload documents, images, or guides to help participants</p>
                
                <label className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-100 transition">
                    <Upload size={18} className="text-blue-500" />
                    <span className="text-sm font-medium">Click to upload files</span>
                    <input
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleHelpDocFilesChange}
                        className="hidden"
                    />
                </label>

                {/* Display uploaded files */}
                {helpDocFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                            Uploaded Files ({helpDocFiles.length}):
                        </p>
                        <div className="space-y-1">
                            {helpDocFiles.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between bg-white p-2 rounded border border-gray-200"
                                >
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <span className="text-gray-600 flex-shrink-0">📄</span>
                                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                        <span className="text-xs text-gray-500 flex-shrink-0">
                                            ({(file.size / 1024).toFixed(2)} KB)
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeHelpDocFile(index)}
                                        className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded flex-shrink-0"
                                        title="Remove file"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {helpDocFiles.length === 0 && (
                    <p className="text-xs text-gray-500 text-center py-2">No files selected</p>
                )}
            </div>
        </div>
    );
};

export default DescriptionStep;