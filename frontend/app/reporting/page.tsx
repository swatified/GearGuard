'use client';

import { useState, useEffect } from 'react';
import { useRequireAuth } from '@/app/hooks/useRequireAuth';
import DashboardShell from '@/app/components/layout/DashboardShell';
import { getMaintenanceRequests, type MaintenanceRequest } from '@/app/services/maintenanceRequests';
import { format } from 'date-fns';
import { Search, Filter, Download, FileText, Calendar, User, Wrench, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

const getStateBadge = (state: string) => {
    const badges = {
        new: { label: 'New', className: 'bg-blue-50 text-blue-600', icon: AlertCircle },
        in_progress: { label: 'In Progress', className: 'bg-yellow-50 text-yellow-600', icon: Wrench },
        repaired: { label: 'Repaired', className: 'bg-green-50 text-green-600', icon: CheckCircle2 },
        scrap: { label: 'Scrap', className: 'bg-red-50 text-red-600', icon: XCircle }
    };
    return badges[state as keyof typeof badges] || badges.new;
};

const getPriorityBadge = (priority: string) => {
    const priorities = {
        '0': { label: 'Low', className: 'bg-gray-50 text-gray-600' },
        '1': { label: 'Normal', className: 'bg-blue-50 text-blue-600' },
        '2': { label: 'High', className: 'bg-orange-50 text-orange-600' },
        '3': { label: 'Urgent', className: 'bg-red-50 text-red-600' }
    };
    return priorities[priority as keyof typeof priorities] || priorities['1'];
};

export default function ReportingPage() {
    const { loading: authLoading } = useRequireAuth();
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'open' | 'completed' | 'overdue'>('all');
    const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
        from: '',
        to: ''
    });

    useEffect(() => {
        if (!authLoading) {
            loadReports();
        }
    }, [authLoading]);

    const loadReports = async () => {
        try {
            setLoading(true);
            setError(null);
            const filters: any = { limit: 1000 };
            
            if (dateRange.from) filters.scheduledDateFrom = dateRange.from;
            if (dateRange.to) filters.scheduledDateTo = dateRange.to;
            if (filter === 'open') filters.state = 'new,in_progress';
            if (filter === 'completed') filters.state = 'repaired';
            if (filter === 'overdue') filters.isOverdue = true;
            if (searchTerm) filters.search = searchTerm;

            const response = await getMaintenanceRequests(filters);
            setRequests(response.requests);
        } catch (err: any) {
            const errorMessage = err?.message || err?.error || (typeof err === 'string' ? err : 'Failed to load maintenance reports');
            console.error('Error loading reports:', errorMessage, err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const filteredRequests = requests.filter(request => {
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            return (
                request.name?.toLowerCase().includes(searchLower) ||
                request.subject?.toLowerCase().includes(searchLower) ||
                request.equipment?.name?.toLowerCase().includes(searchLower)
            );
        }
        return true;
    });

    if (authLoading || loading) {
        return (
            <DashboardShell>
                <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
                    <div className="text-[#5F6B76]">Loading reports...</div>
                </div>
            </DashboardShell>
        );
    }

    if (error) {
        return (
            <DashboardShell>
                <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
                    <div className="text-center">
                        <p className="text-[#A14A4A] mb-4">{error}</p>
                        <button
                            onClick={loadReports}
                            className="px-4 py-2 bg-[#5B7C99] text-white rounded-lg hover:opacity-90"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </DashboardShell>
        );
    }

    return (
        <DashboardShell>
            <div className="min-h-screen bg-[#F7F8F9] px-6 pb-12 pt-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-semibold text-[#1C1F23]">Maintenance Reports</h1>
                            <p className="text-[#5F6B76] text-sm mt-1">Track and analyze maintenance request processes</p>
                        </div>
                        <button
                            onClick={() => {
                                // TODO: Implement export functionality
                                alert('Export functionality coming soon');
                            }}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#5B7C99] text-white rounded-lg hover:opacity-90 transition-opacity duration-150 text-sm font-medium"
                        >
                            <Download size={18} />
                            Export Report
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] mb-8 border border-[#ECEFF1]">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#90A4AE]" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search requests..."
                                    className="w-full pl-10 pr-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="flex items-center gap-2">
                                <Filter size={16} className="text-[#90A4AE]" />
                                <select
                                    className="flex-1 px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value as any)}
                                >
                                    <option value="all">All Requests</option>
                                    <option value="open">Open Requests</option>
                                    <option value="completed">Completed</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                            </div>

                            {/* Date From */}
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-[#90A4AE]" />
                                <input
                                    type="date"
                                    className="flex-1 px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                                    value={dateRange.from}
                                    onChange={(e) => {
                                        setDateRange({ ...dateRange, from: e.target.value });
                                    }}
                                    placeholder="From Date"
                                />
                            </div>

                            {/* Date To */}
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-[#90A4AE]" />
                                <input
                                    type="date"
                                    className="flex-1 px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                                    value={dateRange.to}
                                    onChange={(e) => {
                                        setDateRange({ ...dateRange, to: e.target.value });
                                    }}
                                    placeholder="To Date"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Reports Table */}
                    <div className="bg-white rounded-xl border border-[#ECEFF1] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#F7F8F9] border-bottom border-[#ECEFF1]">
                                        <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider">Request ID</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider">Subject</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider">Equipment</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider">Priority</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider">Assigned To</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider">Request Date</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider">Scheduled Date</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider">Completed Date</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider">Duration</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider">Cost</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRequests.length === 0 ? (
                                        <tr>
                                            <td colSpan={12} className="px-6 py-12 text-center text-[#90A4AE]">
                                                <div className="flex flex-col items-center">
                                                    <FileText size={48} className="text-[#CFD8DC] mb-4" />
                                                    <h3 className="text-lg font-medium text-[#5F6B76]">No reports found</h3>
                                                    <p className="text-sm text-[#90A4AE] mt-1">Try adjusting your filters or search term</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredRequests.map((request) => {
                                            const stateBadge = getStateBadge(request.state || 'new');
                                            const priorityBadge = getPriorityBadge(request.priority || '1');
                                            const StateIcon = stateBadge.icon;

                                            return (
                                                <tr
                                                    key={request.id}
                                                    className="border-t border-[#ECEFF1] hover:bg-[#F7F8F9]/50 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <Link
                                                            href={`/maintenance/${request.id}`}
                                                            className="text-sm font-medium text-[#5B7C99] hover:text-[#4A6B88]"
                                                        >
                                                            {request.name || 'N/A'}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-[#1C1F23] font-medium">{request.subject}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-[#5F6B76]">
                                                            {request.equipment?.name || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase ${stateBadge.className}`}>
                                                            <StateIcon size={12} />
                                                            {stateBadge.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${priorityBadge.className}`}>
                                                            {priorityBadge.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2 text-sm text-[#5F6B76]">
                                                            {request.technician ? (
                                                                <>
                                                                    <User size={14} className="text-[#90A4AE]" />
                                                                    {request.technician.name}
                                                                </>
                                                            ) : (
                                                                <span className="text-[#90A4AE]">Unassigned</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-[#5F6B76]">
                                                            {request.dateRequest
                                                                ? format(new Date(request.dateRequest), 'MMM dd, yyyy')
                                                                : 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-[#5F6B76]">
                                                            {request.scheduledDate
                                                                ? format(new Date(request.scheduledDate), 'MMM dd, yyyy')
                                                                : 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-[#5F6B76]">
                                                            {request.dateEnd
                                                                ? format(new Date(request.dateEnd), 'MMM dd, yyyy')
                                                                : 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-[#5F6B76]">
                                                            {request.duration ? `${request.duration} hrs` : 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-[#5F6B76] font-medium">
                                                            {request.maintenanceCost ? `$${request.maintenanceCost.toFixed(2)}` : '$0.00'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Link
                                                            href={`/maintenance/${request.id}`}
                                                            className="text-sm text-[#5B7C99] hover:text-[#4A6B88] font-medium"
                                                        >
                                                            View Details
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-xl border border-[#ECEFF1] shadow-sm">
                            <div className="text-sm text-[#90A4AE] uppercase tracking-wider mb-2">Total Requests</div>
                            <div className="text-2xl font-bold text-[#1C1F23]">{filteredRequests.length}</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-[#ECEFF1] shadow-sm">
                            <div className="text-sm text-[#90A4AE] uppercase tracking-wider mb-2">Open Requests</div>
                            <div className="text-2xl font-bold text-yellow-600">
                                {filteredRequests.filter(r => r.state === 'new' || r.state === 'in_progress').length}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-[#ECEFF1] shadow-sm">
                            <div className="text-sm text-[#90A4AE] uppercase tracking-wider mb-2">Completed</div>
                            <div className="text-2xl font-bold text-green-600">
                                {filteredRequests.filter(r => r.state === 'repaired').length}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-[#ECEFF1] shadow-sm">
                            <div className="text-sm text-[#90A4AE] uppercase tracking-wider mb-2">Total Cost</div>
                            <div className="text-2xl font-bold text-[#1C1F23]">
                                ${filteredRequests.reduce((sum, r) => sum + (r.maintenanceCost || 0), 0).toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}

