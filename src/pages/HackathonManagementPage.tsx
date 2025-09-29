import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Placeholder hackathon data
const initialHackathons = [
  { id: 1, title: 'AI Innovation Challenge', startDate: '2025-05-10', endDate: '2025-05-15' },
  { id: 2, title: 'Web3 Development Hackathon', startDate: '2025-05-25', endDate: '2025-05-30' },
  { id: 3, title: 'Sustainability Hack', startDate: '2025-06-05', endDate: '2025-06-10' },
];

const HackathonManagementPage: React.FC = () => {
  const [hackathons, setHackathons] = useState(initialHackathons);

  const handleDeleteHackathon = (id: number) => {
    if (window.confirm('Are you sure you want to delete this hackathon?')) {
      setHackathons(hackathons.filter((h) => h.id !== id));
      alert(`Hackathon with ID ${id} deleted!`);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Hackathon Management</h1>

      <div className="mb-4">
        <Link
          to="/hackathons-management/create"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Create New Hackathon
        </Link>
      </div>

      {hackathons.length > 0 ? (
        <ul className="space-y-4">
          {hackathons.map((hackathon) => (
            <li
              key={hackathon.id}
              className="bg-white rounded-md shadow-md p-6 flex items-center justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-blue-600">{hackathon.title}</h2>
                <p className="text-sm text-gray-500">
                  Starts: {new Date(hackathon.startDate).toLocaleDateString()} - Ends:{' '}
                  {new Date(hackathon.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/hackathons-management/${hackathon.id}/edit`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteHackathon(hackathon.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No hackathons created yet.</p>
      )}
    </div>
  );
};

export default HackathonManagementPage;
