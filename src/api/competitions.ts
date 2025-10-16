import { makeGetRequest, makePostRequest, makePutRequest } from "../libs/axios";
import qs from "qs";
import { getAuthToken } from "../libs/storageHelper";
import axios from "axios";
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

const API_URL = import.meta.env.VITE_API_BASE_URL;

// ============== FILE UPLOAD ==============
export const uploadImage = async (file: File): Promise<any> => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append("files", file);

  try {
    const response = await axios.post(
      `${API_URL}/upload`, 
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Strapi returns an array of uploaded files
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0]; // Return the first uploaded file object
    }
    
    throw new Error("No file returned from upload");
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};

// ============== COMPETITIONS ==============

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

  const response = await makeGetRequest(`competitions?${params}`);
  return response as ApiResponseType<Array<ObjectResponseType<Competition>>>;
};

export const getAllCompetitions = async (
  pageNumber: number = 0,
  pageSize: number = 100
): Promise<ApiResponseType<ObjectResponseType<Competition>[]>> => {
  const params = qs.stringify({
    sort: ["startDate:desc"],
    pagination: { page: pageNumber, pageSize, withCount: true },
  });

  const response = await makeGetRequest(`competitions?${params}`);
  return response as ApiResponseType<Array<ObjectResponseType<Competition>>>;
};

export const getCompetitionById = async (
  id: number
): Promise<ApiResponseType<ObjectResponseType<CompetitionDetail>>> => {
  const params = qs.stringify({ populate: "*" });
  const response = await makeGetRequest(`competitions/${id}?${params}`);
  return response as ApiResponseType<ObjectResponseType<CompetitionDetail>>;
};

export const getUserHackathons = async (userId: number) => {
  const response = await makeGetRequest(
    `competitions?filters[user][id][$eq]=${userId}&pagination[limit]=100`
  );
  return response;
};

export const createCompetition = async (
  formData: CompetitionFormInput,
  currentUser?: any
): Promise<ApiResponseType<ObjectResponseType<CompetitionDetail>>> => {
  let userId = currentUser?.id;

  if (currentUser?.email) {
    try {
      const userCheckResponse = await makeGetRequest(
        `users-permissions/users?filters[email][$eq]=${currentUser.email}`
      );
      if (userCheckResponse.data?.length > 0) {
        userId = userCheckResponse.data[0].id;
      }
    } catch (err) {
      console.warn("Could not verify user");
    }
  }

  let organiserId: number | null = null;
  if (formData.competition_organiser?.name) {
    const res = await makePostRequest("competition-organisers", {
      data: formData.competition_organiser,
    });
    organiserId = res.data.data.id;
  }

  let contactId: number | null = null;
  if (formData.competition_contact?.email) {
    const res = await makePostRequest("competition-contacts", {
      data: formData.competition_contact,
    });
    contactId = res.data.data.id;
  }

  const rewardIds: number[] = [];
  for (const reward of formData.competition_rewards || []) {
    if (!reward.title) continue;
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
  }

  const timelineIds: number[] = [];
  for (const timeline of formData.competition_timelines || []) {
    if (!timeline.title || !timeline.startDate || !timeline.endDate) continue;
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
  }

  // Upload help docs if provided
  const helpDocIds: number[] = [];
  if (formData.helpDocs && Array.isArray(formData.helpDocs) && formData.helpDocs.length > 0) {
    for (const file of formData.helpDocs) {
      if (file instanceof File) {
        const uploadedFile = await uploadImage(file);
        helpDocIds.push(uploadedFile.id);
      } else if (typeof file === 'number') {
        // Already an ID
        helpDocIds.push(file);
      }
    }
  }

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
      helpDocs: helpDocIds.length > 0 ? helpDocIds : null,
      user: userId,
    },
  };

  if (formData.description?.content?.length > 0) {
    payload.data.description = formData.description;
  }

  const response = await makePostRequest("competitions", payload);
  return response as ApiResponseType<ObjectResponseType<CompetitionDetail>>;
};

// ============== PARTICIPANTS ==============

export const registerParticipant = async (participantData: {
  name: string;
  email: string;
  phone: string;
  registrationType: string;
  profileImage?: number | null;
}): Promise<ApiResponseType<any>> => {
  const payload = { 
    data: {
      name: participantData.name,
      email: participantData.email,
      phone: participantData.phone,
      registrationType: participantData.registrationType,
      ...(participantData.profileImage && { profileImage: participantData.profileImage }),
    }
  };
  
  const response = await makePostRequest("competition-participants", payload);
  return response as ApiResponseType<any>;
};

export const registerParticipantWithTeam = async (participantData: {
  name: string;
  email: string;
  phone: string;
  profileImage?: number | null;
}): Promise<ApiResponseType<any>> => {
  const payload = {
    data: {
      name: participantData.name,
      email: participantData.email,
      phone: participantData.phone,
      registrationType: "Team Member",
      ...(participantData.profileImage && { profileImage: participantData.profileImage }),
    }
  };
  
  const response = await makePostRequest("competition-participants", payload);
  return response;
};

