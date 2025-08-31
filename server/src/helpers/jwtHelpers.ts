import type { AuthTokenPayload } from "@server/types/auth";
import { randomBytes } from "crypto";
import { sign, verify } from "hono/jwt";

const JWT_SECRET = process.env.JWT_SECRET!;

const generateAccessToken = async (userId: number) => {
  const payload = {
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + 60 * 15, // 15 min
  };

  return await sign(payload, JWT_SECRET!);
};

const generateRefreshToken = () => randomBytes(64).toString("hex");

const validateToken = async (token: string): Promise<AuthTokenPayload> => {
  try {
    const payload = (await verify(token, JWT_SECRET)) as AuthTokenPayload;

    if (payload.exp * 1000 < Date.now()) {
      throw new Error("Token expired");
    }

    return payload;
  } catch (err) {
    console.error("JWT validation failed:", err);
    throw new Error("Invalid token");
  }
};

export { generateAccessToken, generateRefreshToken, validateToken };
