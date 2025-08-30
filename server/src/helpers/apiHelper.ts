import type { ApiResponse } from "@shared/types/api";

export const success = <T>(
  data: T,
  message = "Success",
  meta?: Record<string, any>
): ApiResponse<T> => {
  return { message, data, meta };
};

export const failure = (
  message = "Error",
  errors?: Array<{ field: string; message: string }>
): ApiResponse<null> => {
  return { message, data: null, errors };
};
