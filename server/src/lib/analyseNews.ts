import { GoogleGenAI } from "@google/genai";

/**
 * Analyzes a news article text using Gemini and returns structured analysis.
 */
export const analyzeArticleContent = async <T>(
  articleText: string
): Promise<string | { error: string; rawOutput: string | undefined }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const prompt = `You are an expert political news analyst. Your task is to analyze a news article text provided to you and return a structured JSON object.

First, determine whether the text represents a valid news article. Users might send random, fake, or irrelevant links, so you must carefully evaluate if the content resembles an actual news report. If the text does not look like a valid news article, respond with:
{
  "error": "The provided text is not a valid news article."
}

If the text looks like a valid news article, analyze it and return:
{
  "title": "string",
  "summary": "string",
  "politicalAlignment": "left | center | right | unknown",
  "credibilityScore": number (0.0 to 1.0),
  "credibilityReason": "string",
  "sarcasmOrSatire": "yes | no | unsure",
  "recommendedAction": "string"
}

Your analysis should be objective and unbiased. The "sarcasmOrSatire" field should indicate whether the text appears sarcastic, satirical, or ironic.

Always answer in English, even if the article is in another language. If you cannot determine the political alignment, set it to "unknown". The "credibilityScore" should be a number between 0.0 and 1.0, where 1.0 is highly credible and 0.0 is not credible at all.

Here is the article text:
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
