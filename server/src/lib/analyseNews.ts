import { GoogleGenAI } from "@google/genai";

/**
 * Analyzes a news article text using Gemini and returns structured analysis.
 */
export const analyzeArticleContent = async (articleText: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const prompt = `
You are an expert political news analyst. Given the following news article text, your task is to analyze it and provide a an object response with the following fields:

{
  "title": "string",
  "summary": "string",
  "politicalAlignment": "left | center | right | unknown",
  "credibilityScore": number (0.0 to 1.0),
  "credibilityReason": "string",
  "recommendedAction": "string"
}

If the text does not look like a valid news article, respond with:
{
  "error": "The provided text is not a valid news article."
}

Be objective and unbiased. Here is the article text:
=====
${articleText}
=====
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      thinkingConfig: {
        thinkingBudget: -1, // dynamic thinking budget
      },
    },
  });

  const text = response.text;

  // Try to parse the returned JSON
  try {
    return JSON.parse(text ?? "{}");
  } catch {
    const cleaned = text
      ? text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim()
      : "";
    try {
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("Could not parse Gemini response as JSON:", text);
      return {
        error: "Failed to parse model output as JSON.",
        rawOutput: text,
      };
    }
  }
};
