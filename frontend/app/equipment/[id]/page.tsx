'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EquipmentDetail from '@/app/components/equipment/EquipmentDetail';
import { useRequireAuth } from '@/app/hooks/useRequireAuth';
import { getEquipmentById, getEquipmentRequests } from '@/app/services/equipment';
import type { Equipment } from '@/app/services/equipment';
import type { MaintenanceRequest } from '@/app/types/maintenance';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EquipmentDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { loading: authLoading } = useRequireAuth();
  const [loading, setLoading] = useState(true);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      loadEquipmentData();
    }
  }, [authLoading, id]);

  const loadEquipmentData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [equipmentData, requestsData] = await Promise.all([
        getEquipmentById(id),
        getEquipmentRequests(id),
      ]);

      setEquipment(equipmentData);

      const mappedRequests: MaintenanceRequest[] = requestsData.requests.map((req) => ({
        id: req.id,
        name: req.name,
        subject: req.subject,
        equipmentId: id,
        equipment: {
          id: equipmentData.id,
          name: equipmentData.name,
          serialNumber: equipmentData.serialNumber || '',
          active: equipmentData.active,
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
      const errorMessage = err?.message || err?.error || (typeof err === 'string' ? err : 'Failed to load equipment details');
      console.error('Error loading equipment:', errorMessage, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleMaintenanceClick = () => {
    router.push(`/maintenance?equipmentId=${id}`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
        <div className="text-[#5F6B76]">Loading...</div>
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
        <div className="text-center">
          <p className="text-[#A14A4A] mb-4">{error || 'Equipment not found'}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-[#5B7C99] text-white rounded-lg hover:opacity-90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const equipmentData = {
    id: equipment.id,
    name: equipment.name,
    serialNumber: equipment.serialNumber || '',
    company: equipment.company,
    model: equipment.model,
    manufacturer: equipment.manufacturer,
    technicalSpecifications: equipment.technicalSpecifications,
    location: equipment.location || '',
    purchaseDate: equipment.purchaseDate,
    warrantyStartDate: equipment.warrantyStartDate,
    warrantyEndDate: equipment.warrantyEndDate,
    department: equipment.department
      ? {
          id: equipment.department.id,
          name: equipment.department.name,
        }
      : undefined,
    category: equipment.category
      ? {
          id: equipment.category.id,
          name: equipment.category.name,
        }
      : undefined,
    employee: equipment.employee
      ? {
          id: equipment.employee.id,
          name: equipment.employee.name,
        }
      : undefined,
    maintenanceTeam: equipment.maintenanceTeam
      ? {
          id: equipment.maintenanceTeam.id,
          name: equipment.maintenanceTeam.name,
        }
      : undefined,
    maintenanceTeamId: equipment.maintenanceTeamId,
    technician: equipment.technician
      ? {
          id: equipment.technician.id,
          name: equipment.technician.name,
        }
      : undefined,
    workCenter: equipment.workCenter
      ? {
          id: equipment.workCenter.id,
          name: equipment.workCenter.name,
        }
      : undefined,
    equipmentType: equipment.equipmentType || 'workCenter',
    active: equipment.active,
    requestCount: equipment.requestCount || 0,
    openRequestCount: equipment.openRequestCount || 0,
  };

  return (
    <EquipmentDetail
      equipment={equipmentData}
      requests={requests}
      onMaintenanceClick={handleMaintenanceClick}
    />
  );
}
