import { makeGetRequest, makePostRequest,makePutRequest } from "../libs/axios";
import qs from "qs";
import {  ObjectResponseType } from "../types/competition";
import { Competition, CompetitionDetail, CompetitionFormInput } from "../types/competition";
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
export const createCompetition = async (formData: CompetitionFormInput) => {
  try {
    const response = await makePostRequest("competitions", { data: formData });
    return response.data;
  } catch (error: any) {
    console.error("Error creating competition:", error.response || error.message || error);
    throw error;
  }
};

export const updateCompetition = async (id: number, formData: CompetitionFormInput) => {
  try {
    const response = await makePutRequest(`competitions/${id}`, { data: formData });
    return response.data;
  } catch (error) {
    console.error("Error updating competition:", error);
    throw error;
  }
};
