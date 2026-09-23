'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ImageIcon,
  ShoppingBag,
  Users,
  Boxes,
  MessageSquare,
  Tag,
  BarChart3,
  Settings,
  ArrowLeft,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { TranslationKey } from '@/lib/translations';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const links: { key: TranslationKey; href: string; icon: React.ElementType }[] = [
    { key: 'adminDashboard', href: '/admin', icon: LayoutDashboard },
    { key: 'adminProducts', href: '/admin/products', icon: Package },
    { key: 'adminCategories', href: '/admin/categories', icon: FolderTree },
    { key: 'adminBanners', href: '/admin/banners', icon: ImageIcon },
    { key: 'adminOrders', href: '/admin/orders', icon: ShoppingBag },
    { key: 'adminCustomers', href: '/admin/customers', icon: Users },
    { key: 'adminInventory', href: '/admin/inventory', icon: Boxes },
    { key: 'adminReviews', href: '/admin/reviews', icon: MessageSquare },
    { key: 'adminCoupons', href: '/admin/coupons', icon: Tag },
    { key: 'adminAnalytics', href: '/admin/analytics', icon: BarChart3 },
    { key: 'adminSettings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0B132B] text-white flex flex-col justify-between shrink-0 border-r border-slate-800">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm text-white">
              NC
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block leading-none">
                NOVA<span className="text-blue-400">CART</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                {t('adminConsole')}
              </span>
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.key}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{t(link.key)}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Back to Storefront Link */}
      <div className="p-4 border-t border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('adminBackToStore')}</span>
        </Link>
      </div>
    </aside>
  );
}
