import { eq } from "drizzle-orm";
import { sign } from "jsonwebtoken";
import { db } from "../lib/db/index";
import { userSessions } from "../lib/db/schema/userSessions";

export const createSession = async (userId: string) => {
  const sessionId = crypto.randomUUID();
  await db.insert(userSessions).values({ sessionId, userId });
  return sessionId;
};

export const validateSession = async (sessionId: string) => {
  const [session] = await db
    .select()
    .from(userSessions)
    .where(eq(userSessions.sessionId, sessionId));
  return !!session;
};

export const signSessionJWT = async (userId: string) => {
  const sessionId = await createSession(userId);
  const token = sign(
    { userId, sessionId },
    process.env.JWT_SECRET || "default_secret",
    { expiresIn: "5m" }
  );
  return token;
};

export const deleteSession = async (sessionId: string) => {
  await db.delete(userSessions).where(eq(userSessions.sessionId, sessionId));
};
