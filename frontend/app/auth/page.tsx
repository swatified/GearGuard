'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/app/context/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['user', 'technician', 'manager', 'admin']).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, register: registerUser, isAuthenticated } = useAuth();
  const router = useRouter();

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, touchedFields: loginTouched },
    reset: resetLogin,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors, touchedFields: registerTouched },
    reset: resetRegister,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      role: 'user',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const onLogin = async (data: LoginFormData) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await login(data);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onRegister = async (data: RegisterFormData) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    resetLogin();
    resetRegister();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F7F8F9] via-[#ECEFF1] to-[#F7F8F9] px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-[#1C1F23] mb-2">
            GearGuard
          </h1>
          <p className="text-[#5F6B76] text-sm">
            Maintenance Tracker & Equipment Management
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#ECEFF1] p-6">
          <div className="flex gap-2 mb-5 bg-[#F7F8F9] p-1 rounded-lg">
            <button
              onClick={() => !isLogin && switchMode()}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${isLogin
                ? 'bg-white text-[#1C1F23] shadow-sm'
                : 'text-[#5F6B76] hover:text-[#1C1F23]'
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => isLogin && switchMode()}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${!isLogin
                ? 'bg-white text-[#1C1F23] shadow-sm'
                : 'text-[#5F6B76] hover:text-[#1C1F23]'
                }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-[#A14A4A]/10 border border-[#A14A4A]/20 rounded-lg">
              <p className="text-sm text-[#A14A4A]">{error}</p>
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#1C1F23] mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  {...registerLogin('email')}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all text-[#1C1F23] bg-white ${loginErrors.email && loginTouched.email
                      ? 'border-[#A14A4A] focus:ring-[#A14A4A]/20'
                      : 'border-[#ECEFF1] focus:ring-[#5B7C99] focus:border-transparent'
                    }`}
                  placeholder="you@example.com"
                />
                {loginErrors.email && (
                  <p className="mt-1 text-sm text-[#A14A4A]">{loginErrors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#1C1F23] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...registerLogin('password')}
                    className="w-full px-4 py-2.5 border border-[#ECEFF1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B7C99] focus:border-transparent transition-all text-[#1C1F23] bg-white pr-11"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5F6B76] hover:text-[#1C1F23] transition-colors p-1"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </div>
                {loginErrors.password && (
                  <p className="mt-1 text-sm text-[#A14A4A]">{loginErrors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#5B7C99] text-white font-medium rounded-lg hover:bg-[#4a6983] focus:outline-none focus:ring-2 focus:ring-[#5B7C99] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#1C1F23] mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...registerRegister('name')}
                  className="w-full px-4 py-2.5 border border-[#ECEFF1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B7C99] focus:border-transparent transition-all text-[#1C1F23] bg-white"
                  placeholder="John Doe"
                />
                {registerErrors.name && (
                  <p className="mt-1 text-sm text-[#A14A4A]">{registerErrors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-[#1C1F23] mb-2">
                  Email Address
                </label>
                <input
                  id="register-email"
                  type="email"
                  {...registerRegister('email')}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all text-[#1C1F23] bg-white ${registerErrors.email && registerTouched.email
                      ? 'border-[#A14A4A] focus:ring-[#A14A4A]/20'
                      : 'border-[#ECEFF1] focus:ring-[#5B7C99] focus:border-transparent'
                    }`}
                  placeholder="you@example.com"
                />
                {registerErrors.email && (
                  <p className="mt-1 text-sm text-[#A14A4A]">{registerErrors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="register-password" className="block text-sm font-medium text-[#1C1F23] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      {...registerRegister('password')}
                      className="w-full px-4 py-2.5 border border-[#ECEFF1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B7C99] focus:border-transparent transition-all text-[#1C1F23] bg-white pr-11"
                      placeholder="Min 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5F6B76] hover:text-[#1C1F23] transition-colors p-1"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" /><circle cx="12" cy="12" r="3" /></svg>
                      )}
                    </button>
                  </div>
                  {registerErrors.password && (
                    <p className="mt-1 text-sm text-[#A14A4A]">{registerErrors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-[#1C1F23] mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...registerRegister('confirmPassword')}
                      className="w-full px-4 py-2.5 border border-[#ECEFF1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B7C99] focus:border-transparent transition-all text-[#1C1F23] bg-white pr-11"
                      placeholder="Re-enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5F6B76] hover:text-[#1C1F23] transition-colors p-1"
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" /><circle cx="12" cy="12" r="3" /></svg>
                      )}
                    </button>
                  </div>
                  {registerErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-[#A14A4A]">{registerErrors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-[#1C1F23] mb-2">
                  Role (Optional)
                </label>
                <select
                  id="role"
                  {...registerRegister('role')}
                  className="w-full px-4 py-2.5 border border-[#ECEFF1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B7C99] focus:border-transparent transition-all text-[#1C1F23] bg-white"
                >
                  <option value="user">User</option>
                  <option value="technician">Technician</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
                <p className="mt-1 text-xs text-[#5F6B76]">
                  Select your role. Default is "User" if not specified.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#5B7C99] text-white font-medium rounded-lg hover:bg-[#4a6983] focus:outline-none focus:ring-2 focus:ring-[#5B7C99] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          <div className="mt-5 pt-5 border-t border-[#ECEFF1]">
            <div className="text-xs text-[#5F6B76] space-y-1">
              <p className="font-medium text-[#1C1F23] mb-2">About GearGuard:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Track equipment maintenance requests</li>
                <li>Manage maintenance teams and assignments</li>
                <li>Monitor equipment status and history</li>
                <li>Generate reports and analytics</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[#5F6B76] mt-6">
          © {new Date().getFullYear()} GearGuard. All rights reserved.
        </p>
      </div>
    </div>
  );
}

