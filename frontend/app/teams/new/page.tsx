'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/app/hooks/useRequireAuth';
import { ArrowLeft, Save, X, Users, User, Shield, Info, Check } from 'lucide-react';
import Link from 'next/link';
import DashboardShell from '@/app/components/layout/DashboardShell';

// Mock users for member selection
const mockUsers = [
    { id: 'u1', name: 'John Doe', role: 'technician' },
    { id: 'u2', name: 'Jane Smith', role: 'technician' },
    { id: 'u3', name: 'Michael Chen', role: 'technician' },
    { id: 'u4', name: 'Robert Wilson', role: 'technician' },
    { id: 'u5', name: 'Sarah Jones', role: 'technician' },
    { id: 'u6', name: 'David Lee', role: 'manager' },
];

export default function NewTeamPage() {
    const { loading } = useRequireAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        active: true,
    });
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
                <div className="text-[#5F6B76]">Loading...</div>
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Creating team:', { ...formData, members: selectedMembers });
        router.push('/teams');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleMember = (userId: string) => {
        setSelectedMembers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    return (
        <DashboardShell>
            <div className="min-h-screen bg-[#F7F8F9] px-6 pb-12 pt-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-10">
                        <Link
                            href="/teams"
                            className="p-2.5 hover:bg-[#ECEFF1] rounded-full transition-colors text-[#5F6B76] border border-transparent hover:border-[#ECEFF1]"
                        >
                            <ArrowLeft size={22} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-[#1C1F23]">Form New Team</h1>
                            <p className="text-[#5F6B76] text-sm mt-1 flex items-center gap-2 font-medium">
                                <Shield size={14} className="text-[#5B7C99]" />
                                Define a specialized maintenance group
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white p-8 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#ECEFF1]">
                                <h2 className="text-xl font-bold text-[#1C1F23] mb-8 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-[#5B7C99] rounded-full"></span>
                                    Team Identity
                                </h2>

                                <div className="space-y-6">
                                    <div className="space-y-2 group">
                                        <label className="text-sm font-bold text-[#5F6B76] group-focus-within:text-[#5B7C99] transition-colors">Team Name *</label>
                                        <input
                                            required
                                            type="text"
                                            name="name"
                                            placeholder="e.g. Electricians, Precision Mechanics..."
                                            className="w-full px-5 py-3.5 bg-[#F7F8F9] border border-[#ECEFF1] rounded-2xl text-sm font-semibold focus:outline-none focus:border-[#5B7C99] focus:bg-white transition-all shadow-inner"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="space-y-2 group">
                                        <label className="text-sm font-bold text-[#5F6B76] group-focus-within:text-[#5B7C99] transition-colors">Focus & specialty</label>
                                        <textarea
                                            name="description"
                                            rows={4}
                                            placeholder="Describe the team's primary responsibilities..."
                                            className="w-full px-5 py-3.5 bg-[#F7F8F9] border border-[#ECEFF1] rounded-2xl text-sm font-semibold focus:outline-none focus:border-[#5B7C99] focus:bg-white transition-all shadow-inner resize-none"
                                            value={formData.description}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#ECEFF1]">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-bold text-[#1C1F23] flex items-center gap-2">
                                        <span className="w-1.5 h-6 bg-[#5B7C99] rounded-full"></span>
                                        Member Assignments
                                    </h2>
                                    <span className="text-xs font-bold text-[#90A4AE] bg-[#F7F8F9] px-3 py-1 rounded-full uppercase tracking-widest">
                                        {selectedMembers.length} Selected
                                    </span>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                                    {mockUsers.map((user) => (
                                        <button
                                            key={user.id}
                                            type="button"
                                            onClick={() => toggleMember(user.id)}
                                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${selectedMembers.includes(user.id)
                                                ? 'border-[#5B7C99] bg-blue-50/50'
                                                : 'border-[#F1F3F5] bg-white hover:border-[#ECEFF1]'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm ${selectedMembers.includes(user.id) ? 'bg-[#5B7C99] text-white' : 'bg-[#ECEFF1] text-[#5F6B76]'
                                                }`}>
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-[#1C1F23]">{user.name}</p>
                                                <p className="text-[10px] uppercase font-bold text-[#90A4AE] tracking-widest">{user.role}</p>
                                            </div>
                                            {selectedMembers.includes(user.id) && (
                                                <div className="w-5 h-5 bg-[#5B7C99] rounded-full flex items-center justify-center text-white">
                                                    <Check size={12} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar / Options */}
                        <div className="space-y-8">
                            <div className="bg-[#1C1F23] p-8 rounded-3xl text-white shadow-xl shadow-gray-200">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-[#5B7C99]">
                                    <Info size={18} />
                                    Guidelines
                                </h3>
                                <ul className="space-y-4 text-sm text-gray-400 font-medium">
                                    <li className="flex gap-3">
                                        <div className="w-1 h-1 rounded-full bg-[#5B7C99] mt-2 flex-shrink-0"></div>
                                        Teams should be organized by technical expertise.
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="w-1 h-1 rounded-full bg-[#5B7C99] mt-2 flex-shrink-0"></div>
                                        Members will see requests assigned to their group.
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="w-1 h-1 rounded-full bg-[#5B7C99] mt-2 flex-shrink-0"></div>
                                        Technicians can belong to multiple teams.
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white p-8 rounded-3xl border border-[#ECEFF1] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#5B7C99] text-white rounded-2xl hover:opacity-95 transition-all shadow-lg shadow-blue-500/10 font-bold mb-4"
                                >
                                    <Save size={20} />
                                    Initialize Team
                                </button>
                                <Link
                                    href="/teams"
                                    className="w-full flex items-center justify-center px-8 py-4 text-[#5F6B76] hover:text-[#1C1F23] font-bold text-sm transition-colors"
                                >
                                    Discard Changes
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardShell>
    );
}
