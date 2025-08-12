import { getCookie } from "hono/cookie";
import { eq } from "drizzle-orm";
import type { Context, Next } from "hono";
import { db } from "@server/lib/db";
import { userSessions } from "../lib/db/schema/userSessions";
import {
  getUserFromToken,
  isValidAccessToken,
} from "@server/helpers/authMiddlewareHelpers";

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const sessionId = getCookie(c, "session_id");

    if (!sessionId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const session = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.id, sessionId))
      .limit(1)
      .then((res) => res[0]);

    if (!session || !session.refreshToken) {
      return c.json({ error: "Invalid session" }, 401);
    }

    const accessToken = getCookie(c, "access_token");

    if (accessToken && (await isValidAccessToken(accessToken))) {
      const user = await getUserFromToken(accessToken);
      c.set("user", { ...user, sessionId: session.id });
      return next();
    }

    return c.json({ error: "Access token required" }, 401);
  } catch (err) {
    console.error("Auth middleware error:", err);
    return c.json({ error: "Unauthorized" }, 401);
  }
};
