'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Truck, Globe } from 'lucide-react';
import { useLanguage, LanguageSwitcher } from '@/context/LanguageContext';
import { Banner } from '@/types';

export default function AnnouncementBar() {
  const { t } = useLanguage();
  const [announcement, setAnnouncement] = useState<Banner | null>(null);

  useEffect(() => {
    fetch('/api/banners')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const banner = data.find((b: Banner) => b.type === 'ANNOUNCEMENT');
          if (banner) setAnnouncement(banner);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="bg-[#0B132B] text-white text-xs font-medium py-1.5 px-4 border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center space-x-6 text-slate-300 text-[11px]">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-blue-400" /> {announcement?.subtitle || t('freeShippingNotice')}
          </span>
        </div>

        <div className="w-full md:w-auto text-center flex items-center justify-center gap-2 text-[11px] sm:text-xs">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-600 text-white tracking-wider uppercase">
            {announcement?.badge || 'Promo'}
          </span>
          <span>
            {announcement?.ctaLink ? (
              <Link href={announcement.ctaLink} className="hover:underline">
                {announcement?.title || t('promoNotice')}
              </Link>
            ) : (
              announcement?.title || t('promoNotice')
            )}
          </span>
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
