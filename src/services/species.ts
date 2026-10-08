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
    isPrimary?: boolean;
}

export interface SpeciesLocalName {
    id?: string | number;
    name?: string;
    localName?: string | { name?: string };
    submittedName?: string;
    dialect?: string | null;
    regionNote?: string | null;
}

export interface SpeciesReference {
    id?: string | number;
    referenceId?: string | number;
    isMainRef?: boolean;
    reference?: {
        id?: string | number;
        refCode?: number | null;
        authors?: string;
        year?: number | null;
        title?: string;
        source?: string | null;
    };
}

export interface SpeciesSynonymPayload {
    scientificName: string;
    author?: string | null;
    status?: string | null;
}

export interface SpeciesLocalNamePayload {
    name: string;
    regionNote?: string | null;
}

export interface SpeciesPhotoPayload {
    filePath: string;
    caption?: string | null;
    isPrimary?: boolean;
}

export interface SpeciesReferencePayload {
    referenceId: number;
    isMainRef?: boolean;
}

export interface Species {
    id: string | number;
    commonName: string;
    scientificName: string;
    author?: string | null;
    etymology?: string | null;
    order?: string | null;
    family?: string | null;
    genus?: string | null;
    environment?: string | null;
    climateZone?: string | null;
    depthMinMeters?: number | null;
    depthMaxMeters?: number | null;
    tempMinC?: number | null;
    tempMaxC?: number | null;
    distributionText?: string | null;
    maxLengthCm?: number | null;
    lengthType?: string | null;
    maxWeightKg?: number | null;
    maxAgeYears?: number | null;
    dorsalSpines?: string | null;
    dorsalSoftRays?: string | null;
    analSpines?: string | null;
    analSoftRays?: string | null;
    bodyShape?: string | null;
    morphologyText?: string | null;
    biologyText?: string | null;
    fecundityText?: string | null;
    threatToHumans?: string | null;
    fisheriesImportance?: string | null;
    isGamefish?: boolean;
    iucnStatusId?: string | number | null;
    iucnAssessedAt?: string | null;
    citesStatus?: string | null;
    cmsStatus?: string | null;
    synonyms?: SpeciesSynonymPayload[];
    photos?: SpeciesPhoto[];
    localNames?: SpeciesLocalName[];
    references?: SpeciesReference[];
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
    commonName: string;
    scientificName: string;
    author?: string | null;
    etymology?: string | null;
    order?: string | null;
    family?: string | null;
    genus?: string | null;
    environment?: string | null;
    climateZone?: string | null;
    depthMinMeters?: number | null;
    depthMaxMeters?: number | null;
    tempMinC?: number | null;
    tempMaxC?: number | null;
    distributionText?: string | null;
    maxLengthCm?: number | null;
    lengthType?: string | null;
    maxWeightKg?: number | null;
    maxAgeYears?: number | null;
    dorsalSpines?: string | null;
    dorsalSoftRays?: string | null;
    analSpines?: string | null;
    analSoftRays?: string | null;
    bodyShape?: string | null;
    morphologyText?: string | null;
    biologyText?: string | null;
    fecundityText?: string | null;
    threatToHumans?: string | null;
    fisheriesImportance?: string | null;
    isGamefish?: boolean;
    iucnStatusId?: string | number | null;
    iucnAssessedAt?: string | null;
    citesStatus?: string | null;
    cmsStatus?: string | null;
    synonyms?: SpeciesSynonymPayload[];
    localNames?: SpeciesLocalNamePayload[];
    photos?: SpeciesPhotoPayload[];
    references?: SpeciesReferencePayload[];
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