import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder data for hackathons assigned to a judge
const assignedHackathons = [
  {
    id: 1,
    title: 'AI Innovation Challenge',
    submissions: [
      { id: 'sub1', title: 'AI-Powered Plant Disease Detector', hackathonId: 1 },
      { id: 'sub2', title: 'Smart City Traffic Management System', hackathonId: 1 },
    ],
  },
  {
    id: 2,
    title: 'Web3 Development Hackathon',
    submissions: [
      { id: 'sub3', title: 'Decentralized Social Media Platform', hackathonId: 2 },
    ],
  },
];

const JudgeDashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Judge Dashboard</h1>
      <p className="text-gray-600 mb-4">Welcome, Judge! Here are the hackathons and submissions assigned to you for evaluation.</p>

      {assignedHackathons.length > 0 ? (
        <ul className="space-y-6">
          {assignedHackathons.map((hackathon) => (
            <li key={hackathon.id} className="bg-white rounded-md shadow-md p-6">
              <h2 className="text-xl font-semibold text-blue-600 mb-2">{hackathon.title}</h2>
              {hackathon.submissions.length > 0 ? (
                <ul>
                  {hackathon.submissions.map((submission) => (
                    <li key={submission.id} className="text-gray-600 mb-2">
                      <Link to={`/submissions/${submission.id}/review`} className="text-blue-500 hover:underline">
                        {submission.title} (Submission ID: {submission.id})
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No submissions to review yet for this hackathon.</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No hackathons or submissions are currently assigned to you.</p>
      )}
    </div>
  );
};

export default JudgeDashboardPage;