import React from "react";

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

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md space-y-6 text-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Review Your Competition Details
      </h2>

      {/* Basic Information */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
        <div className="grid grid-cols-2 gap-2">
          <p><strong>Title:</strong> {formData.Title || "—"}</p>
          <p><strong>Type:</strong> {formData.type}</p>
          <p><strong>Start Date:</strong> {formData.startDate || "—"}</p>
          <p><strong>End Date:</strong> {formData.endDate || "—"}</p>
          <p><strong>Active:</strong> {formData.isActive ? "Yes" : "No"}</p>
          <p><strong>Completed:</strong> {formData.isCompleted ? "Yes" : "No"}</p>
        </div>
      </section>

      {/* Category */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Category</h3>
        <p>{categoryMap[formData.competition_category?.[0]] || "—"}</p>
      </section>

      {/* Organiser Information */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Organiser</h3>
        <div className="space-y-1">
          <p><strong>Name:</strong> {formData.competition_organiser?.name || "—"}</p>
          <p><strong>City:</strong> {formData.competition_organiser?.city || "—"}</p>
          <p><strong>Entity Type:</strong> {formData.competition_organiser?.entityType || "Individual"}</p>
        </div>
      </section>

      {/* Contact Information */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Contact</h3>
        <div className="space-y-1">
          <p><strong>Name:</strong> {formData.competition_contact?.contactName || "—"}</p>
          <p><strong>Email:</strong> {formData.competition_contact?.email || "—"}</p>
          <p><strong>Phone:</strong> {formData.competition_contact?.phonenumber || "—"}</p>
        </div>
      </section>

      {/* Rewards */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Rewards</h3>
        {formData.competition_rewards?.length > 0 ? (
          <ul className="list-disc ml-6">
            {formData.competition_rewards.map((r: any, i: number) => (
              <li key={i}>
                <strong>{r.title || "Untitled Reward"}</strong> — {r.description || "No description"}{" "}
                {r.amount && `(${r.amount} ${r.isCash ? "Cash" : ""})`}
              </li>
            ))}
          </ul>
        ) : (
          <p>—</p>
        )}
      </section>

      {/* Timelines */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Timelines</h3>
        {formData.competition_timelines?.length > 0 ? (
          <ul className="list-disc ml-6">
            {formData.competition_timelines.map((t: any, i: number) => (
              <li key={i}>
                <strong>{t.title}</strong> ({t.startDate} → {t.endDate})
              </li>
            ))}
          </ul>
        ) : (
          <p>—</p>
        )}
      </section>

      {/* Description */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <div
          className="border border-gray-300 bg-white rounded-md p-3 prose"
          dangerouslySetInnerHTML={{ __html: formData.description || "<p>—</p>" }}
        />
      </section>
    </div>
  );
};

export default ReviewStep;
