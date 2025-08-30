import { randomBytes } from "crypto";
import { sign } from "hono/jwt";
import type { User } from "shared/src/types/user";

const generateAccessToken = async (user: User) => {
  const payload = {
    sub: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 15, // 15 min
  };

  return await sign(payload, process.env.JWT_SECRET!);
};

const generateRefreshToken = () => randomBytes(64).toString("hex");

export { generateAccessToken, generateRefreshToken };
