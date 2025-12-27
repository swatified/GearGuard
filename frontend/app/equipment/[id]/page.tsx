'use client';

import { use } from 'react';
import EquipmentDetail from '@/app/components/equipment/EquipmentDetail';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Mock data - in real app, fetch from API
const mockEquipment = {
  id: 'eq1',
  name: 'CNC Machine 01',
  serialNumber: 'CNC-001-2024',
  location: 'Building A, Floor 2, Room 205',
  purchaseDate: '2024-01-01',
  warrantyStartDate: '2024-01-01',
  warrantyEndDate: '2025-01-01',
  department: {
    id: 'dept1',
    name: 'Production',
  },
  maintenanceTeamId: 'team1',
  active: true,
  requestCount: 5,
  openRequestCount: 2,
};

const mockRequests = [
  {
    id: '1',
    name: 'MR00001',
    subject: 'Oil Leak Detection',
    equipmentId: 'eq1',
    requestType: 'corrective' as const,
    state: 'in_progress' as const,
    scheduledDate: '2024-02-15T10:00:00Z',
    technician: {
      id: 'tech1',
      name: 'John Doe',
    },
  },
  {
    id: '2',
    name: 'MR00002',
    subject: 'Routine Inspection',
    equipmentId: 'eq1',
    requestType: 'preventive' as const,
    state: 'repaired' as const,
    scheduledDate: '2024-02-10T10:00:00Z',
    technician: {
      id: 'tech2',
      name: 'Jane Smith',
    },
  },
];

export default function EquipmentDetailPage({ params }: PageProps) {
  const { id } = use(params);

  const handleMaintenanceClick = () => {
    // TODO: Navigate to maintenance requests filtered by equipment
    console.log('Navigate to maintenance for equipment:', id);
  };

  return (
    <EquipmentDetail
      equipment={mockEquipment}
      requests={mockRequests}
      onMaintenanceClick={handleMaintenanceClick}
    />
  );
}
