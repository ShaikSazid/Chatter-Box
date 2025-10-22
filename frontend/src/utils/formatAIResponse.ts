// src/utils/formatAIResponse.ts

/**
 * Converts raw AI responses into structured Markdown.
 * Automatically detects headings, lists, tables, code blocks.
 */
export const formatAIResponse = (raw: string): string => {
  let formatted = raw;

  // 1. Normalize line breaks
  formatted = formatted.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n");

  // 2. Convert numbered lists (e.g., "1. Step") to proper Markdown
  formatted = formatted.replace(/^(\d+)\.\s+/gm, (_, num) => `${num}. `);

  // 3. Convert bullets (e.g., "-", "*") with proper spacing
  formatted = formatted.replace(/^[*-]\s+/gm, "- ");

  // 4. Detect pseudo-tables and convert to Markdown
  // Example raw table: "Feature | MERN | Python\nPrimary Languages | JS | Python"
  const lines = formatted.split("\n");
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].includes("|") && !lines[i + 1].includes("---")) {
      const colCount = lines[i].split("|").length - 1;
      if (colCount > 0) {
        lines.splice(
          i + 1,
          0,
          "|" + Array(colCount).fill("---").join("|") + "|"
        );
      }
    }
  }
  formatted = lines.join("\n");

  // 5. Ensure code blocks are fenced
  formatted = formatted.replace(/```([\s\S]*?)```/g, "```\n$1\n```");

  // 6. Add extra spacing between major sections
  formatted = formatted.replace(/(\n{2,})/g, "\n\n");

  return formatted.trim();
};
