import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder data for teams looking for members
const teamsSeekingMembers = [
    {
      id: 'seeking1',
      name: 'AI Dream Team',
      description: 'We are looking for members with experience in machine learning and computer vision for the AI Innovation Challenge.',
      leader: 'userA',
      neededSkills: ['Python', 'TensorFlow', 'OpenCV'],
      members: ['userA', 'userB'], // Added members
    },
    {
      id: 'seeking2',
      name: 'Web3 Wizards Wanted',
      description: 'Our team is forming for the Web3 Development Hackathon and needs frontend and smart contract developers.',
      leader: 'userC',
      neededSkills: ['React', 'Solidity', 'Ethers.js'],
      members: ['userC'], // Added members
    },
    {
      id: 'seeking3',
      name: 'Sustainable Solutions',
      description: 'We are passionate about sustainability and need creative minds for the Sustainability Hack.',
      leader: 'userE',
      neededSkills: ['UI/UX Design', 'Environmental Science', 'Project Management'],
      members: ['userE', 'userF'], // Added members
    },
  ];
  
  // Simulate the current logged-in user
  const currentLoggedInUser = 'userD';
  
  // Placeholder function (you can keep the existing one)
  const handleRequestToJoin = (teamId) => {
    console.log(`${currentLoggedInUser} wants to join team ${teamId}`);
    alert(`Request sent to join team ${teamId}!`);
  };
  
  const TeamFormationPage: React.FC = () => {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Teams Looking for Members</h1>
        <p className="text-gray-600 mb-4">Browse teams that are actively seeking new members. Click 'Request to Join' to express your interest.</p>
  
        {teamsSeekingMembers.length > 0 ? (
          <ul className="space-y-4">
            {teamsSeekingMembers.map((team) => (
              <li key={team.id} className="bg-white rounded-md shadow-md p-6">
                <h2 className="text-xl font-semibold text-blue-600 mb-2">{team.name}</h2>
                <p className="text-gray-600 mb-3">{team.description}</p>
                <p className="text-sm text-gray-500 mb-2">Leader: {team.leader}</p>
                {team.neededSkills && team.neededSkills.length > 0 && (
                  <p className="text-sm text-gray-500 mb-2">
                    Needed Skills: {team.neededSkills.join(', ')}
                  </p>
                )}
                {team.members && team.members.length > 0 && (
                  <p className="text-sm text-gray-500 mb-2">
                    Current Members: {team.members.join(', ')}
                  </p>
                )}
                <button
                  onClick={() => handleRequestToJoin(team.id)}
                  className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 text-sm"
                >
                  Request to Join
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No teams are currently looking for members.</p>
        )}
  
        <div className="mt-6">
          <Link to="/hackathons" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Back to Hackathons
          </Link>
        </div>
      </div>
    );
  };
  
  export default TeamFormationPage;