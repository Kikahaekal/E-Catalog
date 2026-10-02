import { apiClient } from "./api";

export interface Iucn {
    id: string | number;
    code: string;
    name: string;
}

export interface IucnResponse {
    message: string;
    data: Iucn;
}

export interface IucnListResponse {
    message: string;
    data: Iucn[];
}

export interface IucnDeleteResponse {
    message: string;
}

export const createIucn = async (code: string, name: string): Promise<IucnResponse> => {
    const response = await apiClient.post("/api/iucn", {
        code,
        name
    });
    return response.data;
}

export const editIucn = async (iucnId: string | number, code: string, name: string): Promise<IucnResponse> => {
    const response = await apiClient.put(`/api/iucn/${iucnId}`, {
        code,
        name
    });
    return response.data;
}

export const deleteIucn = async (iucnId: string | number): Promise<IucnDeleteResponse> => {
    const response = await apiClient.delete(`/api/iucn/${iucnId}`);
    return response.data;
}

export const getIucn = async (iucnId: string | number): Promise<IucnResponse> => {
    const response = await apiClient.get(`/api/iucn/${iucnId}`);
    return response.data;
}

export const getAllIucn = async (): Promise<IucnListResponse> => {
    const response = await apiClient.get("/api/iucn");
    return response.data;
}