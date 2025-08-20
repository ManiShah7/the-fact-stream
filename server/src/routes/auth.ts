import { Hono } from "hono";
import { db } from "@server/lib/db";
import { eq } from "drizzle-orm";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import type { User } from "@supabase/supabase-js";
import type { SignInBody } from "@server/types/context";
import { userSessions } from "@server/lib/db/schema/userSessions";
import { authMiddleware } from "@server/middleware/authMiddleware";
import type { SupabaseSignInResponse } from "@shared/types/user";

export const authRoutes = new Hono()
  .post("/signin", async (c) => {
    const { email, password } = (await c.req.json()) as SignInBody;

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

    if (!res.ok) {
      const errorData = await res.json();
      return c.json({ error: "Sign in failed", details: errorData }, 400);
    }

    const data = (await res.json()) as SupabaseSignInResponse;

    const existingSession = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.userId, data.user.id))
      .limit(1)
      .then((res) => res[0]);

    let session: typeof existingSession;

    if (existingSession) {
      session = await db
        .update(userSessions)
        .set({ refreshToken: data.refresh_token })
        .where(eq(userSessions.id, existingSession.id))
        .returning()
        .then((res) => res[0]);
    } else {
      session = await db
        .insert(userSessions)
        .values({
          refreshToken: data.refresh_token,
          userId: data.user.id,
        })
        .returning()
        .then((res) => res[0]);
    }

    setCookie(c, "access_token", data.access_token, {
      httpOnly: true,
      path: "/",
      maxAge: 3600,
      sameSite: "Lax",
      secure: true,
    });

    setCookie(c, "session_id", session!.id, {
      httpOnly: true,
      path: "/",
      maxAge: 86400 * 7,
      sameSite: "Lax",
      secure: true,
    });

    return c.json({
      user: {
        id: data.user.id,
        email: data.user.email,
      },
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

    await db
      .delete(userSessions)
      .where(eq(userSessions.id, sessionId))
      .execute();

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
