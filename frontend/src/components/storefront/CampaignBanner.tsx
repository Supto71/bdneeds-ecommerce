'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Banner } from '@/types';

interface CampaignBannerProps {
  banner?: Banner;
}

export default function CampaignBanner({ banner }: CampaignBannerProps) {
  if (!banner) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#0B132B] text-white overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-2 items-center">
          {/* Left Column Text */}
          <div className="p-8 sm:p-12 lg:p-16 space-y-5 z-10">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/[0.07] backdrop-blur-md border border-white/20 text-[11px] font-bold tracking-[0.22em] uppercase bg-gradient-to-r from-white via-sky-100 to-blue-200 bg-clip-text text-transparent">
              {banner.badge}
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {banner.title}
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {banner.description || banner.subtitle}
            </p>

            <div className="pt-2 flex items-center gap-4">
              <Link
                href={banner.ctaLink}
                className="px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                {banner.ctaText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column Image */}
          <div className="relative h-72 sm:h-96 lg:h-full min-h-[380px] w-full bg-slate-900">
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 600px"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0B132B] via-transparent to-transparent opacity-80 lg:opacity-100" />
          </div>
        </div>
      </div>
    </section>
  );
}
