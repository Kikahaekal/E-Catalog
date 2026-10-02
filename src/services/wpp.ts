import { apiClient } from "./api";

export interface Wpp {
  id: string | number;
  code: string;
  description: string;
}

export interface WppResponse {
  message: string;
  data: Wpp;
}

export interface WppListResponse {
  message: string;
  data: Wpp[];
}

export interface WppDeleteResponse {
  message: string;
}

export const createWpp = async (
  code: string,
  description: string
): Promise<WppResponse> => {
  const response = await apiClient.post("/api/wpp", {
    code,
    description,
  });
  return response.data;
};

export const editWpp = async (
  wppId: string | number,
  code: string,
  description: string
): Promise<WppResponse> => {
  const response = await apiClient.put(`/api/wpp/${wppId}`, {
    code,
    description,
  });
  return response.data;
};

export const deleteWpp = async (
  wppId: string | number
): Promise<WppDeleteResponse> => {
  const response = await apiClient.delete(`/api/wpp/${wppId}`);
  return response.data;
};

export const getWpp = async (
  wppId: string | number
): Promise<WppResponse> => {
  const response = await apiClient.get(`/api/wpp/${wppId}`);
  return response.data;
};

export const getAllWpp = async (): Promise<WppListResponse> => {
  const response = await apiClient.get("/api/wpp");
  return response.data;
};