import React from "react";

interface Props {
  formData: any;
  handleNestedChange: (parent: string, field: string, value: any) => void;
}

const ContactStep: React.FC<Props> = ({ formData, handleNestedChange }) => {
  const contact = formData.competition_contact || { contactName: "", email: "", phonenumber: "" };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Contact Name"
        value={contact.contactName}
        onChange={(e) => handleNestedChange("competition_contact", "contactName", e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={contact.email}
        onChange={(e) => handleNestedChange("competition_contact", "email", e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Phone"
        value={contact.phonenumber}
        onChange={(e) => handleNestedChange("competition_contact", "phonenumber", e.target.value)}
        className="p-2 border rounded"
      />
    </div>
  );
};

export default ContactStep;
