'use client';

import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns';
import type { MaintenanceRequest } from '@/app/types/maintenance';

interface CalendarViewProps {
  requests: MaintenanceRequest[];
  onDateClick?: (date: Date, requests: MaintenanceRequest[]) => void;
}

export default function CalendarView({
  requests,
  onDateClick,
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRequests, setSelectedRequests] = useState<MaintenanceRequest[]>([]);

  // Filter only preventive requests
  const preventiveRequests = useMemo(() => {
    return requests.filter((req) => req.requestType === 'preventive' && req.scheduledDate);
  }, [requests]);

  // Group requests by date
  const requestsByDate = useMemo(() => {
    const grouped: Record<string, MaintenanceRequest[]> = {};
    preventiveRequests.forEach((req) => {
      if (req.scheduledDate) {
        const dateKey = format(new Date(req.scheduledDate), 'yyyy-MM-dd');
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(req);
      }
    });
    return grouped;
  }, [preventiveRequests]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const handleDateClick = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayRequests = requestsByDate[dateKey] || [];
    setSelectedDate(date);
    setSelectedRequests(dayRequests);
    onDateClick?.(date, dayRequests);
  };

  const closeDrawer = () => {
    setSelectedDate(null);
    setSelectedRequests([]);
  };

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-[#F7F8F9] min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Calendar Header */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-[#1C1F23]">
              Preventive Maintenance Calendar
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-[#ECEFF1] rounded-lg transition-colors duration-150"
                aria-label="Previous month"
              >
                <svg
                  className="w-5 h-5 text-[#5F6B76]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h2 className="text-lg font-medium text-[#1C1F23] min-w-[200px] text-center">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-[#ECEFF1] rounded-lg transition-colors duration-150"
                aria-label="Next month"
              >
                <svg
                  className="w-5 h-5 text-[#5F6B76]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Week Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-[#5F6B76] py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayRequests = requestsByDate[dateKey] || [];
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(day)}
                  className={`min-h-[80px] p-2 rounded-lg border border-[#ECEFF1] hover:border-[#5B7C99] transition-colors duration-150 text-left ${
                    !isCurrentMonth
                      ? 'bg-[#F7F8F9] text-[#5F6B76] opacity-50'
                      : 'bg-white'
                  } ${isToday ? 'ring-2 ring-[#5B7C99]' : ''} ${
                    isSelected ? 'bg-[#ECEFF1]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span
                      className={`text-sm font-medium ${
                        isToday ? 'text-[#5B7C99]' : 'text-[#1C1F23]'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>
                    {dayRequests.length > 0 && (
                      <div className="flex gap-1">
                        {dayRequests.slice(0, 3).map((_, idx) => (
                          <div
                            key={idx}
                            className="w-2 h-2 rounded-full bg-[#C9A14A]"
                          />
                        ))}
                        {dayRequests.length > 3 && (
                          <span className="text-xs text-[#5F6B76]">
                            +{dayRequests.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Request Drawer */}
      {selectedDate && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={closeDrawer}
          />
          <div className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-out">
            <div className="h-full flex flex-col">
              {/* Drawer Header */}
              <div className="p-6 border-b border-[#ECEFF1] flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#1C1F23]">
                    {format(selectedDate, 'MMMM d, yyyy')}
                  </h2>
                  <p className="text-sm text-[#5F6B76] mt-1">
                    {selectedRequests.length} maintenance{' '}
                    {selectedRequests.length === 1 ? 'request' : 'requests'}
                  </p>
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-2 hover:bg-[#ECEFF1] rounded-lg transition-colors duration-150"
                  aria-label="Close drawer"
                >
                  <svg
                    className="w-5 h-5 text-[#5F6B76]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {selectedRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-[#5F6B76]">
                      No preventive maintenance scheduled for this date.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedRequests.map((request) => (
                      <div
                        key={request.id}
                        className="p-4 border border-[#ECEFF1] rounded-lg hover:border-[#5B7C99] transition-colors duration-150"
                      >
                        <h3 className="font-medium text-[#1C1F23] mb-2">
                          {request.subject}
                        </h3>
                        {request.equipment && (
                          <p className="text-sm text-[#5F6B76] mb-1">
                            {request.equipment.name}
                          </p>
                        )}
                        {request.technician && (
                          <p className="text-sm text-[#5F6B76]">
                            Technician: {request.technician.name}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

