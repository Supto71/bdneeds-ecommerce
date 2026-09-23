import React from 'react';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import HeroCarousel from '@/components/storefront/HeroCarousel';
import CategoryCarousel from '@/components/storefront/CategoryCarousel';
import BestSellersSection from '@/components/storefront/BestSellersSection';
import CampaignBanner from '@/components/storefront/CampaignBanner';
import NewArrivalsSection from '@/components/storefront/NewArrivalsSection';
import TrustSection from '@/components/storefront/TrustSection';
import Footer from '@/components/storefront/Footer';
import MobileBottomNav from '@/components/storefront/MobileBottomNav';
import { getBanners, getCategories, getProducts } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [banners, categories, products] = await Promise.all([
    getBanners(),
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* Dynamic Hero Carousel */}
        <HeroCarousel banners={banners} />

        {/* Dynamic Circular Category Slider */}
        <CategoryCarousel categories={categories} />

        {/* Best Sellers Section */}
        <BestSellersSection products={products} />

        {/* Editorial Campaign Banner */}
        <CampaignBanner />

        {/* New Arrivals Section */}
        <NewArrivalsSection products={products} />

        {/* Trust & Guarantees */}
        <TrustSection />
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
