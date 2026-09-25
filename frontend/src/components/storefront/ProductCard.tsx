'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { t } = useLanguage();

  // Selected variant / image
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [isHovered, setIsHovered] = useState(false);

  const isFavorite = isInWishlist(product.id);

  // Compute image to display
  const currentImage =
    selectedVariant?.images?.[0] || product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';
  const secondaryImage =
    selectedVariant?.images?.[1] || product.images[1] || currentImage;

  const displayPrice = selectedVariant ? selectedVariant.price : product.basePrice;
  const originalPrice = product.originalPrice;
  const discountPercent =
    originalPrice > displayPrice
      ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
      : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      productImage: currentImage,
      variantId: selectedVariant?.id,
      variantSku: selectedVariant?.sku || product.sku,
      colorName: selectedVariant?.colorName,
      colorHex: selectedVariant?.colorHex,
      size: selectedVariant?.size ?? undefined,
      storage: selectedVariant?.storage ?? undefined,
      price: displayPrice,
      originalPrice,
      quantity: 1,
      maxStock: selectedVariant?.stock ?? product.stock,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      className="group relative bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Box */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square w-full bg-slate-50 overflow-hidden block"
      >
        <Image
          src={isHovered && secondaryImage ? secondaryImage : currentImage}
          alt={product.name}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="px-2.5 py-1 text-[11px] font-extrabold tracking-wide uppercase bg-rose-600 text-white rounded-md shadow-xs">
              -{discountPercent}%
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase bg-[#0B132B] text-white rounded-md shadow-xs">
              {t('bestsellerRank')}
            </span>
          )}
          {product.isNew && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase bg-emerald-600 text-white rounded-md shadow-xs">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-xs ${
            isFavorite
              ? 'bg-rose-50 text-rose-600 scale-110'
              : 'bg-white/90 backdrop-blur-xs text-slate-400 hover:text-rose-600 hover:bg-white'
          }`}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick Add To Cart Floating Overlay on Desktop */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 hidden sm:block">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2.5 px-4 bg-[#0B132B] hover:bg-blue-600 text-white rounded-xl text-xs font-bold tracking-wide shadow-lg flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            {t('addToBag')}
          </button>
        </div>
      </Link>

      {/* Info Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-medium">
            <span>{product.brand}</span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 text-[11px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.slug}`} className="block group/title">
            <h3 className="font-bold text-sm sm:text-base text-[#0B132B] group-hover/title:text-blue-600 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="pt-3 mt-2 border-t border-slate-50 flex flex-col gap-2">
          {/* Color Swatches */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex items-center gap-1.5 py-0.5">
              {product.variants.slice(0, 5).map((variant) => (
                <button
                  key={variant.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedVariant(variant);
                  }}
                  title={variant.colorName}
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${
                    selectedVariant?.id === variant.id
                      ? 'ring-2 ring-blue-600 ring-offset-1 border-white scale-110'
                      : 'border-slate-300 hover:scale-110'
                  }`}
                  style={{ backgroundColor: variant.colorHex || '#000' }}
                  aria-label={variant.colorName}
                />
              ))}
              {product.variants.length > 5 && (
                <span className="text-[10px] text-slate-400 font-medium">
                  +{product.variants.length - 5}
                </span>
              )}
            </div>
          )}

          {/* Price & Mobile Add Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-extrabold text-[#0B132B]">
                {formatPrice(displayPrice)}
              </span>
              {originalPrice > displayPrice && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>

            {/* Mobile quick add button */}
            <button
              onClick={handleQuickAdd}
              className="sm:hidden p-2 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
