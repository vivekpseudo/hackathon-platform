import { makeGetRequest, makePostRequest } from "../libs/axios";
import qs from "qs";
import {
  Competition,
  CompetitionDetail,
  CompetitionFormInput,
  ObjectResponseType,
} from "../types/competition";

// Add this type if it doesn't exist in your types file
type ApiResponseType<T> = {
  data: T;
  meta?: any;
};

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
    console.log("API response:", response);
    return response as ApiResponseType<Array<ObjectResponseType<Competition>>>;
  } catch (error) {
    console.error("Error fetching competitions:", error);
    throw error;
  }
};

export const getCompetitionById = async (
  id: number
): Promise<ApiResponseType<ObjectResponseType<CompetitionDetail>>> => {
  const params = qs.stringify({
    populate: "*", 
  });
  try {
    const response = await makeGetRequest(`competitions/${id}?${params}`);
    return response as ApiResponseType<ObjectResponseType<CompetitionDetail>>;
  } catch (error) {
    console.error(`Error fetching competition with ID ${id}:`, error);
    throw error;
  }
};


export const createCompetition = async (
  formData: CompetitionFormInput
): Promise<ApiResponseType<ObjectResponseType<CompetitionDetail>>> => {
  try {
    console.log("Creating competition with data:", formData);
    
    
    const payload = { data: formData };
    console.log("Payload being sent:", payload);
    
    const response = await makePostRequest("competitions", payload);

    console.log(" Competition created successfully:", response);
    return response as ApiResponseType<ObjectResponseType<CompetitionDetail>>;
  } catch (error: any) {
    console.error(" Error creating competition:", error);
    console.error("Error response:", error?.response?.data);
    console.error("Error status:", error?.response?.status);
    throw error;
  }
};
