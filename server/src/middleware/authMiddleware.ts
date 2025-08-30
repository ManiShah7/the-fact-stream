import { getCookie } from "hono/cookie";
import { eq } from "drizzle-orm";
import { createMiddleware } from "hono/factory";
import { db } from "@server/lib/db";
import type { AppEnv } from "@server/types/context";
import { failure } from "@server/helpers/apiHelper";
import { validateToken } from "@server/helpers/jwtHelpers";
import { users } from "@server/lib/db/schema/users";

export const authMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const accessToken = getCookie(c, "accessToken");
  if (!accessToken) return c.json(failure("Unauthorized!"));

  try {
    const validatedToken = await validateToken(accessToken);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, validatedToken.sub))
      .limit(1);

    if (!user) {
      return c.json(failure("User not found!"), 401);
    }

    c.set("user", user);
    await next();
  } catch (error) {
    return c.json(failure("Unauthorized!"));
  }
});
