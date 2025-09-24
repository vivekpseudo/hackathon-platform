import { makeGetRequest } from "../libs/axios";
import qs from "qs";

export const getCompetitions = async (
  pageNumber: number = 0,
  pageSize: number = 10,
  isActive: boolean = true
): Promise<ApiResponseType<ObjectResponseType<Competition>[]>> => {
  const params = qs.stringify({
    sort: ["startDate:desc"],
    pagination: { page: pageNumber, pageSize: pageSize, withCount: true },
    filters: { isActive },
  });

  try {
    const response = await makeGetRequest(`competitions?${params}`);
    console.log("API response:", response); // Debug log
    return response as ApiResponseType<Array<ObjectResponseType<Competition>>>; // Ensure we return an array
  } catch (error) {
    console.error("Error fetching competitions:", error);
    throw error;
  }
};

export const getCompetitionById = async (
  id: number
): Promise<ApiResponseType<ObjectResponseType<CompetitionDetail>>> => {
  const params = qs.stringify({
    populate: "*", // Populate all relations
  });
  try {
    const response = await makeGetRequest(`competitions/${id}?${params}`);
    return response as ApiResponseType<ObjectResponseType<CompetitionDetail>>;
  } catch (error) {
    console.error(`Error fetching competition with ID ${id}:`, error);
    throw error;
  }
};
