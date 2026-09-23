'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Globe } from 'lucide-react';
import { useLanguage, LanguageSwitcher } from '@/context/LanguageContext';

export default function AnnouncementBar() {
  const { t } = useLanguage();

  return (
    <div className="bg-[#0B132B] text-white text-xs font-medium py-1.5 px-4 border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center space-x-6 text-slate-300 text-[11px]">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-blue-400" /> {t('freeShippingNotice')}
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> {t('officialWarranty')}
          </span>
        </div>

        <div className="w-full md:w-auto text-center flex items-center justify-center gap-2 text-[11px] sm:text-xs">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-600 text-white tracking-wider uppercase">
            Promo
          </span>
          <span>{t('promoNotice')}</span>
        </div>

        <div className="flex items-center space-x-3 text-slate-300 text-[11px]">
          <div className="hidden lg:flex items-center space-x-3">
            <Link href="/track-order" className="hover:text-white transition-colors">
              {t('trackOrder')}
            </Link>
            <span>•</span>
            <Link href="/faq" className="hover:text-white transition-colors">
              {t('helpFaq')}
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition-colors">
              {t('contactUs')}
            </Link>
            <span>•</span>
          </div>

          {/* Compact Language Selector */}
          <div className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-slate-400" />
            <LanguageSwitcher className="bg-white/10 border-white/15 text-white scale-90 origin-right" />
          </div>
        </div>
      </div>
    </div>
  );
}
