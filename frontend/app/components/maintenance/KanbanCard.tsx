'use client';

import { format } from 'date-fns';
import type { MaintenanceRequest } from '@/app/services/maintenanceRequests';
import { Calendar, User as UserIcon, AlertCircle, Clock } from 'lucide-react';

interface KanbanCardProps {
  request: MaintenanceRequest;
  onCardClick?: (request: MaintenanceRequest) => void;
}

export default function KanbanCard({ request, onCardClick }: KanbanCardProps) {
  const isOverdue = request.isOverdue || false;
  const scheduledDate = request.scheduledDate
    ? format(new Date(request.scheduledDate), 'MMM d, yyyy')
    : null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getTypeStyle = (type: string) => {
    return type === 'corrective'
      ? 'bg-amber-50 text-amber-600 border-amber-100'
      : 'bg-blue-50 text-blue-600 border-blue-100';
  };

  return (
    <div
      className={`group bg-white rounded-xl p-5 cursor-grab active:cursor-grabbing border border-[#ECEFF1] hover:border-[#5B7C99]/30 hover:shadow-xl transition-all duration-300 relative overflow-hidden ${isOverdue ? 'ring-1 ring-red-100' : ''
        }`}
      onClick={() => onCardClick?.(request)}
    >
      {isOverdue && (
        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
      )}

      {/* Type Tag */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getTypeStyle(request.requestType)}`}>
          {request.requestType}
        </span>
        <span className="text-[10px] font-bold text-[#90A4AE] uppercase tracking-tighter">
          {request.name}
        </span>
      </div>

      {/* Subject */}
      <h3 className="text-sm font-bold text-[#1C1F23] mb-3 line-clamp-2 leading-snug group-hover:text-[#5B7C99] transition-colors">
        {request.subject}
      </h3>

      {/* Equipment Info */}
      {request.equipment && (
        <div className="flex items-center gap-2 mb-4 p-2 bg-[#F7F8F9] rounded-lg border border-[#ECEFF1]">
          <div className="w-5 h-5 bg-white rounded shadow-sm flex items-center justify-center text-[#5F6B76]">
            <Clock size={10} />
          </div>
          <span className="text-[11px] font-semibold text-[#5F6B76] truncate">
            {request.equipment.name}
          </span>
        </div>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-3 border-t border-[#F1F3F5] mt-auto">
        <div className="flex items-center gap-3">
          {scheduledDate && (
            <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase transition-colors ${isOverdue ? 'text-red-500' : 'text-[#90A4AE]'}`}>
              {isOverdue ? <AlertCircle size={10} /> : <Calendar size={10} />}
              {scheduledDate}
            </div>
          )}
        </div>

        {request.technician && (
          <div
            className="w-6 h-6 rounded-full bg-[#5B7C99] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-[#ECEFF1]"
            title={request.technician.name}
          >
            {request.technician.avatar ? (
              <img
                src={request.technician.avatar}
                alt={request.technician.name}
                className="w-full h-full rounded-full"
              />
            ) : (
              getInitials(request.technician.name)
            )}
          </div>
        )}
      </div>
    </div>
  );
}
