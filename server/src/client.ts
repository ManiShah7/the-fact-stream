import { hc } from "hono/client";
import type { app } from "./index";

export type AppType = typeof app;
export type Client = ReturnType<typeof hc<AppType>>;

export const hcWithType = (
  baseUrl: string,
  options?: { fetch?: typeof fetch; headers?: Record<string, string> }
): Client =>
  hc<AppType>(baseUrl, {
    ...options,
    fetch: (input: RequestInfo | URL, init?: RequestInit) => {
      return fetch(input, {
        ...init,
        credentials: "include",
      });
    },
  });
