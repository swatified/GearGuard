'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import type { Equipment, MaintenanceRequest } from '@/app/types/maintenance';

interface EquipmentDetailProps {
  equipment: Equipment & {
    purchaseDate?: string;
    warrantyStartDate?: string;
    warrantyEndDate?: string;
    location?: string;
    department?: { id: string; name: string };
    requestCount?: number;
    openRequestCount?: number;
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

  return (
    <div className="min-h-screen bg-[#F7F8F9]">
      {/* Header */}
      <div className={`bg-white border-b border-[#ECEFF1] ${isScrap ? 'scrap-state' : ''}`}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-[#1C1F23] mb-2">
                {equipment.name}
              </h1>
              <p className="text-[#5F6B76] text-lg">
                Serial: {equipment.serialNumber}
              </p>
              {isScrap && (
                <span className="inline-block mt-3 px-3 py-1 bg-[#ECEFF1] text-[#5F6B76] rounded text-sm font-medium">
                  Scrap
                </span>
              )}
            </div>
            <button
              onClick={onMaintenanceClick}
              className="px-6 py-3 bg-[#5B7C99] text-white rounded-lg hover:opacity-90 transition-opacity duration-150 font-medium flex items-center gap-2 relative"
            >
              Maintenance
              {openRequests.length > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#A14A4A] text-white rounded-full text-xs flex items-center justify-center font-semibold">
                  {openRequests.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-[#ECEFF1]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 transition-colors duration-150 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-[#5B7C99] text-[#5B7C99]'
                  : 'border-transparent text-[#5F6B76] hover:text-[#1C1F23]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 transition-colors duration-150 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-[#5B7C99] text-[#5B7C99]'
                  : 'border-transparent text-[#5F6B76] hover:text-[#1C1F23]'
              }`}
            >
              Maintenance History
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'overview' ? (
          <div className={`bg-white rounded-lg p-8 ${isScrap ? 'scrap-state' : ''}`}>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-semibold text-[#1C1F23] mb-6">
                  Equipment Details
                </h2>
                <dl className="space-y-4">
                  {equipment.location && (
                    <div>
                      <dt className="text-sm font-medium text-[#5F6B76] mb-1">
                        Location
                      </dt>
                      <dd className="text-[#1C1F23]">{equipment.location}</dd>
                    </div>
                  )}
                  {equipment.department && (
                    <div>
                      <dt className="text-sm font-medium text-[#5F6B76] mb-1">
                        Department
                      </dt>
                      <dd className="text-[#1C1F23]">
                        {equipment.department.name}
                      </dd>
                    </div>
                  )}
                  {equipment.purchaseDate && (
                    <div>
                      <dt className="text-sm font-medium text-[#5F6B76] mb-1">
                        Purchase Date
                      </dt>
                      <dd className="text-[#1C1F23]">
                        {format(new Date(equipment.purchaseDate), 'MMM d, yyyy')}
                      </dd>
                    </div>
                  )}
                  {equipment.warrantyStartDate && equipment.warrantyEndDate && (
                    <div>
                      <dt className="text-sm font-medium text-[#5F6B76] mb-1">
                        Warranty Period
                      </dt>
                      <dd className="text-[#1C1F23]">
                        {format(
                          new Date(equipment.warrantyStartDate),
                          'MMM d, yyyy'
                        )}{' '}
                        -{' '}
                        {format(
                          new Date(equipment.warrantyEndDate),
                          'MMM d, yyyy'
                        )}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[#1C1F23] mb-6">
                  Maintenance Summary
                </h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-[#5F6B76] mb-1">
                      Total Requests
                    </dt>
                    <dd className="text-2xl font-semibold text-[#1C1F23]">
                      {equipment.requestCount || requests.length}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-[#5F6B76] mb-1">
                      Open Requests
                    </dt>
                    <dd className="text-2xl font-semibold text-[#1C1F23]">
                      {equipment.openRequestCount || openRequests.length}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8">
            <h2 className="text-lg font-semibold text-[#1C1F23] mb-6">
              Maintenance History
            </h2>
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#5F6B76]">
                  No maintenance history available for this equipment.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 border border-[#ECEFF1] rounded-lg hover:border-[#5B7C99] transition-colors duration-150"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-[#1C1F23]">
                          {request.subject}
                        </h3>
                        <p className="text-sm text-[#5F6B76] mt-1">
                          {request.name}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          request.state === 'repaired'
                            ? 'bg-[#6F8F7A] text-white'
                            : request.state === 'scrap'
                            ? 'bg-[#ECEFF1] text-[#5F6B76]'
                            : request.state === 'in_progress'
                            ? 'bg-[#5B7C99] text-white'
                            : 'bg-[#ECEFF1] text-[#5F6B76]'
                        }`}
                      >
                        {request.state.replace('_', ' ')}
                      </span>
                    </div>
                    {request.scheduledDate && (
                      <p className="text-sm text-[#5F6B76]">
                        Scheduled:{' '}
                        {format(
                          new Date(request.scheduledDate),
                          'MMM d, yyyy'
                        )}
                      </p>
                    )}
                    {request.technician && (
                      <p className="text-sm text-[#5F6B76] mt-1">
                        Technician: {request.technician.name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

