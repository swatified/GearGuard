export type MaintenanceRequestState = 'new' | 'in_progress' | 'repaired' | 'scrap';
export type RequestType = 'corrective' | 'preventive';

export interface Technician {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  location?: string;
  maintenanceTeamId?: string;
  active: boolean;
  // Enhanced fields for dashboard
  status?: 'operational' | 'down' | 'maintenance_required';
  healthScore?: number;
  departmentId?: string;
  assignedToUserId?: string;
  category?: string;
  purchaseDate?: string;
  warrantyUntil?: string;
}

export interface MaintenanceTeam {
  id: string;
  name: string;
  members?: Technician[];
}

export interface MaintenanceRequest {
  id: string;
  name: string;
  subject: string;
  description?: string;
  equipmentId: string;
  equipment?: Equipment;
  maintenanceTeamId?: string;
  maintenanceTeam?: MaintenanceTeam;
  technicianId?: string;
  technician?: Technician;
  requestType: RequestType;
  priority?: string;
  scheduledDate?: string;
  dateRequest?: string;
  dateStart?: string;
  dateEnd?: string;
  duration?: number;
  state: MaintenanceRequestState;
  isOverdue?: boolean;
  createdAt?: string;
  updatedAt?: string;
  reportedByUserId?: string;
}

