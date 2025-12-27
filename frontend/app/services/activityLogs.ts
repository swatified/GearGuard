import api from '../lib/api';

export interface ActivityLog {
    id: string;
    action: string;
    description: string;
    fieldName?: string;
    oldValue?: any;
    newValue?: any;
    user?: {
        id: string;
        name: string;
        email?: string;
    };
    metadata?: any;
    createdAt: string;
    updatedAt: string;
}

export const getActivityLogs = async (requestId: string): Promise<{ success: boolean; data: ActivityLog[] }> => {
    const response = await api.get(`/activity-logs/${requestId}`);
    return response.data;
};

