import { hcWithType } from "server/dist/server/src/client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

export const client = hcWithType(SERVER_URL);
