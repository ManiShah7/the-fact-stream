import { hc } from "hono/client";
import type { app } from "./index";

export type AppType = typeof app;
export type Client = ReturnType<typeof hc<AppType>>;

export const hcWithType = (
  baseUrl: string,
  options?: Parameters<typeof hc>[1]
): Client => {
  return hc<AppType>(baseUrl, {
    ...options,
    fetch: (input: RequestInfo | URL, init?: RequestInit) => {
      return fetch(input, {
        ...init,
        credentials: "include",
      });
    },
  });
};

// const ws = hcWithType("http://localhost:9000").api.v1.ws.$ws(0);

// ws.addEventListener("open", () => {
//   setInterval(() => {
//     ws.send(new Date().toString());
//   }, 1000);
// });
