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

export const logout = async (): Promise<void> => {
    const token = localStorage.getItem('token');
    await apiClient.post('/api/auth/logout', {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
}