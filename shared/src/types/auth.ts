import type { User } from "./user";

type ChangePasswordBody = {
  currentPassword: string;
  newPassword: string;
};

export type { ChangePasswordBody };
