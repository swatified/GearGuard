'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/app/hooks/useRequireAuth';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import DashboardShell from '@/app/components/layout/DashboardShell';
import { createWorkCenter, getWorkCenters, type WorkCenterFormData, type WorkCenter } from '@/app/services/workCenters';

export default function NewWorkCenterPage() {
    const { loading } = useRequireAuth();
    const router = useRouter();
    const [formData, setFormData] = useState<WorkCenterFormData>({
        name: '',
        code: '',
        tag: '',
        alternativeWorkcenters: [],
        cost: 0,
        rate: 0,
        allocation: 0,
        costPerHour: 0,
        capacityTime: 0,
        capacityTimeEfficiency: 100,
        oeeTarget: 0,
        active: true,
    });
    const [allWorkCenters, setAllWorkCenters] = useState<WorkCenter[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!loading) {
            loadWorkCenters();
        }
    }, [loading]);

    const loadWorkCenters = async () => {
        try {
            setLoadingData(true);
            const response = await getWorkCenters({ limit: 1000, active: true });
            setAllWorkCenters(response.data.workCenters);
        } catch (err: any) {
            console.error('Error loading work centers:', err);
        } finally {
            setLoadingData(false);
        }
    };

    if (loading || loadingData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
                <div className="text-[#5F6B76]">Loading...</div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const submitData: WorkCenterFormData = {
                name: formData.name,
                code: formData.code || undefined,
                tag: formData.tag || undefined,
                alternativeWorkcenters: formData.alternativeWorkcenters?.filter(id => id) || undefined,
                cost: formData.cost || undefined,
                rate: formData.rate || undefined,
                allocation: formData.allocation || undefined,
                costPerHour: formData.costPerHour || undefined,
                capacityTime: formData.capacityTime || undefined,
                capacityTimeEfficiency: formData.capacityTimeEfficiency || undefined,
                oeeTarget: formData.oeeTarget || undefined,
                active: formData.active,
            };

            await createWorkCenter(submitData);
            router.push('/work-centers');
        } catch (err: any) {
            const errorMessage = err?.message || err?.error || (typeof err === 'string' ? err : 'Failed to create work center');
            console.error('Error creating work center:', errorMessage, err);
            setError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (field: keyof WorkCenterFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAlternativeWorkcentersChange = (workCenterId: string, checked: boolean) => {
        setFormData(prev => {
            const current = prev.alternativeWorkcenters || [];
            if (checked) {
                return {
                    ...prev,
                    alternativeWorkcenters: [...current, workCenterId],
                };
            } else {
                return {
                    ...prev,
                    alternativeWorkcenters: current.filter(id => id !== workCenterId),
                };
            }
        });
    };

    return (
        <DashboardShell>
            <div className="min-h-screen bg-[#F7F8F9] px-6 pb-12 pt-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link
                            href="/work-centers"
                            className="p-2 hover:bg-white rounded-lg transition-colors"
                        >
                            <ArrowLeft size={20} className="text-[#5F6B76]" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-semibold text-[#1C1F23]">New Work Center</h1>
                            <p className="text-[#5F6B76] text-sm mt-1">Create a new work center for maintenance operations</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#ECEFF1] shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Basic Information */}
                            <div>
                                <h2 className="text-lg font-semibold text-[#1C1F23] mb-4">Basic Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#5F6B76] mb-2">
                                            Work Center Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                                            value={formData.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            placeholder="e.g., Assembly 1"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#5F6B76] mb-2">Code</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                                                value={formData.code}
                                                onChange={(e) => handleChange('code', e.target.value)}
                                                placeholder="Work center code"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[#5F6B76] mb-2">Tag</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                                                value={formData.tag}
                                                onChange={(e) => handleChange('tag', e.target.value)}
                                                placeholder="Tag"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#5F6B76] mb-2">Alternative Workcenters</label>
                                        <div className="max-h-48 overflow-y-auto border border-[#ECEFF1] rounded-lg p-3 bg-[#F7F8F9]">
                                            {allWorkCenters.length === 0 ? (
                                                <p className="text-sm text-[#90A4AE]">No other work centers available</p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {allWorkCenters.map((wc) => (
                                                        <label key={wc.id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.alternativeWorkcenters?.includes(wc.id) || false}
                                                                onChange={(e) => handleAlternativeWorkcentersChange(wc.id, e.target.checked)}
                                                                className="rounded border-[#ECEFF1] text-[#5B7C99] focus:ring-[#5B7C99]"
                                                            />
                                                            <span className="text-sm text-[#5F6B76]">{wc.name}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cost & Rate Information */}
                            <div>
                                <h2 className="text-lg font-semibold text-[#1C1F23] mb-4">Cost & Rate Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#5F6B76] mb-2">Cost</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                                            value={formData.cost || ''}
                                            onChange={(e) => handleChange('cost', e.target.value ? parseFloat(e.target.value) : 0)}
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#5F6B76] mb-2">Rate</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                                            value={formData.rate || ''}
                                            onChange={(e) => handleChange('rate', e.target.value ? parseFloat(e.target.value) : 0)}
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#5F6B76] mb-2">Allocation</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                                            value={formData.allocation || ''}
                                            onChange={(e) => handleChange('allocation', e.target.value ? parseFloat(e.target.value) : 0)}
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-[#5F6B76] mb-2">Cost per hour</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                                        value={formData.costPerHour || ''}
                                        onChange={(e) => handleChange('costPerHour', e.target.value ? parseFloat(e.target.value) : 0)}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Capacity & Efficiency */}
                            <div>
                                <h2 className="text-lg font-semibold text-[#1C1F23] mb-4">Capacity & Efficiency</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#5F6B76] mb-2">Capacity Time (Hrs/day)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                                            value={formData.capacityTime || ''}
                                            onChange={(e) => handleChange('capacityTime', e.target.value ? parseFloat(e.target.value) : 0)}
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#5F6B76] mb-2">Capacity Time Efficiency (%)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="100"
                                            className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                                            value={formData.capacityTimeEfficiency || ''}
                                            onChange={(e) => handleChange('capacityTimeEfficiency', e.target.value ? parseFloat(e.target.value) : 100)}
                                            placeholder="100.00"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#5F6B76] mb-2">OEE Target (%)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="100"
                                            className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                                            value={formData.oeeTarget || ''}
                                            onChange={(e) => handleChange('oeeTarget', e.target.value ? parseFloat(e.target.value) : 0)}
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-[#ECEFF1]">
                            <Link
                                href="/work-centers"
                                className="px-6 py-2 text-[#5F6B76] hover:text-[#1C1F23] transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex items-center gap-2 px-6 py-2 bg-[#5B7C99] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={18} />
                                {submitting ? 'Creating...' : 'Create Work Center'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardShell>
    );
}

