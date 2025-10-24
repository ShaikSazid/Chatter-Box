export const formatAIResponse = (raw: string): string => {
  let formatted = raw;
  formatted = formatted.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n");
  formatted = formatted.replace(/^(\d+)\.\s+/gm, (_, num) => `${num}. `);
  formatted = formatted.replace(/^[*-]\s+/gm, "- ");
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
  formatted = formatted.replace(/```([\s\S]*?)```/g, "```\n$1\n```");
  formatted = formatted.replace(/(\n{2,})/g, "\n\n");

  return formatted.trim();
};