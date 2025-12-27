'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MaintenanceRequestForm, {
  MaintenanceRequestFormData,
} from '@/app/components/maintenance/MaintenanceRequestForm';
import { useRequireAuth } from '@/app/hooks/useRequireAuth';
import { createMaintenanceRequest } from '@/app/services/maintenanceRequests';
import { getEquipment } from '@/app/services/equipment';
import { getMaintenanceTeams } from '@/app/services/maintenanceTeams';
import type { Equipment } from '@/app/services/equipment';

export default function NewRequestPage() {
  const { loading: authLoading } = useRequireAuth();
  const [loading, setLoading] = useState(true);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [technicians, setTechnicians] = useState<Array<{ id: string; name: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      loadData();
    }
  }, [authLoading]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [equipmentResponse, teamsResponse] = await Promise.all([
        getEquipment({ limit: 100, active: true }),
        getMaintenanceTeams({ limit: 100, active: true }),
      ]);

      setEquipment(equipmentResponse.equipment);

      const allTechnicians: Array<{ id: string; name: string }> = [];
      teamsResponse.teams.forEach((team) => {
        if (team.members) {
          team.members.forEach((member) => {
            if (!allTechnicians.find((t) => t.id === member.id)) {
              allTechnicians.push({ id: member.id, name: member.name });
            }
          });
        }
      });
      setTechnicians(allTechnicians);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: MaintenanceRequestFormData) => {
    try {
      setError(null);
      await createMaintenanceRequest({
        subject: data.subject,
        description: data.description,
        equipmentId: data.equipmentId,
        requestType: data.requestType,
        priority: data.priority,
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate).toISOString() : undefined,
        note: data.description,
      });
      router.push('/maintenance');
    } catch (err: any) {
      console.error('Error creating request:', err);
      setError(err.message || 'Failed to create maintenance request');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
        <div className="text-[#5F6B76]">Loading...</div>
      </div>
    );
  }

  if (error && !equipment.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
        <div className="text-center">
          <p className="text-[#A14A4A] mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-[#5B7C99] text-white rounded-lg hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#A14A4A]/10 border border-[#A14A4A]/20 rounded-lg p-4 mb-4">
          <p className="text-sm text-[#A14A4A]">{error}</p>
        </div>
      )}
      <MaintenanceRequestForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        equipment={equipment}
        technicians={technicians}
      />
    </>
  );
}

