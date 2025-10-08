import apiClient from "../libs/axios";

export interface LoginResponse {
  jwt: string;
  user: {
    id: number;
    email: string;
    username: string;
    blocked?: boolean;
    role?: any;
    isOrganizer?: boolean;
  };
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    console.log(" API - Attempting login for:", email);
    
    // Strapi uses 'identifier' instead of 'email'
    const response = await apiClient.post("/auth/local", {
      identifier: email,
      password: password,
    });

    console.log("API - Login successful:", {
      hasJWT: !!response.data.jwt,
      user: response.data.user?.email || response.data.user?.username,
      role: response.data.user?.role
    });
    
    return response.data;
  } catch (error: any) {
    console.error("❌ API - Login error:", {
      status: error?.response?.status,
      message: error?.response?.data?.error?.message || error?.message,
      details: error?.response?.data
    });
    throw error;
  }
};

// Register function (if you need it)
export const register = async (
  username: string, 
  email: string, 
  password: string
): Promise<LoginResponse> => {
  try {
    console.log(" API - Attempting registration for:", email);
    
    const response = await apiClient.post("/auth/local/register", {
      username,
      email,
      password,
    });

    console.log("API - Registration successful");
    return response.data;
  } catch (error: any) {
    console.error("❌ API - Registration error:", error?.response?.data);
    throw error;
  }
};