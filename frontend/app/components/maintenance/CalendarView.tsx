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
      <div className="max-w-7xl mx-auto">
        {/* Calendar Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-[#1C1F23]">
              Preventive Maintenance Calendar
            </h1>
            <div className="flex items-center gap-3">
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
              <h2 className="text-lg font-semibold text-[#1C1F23] min-w-[180px] text-center">
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
        </div>

        {/* Calendar Grid - Google Calendar Style */}
        <div className="bg-white rounded-lg shadow-sm border border-[#ECEFF1] overflow-hidden">
          {/* Week Day Headers */}
          <div className="grid grid-cols-7 border-b border-[#ECEFF1]">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-[#5F6B76] py-3 border-r border-[#ECEFF1] last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayRequests = requestsByDate[dateKey] || [];
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <div
                  key={index}
                  className={`min-h-[120px] border-r border-b border-[#ECEFF1] last:border-r-0 p-2 ${
                    !isCurrentMonth
                      ? 'bg-[#FAFAFA] text-[#9E9E9E]'
                      : 'bg-white hover:bg-[#F5F5F5]'
                  } ${isToday ? 'bg-blue-50' : ''} ${
                    isSelected ? 'bg-blue-100 ring-2 ring-blue-400' : ''
                  } transition-colors cursor-pointer`}
                  onClick={() => handleDateClick(day)}
                >
                  <div className="flex flex-col h-full">
                    {/* Date Number */}
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-sm font-medium ${
                          isToday
                            ? 'w-7 h-7 flex items-center justify-center rounded-full bg-blue-600 text-white'
                            : isSelected
                            ? 'text-blue-600 font-semibold'
                            : 'text-[#1C1F23]'
                        }`}
                      >
                        {format(day, 'd')}
                      </span>
                    </div>

                    {/* Events List */}
                    <div className="flex-1 space-y-1 overflow-hidden">
                      {dayRequests.slice(0, 3).map((request, idx) => (
                        <div
                          key={request.id}
                          className="text-xs px-2 py-1 rounded bg-yellow-400 text-yellow-900 font-medium truncate cursor-pointer hover:bg-yellow-500 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Could navigate to request detail here
                          }}
                          title={request.subject}
                        >
                          {request.subject}
                        </div>
                      ))}
                      {dayRequests.length > 3 && (
                        <div className="text-xs text-[#5F6B76] px-2 py-1 font-medium">
                          +{dayRequests.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Request Drawer - Google Calendar Style */}
      {selectedDate && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={closeDrawer}
          />
          <div className="fixed right-0 top-0 bottom-0 w-[420px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Drawer Header */}
              <div className="p-6 border-b border-[#ECEFF1] bg-[#F7F8F9]">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-[#1C1F23]">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </h2>
                  <button
                    onClick={closeDrawer}
                    className="p-2 hover:bg-white rounded-lg transition-colors duration-150"
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
                <p className="text-sm text-[#5F6B76]">
                  {selectedRequests.length} maintenance{' '}
                  {selectedRequests.length === 1 ? 'request' : 'requests'}
                </p>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {selectedRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-[#F7F8F9] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-[#90A4AE]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-[#5F6B76] font-medium">
                      No preventive maintenance scheduled
                    </p>
                    <p className="text-sm text-[#90A4AE] mt-1">
                      for this date
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedRequests.map((request) => (
                      <div
                        key={request.id}
                        className="p-4 border-l-4 border-yellow-400 bg-yellow-50 rounded-r-lg hover:shadow-md transition-all duration-150 cursor-pointer"
                        onClick={() => {
                          // Navigate to request detail
                          window.location.href = `/maintenance/${request.id}`;
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-[#1C1F23] text-sm">
                            {request.subject}
                          </h3>
                          <span className="text-xs px-2 py-1 bg-yellow-400 text-yellow-900 rounded font-medium">
                            Preventive
                          </span>
                        </div>
                        {request.equipment && (
                          <p className="text-sm text-[#5F6B76] mb-1 flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>
                            {request.equipment.name}
                          </p>
                        )}
                        {request.technician && (
                          <p className="text-sm text-[#5F6B76] flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            {request.technician.name}
                          </p>
                        )}
                        {request.scheduledDate && (
                          <p className="text-xs text-[#90A4AE] mt-2 flex items-center gap-1">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {format(new Date(request.scheduledDate), 'h:mm a')}
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

