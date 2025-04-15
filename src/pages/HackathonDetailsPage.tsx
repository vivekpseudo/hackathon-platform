import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// Placeholder data for all hackathons (including team info)
const allHackathonsWithTeams = [
  {
    id: 1,
    title: 'Global Innovation Challenge 2025',
    description: 'A worldwide hackathon focused on solving global issues.',
    startDate: '2025-05-15',
    endDate: '2025-05-20',
    location: 'Online',
    prize: '$50,000',
    rules: ['Teams of 2-5 members are allowed.', 'Projects must be submitted by the deadline.', 'Winners will be judged based on innovation, impact, and feasibility.'],
    timeline: [
      { date: '2025-05-15', event: 'Hackathon Begins' },
      { date: '2025-05-18', event: 'Mid-point Check-in' },
      { date: '2025-05-20', event: 'Submission Deadline' },
      { date: '2025-05-25', event: 'Winners Announced' },
    ],
    faqs: [
      { question: 'Can individuals participate?', answer: 'Yes, you can participate individually or as part of a team.' },
      { question: 'Is there a registration fee?', answer: 'No, registration for this hackathon is completely free.' },
    ],
    teams: [
      { id: 'team1', name: 'The Innovators', members: ['userA', 'userB'] },
      { id: 'team2', name: 'Code Wizards', members: ['userC'] },
    ],
  },
  {
    id: 2,
    title: 'Mobile App Development Hackathon',
    description: 'Build the next great mobile application.',
    startDate: '2025-06-01',
    endDate: '2025-06-07',
    location: 'San Francisco, USA',
    prize: 'Mentorship & Seed Funding',
    rules: ['Apps must be developed for either iOS or Android.', 'Use of third-party libraries is permitted.', 'Final submissions must include a working prototype and a short presentation.'],
    timeline: [
      { date: '2025-06-01', event: 'Hackathon Launch' },
      { date: '2025-06-03', event: 'Workshop: UI/UX Design' },
      { date: '2025-06-07', event: 'Final Submission & Judging' },
    ],
    faqs: [
      { question: 'Can we use cross-platform frameworks?', answer: 'Yes, you are welcome to use frameworks like React Native or Flutter.' },
      { question: 'Will there be mentors available?', answer: 'Yes, experienced mentors will be available to provide guidance.' },
    ],
    teams: [], // No teams yet for this hackathon
  },
  // ... more hackathons
];

// Simulate a logged-in user
const currentLoggedInUser = 'userD';

const HackathonDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const hackathonId = parseInt(id);
  const hackathon = allHackathonsWithTeams.find((h) => h.id === hackathonId);
  const [newTeamName, setNewTeamName] = useState('');

  if (!hackathon) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Hackathon Not Found</h1>
        <p className="text-gray-600">The hackathon with ID {hackathonId} could not be found.</p>
        <Link to="/hackathons" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
          Back to Hackathons
        </Link>
      </div>
    );
  }

  const handleCreateTeam = (event) => {
    event.preventDefault();
    if (newTeamName.trim() !== '') {
      // In a real application, you would send this to a backend to create a new team
      console.log(`Team "${newTeamName}" created by ${currentLoggedInUser} for hackathon ${hackathon.id}`);
      alert(`Team "${newTeamName}" created!`);
      setNewTeamName('');
      // You would also need to update the local state or refetch data
    } else {
      alert('Team name cannot be empty.');
    }
  };

  const handleJoinTeam = (teamId) => {
    // In a real application, you would send a request to the backend to add the current user to the team
    console.log(`${currentLoggedInUser} wants to join team ${teamId} for hackathon ${hackathon.id}`);
    alert(`Request sent to join team ${teamId}!`);
    // You would also need to update the local state or refetch data
  };

  const handleProjectSubmit = (event) => {
    event.preventDefault();
    const projectTitle = event.target.projectTitle.value;
    const projectDescription = event.target.projectDescription.value;
    const projectLink = event.target.projectLink.value;

    // In a real application, you would send this data to a backend
    console.log('Project submitted:', {
      hackathonId: hackathon.id,
      title: projectTitle,
      description: projectDescription,
      link: projectLink,
      submittedBy: currentLoggedInUser, // Assuming we know the logged-in user
    });
    alert('Project submitted successfully!');
    // You might want to redirect the user or show a confirmation message
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">{hackathon.title}</h1>
      <p className="text-lg text-gray-700 mb-6">{hackathon.description}</p>

      {/* Details, Rules, Timeline, FAQs (as before) */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Details</h2>
        <p className="text-gray-600 mb-1">Starts: {new Date(hackathon.startDate).toLocaleDateString()}</p>
        <p className="text-gray-600 mb-1">Ends: {new Date(hackathon.endDate).toLocaleDateString()}</p>
        {hackathon.location && <p className="text-gray-600 mb-1">Location: {hackathon.location}</p>}
        {hackathon.prize && <p className="text-green-600 font-semibold">Prize: {hackathon.prize}</p>}
      </div>

      {hackathon.rules && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Rules</h2>
          <ul className="list-disc list-inside text-gray-600">
            {hackathon.rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
        </div>
      )}

      {hackathon.timeline && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Timeline</h2>
          <ul className="list-none text-gray-600">
            {hackathon.timeline.map((item) => (
              <li key={item.date} className="mb-1">
                <span className="font-semibold">{new Date(item.date).toLocaleDateString()}:</span> {item.event}
              </li>
            ))}
          </ul>
        </div>
      )}

      {hackathon.faqs && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Frequently Asked Questions</h2>
          {hackathon.faqs.map((faq, index) => (
            <div key={index} className="mb-2">
              <p className="font-semibold text-gray-700">{faq.question}</p>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      )}

      {/* Team Formation Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Teams</h2>
        {hackathon.teams && hackathon.teams.length > 0 ? (
          <ul className="list-disc list-inside text-gray-600 mb-4 gap-2">
            {hackathon.teams.map((team) => (
              <li key={team.id} className="flex items-center justify-between mb-4">
              <span>
                {team.name} ({team.members.length} members)
              </span>
              <button onClick={() => handleJoinTeam(team.id)} className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ml-2 text-sm">
                Join Team
              </button>
            </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 mb-4">No teams have been formed yet for this hackathon.</p>
        )}

        {/* Create New Team Form */}
        <div className="bg-gray-100 rounded-md p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Create a New Team</h3>
          <form onSubmit={handleCreateTeam} className="flex items-center">
            <input
              type="text"
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              placeholder="Enter team name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create Team
            </button>
          </form>
        </div>
      </div>

{/* Submission Section */}
<div className="mt-8 bg-gray-100 rounded-md p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Submit Your Project</h2>
        <form onSubmit={handleProjectSubmit}>
          <div className="mb-4">
            <label htmlFor="projectTitle" className="block text-gray-700 text-sm font-bold mb-2">
              Project Title
            </label>
            <input
              type="text"
              id="projectTitle"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="projectDescription" className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              id="projectDescription"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={4}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="projectLink" className="block text-gray-700 text-sm font-bold mb-2">
              Project Link (e.g., GitHub Repo, Live Demo)
            </label>
            <input
              type="url"
              id="projectLink"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit Project
          </button>
        </form>
      </div>

      <Link to="/hackathons" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6">
        Back to Hackathons
      </Link>
    </div>
  );
};

export default HackathonDetailsPage;