import { hcWithType } from "@server/client";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
export const client = hcWithType(SERVER_URL);
