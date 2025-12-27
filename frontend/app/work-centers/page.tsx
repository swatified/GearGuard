'use client';

import { useState, useEffect } from 'react';
import { useRequireAuth } from '@/app/hooks/useRequireAuth';
import Link from 'next/link';
import DashboardShell from '@/app/components/layout/DashboardShell';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { getWorkCenters, deleteWorkCenter, type WorkCenter } from '@/app/services/workCenters';
import { useRouter } from 'next/navigation';

export default function WorkCentersPage() {
    const { loading: authLoading } = useRequireAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [workCenters, setWorkCenters] = useState<WorkCenter[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!authLoading) {
            loadWorkCenters();
        }
    }, [authLoading]);

    useEffect(() => {
        if (!authLoading) {
            const timeoutId = setTimeout(() => {
                loadWorkCenters();
            }, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [searchTerm]);

    const loadWorkCenters = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getWorkCenters({
                limit: 100,
                active: true,
                search: searchTerm || undefined,
            });
            setWorkCenters(response.data.workCenters);
        } catch (err: any) {
            const errorMessage = err?.message || err?.error || (typeof err === 'string' ? err : 'Failed to load work centers');
            console.error('Error loading work centers:', errorMessage, err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this work center?')) {
            return;
        }

        try {
            await deleteWorkCenter(id);
            loadWorkCenters();
        } catch (err: any) {
            console.error('Error deleting work center:', err);
            alert('Failed to delete work center');
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
                <div className="text-[#5F6B76]">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <DashboardShell>
                <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
                    <div className="text-center">
                        <p className="text-[#A14A4A] mb-4">{error}</p>
                        <button
                            onClick={loadWorkCenters}
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
                            <h1 className="text-2xl font-semibold text-[#1C1F23]">Work Center</h1>
                            <p className="text-[#5F6B76] text-sm mt-1">Manage work centers for maintenance operations</p>
                        </div>
                        <Link
                            href="/work-centers/new"
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#5B7C99] text-white rounded-lg hover:opacity-90 transition-opacity duration-150 text-sm font-medium"
                        >
                            <Plus size={18} />
                            New Work Center
                        </Link>
                    </div>

                    {/* Search */}
                    <div className="bg-white p-4 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] mb-8 border border-[#ECEFF1]">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#90A4AE]" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name or code..."
                                className="w-full pl-10 pr-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl border border-[#ECEFF1] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#F7F8F9] border-bottom border-[#ECEFF1]">
                                        <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider">Work Center</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider">Code</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider">Tag</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider">Alternative Workcenters</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider">Cost per hour</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider">Capacity Time Efficiency</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider">OEE Target</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {workCenters.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center text-[#90A4AE]">
                                                <div className="flex flex-col items-center">
                                                    <Search size={48} className="text-[#CFD8DC] mb-4" />
                                                    <h3 className="text-lg font-medium text-[#5F6B76]">No work centers found</h3>
                                                    <p className="text-sm text-[#90A4AE] mt-1">Create your first work center to get started</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        workCenters.map((wc) => (
                                            <tr key={wc.id} className="border-t border-[#ECEFF1] hover:bg-[#F7F8F9]/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-[#1C1F23]">{wc.name}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-[#5F6B76]">{wc.code || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-[#5F6B76]">{wc.tag || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-[#5F6B76]">
                                                    {wc.alternativeWorkcenters && wc.alternativeWorkcenters.length > 0
                                                        ? wc.alternativeWorkcenters.map(aw => aw.name).join(', ')
                                                        : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-[#5F6B76]">
                                                    {wc.costPerHour !== undefined ? wc.costPerHour.toFixed(2) : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-[#5F6B76]">
                                                    {wc.capacityTimeEfficiency !== undefined ? `${wc.capacityTimeEfficiency.toFixed(2)}%` : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-[#5F6B76]">
                                                    {wc.oeeTarget !== undefined ? `${wc.oeeTarget.toFixed(2)}%` : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => router.push(`/work-centers/${wc.id}`)}
                                                            className="p-1.5 text-[#5B7C99] hover:text-[#4A6B88] hover:bg-[#F7F8F9] rounded transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(wc.id)}
                                                            className="p-1.5 text-[#A14A4A] hover:text-[#8A3A3A] hover:bg-[#F7F8F9] rounded transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}

