import { hcWithType } from "server/dist/server/src/client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const accessToken = localStorage.getItem("access_token");

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${accessToken}`,
};

export const client = hcWithType(SERVER_URL, {
  headers,
});
