'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, ExternalLink, Globe } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage, LanguageSwitcher } from '@/context/LanguageContext';

export default function AdminHeader() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-30">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {t('adminLiveSync')}
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {/* Admin Language Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
          <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          <LanguageSwitcher />
        </div>

        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <span>{t('adminViewStore')}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="h-4 w-px bg-slate-200" />

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-900 block leading-tight">
              {user?.name || 'Administrator'}
            </span>
            <span className="text-[10px] text-slate-400 block leading-tight">
              {user?.email || 'admin@novacart.com'}
            </span>
          </div>

          <button
            onClick={() => {
              logout();
              router.push('/admin/login');
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
            title={t('logout')}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
