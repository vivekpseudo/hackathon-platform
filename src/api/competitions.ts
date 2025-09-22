import { makeGetRequest } from "../libs/axios";

export const getCompetitions = async (pageNumber: number = 0, pageSize: number = 10) => {
   
    try {
        const response = await makeGetRequest(`competitions?pagination%5BwithCount%5D=true&pagination%5Bpage%5D=${pageNumber}&pagination%5BpageSize%5D=${pageSize}`)as { data: any };
        console.log('API response:', response); // Debug log
        return response?.data || []; // Ensure we return an array
    } catch (error) {
        console.error('Error fetching competitions:', error);
        throw error;
    }
}