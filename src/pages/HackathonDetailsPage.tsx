import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetCompetition } from "../hooks/useCompetitions";
import { isAuthenticated } from "../libs/storageHelper";

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

const HackathonDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useGetCompetition(numericId);

  if (isLoading) return <p>Loading hackathon details...</p>;
  if (isError) return <p>Error fetching hackathon: {error?.message || "Unknown error"}</p>;
  if (!data) return <p>No hackathon found with this ID.</p>;

  const hackathon = data?.data?.attributes || data?.attributes || data;

  const handleJoinClick = () => {
    if (!isAuthenticated()) {
      navigate("/login");
    } else {
      alert(`✅ Thank you for joining ${hackathon?.Title || "the hackathon"} 🎉`);
    }
  };

  return (
    <div className="container mx-auto py-6 px-2 sm:px-4">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-3">
        {hackathon?.Title || "Untitled Hackathon"}
      </h1>

      {/* Description */}
      <div className="mb-4 text-sm sm:text-base text-gray-700">
        {Array.isArray(hackathon?.description)
          ? hackathon.description.map((block: any, idx: number) => (
              <p key={idx} className="mb-1">
                {block.children.map((child: any) => child.text).join(" ")}
              </p>
            ))
          : <p>{hackathon?.description || "No description available."}</p>}
      </div>

      {/* Details */}
      <div className="mb-4 text-gray-600 text-sm">
        <h2 className="font-semibold mb-1 text-gray-800">Details</h2>
        <p>Starts: {hackathon?.startDate ? new Date(hackathon.startDate).toLocaleDateString() : "TBA"}</p>
        <p>Ends: {hackathon?.endDate ? new Date(hackathon.endDate).toLocaleDateString() : "TBA"}</p>
        {hackathon?.type && <p>Mode: {hackathon.type}</p>}
        {hackathon?.feeType && <p>Fee Type: {hackathon.feeType}</p>}
      </div>

      {/* Timeline */}
      {hackathon?.competition_timelines?.data?.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Timeline</h2>
          <VerticalTimeline layout="1-column" lineColor="#3b82f6">
            {hackathon.competition_timelines.data.map((item: any, index: number) => {
              const { title, description, startDate, endDate } = item.attributes || {};
              const circleColor =
                index === hackathon.competition_timelines.data.length - 1 ? "#16cc52" : "#3b82f6";

              return (
                <VerticalTimelineElement
                  key={item.id}
                  date={`${startDate ? new Date(startDate).toLocaleDateString() : "TBA"} - ${
                    endDate ? new Date(endDate).toLocaleDateString() : "TBA"
                  }`}
                  icon={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                      }}
                    >
                      {index + 1}
                    </div>
                  }
                  iconStyle={{
                    backgroundColor: circleColor,
                    color: "#fff",
                    border: "2px solid #fff",
                  }}
                  contentStyle={{
                    background: "#f9f9f9",
                    color: "#333",
                    padding: "6px 10px",
                    fontSize: "0.8rem",
                  }}
                  contentArrowStyle={{
                    borderRight: "5px solid #f9f9f9",
                  }}
                >
                  {title && <h3 style={{ fontSize: "0.85rem", margin: "0" }}>{title}</h3>}
                  {description && <p style={{ fontSize: "0.75rem", margin: "2px 0 0 0" }}>{description}</p>}
                </VerticalTimelineElement>
              );
            })}
          </VerticalTimeline>
        </div>
      )}

      {/* Rewards */}
      {hackathon?.competition_rewards?.data?.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Rewards</h2>
          <ol className="list-decimal list-inside text-gray-600 text-sm">
            {hackathon.competition_rewards.data.map((reward: any, idx: number) => (
              <li key={reward.id}>{reward.attributes?.title || `Reward ${idx + 1}`}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Organiser */}
      {hackathon?.competition_organiser?.data && (
        <div className="mb-4 text-gray-600 text-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Organiser</h2>
          <p>{hackathon.competition_organiser.data.attributes?.name || "No organiser info"}</p>
        </div>
      )}

      {/* Contact */}
      {hackathon?.competition_contact?.data && (
        <div className="mb-4 text-gray-600 text-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Contact</h2>
          {hackathon.competition_contact.data.attributes?.contactName && (
            <p>{hackathon.competition_contact.data.attributes.contactName}</p>
          )}
          {hackathon.competition_contact.data.attributes?.email && (
            <p>{hackathon.competition_contact.data.attributes.email}</p>
          )}
          {hackathon.competition_contact.data.attributes?.phonenumber && (
            <p>Phone: {hackathon.competition_contact.data.attributes.phonenumber}</p>
          )}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleJoinClick}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm"
        >
          Join
        </button>
        <Link
          to="/hackathons"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded text-sm"
        >
          Back
        </Link>
      </div>
    </div>
  );
};

export default HackathonDetailsPage;








