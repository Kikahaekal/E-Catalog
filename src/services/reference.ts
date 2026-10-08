import { apiClient } from "./api";

export interface Reference {
    id: string | number;
    refCode?: number | null;
    authors: string;
    year?: number | null;
    title: string;
    source?: string | null;
}

export interface ReferencePayload {
    refCode?: number | null;
    authors: string;
    year?: number | null;
    title: string;
    source?: string | null;
}

export interface ReferenceResponse {
    message: string;
    data: Reference;
}

export interface ReferenceListResponse {
    message: string;
    data: Reference[];
}

export interface ReferenceDeleteResponse {
    message: string;
}

export const createReference = async (payload: ReferencePayload): Promise<ReferenceResponse> => {
    const response = await apiClient.post("/api/reference", payload);
    return response.data;
};

export const editReference = async (
    referenceId: string | number,
    payload: ReferencePayload,
): Promise<ReferenceResponse> => {
    const response = await apiClient.put(`/api/reference/${referenceId}`, payload);
    return response.data;
};

export const deleteReference = async (referenceId: string | number): Promise<ReferenceDeleteResponse> => {
    const response = await apiClient.delete(`/api/reference/${referenceId}`);
    return response.data;
};

export const getReference = async (referenceId: string | number): Promise<ReferenceResponse> => {
    const response = await apiClient.get(`/api/reference/${referenceId}`);
    return response.data;
};

export const getAllReferences = async (): Promise<ReferenceListResponse> => {
    const response = await apiClient.get("/api/reference");
    return response.data;
};
