'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(identifier, password);
    setLoading(false);

    if (res.success) {
      router.push('/account');
    } else {
      setError(res.message || 'Invalid credentials');
    }
  };

  const handleQuickDemoCustomer = () => {
    setIdentifier('alex.hayes@example.com');
    setPassword('customer123');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 relative flex items-center justify-center py-20 px-4 sm:px-6 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[120px]" />
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-400/20 blur-[120px]" />
          <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-teal-400/20 blur-[120px]" />
        </div>

        <div className="max-w-md w-full relative z-10">
          <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white/50 p-8 sm:p-10 shadow-2xl shadow-blue-900/5 space-y-8">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center mb-6">
                <Image
                  src="/logomain.png"
                  alt="BdNeeds Logo"
                  width={160}
                  height={48}
                  className="object-contain h-12 w-auto"
                  priority
                />
              </div>
              <p className="text-sm text-slate-500 font-medium">
                Sign in to access your exclusive perks and orders.
              </p>
            </div>

            {/* Quick Demo Fill Pill */}
            <button
              type="button"
              onClick={handleQuickDemoCustomer}
              className="group w-full py-2.5 px-4 bg-gradient-to-r from-blue-50 to-violet-50 hover:from-blue-100 hover:to-violet-100 text-blue-700 text-xs font-bold rounded-2xl transition-all duration-300 border border-blue-200/50 flex items-center justify-center gap-2"
            >
              <span>Autofill Demo Credentials</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            {error && (
              <div className="p-4 bg-rose-50/80 backdrop-blur-sm border border-rose-200 rounded-2xl text-rose-700 text-sm font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-slate-700 ml-1">
                  Email Address or Phone Number
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="email@example.com or 01XXXXXXXXX"
                    className="w-full pl-11 pr-4 py-3.5 text-sm bg-white/50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white font-medium transition-all duration-300 shadow-sm"
                  />
                  <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-bold text-slate-700">Password</label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 text-sm bg-white/50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white font-medium transition-all duration-300 shadow-sm"
                  />
                  <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-[0.98]"
              >
                {loading ? 'Authenticating...' : 'Sign In To Account'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="pt-6 border-t border-slate-200/60 text-center text-sm font-medium text-slate-500">
              New to our store?{' '}
              <Link href="/register" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-80 transition-opacity">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
