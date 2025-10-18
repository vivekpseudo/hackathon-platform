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

const RewardsStep: React.FC<Props> = ({
  formData,
  handleArrayChange,
  addArrayItem,
  removeArrayItem,
}) => (
  <div className="flex flex-col gap-4">
    {formData.competition_rewards.map((reward: any, idx: number) => (
      <div
        key={idx}
        className="flex flex-col gap-3 mb-3 border border-gray-300 p-4 rounded-lg"
      >
        {/* Reward Position */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Position</label>
          <input
            type="text"
            placeholder="e.g. 1st Place"
            value={reward.position || ""}
            onChange={(e) =>
              handleArrayChange(
                "competition_rewards",
                idx,
                e.target.value,
                "position"
              )
            }
            className="p-2 border rounded"
          />
        </div>

        {/* Reward Title */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Reward Title</label>
          <input
            type="text"
            placeholder="e.g. Gold Medal / Gift Voucher"
            value={reward.title || ""}
            onChange={(e) =>
              handleArrayChange(
                "competition_rewards",
                idx,
                e.target.value,
                "title"
              )
            }
            className="p-2 border rounded"
          />
        </div>

        {/* Reward Amount */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Reward Amount (₹)</label>
          <input
            type="number"
            placeholder="e.g. 1000"
            value={reward.amount || ""}
            onChange={(e) =>
              handleArrayChange(
                "competition_rewards",
                idx,
                e.target.value,
                "amount"
              )
            }
            className="p-2 border rounded"
          />
        </div>

        {/* Is Cash (Boolean toggle) */}
        <div className="flex items-center gap-3">
          <label className="font-semibold">Is Cash Reward?</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name={`isCash-${idx}`}
                checked={reward.isCash === false}
                onChange={() =>
                  handleArrayChange("competition_rewards", idx, false, "isCash")
                }
              />
              False
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name={`isCash-${idx}`}
                checked={reward.isCash === true}
                onChange={() =>
                  handleArrayChange("competition_rewards", idx, true, "isCash")
                }
              />
              True
            </label>
          </div>
        </div>

        {/* Reward Description */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Description</label>
          <textarea
            placeholder="Describe the reward (optional)"
            value={reward.description || ""}
            onChange={(e) =>
              handleArrayChange(
                "competition_rewards",
                idx,
                e.target.value,
                "description"
              )
            }
            className="p-2 border rounded"
          />
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => removeArrayItem("competition_rewards", idx)}
          className="bg-red-500 text-white px-3 py-1 rounded self-start"
        >
          ✕ Remove Reward
        </button>
      </div>
    ))}

    {/* Add Reward Button */}
    <button
      type="button"
      onClick={() =>
        addArrayItem("competition_rewards", {
          position: "",
          title: "",
          amount: "",
          description: "",
          isCash: false,
        })
      }
      className="bg-blue-500 text-white px-3 py-2 rounded self-start"
    >
      + Add Reward
    </button>
  </div>
);

export default RewardsStep;
