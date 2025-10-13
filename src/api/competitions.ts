import { makeGetRequest, makePostRequest, makePutRequest, } from "../libs/axios";
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

// ✅ Get active competitions
export const getCompetitions = async (
  pageNumber: number = 0,
  pageSize: number = 10,
  isActive: boolean = true
): Promise<ApiResponseType<ObjectResponseType<Competition>[]>> => {
  const params = qs.stringify({
    sort: ["startDate:desc"],
    pagination: { page: pageNumber, pageSize, withCount: true },
    filters: { isActive },
  });

  try {
    const response = await makeGetRequest(`competitions?${params}`);
    return response as ApiResponseType<Array<ObjectResponseType<Competition>>>;
  } catch (error) {
    console.error("Error fetching competitions:", error);
    throw error;
  }
};

// ✅ Get competition by ID
export const getCompetitionById = async (
  id: number
): Promise<ApiResponseType<ObjectResponseType<CompetitionDetail>>> => {
  const params = qs.stringify({ populate: "*" });

  try {
    const response = await makeGetRequest(`competitions/${id}?${params}`);
    return response as ApiResponseType<ObjectResponseType<CompetitionDetail>>;
  } catch (error) {
    console.error(`Error fetching competition with ID ${id}:`, error);
    throw error;
  }
};

// ✅ Create competition
export const createCompetition = async (
  formData: CompetitionFormInput
): Promise<ApiResponseType<ObjectResponseType<CompetitionDetail>>> => {
  try {
    console.log("🚀 Creating competition with form data:", formData);

    // --- create organiser ---
    let organiserId: number | null = null;
    if (formData.competition_organiser?.name) {
      try {
        const res = await makePostRequest("competition-organisers", {
          data: formData.competition_organiser,
        });
        organiserId = res.data.data.id;
        console.log("✅ Organiser created:", organiserId);
      } catch (err: any) {
        console.error("❌ Organiser creation failed:", err?.response?.data || err);
      }
    }

    // --- create contact ---
    let contactId: number | null = null;
    if (formData.competition_contact?.email) {
      try {
        const res = await makePostRequest("competition-contacts", {
          data: formData.competition_contact,
        });
        contactId = res.data.data.id;
        console.log("✅ Contact created:", contactId);
      } catch (err: any) {
        console.error("❌ Contact creation failed:", err?.response?.data || err);
      }
    }

    // --- create rewards ---
    const rewardIds: number[] = [];
    for (const reward of formData.competition_rewards || []) {
      if (!reward.title) continue;
      try {
        const res = await makePostRequest("competition-rewards", {
          data: {
            title: reward.title,
            description: reward.description || "",
            amount: reward.amount?.toString() || "0",
            isCash: reward.isCash ?? false,
            position: reward.position?.toString() || "1",
          },
        });
        rewardIds.push(res.data.data.id);
        console.log("✅ Reward created:", res.data.data.id);
      } catch (err: any) {
        console.error("❌ Reward creation failed:", err?.response?.data || err);
      }
    }

    // --- create timelines ---
    const timelineIds: number[] = [];
    for (const timeline of formData.competition_timelines || []) {
      if (!timeline.title || !timeline.startDate || !timeline.endDate) continue;
      try {
        const res = await makePostRequest("competition-timelines", {
          data: {
            title: timeline.title,
            description: timeline.description || "",
            startDate: timeline.startDate,
            endDate: timeline.endDate,
            type: timeline.type || "Online",
          },
        });
        timelineIds.push(res.data.data.id);
        console.log("✅ Timeline created:", res.data.data.id);
      } catch (err: any) {
        console.error("❌ Timeline creation failed:", err?.response?.data || err);
      }
    }

    // --- description handling ---
    const descriptionJSON = formData.description || null;
    console.log(
      "DEBUG - Raw description from editor:",
      JSON.stringify(descriptionJSON, null, 2)
    );
    console.log("DEBUG - Description type:", typeof descriptionJSON);
    console.log("DEBUG - Description has content?:", descriptionJSON?.content?.length > 0);

    // --- prepare payload ---
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
      },
    };

    // Add TipTap JSON description if present
    if (descriptionJSON && descriptionJSON.content && descriptionJSON.content.length > 0) {
      payload.data.description = descriptionJSON;
      console.log("✅ Description added to payload in TipTap JSON format");
    } else {
      console.warn("⚠️ Description is empty, not adding to payload");
    }

    console.log("Final competition payload:", JSON.stringify(payload, null, 2));

    const response = await makePostRequest("competitions", payload);

    console.log("✅ Competition created successfully:", response);
    return response as ApiResponseType<ObjectResponseType<CompetitionDetail>>;
  } catch (error: any) {
    console.error("❌ Error creating competition:", error);
    console.error("Error response:", error?.response?.data);
    console.error("Error status:", error?.response?.status);

    if (error?.response?.data?.error?.details) {
      console.error("Detailed errors:", error.response.data.error.details);
    }

    throw error;
  }
};

// ✅ Get all competitions
export const getAllCompetitions = async (
  pageNumber: number = 0,
  pageSize: number = 100
): Promise<ApiResponseType<ObjectResponseType<Competition>[]>> => {
  const params = qs.stringify({
    sort: ["startDate:desc"],
    pagination: { page: pageNumber, pageSize, withCount: true },
  });

  try {
    const response = await makeGetRequest(`competitions?${params}`);
    return response as ApiResponseType<Array<ObjectResponseType<Competition>>>;
  } catch (error) {
    console.error("Error fetching all competitions:", error);
    throw error;
  }
};


