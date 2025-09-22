import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";
import { setUser, setUserRole, setAuthToken } from "../libs/storageHelper";

const useAuth = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      // Store the token in localStorage or sessionStorage
      setAuthToken(data.jwt);
      setUser(data.user);
      setUserRole(data.role);
    },
  });
};

export default useAuth;
