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
  const { user, isAdmin, isAuthenticated } = useAuth();

  useEffect(() => {
    // Login page e kono check dorkar nai
    if (pathname === '/admin/login') return;

    // Jodi logged in na, tahole login page e pathao
    if (!isAuthenticated) {
      router.replace('/admin/login');
      return;
    }

    // Jodi logged in kintu ADMIN na, tahole home e pathao
    if (!isAdmin) {
      router.replace('/');
      return;
    }
  }, [isAuthenticated, isAdmin, pathname, router]);

  // If login page, don't show admin sidebar/header
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-slate-100">{children}</div>;
  }

  // Jodi auth check hocche, loading dekhao
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Verifying access...</p>
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
