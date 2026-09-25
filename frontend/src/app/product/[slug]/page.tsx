import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import MobileBottomNav from '@/components/storefront/MobileBottomNav';
import ProductDetailView from '@/components/storefront/ProductDetailView';
import { getProductBySlug, getReviews, getRelatedProducts } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | BDNEEDS`,
      description: product.shortDescription,
      images: [(product.images as string[])?.[0]],
    },
  };
}

export default async function ProductPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [reviews, relatedProducts] = await Promise.all([
    getReviews(product.id),
    getRelatedProducts(product.id, product.categoryId),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <ProductDetailView
          product={product}
          reviews={reviews as unknown as import('@/types').Review[]}
          relatedProducts={relatedProducts}
        />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
