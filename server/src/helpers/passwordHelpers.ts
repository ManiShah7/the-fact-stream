export const hashPassword = async (password: string): Promise<string> =>
  await Bun.password.hash(password, "bcrypt");

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => await Bun.password.verify(password, hashedPassword);
