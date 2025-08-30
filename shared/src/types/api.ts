type ApiResponse<T = any> = {
  message: string;
  data: T | null;
  errors?: Array<{ field: string; message: string }>;
  meta?: Record<string, any>; // optional extra info, e.g., pagination
};

export type { ApiResponse };
