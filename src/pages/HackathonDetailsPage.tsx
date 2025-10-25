import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetCompetition } from "../hooks/useCompetitions";
import { useLocalAuth } from "../context/AuthContext"; 

const HackathonDetailsPage: React.FC = () => {
  
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const navigate = useNavigate();
  const { isAuthenticated } = useLocalAuth();
  const { isAuthenticated } = useLocalAuth();
  const { data, isLoading, isError, error } = useGetCompetition(numericId);

  // NOW you can use conditional returns
  if (isLoading) return <p>Loading hackathon details...</p>;
  if (isError) return <p>Error fetching hackathon: {error?.message || "Unknown error"}</p>;
  if (!data) return <p>No hackathon found with this ID.</p>;

  const hackathon = (data as any)?.data?.attributes || (data as any)?.attributes || (data as any);

    const handleJoinClick = () => {
    // 1) If external → open external URL
    if (hackathon?.isExternal === true && hackathon?.externalUrl) {
      window.open(hackathon.externalUrl, "_blank");
      return;
    }

    // 2) Else normal behavior
    if (!isAuthenticated) {
      navigate("/Register");
    } else {
      navigate(`/hackathon/${numericId}/join`);
      navigate(`/hackathon/${numericId}/join`);
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
          <div className="relative" style={{ paddingLeft: "20px" }}>
            {/* Vertical line - aligned left with page content */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-blue-500"
              style={{ 
                left: "0px", 
                zIndex: 0,
                height: "100%"
              }}
            />

            {/* Timeline items */}
            <div className="space-y-8">
              {hackathon.competition_timelines.data.map((item: any, index: number) => {
                const { title, description, startDate, endDate } = item.attributes || {};
                const isLast = index === hackathon.competition_timelines.data.length - 1;
                const circleColor = isLast ? "#16cc52" : "#3b82f6";

                return (
                  <div key={item.id} className="relative">
                    {/* Circle number - on the line */}
                    <div
                      className="absolute w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm border-2 border-white shadow-md"
                      style={{
                        backgroundColor: circleColor,
                        zIndex: 10,
                        left: "-28px",
                        top: "0px",
                      }}
                    >
                      {index + 1}
                    </div>

                    {/* Content box */}
                    <div
                      className="p-4 rounded-lg border border-gray-200"
                      style={{
                        background: "#f9f9f9",
                        color: "#333",
                      }}
                    >
                      <p className="text-xs text-gray-500 mb-2 font-medium">
                        {startDate ? new Date(startDate).toLocaleDateString() : "TBA"} -{" "}
                        {endDate ? new Date(endDate).toLocaleDateString() : "TBA"}
                      </p>

                      {title && (
                        <h3 className="text-base font-semibold text-gray-800 mb-1">
                          {title}
                        </h3>
                      )}

                      {description && (
                        <p className="text-sm text-gray-600">{description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
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