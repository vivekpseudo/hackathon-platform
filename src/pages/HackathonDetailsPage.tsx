import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetCompetition } from "../hooks/useCompetitions";

const HackathonDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useGetCompetition(numericId);

  if (isLoading) return <p>Loading hackathon details...</p>;
  if (isError) return <p>Error fetching hackathon: {error?.message || "Unknown error"}</p>;
  if (!data) return <p>No hackathon found with this ID.</p>;

  // unwrap Strapi-style response
  const hackathon = data?.data?.attributes || data?.attributes || data;

  // check login helper
  const isLoggedIn = !!localStorage.getItem("authToken");

  const handleRegisterClick = () => {
    if (!isLoggedIn) {
      navigate("/Register");
    } else {
      console.log("User registering for hackathon:", hackathon?.Title);
    }
  };

  const handleJoinClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      console.log("User joining hackathon:", hackathon?.Title);
    }
  };

  return (
    <div className="container mx-auto py-8">
      {/* Title */}
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        {hackathon?.Title || "Untitled Hackathon"}
      </h1>

      {/* Description */}
      {Array.isArray(hackathon?.description) ? (
        hackathon.description.map((block: any, index: number) => (
          <p key={index} className="text-gray-700 mb-2">
            {block.children.map((child: any) => child.text).join(" ")}
          </p>
        ))
      ) : (
        <p className="text-gray-700">{hackathon?.description || "No description available."}</p>
      )}

      {/* Details */}
      <div className="mb-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Details</h2>
        <p className="text-gray-600 mb-1">
          Starts: {hackathon?.startDate ? new Date(hackathon.startDate).toLocaleDateString("en-US") : "TBA"}
        </p>
        <p className="text-gray-600 mb-1">
          Ends: {hackathon?.endDate ? new Date(hackathon.endDate).toLocaleDateString("en-US") : "TBA"}
        </p>
        {hackathon?.type && <p className="text-gray-600 mb-1">Mode: {hackathon.type}</p>}
        {hackathon?.feeType && <p className="text-gray-600 mb-1">Fee Type: {hackathon.feeType}</p>}
      </div>

      {/* Timeline */}
      {hackathon?.competition_timelines?.data?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Timeline</h2>
          <div className="relative border-l-2 border-blue-500 pl-6">
            {hackathon.competition_timelines.data.map((item: any) => (
              <div key={item.id} className="mb-6 relative">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.attributes?.title || "No title"}
                </h3>
                {item.attributes?.description && (
                  <p className="text-gray-600 mb-1">{item.attributes.description}</p>
                )}
                <div className="text-sm text-gray-500">
                  <p>
                    Start:{" "}
                    {item.attributes?.startDate
                      ? new Date(item.attributes.startDate).toLocaleDateString("en-US")
                      : "TBA"}
                  </p>
                  <p>
                    End:{" "}
                    {item.attributes?.endDate
                      ? new Date(item.attributes.endDate).toLocaleDateString("en-US")
                      : "TBA"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rewards */}
      {hackathon?.competition_rewards?.data?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Rewards</h2>
          <ol className="list-decimal list-inside text-gray-600">
            {hackathon.competition_rewards.data.map((reward: any, index: number) => (
              <li key={reward.id}>
                {reward.attributes?.title || `Reward ${index + 1}`}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Organiser */}
      {hackathon?.competition_organiser?.data && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Organiser</h2>
          <p className="text-gray-600">
            {hackathon.competition_organiser.data.attributes?.name ||
              "No organiser information available"}
          </p>
        </div>
      )}

      {/* Contact */}
      {hackathon?.competition_contact?.data && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Contact</h2>
          {hackathon.competition_contact.data.attributes?.contactName && (
            <p className="text-gray-600">{hackathon.competition_contact.data.attributes.contactName}</p>
          )}
          {hackathon.competition_contact.data.attributes?.email && (
            <p className="text-gray-600">{hackathon.competition_contact.data.attributes.email}</p>
          )}
          {hackathon.competition_contact.data.attributes?.phonenumber && (
            <p className="text-gray-600">
              Phone: {hackathon.competition_contact.data.attributes.phonenumber}
            </p>
          )}
        </div>
      )}


      <div className="flex gap-4 mt-6">
        <button
          onClick={handleRegisterClick}
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
        >
          Register
        </button>
        <button
          onClick={handleJoinClick}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Join
        </button>
        <Link
          to="/hackathons"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back
        </Link>
      </div>
    </div>
  );
};

export default HackathonDetailsPage;





