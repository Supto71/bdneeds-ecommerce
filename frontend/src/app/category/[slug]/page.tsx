import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import MobileBottomNav from '@/components/storefront/MobileBottomNav';
import ShopCatalog from '@/components/storefront/ShopCatalog';
import { getProducts, getCategories, getCategoryBySlug } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function CategoryPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const [products, categories] = await Promise.all([
    getProducts({ category: category.id }),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="p-20 text-center text-xs font-semibold text-slate-400">Loading department...</div>}>
          <ShopCatalog
            initialProducts={products}
            categories={categories}
            initialCategorySlug={category.id}
            title={category.name}
            subtitle={category.description || `Explore our curated selection of ${category.name}.`}
          />
        </Suspense>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
