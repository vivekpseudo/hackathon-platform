import {  useQuery } from "@tanstack/react-query";
import { getCompetitions } from "../api/competitions";


export const useCompetitions = (pageNumber = 0, pageSize = 10) => {
  const getCompetitionsData = useQuery({
    queryKey: ["competitions"],
    queryFn: () => getCompetitions (pageNumber, pageSize),
    refetchOnWindowFocus: false,
  });

  return {
    getCompetitionsData,
  };
};
