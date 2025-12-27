'use client';

import { useState } from 'react';
import CalendarView from '@/app/components/maintenance/CalendarView';
import { useRequireAuth } from '@/app/hooks/useRequireAuth';
import type { MaintenanceRequest } from '@/app/types/maintenance';

// Mock data for demonstration
const mockRequests: MaintenanceRequest[] = [
  {
    id: '1',
    name: 'MR00001',
    subject: 'Monthly Inspection',
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
    requestType: 'preventive',
    state: 'new',
    scheduledDate: '2024-02-15T10:00:00Z',
    isOverdue: false,
  },
  {
    id: '2',
    name: 'MR00002',
    subject: 'Quarterly Maintenance',
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
    scheduledDate: '2024-02-15T14:00:00Z',
    isOverdue: false,
  },
  {
    id: '3',
    name: 'MR00003',
    subject: 'Weekly Check',
    equipmentId: 'eq3',
    equipment: {
      id: 'eq3',
      name: 'Conveyor Belt A',
      serialNumber: 'CB-A-2024',
      active: true,
    },
    requestType: 'preventive',
    state: 'new',
    scheduledDate: '2024-02-20T10:00:00Z',
    isOverdue: false,
  },
];

export default function CalendarPage() {
  const { loading } = useRequireAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
        <div className="text-[#5F6B76]">Loading...</div>
      </div>
    );
  }

  const handleDateClick = (date: Date, requests: MaintenanceRequest[]) => {
    console.log('Date clicked:', date, requests);
  };

  return <CalendarView requests={mockRequests} onDateClick={handleDateClick} />;
}

