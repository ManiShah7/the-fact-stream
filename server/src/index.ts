import { Hono } from "hono";
import { cors } from "hono/cors";
import { GoogleGenAI } from "@google/genai";
import type { User } from "@supabase/supabase-js";
import { analyzeArticleContent } from "./lib/analyseNews";
import { readUrl } from "./lib/puppeteerUtils";
import { db } from "./lib/db";
import { analyzeLogs } from "./lib/db/schema";
import { authMiddleware } from "./middleware/authMiddleware";
import type { CustomContext } from "../types/context";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const app = new Hono().use(cors());

app
  .post("/signin", async (c) => {
    const { email, password } = await c.req.json();

    const res = await fetch(
      `${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = (await res.json()) as {
      access_token: string;
      refresh_token: string;
      user: User;
    };

    if (!res.ok) {
      return c.json({ error: "Login failed", details: data }, 401);
    }

    return c.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user: data.user,
    });
  })
  .post("/signup", async (c) => {
    const { name, phone, email, password } = await c.req.json();

    const res = await fetch(`${process.env.SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_ANON_KEY!,
      },
      body: JSON.stringify({ email, password, phone, data: { name } }),
    });

    const data = (await res.json()) as User;

    if (!res.ok) {
      return c.json({ error: "Signup failed", details: data }, 400);
    }

    return c.json({
      data,
    });
  })
  .post("/analyse", authMiddleware, async (c: CustomContext) => {
    const { url } = await c.req.json();
    const user = c.get("user");

    if (!user || !user.sub) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const pageContent = await readUrl(url);
    const analysis = await analyzeArticleContent(pageContent);

    await db.insert(analyzeLogs).values({
      userId: user.sub,
      url,
      articleText: pageContent,
      modelResponse: JSON.stringify(analysis),
    });

    return c.json({
      analysis,
    });
  });

export default app;
