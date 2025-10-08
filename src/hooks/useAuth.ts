import { useMutation } from "@tanstack/react-query";
import { login as loginApi } from "../api/auth";
import { setUser, setUserRole, setAuthToken as setStorageAuthToken } from "../libs/storageHelper";
import { setAuthToken as setAxiosAuthToken } from "../libs/axios";
import { useLocalAuth } from "../context/AuthContext";

const useAuth = () => {
  const { login: contextLogin } = useLocalAuth();
  
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginApi(email, password),
    onSuccess: (data) => {
      console.log(" Login API successful:", data);
      
      // Extract role (handle both string and object)
      const role = typeof data.user.role === 'string' 
        ? data.user.role 
        : data.user.role?.name || 'user';
      
      // Store in localStorage
      setStorageAuthToken(data.jwt);
      setUser(data.user);
      setUserRole(role);
      
      // Set in axios headers
      setAxiosAuthToken(data.jwt);
      
      // Update context
      contextLogin(data.user, data.jwt, role);
      
      console.log("Auth data stored and context updated");
    },
    onError: (error: any) => {
      console.error(" Login failed:", error);
      console.error("Error details:", {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message
      });
    }
  });
};

export default useAuth;