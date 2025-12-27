'use client';

import { format } from 'date-fns';
import type { MaintenanceRequest } from '@/app/types/maintenance';

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

  return (
    <div
      className={`bg-white rounded-lg p-4 mb-3 cursor-pointer hover:shadow-[0_2px_4px_rgba(0,0,0,0.08)] transition-shadow duration-150 ${
        isOverdue ? 'border-l-2 border-[#A14A4A]' : ''
      }`}
      onClick={() => onCardClick?.(request)}
      style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}
    >
      {/* Header with subject and technician */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-[#1C1F23] font-medium text-sm flex-1 pr-2">
          {request.subject}
        </h3>
        {request.technician && (
          <div
            className="w-6 h-6 rounded-full bg-[#5B7C99] text-white text-xs flex items-center justify-center flex-shrink-0"
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

      {/* Equipment name */}
      {request.equipment && (
        <p className="text-[#5F6B76] text-xs mb-2">{request.equipment.name}</p>
      )}

      {/* Due date */}
      {scheduledDate && (
        <div className="flex items-center gap-1">
          <span
            className={`text-xs ${
              isOverdue ? 'text-[#A14A4A]' : 'text-[#5F6B76]'
            }`}
          >
            {isOverdue ? 'Overdue: ' : ''}
            {scheduledDate}
          </span>
        </div>
      )}
    </div>
  );
}

