'use client';

import { useState } from 'react';
import { useRequireAuth } from '@/app/hooks/useRequireAuth';
import Link from 'next/link';
import DashboardShell from '@/app/components/layout/DashboardShell';
import { Search, Plus, Filter, LayoutGrid, List, ChevronRight } from 'lucide-react';

// Mock data for Equipment
const mockEquipment = [
    {
        id: 'eq1',
        name: 'CNC Machine 01',
        serialNumber: 'CNC-001-2024',
        department: 'Production',
        assignedTo: 'John Doe',
        location: 'Building A, Floor 2',
        status: 'active',
        lastMaintenance: '2024-02-15',
    },
    {
        id: 'eq2',
        name: 'Drill Press 05',
        serialNumber: 'DP-005-2024',
        department: 'Production',
        assignedTo: 'Jane Smith',
        location: 'Building A, Floor 1',
        status: 'active',
        lastMaintenance: '2024-02-10',
    },
    {
        id: 'eq3',
        name: 'Laptop Dell XPS 15',
        serialNumber: 'DLX-2024-001',
        department: 'IT',
        assignedTo: 'Michael Chen',
        location: 'IT Office, Floor 3',
        status: 'active',
        lastMaintenance: '2024-01-20',
    },
    {
        id: 'eq4',
        name: 'Conveyor Belt A',
        serialNumber: 'CB-A-2024',
        department: 'Logistics',
        assignedTo: 'Robert Wilson',
        location: 'Warehouse, Floor 1',
        status: 'inactive',
        lastMaintenance: '2024-02-05',
    },
];

export default function EquipmentPage() {
    const { loading } = useRequireAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [groupBy, setGroupBy] = useState<'none' | 'department' | 'employee'>('none');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F7F8F9]">
                <div className="text-[#5F6B76]">Loading...</div>
            </div>
        );
    }

    const filteredEquipment = mockEquipment.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedEquipment = groupBy === 'none'
        ? { 'All Equipment': filteredEquipment }
        : filteredEquipment.reduce((acc, item) => {
            const key = groupBy === 'department' ? item.department : item.assignedTo;
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {} as Record<string, typeof mockEquipment>);

    return (
        <DashboardShell>
            <div className="min-h-screen bg-[#F7F8F9] px-6 pb-12 pt-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-semibold text-[#1C1F23]">Equipment Management</h1>
                            <p className="text-[#5F6B76] text-sm mt-1">Track and manage your company assets</p>
                        </div>
                        <Link
                            href="/equipment/new"
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#5B7C99] text-white rounded-lg hover:opacity-90 transition-opacity duration-150 text-sm font-medium"
                        >
                            <Plus size={18} />
                            Register Equipment
                        </Link>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white p-4 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] mb-8 flex flex-col md:flex-row gap-4 items-center justify-between border border-[#ECEFF1]">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#90A4AE]" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name or serial number..."
                                className="w-full pl-10 pr-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="flex items-center gap-2 text-sm text-[#5F6B76]">
                                <Filter size={16} />
                                <span>Group by:</span>
                                <select
                                    className="bg-[#F7F8F9] border border-[#ECEFF1] rounded-md px-2 py-1 focus:outline-none focus:border-[#5B7C99] text-[#1C1F23]"
                                    value={groupBy}
                                    onChange={(e) => setGroupBy(e.target.value as any)}
                                >
                                    <option value="none">None</option>
                                    <option value="department">Department</option>
                                    <option value="employee">Employee</option>
                                </select>
                            </div>

                            <div className="h-6 w-[1px] bg-[#ECEFF1] hidden md:block" />

                            <div className="flex items-center bg-[#F7F8F9] p-1 rounded-lg border border-[#ECEFF1]">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-[#5B7C99] shadow-sm' : 'text-[#90A4AE] hover:text-[#5F6B76]'}`}
                                >
                                    <LayoutGrid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-[#5B7C99] shadow-sm' : 'text-[#90A4AE] hover:text-[#5F6B76]'}`}
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    {Object.entries(groupedEquipment).map(([group, equipment]) => (
                        <div key={group} className="mb-8">
                            {groupBy !== 'none' && (
                                <h2 className="text-lg font-medium text-[#1C1F23] mb-4 flex items-center gap-2">
                                    <ChevronRight size={20} className="text-[#5B7C99]" />
                                    {group}
                                    <span className="text-sm font-normal text-[#90A4AE] ml-1">({equipment.length})</span>
                                </h2>
                            )}

                            {viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {equipment.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={`/equipment/${item.id}`}
                                            className="group bg-white p-6 rounded-xl border border-[#ECEFF1] hover:border-[#5B7C99]/30 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-semibold text-[#1C1F23] group-hover:text-[#5B7C99] transition-colors">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-xs text-[#90A4AE] mt-0.5">{item.serialNumber}</p>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${item.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </div>

                                            <div className="space-y-3 mt-auto">
                                                <div className="flex items-center gap-2 text-sm text-[#5F6B76]">
                                                    <span className="w-20 text-xs text-[#90A4AE] uppercase tracking-tight">Location</span>
                                                    <span className="truncate">{item.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-[#5F6B76]">
                                                    <span className="w-20 text-xs text-[#90A4AE] uppercase tracking-tight">Department</span>
                                                    <span className="truncate">{item.department}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-[#5F6B76]">
                                                    <span className="w-20 text-xs text-[#90A4AE] uppercase tracking-tight">Maintained</span>
                                                    <span>{new Date(item.lastMaintenance).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl border border-[#ECEFF1] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-[#F7F8F9] border-bottom border-[#ECEFF1]">
                                                <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider">Asset Name</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider">Serial Number</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider">Department</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-[#90A4AE] uppercase tracking-wider text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {equipment.map((item) => (
                                                <tr key={item.id} className="border-t border-[#ECEFF1] hover:bg-[#F7F8F9]/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-[#1C1F23]">{item.name}</div>
                                                        <div className="text-xs text-[#90A4AE] lg:hidden">{item.serialNumber}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-[#5F6B76]">{item.serialNumber}</td>
                                                    <td className="px-6 py-4 text-sm text-[#5F6B76]">{item.department}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                            }`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Link href={`/equipment/${item.id}`} className="text-[#5B7C99] hover:text-[#4A6B88] text-sm font-medium">
                                                            Details
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}

                    {filteredEquipment.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-[#CFD8DC]">
                            <Search size={48} className="text-[#CFD8DC] mb-4" />
                            <h3 className="text-lg font-medium text-[#5F6B76]">No equipment found</h3>
                            <p className="text-sm text-[#90A4AE] mt-1">Try adjusting your search term or filters</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardShell>
    );
}
