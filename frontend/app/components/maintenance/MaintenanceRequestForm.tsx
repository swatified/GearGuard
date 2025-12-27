'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { MaintenanceRequest, RequestType, Equipment } from '@/app/types/maintenance';
import {
  ClipboardList,
  Wrench,
  Tag,
  FileText,
  Layout,
  Calendar,
  Clock,
  User,
  AlertCircle,
  Save,
  X,
  Plus
} from 'lucide-react';

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
      priority: initialData?.priority || '1',
    },
  });

  const equipmentId = watch('equipmentId');

  useEffect(() => {
    if (equipmentId) {
      const eq = equipment.find((e) => e.id === equipmentId);
      if (eq) {
        setSelectedEquipment(eq);
      }
    }
  }, [equipmentId, equipment]);

  const handleFormSubmit = (data: MaintenanceRequestFormData) => {
    onSubmit(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pt-20">
      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#ECEFF1] overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-[#ECEFF1] flex items-center justify-between bg-[#F7F8F9]/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#5B7C99] text-white rounded-lg shadow-sm">
              <ClipboardList size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1C1F23]">
                {initialData ? 'Edit Request' : 'New Maintenance Request'}
              </h1>
              <p className="text-xs text-[#90A4AE] font-semibold uppercase tracking-wider mt-0.5">
                {initialData ? initialData.name : 'Draft Request'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded text-[10px] font-bold uppercase tracking-widest">
              Draft
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-8 space-y-10">
          {/* Core Information */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1 h-6 bg-[#5B7C99] rounded-full"></span>
              <h2 className="text-lg font-bold text-[#1C1F23]">Request Overview</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="md:col-span-2 space-y-1.5 focus-within:z-10 group">
                <label className="text-sm font-semibold text-[#5F6B76] flex items-center gap-2 group-focus-within:text-[#5B7C99] transition-colors">
                  <Tag size={14} /> Subject *
                </label>
                <input
                  {...register('subject', { required: 'Subject is required' })}
                  className="w-full px-4 py-2.5 bg-[#F7F8F9] border border-[#ECEFF1] rounded-xl text-sm font-medium focus:outline-none focus:border-[#5B7C99] focus:bg-white transition-all shadow-sm"
                  placeholder="e.g. Oil Leak in Hydraulic System"
                />
                {errors.subject && (
                  <p className="mt-1 text-xs font-bold text-red-500 uppercase flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.subject.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 group">
                <label className="text-sm font-semibold text-[#5F6B76] flex items-center gap-2 group-focus-within:text-[#5B7C99] transition-colors">
                  <Wrench size={14} /> Type *
                </label>
                <select
                  {...register('requestType', { required: 'Type is required' })}
                  className="w-full px-4 py-2.5 bg-[#F7F8F9] border border-[#ECEFF1] rounded-xl text-sm font-medium focus:outline-none focus:border-[#5B7C99] focus:bg-white transition-all appearance-none shadow-sm"
                >
                  <option value="corrective">Corrective (Breakdown)</option>
                  <option value="preventive">Preventive (Routine)</option>
                </select>
              </div>

              <div className="space-y-1.5 group">
                <label className="text-sm font-semibold text-[#5F6B76] flex items-center gap-2 group-focus-within:text-[#5B7C99] transition-colors">
                  <Layout size={14} /> Priority
                </label>
                <select
                  {...register('priority')}
                  className="w-full px-4 py-2.5 bg-[#F7F8F9] border border-[#ECEFF1] rounded-xl text-sm font-medium focus:outline-none focus:border-[#5B7C99] focus:bg-white transition-all appearance-none shadow-sm"
                >
                  <option value="0">Normal</option>
                  <option value="1">High</option>
                  <option value="2">Urgent</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-1.5 group">
                <label className="text-sm font-semibold text-[#5F6B76] flex items-center gap-2 group-focus-within:text-[#5B7C99] transition-colors">
                  <FileText size={14} /> Internal Description
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-[#F7F8F9] border border-[#ECEFF1] rounded-xl text-sm font-medium focus:outline-none focus:border-[#5B7C99] focus:bg-white transition-all resize-none shadow-sm"
                  placeholder="Provide technical details about the issue..."
                />
              </div>
            </div>
          </section>

          {/* Equipment & Assignment */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1 h-6 bg-[#5B7C99] rounded-full"></span>
              <h2 className="text-lg font-bold text-[#1C1F23]">Equipment & Assignment</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-1.5 group">
                <label className="text-sm font-semibold text-[#5F6B76] flex items-center gap-2 group-focus-within:text-[#5B7C99] transition-colors">
                  <Tag size={14} /> Equipment *
                </label>
                <select
                  {...register('equipmentId', { required: 'Equipment is required' })}
                  disabled={!!initialData?.equipmentId}
                  className="w-full px-4 py-2.5 bg-[#F7F8F9] border border-[#ECEFF1] rounded-xl text-sm font-medium focus:outline-none focus:border-[#5B7C99] focus:bg-white transition-all appearance-none shadow-sm disabled:opacity-50"
                >
                  <option value="">Select an asset...</option>
                  {equipment.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.name} ({eq.serialNumber})
                    </option>
                  ))}
                </select>
                {selectedEquipment && (
                  <div className="mt-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                    <p className="text-[11px] font-bold text-[#5B7C99] uppercase tracking-wider mb-1">Asset Location</p>
                    <p className="text-sm font-semibold text-[#1C1F23]">{selectedEquipment.location || 'Unknown'}</p>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 group">
                <label className="text-sm font-semibold text-[#5F6B76] flex items-center gap-2 group-focus-within:text-[#5B7C99] transition-colors">
                  <User size={14} /> Assign Technician
                </label>
                <select
                  {...register('technicianId')}
                  className="w-full px-4 py-2.5 bg-[#F7F8F9] border border-[#ECEFF1] rounded-xl text-sm font-medium focus:outline-none focus:border-[#5B7C99] focus:bg-white transition-all appearance-none shadow-sm"
                >
                  <option value="">Select Technician...</option>
                  {technicians.map((tech) => (
                    <option key={tech.id} value={tech.id}>{tech.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Schedule */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1 h-6 bg-[#5B7C99] rounded-full"></span>
              <h2 className="text-lg font-bold text-[#1C1F23]">Schedule & Planning</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-1.5 group">
                <label className="text-sm font-semibold text-[#5F6B76] flex items-center gap-2 group-focus-within:text-[#5B7C99] transition-colors">
                  <Calendar size={14} /> Scheduled Date
                </label>
                <input
                  type="date"
                  {...register('scheduledDate')}
                  className="w-full px-4 py-2.5 bg-[#F7F8F9] border border-[#ECEFF1] rounded-xl text-sm font-medium focus:outline-none focus:border-[#5B7C99] focus:bg-white transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5 group">
                <label className="text-sm font-semibold text-[#5F6B76] flex items-center gap-2 group-focus-within:text-[#5B7C99] transition-colors">
                  <Clock size={14} /> Estimated Duration (Hrs)
                </label>
                <input
                  type="number"
                  step="0.5"
                  {...register('duration')}
                  className="w-full px-4 py-2.5 bg-[#F7F8F9] border border-[#ECEFF1] rounded-xl text-sm font-medium focus:outline-none focus:border-[#5B7C99] focus:bg-white transition-all shadow-sm"
                  placeholder="0.0"
                />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-8 border-t border-[#ECEFF1]">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 font-bold text-[#5F6B76] hover:text-[#1C1F23] transition-colors flex items-center gap-2"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-10 py-3 bg-[#5B7C99] text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/10 hover:opacity-95 transition-all"
            >
              <Save size={20} />
              {initialData ? 'Save Changes' : 'Confirm Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
