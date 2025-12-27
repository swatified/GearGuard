'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { MaintenanceRequest, RequestType, Equipment } from '@/app/types/maintenance';

interface MaintenanceRequestFormProps {
  onSubmit: (data: MaintenanceRequestFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<MaintenanceRequest>;
  equipment?: Equipment[];
  technicians?: Array<{ id: string; name: string }>;
}

export interface MaintenanceRequestFormData {
  subject: string;
  description?: string;
  equipmentId: string;
  requestType: RequestType;
  scheduledDate?: string;
  duration?: number;
  technicianId?: string;
  priority?: string;
}

export default function MaintenanceRequestForm({
  onSubmit,
  onCancel,
  initialData,
  equipment = [],
  technicians = [],
}: MaintenanceRequestFormProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MaintenanceRequestFormData>({
    defaultValues: {
      subject: initialData?.subject || '',
      description: initialData?.description || '',
      equipmentId: initialData?.equipmentId || '',
      requestType: initialData?.requestType || 'corrective',
      scheduledDate: initialData?.scheduledDate
        ? new Date(initialData.scheduledDate).toISOString().split('T')[0]
        : '',
      duration: initialData?.duration || undefined,
      technicianId: initialData?.technicianId || '',
      priority: initialData?.priority || '',
    },
  });

  const equipmentId = watch('equipmentId');

  useEffect(() => {
    if (equipmentId) {
      const eq = equipment.find((e) => e.id === equipmentId);
      if (eq) {
        setSelectedEquipment(eq);
        // Auto-fill team from equipment if available
        if (eq.maintenanceTeamId) {
          // Team auto-fill logic would go here
        }
      }
    }
  }, [equipmentId, equipment]);

  const handleFormSubmit = (data: MaintenanceRequestFormData) => {
    onSubmit(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[#F7F8F9] min-h-screen">
      <div className="bg-white rounded-lg p-8">
        <h1 className="text-2xl font-semibold text-[#1C1F23] mb-8">
          {initialData ? 'Edit Maintenance Request' : 'New Maintenance Request'}
        </h1>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          {/* Core Info Section */}
          <section>
            <h2 className="text-lg font-medium text-[#1C1F23] mb-4">
              Core Information
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-[#1C1F23] mb-2"
                >
                  Subject *
                </label>
                <input
                  id="subject"
                  type="text"
                  {...register('subject', { required: 'Subject is required' })}
                  className="w-full px-4 py-2 border border-[#ECEFF1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B7C99] focus:border-transparent text-[#1C1F23]"
                  placeholder="Describe the maintenance needed"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-[#A14A4A]">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="requestType"
                  className="block text-sm font-medium text-[#1C1F23] mb-2"
                >
                  Type *
                </label>
                <select
                  id="requestType"
                  {...register('requestType', {
                    required: 'Request type is required',
                  })}
                  className="w-full px-4 py-2 border border-[#ECEFF1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B7C99] focus:border-transparent text-[#1C1F23] bg-white"
                >
                  <option value="corrective">Corrective</option>
                  <option value="preventive">Preventive</option>
                </select>
                {errors.requestType && (
                  <p className="mt-1 text-sm text-[#A14A4A]">
                    {errors.requestType.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-[#1C1F23] mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-2 border border-[#ECEFF1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B7C99] focus:border-transparent text-[#1C1F23] resize-none"
                  placeholder="Additional details about the maintenance request"
                />
              </div>
            </div>
          </section>

          {/* Equipment Section */}
          <section>
            <h2 className="text-lg font-medium text-[#1C1F23] mb-4">
              Equipment
            </h2>
            <div>
              <label
                htmlFor="equipmentId"
                className="block text-sm font-medium text-[#1C1F23] mb-2"
              >
                Equipment *
              </label>
              <select
                id="equipmentId"
                {...register('equipmentId', {
                  required: 'Equipment is required',
                })}
                className="w-full px-4 py-2 border border-[#ECEFF1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B7C99] focus:border-transparent text-[#1C1F23] bg-white"
                disabled={!!initialData?.equipmentId}
              >
                <option value="">Select equipment</option>
                {equipment.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.name} {eq.serialNumber ? `(${eq.serialNumber})` : ''}
                  </option>
                ))}
              </select>
              {errors.equipmentId && (
                <p className="mt-1 text-sm text-[#A14A4A]">
                  {errors.equipmentId.message}
                </p>
              )}

              {selectedEquipment && (
                <div className="mt-4 p-4 bg-[#F7F8F9] rounded-lg">
                  <p className="text-sm text-[#5F6B76]">
                    <span className="font-medium text-[#1C1F23]">Serial:</span>{' '}
                    {selectedEquipment.serialNumber}
                  </p>
                  {selectedEquipment.location && (
                    <p className="text-sm text-[#5F6B76] mt-1">
                      <span className="font-medium text-[#1C1F23]">
                        Location:
                      </span>{' '}
                      {selectedEquipment.location}
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Schedule Section */}
          <section>
            <h2 className="text-lg font-medium text-[#1C1F23] mb-4">
              Schedule
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="scheduledDate"
                  className="block text-sm font-medium text-[#1C1F23] mb-2"
                >
                  Scheduled Date
                </label>
                <input
                  id="scheduledDate"
                  type="date"
                  {...register('scheduledDate')}
                  className="w-full px-4 py-2 border border-[#ECEFF1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B7C99] focus:border-transparent text-[#1C1F23]"
                />
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-[#1C1F23] mb-2"
                >
                  Duration (hours)
                </label>
                <input
                  id="duration"
                  type="number"
                  min="0"
                  step="0.5"
                  {...register('duration', {
                    valueAsNumber: true,
                    min: { value: 0, message: 'Duration must be positive' },
                  })}
                  className="w-full px-4 py-2 border border-[#ECEFF1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B7C99] focus:border-transparent text-[#1C1F23]"
                  placeholder="0"
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-[#A14A4A]">
                    {errors.duration.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Assignment Section */}
          <section>
            <h2 className="text-lg font-medium text-[#1C1F23] mb-4">
              Assignment
            </h2>
            <div>
              <label
                htmlFor="technicianId"
                className="block text-sm font-medium text-[#1C1F23] mb-2"
              >
                Technician
              </label>
              <select
                id="technicianId"
                {...register('technicianId')}
                className="w-full px-4 py-2 border border-[#ECEFF1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B7C99] focus:border-transparent text-[#1C1F23] bg-white"
              >
                <option value="">Unassigned</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4 border-t border-[#ECEFF1]">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#5B7C99] text-white rounded-lg hover:opacity-90 transition-opacity duration-150 font-medium"
            >
              {initialData ? 'Update Request' : 'Create Request'}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 bg-white text-[#5F6B76] border border-[#ECEFF1] rounded-lg hover:bg-[#ECEFF1] transition-colors duration-150 font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

