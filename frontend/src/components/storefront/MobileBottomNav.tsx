'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { totalWishlist } = useWishlist();
  const { t } = useLanguage();
  const [optimisticIndex, setOptimisticIndex] = useState<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Sync optimistic index when pathname updates
  useEffect(() => {
    setOptimisticIndex(null);
  }, [pathname]);

  // Hide on admin routes or product detail page (product page has dedicated sticky purchase action)
  if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/product/')) {
    return null;
  }

  // Determine active tab index (0: Home, 1: Search, 2: Shop, 3: Wishlist, 4: Account)
  let activeIndex = 0;
  if (pathname === '/') {
    activeIndex = 0;
  } else if (pathname.startsWith('/search')) {
    activeIndex = 1;
  } else if (
    pathname.startsWith('/shop') ||
    pathname.startsWith('/category') ||
    pathname.startsWith('/cart')
  ) {
    activeIndex = 2;
  } else if (pathname.startsWith('/wishlist')) {
    activeIndex = 3;
  } else if (
    pathname.startsWith('/account') ||
    pathname.startsWith('/orders') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register')
  ) {
    activeIndex = 4;
  } else {
    activeIndex = 0;
  }

  const activeIdx = optimisticIndex ?? activeIndex;

  const navItems = [
    { label: t('bottomHome'), href: '/', icon: Home, badge: 0 },
    { label: t('bottomSearch'), href: '/search', icon: Search, badge: 0 },
    { label: t('bottomCatalog'), href: '/shop', icon: ShoppingBag, badge: totalItems },
    { label: t('bottomWishlist'), href: '/wishlist', icon: Heart, badge: totalWishlist },
    { label: t('account'), href: '/account', icon: User, badge: 0 },
  ];

  const ActiveIcon = navItems[activeIdx].icon;
  const activeBadge = navItems[activeIdx].badge;

  return (
    <div
      className="md:hidden fixed bottom-3 left-3 right-3 max-w-sm sm:max-w-md mx-auto z-40 pointer-events-none select-none"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      role="navigation"
      aria-label="Mobile Navigation"
    >
      <div className="relative w-full h-[64px] pointer-events-auto filter drop-shadow-[0_12px_28px_rgba(11,19,43,0.35)]">
        {/* Dark Background Pill Bar */}
        <div className="absolute inset-0 rounded-2xl bg-[#0B132B] border border-slate-700/50" />

        {/* Sliding Active Circular Bubble (Smooth, Continuous, GPU-accelerated) */}
        <div
          className="absolute top-0 left-0 w-1/5 h-full pointer-events-none flex items-start justify-center will-change-transform z-10"
          style={{
            transform: `translate3d(${activeIdx * 100}%, 0, 0)`,
            transition: prefersReducedMotion
              ? 'none'
              : 'transform 280ms cubic-bezier(0.33, 1, 0.68, 1)',
          }}
        >
          <div className="relative w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md ring-4 ring-[#0B132B] -translate-y-4">
            <ActiveIcon className="w-5 h-5 text-white stroke-[2.5]" />
            {activeBadge !== undefined && activeBadge > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-white text-blue-700 text-[9px] font-extrabold flex items-center justify-center shadow-xs">
                {activeBadge > 99 ? '99+' : activeBadge}
              </span>
            )}
          </div>
        </div>

        {/* 5 Navigation Item Slots */}
        <div className="relative z-10 grid grid-cols-5 h-full items-center">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeIdx === idx;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOptimisticIndex(idx)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className="relative flex flex-col items-center justify-center h-full text-center group focus:outline-none active:scale-95 transition-transform duration-100"
              >
                {/* Regular inactive icon slot (fades out when active under the sliding bubble) */}
                <div
                  className={`relative flex items-center justify-center transition-opacity duration-200 ${
                    isActive
                      ? 'opacity-0 pointer-events-none'
                      : 'opacity-100 text-slate-400 group-hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[1.8]" />

                  {/* Badge */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-blue-500 text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
