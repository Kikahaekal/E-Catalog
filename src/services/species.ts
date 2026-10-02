import { apiClient } from "./api";

export interface SpeciesPhoto {
    id?: string | number;
    filePath?: string;
    url?: string;
    imageUrl?: string;
    photoUrl?: string;
    path?: string;
    src?: string;
    alt?: string;
    caption?: string;
}

export interface SpeciesLocalName {
    id?: string | number;
    name?: string;
    localName?: string | { name?: string };
    submittedName?: string;
    dialect?: string | null;
    regionNote?: string | null;
}

export interface Species {
    id: string | number;
    iucnStatusId: string | number;
    commonName: string;
    scientificName: string;
    photos?: SpeciesPhoto[];
    localNames?: SpeciesLocalName[];
    regencies?: { 
        id?: string | number;
        regency: { 
            id?: string | number;
            name: string; 
            province: string; 
        } 
    }[];
    wppZones?: { 
        id?: string | number;
        wppZone: { 
            id?: string | number;
            code: string; 
            description: string; 
        } 
    }[];
}

export interface SpeciesPayload {
    iucnStatusId: string | number;
    commonName: string;
    scientificName: string;
    wppIds?: number[];
    regencyIds?: number[];
}

export interface SpeciesResponse {
    message: string;
    data: Species;
}

export interface SpeciesListResponse {
    message: string;
    data: Species[];
}

export interface SpeciesDeleteResponse {
    message: string;
}


export const createSpecies = async (payload: SpeciesPayload): Promise<SpeciesResponse> => {
    const response = await apiClient.post("/api/species", payload);
    return response.data;
}

export const editSpecies = async (speciesId: string | number, payload: SpeciesPayload): Promise<SpeciesResponse> => {
    const response = await apiClient.put(`/api/species/${speciesId}`, payload);
    return response.data;
}

export const deleteSpecies = async (speciesId: string | number): Promise<SpeciesDeleteResponse> => {
    const response = await apiClient.delete(`/api/species/${speciesId}`);
    return response.data;
}

export const getSpecies = async (speciesId: string | number): Promise<SpeciesResponse> => {
    const response = await apiClient.get(`/api/species/${speciesId}`);
    return response.data;
}

export const getAllSpecies = async (name?: string): Promise<SpeciesListResponse> => {
    const response = await apiClient.get("/api/species", {
        params: name ? { name } : undefined
    });
    return response.data;
}