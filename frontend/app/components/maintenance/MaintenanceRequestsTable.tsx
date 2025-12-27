'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import type { MaintenanceRequest } from '@/app/services/maintenanceRequests';
import { Search, Filter, ChevronDown, AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface MaintenanceRequestsTableProps {
    requests: MaintenanceRequest[];
    onRequestClick?: (request: MaintenanceRequest) => void;
}

const getStateBadge = (state: string) => {
    const badges = {
        new: { label: 'New', className: 'bg-blue-50 text-blue-600', icon: Clock },
        in_progress: { label: 'In Progress', className: 'bg-yellow-50 text-yellow-600', icon: AlertCircle },
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

export default function MaintenanceRequestsTable({ requests, onRequestClick }: MaintenanceRequestsTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'open' | 'overdue'>('all');

    const filteredRequests = requests.filter(request => {
        // Search filter
        const matchesSearch = !searchTerm || 
            request.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.equipment?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        // Status filter
        let matchesFilter = true;
        if (filter === 'open') {
            matchesFilter = request.state === 'new' || request.state === 'in_progress';
        } else if (filter === 'overdue') {
            matchesFilter = request.isOverdue === true;
        }

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="bg-white rounded-xl border border-[#ECEFF1] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            {/* Filters and Search */}
            <div className="p-4 border-b border-[#ECEFF1] flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#90A4AE]" size={18} />
                    <input
                        type="text"
                        placeholder="Search by request ID, subject, or equipment..."
                        className="w-full pl-10 pr-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-[#90A4AE]" />
                    <div className="flex items-center bg-[#F7F8F9] rounded-lg border border-[#ECEFF1]">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${
                                filter === 'all'
                                    ? 'bg-white text-[#5B7C99] shadow-sm'
                                    : 'text-[#5F6B76] hover:text-[#1C1F23]'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('open')}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${
                                filter === 'open'
                                    ? 'bg-white text-[#5B7C99] shadow-sm'
                                    : 'text-[#5F6B76] hover:text-[#1C1F23]'
                            }`}
                        >
                            Open
                        </button>
                        <button
                            onClick={() => setFilter('overdue')}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${
                                filter === 'overdue'
                                    ? 'bg-white text-[#5B7C99] shadow-sm'
                                    : 'text-[#5F6B76] hover:text-[#1C1F23]'
                            }`}
                        >
                            Overdue
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
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
                            <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider">Due Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-[#90A4AE]">
                                    <div className="flex flex-col items-center">
                                        <Search size={48} className="text-[#CFD8DC] mb-4" />
                                        <h3 className="text-lg font-medium text-[#5F6B76]">No requests found</h3>
                                        <p className="text-sm text-[#90A4AE] mt-1">Try adjusting your search or filters</p>
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
                                        className="border-t border-[#ECEFF1] hover:bg-[#F7F8F9]/50 transition-colors cursor-pointer"
                                        onClick={() => onRequestClick?.(request)}
                                    >
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/maintenance/${request.id}`}
                                                className="text-sm font-medium text-[#5B7C99] hover:text-[#4A6B88]"
                                                onClick={(e) => e.stopPropagation()}
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
                                            <div className="text-sm text-[#5F6B76]">
                                                {request.technician?.name || 'Unassigned'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-[#5F6B76]">
                                                {request.scheduledDate
                                                    ? format(new Date(request.scheduledDate), 'MMM dd, yyyy')
                                                    : 'N/A'}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

