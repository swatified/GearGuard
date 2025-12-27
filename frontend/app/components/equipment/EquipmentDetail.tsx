'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import type { Equipment, MaintenanceRequest, Technician } from '@/app/types/maintenance';
import {
  Calendar,
  MapPin,
  Tag,
  Users,
  User,
  Toolbox,
  Clock,
  AlertCircle,
  CheckCircle2,
  Trash2,
  ChevronRight,
  ClipboardList,
  Wrench
} from 'lucide-react';
import Link from 'next/link';

interface EquipmentDetailProps {
  equipment: Equipment & {
    purchaseDate?: string;
    warrantyStartDate?: string;
    warrantyEndDate?: string;
    location?: string;
    department?: { id: string; name: string };
    category?: { id: string; name: string };
    employee?: { id: string; name: string };
    maintenanceTeam?: { id: string; name: string };
    requestCount?: number;
    openRequestCount?: number;
    technician?: Technician;
  };
  requests?: MaintenanceRequest[];
  onMaintenanceClick?: () => void;
}

export default function EquipmentDetail({
  equipment,
  requests = [],
  onMaintenanceClick,
}: EquipmentDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>(
    'overview'
  );
  const isScrap = !equipment.active;

  const openRequests = requests.filter(
    (req) => req.state !== 'repaired' && req.state !== 'scrap'
  );

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'repaired': return 'bg-green-50 text-green-600 border-green-100';
      case 'scrap': return 'bg-red-50 text-red-600 border-red-100';
      case 'in_progress': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F9] pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-[#90A4AE] mb-6">
          <Link href="/equipment" className="hover:text-[#5B7C99] transition-colors">Equipment</Link>
          <ChevronRight size={14} />
          <span className="text-[#5F6B76] font-medium">{equipment.name}</span>
        </nav>

        {/* Enhanced Header */}
        <div className={`bg-white rounded-2xl p-8 border border-[#ECEFF1] shadow-[0_1px_2px_rgba(0,0,0,0.05)] mb-8 transition-all ${isScrap ? 'opacity-75 grayscale-[0.5]' : ''}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="p-4 bg-[#F7F8F9] rounded-2xl text-[#5B7C99]">
                <Toolbox size={32} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-[#1C1F23]">{equipment.name}</h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${equipment.active ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                    {equipment.active ? 'Active' : 'Scrapped'}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-[#5F6B76]">
                  <span className="flex items-center gap-1.5 text-sm">
                    <Tag size={14} className="text-[#90A4AE]" />
                    {equipment.serialNumber}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ECEFF1]"></span>
                  <span className="flex items-center gap-1.5 text-sm">
                    <MapPin size={14} className="text-[#90A4AE]" />
                    {equipment.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Smart Buttons */}
              <button
                onClick={() => setActiveTab('history')}
                className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-white border border-[#ECEFF1] hover:border-[#5B7C99] hover:bg-blue-50/30 transition-all group"
              >
                <span className="text-2xl font-bold text-[#1C1F23] group-hover:text-[#5B7C99]">{equipment.requestCount || requests.length}</span>
                <span className="text-[10px] font-semibold text-[#90A4AE] uppercase mt-1">Total REQS</span>
              </button>

              <button
                onClick={onMaintenanceClick}
                className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-[#5B7C99] text-white hover:opacity-95 transition-all shadow-md relative"
              >
                <Wrench size={24} className="mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-wide">Maintenance</span>
                {openRequests.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold border-2 border-white">
                    {openRequests.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-8 mb-8 border-b border-[#ECEFF1] px-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-1 border-b-2 transition-all font-semibold text-sm flex items-center gap-2 ${activeTab === 'overview'
              ? 'border-[#5B7C99] text-[#5B7C99]'
              : 'border-transparent text-[#90A4AE] hover:text-[#5F6B76]'
              }`}
          >
            <ClipboardList size={18} />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-4 px-1 border-b-2 transition-all font-semibold text-sm flex items-center gap-2 ${activeTab === 'history'
              ? 'border-[#5B7C99] text-[#5B7C99]'
              : 'border-transparent text-[#90A4AE] hover:text-[#5F6B76]'
              }`}
          >
            <Clock size={18} />
            Maintenance History
          </button>
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeTab === 'overview' ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Technical Information */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-2xl p-8 border border-[#ECEFF1] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                  <h2 className="text-xl font-bold text-[#1C1F23] mb-8 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-[#5B7C99] rounded-full"></span>
                    Technical Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-y-8 gap-x-12">
                    <div className="space-y-1.5">
                      <dt className="text-xs font-bold text-[#90A4AE] uppercase tracking-wider flex items-center gap-2">
                        <MapPin size={12} />
                        Physical Location
                      </dt>
                      <dd className="text-[#1C1F23] font-medium">{equipment.location || 'Not Specified'}</dd>
                    </div>
                    <div className="space-y-1.5">
                      <dt className="text-xs font-bold text-[#90A4AE] uppercase tracking-wider flex items-center gap-2">
                        <Users size={12} />
                        Department
                      </dt>
                      <dd className="text-[#1C1F23] font-medium">
                        {equipment.department?.id ? (
                          <Link
                            href={`/departments/${equipment.department.id}`}
                            className="text-[#5B7C99] hover:text-[#4A6B88] hover:underline transition-colors"
                          >
                            {equipment.department.name}
                          </Link>
                        ) : (
                          'Unassigned'
                        )}
                      </dd>
                    </div>
                    <div className="space-y-1.5">
                      <dt className="text-xs font-bold text-[#90A4AE] uppercase tracking-wider flex items-center gap-2">
                        <Tag size={12} />
                        Category
                      </dt>
                      <dd className="text-[#1C1F23] font-medium">
                        {equipment.category?.id ? (
                          <Link
                            href={`/categories/${equipment.category.id}`}
                            className="text-[#5B7C99] hover:text-[#4A6B88] hover:underline transition-colors"
                          >
                            {equipment.category.name}
                          </Link>
                        ) : (
                          'Uncategorized'
                        )}
                      </dd>
                    </div>
                    <div className="space-y-1.5">
                      <dt className="text-xs font-bold text-[#90A4AE] uppercase tracking-wider flex items-center gap-2">
                        <Tag size={12} />
                        Serial Number
                      </dt>
                      <dd className="text-[#1C1F23] font-medium">{equipment.serialNumber || 'Not specified'}</dd>
                    </div>
                    {(equipment as any).company && (
                      <div className="space-y-1.5">
                        <dt className="text-xs font-bold text-[#90A4AE] uppercase tracking-wider flex items-center gap-2">
                          <Tag size={12} />
                          Company
                        </dt>
                        <dd className="text-[#1C1F23] font-medium">{(equipment as any).company}</dd>
                      </div>
                    )}
                    {(equipment as any).model && (
                      <div className="space-y-1.5">
                        <dt className="text-xs font-bold text-[#90A4AE] uppercase tracking-wider flex items-center gap-2">
                          <Tag size={12} />
                          Model
                        </dt>
                        <dd className="text-[#1C1F23] font-medium">{(equipment as any).model}</dd>
                      </div>
                    )}
                    {(equipment as any).manufacturer && (
                      <div className="space-y-1.5">
                        <dt className="text-xs font-bold text-[#90A4AE] uppercase tracking-wider flex items-center gap-2">
                          <Tag size={12} />
                          Manufacturer
                        </dt>
                        <dd className="text-[#1C1F23] font-medium">{(equipment as any).manufacturer}</dd>
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <dt className="text-xs font-bold text-[#90A4AE] uppercase tracking-wider flex items-center gap-2">
                        <Calendar size={12} />
                        Purchase Date
                      </dt>
                      <dd className="text-[#1C1F23] font-medium">
                        {equipment.purchaseDate ? format(new Date(equipment.purchaseDate), 'MMMM d, yyyy') : 'N/A'}
                      </dd>
                    </div>
                    <div className="space-y-1.5">
                      <dt className="text-xs font-bold text-[#90A4AE] uppercase tracking-wider flex items-center gap-2">
                        <Users size={12} />
                        Maintenance Team
                      </dt>
                      <dd className="text-[#1C1F23] font-medium">
                        {equipment.maintenanceTeamId && equipment.maintenanceTeam ? (
                          <Link
                            href={`/teams/${equipment.maintenanceTeamId}`}
                            className="text-[#5B7C99] hover:text-[#4A6B88] hover:underline transition-colors"
                          >
                            {equipment.maintenanceTeam.name}
                          </Link>
                        ) : (
                          'Not assigned'
                        )}
                      </dd>
                    </div>
                    <div className="space-y-1.5">
                      <dt className="text-xs font-bold text-[#90A4AE] uppercase tracking-wider flex items-center gap-2">
                        <User size={12} />
                        Assigned Employee
                      </dt>
                      <dd className="text-[#1C1F23] font-medium">
                        {equipment.employee?.id ? (
                          <Link
                            href={`/employees/${equipment.employee.id}`}
                            className="text-[#5B7C99] hover:text-[#4A6B88] hover:underline transition-colors"
                          >
                            {equipment.employee.name}
                          </Link>
                        ) : (
                          'Not assigned'
                        )}
                      </dd>
                    </div>
                    <div className="space-y-1.5">
                      <dt className="text-xs font-bold text-[#90A4AE] uppercase tracking-wider flex items-center gap-2">
                        <Wrench size={12} />
                        Default Technician
                      </dt>
                      <dd className="text-[#1C1F23] font-medium font-semibold">
                        {equipment.technician?.id ? (
                          <Link
                            href={`/users/${equipment.technician.id}`}
                            className="text-[#5B7C99] hover:text-[#4A6B88] hover:underline transition-colors"
                          >
                            {equipment.technician.name}
                          </Link>
                        ) : (
                          'Not assigned'
                        )}
                      </dd>
                    </div>
                    {(equipment as any).workCenter && (
                      <div className="space-y-1.5">
                        <dt className="text-xs font-bold text-[#90A4AE] uppercase tracking-wider flex items-center gap-2">
                          <Tag size={12} />
                          Work Center
                        </dt>
                        <dd className="text-[#1C1F23] font-medium">
                          {(equipment as any).workCenter?.id ? (
                            <Link
                              href={`/work-centers/${(equipment as any).workCenter.id}`}
                              className="text-[#5B7C99] hover:text-[#4A6B88] hover:underline transition-colors"
                            >
                              {(equipment as any).workCenter.name}
                            </Link>
                          ) : (
                            'Not assigned'
                          )}
                        </dd>
                      </div>
                    )}
                  </div>
                  {(equipment as any).technicalSpecifications && (
                    <div className="mt-6 pt-6 border-t border-[#ECEFF1]">
                      <dt className="text-xs font-bold text-[#90A4AE] uppercase tracking-wider mb-2">Technical Specifications</dt>
                      <dd className="text-[#1C1F23] font-medium whitespace-pre-wrap">{(equipment as any).technicalSpecifications}</dd>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl p-8 border border-[#ECEFF1] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                  <h2 className="text-xl font-bold text-[#1C1F23] mb-8 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-[#5B7C99] rounded-full"></span>
                    Warranty Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-4 bg-[#F7F8F9] rounded-xl border border-[#ECEFF1]">
                      <dt className="text-xs font-bold text-[#90A4AE] uppercase tracking-wider mb-2">Coverage Start</dt>
                      <dd className="text-[#1C1F23] font-semibold">
                        {equipment.warrantyStartDate ? format(new Date(equipment.warrantyStartDate), 'MMM d, yyyy') : 'No coverage'}
                      </dd>
                    </div>
                    <div className="p-4 bg-[#F7F8F9] rounded-xl border border-[#ECEFF1]">
                      <dt className="text-xs font-bold text-[#90A4AE] uppercase tracking-wider mb-2">Coverage End</dt>
                      <dd className="text-[#1C1F23] font-semibold text-red-600">
                        {equipment.warrantyEndDate ? format(new Date(equipment.warrantyEndDate), 'MMM d, yyyy') : 'No coverage'}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Stats */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-8 border border-[#ECEFF1] shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-center">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={40} className="text-green-500" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1C1F23]">Health Score</h3>
                  <p className="text-sm text-[#5F6B76] mt-1 mb-4">Based on maintenance history</p>
                  <div className="text-4xl font-extrabold text-[#1C1F23]">92%</div>
                  <div className="mt-6 pt-6 border-t border-[#ECEFF1]">
                    <div className="flex justify-between text-sm mb-2 font-medium">
                      <span className="text-[#5F6B76]">Reliability</span>
                      <span className="text-[#4CAF50]">High</span>
                    </div>
                    <div className="w-full h-2 bg-[#F7F8F9] rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[92%] transition-all"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#ECEFF1] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <div className="p-8 border-b border-[#ECEFF1] flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#1C1F23]">Maintenance Logs</h2>
                <div className="flex items-center gap-2 text-sm text-[#90A4AE]">
                  <AlertCircle size={16} />
                  Found {requests.length} logs
                </div>
              </div>

              {requests.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#F7F8F9] rounded-full flex items-center justify-center mb-4 text-[#90A4AE]">
                    <Clock size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-[#5F6B76]">No Logs Yet</h3>
                  <p className="text-sm text-[#90A4AE] mt-1">This equipment hasn't required maintenance yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#ECEFF1]">
                  {requests.map((request) => (
                    <div key={request.id} className="p-6 hover:bg-[#F7F8F9]/50 transition-colors group">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-2.5 rounded-lg border ${getStatusColor(request.state)}`}>
                            {request.state === 'repaired' ? <CheckCircle2 size={20} /> :
                              request.state === 'scrap' ? <Trash2 size={20} /> : <Wrench size={20} />}
                          </div>
                          <div>
                            <h3 className="font-bold text-[#1C1F23] group-hover:text-[#5B7C99] transition-colors">
                              {request.subject}
                            </h3>
                            <div className="flex items-center gap-3 mt-1 text-xs text-[#90A4AE] font-medium">
                              <span className="uppercase tracking-wider">{request.name}</span>
                              <span className="w-1 h-1 rounded-full bg-[#ECEFF1]"></span>
                              <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                {request.scheduledDate ? format(new Date(request.scheduledDate), 'MMM d, yyyy') : 'No Date'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          {request.technician && (
                            <div className="text-right hidden md:block">
                              <p className="text-xs text-[#90A4AE] font-bold uppercase tracking-wider mb-0.5">Technician</p>
                              <p className="text-sm font-semibold text-[#1C1F23]">{request.technician.name}</p>
                            </div>
                          )}
                          <Link
                            href={`/maintenance/${request.id}`}
                            className="p-2 text-[#90A4AE] hover:text-[#5B7C99] hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <ChevronRight size={20} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
