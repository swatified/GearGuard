'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, logout, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      import('vanta/dist/vanta.clouds.min').then((VANTA) => {
        import('three').then((THREE) => {
          setVantaEffect(
            VANTA.default({
              el: vantaRef.current,
              THREE: THREE,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.00,
              minWidth: 200.00,
              skyColor: 0x5b7c99,
              cloudColor: 0x9db4c8,
              cloudShadowColor: 0x3a5568,
              sunColor: 0xffffff,
              sunGlareColor: 0xffffff,
              sunlightColor: 0xffffff,
            })
          );
        });
      });
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

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
    <div className="min-h-screen bg-[#F7F8F9]">
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

      {/* Hero Section */}
      <section ref={vantaRef} className="pt-32 pb-20 px-6 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1
            className={`text-5xl md:text-6xl font-semibold text-white mb-6 transition-all duration-700 drop-shadow-lg ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            style={{ transitionDelay: '100ms' }}
          >
            Maintenance Tracking,
            <br />
            <span className="drop-shadow-2xl">Simplified</span>
          </h1>
          <p
            className={`text-xl text-white/90 mb-12 max-w-2xl mx-auto transition-all duration-700 drop-shadow ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
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
                  className="px-8 py-4 bg-[#5B7C99] text-white rounded-lg hover:opacity-90 transition-opacity duration-150 font-medium text-base"
                >
                  View Dashboard
                </Link>
                <Link
                  href="/equipment"
                  className="px-8 py-4 bg-white text-[#5B7C99] border border-[#ECEFF1] rounded-lg hover:bg-[#ECEFF1] transition-colors duration-150 font-medium text-base"
                >
                  Browse Equipment
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="px-8 py-4 bg-[#5B7C99] text-white rounded-lg hover:scale-105 hover:shadow-xl transition-all duration-300 font-medium text-base shadow-lg"
                >
                  Get Started
                </Link>
                <Link
                  href="/auth"
                  className="px-8 py-4 bg-white text-[#5B7C99] border-2 border-white rounded-lg hover:scale-105 hover:shadow-xl transition-all duration-300 font-medium text-base shadow-lg"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2
            className={`text-3xl font-semibold text-[#1C1F23] text-center mb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            style={{ transitionDelay: '400ms' }}
          >
            Everything you need to manage maintenance
          </h2>
          <div className={`w-24 h-1 bg-gradient-to-r from-transparent via-[#5B7C99] to-transparent mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} style={{ transitionDelay: '500ms' }}></div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Kanban Board',
                description:
                  'Visual workflow management with drag-and-drop between stages.',
                delay: '500ms',
                icon: '▦',
              },
              {
                title: 'Equipment Tracking',
                description:
                  'Comprehensive equipment profiles with maintenance history.',
                delay: '600ms',
                icon: '⚙',
              },
              {
                title: 'Calendar View',
                description:
                  'Schedule preventive maintenance with calendar integration.',
                delay: '700ms',
                icon: '▭',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`group p-8 bg-[#F7F8F9] rounded-lg transition-all duration-500 hover:bg-white hover:shadow-xl hover:-translate-y-2 border-2 border-transparent hover:border-[#5B7C99]/20 cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                style={{ transitionDelay: feature.delay }}
              >
                <div className="text-5xl mb-4 text-[#5B7C99] transform group-hover:scale-110 transition-transform duration-300 font-bold">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-[#1C1F23] mb-3 group-hover:text-[#5B7C99] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-[#5F6B76] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`p-12 bg-gradient-to-br from-[#5B7C99]/10 to-[#ECEFF1] rounded-2xl transition-all duration-700 border-2 border-[#5B7C99]/20 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            style={{ transitionDelay: '800ms' }}
          >
            <h2 className="text-3xl font-semibold text-[#1C1F23] mb-4">
              Ready to get started?
            </h2>
            <p className="text-[#5F6B76] mb-8 max-w-xl mx-auto">
              Start tracking your equipment maintenance today with a clean,
              intuitive interface.
            </p>
            {isAuthenticated ? (
              <Link
                href="/maintenance"
                className="inline-block px-8 py-4 bg-[#5B7C99] text-white rounded-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 font-medium text-base shadow-lg"
              >
                Launch Maintenance Board
              </Link>
            ) : (
              <Link
                href="/auth"
                className="inline-block px-8 py-4 bg-[#5B7C99] text-white rounded-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 font-medium text-base shadow-lg"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#ECEFF1]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#5F6B76] text-sm">
            © {new Date().getFullYear()} GearGuard. Maintenance tracking
            reimagined.
          </p>
        </div>
      </footer>
    </div>
  );
}

