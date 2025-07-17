import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "@server/lib/db";
import type { User } from "@supabase/supabase-js";
import type {
  CustomContext,
  SignInBody,
  SignInData,
} from "@server/types/context";
import { userSessions } from "@server/lib/db/schema/userSessions";
import { authMiddleware } from "@server/middleware/authMiddleware";

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

    const data = (await res.json()) as SignInData;

    if (!res.ok) {
      return c.json({ error: "Login failed", details: data }, 401);
    }

    const sessionId = crypto.randomUUID();

    await db.insert(userSessions).values({
      userId: data.user.id,
      sessionId,
      createdAt: new Date(),
    });

    return c.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user: data.user,
      sessionId,
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

    await db
      .delete(userSessions)
      .where(eq(userSessions.userId, user.sub))
      .execute();

    return c.json({ success: true });
  });

export type AuthRoutes = typeof authRoutes;
