'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, isAuthenticated, isAuthLoading } = useAuth();

  useEffect(() => {
    // Auth load হওয়া পর্যন্ত অপেক্ষা করো
    if (isAuthLoading) return;
    // Login page এ কোনো check দরকার নেই
    if (pathname === '/admin/login') return;

    if (!isAuthenticated) {
      router.replace('/admin/login');
      return;
    }

    if (!isAdmin) {
      router.replace('/');
    }
  }, [isAuthLoading, isAuthenticated, isAdmin, pathname, router]);

  // Login page — sidebar/header ছাড়া
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-slate-100">{children}</div>;
  }

  // Auth এখনো load হচ্ছে — spinner দেখাও
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-semibold">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Auth load হয়েছে, কিন্তু admin না
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-semibold">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-800">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
