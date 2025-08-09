import { useMutation } from "@tanstack/react-query";
import { client } from "./client";
import { toast } from "react-toastify";

type AnalyzeNewsRequest = {
  url: string;
  publish?: boolean;
};

const analyzeNewsMutation = async ({ url, publish }: AnalyzeNewsRequest) => {
  const accessToken = localStorage.getItem("access_token");
  const res = await client.api.v1.analyse.$post({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    json: { url, publish },
  });
  if (!res.ok) throw new Error("Failed to analyze news");
  return res.json();
};

export const useAnalyzeNewsMutation = () => {
  return useMutation({
    mutationFn: analyzeNewsMutation,
    onMutate: () => {
      return toast.loading(
        "Analyzing news... Please wait. This may take a while."
      );
    },
    onSuccess: (data, _variables, toastId) => {
      toast.update(toastId, {
        render: "News analysis completed successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      return data;
    },
    onError: (error, _variables, toastId) => {
      toast.update(toastId as string, {
        render: error instanceof Error ? error.message : "News analysis failed",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });
};
