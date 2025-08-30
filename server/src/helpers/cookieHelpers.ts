const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  path: "/",
};

const accessTokenCookieOptions = baseCookieOptions && {
  maxAge: 60 * 15,
};

const refreshTokenCookieOptions = baseCookieOptions && {
  maxAge: 60 * 60 * 24 * 7,
};

export { accessTokenCookieOptions, refreshTokenCookieOptions };
