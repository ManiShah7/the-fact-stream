import { Hono } from "hono";
import { cors } from "hono/cors";
import { and, eq } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";
import type { User } from "@supabase/supabase-js";
import { analyzeArticleContent } from "./lib/analyseNews";
import { readUrl } from "./lib/puppeteerUtils";
import { db } from "./lib/db";
import { analyzeLogs } from "./lib/db/schema/analyseLogs";
import { authMiddleware } from "./middleware/authMiddleware";
import type { CustomContext, PostAnalyzeBody } from "../types/context";

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
  .post("/signout", authMiddleware, async (c: CustomContext) => {
    const user = c.get("user");

    if (!user || !user.sub) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const res = await fetch(`${process.env.SUPABASE_URL}/auth/v1/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${c.req
          .header("Authorization")
          ?.replace("Bearer ", "")}`,
      },
    });

    if (!res.ok) {
      return c.json({ error: "Sign out failed" }, 400);
    }

    return c.json({ success: true });
  })
  .post("/analyse", authMiddleware, async (c: CustomContext) => {
    const { url, publish } = (await c.req.json()) as PostAnalyzeBody;
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
      isPublished: publish,
    });

    return c.json({
      analysis,
    });
  })
  .get("/analyse/history", authMiddleware, async (c: CustomContext) => {
    const user = c.get("user");

    if (!user || !user.sub) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const logs = await db
      .selectDistinct()
      .from(analyzeLogs)
      .where(eq(analyzeLogs.userId, user.sub));

    return c.json(logs);
  })
  .get("analyse/:id", authMiddleware, async (c: CustomContext) => {
    const user = c.get("user");
    const id = c.req.param("id");

    if (!user || !user.sub) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (!id) {
      return c.json({ error: "ID is required" }, 400);
    }

    const log = await db
      .select()
      .from(analyzeLogs)
      .where(and(eq(analyzeLogs.id, id), eq(analyzeLogs.userId, user.sub)))
      .limit(1)
      .then((res) => res[0]);

    if (!log) {
      return c.json({ error: "Log not found" }, 404);
    }

    return c.json({
      ...log,
    });
  })
  .patch("/analyse/:id", authMiddleware, async (c: CustomContext) => {
    const user = c.get("user");
    const id = c.req.param("id");

    if (!user || !user.sub) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (!id) {
      return c.json({ error: "ID is required" }, 400);
    }

    const { publish } = (await c.req.json()) as { publish: boolean };

    await db
      .update(analyzeLogs)
      .set({ isPublished: publish })
      .where(and(eq(analyzeLogs.id, id), eq(analyzeLogs.userId, user.sub)))
      .execute();

    return c.json({ success: true });
  })
  .get("/published", authMiddleware, async (c: CustomContext) => {
    const user = c.get("user");

    if (!user || !user.sub) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const logs = await db
      .selectDistinct()
      .from(analyzeLogs)
      .where(eq(analyzeLogs.isPublished, true));

    return c.json(logs);
  });

export default app;
