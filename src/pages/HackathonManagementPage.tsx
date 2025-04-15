import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder data for hackathons
const hackathons = [
  { id: 1, title: 'AI Innovation Challenge', startDate: '2025-05-10', endDate: '2025-05-15' },
  { id: 2, title: 'Web3 Development Hackathon', startDate: '2025-05-25', endDate: '2025-05-30' },
  { id: 3, title: 'Sustainability Hack', startDate: '2025-06-05', endDate: '2025-06-10' },
];

const HackathonManagementPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Hackathon Management</h1>
      <div className="mb-4">
        <Link to="/admin/hackathons/create" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Create New Hackathon
        </Link>
      </div>
      {hackathons.length > 0 ? (
        <ul className="shadow-md rounded-md">
          <li className="bg-gray-100 py-2 px-4 font-semibold grid grid-cols-4">
            <span>Title</span>
            <span>Start Date</span>
            <span>End Date</span>
            <span>Actions</span>
          </li>
          {hackathons.map((hackathon) => (
            <li key={hackathon.id} className="py-2 px-4 grid grid-cols-4 items-center border-b">
              <span>{hackathon.title}</span>
              <span>{new Date(hackathon.startDate).toLocaleDateString()}</span>
              <span>{new Date(hackathon.endDate).toLocaleDateString()}</span>
              <div>
                <Link to={`/admin/hackathons/${hackathon.id}/edit`} className="text-blue-500 hover:underline mr-2">
                  Edit
                </Link>
                <button className="text-red-500 hover:underline">
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