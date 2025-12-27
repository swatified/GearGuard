'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import KanbanBoard from '@/app/components/maintenance/KanbanBoard';
import DashboardShell from '@/app/components/layout/DashboardShell';
import { useRequireAuth } from '@/app/hooks/useRequireAuth';
import { useAuth } from '@/app/context/AuthContext';
import {
  getMaintenanceRequests,
  updateRequestStage,
  type MaintenanceRequest,
} from '@/app/services/maintenanceRequests';
import { getMaintenanceStages } from '@/app/services/maintenanceStages';
import type { MaintenanceRequestState } from '@/app/types/maintenance';
import { Plus } from 'lucide-react';

export default function MaintenancePage() {
  const router = useRouter();
  const { loading: authLoading } = useRequireAuth();
  const { user } = useAuth();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      loadRequests();
    }
  }, [authLoading]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMaintenanceRequests({ limit: 100 });
      setRequests(response.requests);
    } catch (err: any) {
      const errorMessage = err?.message || err?.error || (typeof err === 'string' ? err : 'Failed to load maintenance requests');
      console.error('Error loading requests:', errorMessage, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = async (
    requestId: string,
    newState: MaintenanceRequestState
  ) => {
    try {
      setError(null);
      const stages = await getMaintenanceStages();

      if (!stages || stages.length === 0) {
        throw new Error('No maintenance stages found');
      }

      let targetStage;
      if (newState === 'new') {
        targetStage = stages.find((s) => s.name.toLowerCase() === 'new');
      } else if (newState === 'in_progress') {
        targetStage = stages.find((s) => s.name.toLowerCase() === 'in progress');
      } else if (newState === 'repaired') {
        targetStage = stages.find((s) => s.name.toLowerCase() === 'repaired');
      } else if (newState === 'scrap') {
        targetStage = stages.find((s) => s.name.toLowerCase() === 'scrap');
      }

      if (!targetStage) {
        console.error('Stage not found for state:', newState, 'Available stages:', stages.map(s => s.name));
        setError(`Failed to find matching stage for state: ${newState}`);
        return;
      }

      // Handle both _id and id (Mongoose returns _id, but we transform it to id)
      const stageId = targetStage.id || (targetStage as any)._id;
      
      if (!stageId) {
        console.error('Stage found but missing ID:', targetStage);
        setError('Stage ID is missing');
        return;
      }

      // Convert to string if it's an ObjectId
      const stageIdString = typeof stageId === 'string' ? stageId : stageId.toString();

      // Validate stageId format (MongoDB ObjectId is 24 hex characters)
      if (!/^[0-9a-fA-F]{24}$/.test(stageIdString)) {
        console.error('Invalid stageId format:', stageIdString);
        setError('Invalid stage ID format');
        return;
      }

      await updateRequestStage(requestId, stageIdString);
      await loadRequests();
    } catch (err: any) {
      const errorMessage = err?.message || err?.error || (typeof err === 'string' ? err : 'Failed to update request state');
      console.error('Error updating request state:', errorMessage, err);
      setError(errorMessage);
    }
  };

  const handleCardClick = (request: MaintenanceRequest) => {
    router.push(`/maintenance/${request.id}`);
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

  if (error && !requests.length) {
    return (
      <DashboardShell>
        <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
          <div className="text-center">
            <p className="text-[#A14A4A] mb-4">{error}</p>
            <button
              onClick={loadRequests}
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
      <div className="min-h-screen bg-[#F7F8F9] flex flex-col">
        {/* Page Header */}
        <div className="px-6 pt-8 pb-4">
          <div className="max-w-full mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-[#1C1F23]">Maintenance Tracking</h1>
                <p className="text-[#5F6B76] text-sm mt-1">Manage and track maintenance requests</p>
              </div>
              <Link
                href="/maintenance/new"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#5B7C99] text-white rounded-lg hover:opacity-90 transition-opacity duration-150 text-sm font-medium"
              >
                <Plus size={18} />
                New Request
              </Link>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-[#A14A4A]/10 border border-[#A14A4A]/20 rounded-lg">
                <p className="text-sm text-[#A14A4A]">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-hidden px-6 pb-6 min-h-0">
          <div className="h-full max-w-full">
            <KanbanBoard
              requests={requests}
              onStateChange={handleStateChange}
              onCardClick={handleCardClick}
              userRole={user?.role}
              currentUserId={user?.id}
            />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

