import React, { useEffect } from "react";
import { useLocalAuth } from "../../context/AuthContext";

interface Props {
  formData: any;
  handleNestedChange: (parent: string, field: string, value: any) => void;
  handleChange: (field: string, value: any) => void;
}

const OrganizerStep: React.FC<Props> = ({ formData, handleNestedChange, handleChange }) => {
  const { user } = useLocalAuth();

  // ✅ Auto-set the user info reference for competition_organiser
  useEffect(() => {
    if (user?.id) {
      // Always include the logged-in user
      handleNestedChange("competition_organiser", "users_permissions_user", {
        id: user.id,
        username: user.username,
        email: user.email,
      });
    }
  }, [user]);

  const organiser = {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    entityType: "Individual",
    ...(formData.competition_organiser || {}),
  };

  const countryOptions = [
    { code: "IN", name: "India" },
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "SG", name: "Singapore" },
    { code: "JP", name: "Japan" },
    { code: "CN", name: "China" },
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
      {/* Hidden user ID field for relation */}
      <input
        type="hidden"
        value={JSON.stringify(formData.competition_organiser?.users_permissions_user || {})}
      />

    

      {/* Other fields */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Name</label>
        <input
          type="text"
          placeholder="Your Name"
          value={organiser.username || user?.username || ""}
          onChange={(e) =>
            handleNestedChange("competition_organiser", "username", e.target.value)
          }
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-semibold">Email</label>
        <input
          type="email"
          placeholder="Your Email"
          value={organiser.email || user?.email || ""}
          onChange={(e) =>
            handleNestedChange("competition_organiser", "email", e.target.value)
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
            handleNestedChange("competition_organiser", "addressLine1", e.target.value)
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
            handleNestedChange("competition_organiser", "addressLine2", e.target.value)
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
            handleNestedChange("competition_organiser", "pincode", e.target.value)
          }
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Country */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Country</label>
        <select
          value={organiser.country}
          onChange={(e) =>
            handleNestedChange("competition_organiser", "country", e.target.value)
          }
          className="w-full p-2 border rounded bg-white"
        >
          <option value="">Select a country</option>
          {countryOptions.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Entity Type */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Entity Type</label>
        <select
          value={organiser.entityType}
          onChange={(e) =>
            handleNestedChange("competition_organiser", "entityType", e.target.value)
          }
          className="w-full p-2 border rounded bg-white"
        >
          {entityTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default OrganizerStep;
