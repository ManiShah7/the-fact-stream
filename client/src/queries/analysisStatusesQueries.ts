import { useQuery } from "@tanstack/react-query";
import { client } from "./client";

const getAnalysisStatuses = async () => {
  const res = await client.api.v1.analysisStatuses.$get();

  if (!res.ok) {
    throw new Error(`HTTP error status: ${res.status}`);
  }

  const responseData = await res.json();

  return responseData;
};

export const useGetAnalysisStatuses = () => {
  return useQuery({
    queryKey: ["analysisStatuses"],
    queryFn: getAnalysisStatuses,
  });
};
