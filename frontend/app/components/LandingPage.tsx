'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import BallpitBackground from './BallpitBackground';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/maintenance');
    } else {
      router.push('/auth');
    }
  };

  return (
    <div className="h-screen w-screen bg-[#F7F8F9] relative overflow-hidden">
      {/* Ballpit Background */}
      <BallpitBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#F7F8F9]/80 backdrop-blur-md border-b border-[#ECEFF1]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-[#1C1F23]">
            GearGuard
          </Link>
          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-[#5F6B76] hover:text-[#1C1F23] transition-colors duration-150 text-sm"
                >
                  Dashboard
                </Link>
                <span className="text-sm text-[#5F6B76]">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-[#5F6B76] hover:text-[#1C1F23] transition-colors duration-150 text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="text-[#5F6B76] hover:text-[#1C1F23] transition-colors duration-150 text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth"
                  className="px-4 py-2 bg-[#5B7C99] text-white rounded-lg hover:opacity-90 transition-opacity duration-150 text-sm font-medium"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Screen Centered */}
      <section className="h-full w-full flex items-center justify-center px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className={`text-5xl md:text-6xl lg:text-7xl font-semibold text-[#1C1F23] mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            style={{ transitionDelay: '100ms' }}
          >
            Maintenance Tracking,
            <br />
            <span className="text-[#5B7C99]">Simplified</span>
          </h1>
          <p
            className={`text-xl md:text-2xl text-[#5F6B76] mb-12 max-w-2xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            style={{ transitionDelay: '200ms' }}
          >
            Track equipment, manage maintenance requests, and streamline workflows
            with clarity and precision.
          </p>
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            style={{ transitionDelay: '300ms' }}
          >
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-8 py-4 bg-[#5B7C99] text-white rounded-lg hover:opacity-90 transition-opacity duration-150 font-medium text-base shadow-lg"
                >
                  View Dashboard
                </Link>
                <Link
                  href="/equipment"
                  className="px-8 py-4 bg-white/90 backdrop-blur-sm text-[#5B7C99] border border-[#ECEFF1] rounded-lg hover:bg-white transition-colors duration-150 font-medium text-base shadow-lg"
                >
                  Browse Equipment
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="px-8 py-4 bg-[#5B7C99] text-white rounded-lg hover:opacity-90 transition-opacity duration-150 font-medium text-base shadow-lg"
                >
                  Get Started
                </Link>
                <Link
                  href="/auth"
                  className="px-8 py-4 bg-white/90 backdrop-blur-sm text-[#5B7C99] border border-[#ECEFF1] rounded-lg hover:bg-white transition-colors duration-150 font-medium text-base shadow-lg"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