export const registerParticipant = async (participantData: any): Promise<ApiResponseType<any>> => {
  try {
    console.log("🚀 Registering participant...");
    console.log("📋 Payload:", participantData);

    const payload = { data: participantData };
    
    const response = await makePostRequest("competition-participants", payload);
    
    console.log("✅ Participant registered successfully:", response);
    return response as ApiResponseType<any>;
  } catch (error: any) {
    console.error("❌ Registration error:", error);
    console.error("Error status:", error?.response?.status);
    console.error("Error message:", error?.response?.statusText);
    console.error("Error data:", error?.response?.data);
    throw error;
  }
};

// Get all participants
export const getParticipants = async (
  pageNumber: number = 0,
  pageSize: number = 10
): Promise<ApiResponseType<any[]>> => {
  const params = qs.stringify({
    pagination: { page: pageNumber, pageSize: pageSize, withCount: true },
    populate: "*",
  });

  try {
    const response = await makeGetRequest(`competition-participants?${params}`);
    console.log("Participants fetched:", response);
    return response as ApiResponseType<any[]>;
  } catch (error) {
    console.error("Error fetching participants:", error);
    throw error;
  }
};

// Get participant by ID
export const getParticipantById = async (id: number): Promise<ApiResponseType<any>> => {
  const params = qs.stringify({
    populate: "*",
  });

  try {
    const response = await makeGetRequest(`competition-participants/${id}?${params}`);
    console.log("Participant fetched:", response);
    return response as ApiResponseType<any>;
  } catch (error) {
    console.error(`Error fetching participant with ID ${id}:`, error);
    throw error;
  }
};

// Get participants by competition ID
export const getParticipantsByCompetition = async (
  competitionId: number,
  pageNumber: number = 0,
  pageSize: number = 10
): Promise<ApiResponseType<any[]>> => {
  const params = qs.stringify({
    filters: { competitions: { id: { $eq: competitionId } } },
    pagination: { page: pageNumber, pageSize: pageSize, withCount: true },
    populate: "*",
  });

  try {
    const response = await makeGetRequest(`competition-participants?${params}`);
    console.log("Participants for competition fetched:", response);
    return response as ApiResponseType<any[]>;
  } catch (error) {
    console.error(`Error fetching participants for competition ${competitionId}:`, error);
    throw error;
  }
};

// Update participant
export const updateParticipant = async (id: number, participantData: any): Promise<ApiResponseType<any>> => {
  try {
    console.log("🚀 Updating participant:", id);
    
    const payload = { data: participantData };
    
    const response = await makePutRequest(`competition-participants/${id}`, payload);
    
    console.log("✅ Participant updated successfully:", response);
    return response as ApiResponseType<any>;
  } catch (error: any) {
    console.error("❌ Update error:", error);
    console.error("Error response:", error?.response?.data);
    throw error;
  }
};

// Delete participant
export const deleteParticipant = async (id: number): Promise<ApiResponseType<any>> => {
  try {
    console.log("🚀 Deleting participant:", id);
    
    const response = await makeDeleteRequest(`competition-participants/${id}`);
    
    console.log("✅ Participant deleted successfully:", response);
    return response as ApiResponseType<any>;
  } catch (error: any) {
    console.error("❌ Delete error:", error);
    console.error("Error response:", error?.response?.data);
    throw error;
  }
};

// Get teams for a competition
export const getTeams = async (
  competitionId?: number,
  pageNumber: number = 0,
  pageSize: number = 10
): Promise<ApiResponseType<any[]>> => {
  let params = qs.stringify({
    pagination: { page: pageNumber, pageSize: pageSize, withCount: true },
    populate: "*",
  });

  if (competitionId) {
    params = qs.stringify({
      filters: { competitions: { id: { $eq: competitionId } } },
      pagination: { page: pageNumber, pageSize: pageSize, withCount: true },
      populate: "*",
    });
  }

  try {
    const response = await makeGetRequest(`competition-teams?${params}`);
    console.log("Teams fetched:", response);
    return response as ApiResponseType<any[]>;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};

// Create team
export const createTeam = async (teamData: any): Promise<ApiResponseType<any>> => {
  try {
    console.log("🚀 Creating team...");
    
    const payload = { 
      data: {
        name: teamData.name,
        teamLeader: teamData.teamLeader,
        competition_participants: teamData.participantIds || [],
      }
    };
    
    console.log("Team payload:", payload);
    
    const response = await makePostRequest("competition-teams", payload);
    
    console.log("✅ Team created successfully:", response);
    return response as ApiResponseType<any>;
  } catch (error: any) {
    console.error("❌ Team creation error:", error);
    console.error("Error response:", error?.response?.data);
    throw error;
  }
};

// Register participant with team
export const registerParticipantWithTeam = async (participantData: any, teamId?: number) => {
  try {
    console.log("🚀 Registering participant with team...");
    
    const payload: any = {
      data: {
        name: participantData.name,
        email: participantData.email,
        phone: participantData.phone,
        profileImage: participantData.profileImage,
        registrationType: "Team Member",
      }
    };

    // Link to team if provided
    if (teamId) {
      payload.data.competition_teams = [teamId];
    }
    
    console.log("Participant with team payload:", payload);
    
    const response = await makePostRequest("competition-participants", payload);
    
    console.log("✅ Participant with team registered successfully:", response);
    return response as ApiResponseType<any>;
  } catch (error: any) {
    console.error("❌ Registration error:", error);
    console.error("Error response:", error?.response?.data);
    throw error;
  }
};