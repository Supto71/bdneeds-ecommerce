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
      q: 'What are the delivery charges?',
      a: 'Our delivery charge is 70 BDT inside Dhaka and 130 BDT outside Dhaka.',
    },
    {
      category: 'Returns & Refunds',
      icon: RefreshCw,
      q: 'What is your return policy?',
      a: 'Products can be returned within a maximum of 7 days of delivery. However, the product must be unused, undamaged, and accompanied by its original packaging, tags, and invoice.',
    },
    {
      category: 'Returns & Refunds',
      icon: ShieldCheck,
      q: 'Are there any non-returnable items?',
      a: 'Used products, specific discounted items purchased during promotional offers, and customized products are generally non-returnable or non-exchangeable.',
    },
    {
      category: 'Returns & Refunds',
      icon: RefreshCw,
      q: 'How does the refund process work?',
      a: 'Once the returned product reaches our warehouse and passes quality checks, the refund will be processed within 7 to 10 working days. Refunds will be issued through the original payment method (bKash, card, or bank account). For Cash on Delivery (COD) orders, valid bank account or mobile wallet details must be provided.',
    },
    {
      category: 'Payments & Billing',
      icon: CreditCard,
      q: 'What payment methods do you accept?',
      a: 'We accept bKash and Nagad (01811277828), as well as Cash on Delivery (COD).',
    },
    {
      category: 'Privacy',
      icon: ShieldCheck,
      q: 'What is your privacy policy?',
      a: 'By using our website and services, you agree to our general terms and conditions. All customer personal data (name, phone number, address) is kept strictly confidential and is never shared with third parties.',
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
