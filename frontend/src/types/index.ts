export type Role = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  phone: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  area: string;
  postalCode: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon?: string;
  productCount: number;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  colorName: string;
  colorHex: string;
  size?: string;
  storage?: string;
  ram?: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  brandId?: string;
  categoryId: string;
  categoryName: string;
  subcategoryId?: string;
  subcategoryName?: string;
  basePrice: number;
  originalPrice: number;
  discount: number;
  stock: number;
  sku: string;
  shortDescription: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  images: string[];
  variants: ProductVariant[];
  tags: string[];
  rating: number;
  reviewCount: number;
  salesCount: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  isPublished: boolean;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  price: number;
  discount: number;
  image: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  order: number;
  startDate?: string;
  endDate?: string;
  type?: 'HERO' | 'CAMPAIGN' | 'ANNOUNCEMENT';
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  variantId?: string;
  variantSku?: string;
  variantColor?: string;
  variantSize?: string;
  variantStorage?: string;
  price: number;
  quantity: number;
  total: number;
}

export type PaymentMethod = 'COD' | 'CARD' | 'BKASH' | 'NAGAD';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface OrderTimeline {
  status: OrderStatus;
  title: string;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    area: string;
    postalCode: string;
  };
  deliveryNote?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber: string;
  timeline: OrderTimeline[];
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId?: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  variantId?: string;
  variantSku?: string;
  colorName?: string;
  colorHex?: string;
  size?: string;
  storage?: string;
  price: number;
  originalPrice: number;
  quantity: number;
  maxStock: number;
}
