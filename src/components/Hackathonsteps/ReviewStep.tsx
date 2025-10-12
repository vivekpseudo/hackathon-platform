import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

interface Props {
  formData: any;
}

const ReviewStep: React.FC<Props> = ({ formData }) => {
  const categoryMap: Record<number, string> = {
    1: "Hackathon",
    2: "Conference",
    3: "Workshop",
    4: "Competition",
  };

  const getDescriptionText = () => {
    if (!formData?.description) return "No description available.";
    if (typeof formData.description === "string") {
      return formData.description.replace(/<[^>]*>/g, '').trim();
    }
    return "No description available.";
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Title */}
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        {formData?.Title || "Untitled Hackathon"}
      </h1>

      {/* Description */}
      <p className="text-gray-700 mb-6">
        {getDescriptionText()}
      </p>

      {/* Details */}
      <div className="mb-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Details</h2>
        <p className="text-gray-600 mb-1">
          Starts: {formData?.startDate ? new Date(formData.startDate).toLocaleDateString("en-US") : "TBA"}
        </p>
        <p className="text-gray-600 mb-1">
          Ends: {formData?.endDate ? new Date(formData.endDate).toLocaleDateString("en-US") : "TBA"}
        </p>
        {formData?.type && <p className="text-gray-600 mb-1">Mode: {formData.type}</p>}
        {formData?.feeType && <p className="text-gray-600 mb-1">Fee Type: {formData.feeType}</p>}
      </div>

      {/* Team & Fee Settings */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Team & Fee Settings</h2>
        <p className="text-gray-600 mb-1">Min Members: {formData?.minMember || "—"}</p>
        <p className="text-gray-600 mb-1">Max Members: {formData?.maxMember || "—"}</p>
        {formData?.feePerMember > 0 && <p className="text-gray-600 mb-1">Fee Per Member: ₹{formData.feePerMember}</p>}
        {formData?.feePerTeam > 0 && <p className="text-gray-600 mb-1">Fee Per Team: ₹{formData.feePerTeam}</p>}
        <p className="text-gray-600 mb-1">Is Fee For Team: {formData?.isFeeForTeam ? "Yes" : "No"}</p>
      </div>

      {/* Status */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Status</h2>
        <p className="text-gray-600 mb-1">Active: {formData?.isActive ? "Yes" : "No"}</p>
        <p className="text-gray-600 mb-1">Completed: {formData?.isCompleted ? "Yes" : "No"}</p>
      </div>

      {/* Category */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Category</h2>
        <p className="text-gray-600">
          {categoryMap[formData?.competition_category?.[0]] || "—"}
        </p>
      </div>

      {/* Timeline */}
      {formData?.competition_timelines?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Timeline</h2>
          <div className="relative left-[-35px]">
            <VerticalTimeline
              layout="1-column"
              lineColor="#3b82f6"
              className="!ml-0"
            >
              {formData.competition_timelines.map((item: any, index: number) => {
                const circleColor =
                  index === formData.competition_timelines.length - 1
                    ? "#16cc52"
                    : "#3b82f6";

                return (
                  <VerticalTimelineElement
                    key={index}
                    date={`${item.startDate ? new Date(item.startDate).toLocaleDateString() : "TBA"} - ${item.endDate ? new Date(item.endDate).toLocaleDateString() : "TBA"}`}
                    icon={
                      <div className="flex items-center justify-center w-full h-full font-semibold text-white">
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
                      padding: "8px 12px",
                      borderRadius: "8px",
                    }}
                    contentArrowStyle={{
                      borderRight: "5px solid #f9f9f9",
                    }}
                  >
                    {item.title && (
                      <h3 className="text-base font-semibold text-gray-800 mb-1">
                        {item.title}
                      </h3>
                    )}
                    {item.description && (
                      <p className="text-sm text-gray-600">{item.description}</p>
                    )}
                  </VerticalTimelineElement>
                );
              })}
            </VerticalTimeline>
          </div>
        </div>
      )}

      {/* Rewards */}
      {formData?.competition_rewards?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Rewards</h2>
          <ol className="list-decimal list-inside text-gray-600">
            {formData.competition_rewards.map((reward: any, index: number) => (
              <li key={index} className="mb-2">
                <span className="font-semibold">{reward.title || `Reward ${index + 1}`}</span>
                {reward.description && ` — ${reward.description}`}
                {reward.amount && ` (₹${reward.amount})`}
                {reward.position && ` - Position ${reward.position}`}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Organiser */}
      {formData?.competition_organiser?.name && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Organiser</h2>
          <p className="text-gray-600 mb-1">
            <strong>Name:</strong> {formData.competition_organiser.name}
          </p>
          {formData.competition_organiser.addressLine1 && (
            <p className="text-gray-600 mb-1">
              <strong>Address:</strong> {formData.competition_organiser.addressLine1}
              {formData.competition_organiser.addressLine2 && `, ${formData.competition_organiser.addressLine2}`}
            </p>
          )}
          {formData.competition_organiser.city && (
            <p className="text-gray-600 mb-1">
              <strong>City:</strong> {formData.competition_organiser.city}
            </p>
          )}
          {formData.competition_organiser.state && (
            <p className="text-gray-600 mb-1">
              <strong>State:</strong> {formData.competition_organiser.state}
            </p>
          )}
          {formData.competition_organiser.pincode && (
            <p className="text-gray-600 mb-1">
              <strong>Pincode:</strong> {formData.competition_organiser.pincode}
            </p>
          )}
          {formData.competition_organiser.country && (
            <p className="text-gray-600 mb-1">
              <strong>Country:</strong> {formData.competition_organiser.country}
            </p>
          )}
          {formData.competition_organiser.entityType && (
            <p className="text-gray-600 mb-1">
              <strong>Entity Type:</strong> {formData.competition_organiser.entityType}
            </p>
          )}
        </div>
      )}

      {/* Contact */}
      {formData?.competition_contact?.email && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Contact</h2>
          {formData.competition_contact.contactName && (
            <p className="text-gray-600 mb-1">
              <strong>Name:</strong> {formData.competition_contact.contactName}
            </p>
          )}
          {formData.competition_contact.email && (
            <p className="text-gray-600 mb-1">
              <strong>Email:</strong> {formData.competition_contact.email}
            </p>
          )}
          {formData.competition_contact.phonenumber && (
            <p className="text-gray-600 mb-1">
              <strong>Phone:</strong> {formData.competition_contact.phonenumber}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewStep;