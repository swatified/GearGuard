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
    Shield,
    Bell,
    Search,
    User,
    Home
} from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

interface DashboardShellProps {
    children: React.ReactNode;
}

const navItems = [
    { name: 'Equipment', href: '/equipment', icon: LayoutDashboard },
    { name: 'Maintenance', href: '/maintenance', icon: Wrench },
    { name: 'Specialized Teams', href: '/teams', icon: Users },
];

export default function DashboardShell({ children }: DashboardShellProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = async () => {
        await logout();
        router.push('/auth');
    };

    return (
        <div className="min-h-screen bg-[#F7F8F9] flex">
            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#1C1F23] text-white transition-all duration-300 transform ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
                    } flex flex-col`}
            >
                {/* Logo */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
                    <div className={`flex items-center gap-3 transition-opacity duration-200 ${!isSidebarOpen && 'lg:opacity-0'}`}>
                        <div className="w-8 h-8 bg-[#5B7C99] rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/10">G</div>
                        <span className="text-xl font-bold tracking-tight">GearGuard</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-white/50 hover:text-white"
                    >
                        {isSidebarOpen ? <X size={20} className="lg:hidden" /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-8 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group ${isActive
                                    ? 'bg-[#5B7C99] text-white shadow-lg shadow-blue-500/20'
                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon size={22} className={`${isActive ? 'text-white' : 'text-[#5B7C99] group-hover:text-white'} transition-colors`} />
                                <span className={`font-bold text-sm tracking-wide transition-opacity duration-200 ${!isSidebarOpen && 'lg:opacity-0'}`}>
                                    {item.name}
                                </span>
                                {isActive && isSidebarOpen && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-white/5 space-y-2">
                    <Link
                        href="/"
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all group"
                    >
                        <Home size={22} className="group-hover:scale-110 transition-transform text-[#5B7C99]" />
                        <span className={`font-bold text-sm tracking-wide transition-opacity duration-200 ${!isSidebarOpen && 'lg:opacity-0'}`}>Go to Home</span>
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all group">
                        <Settings size={22} className="group-hover:rotate-45 transition-transform" />
                        <span className={`font-bold text-sm tracking-wide transition-opacity duration-200 ${!isSidebarOpen && 'lg:opacity-0'}`}>Settings</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-all"
                    >
                        <LogOut size={22} />
                        <span className={`font-bold text-sm tracking-wide transition-opacity duration-200 ${!isSidebarOpen && 'lg:opacity-0'}`}>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-[#ECEFF1] px-8 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-8 flex-1">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 text-[#5F6B76] hover:bg-[#F7F8F9] rounded-lg transition-colors"
                        >
                            <Menu size={22} />
                        </button>
                        <div className="relative max-w-md w-full hidden md:block group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#90A4AE] group-focus-within:text-[#5B7C99] transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Global search assets or requests..."
                                className="w-full pl-10 pr-4 py-2 bg-[#F7F8F9] border border-[#ECEFF1] rounded-xl text-sm font-medium focus:outline-none focus:border-[#5B7C99] focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-[#90A4AE] hover:text-[#5B7C99] hover:bg-blue-50 rounded-xl transition-all relative">
                            <Bell size={22} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-6 w-[1px] bg-[#ECEFF1] mx-2"></div>
                        <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-[#F7F8F9] border border-[#ECEFF1] flex items-center justify-center text-[#5B7C99] font-bold shadow-sm group-hover:bg-[#5B7C99] group-hover:text-white transition-all">
                                {user?.name?.[0]?.toUpperCase() || <User size={20} />}
                            </div>
                            <div className="hidden lg:block">
                                <p className="text-sm font-bold text-[#1C1F23]">{user?.name || 'Guest User'}</p>
                                <p className="text-[10px] font-bold text-[#90A4AE] uppercase tracking-wider">{user?.role || 'User'}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Content */}
                <div className="flex-1 overflow-auto scrollbar-hide">
                    {children}
                </div>
            </main>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 lg:hidden z-40 backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}
