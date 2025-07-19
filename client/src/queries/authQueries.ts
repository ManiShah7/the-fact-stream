// src/hooks/useUserQuery.ts
import { useQuery } from "@tanstack/react-query";
import { client } from "./client";

const fetchUser = async () => {
  const res = await client.api.v1.auth.signin.$post();
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};

export const useUserQuery = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });
};
