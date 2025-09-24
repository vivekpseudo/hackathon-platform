// src/components/RichTextRenderer.tsx
import React, { JSX } from "react";
import { NodeType, TextNode } from "../types/richText";

interface Props {
  nodes: NodeType[];
}

const RichTextRenderer: React.FC<Props> = ({ nodes }) => {
  const renderText = (node: TextNode, key: React.Key) => {
    let element: React.ReactNode = node.text;

    if (node.bold) element = <strong>{element}</strong>;
    if (node.italic) element = <em>{element}</em>;
    if (node.underline) element = <u>{element}</u>;
    if (node.strikethrough) element = <s>{element}</s>;

    return <React.Fragment key={key}>{element}</React.Fragment>;
  };

  const renderNode = (node: NodeType, key: React.Key): React.ReactNode => {
    switch (node.type) {
      case "heading": {
        const level = node.level && node.level >= 1 && node.level <= 6 ? node.level : 3;
        const Tag = `h${level}` as keyof JSX.IntrinsicElements;
        return <Tag key={key}>{node.children.map((c, i) => renderNode(c, `${key}-${i}`))}</Tag>;
      }

      case "paragraph":
        return <p key={key}>{node.children.map((c, i) => renderNode(c, `${key}-${i}`))}</p>;

      case "list": {
        const ListTag = node.format === "ordered" ? "ol" : "ul";
        return <ListTag key={key}>{node.children.map((c, i) => renderNode(c, `${key}-${i}`))}</ListTag>;
      }

      case "list-item":
        return <li key={key}>{node.children.map((c, i) => renderNode(c, `${key}-${i}`))}</li>;

      case "link":
        return (
          <a key={key} href={node.url} target="_blank" rel="noopener noreferrer">
            {node.children.map((c, i) => renderNode(c, `${key}-${i}`))}
          </a>
        );

      case "text":
        return renderText(node as TextNode, key);

      default:
        return null;
    }
  };

  return <div>{nodes.map((n, i) => renderNode(n, i))}</div>;
};

export default RichTextRenderer;
