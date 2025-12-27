'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardShell from '@/app/components/layout/DashboardShell';
import { useRequireAuth } from '@/app/hooks/useRequireAuth';
import { useAuth } from '@/app/context/AuthContext';
import {
  getMaintenanceRequestById,
  updateMaintenanceRequest,
  updateRequestStage,
  assignTechnician,
  type MaintenanceRequest
} from '@/app/services/maintenanceRequests';
import { getMaintenanceStages } from '@/app/services/maintenanceStages';
import { format } from 'date-fns';
import {
  ArrowLeft,
  FileText,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  User,
  Wrench,
  Calendar,
  Building2,
  Tag,
  Users,
  Save,
  Edit
} from 'lucide-react';
import ActivityLog from '@/app/components/maintenance/ActivityLog';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MaintenanceRequestDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { loading: authLoading } = useRequireAuth();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<MaintenanceRequest | null>(null);
  const [stages, setStages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'notes' | 'instructions' | 'activity'>('notes');
  const [isEditing, setIsEditing] = useState(false);
  const [showWorksheet, setShowWorksheet] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (!authLoading) {
      loadRequestData();
    }
  }, [authLoading, id]);

  const loadRequestData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [requestData, stagesData] = await Promise.all([
        getMaintenanceRequestById(id),
        getMaintenanceStages()
      ]);

      setRequest(requestData);
      setStages(stagesData.sort((a, b) => (a.sequence || 0) - (b.sequence || 0)));
      setFormData({
        subject: requestData.subject,
        description: requestData.description,
        scheduledDate: requestData.scheduledDate,
        duration: requestData.duration || 0,
        note: requestData.note || '',
        technicianId: requestData.technicianId
      });
    } catch (err: any) {
      const errorMessage = err?.message || err?.error || 'Failed to load maintenance request';
      console.error('Error loading request:', errorMessage, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStageChange = async (stageId: string) => {
    try {
      await updateRequestStage(id, stageId);
      await loadRequestData();
    } catch (err: any) {
      console.error('Error updating stage:', err);
      setError(err?.message || 'Failed to update stage');
    }
  };

  const handleTechnicianChange = async (technicianId: string) => {
    try {
      await assignTechnician(id, technicianId);
      await loadRequestData();
    } catch (err: any) {
      console.error('Error assigning technician:', err);
      setError(err?.message || 'Failed to assign technician');
    }
  };

  const handleSave = async () => {
    try {
      setError(null);
      
      // Prepare update data - only include fields that have values
      const updateData: any = {};
      
      // Subject is required, so always include it
      if (formData.subject) {
        updateData.subject = formData.subject;
      }
      if (formData.description !== undefined) {
        updateData.description = formData.description || undefined;
      }
      if (formData.scheduledDate) {
        updateData.scheduledDate = formData.scheduledDate;
      } else if (formData.scheduledDate === '') {
        // Allow clearing scheduled date
        updateData.scheduledDate = null;
      }
      if (formData.duration !== undefined && formData.duration !== null) {
        updateData.duration = Number(formData.duration) || 0;
      }
      if (formData.note !== undefined) {
        updateData.note = formData.note || undefined;
      }
      
      await updateMaintenanceRequest(id, updateData);
      setIsEditing(false);
      await loadRequestData();
    } catch (err: any) {
      console.error('Error updating request:', err);
      const errorMessage = err?.message || err?.error?.message || 'Failed to update request';
      setError(errorMessage);
    }
  };

  const getStateDisplay = (state: string) => {
    switch (state) {
      case 'new': return 'New Request';
      case 'in_progress': return 'In Progress';
      case 'repaired': return 'Repaired';
      case 'scrap': return 'Scrap';
      default: return state;
    }
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'new': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in_progress': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'repaired': return 'bg-green-100 text-green-700 border-green-200';
      case 'scrap': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
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

  if (error && !request) {
    return (
      <DashboardShell>
        <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
          <div className="text-center">
            <p className="text-[#A14A4A] mb-4">{error}</p>
            <button
              onClick={loadRequestData}
              className="px-4 py-2 bg-[#5B7C99] text-white rounded-lg hover:opacity-90"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (!request) {
    return (
      <DashboardShell>
        <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
          <div className="text-center">
            <p className="text-[#A14A4A] mb-4">Maintenance request not found</p>
            <Link
              href="/maintenance"
              className="px-4 py-2 bg-[#5B7C99] text-white rounded-lg hover:opacity-90"
            >
              Go Back
            </Link>
          </div>
        </div>
      </DashboardShell>
    );
  }

  const formatDuration = (hours: number) => {
    if (!hours) return '00:00 hours';
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} hours`;
  };

  return (
    <DashboardShell>
      <div className="min-h-screen bg-[#F7F8F9]">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Link
                  href="/maintenance"
                  className="p-2 hover:bg-[#ECEFF1] rounded-lg transition-colors text-[#5F6B76]"
                >
                  <ArrowLeft size={20} />
                </Link>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[#5B7C99] text-white rounded-lg text-xs font-semibold">
                      New
                    </span>
                    <h1 className="text-2xl font-semibold text-[#1C1F23]">Maintenance Requests</h1>
                  </div>
                  <p className="text-lg font-bold text-[#1C1F23] mt-2">{request.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowWorksheet(!showWorksheet)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-[#ECEFF1] rounded-lg hover:bg-[#F7F8F9] transition-colors text-sm font-medium text-[#1C1F23]"
                >
                  <FileText size={18} />
                  Worksheet
                </button>
                {!isEditing && (user?.role === 'admin' || user?.role === 'manager') && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#5B7C99] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                  >
                    <Edit size={18} />
                    Edit
                  </button>
                )}
              </div>
            </div>

            {/* Workflow/Status Bar */}
            <div className="bg-white rounded-lg p-4 border border-[#ECEFF1] mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium px-2 py-1 rounded ${
                    request.state === 'new' ? 'bg-blue-100 text-blue-700' : 'text-[#5F6B76]'
                  }`}>
                    New Request
                  </span>
                  <ChevronRight size={16} className="text-[#90A4AE]" />
                  <span className={`text-sm font-medium px-2 py-1 rounded ${
                    request.state === 'in_progress' ? 'bg-orange-100 text-orange-700' : 'text-[#5F6B76]'
                  }`}>
                    In Progress
                  </span>
                  <ChevronRight size={16} className="text-[#90A4AE]" />
                  <span className={`text-sm font-medium px-2 py-1 rounded ${
                    request.state === 'repaired' ? 'bg-green-100 text-green-700' : 'text-[#5F6B76]'
                  }`}>
                    Repaired
                  </span>
                  <ChevronRight size={16} className="text-[#90A4AE]" />
                  <span className={`text-sm font-medium px-2 py-1 rounded ${
                    request.state === 'scrap' ? 'bg-red-100 text-red-700' : 'text-[#5F6B76]'
                  }`}>
                    Scrap
                  </span>
                </div>
                <div className="relative">
                  <select
                    value={request.stageId || ''}
                    onChange={(e) => handleStageChange(e.target.value)}
                    className="px-4 py-2 bg-white border border-[#ECEFF1] rounded-lg text-sm font-medium text-[#1C1F23] appearance-none pr-8 focus:outline-none focus:border-[#5B7C99]"
                    disabled={user?.role !== 'admin' && user?.role !== 'manager' && user?.role !== 'technician'}
                  >
                    <option value="" disabled>Select Stage</option>
                    {stages.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronRight size={16} className="text-[#90A4AE] rotate-90" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg border border-[#ECEFF1] shadow-sm">
            <div className="p-6 space-y-6">
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subject */}
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-[#90A4AE] uppercase tracking-wider mb-2 block">
                    Subject?
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-lg font-bold text-[#1C1F23] focus:outline-none focus:border-[#5B7C99]"
                    />
                  ) : (
                    <p className="text-lg font-bold text-[#1C1F23]">{request.subject}</p>
                  )}
                </div>

                {/* Created By */}
                <div>
                  <label className="text-sm font-semibold text-[#90A4AE] uppercase tracking-wider mb-2 block">
                    Created By
                  </label>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-[#90A4AE]" />
                    <p className="text-[#1C1F23] font-medium">{request.user?.name || request.createdBy?.name || 'Unknown'}</p>
                  </div>
                </div>

                {/* Maintenance For (Equipment) */}
                <div>
                  <label className="text-sm font-semibold text-[#90A4AE] uppercase tracking-wider mb-2 block">
                    Maintenance For
                  </label>
                  {request.equipment ? (
                    <Link
                      href={`/equipment/${request.equipmentId}`}
                      className="flex items-center gap-2 text-[#5B7C99] hover:text-[#455A64] transition-colors"
                    >
                      <Wrench size={16} />
                      <span className="font-medium">{request.equipment.name}</span>
                      {request.equipment.serialNumber && (
                        <span className="text-sm text-[#90A4AE]">({request.equipment.serialNumber})</span>
                      )}
                    </Link>
                  ) : (
                    <p className="text-[#5F6B76]">Not specified</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-semibold text-[#90A4AE] uppercase tracking-wider mb-2 block">
                    Category
                  </label>
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-[#90A4AE]" />
                    <p className="text-[#1C1F23] font-medium">{request.category?.name || 'Uncategorized'}</p>
                  </div>
                </div>

                {/* Request Date */}
                <div>
                  <label className="text-sm font-semibold text-[#90A4AE] uppercase tracking-wider mb-2 block">
                    Request Date?
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-[#90A4AE]" />
                    <p className="text-[#1C1F23] font-medium">
                      {request.dateRequest ? format(new Date(request.dateRequest), 'MM/dd/yyyy') : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Maintenance Type */}
                <div>
                  <label className="text-sm font-semibold text-[#90A4AE] uppercase tracking-wider mb-2 block">
                    Maintenance Type
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={request.requestType === 'corrective'}
                        readOnly
                        className="w-4 h-4 text-[#5B7C99]"
                      />
                      <span className="text-[#1C1F23] font-medium">Corrective</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={request.requestType === 'preventive'}
                        readOnly
                        className="w-4 h-4 text-[#5B7C99]"
                      />
                      <span className="text-[#1C1F23] font-medium">Preventive</span>
                    </label>
                  </div>
                </div>

                {/* Team */}
                <div>
                  <label className="text-sm font-semibold text-[#90A4AE] uppercase tracking-wider mb-2 block">
                    Team
                  </label>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-[#90A4AE]" />
                    {request.maintenanceTeamId && request.maintenanceTeam ? (
                      <Link
                        href={`/teams/${request.maintenanceTeamId}`}
                        className="text-[#5B7C99] hover:text-[#4A6B88] font-medium hover:underline transition-colors"
                      >
                        {request.maintenanceTeam.name}
                      </Link>
                    ) : (
                      <p className="text-[#1C1F23] font-medium">Not assigned</p>
                    )}
                  </div>
                </div>

                {/* Internal Maintenance (Technician) */}
                <div>
                  <label className="text-sm font-semibold text-[#90A4AE] uppercase tracking-wider mb-2 block">
                    Internal Maintenance
                  </label>
                  {isEditing && (user?.role === 'admin' || user?.role === 'manager') ? (
                    <select
                      value={formData.technicianId || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, technicianId: e.target.value });
                        if (e.target.value) {
                          handleTechnicianChange(e.target.value);
                        }
                      }}
                      className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99]"
                    >
                      <option value="">Select Technician</option>
                      {request.maintenanceTeam?.members?.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-[#90A4AE]" />
                      <p className="text-[#1C1F23] font-medium">{request.technician?.name || 'Unassigned'}</p>
                    </div>
                  )}
                </div>

                {/* Scheduled Date */}
                <div>
                  <label className="text-sm font-semibold text-[#90A4AE] uppercase tracking-wider mb-2 block">
                    Scheduled Date?
                  </label>
                  {isEditing ? (
                    <input
                      type="datetime-local"
                      value={formData.scheduledDate ? format(new Date(formData.scheduledDate), "yyyy-MM-dd'T'HH:mm") : ''}
                      onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                      className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99]"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-[#90A4AE]" />
                      <p className="text-[#1C1F23] font-medium">
                        {request.scheduledDate
                          ? format(new Date(request.scheduledDate), 'MM/dd/yyyy HH:mm:ss')
                          : 'Not scheduled'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actual Start Date */}
                <div>
                  <label className="text-sm font-semibold text-[#90A4AE] uppercase tracking-wider mb-2 block">
                    Actual Start Date
                  </label>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-[#90A4AE]" />
                    <p className="text-[#1C1F23] font-medium">
                      {request.dateStart
                        ? format(new Date(request.dateStart), 'MM/dd/yyyy HH:mm:ss')
                        : 'Not started'}
                    </p>
                  </div>
                </div>

                {/* Actual End Date */}
                <div>
                  <label className="text-sm font-semibold text-[#90A4AE] uppercase tracking-wider mb-2 block">
                    Actual End Date
                  </label>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#90A4AE]" />
                    <p className="text-[#1C1F23] font-medium">
                      {request.dateEnd
                        ? format(new Date(request.dateEnd), 'MM/dd/yyyy HH:mm:ss')
                        : 'Not completed'}
                    </p>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="text-sm font-semibold text-[#90A4AE] uppercase tracking-wider mb-2 block">
                    Duration
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      value={formData.duration || 0}
                      onChange={(e) => setFormData({ ...formData, duration: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99]"
                      placeholder="Hours"
                    />
                  ) : (
                    <p className="text-[#1C1F23] font-medium">{formatDuration(request.duration || 0)}</p>
                  )}
                </div>

                {/* Cost */}
                <div>
                  <label className="text-sm font-semibold text-[#90A4AE] uppercase tracking-wider mb-2 block">
                    Cost
                  </label>
                  <p className="text-[#1C1F23] font-medium">
                    ${request.maintenanceCost?.toFixed(2) || '0.00'}
                  </p>
                </div>

                {/* Company */}
                <div>
                  <label className="text-sm font-semibold text-[#90A4AE] uppercase tracking-wider mb-2 block">
                    Company
                  </label>
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-[#90A4AE]" />
                    <p className="text-[#1C1F23] font-medium">
                      {request.equipment?.company || 'My Company'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs: Notes, Instructions, and Activity Log */}
            <div className="border-t border-[#ECEFF1]">
              <div className="flex border-b border-[#ECEFF1]">
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === 'notes'
                      ? 'border-[#5B7C99] text-[#5B7C99]'
                      : 'border-transparent text-[#90A4AE] hover:text-[#5F6B76]'
                  }`}
                >
                  Notes
                </button>
                <button
                  onClick={() => setActiveTab('instructions')}
                  className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === 'instructions'
                      ? 'border-[#5B7C99] text-[#5B7C99]'
                      : 'border-transparent text-[#90A4AE] hover:text-[#5F6B76]'
                  }`}
                >
                  Instructions
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === 'activity'
                      ? 'border-[#5B7C99] text-[#5B7C99]'
                      : 'border-transparent text-[#90A4AE] hover:text-[#5F6B76]'
                  }`}
                >
                  Activity Log
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'notes' ? (
                  <div>
                    {isEditing ? (
                      <textarea
                        value={formData.note || ''}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] resize-none"
                        placeholder="Add notes..."
                      />
                    ) : (
                      <p className="text-[#1C1F23] whitespace-pre-wrap">
                        {request.note || 'No notes added yet.'}
                      </p>
                    )}
                  </div>
                ) : activeTab === 'instructions' ? (
                  <div>
                    <p className="text-[#1C1F23] whitespace-pre-wrap">
                      {request.description || 'No instructions provided.'}
                    </p>
                  </div>
                ) : (
                  <ActivityLog requestId={id} />
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="border-t border-[#ECEFF1] p-6 flex items-center justify-end gap-4">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      subject: request.subject,
                      description: request.description,
                      scheduledDate: request.scheduledDate,
                      duration: request.duration || 0,
                      note: request.note || '',
                      technicianId: request.technicianId
                    });
                  }}
                  className="px-6 py-2 text-[#5F6B76] hover:text-[#1C1F23] transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2 bg-[#5B7C99] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Worksheet Panel */}
          {showWorksheet && (
            <div className="mt-6 bg-white rounded-lg border border-[#ECEFF1] shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#1C1F23]">Worksheet Comments</h2>
                <button
                  onClick={() => setShowWorksheet(false)}
                  className="p-2 hover:bg-[#ECEFF1] rounded-lg transition-colors"
                >
                  <X size={20} className="text-[#5F6B76]" />
                </button>
              </div>
              <div className="space-y-4">
                <textarea
                  placeholder="Add worksheet comments or notes..."
                  rows={6}
                  className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] resize-none"
                />
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-[#5B7C99] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
                    Save Comment
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

