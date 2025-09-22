// src/types/richText.ts
export type TextNode = {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
};

export type LinkNode = {
  type: "link";
  url: string;
  children: NodeType[];
};

export type ParagraphNode = {
  type: "paragraph";
  children: NodeType[];
};

export type HeadingNode = {
  type: "heading";
  level?: number;
  children: NodeType[];
};

export type ListItemNode = {
  type: "list-item";
  children: NodeType[];
};

export type ListNode = {
  type: "list";
  format: "ordered" | "unordered";
  children: NodeType[];
};

export type NodeType =
  | TextNode
  | LinkNode
  | ParagraphNode
  | HeadingNode
  | ListItemNode
  | ListNode;
