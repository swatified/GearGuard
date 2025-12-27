'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/app/hooks/useRequireAuth';
import { ArrowLeft, Save, X, Calendar, MapPin, Tag, Users, User } from 'lucide-react';
import Link from 'next/link';
import DashboardShell from '@/app/components/layout/DashboardShell';

export default function NewEquipmentPage() {
    const { loading } = useRequireAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        serialNumber: '',
        purchaseDate: '',
        warrantyStartDate: '',
        warrantyEndDate: '',
        location: '',
        department: '',
        maintenanceTeamId: '',
        technicianId: '',
        note: '',
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
                <div className="text-[#5F6B76]">Loading...</div>
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would be an API call
        console.log('Registering equipment:', formData);
        router.push('/equipment');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <DashboardShell>
            <div className="min-h-screen bg-[#F7F8F9] px-6 pb-12 pt-8">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/equipment"
                                className="p-2 hover:bg-[#ECEFF1] rounded-full transition-colors text-[#5F6B76]"
                            >
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-semibold text-[#1C1F23]">Register New Equipment</h1>
                                <p className="text-[#5F6B76] text-sm mt-1">Add a new asset to the company database</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white p-8 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#ECEFF1]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Info */}
                                <div className="md:col-span-2 space-y-4">
                                    <h2 className="text-sm font-semibold text-[#90A4AE] uppercase tracking-wider mb-2">Basic Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#1C1F23] flex items-center gap-2">
                                                <Tag size={14} className="text-[#5B7C99]" />
                                                Equipment Name *
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                name="name"
                                                placeholder="e.g. CNC Machine 01"
                                                className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#1C1F23] flex items-center gap-2">
                                                <Tag size={14} className="text-[#5B7C99]" />
                                                Serial Number *
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                name="serialNumber"
                                                placeholder="e.g. CNC-2024-001"
                                                className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                                                value={formData.serialNumber}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Location & Dept */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#1C1F23] flex items-center gap-2">
                                        <MapPin size={14} className="text-[#5B7C99]" />
                                        Physical Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder="e.g. Building A, Floor 2"
                                        className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                                        value={formData.location}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#1C1F23] flex items-center gap-2">
                                        <Users size={14} className="text-[#5B7C99]" />
                                        Department
                                    </label>
                                    <select
                                        name="department"
                                        className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors appearance-none"
                                        value={formData.department}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Department</option>
                                        <option value="Production">Production</option>
                                        <option value="IT">IT</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Logistics">Logistics</option>
                                    </select>
                                </div>

                                {/* Dates & Warranty */}
                                <div className="md:col-span-2 border-t border-[#ECEFF1] pt-6 mt-2 space-y-4">
                                    <h2 className="text-sm font-semibold text-[#90A4AE] uppercase tracking-wider mb-2">Purchase & Warranty</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#1C1F23] flex items-center gap-2">
                                                <Calendar size={14} className="text-[#5B7C99]" />
                                                Purchase Date
                                            </label>
                                            <input
                                                type="date"
                                                name="purchaseDate"
                                                className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                                                value={formData.purchaseDate}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#1C1F23] flex items-center gap-2">
                                                <Calendar size={14} className="text-[#5B7C99]" />
                                                Warranty Start
                                            </label>
                                            <input
                                                type="date"
                                                name="warrantyStartDate"
                                                className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                                                value={formData.warrantyStartDate}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#1C1F23] flex items-center gap-2">
                                                <Calendar size={14} className="text-[#5B7C99]" />
                                                Warranty End
                                            </label>
                                            <input
                                                type="date"
                                                name="warrantyEndDate"
                                                className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                                                value={formData.warrantyEndDate}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Responsibility */}
                                <div className="md:col-span-2 border-t border-[#ECEFF1] pt-6 mt-2 space-y-4">
                                    <h2 className="text-sm font-semibold text-[#90A4AE] uppercase tracking-wider mb-2">Responsibility</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#1C1F23] flex items-center gap-2">
                                                <Users size={14} className="text-[#5B7C99]" />
                                                Maintenance Team
                                            </label>
                                            <select
                                                name="maintenanceTeamId"
                                                className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors appearance-none"
                                                value={formData.maintenanceTeamId}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Team</option>
                                                <option value="team1">Mechanics</option>
                                                <option value="team2">Electricians</option>
                                                <option value="team3">IT Support</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#1C1F23] flex items-center gap-2">
                                                <User size={14} className="text-[#5B7C99]" />
                                                Default Technician
                                            </label>
                                            <select
                                                name="technicianId"
                                                className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors appearance-none"
                                                value={formData.technicianId}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Technician</option>
                                                <option value="user1">John Doe</option>
                                                <option value="user2">Jane Smith</option>
                                                <option value="user3">Michael Chen</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-sm font-medium text-[#1C1F23]">Additional Notes</label>
                                    <textarea
                                        name="note"
                                        rows={4}
                                        placeholder="Any specific instructions or details..."
                                        className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors resize-none"
                                        value={formData.note}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-4 pb-12">
                            <Link
                                href="/equipment"
                                className="px-6 py-2.5 text-[#5F6B76] hover:text-[#1C1F23] transition-colors text-sm font-medium"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-8 py-2.5 bg-[#5B7C99] text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-sm"
                            >
                                <Save size={18} />
                                Save Asset
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardShell>
    );
}
