import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import type { QueueAnalysesParams } from "@server/types/queue";
import { client } from "./client";

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
    onSuccess: (data, _variables, context) => {
      toast.success(
        "Analysis queued successfully! We will notify you once done.",
        {
          id: context?.toastId,
        }
      );

      return data.data;
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
