import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder data for featured hackathons
const featuredHackathons = [
    {
      id: 1,
      title: 'AI Innovation Challenge',
      description: 'Build innovative solutions using artificial intelligence.',
      startDate: '2025-05-10',
    },
    {
      id: 2,
      title: 'Web3 Development Hackathon',
      description: 'Explore the world of decentralized web applications.',
      startDate: '2025-05-25',
    },
    {
      id: 3,
      title: 'Sustainability Hack',
      description: 'Create projects focused on environmental sustainability.',
      startDate: '2025-06-05',
    },
  ];

const HomePage: React.FC = () => {
  // ... (featuredHackathons data remains the same)

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-blue-50 py-16 rounded-md"> {/* Lighter blue background */}
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-blue-700 mb-4">Unleash Your Innovation in Global Hackathons</h1>
          <p className="text-lg text-gray-700 mb-8">Join a vibrant community of developers, designers, and innovators. Discover exciting hackathons and turn your ideas into reality.</p>
          <Link to="/hackathons" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full">
            Explore Hackathons
          </Link>
        </div>
      </section>

      {/* Featured Hackathons Section */}
      <section className="container mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Featured Hackathons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredHackathons.map((hackathon) => (
            <div key={hackathon.id} className="bg-white rounded-md shadow-md p-6"> {/* White card background */}
              <h3 className="text-xl font-semibold text-blue-600 mb-2">{hackathon.title}</h3>
              <p className="text-gray-600 mb-3">{hackathon.description}</p>
              <p className="text-sm text-gray-500">Starts on: {new Date(hackathon.startDate).toLocaleDateString()}</p>
              <Link to={`/hackathons/${hackathon.id}`} className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="bg-gray-50 py-12 rounded-md"> {/* Very light gray background */}
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Join Our Platform?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Discover Opportunities</h3>
              <p className="text-gray-600">Find a wide range of hackathons across various domains and technologies.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Connect with Talent</h3>
              <p className="text-gray-600">Collaborate with other passionate individuals and build your network.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Showcase Your Skills</h3>
              <p className="text-gray-600">Participate in challenges and demonstrate your abilities to a global audience.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
