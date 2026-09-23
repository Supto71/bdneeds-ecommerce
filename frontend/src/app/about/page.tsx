import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Award, Sparkles, Globe2, ArrowRight } from 'lucide-react';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import MobileBottomNav from '@/components/storefront/MobileBottomNav';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* Editorial Hero */}
        <section className="relative bg-[#0B132B] text-white py-20 lg:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
            <span className="text-xs font-extrabold tracking-widest uppercase text-blue-400 mb-3 block">
              OUR ARCHITECTURAL PHILOSOPHY
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Where Acoustic Artistry Meets Modern Craft
            </h1>
            <p className="mt-6 text-sm sm:text-base text-slate-300 leading-relaxed">
              Founded on the belief that everyday tools and garments should possess the refinement of fine horology and the engineering rigor of aerospace acoustics.
            </p>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent pointer-events-none" />
        </section>

        {/* Pillars Grid */}
        <section className="py-20 bg-slate-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B132B]">
                The Three Novacart Standards
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Uncompromising principles governing every product in our catalog.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-2xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0B132B]">Authentic Materials</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Titanium alloys, Australian merino wool, vegetable-tanned Tuscan bridle leather, and double-domed sapphire crystals. We never compromise on raw substance.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-2xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0B132B]">Studio Engineering</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Calibrated acoustics, gasket-mounted dampening, high-density batteries, and whisper-silent brushless motors tested across thousands of operational hours.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-2xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Globe2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0B132B]">Sustainable Longevity</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  We reject planned obsolescence. Our electronics feature hot-swappable modularity and our leather goods are designed to develop an enduring patina over decades.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Action Banner */}
        <section className="py-16 bg-white text-center">
          <div className="max-w-2xl mx-auto px-4 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B132B]">
              Experience The Collection Firsthand
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Complimentary global express shipping on all orders over $99 with full 30-day return privileges.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md"
            >
              Explore Catalog Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
