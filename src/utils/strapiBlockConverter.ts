/**
 * Converts TipTap JSON format to Strapi v4 Blocks editor format
 * Strapi Blocks expect a specific structure with type, children, and attributes
 */

interface TipTapNode {
  type: string;
  content?: TipTapNode[];
  marks?: Array<{ type: string }>;
  text?: string;
  attrs?: Record<string, any>;
  level?: number;
}

interface TextNode {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

interface StrapiBlockChild {
  type: string;
  text?: string;
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

interface StrapiBlock {
  type: string;
  children: StrapiBlockChild[];
  level?: number;
}

export const convertTipTapToStrapiBlocks = (tipTapJson: any): StrapiBlock[] => {
  if (!tipTapJson || !tipTapJson.content || tipTapJson.content.length === 0) {
    return [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            text: "",
          },
        ],
      },
    ];
  }

  const blocks: StrapiBlock[] = [];

  tipTapJson.content.forEach((node: TipTapNode) => {
    const block = convertNode(node);
    if (block) {
      blocks.push(block);
    }
  });

  return blocks.length > 0
    ? blocks
    : [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "",
            },
          ],
        },
      ];
};

const convertNode = (node: TipTapNode): StrapiBlock | null => {
  switch (node.type) {
    case "paragraph":
      const paragraphChildren = extractTextWithMarks(node.content || []);
      if (paragraphChildren.length === 0) {
        paragraphChildren.push({ type: "text", text: "" });
      }
      return {
        type: "paragraph",
        children: paragraphChildren,
      };

    case "heading":
      const level = node.attrs?.level || 1;
      const headingChildren = extractTextWithMarks(node.content || []);
      if (headingChildren.length === 0) {
        headingChildren.push({ type: "text", text: "" });
      }
      return {
        type: "heading",
        level,
        children: headingChildren,
      };

    case "bulletList":
      const bulletItems: StrapiBlock[] = [];
      (node.content || []).forEach((item) => {
        if (item.type === "listItem") {
          const itemContent = item.content?.[0]?.content || [];
          const listChildren = extractTextWithMarks(itemContent);
          if (listChildren.length === 0) {
            listChildren.push({ type: "text", text: "" });
          }
          bulletItems.push({
            type: "list-item",
            children: listChildren,
          });
        }
      });
      return bulletItems.length > 0
        ? {
            type: "list",
            children: bulletItems,
          }
        : null;

    case "orderedList":
      const orderedItems: StrapiBlock[] = [];
      (node.content || []).forEach((item) => {
        if (item.type === "listItem") {
          const itemContent = item.content?.[0]?.content || [];
          const listChildren = extractTextWithMarks(itemContent);
          if (listChildren.length === 0) {
            listChildren.push({ type: "text", text: "" });
          }
          orderedItems.push({
            type: "list-item",
            children: listChildren,
          });
        }
      });
      return orderedItems.length > 0
        ? {
            type: "list",
            children: orderedItems,
          }
        : null;

    case "blockquote":
      const quoteChildren = extractTextWithMarks(node.content || []);
      if (quoteChildren.length === 0) {
        quoteChildren.push({ type: "text", text: "" });
      }
      return {
        type: "quote",
        children: quoteChildren,
      };

    case "codeBlock":
      const codeText = (node.content || [])
        .map((n) => n.text || "")
        .join("\n");
      return {
        type: "code",
        children: [
          {
            type: "text",
            text: codeText,
            code: true,
          },
        ],
      };

    default:
      return null;
  }
};

const extractTextWithMarks = (nodes: TipTapNode[]): StrapiBlockChild[] => {
  const children: StrapiBlockChild[] = [];

  nodes.forEach((node) => {
    if (node.type === "text") {
      const textNode: StrapiBlockChild = {
        type: "text",
        text: node.text || "",
      };

      // Apply marks (bold, italic, etc.)
      if (node.marks && node.marks.length > 0) {
        node.marks.forEach((mark) => {
          switch (mark.type) {
            case "bold":
              textNode.bold = true;
              break;
            case "italic":
              textNode.italic = true;
              break;
            case "strike":
              textNode.strikethrough = true;
              break;
            case "code":
              textNode.code = true;
              break;
            case "underline":
              textNode.underline = true;
              break;
          }
        });
      }

      children.push(textNode);
    } else if (node.type === "hardBreak") {
      // Handle hard breaks as separate text nodes
      children.push({ type: "text", text: "\n" });
    }
  });

  // Ensure at least one text node exists
  if (children.length === 0) {
    children.push({
      type: "text",
      text: "",
    });
  }

  return children;
};

// Debug function to view the block structure
export const logBlocksStructure = (blocks: StrapiBlock[]) => {
  console.log("Strapi Blocks Structure:", JSON.stringify(blocks, null, 2));
};