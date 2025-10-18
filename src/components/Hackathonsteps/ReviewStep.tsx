import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

interface Props {
  formData: any;
}

// Component to render TipTap JSON format
const TipTapRenderer: React.FC<{ content: any }> = ({ content }) => {
  if (!content || typeof content !== 'object') {
    return <p className="text-gray-500">No description available</p>;
  }

  const renderNode = (node: any, index: number): React.ReactNode => {
    if (!node || !node.type) return null;

    // Handle text nodes
    if (node.type === 'text') {
      let text = node.text || '';
      
      if (node.marks) {
        node.marks.forEach((mark: any) => {
          if (mark.type === 'bold') text = <strong key={index}>{text}</strong>;
          if (mark.type === 'italic') text = <em key={index}>{text}</em>;
          if (mark.type === 'underline') text = <u key={index}>{text}</u>;
          if (mark.type === 'strike') text = <s key={index}>{text}</s>;
          if (mark.type === 'code') text = <code key={index} className="bg-gray-100 px-1 rounded">{text}</code>;
        });
      }
      
      return text;
    }

    // Handle paragraph
    if (node.type === 'paragraph') {
      return (
        <p key={index} className="mb-3 text-gray-700">
          {node.content?.map((child: any, idx: number) => renderNode(child, idx))}
        </p>
      );
    }

    // Handle headings
    if (node.type === 'heading') {
      const level = node.attrs?.level || 2;
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
      const className = level === 1 
        ? "text-2xl font-bold mb-3" 
        : level === 2 
        ? "text-xl font-bold mb-2" 
        : "text-lg font-semibold mb-2";
      
      return (
        <Tag key={index} className={className}>
          {node.content?.map((child: any, idx: number) => renderNode(child, idx))}
        </Tag>
      );
    }

    // Handle bullet list
    if (node.type === 'bulletList') {
      return (
        <ul key={index} className="list-disc list-inside mb-3">
          {node.content?.map((child: any, idx: number) => renderNode(child, idx))}
        </ul>
      );
    }

    // Handle ordered list
    if (node.type === 'orderedList') {
      return (
        <ol key={index} className="list-decimal list-inside mb-3">
          {node.content?.map((child: any, idx: number) => renderNode(child, idx))}
        </ol>
      );
    }

    // Handle list item
    if (node.type === 'listItem') {
      return (
        <li key={index} className="mb-1">
          {node.content?.map((child: any, idx: number) => {
            // For list items, we need to extract text from paragraphs
            if (child.type === 'paragraph') {
              return child.content?.map((textNode: any, textIdx: number) => 
                renderNode(textNode, textIdx)
              );
            }
            return renderNode(child, idx);
          })}
        </li>
      );
    }

    // Handle blockquote
    if (node.type === 'blockquote') {
      return (
        <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic my-3">
          {node.content?.map((child: any, idx: number) => renderNode(child, idx))}
        </blockquote>
      );
    }

    // Handle code block
    if (node.type === 'codeBlock') {
      return (
        <pre key={index} className="bg-gray-100 p-3 rounded overflow-x-auto mb-3">
          <code>
            {node.content?.map((child: any, idx: number) => renderNode(child, idx))}
          </code>
        </pre>
      );
    }

    // Handle hard break
    if (node.type === 'hardBreak') {
      return <br key={index} />;
    }

    return null;
  };

  return (
    <div className="prose prose-sm max-w-none">
      {content.content?.map((node: any, index: number) => renderNode(node, index))}
    </div>
  );
};

// Component to render Strapi Blocks format
const BlocksRenderer: React.FC<{ blocks: any }> = ({ blocks }) => {
  if (!blocks || !Array.isArray(blocks)) {
    return <p className="text-gray-500">No description available</p>;
  }

  return (
    <div className="prose prose-sm max-w-none">
      {blocks.map((block: any, idx: number) => {
        if (block.type === "paragraph") {
          return (
            <p key={idx} className="mb-3 text-gray-700">
              {block.children?.map((child: any, childIdx: number) => {
                if (child.bold) {
                  return <strong key={childIdx}>{child.text}</strong>;
                }
                if (child.italic) {
                  return <em key={childIdx}>{child.text}</em>;
                }
                if (child.underline) {
                  return <u key={childIdx}>{child.text}</u>;
                }
                if (child.strikethrough) {
                  return <s key={childIdx}>{child.text}</s>;
                }
                if (child.code) {
                  return <code key={childIdx} className="bg-gray-100 px-1 rounded">{child.text}</code>;
                }
                return <span key={childIdx}>{child.text}</span>;
              })}
            </p>
          );
        }
        
        if (block.type === "heading") {
          const level = block.level || 2;
          const Tag = `h${level}` as keyof JSX.IntrinsicElements;
          const text = block.children?.map((child: any) => child.text).join("");
          const className = level === 1 
            ? "text-2xl font-bold mb-3" 
            : level === 2 
            ? "text-xl font-bold mb-2" 
            : "text-lg font-semibold mb-2";
          
          return React.createElement(Tag, { key: idx, className }, text);
        }
        
        if (block.type === "list") {
          const ListTag = block.format === "ordered" ? "ol" : "ul";
          const listClass = block.format === "ordered" 
            ? "list-decimal list-inside mb-3" 
            : "list-disc list-inside mb-3";
          
          return (
            <ListTag key={idx} className={listClass}>
              {block.children?.map((item: any, itemIdx: number) => (
                <li key={itemIdx} className="mb-1">
                  {item.children?.map((child: any) => child.text).join("")}
                </li>
              ))}
            </ListTag>
          );
        }
        
        if (block.type === "quote") {
          return (
            <blockquote key={idx} className="border-l-4 border-gray-300 pl-4 italic my-3">
              {block.children?.map((child: any) => child.text).join("")}
            </blockquote>
          );
        }
        
        if (block.type === "code") {
          return (
            <pre key={idx} className="bg-gray-100 p-3 rounded overflow-x-auto mb-3">
              <code>{block.children?.map((child: any) => child.text).join("")}</code>
            </pre>
          );
        }
        
        return null;
      })}
    </div>
  );
};

const ReviewStep: React.FC<Props> = ({ formData }) => {
  const categoryMap: Record<number, string> = {
    1: "Hackathon",
    2: "Conference",
    3: "Workshop",
    4: "Competition",
  };

  // Render description based on format
  const renderDescription = () => {
    if (!formData?.description) {
      return <p className="text-gray-500">No description available</p>;
    }

    // If description is a string
    if (typeof formData.description === "string") {
      return <p className="text-gray-700">{formData.description}</p>;
    }

    // If description is an object (check for TipTap or Strapi Blocks format)
    if (typeof formData.description === "object") {
      // TipTap format has a 'type' field at root level with value 'doc'
      if (formData.description.type === 'doc') {
        return <TipTapRenderer content={formData.description} />;
      }
      
      // Strapi Blocks format is an array
      if (Array.isArray(formData.description)) {
        return <BlocksRenderer blocks={formData.description} />;
      }
    }

    return <p className="text-gray-500">Description format not recognized</p>;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Title */}
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        {formData?.Title || "Untitled Hackathon"}
      </h1>

      {/* Description */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
        {renderDescription()}
      </div>

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