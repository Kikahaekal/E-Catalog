import { apiClient } from "./api";

export interface UserSubmission {
    id: string | number;
    submittedName: string;
    photoFilePath: string;
    locationNote?: string | null;
    submitterName?: string | null;
}

export interface SubmissionResponse {
    message: string;
    data: UserSubmission;
}

export interface ActionResponse {
    message: string;
}

export const submitFishName = async (formData: FormData): Promise<SubmissionResponse> => {
    const response = await apiClient.post("/api/fish/submissions", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

export const approveSubmission = async (
    submissionId: string | number, 
    speciesId: string | number
): Promise<ActionResponse> => {
    const response = await apiClient.post(`/api/fish/submissions/${submissionId}/approve`, {
        speciesId
    });
    return response.data;
}


export const rejectSubmission = async (
    submissionId: string | number
): Promise<ActionResponse> => {
    const response = await apiClient.delete(`/api/fish/submissions/${submissionId}/reject`);
    return response.data;
}