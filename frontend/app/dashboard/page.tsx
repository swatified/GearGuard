'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import DashboardShell from '@/app/components/layout/DashboardShell';
import { DashboardService } from '@/app/services/dashboard';
import { Equipment, MaintenanceRequest } from '@/app/types/maintenance';
import {
    Wrench,
    CheckCircle2,
    Clock,
    AlertCircle,
    Plus,
    Box,
    Activity,
    MapPin
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
    const [tasks, setTasks] = useState<MaintenanceRequest[]>([]);
    const [loadingConfig, setLoadingConfig] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            setLoadingConfig(true);
            try {
                if (user.role === 'user') {
                    // Fetch data for standard employees
                    const [userEq, userReq] = await Promise.all([
                        DashboardService.getUserEquipment(user.id),
                        DashboardService.getUserRequests(user.id)
                    ]);
                    setEquipment(userEq);
                    setRequests(userReq);
                } else if (user.role === 'technician') {
                    // Fetch data for technicians
                    // For now using a hardcoded tech ID 'tech-1' matching the mock data, 
                    // in real app this would come from user profile linkage
                    const techTasks = await DashboardService.getTechnicianTasks('tech-1');
                    setTasks(techTasks);
                }
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoadingConfig(false);
            }
        };

        if (!authLoading) {
            fetchData();
        }
    }, [user, authLoading]);

    if (authLoading || loadingConfig) {
        return (
            <DashboardShell>
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5B7C99]"></div>
                </div>
            </DashboardShell>
        );
    }

    const renderEmployeeView = () => (
        <div className="space-y-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-[#5B7C99] to-[#37474F] rounded-2xl p-6 text-white shadow-lg">
                    <h3 className="text-lg font-semibold mb-2">Report an Issue</h3>
                    <p className="text-white/80 text-sm mb-6">Something not working? Submit a maintenance request instantly.</p>
                    <button className="bg-white text-[#37474F] px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/90 transition-colors w-full">
                        Create Request
                    </button>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-[#ECEFF1] shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Box size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-[#1C1F23]">My Equipment</h3>
                            <p className="text-[#5F6B76] text-sm">{equipment.length} Items Assigned</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {equipment.length === 0 && <p className="text-sm text-gray-400 italic">No equipment assigned.</p>}
                        {equipment.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-[#F7F8F9] rounded-lg">
                                <span className="text-sm font-medium text-[#1C1F23]">{item.name}</span>
                                <span className={`px - 2 py - 1 text - xs rounded - full font - medium ${item.status === 'operational' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    } `}>
                                    {item.status === 'operational' ? 'Good' : 'Issue'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-[#ECEFF1] shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                            <Activity size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-[#1C1F23]">Active Requests</h3>
                            <p className="text-[#5F6B76] text-sm">{requests.length} In Progress</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {requests.length === 0 && <p className="text-sm text-gray-400 italic">No active requests.</p>}
                        {requests.map(req => (
                            <div key={req.id} className="p-3 bg-[#F7F8F9] rounded-lg border-l-4 border-orange-500">
                                <p className="text-xs text-[#5F6B76] mb-1">#{req.id.toUpperCase()}</p>
                                <p className="text-sm font-medium text-[#1C1F23]">{req.subject}</p>
                                <p className="text-xs text-orange-600 mt-1 font-medium capitalize">{req.state.replace('_', ' ')}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTechnicianView = () => (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#1C1F23]">Technician Dashboard</h1>
                <div className="flex gap-3">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        On Duty
                    </span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Assigned', value: tasks.length.toString(), color: 'blue', icon: Wrench },
                    { label: 'In Progress', value: tasks.filter(t => t.state === 'in_progress').length.toString(), color: 'orange', icon: Clock },
                    { label: 'Critical', value: tasks.filter(t => t.priority === 'critical').length.toString(), color: 'red', icon: AlertCircle },
                    { label: 'Completed', value: '12', color: 'green', icon: CheckCircle2 }, // Mocked completed count
                ].map((stat) => (
                    <div key={stat.label} className="bg-white p-5 rounded-xl border border-[#ECEFF1] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                        <div className={`p - 2 w - fit rounded - lg bg - ${stat.color} -50 text - ${stat.color} -600 mb - 3`}>
                            <stat.icon size={20} />
                        </div>
                        <p className="text-2xl font-bold text-[#1C1F23]">{stat.value}</p>
                        <p className="text-sm text-[#5F6B76]">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Assigned Tasks */}
            <div>
                <h2 className="text-lg font-bold text-[#1C1F23] mb-4">Urgent Tasks</h2>
                <div className="bg-white rounded-2xl border border-[#ECEFF1] overflow-hidden">
                    <div className="divide-y divide-[#ECEFF1]">
                        {tasks.length === 0 && <div className="p-8 text-center text-gray-400">No urgent tasks assigned.</div>}
                        {tasks.map(task => (
                            <div key={task.id} className="p-4 hover:bg-[#F7F8F9] transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        {task.priority === 'critical' && (
                                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 mb-2">CRITICAL</span>
                                        )}
                                        {task.priority === 'high' && (
                                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 mb-2">HIGH</span>
                                        )}
                                        <h3 className="font-semibold text-[#1C1F23] group-hover:text-[#5B7C99] transition-colors">{task.subject}</h3>
                                    </div>
                                    <span className="text-xs font-mono text-[#90A4AE]">#{task.id.toUpperCase()}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-[#5F6B76]">
                                    <span className="flex items-center gap-1"><MapPin size={14} /> Zone B, Floor 1</span>
                                    <span className="flex items-center gap-1"><Clock size={14} /> Due: 2h</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderManagerView = () => (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-[#1C1F23]">Manager Overview</h1>
            <p>Global KPI view coming soon...</p>
            <Link href="/maintenance" className="text-[#5B7C99] hover:underline">Go to Maintenance Board</Link>
        </div>
    );

    return (
        <DashboardShell>
            <div className="min-h-screen bg-[#F7F8F9] p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-[#1C1F23]">Welcome back, {user?.name?.split(' ')[0]}!</h1>
                    <p className="text-[#5F6B76] mt-1">Here's what's happening with your <span className="lowercase">{user?.role || 'account'}</span> today.</p>
                </header>

                {user?.role === 'technician' && renderTechnicianView()}
                {user?.role === 'user' && renderEmployeeView()}
                {(user?.role === 'manager' || user?.role === 'admin') && renderManagerView()}
                {/* Fallback if role is missing or undefined */}
                {!user?.role && renderEmployeeView()}
            </div>
        </DashboardShell>
    );
}
