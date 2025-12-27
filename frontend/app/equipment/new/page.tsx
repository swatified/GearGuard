'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/app/hooks/useRequireAuth';
import { ArrowLeft, Save, X, Calendar, MapPin, Tag, Users, User, Building2, Package, Factory, Settings } from 'lucide-react';
import Link from 'next/link';
import DashboardShell from '@/app/components/layout/DashboardShell';
import { createEquipment } from '@/app/services/equipment';
import { getDepartments } from '@/app/services/departments';
import { getEquipmentCategories } from '@/app/services/equipmentCategories';
import { getMaintenanceTeams } from '@/app/services/maintenanceTeams';

export default function NewEquipmentPage() {
    const { loading } = useRequireAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        serialNumber: '',
        company: '',
        model: '',
        manufacturer: '',
        technicalSpecifications: '',
        purchaseDate: '',
        warrantyStartDate: '',
        warrantyEndDate: '',
        location: '',
        departmentId: '',
        categoryId: '',
        employeeId: '',
        maintenanceTeamId: '',
        technicianId: '',
        workCenterId: '',
        note: '',
    });
    const [departments, setDepartments] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!loading) {
            loadFormData();
        }
    }, [loading]);

    const loadFormData = async () => {
        try {
            setLoadingData(true);
            const [deptsData, catsData, teamsData] = await Promise.all([
                getDepartments().catch(() => []),
                getEquipmentCategories().catch(() => []),
                getMaintenanceTeams({ active: true }).catch(() => ({ teams: [] }))
            ]);
            setDepartments(deptsData);
            setCategories(catsData);
            setTeams(teamsData.teams || []);
        } catch (err: any) {
            console.error('Error loading form data:', err);
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
            const submitData: any = {
                name: formData.name,
                serialNumber: formData.serialNumber,
                maintenanceTeamId: formData.maintenanceTeamId,
            };

            if (formData.company) submitData.company = formData.company;
            if (formData.model) submitData.model = formData.model;
            if (formData.manufacturer) submitData.manufacturer = formData.manufacturer;
            if (formData.technicalSpecifications) submitData.technicalSpecifications = formData.technicalSpecifications;
            if (formData.purchaseDate) submitData.purchaseDate = formData.purchaseDate;
            if (formData.warrantyStartDate) submitData.warrantyStartDate = formData.warrantyStartDate;
            if (formData.warrantyEndDate) submitData.warrantyEndDate = formData.warrantyEndDate;
            if (formData.location) submitData.location = formData.location;
            if (formData.departmentId) submitData.departmentId = formData.departmentId;
            if (formData.categoryId) submitData.categoryId = formData.categoryId;
            if (formData.employeeId) submitData.employeeId = formData.employeeId;
            if (formData.technicianId) submitData.technicianId = formData.technicianId;
            if (formData.workCenterId) submitData.workCenterId = formData.workCenterId;
            if (formData.note) submitData.note = formData.note;

            await createEquipment(submitData);
            router.push('/equipment');
        } catch (err: any) {
            const errorMessage = err?.message || err?.error || 'Failed to create equipment';
            setError(errorMessage);
            console.error('Error creating equipment:', err);
        } finally {
            setSubmitting(false);
        }
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
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#1C1F23] flex items-center gap-2">
                                                <Building2 size={14} className="text-[#5B7C99]" />
                                                Company
                                            </label>
                                            <input
                                                type="text"
                                                name="company"
                                                placeholder="e.g. Adani Group"
                                                className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                                                value={formData.company}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#1C1F23] flex items-center gap-2">
                                                <Package size={14} className="text-[#5B7C99]" />
                                                Model
                                            </label>
                                            <input
                                                type="text"
                                                name="model"
                                                placeholder="e.g. Model XYZ-2024"
                                                className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                                                value={formData.model}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#1C1F23] flex items-center gap-2">
                                                <Factory size={14} className="text-[#5B7C99]" />
                                                Manufacturer
                                            </label>
                                            <input
                                                type="text"
                                                name="manufacturer"
                                                placeholder="e.g. Siemens, Caterpillar"
                                                className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                                                value={formData.manufacturer}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#1C1F23] flex items-center gap-2">
                                                <Tag size={14} className="text-[#5B7C99]" />
                                                Equipment Category
                                            </label>
                                            <select
                                                name="categoryId"
                                                className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors appearance-none"
                                                value={formData.categoryId}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[#1C1F23] flex items-center gap-2">
                                            <Settings size={14} className="text-[#5B7C99]" />
                                            Technical Specifications
                                        </label>
                                        <textarea
                                            name="technicalSpecifications"
                                            rows={3}
                                            placeholder="Enter technical specifications, specifications, or other details..."
                                            className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors resize-none"
                                            value={formData.technicalSpecifications}
                                            onChange={handleChange}
                                        />
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
                                        name="departmentId"
                                        className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors appearance-none"
                                        value={formData.departmentId}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map((dept) => (
                                            <option key={dept.id} value={dept.id}>
                                                {dept.name}
                                            </option>
                                        ))}
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
                                                Maintenance Team *
                                            </label>
                                            <select
                                                required
                                                name="maintenanceTeamId"
                                                className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors appearance-none"
                                                value={formData.maintenanceTeamId}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Team</option>
                                                {teams.map((team) => (
                                                    <option key={team.id} value={team.id}>
                                                        {team.name}
                                                    </option>
                                                ))}
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
                                                {(teams
                                                    .find(t => t.id === formData.maintenanceTeamId)
                                                    ?.members || []).map((member: any) => (
                                                        <option key={member.id} value={member.id}>
                                                            {member.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#1C1F23] flex items-center gap-2">
                                                <Building2 size={14} className="text-[#5B7C99]" />
                                                Work Center
                                            </label>
                                            <select
                                                name="workCenterId"
                                                className="w-full px-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors appearance-none"
                                                value={formData.workCenterId}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Work Center (Coming Soon)</option>
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

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

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
                                disabled={submitting}
                                className="flex items-center gap-2 px-8 py-2.5 bg-[#5B7C99] text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={18} />
                                {submitting ? 'Saving...' : 'Save Asset'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardShell>
    );
}
