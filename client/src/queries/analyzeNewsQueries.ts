import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "./client";

type AnalyzeNewsRequest = {
  url: string;
  publish?: boolean;
};

const analyzeNewsMutation = async ({ url, publish }: AnalyzeNewsRequest) => {
  const res = await client.api.v1.analyse.$post({
    json: { url, publish },
  });

  try {
    const data = await res.json();

    if (data.error || data.success === false) {
      throw new Error(data.error || "News analysis failed");
    }
    return data;
  } catch (error) {
    console.error("Mutation error:", error);
    throw error;
  }
};

export const useAnalyzeNewsMutation = () => {
  const queryClient = useQueryClient();
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
      queryClient.invalidateQueries({ queryKey: ["analyzed-news"] });
      return data;
    },
    onError: (error, _variables, toastId) => {
      console.error(error);
      toast.update(toastId as string, {
        render: error.message || "News analysis failed",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });
};

const getAnalyzedNewsForUserQuery = async () => {
  const res = await client.api.v1.analyse.$get();
  if (!res.ok) throw new Error("Failed to get analyzed news");
  return res.json();
};

export const useGetAnalyzedNews = () => {
  return useQuery({
    queryKey: ["analyzed-news"],
    queryFn: getAnalyzedNewsForUserQuery,
  });
};
