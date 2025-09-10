import { client } from "./client";
import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import type { QueueAnalysesParams } from "@server/types/queue";
import { toast } from "sonner";

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

const queueAnalysisLinksMutation = async (data: QueueAnalysesParams[]) => {
  const res = await client.api.v1.queue.$post({ json: data });

  if (!res.ok) {
    throw new Error(`HTTP error status: ${res.status}`);
  }

  const responseData = await res.json();

  return responseData;
};

export const useQueueAnalysisLinksMutation = () => {
  return useMutation({
    mutationKey: ["queueAnalysisLinks"],
    mutationFn: queueAnalysisLinksMutation,
    onMutate: () => {
      const toastId = crypto.randomUUID();
      toast.loading("Queueing analysis...", { id: toastId });
      return { toastId };
    },
    onSuccess: (_data, _variables, context) => {
      toast.success(
        "Analysis queued successfully! We will notify you once done.",
        {
          id: context?.toastId,
        }
      );
    },
    onError: (error, _variables, context) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to queue analysis",
        {
          id: context?.toastId,
        }
      );
    },
  });
};
