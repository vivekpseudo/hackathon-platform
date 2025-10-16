import { makeGetRequest, makePostRequest, makePutRequest } from "../libs/axios";
import qs from "qs";
import { getAuthToken } from "../libs/storageHelper";
import axios from "axios";
import { convertTipTapToStrapiBlocks } from "../utils/strapiBlockConverter";
import type {
  Competition,
  CompetitionDetail,
  CompetitionFormInput,
  ObjectResponseType,
} from "../types/competition";

// ============== TYPES ==============
type ApiResponseType<T> = {
  data: T;
  meta?: any;
};

type UploadResponse = {
  id: number;
  name: string;
  url: string;
  [key: string]: any;
};

const API_URL = import.meta.env.VITE_API_BASE_URL;
const MAX_FILE_SIZE = 50 * 1024 * 1024; 

// ============== ERROR HANDLING ==============
class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ============== FILE UPLOAD ==============
/**
 * Uploads a single file to Strapi
 * @param file - File to upload
 * @returns Upload response with file metadata
 */
export const uploadImage = async (file: File): Promise<UploadResponse> => {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new ApiError(
      400,
      "Bad Request",
      `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      { filename: file.name }
    );
  }

  const token = getAuthToken();
  if (!token) {
    throw new ApiError(401, "Unauthorized", "Authentication token not found");
  }

  const formData = new FormData();
  formData.append("files", file);

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (Array.isArray(response.data) && response.data.length > 0) {
      console.log(`✅ File uploaded: ${file.name} (ID: ${response.data[0].id})`);
      return response.data[0];
    }

    throw new ApiError(
      500,
      "Internal Server Error",
      "No file data returned from server"
    );
  } catch (error: any) {
    console.error("❌ Image upload failed:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      error.response?.status || 500,
      error.response?.statusText || "Unknown Error",
      `Failed to upload file: ${file.name}`,
      error.response?.data
    );
  }
};

/**
 * Uploads multiple files in parallel
 * @param files - Array of files to upload
 * @returns Array of upload responses
 */
export const uploadMultipleFiles = async (
  files: File[]
): Promise<UploadResponse[]> => {
  if (!files || files.length === 0) return [];

  try {
    const uploadPromises = files.map((file) => uploadImage(file));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error("❌ Multiple file upload failed:", error);
    throw error;
  }
};

// ============== COMPETITIONS ==============
/**
 * Get active competitions with pagination
 */
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

/**
 * Get all competitions regardless of active status
 */
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

/**
 * Get single competition with full details and relations
 */
export const getCompetitionById = async (
  id: number
): Promise<ApiResponseType<ObjectResponseType<CompetitionDetail>>> => {
  const params = qs.stringify({ populate: "*" });
  const response = await makeGetRequest(`competitions/${id}?${params}`);
  return response as ApiResponseType<ObjectResponseType<CompetitionDetail>>;
};

/**
 * Get hackathons created by a specific user
 */
export const getUserHackathons = async (userId: number) => {
  const response = await makeGetRequest(
    `competitions?filters[user][id][$eq]=${userId}&pagination[limit]=100`
  );
  return response;
};

/**
 * Create a new competition with all related data
 * Handles: organisers, contacts, rewards, timelines, help docs, and rich text description
 */
export const createCompetition = async (
  formData: CompetitionFormInput,
  currentUser?: any
): Promise<ApiResponseType<ObjectResponseType<CompetitionDetail>>> => {
  try {
    let userId = currentUser?.id;

    // Fetch user ID if only email provided
    if (currentUser?.email && !userId) {
      try {
        const userCheckResponse = await makeGetRequest(
          `users-permissions/users?filters[email][$eq]=${encodeURIComponent(currentUser.email)}`
        );
        if (userCheckResponse?.data?.length > 0) {
          userId = userCheckResponse.data[0].id;
        }
      } catch (err) {
        console.warn("⚠️ Could not verify user, continuing without userId");
      }
    }

    // Create organiser if provided
    let organiserId: number | null = null;
    if (formData.competition_organiser?.name) {
      const res = await makePostRequest("competition-organisers", {
        data: formData.competition_organiser,
      });
      organiserId = res.data.data.id;
      console.log(`✅ Organiser created: ${organiserId}`);
    }

    // Create contact if provided
    let contactId: number | null = null;
    if (formData.competition_contact?.email) {
      const res = await makePostRequest("competition-contacts", {
        data: formData.competition_contact,
      });
      contactId = res.data.data.id;
      console.log(`✅ Contact created: ${contactId}`);
    }

    // Create rewards
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
    if (rewardIds.length > 0) {
      console.log(`✅ Created ${rewardIds.length} rewards`);
    }

    // Create timelines
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
    if (timelineIds.length > 0) {
      console.log(`✅ Created ${timelineIds.length} timelines`);
    }

    // Upload help docs
    const helpDocIds: number[] = [];
    if (formData.helpDocs && Array.isArray(formData.helpDocs) && formData.helpDocs.length > 0) {
      for (const file of formData.helpDocs) {
        if (file instanceof File) {
          const uploadedFile = await uploadImage(file);
          helpDocIds.push(uploadedFile.id);
        } else if (typeof file === "number") {
          helpDocIds.push(file);
        }
      }
    }
    if (helpDocIds.length > 0) {
      console.log(`✅ Uploaded ${helpDocIds.length} help docs`);
    }

    // Convert description from TipTap to Strapi Blocks format
    let descriptionBlocks = null;
    if (formData.description) {
      descriptionBlocks = convertTipTapToStrapiBlocks(formData.description);
      console.log("✅ Description converted to Strapi Blocks format");
    }

    // Build main competition payload
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
        ...(descriptionBlocks && { description: descriptionBlocks }),
      },
    };

    console.log("📤 Submitting competition payload...");
    const response = await makePostRequest("competitions", payload);
    console.log("✅ Competition created successfully");
    return response as ApiResponseType<ObjectResponseType<CompetitionDetail>>;
  } catch (error) {
    console.error("❌ Error creating competition:", error);
    throw error;
  }
};

/**
 * Update an existing competition
 */
export const updateCompetition = async (
  id: number,
  formData: Partial<CompetitionFormInput>
): Promise<ApiResponseType<ObjectResponseType<CompetitionDetail>>> => {
  try {
    let descriptionBlocks = null;
    if (formData.description) {
      descriptionBlocks = convertTipTapToStrapiBlocks(formData.description);
    }

    const payload: any = { data: {} };

    if (formData.Title) payload.data.Title = formData.Title;
    if (formData.startDate) payload.data.startDate = formData.startDate;
    if (formData.endDate) payload.data.endDate = formData.endDate;
    if (formData.isActive !== undefined) payload.data.isActive = formData.isActive;
    if (formData.isCompleted !== undefined) payload.data.isCompleted = formData.isCompleted;
    if (formData.type) payload.data.type = formData.type;
    if (descriptionBlocks) payload.data.description = descriptionBlocks;

    const response = await makePutRequest(`competitions/${id}`, payload);
    console.log(`✅ Competition ${id} updated successfully`);
    return response as ApiResponseType<ObjectResponseType<CompetitionDetail>>;
  } catch (error) {
    console.error(`❌ Error updating competition ${id}:`, error);
    throw error;
  }
};

// ============== PARTICIPANTS ==============
/**
 * Register an individual participant
 */
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
    },
  };

  const response = await makePostRequest("competition-participants", payload);
  return response as ApiResponseType<any>;
};

/**
 * Register a team member participant
 */
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
    },
  };

  const response = await makePostRequest("competition-participants", payload);
  return response;
};

/**
 * Get all participants with pagination
 */
export const getParticipants = async (
  pageNumber: number = 0,
  pageSize: number = 10
): Promise<ApiResponseType<any[]>> => {
  const params = qs.stringify({
    pagination: { page: pageNumber, pageSize, withCount: true },
    populate: ["competitions", "competition_teams", "profileImage"],
  });

  const response = await makeGetRequest(`competition-participants?${params}`);
  return response as ApiResponseType<any[]>;
};

/**
 * Get single participant with all relations
 */
export const getParticipantById = async (id: number): Promise<ApiResponseType<any>> => {
  const params = qs.stringify({ populate: "*" });
  const response = await makeGetRequest(`competition-participants/${id}?${params}`);
  return response as ApiResponseType<any>;
};

/**
 * Update participant details
 */
export const updateParticipant = async (
  id: number,
  participantData: any
): Promise<ApiResponseType<any>> => {
  const payload = { data: participantData };
  const response = await makePutRequest(`competition-participants/${id}`, payload);
  return response as ApiResponseType<any>;
};

// ============== TEAMS ==============
/**
 * Create a team with multiple participants
 */
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
    },
  };

  const response = await makePostRequest("competition-teams", payload);
  return response;
};

/**
 * Get teams with optional filtering by competition
 */
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
    pagination: { page: pageNumber, pageSize, withCount: true },
    populate: "*",
  });

  const response = await makeGetRequest(`competition-teams?${params}`);
  return response as ApiResponseType<any[]>;
};

// ============== REGISTRATIONS ==============
/**
 * Create a competition registration for individual or team
 */
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
    },
  };

  const response = await makePostRequest("competition-registrations", payload);
  return response as ApiResponseType<any>;
};

/**
 * Get registrations for a specific competition
 */
export const getRegistrationsByCompetition = async (
  competitionId: number,
  pageNumber: number = 0,
  pageSize: number = 100
): Promise<ApiResponseType<any[]>> => {
  const params = qs.stringify({
    filters: { competition: { id: { $eq: competitionId } } },
    pagination: { page: pageNumber, pageSize, withCount: true },
    populate: ["competition", "participantId", "competition_team"],
  });

  const response = await makeGetRequest(`competition-registrations?${params}`);
  return response as ApiResponseType<any[]>;
};

/**
 * Get registrations for a user by email
 */
export const getUserRegistrations = async (
  userEmail: string,
  pageNumber: number = 0,
  pageSize: number = 100
): Promise<ApiResponseType<any[]>> => {
  try {
    const participantsResponse = await getParticipants(0, 1000);

    const userParticipants = participantsResponse.data?.filter(
      (participant: any) => participant.attributes?.email === userEmail
    ) || [];

    if (userParticipants.length === 0) {
      return { data: [], meta: {} } as ApiResponseType<any[]>;
    }

    const participantIds = userParticipants.map((p: any) => p.id);

    const params = qs.stringify({
      pagination: { page: pageNumber, pageSize, withCount: true },
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
        meta: response.meta,
      } as ApiResponseType<any[]>;
    }

    return response as ApiResponseType<any[]>;
  } catch (error) {
    console.error("❌ Error fetching user registrations:", error);
    throw error;
  }
};

// ============== SUBMISSIONS ==============
/**
 * Create a competition submission
 */
export const createCompetitionSubmission = async (
  data: any,
  competitionId: number,
  userEmail?: string
) => {
  const token = getAuthToken();
  if (!token) {
    throw new ApiError(401, "Unauthorized", "You must be logged in to submit a project");
  }

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

  try {
    console.log("📤 Submitting project...");
    const response = await makePostRequest("competition-submissions", submissionPayload, token);
    console.log("✅ Submission successful");
    return response;
  } catch (error) {
    console.error("❌ Submission failed:", error);
    throw error;
  }
};

/**
 * Get submissions for a competition
 */
export const getCompetitionSubmissions = async (
  competitionId: number,
  pageNumber: number = 0,
  pageSize: number = 50
): Promise<ApiResponseType<any[]>> => {
  const params = qs.stringify({
    filters: { competition: { id: { $eq: competitionId } } },
    pagination: { page: pageNumber, pageSize, withCount: true },
    populate: "*",
  });

  const response = await makeGetRequest(`competition-submissions?${params}`);
  return response as ApiResponseType<any[]>;
};