import { Equipment, MaintenanceRequest } from "@/app/types/maintenance";

// Mock Data
const MOCK_EQUIPMENT: Equipment[] = [
    {
        id: "eq-1",
        name: "Dell XPS 15",
        serialNumber: "DX-2024-001",
        active: true,
        status: "operational",
        healthScore: 98,
        departmentId: "dept-it",
        assignedToUserId: "user-1", // Assigned to "Test User"
        location: "IT Wing, Desk A1",
        category: "Computers",
        purchaseDate: "2024-01-15",
        warrantyUntil: "2027-01-15"
    },
    {
        id: "eq-2",
        name: "Ergonomic Chair",
        serialNumber: "EC-2023-552",
        active: true,
        status: "operational",
        healthScore: 100,
        departmentId: "dept-admin",
        assignedToUserId: "user-1", // Assigned to "Test User"
        location: "IT Wing, Desk A1",
        category: "Furniture",
        purchaseDate: "2023-06-10",
        warrantyUntil: "2028-06-10"
    },
    {
        id: "eq-3",
        name: "Hydraulic Press #4",
        serialNumber: "HP-2020-X99",
        active: true,
        status: "maintenance_required",
        healthScore: 45,
        departmentId: "dept-manufacturing",
        assignedToUserId: "user-99",
        location: "Zone B, Floor 1",
        category: "Heavy Machinery",
        purchaseDate: "2020-03-20",
        warrantyUntil: "2025-03-20"
    },
    {
        id: "eq-4",
        name: "Conveyor Belt System",
        serialNumber: "CB-2021-002",
        active: true,
        status: "operational",
        healthScore: 88,
        departmentId: "dept-logistics",
        assignedToUserId: "user-99",
        location: "Zone A, Loading Bay",
        category: "Logistics",
        purchaseDate: "2021-11-05",
        warrantyUntil: "2026-11-05"
    }
];

const MOCK_REQUESTS: MaintenanceRequest[] = [
    {
        id: "req-1",
        name: "REQ-001",
        subject: "Monitor Flickering",
        description: "Screen flashes intermittently.",
        equipmentId: "eq-1",
        priority: "medium",
        state: "in_progress",
        technicianId: "tech-1", // Assigned to Technician
        reportedByUserId: "694f84b02f82040d5457c5a4", // Created by "Test User"
        createdAt: "2024-10-25T10:00:00Z",
        requestType: "corrective"
    },
    {
        id: "req-2",
        name: "REQ-002",
        subject: "Hydraulic Leak",
        description: "Oil leaking from main cylinder.",
        equipmentId: "eq-3",
        priority: "critical",
        state: "new",
        technicianId: "tech-1", // Assigned to Technician
        reportedByUserId: "user-99",
        createdAt: "2024-10-26T08:30:00Z",
        requestType: "corrective"
    },
    {
        id: "req-3",
        name: "REQ-003",
        subject: "Belt Misalignment",
        description: "Conveyor drifting to left.",
        equipmentId: "eq-4",
        priority: "high",
        state: "new",
        technicianId: "tech-2",
        reportedByUserId: "user-99",
        createdAt: "2024-10-26T09:15:00Z",
        requestType: "corrective"
    }
];

export const DashboardService = {
    // Get equipment assigned to a specific user
    getUserEquipment: async (userId: string): Promise<Equipment[]> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_EQUIPMENT.filter(eq => eq.assignedToUserId === userId);
    },

    // Get requests created by a specific user
    getUserRequests: async (userId: string): Promise<MaintenanceRequest[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_REQUESTS.filter(req => req.reportedByUserId === userId);
    },

    // Get requests assigned to a technician
    getTechnicianTasks: async (technicianId: string): Promise<MaintenanceRequest[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_REQUESTS.filter(req => req.technicianId === technicianId);
    }
};
