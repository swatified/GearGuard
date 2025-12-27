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
}

const COLUMNS: { id: MaintenanceRequestState; label: string }[] = [
  { id: 'new', label: 'New' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'repaired', label: 'Repaired' },
  { id: 'scrap', label: 'Scrap' },
];

function SortableCard({
  request,
  onCardClick,
}: {
  request: MaintenanceRequest;
  onCardClick?: (request: MaintenanceRequest) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: request.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanCard request={request} onCardClick={onCardClick} />
    </div>
  );
}

function DroppableColumn({
  column,
  requests,
  onCardClick,
}: {
  column: { id: MaintenanceRequestState; label: string };
  requests: MaintenanceRequest[];
  onCardClick?: (request: MaintenanceRequest) => void;
}) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex-1 min-w-0">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-[#1C1F23]">{column.label}</h2>
        <span className="text-xs text-[#5F6B76]">{requests.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className="bg-[#ECEFF1] rounded-lg p-3 min-h-[400px]"
      >
        <SortableContext
          items={requests.map((r) => r.id)}
          strategy={verticalListSortingStrategy}
        >
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-[#5F6B76]">
                No requests in this stage
              </p>
            </div>
          ) : (
            requests.map((request) => (
              <SortableCard
                key={request.id}
                request={request}
                onCardClick={onCardClick}
              />
            ))
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
}: KanbanBoardProps) {
  const [columns, setColumns] = useState<
    Record<MaintenanceRequestState, MaintenanceRequest[]>
  >({
    new: [],
    in_progress: [],
    repaired: [],
    scrap: [],
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeRequest, setActiveRequest] =
    useState<MaintenanceRequest | null>(null);

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
    setActiveId(active.id as string);
    const request = requests.find((r) => r.id === active.id);
    setActiveRequest(request || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActiveRequest(null);
      return;
    }

    const requestId = active.id as string;
    const newState = over.id as MaintenanceRequestState;

    // Check if dropped on a column
    if (COLUMNS.some((col) => col.id === newState)) {
      const request = requests.find((r) => r.id === requestId);
      if (request && request.state !== newState) {
        onStateChange?.(requestId, newState);
      }
    }

    setActiveId(null);
    setActiveRequest(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 p-6 bg-[#F7F8F9] min-h-screen">
        {COLUMNS.map((column) => (
          <DroppableColumn
            key={column.id}
            column={column}
            requests={columns[column.id] || []}
            onCardClick={onCardClick}
          />
        ))}
      </div>
      <DragOverlay>
        {activeRequest ? (
          <div className="opacity-90">
            <KanbanCard request={activeRequest} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

