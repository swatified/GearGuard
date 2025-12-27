import api from '../lib/api';

export interface WorkCenter {
    id: string;
    name: string;
    code?: string;
    tag?: string;
    alternativeWorkcenters?: Array<{
        id: string;
        name: string;
    }>;
    cost?: number;
    rate?: number;
    allocation?: number;
    costPerHour?: number;
    capacityTime?: number;
    capacityTimeEfficiency?: number;
    oeeTarget?: number;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface WorkCenterFormData {
    name: string;
    code?: string;
    tag?: string;
    alternativeWorkcenters?: string[];
    cost?: number;
    rate?: number;
    allocation?: number;
    costPerHour?: number;
    capacityTime?: number;
    capacityTimeEfficiency?: number;
    oeeTarget?: number;
    active?: boolean;
}

export interface WorkCentersResponse {
    success: boolean;
    data: {
        workCenters: WorkCenter[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    };
}

export const getWorkCenters = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    active?: boolean;
}): Promise<WorkCentersResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());

    const response = await api.get(`/work-centers?${queryParams.toString()}`);
    return response.data;
};

export const getWorkCenterById = async (id: string): Promise<{ success: boolean; data: WorkCenter }> => {
    const response = await api.get(`/work-centers/${id}`);
    return response.data;
};

export const createWorkCenter = async (data: WorkCenterFormData): Promise<{ success: boolean; data: WorkCenter }> => {
    const response = await api.post('/work-centers', data);
    return response.data;
};

export const updateWorkCenter = async (
    id: string,
    data: WorkCenterFormData
): Promise<{ success: boolean; data: WorkCenter }> => {
    const response = await api.put(`/work-centers/${id}`, data);
    return response.data;
};

export const deleteWorkCenter = async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/work-centers/${id}`);
    return response.data;
};

