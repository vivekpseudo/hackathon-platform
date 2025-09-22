import React from 'react';
import { Link } from 'react-router-dom';
import { useCompetitions } from '../hooks/useEvent';
import RichTextRenderer from "../components/RichTextRenderer";
import { NodeType } from "../types/richText";

const HackathonsPage: React.FC = () => {
  const { getCompetitionsData } = useCompetitions();
  const { data, isSuccess } = getCompetitionsData;

  const hackathons = isSuccess && data ? data.map(d => ({ ...d, ...d.attributes })) : [];
  console.log('Fetched competitions data:', hackathons); // Debug log

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Hackathons</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!isSuccess && <p>Loading hackathons...</p>}
        {isSuccess && hackathons.map((hackathon) => (
          <div key={hackathon.id} className="bg-white rounded-md shadow-md p-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">{hackathon.Title}</h2>

            {/* 👇 Render Rich Text JSON instead of plain JSON.stringify */}
            <div className="text-gray-600 mb-3">
              {hackathon.description && (
                <RichTextRenderer nodes={hackathon.description as NodeType[]} />
              )}
            </div>

            <p className="text-sm text-gray-500 mb-1">
              Starts: {new Date(hackathon.startDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500 mb-1">
              Ends: {new Date(hackathon.endDate).toLocaleDateString()}
            </p>
            {hackathon.type && (
              <p className="text-sm text-gray-500 mb-1">Mode: {hackathon.type}</p>
            )}
            {hackathon.prize && (
              <p className="text-sm text-green-600 font-semibold">
                Prize: {hackathon.prize}
              </p>
            )}
            <Link
              to={`/hackathons/${hackathon.id}`}
              className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
export default HackathonsPage;

  