import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { makeGetRequest } from "../libs/axios";

interface Hackathon {
  id: number;
  attributes: {
    Title: string;
    description: any;
    startDate: string;
    publishedAt: string;
    createdAt: string;
  };
}

const HomePage: React.FC = () => {
  const [featuredHackathons, setFeaturedHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentHackathons();
  }, []);

  const fetchRecentHackathons = async () => {
    try {
      setLoading(true);
      // Fetch recently published hackathons, sorted by creation date, limit to 3
      const response = await makeGetRequest(
        '/competitions?filters[publishedAt][$notNull]=true&sort[0]=createdAt:desc&pagination[limit]=3'
      );
      
      const hackathons = (response as any)?.data || [];
      setFeaturedHackathons(hackathons);
    } catch (error) {
      console.error('Error fetching hackathons:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract description text
  const getDescriptionText = (description: any): string => {
    if (!description) return "No description available";
    
    if (typeof description === 'string') return description;
    
    if (typeof description === 'object' && description.content) {
      // TipTap JSON format
      const text = description.content
        .map((node: any) => 
          node.content?.map((child: any) => child.text).join(' ') || ''
        )
        .join(' ')
        .trim();
      return text || "No description available";
    }
    
    if (Array.isArray(description)) {
      // Strapi rich text format
      return description
        .map((block: any) => 
          block.children?.map((child: any) => child.text).join(' ') || ''
        )
        .join(' ')
        .trim() || "No description available";
    }
    
    return "No description available";
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-blue-50 py-16 px-8 rounded-md shadow-md">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-blue-700 mb-4">
            Unleash Your Innovation in Global Hackathons
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Join a vibrant community of developers, designers, and innovators.
            Discover exciting hackathons and turn your ideas into reality.
          </p>
          <Link
            to="/hackathons"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full"
          >
            Explore Hackathons
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 p-8 rounded-md shadow-md grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-4xl font-bold text-blue-700 mb-4">
            Why InnoThon?
          </h1>
          <p className="text-lg text-justify text-gray-700">
            InnoThon is your gateway to an immersive hackathon experience!
            Designed for innovators, creators, and change-makers, InnoThon
            brings together minds from around the globe to brainstorm, build,
            and showcase groundbreaking ideas. Whether you're coding a solution,
            designing a prototype, or brainstorming the next big idea, InnoThon
            ensures you have everything you need to succeed.
          </p>
          <p className="text-lg text-justify text-gray-700 mt-4">
            Join us in this exciting journey of innovation and collaboration.
            Together, we can create solutions that make a difference!
          </p>
        </div>
        <div className="home-page" />
      </section>

      {/* Featured Hackathons Section */}
      <section className="container mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Featured Hackathons
        </h2>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading hackathons...</p>
          </div>
        ) : featuredHackathons.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No hackathons available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHackathons.map((hackathon) => (
              <div
                key={hackathon.id}
                className="bg-white rounded-md shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-blue-600 mb-2">
                  {hackathon.attributes.Title}
                </h3>
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {getDescriptionText(hackathon.attributes.description)}
                </p>
                <p className="text-sm text-gray-500">
                  Starts on: {new Date(hackathon.attributes.startDate).toLocaleDateString()}
                </p>
                <Link
                  to={`/hackathons/${hackathon.id}`}
                  className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Why Join Us Section */}
      <section className="bg-gray-50 py-12 px-8 rounded-md shadow-md">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Why Join Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                Discover Opportunities
              </h3>
              <p className="text-gray-600">
                Find a wide range of hackathons across various domains and
                technologies.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                Connect with Talent
              </h3>
              <p className="text-gray-600">
                Collaborate with other passionate individuals and build your
                network.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                Showcase Your Skills
              </h3>
              <p className="text-gray-600">
                Participate in challenges and demonstrate your abilities to a
                global audience.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

