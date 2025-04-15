import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder data for all hackathons
const allHackathons = [
  {
    id: 1,
    title: 'Global Innovation Challenge 2025',
    description: 'A worldwide hackathon focused on solving global issues.',
    startDate: '2025-05-15',
    endDate: '2025-05-20',
    location: 'Online',
    prize: '$50,000',
  },
  {
    id: 2,
    title: 'Mobile App Development Hackathon',
    description: 'Build the next great mobile application.',
    startDate: '2025-06-01',
    endDate: '2025-06-07',
    location: 'San Francisco, USA',
    prize: 'Mentorship & Seed Funding',
  },
  {
    id: 3,
    title: 'AI for Healthcare Hackathon',
    description: 'Develop AI solutions to improve healthcare.',
    startDate: '2025-07-10',
    endDate: '2025-07-15',
    location: 'London, UK',
    prize: '£30,000',
  },
  {
    id: 4,
    title: 'Blockchain Innovation Hackathon',
    description: 'Explore the potential of blockchain technology.',
    startDate: '2025-08-01',
    endDate: '2025-08-05',
    location: 'Berlin, Germany',
    prize: 'Sponsorship & Incubation',
  },
  // Add more hackathons here...
];

const HackathonsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Hackathons</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allHackathons.map((hackathon) => (
          <div key={hackathon.id} className="bg-white rounded-md shadow-md p-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">{hackathon.title}</h2>
            <p className="text-gray-600 mb-3">{hackathon.description}</p>
            <p className="text-sm text-gray-500 mb-1">Starts: {new Date(hackathon.startDate).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500 mb-1">Ends: {new Date(hackathon.endDate).toLocaleDateString()}</p>
            {hackathon.location && <p className="text-sm text-gray-500 mb-1">Location: {hackathon.location}</p>}
            {hackathon.prize && <p className="text-sm text-green-600 font-semibold">Prize: {hackathon.prize}</p>}
            <Link to={`/hackathons/${hackathon.id}`} className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HackathonsPage;