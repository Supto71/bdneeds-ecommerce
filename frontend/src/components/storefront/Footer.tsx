'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#0B132B] text-white pt-16 pb-24 lg:pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/logomain.png"
                  alt="BdNeeds Logo"
                  width={160}
                  height={48}
                  className="object-contain h-10 sm:h-12 w-auto"
                  style={{ filter: 'brightness(0) invert(1)' }}
                  priority
                />
              </Link>
            </div>

            <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
              {t('footerAboutDesc')}
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{t('footerAddress')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+880 1811-277828</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>contact@bdneeds.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{t('footerTime')}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-white mb-4">
              {t('categories')}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/shop" className="hover:text-blue-400 transition-colors">
                  {t('allCategories')}
                </Link>
              </li>
              <li>
                <Link href="/category/electronics" className="hover:text-blue-400 transition-colors">
                  {t('audio')} & {t('computing')}
                </Link>
              </li>
              <li>
                <Link href="/category/fashion" className="hover:text-blue-400 transition-colors">
                  {t('apparel')}
                </Link>
              </li>
              <li>
                <Link href="/category/gaming" className="hover:text-blue-400 transition-colors">
                  {t('gaming')}
                </Link>
              </li>
              <li>
                <Link href="/category/accessories" className="hover:text-blue-400 transition-colors">
                  {t('accessories')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-white mb-4">
              {t('customerCare')}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/track-order" className="hover:text-blue-400 transition-colors">
                  {t('trackOrder')}
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-blue-400 transition-colors">
                  {t('myOrders')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-blue-400 transition-colors">
                  {t('helpFaq')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                  {t('contactUs')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  {t('aboutUs')}
                </Link>
              </li>

            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold tracking-wider uppercase text-white mb-2">
              {t('subscribeNewsletter')}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t('newsletterDesc')}
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{t('subscribedThankYou')}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('enterYourEmail')}
                    className="w-full pl-3 pr-10 py-2.5 text-xs bg-white/10 border border-white/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/15 text-white placeholder-slate-400 transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-slate-400">{t('footerSpam')}</span>
              </form>
            )}

            {/* Social Links */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-400 block mb-2">{t('footerFollow')}</span>
              <div className="flex items-center space-x-3 text-xs text-slate-300">
                <a href="https://www.facebook.com/profile.php?id=61589093341884" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods & Legal Copyright */}
        <div className="pt-8 flex flex-col items-center justify-center gap-6 text-xs text-slate-400">

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <p>© {new Date().getFullYear()} {t('allRightsReserved')}</p>
            <div className="flex items-center gap-4 border-l border-r border-slate-700 px-4">
              <Link href="/terms" className="hover:text-blue-400 transition-colors">{t('footerTerms')}</Link>
              <Link href="/return-policy" className="hover:text-blue-400 transition-colors">{t('footerRefund')}</Link>
            </div>
            <p className="font-semibold text-slate-300">DBID: <span className="text-white">Pending</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
}
