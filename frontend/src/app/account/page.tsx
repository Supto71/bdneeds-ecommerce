'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  User as UserIcon,
  Package,
  Heart,
  Truck,
  MapPin,
  ShieldAlert,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import MobileBottomNav from '@/components/storefront/MobileBottomNav';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const { totalWishlist } = useWishlist();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <AnnouncementBar />
        <Header />
        <main className="flex-1 flex items-center justify-center py-16 px-4">
          <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-xs">
            <UserIcon className="w-12 h-12 text-slate-400 mx-auto" />
            <h2 className="text-xl font-bold text-[#0B132B]">Account Access Required</h2>
            <p className="text-xs text-slate-500">
              Please sign in to access your personal profile, addresses, and order history.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login"
                className="w-full py-3 bg-[#0B132B] hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="w-full py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Create an Account
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200 shrink-0">
                {user.avatarUrl ? (
                  <Image src={user.avatarUrl} alt={user.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-black text-xl text-slate-500">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-[#0B132B]">
                    {user.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                {user.phone && <p className="text-xs text-slate-400">{user.phone}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3 self-stretch sm:self-auto">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Admin Console
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Quick Hub Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link
              href="/orders"
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Package className="w-6 h-6" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0B132B]">My Orders</h3>
                <p className="text-xs text-slate-500 mt-1">
                  View recent purchases, delivery receipts, and invoices.
                </p>
              </div>
            </Link>

            <Link
              href="/wishlist"
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold bg-slate-100 px-2.5 py-1 rounded-full text-slate-600">
                  {totalWishlist} saved
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0B132B]">Saved Wishlist</h3>
                <p className="text-xs text-slate-500 mt-1">
                  View and manage your bookmarked products.
                </p>
              </div>
            </Link>

            <Link
              href="/track-order"
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Truck className="w-6 h-6" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0B132B]">Track Shipment</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Check live courier milestones with your tracking code.
                </p>
              </div>
            </Link>
          </div>

          {/* Saved Addresses Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0B132B] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Saved Delivery Addresses
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl border-2 border-blue-600 bg-blue-50/20 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Primary Residence</span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                    Default
                  </span>
                </div>
                <p className="text-slate-800 font-semibold">{user.name}</p>
                <p className="text-slate-600">742 Evergreen Terrace, Suite 4B</p>
                <p className="text-slate-600">Seattle, WA 98101</p>
                <p className="text-slate-400 pt-1">{user.phone || '+1 (555) 234-5678'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
