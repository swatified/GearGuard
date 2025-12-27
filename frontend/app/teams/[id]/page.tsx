'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardShell from '@/app/components/layout/DashboardShell';
import { useRequireAuth } from '@/app/hooks/useRequireAuth';
import { getMaintenanceTeamById, type MaintenanceTeam } from '@/app/services/maintenanceTeams';
import { getMaintenanceRequests, type MaintenanceRequest } from '@/app/services/maintenanceRequests';
import { Users, ArrowLeft, Mail, Wrench, Clock, CheckCircle2, AlertCircle, Trash2, User as UserIcon } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TeamDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { loading: authLoading } = useRequireAuth();
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<MaintenanceTeam | null>(null);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      loadTeamData();
    }
  }, [authLoading, id]);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [teamData, requestsData] = await Promise.all([
        getMaintenanceTeamById(id),
        getMaintenanceRequests({ teamId: id, limit: 50 }),
      ]);

      setTeam(teamData);
      setRequests(requestsData.requests);
    } catch (err: any) {
      const errorMessage = err?.message || err?.error || (typeof err === 'string' ? err : 'Failed to load team details');
      console.error('Error loading team:', errorMessage, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'new':
        return <AlertCircle size={16} className="text-[#90A4AE]" />;
      case 'in_progress':
        return <Clock size={16} className="text-[#5B7C99]" />;
      case 'repaired':
        return <CheckCircle2 size={16} className="text-green-500" />;
      case 'scrap':
        return <Trash2 size={16} className="text-red-400" />;
      default:
        return <Wrench size={16} />;
    }
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'new':
        return 'bg-[#90A4AE]/10 text-[#90A4AE] border-[#90A4AE]/20';
      case 'in_progress':
        return 'bg-[#5B7C99]/10 text-[#5B7C99] border-[#5B7C99]/20';
      case 'repaired':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'scrap':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-[#ECEFF1] text-[#5F6B76] border-[#ECEFF1]';
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

  if (error || !team) {
    return (
      <DashboardShell>
        <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
          <div className="text-center">
            <p className="text-[#A14A4A] mb-4">{error || 'Team not found'}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-[#5B7C99] text-white rounded-lg hover:opacity-90"
            >
              Go Back
            </button>
          </div>
        </div>
      </DashboardShell>
    );
  }

  const activeRequests = requests.filter(r => r.state === 'new' || r.state === 'in_progress');
  const completedRequests = requests.filter(r => r.state === 'repaired');
  const scrapRequests = requests.filter(r => r.state === 'scrap');

  return (
    <DashboardShell>
      <div className="min-h-screen bg-[#F7F8F9] px-6 pb-12 pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/teams"
              className="inline-flex items-center gap-2 text-[#5B7C99] hover:text-[#4A6B88] mb-4 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Back to Teams</span>
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#1C1F23] mb-2">{team.name}</h1>
                <div className="flex items-center gap-4 text-sm text-[#5F6B76]">
                  <span className="flex items-center gap-1.5">
                    <Users size={16} />
                    {team.members?.length || 0} {team.members?.length === 1 ? 'Member' : 'Members'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Wrench size={16} />
                    {team.requestCount || 0} Active Requests
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${team.active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {team.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Team Members Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-[#ECEFF1] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-6">
                <h2 className="text-lg font-bold text-[#1C1F23] mb-4 flex items-center gap-2">
                  <Users size={20} className="text-[#5B7C99]" />
                  Team Members
                </h2>
                {team.members && team.members.length > 0 ? (
                  <div className="space-y-3">
                    {team.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 p-3 bg-[#F7F8F9] rounded-xl border border-[#ECEFF1] hover:border-[#5B7C99]/30 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#5B7C99] text-white flex items-center justify-center font-bold text-sm">
                          {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#1C1F23] truncate">{member.name}</p>
                          {member.email && (
                            <p className="text-xs text-[#90A4AE] truncate flex items-center gap-1">
                              <Mail size={12} />
                              {member.email}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#90A4AE]">
                    <UserIcon size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No members assigned</p>
                  </div>
                )}
              </div>
            </div>

            {/* Maintenance Requests Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-[#ECEFF1] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-[#1C1F23] flex items-center gap-2">
                    <Wrench size={20} className="text-[#5B7C99]" />
                    Maintenance Requests
                  </h2>
                  <Link
                    href={`/maintenance?teamId=${id}`}
                    className="text-sm text-[#5B7C99] hover:text-[#4A6B88] font-medium"
                  >
                    View All
                  </Link>
                </div>

                {requests.length > 0 ? (
                  <div className="space-y-4">
                    {/* Active Requests */}
                    {activeRequests.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-[#5F6B76] uppercase tracking-wider mb-3">
                          Active ({activeRequests.length})
                        </h3>
                        <div className="space-y-2">
                          {activeRequests.map((request) => (
                            <Link
                              key={request.id}
                              href={`/maintenance?requestId=${request.id}`}
                              className="block p-4 bg-[#F7F8F9] rounded-xl border border-[#ECEFF1] hover:border-[#5B7C99]/30 hover:shadow-sm transition-all"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    {getStateIcon(request.state)}
                                    <h4 className="font-semibold text-[#1C1F23] truncate">{request.subject}</h4>
                                  </div>
                                  {request.equipment && (
                                    <p className="text-sm text-[#5F6B76] truncate">
                                      Equipment: {request.equipment.name}
                                    </p>
                                  )}
                                  {request.technician && (
                                    <p className="text-xs text-[#90A4AE] mt-1">
                                      Assigned to: {request.technician.name}
                                    </p>
                                  )}
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold border ${getStateColor(request.state)}`}>
                                  {request.state.replace('_', ' ')}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Completed Requests */}
                    {completedRequests.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-[#5F6B76] uppercase tracking-wider mb-3">
                          Completed ({completedRequests.length})
                        </h3>
                        <div className="space-y-2">
                          {completedRequests.slice(0, 5).map((request) => (
                            <Link
                              key={request.id}
                              href={`/maintenance?requestId=${request.id}`}
                              className="block p-4 bg-[#F7F8F9] rounded-xl border border-[#ECEFF1] hover:border-[#5B7C99]/30 hover:shadow-sm transition-all"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    {getStateIcon(request.state)}
                                    <h4 className="font-semibold text-[#1C1F23] truncate">{request.subject}</h4>
                                  </div>
                                  {request.equipment && (
                                    <p className="text-sm text-[#5F6B76] truncate">
                                      Equipment: {request.equipment.name}
                                    </p>
                                  )}
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold border ${getStateColor(request.state)}`}>
                                  {request.state}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Scrap Requests */}
                    {scrapRequests.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-[#5F6B76] uppercase tracking-wider mb-3">
                          Scrapped ({scrapRequests.length})
                        </h3>
                        <div className="space-y-2">
                          {scrapRequests.slice(0, 3).map((request) => (
                            <Link
                              key={request.id}
                              href={`/maintenance?requestId=${request.id}`}
                              className="block p-4 bg-[#F7F8F9] rounded-xl border border-[#ECEFF1] hover:border-[#5B7C99]/30 hover:shadow-sm transition-all"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    {getStateIcon(request.state)}
                                    <h4 className="font-semibold text-[#1C1F23] truncate">{request.subject}</h4>
                                  </div>
                                  {request.equipment && (
                                    <p className="text-sm text-[#5F6B76] truncate">
                                      Equipment: {request.equipment.name}
                                    </p>
                                  )}
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold border ${getStateColor(request.state)}`}>
                                  {request.state}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-[#90A4AE]">
                    <Wrench size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No maintenance requests for this team</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

