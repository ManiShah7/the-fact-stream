import { jwtVerify } from "jose";
import type { Context, Next } from "hono";

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
    c.set("user", payload);
    return next();
  } catch (err) {
    console.error("JWT error:", err);
    return c.json({ error: "Invalid token" }, 401);
  }
};
