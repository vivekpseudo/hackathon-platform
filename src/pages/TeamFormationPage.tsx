import React, { useState, useEffect } from 'react';
import { getTeams } from '../api/competitions';



interface Team {
  id: number;
  attributes: {
    name: string;
    teamLeader: number;
    competition_participants?: {
      data: Array<{
        id: number;
        attributes: {
          name: string;
          email: string;
        };
      }>;
    };
    competitions?: {
      data: Array<{
        id: number;
        attributes: {
          Title: string;
        };
      }>;
    };
  };
}

const TeamFormationPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentLoggedInUser = 'userD'; // Replace with actual user context

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await getTeams(undefined, 0, 100);
      setTeams(response.data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching teams:', err);
      setError('Failed to load teams. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestToJoin = async (teamId: number, teamName: string) => {
    try {
      // TODO: Implement actual API call to request to join team
      console.log(`${currentLoggedInUser} wants to join team ${teamId}`);
      alert(`Request sent to join ${teamName}!`);
      
      // You can add API call here like:
      // await requestToJoinTeam(teamId, currentUserId);
    } catch (err) {
      console.error('Error requesting to join team:', err);
      alert('Failed to send request. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl text-gray-600">Loading teams...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Teams Looking for Members
        </h1>
        <p className="text-gray-600 mb-8">
          Browse teams that are actively seeking new members. Click 'Request to Join' to express your interest.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {teams.length > 0 ? (
          <div className="space-y-6">
            {teams.map((team) => {
              const participants = team.attributes.competition_participants?.data || [];
              const competitions = team.attributes.competitions?.data || [];
              const leader = participants.find(p => p.id === team.attributes.teamLeader);

              return (
                <div
                  key={team.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {team.attributes.name}
                  </h2>

                  {competitions.length > 0 && (
                    <div className="text-sm text-gray-500 mb-3">
                      <span className="font-medium">Competition:</span>{' '}
                      {competitions[0].attributes.Title}
                    </div>
                  )}

                  {leader && (
                    <div className="text-sm text-gray-700 mb-3">
                      <span className="font-medium">Team Leader:</span> {leader.attributes.name}
                    </div>
                  )}

                  {participants.length > 0 && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-700">
                        Current Members ({participants.length}):
                      </span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {participants.map((member) => (
                          <span
                            key={member.id}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                          >
                            {member.attributes.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleRequestToJoin(team.id, team.attributes.name)}
                    className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded transition-colors duration-200"
                  >
                    Request to Join
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600 text-lg">
              No teams are currently looking for members.
            </p>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={() => window.history.back()}
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded transition-colors duration-200"
          >
            ← Back to Hackathons
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamFormationPage;