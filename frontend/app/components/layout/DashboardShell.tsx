'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Wrench,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    ChevronDown,
    Shield,
    Bell,
    Search,
    User,
    Home,
    Calendar,
    Box,
    TrendingUp,
    Plus
} from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

interface DashboardShellProps {
    children: React.ReactNode;
}

const navItems = [
    { name: 'Maintenance', href: '/maintenance', icon: Wrench },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Maintenance Calendar', href: '/maintenance/calendar', icon: Calendar },
    { name: 'Equipment', href: '/equipment', icon: Box },
    { name: 'Work Centers', href: '/work-centers', icon: Settings },
    { name: 'Reporting', href: '/reporting', icon: TrendingUp },
    { name: 'Teams', href: '/teams', icon: Users },
];

export default function DashboardShell({ children }: DashboardShellProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, user } = useAuth();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = async () => {
        await logout();
        router.push('/auth');
    };

    const getNewButtonHref = () => {
        if (pathname.startsWith('/maintenance')) return '/maintenance/new';
        if (pathname.startsWith('/equipment')) return '/equipment/new';
        if (pathname.startsWith('/teams')) return '/teams/new';
        if (pathname.startsWith('/work-centers')) return '/work-centers/new';
        return '/maintenance/new';
    };

    return (
        <div className="min-h-screen bg-[#F7F8F9] flex flex-col">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-[#ECEFF1] sticky top-0 z-50">
                {/* Navigation Items */}
                <nav className="flex items-center justify-between px-6 h-16">
                    {/* Left Side - New Button and Nav Items */}
                    <div className="flex items-center gap-6">
                        <Link
                            href={getNewButtonHref()}
                            className="flex items-center gap-2 px-4 py-2 bg-[#5B7C99] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                        >
                            <Plus size={18} />
                            New
                        </Link>
                        <div className="flex items-center gap-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            isActive
                                                ? 'bg-[#5B7C99] text-white'
                                                : 'text-[#5F6B76] hover:bg-[#F7F8F9] hover:text-[#1C1F23]'
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Side - User Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F7F8F9] transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-[#5B7C99] text-white flex items-center justify-center text-sm font-bold">
                                {user?.name?.[0]?.toUpperCase() || <User size={16} />}
                            </div>
                            <span className="text-sm font-medium text-[#1C1F23]">{user?.name || 'User'}</span>
                            <ChevronDown size={16} className="text-[#5F6B76]" />
                        </button>

                        {/* User Dropdown Menu */}
                        {isUserMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsUserMenuOpen(false)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#ECEFF1] z-50 py-2">
                                    <div className="px-4 py-2 border-b border-[#ECEFF1]">
                                        <p className="text-sm font-semibold text-[#1C1F23]">{user?.name || 'User'}</p>
                                        <p className="text-xs text-[#90A4AE] uppercase">{user?.role || 'User'}</p>
                                    </div>
                                    <Link
                                        href="/settings"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#5F6B76] hover:bg-[#F7F8F9] transition-colors"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        <Settings size={16} />
                                        Settings
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </nav>

                {/* Search Bar */}
                <div className="px-6 pb-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#90A4AE]" size={18} />
                        <input
                            type="text"
                            placeholder="Q Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-lg text-sm focus:outline-none focus:border-[#5B7C99] focus:bg-white transition-all"
                        />
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
