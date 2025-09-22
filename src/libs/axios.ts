import axios from "axios";
import { getAuthToken, logout } from "./storageHelper";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) { // unauthorized
      removeAuthToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
export const setAuthToken = (token: string) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};
export const removeAuthToken = () => {
  delete apiClient.defaults.headers.common["Authorization"];
  logout();
};

export const makeGetRequest = async <T>(url: string): Promise<T> => {
  const response = await apiClient.get(`/get-info?url=${encodeURIComponent(url)}`);
  return response.data as T;
}

export const makePostRequest = (url: string, data: any, isLoginRegRequest: boolean = false) => {
  return apiClient.post(isLoginRegRequest ? `/${url}` : `/post-info?url=${encodeURIComponent(url)}`, data);
}

export const makePutRequest = (url: string, data: any) => {
  return apiClient.put(`/update-info?url=${encodeURIComponent(url)}`, data);
}

export default apiClient;
