import { getCookie } from "hono/cookie";
import { eq } from "drizzle-orm";
import { createMiddleware } from "hono/factory";
import { db } from "@server/lib/db";
import { HTTPException } from "hono/http-exception";
// import { userSessions } from "@server/lib/db/schema/refreshTokens";
import type { AppEnv } from "@server/types/context";

export const authMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  try {
    const sessionId = getCookie(c, "session_id");
    if (!sessionId) throw new HTTPException(401, { message: "Unauthorized" });

    // const session = await db
    //   .select()
    //   .from(userSessions)
    //   .where(eq(userSessions.id, sessionId))
    //   .limit(1)
    //   .then((res) => res[0]);

    // if (!session || !session.refreshToken) {
    //   throw new HTTPException(401, { message: "Invalid session" });
    // }

    const accessToken = getCookie(c, "access_token");
    // if (!(accessToken && (await isValidAccessToken(accessToken)))) {
    //   throw new HTTPException(401, { message: "Access token required" });
    // }

    // const user = await getUserFromToken(accessToken);
    // c.set("user", { ...user, sessionId: session.id });
    await next();
  } catch (err) {
    // console.error("Auth middleware error:", err);
    return c.json({ error: "Unauthorized" }, 401);
  }
});
