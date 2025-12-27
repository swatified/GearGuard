'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/app/hooks/useRequireAuth';
import DashboardShell from '@/app/components/layout/DashboardShell';
import { getUserById } from '@/app/services/users';
import { getMaintenanceRequests } from '@/app/services/maintenanceRequests';
import { User, ChevronRight, Wrench, AlertCircle, Mail, Phone, Shield } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { loading: authLoading } = useRequireAuth();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      loadUserData();
    }
  }, [authLoading, id]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const userData = await getUserById(id);
      setUser(userData);

      // Load maintenance requests assigned to this user/technician
      try {
        const requestsData = await getMaintenanceRequests({ technicianId: id, limit: 50 });
        setRequests(requestsData.requests || []);
      } catch (err) {
        console.error('Error loading requests:', err);
        setRequests([]);
      }
    } catch (err: any) {
      const errorMessage = err?.message || err?.error || 'Failed to load user details';
      console.error('Error loading user:', errorMessage, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
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

  if (error || !user) {
    return (
      <DashboardShell>
        <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
          <div className="text-center">
            <p className="text-[#A14A4A] mb-4">{error || 'User not found'}</p>
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'manager': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'technician': return 'bg-green-50 text-green-600 border-green-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <DashboardShell>
      <div className="min-h-screen bg-[#F7F8F9] pt-6 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-[#90A4AE] mb-6">
            <Link href="/equipment" className="hover:text-[#5B7C99] transition-colors">Equipment</Link>
            <ChevronRight size={14} />
            <span className="text-[#5F6B76] font-medium">{user.name}</span>
          </nav>

          {/* Header */}
          <div className="bg-white rounded-2xl p-8 border border-[#ECEFF1] shadow-[0_1px_2px_rgba(0,0,0,0.05)] mb-8">
            <div className="flex items-start gap-5">
              <div className="p-4 bg-[#F7F8F9] rounded-2xl text-[#5B7C99]">
                <User size={32} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-[#1C1F23]">{user.name}</h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  {user.email && (
                    <span className="flex items-center gap-1.5 text-sm text-[#5F6B76]">
                      <Mail size={14} className="text-[#90A4AE]" />
                      {user.email}
                    </span>
                  )}
                  {user.phone && (
                    <span className="flex items-center gap-1.5 text-sm text-[#5F6B76]">
                      <Phone size={14} className="text-[#90A4AE]" />
                      {user.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl p-8 border border-[#ECEFF1] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <h2 className="text-xl font-bold text-[#1C1F23] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#5B7C99] rounded-full"></span>
                User Information
              </h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <dt className="text-xs font-bold text-[#90A4AE] uppercase tracking-wider flex items-center gap-2">
                    <Shield size={12} />
                    Role
                  </dt>
                  <dd className="text-[#1C1F23] font-medium capitalize">{user.role}</dd>
                </div>
                {user.department && (
                  <div className="space-y-1.5">
                    <dt className="text-xs font-bold text-[#90A4AE] uppercase tracking-wider">Department</dt>
                    <dd className="text-[#1C1F23] font-medium">{user.department.name}</dd>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-[#ECEFF1] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <h2 className="text-xl font-bold text-[#1C1F23] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#5B7C99] rounded-full"></span>
                Statistics
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#F7F8F9] rounded-xl">
                  <span className="text-sm font-medium text-[#5F6B76]">Assigned Requests</span>
                  <span className="text-2xl font-bold text-[#1C1F23]">{requests.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Requests List */}
          {user.role === 'technician' && (
            <div className="bg-white rounded-2xl border border-[#ECEFF1] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <div className="p-8 border-b border-[#ECEFF1] flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#1C1F23]">Assigned Maintenance Requests</h2>
                <div className="flex items-center gap-2 text-sm text-[#90A4AE]">
                  <Wrench size={16} />
                  {requests.length} items
                </div>
              </div>

              {requests.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#F7F8F9] rounded-full flex items-center justify-center mb-4 text-[#90A4AE]">
                    <AlertCircle size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-[#5F6B76]">No Requests</h3>
                  <p className="text-sm text-[#90A4AE] mt-1">No maintenance requests assigned to this technician.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#ECEFF1]">
                  {requests.map((request) => (
                    <Link
                      key={request.id}
                      href={`/maintenance/${request.id}`}
                      className="block p-6 hover:bg-[#F7F8F9]/50 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-[#1C1F23] group-hover:text-[#5B7C99] transition-colors">
                            {request.subject}
                          </h3>
                          {request.equipment && (
                            <p className="text-sm text-[#5F6B76] mt-1">Equipment: {request.equipment.name}</p>
                          )}
                          {request.scheduledDate && (
                            <p className="text-xs text-[#90A4AE] mt-1">
                              Scheduled: {format(new Date(request.scheduledDate), 'MMM d, yyyy')}
                            </p>
                          )}
                        </div>
                        <ChevronRight size={20} className="text-[#90A4AE] group-hover:text-[#5B7C99] transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

