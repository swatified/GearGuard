import api from '@/app/lib/api';
import { Equipment, MaintenanceRequest } from "@/app/types/maintenance";

export interface DashboardStats {
    totalEquipment: number;
    activeEquipment: number;
    totalRequests: number;
    openRequests: number;
    overdueRequests: number;
    requestsByType: Record<string, number>;
    criticalEquipmentCount?: number;
    technicianUtilization?: number;
    activeTechnicians?: number;
    totalTechnicians?: number;
}

export interface RecentActivity {
    id: string;
    name: string;
    subject: string;
    employee: {
        id: string;
        name: string;
    } | null;
    technician: {
        id: string;
        name: string;
    } | null;
    category: {
        id: string;
        name: string;
    } | null;
    stage: {
        id?: string;
        name: string;
    };
    company: string;
    equipmentName: string;
    timestamp: string;
    state: string;
}

export const DashboardService = {
    // Get equipment assigned to a specific user (Employee View)
    getUserEquipment: async (userId: string): Promise<Equipment[]> => {
        try {
            // Fetch all equipment and filter client-side as fallback for API issues
            const response = await api.get<{ data: { equipment: Equipment[] } }>(`/equipment`);
            const allEquipment = response.data.data.equipment || [];
            return allEquipment.filter(eq => eq.employeeId === userId || eq.assignedToUserId === userId);
        } catch (error) {
            console.error('Error fetching user equipment:', error);
            return [];
        }
    },

    // Get requests created by a specific user (Employee View)
    getUserRequests: async (userId: string): Promise<MaintenanceRequest[]> => {
        try {
            // Fetch all requests and filter client-side
            const response = await api.get<{ data: { requests: MaintenanceRequest[] } }>(`/maintenance-requests`);
            const allRequests = response.data.data.requests || [];
            return allRequests.filter(req =>
                (req.reportedByUserId === userId || req.createdBy === userId || (req as any).user === userId) &&
                ['new', 'in_progress'].includes(req.state)
            );
        } catch (error) {
            console.error('Error fetching user requests:', error);
            return [];
        }
    },

    // Get requests assigned to a technician (Technician View)
    getTechnicianTasks: async (technicianId: string): Promise<MaintenanceRequest[]> => {
        try {
            // Fetch all requests and filter client-side
            const response = await api.get<{ data: { requests: MaintenanceRequest[] } }>(`/maintenance-requests`);
            const allRequests = response.data.data.requests || [];
            return allRequests.filter(req =>
                req.technicianId === technicianId &&
                ['new', 'in_progress'].includes(req.state)
            );
        } catch (error) {
            console.error('Error fetching technician tasks:', error);
            return [];
        }
    },

    // Get Global Stats (Manager View)
    getDashboardStats: async (): Promise<DashboardStats | null> => {
        try {
            const response = await api.get<{ success: true; data: DashboardStats }>('/dashboard/stats');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            return null;
        }
    },

    // Get Recent Activity
    getRecentActivity: async (limit?: number): Promise<RecentActivity[]> => {
        try {
            const params = limit ? `?limit=${limit}` : '';
            const response = await api.get<{ success: true; data: RecentActivity[] }>(`/dashboard/activity${params}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching recent activity:', error);
            return [];
        }
    }
};
