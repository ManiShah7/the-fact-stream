import { client } from "./client";
import { skipToken, useQuery } from "@tanstack/react-query";

const checkQueuedAnalysisQueries = async ({ userId }: { userId: number }) => {
  const res = await client.api.v1.ws[":userId"].$get({
    param: { userId: userId.toString() },
  });

  if (!res.ok) {
    throw new Error(`HTTP error status: ${res.status}`);
  }

  const data = await res.json();

  return data;
};

export const useCheckQueuedAnalysisQueriesQuery = (userId?: number) => {
  return useQuery({
    queryKey: ["checkQueuedAnalysisQueries", userId],
    queryFn: userId ? () => checkQueuedAnalysisQueries({ userId }) : skipToken,
  });
};
