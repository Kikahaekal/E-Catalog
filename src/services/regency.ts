import { apiClient } from "./api";

export interface Regency {
    id: string | number;
    name: string;
    province: string;
}

export interface RegencyResponse {
    message: string;
    data: Regency;
}

export interface RegencyListResponse {
    message: string;
    data: Regency[];
}

export interface RegencyDeleteResponse {
    message: string;
}

export const createRegency = async (name: string, province: string): Promise<RegencyResponse> => {
    const response = await apiClient.post("/api/regency", {
        name,
        province
    });
    return response.data;
}

export const editRegency = async (regencyId: string | number, name: string, province: string): Promise<RegencyResponse> => {
    const response = await apiClient.put(`/api/regency/${regencyId}`, {
        name,
        province
    });
    return response.data;
}

export const deleteRegency = async (regencyId: string | number): Promise<RegencyDeleteResponse> => {
    const response = await apiClient.delete(`/api/regency/${regencyId}`);
    return response.data;
}

export const getRegency = async (regencyId: string | number): Promise<RegencyResponse> => {
    const response = await apiClient.get(`/api/regency/${regencyId}`);
    return response.data;
}

export const getAllRegencies = async (): Promise<RegencyListResponse> => {
    const response = await apiClient.get("/api/regency");
    return response.data;
}