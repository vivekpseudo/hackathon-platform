import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompetitionById } from '../api/competitions';
import { makePutRequest, makePostRequest } from '../libs/axios';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { toast, ToastContainer } from 'react-toastify';
import { useLocalAuth } from '../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';

// Step Components
import DescriptionStep from '../components/Hackathonsteps/DescriptionStep';
import TimelineStep from '../components/Hackathonsteps/TimelineStep';
import RewardsStep from '../components/Hackathonsteps/RewardsStep';
import OrganizerStep from '../components/Hackathonsteps/OrganizerStep';
import ContactStep from '../components/Hackathonsteps/ContactStep';
import ReviewStep from '../components/Hackathonsteps/ReviewStep';

const steps = ['Description', 'Timeline', 'Rewards', 'Organiser', 'Contact', 'Review'];

const EditHackathonForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const navigate = useNavigate();
  const { user } = useLocalAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({
    Title: '',
    description: null,
    startDate: '',
    endDate: '',
    isActive: true,
    isCompleted: false,
    type: 'Online',
    minMember: 1,
    maxMember: 5,
    feeType: 'Free',
    feePerMember: 0,
    feePerTeam: 0,
    isFeeForTeam: false,
    competition_category: [''],
    competition_contact: { contactName: '', email: '', phonenumber: '' },
    competition_organiser: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      country: '',
      entityType: 'Individual',
      users_permissions_user: null,
    },
    competition_rewards: [{ title: '', description: '', amount: '', isCash: false, position: '' }],
    competition_timelines: [{ title: '', description: '', startDate: '', endDate: '', type: 'Online' }],
    competition_result: '',
    helpDocs: [],
  });

  // ✅ TipTap editor with JSON output (not HTML)
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px]',
      },
    },
  });

  useEffect(() => {
    if (numericId) fetchHackathonData();
  }, [numericId]);

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  const fetchHackathonData = async () => {
    try {
      setLoading(true);
      const response = await getCompetitionById(numericId);
      const hackathon = response.data?.attributes || response.attributes;

      const timelines =
        hackathon.competition_timelines?.data?.map((t: any) => t.attributes) || [
          { title: '', description: '', startDate: '', endDate: '', type: 'Online' },
        ];

      const rewards =
        hackathon.competition_rewards?.data?.map((r: any) => r.attributes) || [
          { title: '', description: '', amount: '', isCash: false, position: '' },
        ];

      // ✅ Get organiser data with user relation
      const organiserData = hackathon.competition_organiser?.data?.attributes || {};
      const organiserUserId = organiserData.users_permissions_user?.data?.id || user?.id || null;

      setFormData({
        Title: hackathon.Title || '',
        description: hackathon.description || null, // ✅ Keep as JSON
        startDate: hackathon.startDate || '',
        endDate: hackathon.endDate || '',
        isActive: hackathon.isActive ?? true,
        isCompleted: hackathon.isCompleted ?? false,
        type: hackathon.type || 'Online',
        minMember: hackathon.minMember || 1,
        maxMember: hackathon.maxMember || 5,
        feeType: hackathon.feeType || 'Free',
        feePerMember: hackathon.feePerMember || 0,
        feePerTeam: hackathon.feePerTeam || 0,
        isFeeForTeam: hackathon.isFeeForTeam ?? false,
        competition_category: hackathon.competition_category?.data?.id 
          ? [hackathon.competition_category.data.id] 
          : [''],
        competition_contact:
          hackathon.competition_contact?.data?.attributes || { contactName: '', email: '', phonenumber: '' },
        competition_organiser: {
          id: hackathon.competition_organiser?.data?.id || null,
          addressLine1: organiserData.addressLine1 || '',
          addressLine2: organiserData.addressLine2 || '',
          city: organiserData.city || '',
          state: organiserData.state || '',
          pincode: organiserData.pincode || '',
          country: organiserData.country || '',
          entityType: organiserData.entityType || 'Individual',
          users_permissions_user: organiserUserId,
        },
        competition_rewards: rewards,
        competition_timelines: timelines,
        competition_result: hackathon.competition_result || '',
        helpDocs: hackathon.helpDocs || [],
      });

      // ✅ Load description into editor
      if (editor && hackathon.description) {
        if (typeof hackathon.description === 'object' && hackathon.description.content) {
          // TipTap JSON format
          editor.commands.setContent(hackathon.description);
          console.log("✅ Loaded JSON description into editor");
        } else if (typeof hackathon.description === 'string') {
          // Legacy HTML/string format
          editor.commands.setContent(hackathon.description);
          console.log("✅ Loaded string description into editor");
        }
      }
    } catch (err) {
      console.error('Error fetching hackathon:', err);
      toast.error('Failed to load hackathon');
    } finally {
      setLoading(false);
    }
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (parent: string, index: number, value: any, field?: string) => {
    setFormData((prev: any) => {
      const updated = [...(prev[parent] as any[])];
      if (typeof updated[index] !== 'object' || updated[index] === null) updated[index] = {};
      if (field) updated[index] = { ...updated[index], [field]: value };
      else updated[index] = value;
      return { ...prev, [parent]: updated };
    });
  };

  const addArrayItem = (parent: string, item: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [parent]: [...(prev[parent] as any[]), item],
    }));
  };

  const removeArrayItem = (parent: string, index: number) => {
    setFormData((prev: any) => {
      const updated = [...(prev[parent] as any[])];
      updated.splice(index, 1);
      return { ...prev, [parent]: updated };
    });
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSaveClick = async () => {
    try {
      setSaving(true);

      // ✅ Get description from TipTap editor as JSON
      let descriptionToSave = null;
      if (editor) {
        const editorJSON = editor.getJSON();
        // Only save if there's actual content
        if (editorJSON.content && editorJSON.content.length > 0) {
          descriptionToSave = editorJSON;
          console.log("✅ Using TipTap editor JSON content:", editorJSON);
        }
      }

      // ✅ Update or create organiser
      let organiserId = formData.competition_organiser?.id || null;
      
      if (formData.competition_organiser) {
        const organiserPayload = {
          addressLine1: formData.competition_organiser.addressLine1 || '',
          addressLine2: formData.competition_organiser.addressLine2 || '',
          city: formData.competition_organiser.city || '',
          state: formData.competition_organiser.state || '',
          pincode: formData.competition_organiser.pincode || '',
          country: formData.competition_organiser.country || '',
          entityType: formData.competition_organiser.entityType || 'Individual',
          users_permissions_user: user?.id, // ✅ Link to current user
        };

        if (organiserId) {
          // Update existing organiser
          try {
            await makePutRequest(`competition-organisers/${organiserId}`, {
              data: organiserPayload
            });
            console.log("✅ Organiser updated:", organiserId);
          } catch (err) {
            console.error("❌ Organiser update failed:", err);
          }
        } else {
          // Create new organiser
          try {
            const res = await makePostRequest("competition-organisers", {
              data: organiserPayload
            });
            organiserId = res.data.data.id;
            console.log("✅ Organiser created:", organiserId);
          } catch (err) {
            console.error("❌ Organiser creation failed:", err);
          }
        }
      }

      // ✅ Update contact if exists
      let contactId = formData.competition_contact?.id || null;
      if (formData.competition_contact?.email) {
        const contactPayload = {
          contactName: formData.competition_contact.contactName || '',
          email: formData.competition_contact.email || '',
          phonenumber: formData.competition_contact.phonenumber || '',
        };

        if (contactId) {
          try {
            await makePutRequest(`competition-contacts/${contactId}`, {
              data: contactPayload
            });
            console.log("✅ Contact updated:", contactId);
          } catch (err) {
            console.error("❌ Contact update failed:", err);
          }
        } else {
          try {
            const res = await makePostRequest("competition-contacts", {
              data: contactPayload
            });
            contactId = res.data.data.id;
            console.log("✅ Contact created:", contactId);
          } catch (err) {
            console.error("❌ Contact creation failed:", err);
          }
        }
      }

      // ✅ Prepare competition update payload
      const payload = {
        data: {
          Title: formData.Title,
          description: descriptionToSave, // ✅ TipTap JSON format
          startDate: formData.startDate,
          endDate: formData.endDate,
          isActive: formData.isActive,
          isCompleted: formData.isCompleted,
          type: formData.type,
          minMember: formData.minMember,
          maxMember: formData.maxMember,
          feeType: formData.feeType,
          feePerMember: formData.feePerMember,
          feePerTeam: formData.feePerTeam,
          isFeeForTeam: formData.isFeeForTeam,
          competition_category: formData.competition_category?.[0] || null,
          competition_organiser: organiserId,
          competition_contact: contactId,
        },
      };

      console.log("📤 Update payload:", payload);

      await makePutRequest(`competitions/${numericId}`, payload);

      toast.success('Hackathon updated successfully!', {
        onClose: () => navigate('/hackathons-management'),
        autoClose: 2000,
      });
    } catch (err: any) {
      console.error('Error updating:', err);
      const errorMsg = err?.response?.data?.error?.message || err.message;
      toast.error(`Failed to update: ${errorMsg}`);
      setSaving(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

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
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : isActive
                    ? 'border-blue-500 text-blue-500'
                    : 'border-gray-300 text-gray-500'
                }`}
              >
                {current}
              </div>
              <span className="text-xs mt-1">{title}</span>
            </div>
            {current !== steps.length && (
              <div className={`flex-1 h-1 ${current < step ? 'bg-blue-500' : 'bg-gray-300'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

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
        return (
          <OrganizerStep 
            formData={formData} 
            handleNestedChange={handleNestedChange}
            handleChange={handleChange}
          />
        );
      case 5:
        return <ContactStep formData={formData} handleNestedChange={handleNestedChange} />;
      case 6:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  if (loading)
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p className="text-gray-600">Loading hackathon...</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 shadow rounded-lg mt-10">
      <h1 className="text-2xl font-semibold mb-6 text-center">Edit Hackathon</h1>
      {renderStepper()}

      <form onSubmit={handleSubmit} className="space-y-4">
        {renderStepForm()}

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Back
            </button>
          )}

          {step < steps.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveClick}
              disabled={saving}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed ml-auto"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={2000} theme="colored" />
    </div>
  );
};

export default EditHackathonForm;