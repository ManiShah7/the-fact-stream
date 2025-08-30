import { Hono } from "hono";
import { db } from "@server/lib/db";
import { eq } from "drizzle-orm";
import { getCookie, deleteCookie, setCookie } from "hono/cookie";
import type { SignInBody } from "@server/types/context";
import { authMiddleware } from "@server/middleware/authMiddleware";
import { users } from "@server/lib/db/schema/users";
import { hashPassword, verifyPassword } from "@server/helpers/passwordHelpers";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@server/helpers/jwtHelpers";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "@server/helpers/cookieHelpers";
import { refreshTokens } from "@server/lib/db/schema/refreshTokens";
import { success } from "@server/helpers/apiHelper";

export const authRoutes = new Hono()
  .post("/signin", async (c) => {
    const { email, password } = (await c.req.json()) as SignInBody;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then((res) => res[0]);

    if (!user) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const passwordMatch = await verifyPassword(password, user.password);

    if (!passwordMatch) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const accessToken = await generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    setCookie(c, "accessToken", accessToken, accessTokenCookieOptions);
    setCookie(c, "refreshToken", refreshToken, refreshTokenCookieOptions);

    await db.insert(refreshTokens).values({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    });

    return c.json(
      success(
        {
          user: {
            id: user.id,
            email: user.email,
          },
        },
        "Successfully logged in!"
      )
    );
  })
  .post("/signup", async (c) => {
    const { firstName, lastName, email, password } = await c.req.json();

    const createdUser = await db
      .insert(users)
      .values({
        firstName,
        lastName,
        email,
        password: await hashPassword(password),
      })
      .returning();

    console.log("User created:", createdUser);

    return c.json({
      data: createdUser,
    });
  })
  .post("/signout", authMiddleware, async (c) => {
    const accessToken = getCookie(c, "access_token");
    const sessionId = getCookie(c, "session_id");

    if (!sessionId) {
      return c.json({ error: "No active session" }, 400);
    }

    try {
      const res = await fetch(`${process.env.SUPABASE_URL}/auth/v1/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        console.warn("Supabase logout failed, continuing with local cleanup");
      }
    } catch (error) {
      console.warn("Supabase logout request failed:", error);
    }

    // await db
    //   .delete(userSessions)
    //   .where(eq(userSessions.id, sessionId))
    //   .execute();

    deleteCookie(c, "access_token");
    deleteCookie(c, "session_id");

    return c.json({ success: true });
  })
  .post("/resetPassword", async (c) => {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }

    const res = await fetch(`${process.env.SUPABASE_URL}/auth/v1/recover`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_ANON_KEY!,
      },
      body: JSON.stringify({
        email,
        options: {
          redirectTo: `${process.env.CLIENT_URL}/reset-password`,
        },
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return c.json(
        { error: "Failed to send reset email", details: errorData },
        400
      );
    }

    return c.json({ message: "Password reset email sent" });
  })
  .get("/me", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return c.json(user);
  });

export type AuthRoutes = typeof authRoutes;
