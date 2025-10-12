import React from "react";

interface Props {
  formData: any;
  handleNestedChange: (parent: string, field: string, value: any) => void;
}

const OrganizerStep: React.FC<Props> = ({ formData, handleNestedChange }) => {
  // Ensure organiser object exists with all default fields
  const organiser = {
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    entityType: "Individual",
    ...(formData.competition_organiser || {}),
  };

  // Options for dropdowns
  const countryOptions = [
    "India",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Singapore",
    "Japan",
    "China",
  ];

  const entityTypes = [
    "Individual",
    "Company",
    "Organization",
    "Startup",
    "Institution",
    "Non-Profit",
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Organiser Name */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Organiser Name</label>
        <input
          type="text"
          placeholder="Enter organiser name"
          value={organiser.name}
          onChange={(e) =>
            handleNestedChange("competition_organiser", "name", e.target.value)
          }
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Address Line 1 */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Address Line 1</label>
        <input
          type="text"
          placeholder="Address Line 1"
          value={organiser.addressLine1}
          onChange={(e) =>
            handleNestedChange(
              "competition_organiser",
              "addressLine1",
              e.target.value
            )
          }
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Address Line 2 */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Address Line 2</label>
        <input
          type="text"
          placeholder="Address Line 2"
          value={organiser.addressLine2}
          onChange={(e) =>
            handleNestedChange(
              "competition_organiser",
              "addressLine2",
              e.target.value
            )
          }
          className="w-full p-2 border rounded"
        />
      </div>

      {/* City */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">City</label>
        <input
          type="text"
          placeholder="City"
          value={organiser.city}
          onChange={(e) =>
            handleNestedChange("competition_organiser", "city", e.target.value)
          }
          className="w-full p-2 border rounded"
        />
      </div>

      {/* State */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">State</label>
        <input
          type="text"
          placeholder="State"
          value={organiser.state}
          onChange={(e) =>
            handleNestedChange("competition_organiser", "state", e.target.value)
          }
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Pincode */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Pincode</label>
        <input
          type="text"
          placeholder="Pincode"
          value={organiser.pincode}
          onChange={(e) =>
            handleNestedChange(
              "competition_organiser",
              "pincode",
              e.target.value
            )
          }
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Country Dropdown */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Country</label>
        <select
          value={organiser.country}
          onChange={(e) =>
            handleNestedChange(
              "competition_organiser",
              "country",
              e.target.value
            )
          }
          className="w-full p-2 border rounded bg-white"
        >
          <option value="">Select or enter a value</option>
          {countryOptions.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {/* Entity Type Dropdown */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Entity Type</label>
        <select
          value={organiser.entityType}
          onChange={(e) =>
            handleNestedChange(
              "competition_organiser",
              "entityType",
              e.target.value
            )
          }
          className="w-full p-2 border rounded bg-white"
        >
          {entityTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default OrganizerStep;
