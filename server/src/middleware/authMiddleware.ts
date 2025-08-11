import { getCookie } from "hono/cookie";
import { jwtVerify } from "jose";
import { eq } from "drizzle-orm";
import type { Context, Next } from "hono";
import { db } from "@server/lib/db";
import { userSessions } from "../lib/db/schema/userSessions";

export const authMiddleware = async (c: Context, next: Next) => {
  const accessToken = getCookie(c, "access_token");

  console.log("Access Token:", accessToken);

  if (!accessToken) {
    return c.json({ error: "Not authenticated" }, 401);
  }

  try {
    const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);
    const { payload } = await jwtVerify(accessToken, secret);

    if (!payload.sub) {
      return c.json({ error: "Invalid token" }, 401);
    }

    const userSessionId = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.userId, String(payload.sub)));

    if (!userSessionId || userSessionId.length === 0) {
      return c.json({ error: "Session not found" }, 401);
    }

    const user = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.userId, String(payload.sub)))
      .execute();

    if (!user || user.length === 0) {
      return c.json({ error: "User not found" }, 401);
    }

    c.set("user", payload);
    c.set("sessionId", userSessionId);
    return next();
  } catch (err) {
    console.error("JWT error:", err);
    return c.json({ error: "Invalid token" }, 401);
  }
};
