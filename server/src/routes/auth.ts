import { Hono } from "hono";
import { db } from "@server/lib/db";
import { eq } from "drizzle-orm";
import type { User } from "@supabase/supabase-js";
import type { CustomContext, SignInBody } from "@server/types/context";
import { userSessions } from "@server/lib/db/schema/userSessions";
import { authMiddleware } from "@server/middleware/authMiddleware";
import type { SupabaseSignInResponse } from "@shared/types/user";
import { getCookie } from "hono/cookie";

export const authRoutes = new Hono()
  .post("/signin", async (c: CustomContext) => {
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

    if (existingSession) {
      await db
        .update(userSessions)
        .set({ refreshToken: data.refresh_token })
        .where(eq(userSessions.userId, data.user.id))
        .execute();
    } else {
      await db.insert(userSessions).values({
        refreshToken: data.refresh_token,
        userId: data.user.id,
      });
    }

    c.header(
      "Set-Cookie",
      `access_token=${data.access_token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax; Secure`
    );

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
  .post("/signout", authMiddleware, async (c: CustomContext) => {
    const user = c.get("user");
    const accessToken = getCookie(c, "access_token");

    const res = await fetch(`${process.env.SUPABASE_URL}/auth/v1/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      return c.json({ error: "Sign out failed" }, 400);
    }

    c.header(
      "Set-Cookie",
      "access_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure"
    );

    await db
      .delete(userSessions)
      .where(eq(userSessions.userId, user.sub))
      .execute();

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
  .get("/me", authMiddleware, async (c: CustomContext) => {
    const user = c.get("user");

    const foundSession = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.userId, user.sub))
      .limit(1)
      .then((res) => res[0]);

    if (!foundSession) {
      return c.json({ error: "Session not found" }, 404);
    }

    return c.json(user);
  });

export type AuthRoutes = typeof authRoutes;
