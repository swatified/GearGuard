'use client';

import { useState } from 'react';
import { useRequireAuth } from '@/app/hooks/useRequireAuth';
import Link from 'next/link';
import DashboardShell from '@/app/components/layout/DashboardShell';
import {
    Users,
    Plus,
    Search,
    ChevronRight,
    MoreHorizontal,
    User as UserIcon,
    Shield,
    Activity,
    ArrowRight
} from 'lucide-react';

// Mock data for Maintenance Teams
const mockTeams = [
    {
        id: 'team1',
        name: 'Mechanics',
        active: true,
        memberCount: 5,
        requestCount: 15,
        members: [
            { id: 'u1', name: 'John Doe', avatar: null },
            { id: 'u2', name: 'Jane Smith', avatar: null },
        ],
        description: 'Hardware maintenance and engine repairs'
    },
    {
        id: 'team2',
        name: 'Electricians',
        active: true,
        memberCount: 3,
        requestCount: 8,
        members: [
            { id: 'u3', name: 'Michael Chen', avatar: null },
        ],
        description: 'Electrical systems and wiring'
    },
    {
        id: 'team3',
        name: 'IT Support',
        active: true,
        memberCount: 4,
        requestCount: 12,
        members: [
            { id: 'u4', name: 'Robert Wilson', avatar: null },
            { id: 'u5', name: 'Sarah Jones', avatar: null },
        ],
        description: 'Software and digital equipment maintenance'
    }
];

export default function TeamsPage() {
    const { loading } = useRequireAuth();
    const [searchTerm, setSearchTerm] = useState('');

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
                <div className="text-[#5F6B76]">Loading...</div>
            </div>
        );
    }

    const filteredTeams = mockTeams.filter(team =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardShell>
            <div className="min-h-screen bg-[#F7F8F9] px-6 pb-12 pt-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-3xl font-bold text-[#1C1F23]">Specialized Teams</h1>
                            <p className="text-[#5F6B76] text-sm mt-1.5 flex items-center gap-2">
                                <Shield size={14} className="text-[#5B7C99]" />
                                Manage maintenance groups and technician assignments
                            </p>
                        </div>
                        <Link
                            href="/teams/new"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#5B7C99] text-white rounded-xl hover:opacity-90 transition-all shadow-lg shadow-blue-500/10 font-bold"
                        >
                            <Plus size={20} />
                            Form New Team
                        </Link>
                    </div>

                    {/* Search & Toolbelt */}
                    <div className="bg-white p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#ECEFF1] mb-10 flex flex-col md:flex-row items-center gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#90A4AE] group-focus-within:text-[#5B7C99] transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Filter teams by name or specialty..."
                                className="w-full pl-12 pr-4 py-3 bg-[#F7F8F9] border border-[#ECEFF1] rounded-xl text-sm font-medium focus:outline-none focus:border-[#5B7C99] focus:bg-white transition-all shadow-inner"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Teams Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTeams.map((team) => (
                            <div
                                key={team.id}
                                className="bg-white rounded-2xl border border-[#ECEFF1] shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-[#5B7C99]/20 transition-all group relative overflow-hidden flex flex-col"
                            >
                                <div className="p-8 pb-4">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-[#F7F8F9] rounded-xl text-[#5B7C99] border border-[#ECEFF1] group-hover:bg-[#5B7C99] group-hover:text-white transition-all duration-300">
                                            <Users size={24} />
                                        </div>
                                        <button className="text-[#90A4AE] hover:text-[#5B7C99] p-1 transition-colors">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </div>

                                    <h3 className="text-xl font-bold text-[#1C1F23] mb-2">{team.name}</h3>
                                    <p className="text-sm text-[#5F6B76] leading-relaxed line-clamp-2 min-h-[40px]">
                                        {team.description}
                                    </p>
                                </div>

                                <div className="px-8 py-6 bg-[#F7F8F9]/50 border-t border-[#ECEFF1] mt-auto">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] uppercase font-bold text-[#90A4AE] tracking-widest flex items-center gap-1.5">
                                                <UserIcon size={10} /> Members
                                            </span>
                                            <span className="text-lg font-bold text-[#1C1F23]">{team.memberCount}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 text-right">
                                            <span className="text-[10px] uppercase font-bold text-[#90A4AE] tracking-widest flex items-center gap-1.5 justify-end">
                                                <Activity size={10} /> Active Reqs
                                            </span>
                                            <span className="text-lg font-bold text-[#5B7C99]">{team.requestCount}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex -space-x-3">
                                            {team.members.map((member) => (
                                                <div
                                                    key={member.id}
                                                    className="w-8 h-8 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-[#5B7C99] ring-1 ring-[#ECEFF1]"
                                                    title={member.name}
                                                >
                                                    {member.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                            ))}
                                            {team.memberCount > team.members.length && (
                                                <div className="w-8 h-8 rounded-full bg-[#ECEFF1] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#5F6B76]">
                                                    +{team.memberCount - team.members.length}
                                                </div>
                                            )}
                                        </div>
                                        <Link
                                            href={`/teams/${team.id}`}
                                            className="flex items-center gap-1.5 text-sm font-bold text-[#5B7C99] hover:gap-2 transition-all group/link"
                                        >
                                            View Details
                                            <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredTeams.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-[#CFD8DC]">
                            <Users size={64} className="text-[#CFD8DC] mb-6 animate-pulse" />
                            <h3 className="text-xl font-bold text-[#5F6B76]">No teams matching your search</h3>
                            <p className="text-sm text-[#90A4AE] mt-2">Try searching for specialized groups like 'IT' or 'Mechanics'</p>
                            <button
                                onClick={() => setSearchTerm('')}
                                className="mt-6 font-bold text-[#5B7C99] hover:underline"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </DashboardShell>
    );
}