export const getParticipants = async (
  pageNumber: number = 0,
  pageSize: number = 10
): Promise<ApiResponseType<any[]>> => {
  const params = qs.stringify({
    pagination: { page: pageNumber, pageSize: pageSize, withCount: true },
    populate: ["competitions", "competition_teams", "profileImage"],
  });

  const response = await makeGetRequest(`competition-participants?${params}`);
  return response as ApiResponseType<any[]>;
};

export const getParticipantById = async (id: number): Promise<ApiResponseType<any>> => {
  const params = qs.stringify({ populate: "*" });
  const response = await makeGetRequest(`competition-participants/${id}?${params}`);
  return response as ApiResponseType<any>;
};

export const updateParticipant = async (id: number, participantData: any): Promise<ApiResponseType<any>> => {
  const payload = { data: participantData };
  const response = await makePutRequest(`competition-participants/${id}`, payload);
  return response as ApiResponseType<any>;
};

// ============== TEAMS ==============

export const createTeam = async (teamData: {
  name: string;
  teamLeader: number;
  participantIds: number[];
}): Promise<ApiResponseType<any>> => {
  const payload = { 
    data: {
      name: teamData.name,
      teamLeader: teamData.teamLeader,
      competition_participants: teamData.participantIds || [],
    }
  };
  
  const response = await makePostRequest("competition-teams", payload);
  return response;
};

export const getTeams = async (
  competitionId?: number,
  pageNumber: number = 0,
  pageSize: number = 10
): Promise<ApiResponseType<any[]>> => {
  const filters = competitionId 
    ? { filters: { competitions: { id: { $eq: competitionId } } } }
    : {};

  const params = qs.stringify({
    ...filters,
    pagination: { page: pageNumber, pageSize: pageSize, withCount: true },
    populate: "*",
  });

  const response = await makeGetRequest(`competition-teams?${params}`);
  return response as ApiResponseType<any[]>;
};

// ============== REGISTRATIONS ==============

export const createCompetitionRegistration = async (
  competitionId: number,
  participantId?: number,
  teamId?: number
): Promise<ApiResponseType<any>> => {
  const payload: any = { 
    data: {
      competition: competitionId,
      dateOfReg: new Date().toISOString(),
      ...(participantId && { participantId }),
      ...(teamId && { competition_team: teamId }),
    }
  };
  
  const response = await makePostRequest("competition-registrations", payload);
  return response as ApiResponseType<any>;
};

export const getRegistrationsByCompetition = async (
  competitionId: number,
  pageNumber: number = 0,
  pageSize: number = 100
): Promise<ApiResponseType<any[]>> => {
  const params = qs.stringify({
    filters: { competition: { id: { $eq: competitionId } } },
    pagination: { page: pageNumber, pageSize: pageSize, withCount: true },
    populate: ["competition", "participantId", "competition_team"],
  });

  const response = await makeGetRequest(`competition-registrations?${params}`);
  return response as ApiResponseType<any[]>;
};

export const getUserRegistrations = async (
  userEmail: string,
  pageNumber: number = 0,
  pageSize: number = 100
): Promise<ApiResponseType<any[]>> => {
  const participantsResponse = await getParticipants(0, 1000);
  
  const userParticipants = participantsResponse.data?.filter(
    (participant: any) => participant.attributes?.email === userEmail
  ) || [];
  
  if (userParticipants.length === 0) {
    return { data: [], meta: {} } as ApiResponseType<any[]>;
  }
  
  const participantIds = userParticipants.map((p: any) => p.id);
  
  const params = qs.stringify({
    pagination: { page: pageNumber, pageSize: pageSize, withCount: true },
    populate: { competition: true, competition_team: true },
  });

  const response = await makeGetRequest(`competition-registrations?${params}`);
  
  if (response.data && Array.isArray(response.data)) {
    const userRegistrations = response.data.filter((registration: any) => {
      const regParticipantId = registration.attributes?.participantId;
      return regParticipantId && participantIds.includes(regParticipantId);
    });
    
    return {
      data: userRegistrations,
      meta: response.meta
    } as ApiResponseType<any[]>;
  }
  
  return response as ApiResponseType<any[]>;
};

// ============== SUBMISSIONS ==============
export const createCompetitionSubmission = async (
  data: any, 
  competitionId: number,
  userEmail?: string
) => {
  const token = getAuthToken();
  if (!token) throw new Error("You must be logged in to submit a project.");

  const submissionPayload = {
    data: {
      TeamName: data.TeamName,
      GitHub: data.GitHub,
      Description: data.Description,
      TeamMembers: data.TeamMembers,
      SubmissionDate: new Date().toISOString(),
      competition: competitionId,
    },
  };

  console.log("📤 Submission payload:", JSON.stringify(submissionPayload, null, 2));
  console.log("🔑 Using token:", token ? "EXISTS" : "MISSING");

  const response = await makePostRequest("competition-submissions", submissionPayload, token);
  return response;
};