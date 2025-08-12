import { verify } from "hono/jwt";

type AuthenticatedUser = {
  id: string;
  email: string;
  sessionId?: string;
};

const isValidAccessToken = async (token: string): Promise<boolean> => {
  try {
    const secret = process.env.SUPABASE_JWT_SECRET as string;
    const payload = await verify(token, secret);
    return !!(
      payload.sub &&
      payload.exp &&
      payload.exp > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
};

const getUserFromToken = async (token: string): Promise<AuthenticatedUser> => {
  const secret = process.env.SUPABASE_JWT_SECRET as string;
  const payload = await verify(token, secret);

  return {
    id: payload.sub as string,
    email: payload.email as string,
  };
};

export { isValidAccessToken, getUserFromToken };
