import { apiClient } from "./api";

interface LoginResponse {
    message: string;
    token: string;
    role: string;
}

export const authUser = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post('/api/auth/login', {
        email,
        password
    });
    return response.data;
}