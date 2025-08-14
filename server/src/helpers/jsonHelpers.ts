import type { ModelResponse } from "@shared/types/news";

const cleanJsonString = (text: string): string => {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};

const parseModelResponse = (
  text: string | null | undefined
): ModelResponse | { error: string; rawOutput: string | null | undefined } => {
  const input = text ?? "{}";

  try {
    return JSON.parse(input) as ModelResponse;
  } catch {
    try {
      return JSON.parse(cleanJsonString(input));
    } catch {
      return {
        error: "Failed to parse model output as JSON.",
        rawOutput: text,
      };
    }
  }
};

export { parseModelResponse };
