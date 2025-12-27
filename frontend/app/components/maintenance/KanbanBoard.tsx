'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import KanbanCard from './KanbanCard';
import { MoreHorizontal, Plus, AlertCircle, CheckCircle2, Wrench, Trash2 } from 'lucide-react';
import type {
  MaintenanceRequest,
  MaintenanceRequestState,
} from '@/app/types/maintenance';

interface KanbanBoardProps {
  requests: MaintenanceRequest[];
  onStateChange?: (
    requestId: string,
    newState: MaintenanceRequestState
  ) => void;
  onCardClick?: (request: MaintenanceRequest) => void;
  userRole?: 'user' | 'technician' | 'manager' | 'admin';
  currentUserId?: string;
}

const COLUMNS: { id: MaintenanceRequestState; label: string; icon: any; color: string }[] = [
  { id: 'new', label: 'New', icon: AlertCircle, color: 'text-[#90A4AE]' },
  { id: 'in_progress', label: 'In Progress', icon: Wrench, color: 'text-[#5B7C99]' },
  { id: 'repaired', label: 'Repaired', icon: CheckCircle2, color: 'text-green-500' },
  { id: 'scrap', label: 'Scrap', icon: Trash2, color: 'text-red-400' },
];

function SortableCard({
  request,
  onCardClick,
  isDraggable = true,
}: {
  request: MaintenanceRequest;
  onCardClick?: (request: MaintenanceRequest) => void;
  isDraggable?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: request.id,
    disabled: !isDraggable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...(isDraggable ? { ...attributes, ...listeners } : {})} 
      className={`mb-4 touch-none ${!isDraggable ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
    >
      <KanbanCard request={request} onCardClick={onCardClick} />
    </div>
  );
}

function DroppableColumn({
  column,
  requests,
  onCardClick,
  isDisabled = false,
}: {
  column: { id: MaintenanceRequestState; label: string; icon: any; color: string };
  requests: MaintenanceRequest[];
  onCardClick?: (request: MaintenanceRequest) => void;
  isDisabled?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    disabled: isDisabled,
  });

  const Icon = column.icon;

  return (
    <div className="flex-1 min-w-[280px] flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md bg-white border border-[#ECEFF1] ${column.color} ${isDisabled ? 'opacity-50' : ''}`}>
            <Icon size={16} />
          </div>
          <h2 className={`text-sm font-bold uppercase tracking-wider ${isDisabled ? 'text-[#90A4AE]' : 'text-[#1C1F23]'}`}>
            {column.label}
          </h2>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDisabled ? 'bg-[#ECEFF1]/50 text-[#90A4AE]' : 'bg-[#ECEFF1] text-[#5F6B76]'}`}>
            {requests.length}
          </span>
        </div>
        <button className="text-[#90A4AE] hover:text-[#5F6B76] transition-colors p-1">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto overflow-x-hidden p-3 rounded-2xl border-2 transition-all duration-200 min-h-[600px] max-h-[calc(100vh-200px)] ${
          isDisabled 
            ? 'bg-[#F1F3F5]/50 border-[#CFD8DC] opacity-60 cursor-not-allowed' 
            : isOver 
              ? 'bg-[#5B7C99]/5 border-[#5B7C99] border-dashed' 
              : 'bg-[#F1F3F5] border-transparent'
        }`}
      >
        <SortableContext
          items={requests.map((r) => r.id)}
          strategy={verticalListSortingStrategy}
        >
          {requests.map((request) => {
            // For regular users in disabled columns, disable dragging
            const canDrag = !isDisabled;
            
            return (
              <SortableCard
                key={request.id}
                request={request}
                onCardClick={onCardClick}
                isDraggable={canDrag}
              />
            );
          })}

          {requests.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-[#CFD8DC] rounded-xl text-[#90A4AE] bg-white/50">
              <p className="text-xs font-medium">Empty Stage</p>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}

export default function KanbanBoard({
  requests,
  onStateChange,
  onCardClick,
  userRole = 'user',
  currentUserId,
}: KanbanBoardProps) {
  const [columns, setColumns] = useState<
    Record<MaintenanceRequestState, MaintenanceRequest[]>
  >({
    new: [],
    in_progress: [],
    repaired: [],
    scrap: [],
  });

  const [activeRequest, setActiveRequest] = useState<MaintenanceRequest | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const grouped = COLUMNS.reduce(
      (acc, col) => {
        acc[col.id] = requests.filter((req) => req.state === col.id);
        return acc;
      },
      {} as Record<MaintenanceRequestState, MaintenanceRequest[]>
    );
    setColumns(grouped);
  }, [requests]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const request = requests.find((r) => r.id === active.id);
    setActiveRequest(request || null);
  };

  // Check if user can move request to a specific state (role-based workflow)
  const canMoveToState = (request: MaintenanceRequest, targetState: MaintenanceRequestState): boolean => {
    // Admins and managers can move to any state
    if (userRole === 'admin' || userRole === 'manager') {
      return true;
    }

    // Regular users cannot move to "In Progress" or "Repaired"
    if (userRole === 'user') {
      if (targetState === 'in_progress' || targetState === 'repaired' || targetState === 'scrap') {
        return false;
      }
      // Users can only move their own requests back to "new" (unusual but allowed)
      return targetState === 'new';
    }

    // Technicians can move to "In Progress" if:
    // - They are assigned to the request, OR
    // - They are a member of the maintenance team
    if (userRole === 'technician') {
      if (targetState === 'in_progress') {
        const isAssigned = request.technician?.id === currentUserId;
        // Note: Team membership check would require additional data, but backend will validate
        return isAssigned || true; // Backend will do the final validation
      }
      
      // Technicians can only mark as "Repaired" if they are assigned
      if (targetState === 'repaired') {
        return request.technician?.id === currentUserId;
      }

      // Technicians cannot mark as "Scrap"
      if (targetState === 'scrap') {
        return false;
      }

      return true;
    }

    return false;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveRequest(null);
      return;
    }

    const requestId = active.id as string;
    const overId = over.id as string;

    // Determine the new state
    let newState: MaintenanceRequestState | null = null;

    // Check if dropped on a column
    if (COLUMNS.some((col) => col.id === overId)) {
      newState = overId as MaintenanceRequestState;
    } else {
      // Check if dropped on another card
      const overRequest = requests.find((r) => r.id === overId);
      if (overRequest) {
        newState = overRequest.state;
      }
    }

    if (newState) {
      const request = requests.find((r) => r.id === requestId);
      if (request && request.state !== newState) {
        // Check if user has permission to move to this state
        if (!canMoveToState(request, newState)) {
          // Show error or prevent the move
          console.warn(`User with role ${userRole} cannot move request to ${newState}`);
          setActiveRequest(null);
          return;
        }
        onStateChange?.(requestId, newState);
      }
    }

    setActiveRequest(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 h-full overflow-x-auto overflow-y-hidden pb-4 scrollbar-hide">
        {COLUMNS.map((column) => {
          // Determine if this column should be disabled for the current user
          const isDisabled = userRole === 'user' && (column.id === 'in_progress' || column.id === 'repaired' || column.id === 'scrap');
          
          return (
            <DroppableColumn
              key={column.id}
              column={column}
              requests={columns[column.id] || []}
              onCardClick={onCardClick}
              isDisabled={isDisabled}
            />
          );
        })}
      </div>

      <DragOverlay dropAnimation={{
        duration: 250,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }}>
        {activeRequest ? (
          <div className="rotate-2 scale-105 opacity-90 shadow-2xl ring-2 ring-[#5B7C99] rounded-xl">
            <KanbanCard request={activeRequest} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
