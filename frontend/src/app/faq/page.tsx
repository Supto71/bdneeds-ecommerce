'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Truck, RefreshCw, ShieldCheck, CreditCard } from 'lucide-react';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import MobileBottomNav from '@/components/storefront/MobileBottomNav';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'Shipping & Delivery',
      icon: Truck,
      q: 'What shipping options are available and what is the delivery timeline?',
      a: 'We offer Standard Express Courier (2-4 business days, complimentary on orders over $99) and FedEx Priority Overnight (guaranteed next-morning delivery for $25). All consignments are tracked with live telemetry and dispatched from our temperature-controlled central hub.',
    },
    {
      category: 'Shipping & Delivery',
      icon: Truck,
      q: 'Do you ship internationally?',
      a: 'Yes, Novacart operates in over 45 countries worldwide. International shipments include customs duties and taxes prepaid to ensure seamless door-to-door delivery with no unexpected fees upon arrival.',
    },
    {
      category: 'Returns & Refunds',
      icon: RefreshCw,
      q: 'What is your return protocol and guarantee?',
      a: 'We extend a 30-day effortless return window from the day your package is signed for. Items must be returned in original packaging with intact security seals. Return shipping is prepaid by Novacart for all domestic orders.',
    },
    {
      category: 'Authenticity & Warranty',
      icon: ShieldCheck,
      q: 'Are all products authentic with warranty coverage?',
      a: 'Every item on Novacart is 100% certified authentic, sourced directly from manufacturers and authorized ateliers. All electronics, timepieces, and hardware are backed by our 2-Year Official Comprehensive Warranty.',
    },
    {
      category: 'Payments & Billing',
      icon: CreditCard,
      q: 'What payment methods do you accept?',
      a: 'We accept Visa, Mastercard, American Express, Cash on Delivery (COD), and regional digital wallets including bKash and Nagad. All online card transactions are protected via 256-bit TLS bank-level encryption.',
    },
    {
      category: 'Orders & Tracking',
      icon: HelpCircle,
      q: 'How can I track my order once placed?',
      a: 'You can track your consignment in real-time by entering your Novacart Order Number or Courier Tracking Code on our Track Order page (/track-order), or through your Account Dashboard under "My Orders".',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600">
              Help Center & Knowledge Base
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#0B132B] mt-1">
              Frequently Asked Questions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Everything you need to know about purchasing, warranties, shipping, and returns.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              const Icon = faq.icon;
              return (
                <div key={idx} className="p-6 transition-colors hover:bg-slate-50/50">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm sm:text-base text-[#0B132B]">
                        {faq.q}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="pt-4 pl-11 text-xs sm:text-sm text-slate-600 leading-relaxed animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
