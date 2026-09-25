'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  CreditCard,
  AlertCircle,
  Lock,
  ChevronLeft,
  DollarSign,
  Wallet,
} from 'lucide-react';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/lib/utils';
import { CartItem, PaymentMethod } from '@/types';
import { DIVISIONS, DISTRICTS } from '@/lib/address-data';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get('flow') === 'buy-now';
  const initialCoupon = searchParams.get('coupon') || '';

  const { items: cartItems, clearCart, subtotal: cartSubtotal } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);

  // Form Fields
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');

  // Shipping Address
  const [street, setStreet] = useState('');
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [thana, setThana] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');

  // Reset district when division changes
  useEffect(() => {
    setDistrict('');
  }, [division]);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');

  // Coupon
  const [couponCode, setCouponCode] = useState(initialCoupon);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isBuyNow) {
      try {
        const stored = sessionStorage.getItem('bdneeds_buy_now');
        if (stored) {
          const parsed = JSON.parse(stored);
          setCheckoutItems(parsed);
          const total = parsed.reduce(
            (sum: number, i: CartItem) => sum + i.price * i.quantity,
            0
          );
          setSubtotal(total);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setCheckoutItems(cartItems);
      setSubtotal(cartSubtotal);
    }
  }, [isBuyNow, cartItems, cartSubtotal]);

  useEffect(() => {
    if (initialCoupon && subtotal > 0 && !appliedCoupon) {
      fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: initialCoupon, subtotal }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setAppliedCoupon({ code: data.code, discount: data.discount });
          }
        })
        .catch(() => {});
    }
  }, [initialCoupon, subtotal, appliedCoupon]);

  // Calculate dynamic shipping fee: Inside Dhaka = 70, Outside = 130
  const isDhaka = district === 'Dhaka';
  let baseShipping = isDhaka ? 70 : 130;
  
  const shippingFee =
    subtotal >= 2000 || subtotal === 0 // Assuming free shipping threshold is 2000
      ? 0
      : baseShipping;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = Number((taxableAmount * 0.05).toFixed(2));
  const finalTotal = Number((taxableAmount + shippingFee + tax).toFixed(2));

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (checkoutItems.length === 0) {
      setErrorMessage('No items in checkout. Please select a product.');
      return;
    }

    if (!customerName || !customerEmail || !customerPhone) {
      setErrorMessage('Please provide your full contact information.');
      return;
    }

    if (!street || !division || !district || !thana) {
      setErrorMessage('Please complete all required shipping address fields (Division, District, Thana, Street).');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        userId: user?.id,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress: {
          fullName: customerName,
          phone: customerPhone,
          street,
          city: district,
          area: thana,
          postalCode: postalCode || '0000',
        },
        deliveryNote,
        items: checkoutItems.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
        couponCode: appliedCoupon?.code,
        paymentMethod,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete order');
      }

      if (isBuyNow) {
        sessionStorage.removeItem('bdneeds_buy_now');
      } else {
        clearCart();
      }

      router.push(`/order-success?orderId=${data.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-2"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              {t('shoppingBag')}
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B132B]">
              {t('checkoutTitle')}
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        {checkoutItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 max-w-lg mx-auto">
            <p className="text-sm font-semibold text-slate-600 mb-4">
              {t('cartEmptyTitle')}
            </p>
            <Link
              href="/shop"
              className="px-6 py-2.5 bg-[#0B132B] text-white rounded-xl text-xs font-bold"
            >
              {t('continueShopping')}
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Forms */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Customer Information */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-2xs">
                <h3 className="text-base font-bold text-[#0B132B] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                    1
                  </span>
                  {t('shippingAddress')}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('fullName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Tanvir Ahmed"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('phoneNumber')} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+880 1700-000000"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('emailAddress')} *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="customer@example.com"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Delivery Address */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-2xs">
                <h3 className="text-base font-bold text-[#0B132B] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                    2
                  </span>
                  {t('streetAddress')}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('streetAddress')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="House 12, Road 5, Block B, Banani"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Division *
                    </label>
                    <select
                      required
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    >
                      <option value="">Select Division</option>
                      {DIVISIONS.map(div => <option key={div} value={div}>{div}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      District *
                    </label>
                    <select
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      disabled={!division}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:opacity-50"
                    >
                      <option value="">Select District</option>
                      {division && DISTRICTS[division]?.map(dist => <option key={dist} value={dist}>{dist}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Thana / Upazila *
                    </label>
                    <input
                      type="text"
                      required
                      value={thana}
                      onChange={(e) => setThana(e.target.value)}
                      placeholder="e.g. Gulshan, Banani, Sadar"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('postalCode')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="1213"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('orderNotes')}
                    </label>
                    <input
                      type="text"
                      value={deliveryNote}
                      onChange={(e) => setDeliveryNote(e.target.value)}
                      placeholder="Special delivery notes..."
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Delivery Method */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-2xs">
                <h3 className="text-base font-bold text-[#0B132B] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                    3
                  </span>
                  {t('deliveryMethod')}
                </h3>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  <label
                    className="flex items-start gap-3 p-4 rounded-2xl border border-blue-600 bg-blue-50/40 text-[#0B132B] transition-all"
                  >
                    <input
                      type="radio"
                      name="delivery"
                      checked={true}
                      readOnly
                      className="mt-0.5 text-blue-600"
                    />
                    <div>
                      <div className="text-xs font-bold">{t('standardDelivery')}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Dhaka (24-48 hrs), Nationwide (2-3 days)
                      </div>
                      <div className="text-xs font-bold text-blue-600 mt-1">
                        {subtotal >= 2000 ? t('free') : formatPrice(isDhaka ? 70 : 130)}
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* 4. Payment Methods */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-2xs">
                <h3 className="text-base font-bold text-[#0B132B] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                    4
                  </span>
                  {t('paymentMethod')}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <label
                    className={`p-4 rounded-2xl border cursor-pointer flex items-start gap-3 transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-blue-600 bg-blue-50/40'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="mt-1 text-blue-600"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-800">
                          {t('cashOnDelivery')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {t('cashOnDeliveryDesc')}
                      </p>
                    </div>
                  </label>

                  <label
                    className={`p-4 rounded-2xl border cursor-pointer flex items-start gap-3 transition-all ${
                      paymentMethod === 'CARD'
                        ? 'border-blue-600 bg-blue-50/40'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'CARD'}
                      onChange={() => setPaymentMethod('CARD')}
                      className="mt-1 text-blue-600"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-slate-800">
                          {t('creditCard')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Visa, Mastercard, Amex secured instant authorization.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`p-4 rounded-2xl border cursor-pointer flex items-start gap-3 transition-all ${
                      paymentMethod === 'BKASH'
                        ? 'border-[#E2136E] bg-pink-50/40'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'BKASH'}
                      onChange={() => setPaymentMethod('BKASH')}
                      className="mt-1 text-[#E2136E]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-[#E2136E]" />
                        <span className="text-xs font-bold text-slate-800">
                          bKash (বিকাশ)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Direct digital settlement via bKash mobile financial wallet.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`p-4 rounded-2xl border cursor-pointer flex items-start gap-3 transition-all ${
                      paymentMethod === 'NAGAD'
                        ? 'border-[#F7941D] bg-orange-50/40'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'NAGAD'}
                      onChange={() => setPaymentMethod('NAGAD')}
                      className="mt-1 text-[#F7941D]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-[#F7941D]" />
                        <span className="text-xs font-bold text-slate-800">
                          Nagad (নগদ)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Instant checkout using your Nagad account.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Review Box & Place Order */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs sticky top-28">
                <h3 className="text-base font-bold text-[#0B132B] pb-3 border-b border-slate-100 flex items-center justify-between">
                  <span>{t('orderSummary')}</span>
                  <span className="text-xs font-normal text-slate-400">
                    {checkoutItems.length} {t('productsCount')}
                  </span>
                </h3>

                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="py-3 flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#0B132B] truncate">
                          {item.productName}
                        </p>
                        <div className="text-[11px] text-slate-400 flex gap-2">
                          {item.colorName && <span>{item.colorName}</span>}
                          {item.size && <span>• {item.size}</span>}
                          <span>• Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-[#0B132B]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5 text-xs pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>{t('subtotal')}</span>
                    <span className="font-semibold text-slate-800">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>{t('discount')} ({appliedCoupon.code})</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>{t('shipping')}</span>
                    <span className="font-semibold text-slate-800">
                      {shippingFee === 0 ? (
                        <span className="text-emerald-600 uppercase font-bold">
                          {t('free')}
                        </span>
                      ) : (
                        formatPrice(shippingFee)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>{t('estimatedTax')}</span>
                    <span className="font-semibold text-slate-800">
                      {formatPrice(tax)}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-[#0B132B]">{t('total')}</span>
                    <span className="text-2xl font-black text-[#0B132B]">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold text-center transition-all shadow-md hover:shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">{t('processingOrder')}</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      {t('completeOrder')} • {formatPrice(finalTotal)}
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  By confirming your order, you agree to BdNeeds&apos;s terms of trade.
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <AnnouncementBar />
      <Header />
      <Suspense fallback={<div className="p-20 text-center text-sm font-semibold">Loading checkout terminal...</div>}>
        <CheckoutContent />
      </Suspense>
      <Footer />
    </div>
  );
}
