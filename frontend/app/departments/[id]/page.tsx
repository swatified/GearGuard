'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/app/hooks/useRequireAuth';
import DashboardShell from '@/app/components/layout/DashboardShell';
import { getDepartmentById } from '@/app/services/departments';
import { getEquipment } from '@/app/services/equipment';
import { Users, ChevronRight, Toolbox, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DepartmentDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { loading: authLoading } = useRequireAuth();
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState<any>(null);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      loadDepartmentData();
    }
  }, [authLoading, id]);

  const loadDepartmentData = async () => {
    try {
      setLoading(true);
      setError(null);

      const departmentData = await getDepartmentById(id);
      setDepartment(departmentData);

      // Load equipment in this department
      try {
        const equipmentData = await getEquipment({ departmentId: id });
        setEquipment(equipmentData.equipment || []);
      } catch (err) {
        console.error('Error loading equipment:', err);
        setEquipment([]);
      }
    } catch (err: any) {
      const errorMessage = err?.message || err?.error || 'Failed to load department details';
      console.error('Error loading department:', errorMessage, err);
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

  if (error || !department) {
    return (
      <DashboardShell>
        <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
          <div className="text-center">
            <p className="text-[#A14A4A] mb-4">{error || 'Department not found'}</p>
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

  return (
    <DashboardShell>
      <div className="min-h-screen bg-[#F7F8F9] pt-6 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-[#90A4AE] mb-6">
            <Link href="/equipment" className="hover:text-[#5B7C99] transition-colors">Equipment</Link>
            <ChevronRight size={14} />
            <span className="text-[#5F6B76] font-medium">{department.name}</span>
          </nav>

          {/* Header */}
          <div className="bg-white rounded-2xl p-8 border border-[#ECEFF1] shadow-[0_1px_2px_rgba(0,0,0,0.05)] mb-8">
            <div className="flex items-start gap-5">
              <div className="p-4 bg-[#F7F8F9] rounded-2xl text-[#5B7C99]">
                <Users size={32} />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-[#1C1F23] mb-2">{department.name}</h1>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-2xl p-8 border border-[#ECEFF1] shadow-[0_1px_2px_rgba(0,0,0,0.05)] mb-8">
            <h2 className="text-xl font-bold text-[#1C1F23] mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#5B7C99] rounded-full"></span>
              Statistics
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-[#F7F8F9] rounded-xl">
                <span className="text-sm font-medium text-[#5F6B76]">Total Equipment</span>
                <span className="text-2xl font-bold text-[#1C1F23]">{equipment.length}</span>
              </div>
            </div>
          </div>

          {/* Equipment List */}
          <div className="bg-white rounded-2xl border border-[#ECEFF1] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="p-8 border-b border-[#ECEFF1] flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1C1F23]">Equipment in this Department</h2>
              <div className="flex items-center gap-2 text-sm text-[#90A4AE]">
                <Toolbox size={16} />
                {equipment.length} items
              </div>
            </div>

            {equipment.length === 0 ? (
              <div className="p-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-[#F7F8F9] rounded-full flex items-center justify-center mb-4 text-[#90A4AE]">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-lg font-medium text-[#5F6B76]">No Equipment</h3>
                <p className="text-sm text-[#90A4AE] mt-1">No equipment found in this department.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#ECEFF1]">
                {equipment.map((item) => (
                  <Link
                    key={item.id}
                    href={`/equipment/${item.id}`}
                    className="block p-6 hover:bg-[#F7F8F9]/50 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-[#1C1F23] group-hover:text-[#5B7C99] transition-colors">
                          {item.name}
                        </h3>
                        {item.serialNumber && (
                          <p className="text-sm text-[#5F6B76] mt-1">Serial: {item.serialNumber}</p>
                        )}
                      </div>
                      <ChevronRight size={20} className="text-[#90A4AE] group-hover:text-[#5B7C99] transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

