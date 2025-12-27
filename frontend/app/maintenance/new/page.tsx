'use client';

import MaintenanceRequestForm, {
  MaintenanceRequestFormData,
} from '@/app/components/maintenance/MaintenanceRequestForm';
import { useRequireAuth } from '@/app/hooks/useRequireAuth';

// Mock data
const mockEquipment = [
  {
    id: 'eq1',
    name: 'CNC Machine 01',
    serialNumber: 'CNC-001-2024',
    location: 'Building A, Floor 2',
    maintenanceTeamId: 'team1',
    active: true,
  },
  {
    id: 'eq2',
    name: 'Drill Press 05',
    serialNumber: 'DP-005-2024',
    location: 'Building B, Floor 1',
    maintenanceTeamId: 'team2',
    active: true,
  },
];

const mockTechnicians = [
  { id: 'tech1', name: 'John Doe' },
  { id: 'tech2', name: 'Jane Smith' },
  { id: 'tech3', name: 'Bob Wilson' },
];

export default function NewRequestPage() {
  const { loading } = useRequireAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
        <div className="text-[#5F6B76]">Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (data: MaintenanceRequestFormData) => {
    console.log('Form submitted:', data);
    // TODO: Make API call to create request
    // await api.post('/maintenance-requests', data);
  };

  const handleCancel = () => {
    // TODO: Navigate back or close form
    window.history.back();
  };

  return (
    <MaintenanceRequestForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      equipment={mockEquipment}
      technicians={mockTechnicians}
    />
  );
}

