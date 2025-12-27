'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getActivityLogs, type ActivityLog } from '@/app/services/activityLogs';
import { Clock, User, Edit, ArrowRight, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface ActivityLogProps {
    requestId: string;
}

const getActionIcon = (action: string) => {
    switch (action) {
        case 'created':
            return <CheckCircle2 size={16} className="text-green-600" />;
        case 'stage_changed':
            return <ArrowRight size={16} className="text-blue-600" />;
        case 'technician_assigned':
        case 'technician_unassigned':
            return <User size={16} className="text-purple-600" />;
        case 'field_updated':
            return <Edit size={16} className="text-orange-600" />;
        case 'priority_changed':
            return <AlertCircle size={16} className="text-red-600" />;
        default:
            return <Clock size={16} className="text-gray-600" />;
    }
};

const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value instanceof Date) return format(new Date(value), 'MMM dd, yyyy HH:mm');
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
};

export default function ActivityLogComponent({ requestId }: ActivityLogProps) {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadActivityLogs();
    }, [requestId]);

    const loadActivityLogs = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getActivityLogs(requestId);
            setLogs(response.data);
        } catch (err: any) {
            const errorMessage = err?.message || err?.error || 'Failed to load activity logs';
            console.error('Error loading activity logs:', errorMessage, err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-[#5F6B76]">Loading activity logs...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
            </div>
        );
    }

    if (logs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock size={48} className="text-[#CFD8DC] mb-4" />
                <h3 className="text-lg font-medium text-[#5F6B76] mb-2">No activity yet</h3>
                <p className="text-sm text-[#90A4AE]">Activity logs will appear here as changes are made to this request.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#1C1F23]">Activity Log</h3>
                <button
                    onClick={loadActivityLogs}
                    className="text-sm text-[#5B7C99] hover:text-[#4A6B88] transition-colors"
                >
                    Refresh
                </button>
            </div>

            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#ECEFF1]" />

                <div className="space-y-6">
                    {logs.map((log, index) => (
                        <div key={log.id} className="relative flex gap-4">
                            {/* Icon */}
                            <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-[#ECEFF1]">
                                {getActionIcon(log.action)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-6">
                                <div className="bg-white rounded-lg border border-[#ECEFF1] p-4 shadow-sm">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-[#1C1F23]">
                                                {log.description}
                                            </p>
                                            {log.fieldName && log.oldValue !== undefined && log.newValue !== undefined && (
                                                <div className="mt-2 flex items-center gap-2 text-xs text-[#5F6B76]">
                                                    <span className="font-medium">{log.fieldName}:</span>
                                                    <span className="line-through text-[#90A4AE]">{formatValue(log.oldValue)}</span>
                                                    <ArrowRight size={12} className="text-[#90A4AE]" />
                                                    <span className="font-medium text-[#5B7C99]">{formatValue(log.newValue)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#ECEFF1]">
                                        <div className="flex items-center gap-2">
                                            {log.user && (
                                                <>
                                                    <User size={14} className="text-[#90A4AE]" />
                                                    <span className="text-xs text-[#5F6B76]">{log.user.name}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-[#90A4AE]">
                                            <Clock size={12} />
                                            <span>{format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

