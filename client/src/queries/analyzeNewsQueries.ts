import { toast } from "sonner";
import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { client } from "./client";

type AnalyzeNewsRequest = {
  url: string;
  publish?: boolean;
};

const analyzeNewsMutation = async (data: AnalyzeNewsRequest[]) => {
  const res = await client.api.v1.analyse.$post({
    json: data,
  });

  try {
    const data = await res.json();
    return data.data;
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
      const toastId = crypto.randomUUID();

      return toast.loading(
        "Analyzing news... Please wait. This may take a while. We will notify you once it's done.",
        { id: toastId }
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["analyzed-news"] });
      return data;
    },
    onError: (error, _variables, toastId) => {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "News analysis failed",
        { id: toastId }
      );
    },
  });
};

const getAnalyzedNewsForUserQuery = async () => {
  const res = await client.api.v1.analyse.$get();

  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching analyzed news:", error);
  }
};

export const useGetAnalyzedNews = () => {
  return useQuery({
    queryKey: ["analyzed-news"],
    queryFn: getAnalyzedNewsForUserQuery,
  });
};

const getSingleAnalyzedNewsQuery = async ({ id }: { id: string }) => {
  const res = await client.api.v1.analyse[":id"].$get({ param: { id } });

  if (!res.ok) {
    throw new Error(`HTTP error status: ${res.status}`);
  }

  const data = await res.json();

  return data;
};

export const useGetSingleAnalyzedNews = (id?: string) => {
  return useQuery({
    queryKey: ["analyzed-news", id],
    queryFn: id ? () => getSingleAnalyzedNewsQuery({ id }) : skipToken,
  });
};

const getPaginatedPublishedNewsQuery = async ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) => {
  const res = await client.api.v1.published.$get();

  if (!res.ok) {
    throw new Error(`HTTP error status: ${res.status}`);
  }

  const data = await res.json();

  return data;
};

export const useGetPaginatedPublishedNews = ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) => {
  return useQuery({
    queryKey: ["published-news", page, pageSize],
    queryFn: () => getPaginatedPublishedNewsQuery({ page, pageSize }),
  });
};
