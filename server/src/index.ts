import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ApiResponse } from "shared/dist";
import { GoogleGenAI } from "@google/genai";
import { analyzeArticleContent } from "./lib/analyseNews";
import { readUrl } from "./lib/puppeteerUtils";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const app = new Hono()

  .use(cors())

  .post("/analyse", async (c) => {
    const { url } = await c.req.json();
    const pageContent = await readUrl(url);
    console.log("Analyzing article content...");
    const analysis = await analyzeArticleContent(pageContent);
    return c.json({
      analysis,
    });
  });

export default app;
