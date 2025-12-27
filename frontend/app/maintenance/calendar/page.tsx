'use client';

import { useState, useEffect } from 'react';
import CalendarView from '@/app/components/maintenance/CalendarView';
import { useRequireAuth } from '@/app/hooks/useRequireAuth';
import DashboardShell from '@/app/components/layout/DashboardShell';
import { getCalendarRequests } from '@/app/services/maintenanceRequests';
import type { MaintenanceRequest } from '@/app/types/maintenance';

export default function CalendarPage() {
  const { loading: authLoading } = useRequireAuth();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      loadCalendarRequests();
    }
  }, [authLoading]);

  const loadCalendarRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 2);

      const calendarRequests = await getCalendarRequests({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      const mappedRequests: MaintenanceRequest[] = calendarRequests.map((req) => ({
        id: req.id,
        name: req.name,
        subject: req.subject,
        equipmentId: req.equipment.id,
        equipment: {
          id: req.equipment.id,
          name: req.equipment.name,
          serialNumber: '',
          active: true,
        },
        technician: req.technician
          ? {
              id: req.technician.id,
              name: req.technician.name,
            }
          : undefined,
        requestType: req.requestType as 'corrective' | 'preventive',
        state: req.state as MaintenanceRequest['state'],
        scheduledDate: req.scheduledDate,
        isOverdue: false,
      }));

      setRequests(mappedRequests);
    } catch (err: any) {
      console.error('Error loading calendar requests:', err);
      setError(err.message || 'Failed to load calendar requests');
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date: Date, requests: MaintenanceRequest[]) => {
    console.log('Date clicked:', date, requests);
  };

  if (authLoading || loading) {
    return (
      <DashboardShell>
        <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
          <div className="text-[#5F6B76]">Loading...</div>
        </div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell>
        <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
          <div className="text-center">
            <p className="text-[#A14A4A] mb-4">{error}</p>
            <button
              onClick={loadCalendarRequests}
              className="px-4 py-2 bg-[#5B7C99] text-white rounded-lg hover:opacity-90"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <CalendarView requests={requests} onDateClick={handleDateClick} />
    </DashboardShell>
  );
}

