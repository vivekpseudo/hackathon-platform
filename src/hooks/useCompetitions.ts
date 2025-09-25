import { useQuery } from "@tanstack/react-query";
import { getCompetitionById, getCompetitions } from "../api/competitions";

export const useCompetitions = (pageNumber = 0, pageSize = 10) => {
  const getCompetitionsData = useQuery({
    queryKey: ["competitions"],
    queryFn: () => getCompetitions(pageNumber, pageSize),
    refetchOnWindowFocus: false,
  });

  return {
    getCompetitionsData,
  };
};

export const useGetCompetition = (id: number) =>
  useQuery({
    queryKey: ["competition", id],
    queryFn: () => getCompetitionById(id),
    refetchOnWindowFocus: true,
  });
