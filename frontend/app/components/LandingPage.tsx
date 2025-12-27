'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F8F9]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#F7F8F9]/80 backdrop-blur-md border-b border-[#ECEFF1]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-semibold text-[#1C1F23]">GearGuard</div>
          <div className="flex items-center gap-6">
            <Link
              href="/maintenance"
              className="text-[#5F6B76] hover:text-[#1C1F23] transition-colors duration-150 text-sm"
            >
              Features
            </Link>
            <Link
              href="/maintenance"
              className="px-4 py-2 bg-[#5B7C99] text-white rounded-lg hover:opacity-90 transition-opacity duration-150 text-sm font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className={`text-5xl md:text-6xl font-semibold text-[#1C1F23] mb-6 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            Maintenance Tracking,
            <br />
            <span className="text-[#5B7C99]">Simplified</span>
          </h1>
          <p
            className={`text-xl text-[#5F6B76] mb-12 max-w-2xl mx-auto transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            Track equipment, manage maintenance requests, and streamline workflows
            with clarity and precision.
          </p>
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <Link
              href="/maintenance"
              className="px-8 py-4 bg-[#5B7C99] text-white rounded-lg hover:opacity-90 transition-opacity duration-150 font-medium text-base"
            >
              View Maintenance Board
            </Link>
            <Link
              href="/equipment"
              className="px-8 py-4 bg-white text-[#5B7C99] border border-[#ECEFF1] rounded-lg hover:bg-[#ECEFF1] transition-colors duration-150 font-medium text-base"
            >
              Browse Equipment
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2
            className={`text-3xl font-semibold text-[#1C1F23] text-center mb-16 transition-all duration-700 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            Everything you need to manage maintenance
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Kanban Board',
                description:
                  'Visual workflow management with drag-and-drop between stages.',
                delay: '500ms',
              },
              {
                title: 'Equipment Tracking',
                description:
                  'Comprehensive equipment profiles with maintenance history.',
                delay: '600ms',
              },
              {
                title: 'Calendar View',
                description:
                  'Schedule preventive maintenance with calendar integration.',
                delay: '700ms',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`p-8 bg-[#F7F8F9] rounded-lg transition-all duration-700 hover:shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: feature.delay }}
              >
                <h3 className="text-xl font-semibold text-[#1C1F23] mb-3">
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
            className={`p-12 bg-[#ECEFF1] rounded-lg transition-all duration-700 ${
              isVisible ? 'opacity-100' : 'opacity-0'
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
            <Link
              href="/maintenance"
              className="inline-block px-8 py-4 bg-[#5B7C99] text-white rounded-lg hover:opacity-90 transition-opacity duration-150 font-medium text-base"
            >
              Launch Maintenance Board
            </Link>
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

