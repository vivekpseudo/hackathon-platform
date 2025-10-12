import { makeGetRequest, makePostRequest } from "../libs/axios";
import qs from "qs";
import {
  Competition,
  CompetitionDetail,
  CompetitionFormInput,
  ObjectResponseType,
} from "../types/competition";

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
    console.log("🚀 Creating competition with form data:", formData);
    
    // DEBUG: Log raw description
    console.log("DEBUG - Raw formData.description:", formData.description);
    
    // Step 1: Create components first (organiser, contact)
    // These need to be created separately and then linked by ID
    
    // Create CompetitionOrganiser
    let organiserId = null;
    if (formData.competition_organiser?.name) {
      try {
        const organiserResponse = await makePostRequest("competition-organisers", {
          data: formData.competition_organiser
        });
        organiserId = organiserResponse.data.data.id;
        console.log("✅ Organiser created with ID:", organiserId);
      } catch (err: any) {
        console.error("❌ Failed to create organiser:", err?.response?.data || err);
      }
    }

    // Create CompetitionContact
    let contactId = null;
    if (formData.competition_contact?.email) {
      try {
        const contactResponse = await makePostRequest("competition-contacts", {
          data: formData.competition_contact
        });
        contactId = contactResponse.data.data.id;
        console.log("✅ Contact created with ID:", contactId);
      } catch (err: any) {
        console.error("❌ Failed to create contact:", err?.response?.data || err);
      }
    }

    // Create CompetitionRewards
    const rewardIds: number[] = [];
    for (const reward of formData.competition_rewards) {
      if (reward.title) {
        try {
          const rewardResponse = await makePostRequest("competition-rewards", {
            data: {
              title: reward.title,
              description: reward.description || "",
              amount: reward.amount?.toString() || "0",
              isCash: reward.isCash ?? false,
              position: reward.position?.toString() || "1",
            }
          });
          rewardIds.push(rewardResponse.data.data.id);
          console.log("✅ Reward created with ID:", rewardResponse.data.data.id);
        } catch (err: any) {
          console.error("❌ Failed to create reward:", err?.response?.data || err);
        }
      }
    }

    // Create CompetitionTimelines
    const timelineIds: number[] = [];
    for (const timeline of formData.competition_timelines) {
      if (timeline.title && timeline.startDate && timeline.endDate) {
        try {
          const timelineResponse = await makePostRequest("competition-timelines", {
            data: {
              title: timeline.title,
              description: timeline.description || "",
              startDate: timeline.startDate,
              endDate: timeline.endDate,
              type: timeline.type || "Online",
            }
          });
          timelineIds.push(timelineResponse.data.data.id);
          console.log("✅ Timeline created with ID:", timelineResponse.data.data.id);
        } catch (err: any) {
          console.error("❌ Failed to create timeline:", err?.response?.data || err);
        }
      }
    }

    // Step 2: Strip HTML and prepare description for Strapi v4 Rich Text format
    const plainTextDescription = formData.description
      ?.replace(/<[^>]*>/g, '') // Remove HTML tags
      ?.trim() || ""; // Trim whitespace

    // DEBUG: Log all description steps
    console.log("DEBUG - After stripping HTML:", plainTextDescription);
    console.log("DEBUG - Description type:", typeof plainTextDescription);
    console.log("DEBUG - Description length:", plainTextDescription.length);
    console.log("DEBUG - Description is empty?:", plainTextDescription === "");

    // Convert plain text to Strapi v4 Rich Text format
    const descriptionJSON = plainTextDescription ? {
      blocks: [
        {
          key: "key1",
          text: plainTextDescription,
          type: "paragraph",
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {}
        }
      ],
      entityMap: {}
    } : null;

    console.log("DEBUG - Description JSON:", JSON.stringify(descriptionJSON, null, 2));

    // Step 3: Create the main competition with all the IDs
    const payload: any = {
      data: {
        Title: formData.Title,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive ?? true,
        isCompleted: formData.isCompleted ?? false,
        type: formData.type || "Online",
        minMember: formData.minMember || 1,
        maxMember: formData.maxMember || 5,
        feeType: formData.feeType || "Free",
        feePerMember: formData.feePerMember || 0,
        feePerTeam: formData.feePerTeam || 0,
        isFeeForTeam: formData.isFeeForTeam ?? false,
        competition_category: formData.competition_category?.[0] || null,
        competition_organiser: organiserId,
        competition_contact: contactId,
        competition_rewards: rewardIds.length > 0 ? rewardIds : null,
        competition_timelines: timelineIds.length > 0 ? timelineIds : null,
        competition_result: formData.competition_result || null,
        helpDocs: formData.helpDocs?.length > 0 ? formData.helpDocs : null,
      }
    };

    // Add description in Strapi v4 JSON Rich Text format if it has content
    if (descriptionJSON) {
      payload.data.description = descriptionJSON;
      console.log("✅ Description added to payload in Strapi v4 format");
    } else {
      console.warn("⚠️ Description is empty, not adding to payload");
    }
    
    console.log("Final competition payload:", JSON.stringify(payload, null, 2));
    
    const response = await makePostRequest("competitions", payload);

    console.log("Competition created successfully:", response);
    return response as ApiResponseType<ObjectResponseType<CompetitionDetail>>;
    
  } catch (error: any) {
    console.error("Error creating competition:", error);
    console.error("Error response:", error?.response?.data);
    console.error("Error status:", error?.response?.status);
    
    if (error?.response?.data?.error?.details) {
      console.error("Detailed errors:", error.response.data.error.details);
    }
    
    throw error;
  }
};
export const getAllCompetitions = async (
  pageNumber: number = 0,
  pageSize: number = 100
): Promise<ApiResponseType<ObjectResponseType<Competition>[]>> => {
  const params = qs.stringify({
    sort: ["startDate:desc"],
    pagination: { page: pageNumber, pageSize: pageSize, withCount: true },
    // NO filters - gets everything
  });
  try {
    const response = await makeGetRequest(`competitions?${params}`);
    console.log("All competitions fetched:", response);
    return response as ApiResponseType<Array<ObjectResponseType<Competition>>>;
  } catch (error) {
    console.error("Error fetching all competitions:", error);
    throw error;
  }
};