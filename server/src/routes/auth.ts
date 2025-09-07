import { Hono } from "hono";
import { db } from "@server/lib/db";
import { and, eq } from "drizzle-orm";
import { getCookie, deleteCookie, setCookie } from "hono/cookie";
import type { SignInBody } from "@server/types/context";
import { authMiddleware } from "@server/middleware/authMiddleware";
import { users } from "@server/lib/db/schema/users";
import type { ChangePasswordBody } from "@shared/types/auth";
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

export const authRoutes = new Hono()
  .post("/signin", async (c) => {
    const { email, password } = (await c.req.json()) as SignInBody;

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

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

    const accessToken = await generateAccessToken(user.id);
    const refreshToken = generateRefreshToken();

    setCookie(c, "accessToken", accessToken, accessTokenCookieOptions);
    setCookie(c, "refreshToken", refreshToken, refreshTokenCookieOptions);

    await db.insert(refreshTokens).values({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    });

    return c.json({
      data: {
        user,
      },
      message: "Successfully logged in!",
    });
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

    return c.json({
      data: createdUser,
    });
  })
  .post("/signout", authMiddleware, async (c) => {
    const refreshToken = getCookie(c, "refreshToken");
    const user = c.get("user");

    if (!refreshToken || !user) {
      return c.json({ data: null, message: "Unauthorized!" });
    }

    await db
      .delete(refreshTokens)
      .where(
        and(
          eq(refreshTokens.token, refreshToken),
          eq(refreshTokens.userId, user.id)
        )
      );

    deleteCookie(c, "accessToken");
    deleteCookie(c, "refreshToken");

    return c.json({ data: null });
  })
  .post("/changePassword", authMiddleware, async (c) => {
    const { currentPassword, newPassword } =
      (await c.req.json()) as ChangePasswordBody;
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "User is required" }, 400);
    }

    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email))
      .limit(1)
      .then((res) => res[0]);

    if (!dbUser) {
      return c.json({ error: "User not found" }, 404);
    }

    const passwordMatch = await verifyPassword(
      currentPassword,
      dbUser.password
    );

    if (!passwordMatch) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await db
      .update(users)
      .set({ password: hashedNewPassword })
      .where(eq(users.id, dbUser.id));

    await db.delete(refreshTokens).where(eq(refreshTokens.userId, dbUser.id));

    deleteCookie(c, "accessToken");
    deleteCookie(c, "refreshToken");

    return c.json({ data: null, message: "Password changed successfully!" });
  })
  .post("/resetPassword", async (c) => {
    // Implement password reset logic

    return c.json({ data: null, message: "Password reset email sent" });
  })
  .get("/refresh", async (c) => {
    const refreshToken = getCookie(c, "refreshToken");

    if (!refreshToken) {
      return c.json({ data: null, message: "Unauthorized!" }, 401);
    }

    const [dbRefreshTokenRow] = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, refreshToken))
      .limit(1);

    if (!dbRefreshTokenRow) {
      return c.json({ data: null, message: "Unauthorized!" }, 401);
    }

    if (dbRefreshTokenRow.expiresAt < new Date()) {
      await db
        .delete(refreshTokens)
        .where(eq(refreshTokens.id, dbRefreshTokenRow.id));
      return c.json({ data: null, message: "Unauthorized!" }, 401);
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, dbRefreshTokenRow.userId))
      .limit(1)
      .then((res) => res[0]);

    if (!user) {
      await db
        .delete(refreshTokens)
        .where(eq(refreshTokens.id, dbRefreshTokenRow.id));
      return c.json({ data: null, message: "Unauthorized!" }, 401);
    }

    try {
      const newAccessToken = await generateAccessToken(user.id);
      const newRefreshToken = generateRefreshToken();

      setCookie(c, "accessToken", newAccessToken, accessTokenCookieOptions);
      setCookie(c, "refreshToken", newRefreshToken, refreshTokenCookieOptions);

      await db.update(refreshTokens)
        .set({
          token: newRefreshToken,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        })
        .where(eq(refreshTokens.id, dbRefreshTokenRow.id));

      return c.json({ data: user, message: "Token refreshed successfully!" });
    } catch (error) {
      console.error("Refresh token error:", error);
      await db.delete(refreshTokens).where(eq(refreshTokens.userId, user.id));
      return c.json({ data: null, message: "Unauthorized!" }, 401);
    }
  });

export type AuthRoutes = typeof authRoutes;
