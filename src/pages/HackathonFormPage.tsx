import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// Placeholder function to simulate fetching a hackathon for editing
const fetchHackathon = (id) => {
  return hackathons.find((h) => h.id === parseInt(id));
};

// Placeholder data (same as in HackathonManagementPage for now)
const hackathons = [
  { id: 1, title: 'AI Innovation Challenge', startDate: '2025-05-10T00:00', endDate: '2025-05-15T23:59' },
  { id: 2, title: 'Web3 Development Hackathon', startDate: '2025-05-25T00:00', endDate: '2025-05-30T23:59' },
  { id: 3, title: 'Sustainability Hack', startDate: '2025-06-05T00:00', endDate: '2025-06-10T23:59' },
];

const HackathonFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const initialHackathon = isEditing ? fetchHackathon(id) : { title: '', startDate: '', endDate: '' };

  const [title, setTitle] = useState(initialHackathon?.title || '');
  const [startDate, setStartDate] = useState(initialHackathon?.startDate ? initialHackathon.startDate.slice(0, 16) : '');
  const [endDate, setEndDate] = useState(initialHackathon?.endDate ? initialHackathon.endDate.slice(0, 16) : '');

  useEffect(() => {
    if (isEditing && !initialHackathon) {
      // Redirect if trying to edit a non-existent hackathon (in placeholder data)
      navigate('/admin/hackathons');
    }
  }, [isEditing, initialHackathon, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const hackathonData = { title, startDate, endDate };
    if (isEditing) {
      // In a real app, you would send an update request to the backend
      console.log('Hackathon updated:', id, hackathonData);
      alert(`Hackathon with ID ${id} updated!`);
    } else {
      // In a real app, you would send a create request to the backend
      console.log('New hackathon created:', hackathonData);
      alert('New hackathon created!');
    }
    navigate('/admin/hackathons');
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{isEditing ? 'Edit Hackathon' : 'Create New Hackathon'}</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow-md rounded-md p-6">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-gray-700 text-sm font-bold mb-2">
            Start Date and Time
          </label>
          <input
            type="datetime-local"
            id="startDate"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="endDate" className="block text-gray-700 text-sm font-bold mb-2">
            End Date and Time
          </label>
          <input
            type="datetime-local"
            id="endDate"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isEditing ? 'Save Changes' : 'Create Hackathon'}
          </button>
          <Link to="/admin/hackathons" className="inline-block align-baseline font-semibold text-blue-500 hover:text-blue-800">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default HackathonFormPage;