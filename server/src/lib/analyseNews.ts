import dotEnv from "@dotenvx/dotenvx";
import { GoogleGenAI } from "@google/genai";
import { parseModelResponse } from "@server/helpers/jsonHelpers";
import type { ModelResponse } from "@shared/types/analyses";

/**
 * Analyzes a news article text using Gemini and returns structured analysis.
 */
export const analyzeArticleContent = async <T>(
  articleText: string
): Promise<
  | ModelResponse
  | {
      error: string;
      rawOutput: string | null | undefined;
    }
> => {
  const prompt = `You are an expert news analyst. Your task is to analyze any type of news article text provided to you and return a structured JSON object.

First, determine whether the text represents a valid news article. Users might send random, fake, or irrelevant links, so you must carefully evaluate if the content resembles an actual news report. 
If the text appears to have errors about access being denied or errors, it probably means that website has blocked puppeteer. In this case, respond with: {
  "error": "Access denied or content blocked."
}

If the text does not look like a valid news article, respond with:
{
  "error": "The provided text is not a valid news article."
}


If the text looks like a valid news article, analyze it and return:
{
  "title": "string",
  "summary": "string",
  "politicalAlignment": "left | center | right | unknown | null (use null for non-political news like sports, tech, entertainment, etc.)",
  "credibilityScore": number (between 1 to 100, where 1 is not credible at all and 100 is highly credible),
  "credibilityReason": "string",
  "sarcasmOrSatire": "yes | no | unsure",
  "recommendedAction": "string",
  "imageUrl": "Extract the URL of the main article image. Look for: 1) og:image meta tags, 2) featured/hero images in the article content, 3) images with classes like 'featured', 'hero', 'main', or 4) the first substantial image in the article. Return the full absolute URL or null if no suitable image found",
  "author": "string"
}

Your analysis should be objective and unbiased. The "sarcasmOrSatire" field should indicate whether the text appears sarcastic, satirical, or ironic.

Always answer in English, even if the article is in another language. For political news, determine alignment as "left", "center", "right", or "unknown". For non-political news (sports, technology, entertainment, science, health, business, etc.), set "politicalAlignment" to null. The "credibilityScore" should be a number between 0.0 and 1.0, where 1.0 is highly credible and 0.0 is not credible at all.

Here is the article text:
=====
${articleText}
=====
`;
  let text: string | undefined;

  if (!dotEnv.get("NODE_ENV") || dotEnv.get("NODE_ENV") !== "development") {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: -1, // dynamic thinking budget
        },
      },
    });

    text = response.text;
  } else {
    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, model: "gemma3:4b", stream: false }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from local server");
    }
    const data = await response.json();

    text = data.response;
  }

  try {
    return parseModelResponse(text);
  } catch {
    console.error("Could not parse Gemini response as JSON:", text);
    return {
      error: "Failed to parse model output as JSON.",
      rawOutput: text,
    };
  }
};
