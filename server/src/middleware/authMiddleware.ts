import { jwtVerify } from "jose";
import { eq } from "drizzle-orm";
import type { Context, Next } from "hono";
import { db } from "@server/lib/db";
import { userSessions } from "../lib/db/schema/userSessions";

export const authMiddleware = async (c: Context, next: Next) => {
  const auth = c.req.header("Authorization");

  if (!auth || !auth.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = auth.split(" ")[1];

  if (!token) {
    return c.json({ error: "Token not provided" }, 401);
  }

  try {
    const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (!payload.sub) {
      return c.json({ error: "Invalid token" }, 401);
    }

    // Check if the user session exists in the database. This is to ensure when user logs out, the session is removed.
    const userSessionId = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.userId, String(payload.sub)));

    if (!userSessionId || userSessionId.length === 0) {
      return c.json({ error: "Session not found" }, 401);
    }

    // Check if the user exists in the database
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
