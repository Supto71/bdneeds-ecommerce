'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg tracking-tighter">
                BN
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-white leading-none">
                  Bd<span className="text-blue-400">Needs</span>
                </span>
                <span className="text-[9px] font-semibold tracking-widest text-slate-400 uppercase leading-tight mt-0.5">
                  {t('luxuryAndTech')}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
              We are more than just an e-commerce platform; we are committed to making your daily life easier and more convenient. Delivering quality products straight to your doorstep.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Dhaka, Bangladesh</span>
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
                <span>Sat – Thu: 09:00 – 21:00 BST | 24/7 Online Support</span>
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
              <li>
                <Link href="/admin/login" className="hover:text-blue-400 transition-colors text-slate-400">
                  {t('adminConsole')}
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
                <span className="text-[10px] text-slate-400">Zero spam. Unsubscribe anytime.</span>
              </form>
            )}

            {/* Social Links */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-400 block mb-2">Follow BdNeeds</span>
              <div className="flex items-center space-x-3 text-xs text-slate-300">
                <a href="https://www.facebook.com/profile.php?id=61589093341884" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods & Legal Copyright */}
        <div className="pt-8 flex flex-col items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="text-[11px] text-slate-400 mr-1">Payment Options:</span>
            <span className="px-2.5 py-1 bg-[#E2136E]/20 text-[#E2136E] border border-[#E2136E]/40 rounded font-bold tracking-wider text-[10px]">
              bKash / Nagad
            </span>
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded font-semibold text-[10px]">
              Cash On Delivery
            </span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <p>© {new Date().getFullYear()} {t('allRightsReserved')}</p>
            <div className="flex items-center gap-4 border-l border-r border-slate-700 px-4">
              <Link href="/terms" className="hover:text-blue-400 transition-colors">Terms & Conditions</Link>
              <Link href="/return-policy" className="hover:text-blue-400 transition-colors">Return/Refund Policy</Link>
            </div>
            <p className="font-semibold text-slate-300">DBID: <span className="text-white">Pending</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
}
