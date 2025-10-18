import React from "react";

interface Props {
  formData: any;
  handleArrayChange: (
    parent: string,
    index: number,
    value: any,
    field?: string
  ) => void;
  addArrayItem: (parent: string, item: any) => void;
  removeArrayItem: (parent: string, index: number) => void;
}

const TimelineStep: React.FC<Props> = ({
  formData,
  handleArrayChange,
  addArrayItem,
  removeArrayItem,
}) => (
  <>
    {formData.competition_timelines.map((t: any, idx: number) => (
      <div key={idx} className="flex flex-col gap-2 mb-4 border p-3 rounded">
        {/* Title */}
        <input
          type="text"
          placeholder="Timeline title"
          value={t.title}
          onChange={(e) =>
            handleArrayChange(
              "competition_timelines",
              idx,
              e.target.value,
              "title"
            )
          }
          className="p-2 border rounded"
        />

        {/* Description */}
        <textarea
          placeholder="Timeline description"
          value={t.description}
          onChange={(e) =>
            handleArrayChange(
              "competition_timelines",
              idx,
              e.target.value,
              "description"
            )
          }
          className="p-2 border rounded"
        />

        {/* Start / End Date */}
        <div className="grid grid-cols-2 gap-2">
          <input
            type="datetime-local"
            value={t.startDate}
            onChange={(e) =>
              handleArrayChange(
                "competition_timelines",
                idx,
                e.target.value,
                "startDate"
              )
            }
            className="p-2 border rounded"
          />
          <input
            type="datetime-local"
            value={t.endDate}
            onChange={(e) =>
              handleArrayChange(
                "competition_timelines",
                idx,
                e.target.value,
                "endDate"
              )
            }
            className="p-2 border rounded"
          />
        </div>

        {/* Type */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Type</label>
          <select
            value={t.type || "Online"}
            onChange={(e) =>
              handleArrayChange(
                "competition_timelines",
                idx,
                e.target.value,
                "type"
              )
            }
            className="p-2 border rounded"
          >
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => removeArrayItem("competition_timelines", idx)}
          className="bg-red-500 text-white px-2 py-1 rounded self-start"
        >
          ✕ Remove
        </button>
      </div>
    ))}

    {/* Add Button */}
    <button
      type="button"
      onClick={() =>
        addArrayItem("competition_timelines", {
          title: "",
          description: "",
          startDate: "",
          endDate: "",
          type: "Online",
        })
      }
      className="bg-blue-500 text-white px-3 py-1 rounded"
    >
      + Add Timeline
    </button>
  </>
);

export default TimelineStep;

