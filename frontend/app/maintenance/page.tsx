'use client';

import { useState, useEffect } from 'react';
import KanbanBoard from '@/app/components/maintenance/KanbanBoard';
import type {
  MaintenanceRequest,
  MaintenanceRequestState,
} from '@/app/types/maintenance';

// Mock data for demonstration
const mockRequests: MaintenanceRequest[] = [
  {
    id: '1',
    name: 'MR00001',
    subject: 'Oil Leak Detection',
    equipmentId: 'eq1',
    equipment: {
      id: 'eq1',
      name: 'CNC Machine 01',
      serialNumber: 'CNC-001-2024',
      active: true,
    },
    technician: {
      id: 'tech1',
      name: 'John Doe',
    },
    requestType: 'corrective',
    state: 'new',
    scheduledDate: '2024-02-15T10:00:00Z',
    isOverdue: false,
  },
  {
    id: '2',
    name: 'MR00002',
    subject: 'Routine Inspection',
    equipmentId: 'eq2',
    equipment: {
      id: 'eq2',
      name: 'Drill Press 05',
      serialNumber: 'DP-005-2024',
      active: true,
    },
    technician: {
      id: 'tech2',
      name: 'Jane Smith',
    },
    requestType: 'preventive',
    state: 'in_progress',
    scheduledDate: '2024-02-10T10:00:00Z',
    isOverdue: true,
  },
  {
    id: '3',
    name: 'MR00003',
    subject: 'Belt Replacement',
    equipmentId: 'eq3',
    equipment: {
      id: 'eq3',
      name: 'Conveyor Belt A',
      serialNumber: 'CB-A-2024',
      active: true,
    },
    requestType: 'corrective',
    state: 'repaired',
    scheduledDate: '2024-02-05T10:00:00Z',
    isOverdue: false,
  },
];

export default function MaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(mockRequests);

  const handleStateChange = (
    requestId: string,
    newState: MaintenanceRequestState
  ) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, state: newState } : req
      )
    );
    // TODO: Make API call to update request state
    console.log(`Updating request ${requestId} to state ${newState}`);
  };

  const handleCardClick = (request: MaintenanceRequest) => {
    // TODO: Navigate to request detail page or open modal
    console.log('Card clicked:', request);
  };

  return (
    <KanbanBoard
      requests={requests}
      onStateChange={handleStateChange}
      onCardClick={handleCardClick}
    />
  );
}

