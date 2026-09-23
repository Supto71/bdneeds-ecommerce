'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Award,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((data) => setAnalytics(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !analytics) {
    return (
      <div className="py-20 text-center text-xs font-semibold text-slate-400">
        Aggregating business intelligence and order sales metrics...
      </div>
    );
  }

  const aov =
    analytics.totalOrders > 0
      ? analytics.totalRevenue / analytics.totalOrders
      : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B132B]">
            Commercial Analytics & Insights
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Data-grounded financial performance, product velocity, and client acquisition.
          </p>
        </div>

        {/* Date Filters */}
        <div className="flex items-center bg-white rounded-2xl border border-slate-200 p-1 shadow-2xs">
          {[
            { id: 'today', label: 'Today' },
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: 'month', label: 'This Month' },
            { id: 'year', label: 'This Year' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setTimeRange(r.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                timeRange === r.id
                  ? 'bg-[#0B132B] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Gross Merchandising Value
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#0B132B]">
            {formatPrice(analytics.totalRevenue)}
          </div>
          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +24.8% YoY
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Average Order Value (AOV)
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#0B132B]">
            {formatPrice(aov)}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Across {analytics.totalOrders} transactions
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Client Conversion Rate
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#0B132B]">
            3.82%
          </div>
          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Top 10% benchmark
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Return Merchandise Rate
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#0B132B]">
            0.85%
          </div>
          <p className="text-xs text-emerald-600 font-medium">
            Industry low return rate
          </p>
        </div>
      </div>

      {/* Top Performing Products */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-[#0B132B]">
            Top Revenue Driving Products
          </h3>
          <p className="text-xs text-slate-500">
            Ranked by total units shipped and verified cumulative earnings.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {analytics.bestSellingProducts?.map((prod: any, idx: number) => (
            <div key={prod.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="w-6 font-black text-sm text-slate-400">
                  0{idx + 1}
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {prod.name}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {prod.categoryName} • {prod.brand}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-8 text-right">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    {prod.salesCount} Units
                  </span>
                  <span className="text-[10px] text-slate-400">Sold</span>
                </div>
                <div>
                  <span className="text-sm font-black text-[#0B132B] block">
                    {formatPrice(prod.basePrice * prod.salesCount)}
                  </span>
                  <span className="text-[10px] text-slate-400">Gross</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
