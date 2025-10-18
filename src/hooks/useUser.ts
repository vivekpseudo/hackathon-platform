import { useQuery } from "@tanstack/react-query"
import apiClient from "../libs/axios";

const useUser = () => {

    const getCurrentUser = useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => await apiClient.get('/users/me').then(res => res.data),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    return { getCurrentUser };
};

export default useUser;