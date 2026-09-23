import fs from 'fs';
import path from 'path';
import {
  Category,
  Product,
  Banner,
  Coupon,
  Order,
  Review,
  User,
  OrderStatus,
  PaymentStatus,
  ProductVariant,
} from '@/types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_BANNERS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
  INITIAL_USERS,
} from './seed-data';

interface DatabaseSchema {
  categories: Category[];
  products: Product[];
  banners: Banner[];
  coupons: Coupon[];
  reviews: Review[];
  orders: Order[];
  users: User[];
  settings: {
    storeName: string;
    currency: string;
    shippingFee: number;
    freeShippingThreshold: number;
    taxRate: number;
    contactEmail: string;
    contactPhone: string;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'novacart-db.json');

function ensureDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      banners: INITIAL_BANNERS,
      coupons: INITIAL_COUPONS,
      reviews: INITIAL_REVIEWS,
      orders: INITIAL_ORDERS,
      users: INITIAL_USERS,
      settings: {
        storeName: 'NOVACART',
        currency: 'USD',
        shippingFee: 15,
        freeShippingThreshold: 99,
        taxRate: 0.08,
        contactEmail: 'concierge@novacart.com',
        contactPhone: '+1 (800) 555-NOVA',
      },
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to read database, restoring seed data', error);
    const fallback: DatabaseSchema = {
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      banners: INITIAL_BANNERS,
      coupons: INITIAL_COUPONS,
      reviews: INITIAL_REVIEWS,
      orders: INITIAL_ORDERS,
      users: INITIAL_USERS,
      settings: {
        storeName: 'NOVACART',
        currency: 'USD',
        shippingFee: 15,
        freeShippingThreshold: 99,
        taxRate: 0.08,
        contactEmail: 'concierge@novacart.com',
        contactPhone: '+1 (800) 555-NOVA',
      },
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
}

function saveDatabase(data: DatabaseSchema) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ==========================================
// PRODUCTS API
// ==========================================

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  rating?: number;
  inStock?: boolean;
  color?: string;
  sortBy?:
    | 'featured'
    | 'best-selling'
    | 'newest'
    | 'price-low-high'
    | 'price-high-low'
    | 'rating';
}

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  const db = ensureDatabase();
  let result = [...db.products].filter((p) => p.isPublished);

  if (filters?.category) {
    result = result.filter(
      (p) =>
        p.categoryId.toLowerCase() === filters.category!.toLowerCase() ||
        p.categoryName.toLowerCase() === filters.category!.toLowerCase()
    );
  }

  if (filters?.brand) {
    result = result.filter(
      (p) => p.brand.toLowerCase() === filters.brand!.toLowerCase()
    );
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.shortDescription.toLowerCase().includes(q)
    );
  }

  if (filters?.minPrice !== undefined) {
    result = result.filter((p) => p.basePrice >= filters.minPrice!);
  }

  if (filters?.maxPrice !== undefined) {
    result = result.filter((p) => p.basePrice <= filters.maxPrice!);
  }

  if (filters?.rating !== undefined && filters.rating > 0) {
    result = result.filter((p) => p.rating >= filters.rating!);
  }

  if (filters?.inStock) {
    result = result.filter((p) => p.stock > 0);
  }

  if (filters?.color) {
    const targetColor = filters.color.toLowerCase();
    result = result.filter((p) =>
      p.variants.some((v) => v.colorName.toLowerCase().includes(targetColor))
    );
  }

  // Sort
  switch (filters?.sortBy) {
    case 'best-selling':
      result.sort((a, b) => b.salesCount - a.salesCount);
      break;
    case 'newest':
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case 'price-low-high':
      result.sort((a, b) => a.basePrice - b.basePrice);
      break;
    case 'price-high-low':
      result.sort((a, b) => b.basePrice - a.basePrice);
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'featured':
    default:
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      break;
  }

  return result;
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  const db = ensureDatabase();
  return db.products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = ensureDatabase();
  return db.products.find((p) => p.slug === slug) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = ensureDatabase();
  return db.products.find((p) => p.id === id) || null;
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit = 4
): Promise<Product[]> {
  const db = ensureDatabase();
  return db.products
    .filter((p) => p.id !== productId && p.categoryId === categoryId && p.isPublished)
    .slice(0, limit);
}

export async function createProduct(data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
  const db = ensureDatabase();
  const newProduct: Product = {
    ...data,
    id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };

  db.products.unshift(newProduct);

  // Update category product count
  const cat = db.categories.find((c) => c.id === newProduct.categoryId);
  if (cat) {
    cat.productCount = db.products.filter((p) => p.categoryId === cat.id).length;
  }

  saveDatabase(db);
  return newProduct;
}

export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<Product | null> {
  const db = ensureDatabase();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  db.products[index] = {
    ...db.products[index],
    ...data,
  };

  saveDatabase(db);
  return db.products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = ensureDatabase();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return false;

  const [deleted] = db.products.splice(index, 1);

  // Update category product count
  const cat = db.categories.find((c) => c.id === deleted.categoryId);
  if (cat) {
    cat.productCount = db.products.filter((p) => p.categoryId === cat.id).length;
  }

  saveDatabase(db);
  return true;
}

// ==========================================
// CATEGORIES API
// ==========================================

export async function getCategories(): Promise<Category[]> {
  const db = ensureDatabase();
  return db.categories
    .filter((c) => c.isActive)
    .sort((a, b) => a.order - b.order);
}

export async function getAllCategoriesAdmin(): Promise<Category[]> {
  const db = ensureDatabase();
  return db.categories.sort((a, b) => a.order - b.order);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const db = ensureDatabase();
  return db.categories.find((c) => c.slug === slug) || null;
}

export async function createCategory(data: Omit<Category, 'id'>): Promise<Category> {
  const db = ensureDatabase();
  const newCat: Category = {
    ...data,
    id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  };
  db.categories.push(newCat);
  saveDatabase(db);
  return newCat;
}

export async function updateCategory(
  id: string,
  data: Partial<Category>
): Promise<Category | null> {
  const db = ensureDatabase();
  const index = db.categories.findIndex((c) => c.id === id);
  if (index === -1) return null;

  db.categories[index] = { ...db.categories[index], ...data };
  saveDatabase(db);
  return db.categories[index];
}

export async function deleteCategory(id: string): Promise<boolean> {
  const db = ensureDatabase();
  const index = db.categories.findIndex((c) => c.id === id);
  if (index === -1) return false;

  db.categories.splice(index, 1);
  saveDatabase(db);
  return true;
}

// ==========================================
// BANNERS API
// ==========================================

export async function getBanners(): Promise<Banner[]> {
  const db = ensureDatabase();
  return db.banners
    .filter((b) => b.isActive)
    .sort((a, b) => a.order - b.order);
}

export async function getAllBannersAdmin(): Promise<Banner[]> {
  const db = ensureDatabase();
  return db.banners.sort((a, b) => a.order - b.order);
}

export async function createBanner(data: Omit<Banner, 'id'>): Promise<Banner> {
  const db = ensureDatabase();
  const newBanner: Banner = {
    ...data,
    id: `banner-${Date.now()}`,
  };
  db.banners.push(newBanner);
  saveDatabase(db);
  return newBanner;
}

export async function updateBanner(
  id: string,
  data: Partial<Banner>
): Promise<Banner | null> {
  const db = ensureDatabase();
  const index = db.banners.findIndex((b) => b.id === id);
  if (index === -1) return null;

  db.banners[index] = { ...db.banners[index], ...data };
  saveDatabase(db);
  return db.banners[index];
}

export async function deleteBanner(id: string): Promise<boolean> {
  const db = ensureDatabase();
  const index = db.banners.findIndex((b) => b.id === id);
  if (index === -1) return false;

  db.banners.splice(index, 1);
  saveDatabase(db);
  return true;
}

// ==========================================
// ORDERS & CHECKOUT ENGINE
// ==========================================

export async function getOrders(userId?: string): Promise<Order[]> {
  const db = ensureDatabase();
  if (userId) {
    return db.orders
      .filter((o) => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  return db.orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getOrderById(id: string): Promise<Order | null> {
  const db = ensureDatabase();
  return (
    db.orders.find(
      (o) =>
        o.id === id ||
        o.orderNumber.toLowerCase() === id.toLowerCase() ||
        o.trackingNumber.toLowerCase() === id.toLowerCase()
    ) || null
  );
}

export interface CreateOrderInput {
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
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
  couponCode?: string;
  paymentMethod: 'COD' | 'CARD' | 'BKASH' | 'NAGAD';
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const db = ensureDatabase();

  // Validate items and calculate prices server-side
  let subtotal = 0;
  const resolvedItems = [];

  for (const itemInput of input.items) {
    const product = db.products.find((p) => p.id === itemInput.productId);
    if (!product) {
      throw new Error(`Product ${itemInput.productId} not found.`);
    }

    let unitPrice = product.basePrice;
    let variantDetails: Partial<ProductVariant> = {};
    let variantSku = product.sku;

    if (itemInput.variantId) {
      const variant = product.variants.find((v) => v.id === itemInput.variantId);
      if (!variant) {
        throw new Error(`Variant ${itemInput.variantId} not found.`);
      }
      if (variant.stock < itemInput.quantity) {
        throw new Error(`Insufficient stock for ${product.name} (${variant.colorName}).`);
      }

      // Decrement variant stock
      variant.stock -= itemInput.quantity;
      unitPrice = variant.price;
      variantSku = variant.sku;
      variantDetails = variant;
    } else {
      if (product.stock < itemInput.quantity) {
        throw new Error(`Insufficient stock for ${product.name}.`);
      }
    }

    // Decrement overall product stock and increase salesCount
    product.stock = Math.max(0, product.stock - itemInput.quantity);
    product.salesCount = (product.salesCount || 0) + itemInput.quantity;

    // Dynamically mark as best seller if sales threshold crossed
    if (product.salesCount >= 50) {
      product.isBestSeller = true;
    }

    const itemTotal = unitPrice * itemInput.quantity;
    subtotal += itemTotal;

    resolvedItems.push({
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      productImage: variantDetails.images?.[0] || product.images[0],
      variantId: itemInput.variantId,
      variantSku,
      variantColor: variantDetails.colorName,
      variantSize: variantDetails.size,
      variantStorage: variantDetails.storage,
      price: unitPrice,
      quantity: itemInput.quantity,
      total: itemTotal,
    });
  }

  // Calculate discount if coupon applied
  let discount = 0;
  if (input.couponCode) {
    const coupon = db.coupons.find(
      (c) => c.code.toUpperCase() === input.couponCode!.toUpperCase() && c.isActive
    );
    if (coupon) {
      if (subtotal >= coupon.minOrderValue) {
        if (coupon.discountType === 'PERCENTAGE') {
          discount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          discount = Math.min(subtotal, coupon.discountValue);
        }
        coupon.usedCount += 1;
      }
    }
  }

  const shippingFee =
    subtotal - discount >= db.settings.freeShippingThreshold
      ? 0
      : db.settings.shippingFee;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Number((taxableAmount * db.settings.taxRate).toFixed(2));
  const total = Number((taxableAmount + shippingFee + tax).toFixed(2));

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `NC-${new Date().getFullYear()}-${randomNum}`;
  const trackingNumber = `NV-${Math.floor(10000000 + Math.random() * 90000000)}-US`;

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber,
    userId: input.userId,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    shippingAddress: input.shippingAddress,
    deliveryNote: input.deliveryNote,
    items: resolvedItems,
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    couponCode: input.couponCode,
    shippingFee,
    tax,
    total,
    paymentMethod: input.paymentMethod,
    paymentStatus: input.paymentMethod === 'COD' ? 'PENDING' : 'PAID',
    orderStatus: 'PENDING',
    trackingNumber,
    timeline: [
      {
        status: 'PENDING',
        title: 'Order Placed',
        timestamp: new Date().toISOString(),
        note: `Order registered successfully via ${input.paymentMethod}.`,
      },
    ],
    createdAt: new Date().toISOString(),
  };

  db.orders.unshift(newOrder);
  saveDatabase(db);
  return newOrder;
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  note?: string,
  paymentStatus?: PaymentStatus
): Promise<Order | null> {
  const db = ensureDatabase();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return null;

  order.orderStatus = newStatus;
  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
  }

  const statusTitles: Record<OrderStatus, string> = {
    PENDING: 'Order Placed',
    CONFIRMED: 'Order Confirmed',
    PROCESSING: 'Processing & Packing',
    SHIPPED: 'Dispatched with Courier',
    OUT_FOR_DELIVERY: 'Out for Final Delivery',
    DELIVERED: 'Successfully Delivered',
    CANCELLED: 'Order Cancelled',
    REFUNDED: 'Payment Refunded',
  };

  order.timeline.push({
    status: newStatus,
    title: statusTitles[newStatus] || newStatus,
    timestamp: new Date().toISOString(),
    note: note || `Status updated to ${newStatus}.`,
  });

  saveDatabase(db);
  return order;
}

// ==========================================
// INVENTORY & STOCK MANAGEMENT
// ==========================================

export async function getInventoryStatus() {
  const db = ensureDatabase();
  const inventoryItems: {
    productId: string;
    productName: string;
    variantId?: string;
    sku: string;
    colorName?: string;
    size?: string;
    stock: number;
    lowStockThreshold: number;
    isLowStock: boolean;
    isOutOfStock: boolean;
  }[] = [];

  for (const p of db.products) {
    if (p.variants && p.variants.length > 0) {
      for (const v of p.variants) {
        inventoryItems.push({
          productId: p.id,
          productName: p.name,
          variantId: v.id,
          sku: v.sku,
          colorName: v.colorName,
          size: v.size,
          stock: v.stock,
          lowStockThreshold: v.lowStockThreshold || 5,
          isLowStock: v.stock > 0 && v.stock <= (v.lowStockThreshold || 5),
          isOutOfStock: v.stock <= 0,
        });
      }
    } else {
      inventoryItems.push({
        productId: p.id,
        productName: p.name,
        sku: p.sku,
        stock: p.stock,
        lowStockThreshold: 5,
        isLowStock: p.stock > 0 && p.stock <= 5,
        isOutOfStock: p.stock <= 0,
      });
    }
  }

  return inventoryItems;
}

export async function updateStock(
  productId: string,
  variantId: string | undefined,
  newStock: number
): Promise<boolean> {
  const db = ensureDatabase();
  const product = db.products.find((p) => p.id === productId);
  if (!product) return false;

  if (variantId) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) return false;
    variant.stock = Math.max(0, newStock);
    // update total product stock
    product.stock = product.variants.reduce((acc, curr) => acc + curr.stock, 0);
  } else {
    product.stock = Math.max(0, newStock);
  }

  saveDatabase(db);
  return true;
}

// ==========================================
// REVIEWS & MODERATION
// ==========================================

export async function getReviews(productId: string): Promise<Review[]> {
  const db = ensureDatabase();
  return db.reviews
    .filter((r) => r.productId === productId && r.isApproved)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getAllReviewsAdmin(): Promise<Review[]> {
  const db = ensureDatabase();
  return db.reviews.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createReview(
  data: Omit<Review, 'id' | 'createdAt' | 'isApproved'>
): Promise<Review> {
  const db = ensureDatabase();

  // Check if customer actually placed an order for verified purchase badge
  const hasPurchased = db.orders.some(
    (o) =>
      o.userId === data.userId &&
      o.items.some((i) => i.productId === data.productId) &&
      o.orderStatus === 'DELIVERED'
  );

  const newReview: Review = {
    ...data,
    id: `rev-${Date.now()}`,
    isVerifiedPurchase: data.isVerifiedPurchase || hasPurchased,
    isApproved: true, // auto approve demo
    createdAt: new Date().toISOString(),
  };

  db.reviews.unshift(newReview);

  // Recalculate product rating
  const productReviews = db.reviews.filter((r) => r.productId === data.productId && r.isApproved);
  const avg =
    productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
  const product = db.products.find((p) => p.id === data.productId);
  if (product) {
    product.rating = Number(avg.toFixed(1));
    product.reviewCount = productReviews.length;
  }

  saveDatabase(db);
  return newReview;
}

export async function moderateReview(id: string, isApproved: boolean): Promise<boolean> {
  const db = ensureDatabase();
  const review = db.reviews.find((r) => r.id === id);
  if (!review) return false;

  review.isApproved = isApproved;
  saveDatabase(db);
  return true;
}

export async function deleteReview(id: string): Promise<boolean> {
  const db = ensureDatabase();
  const index = db.reviews.findIndex((r) => r.id === id);
  if (index === -1) return false;

  const [removed] = db.reviews.splice(index, 1);
  const productReviews = db.reviews.filter((r) => r.productId === removed.productId && r.isApproved);
  const product = db.products.find((p) => p.id === removed.productId);
  if (product) {
    product.rating =
      productReviews.length > 0
        ? Number(
            (
              productReviews.reduce((sum, r) => sum + r.rating, 0) /
              productReviews.length
            ).toFixed(1)
          )
        : 5.0;
    product.reviewCount = productReviews.length;
  }

  saveDatabase(db);
  return true;
}

// ==========================================
// COUPONS API
// ==========================================

export async function getCoupons(): Promise<Coupon[]> {
  const db = ensureDatabase();
  return db.coupons;
}

export async function validateCoupon(code: string, subtotal: number) {
  const db = ensureDatabase();
  const coupon = db.coupons.find(
    (c) => c.code.toUpperCase() === code.toUpperCase().trim() && c.isActive
  );

  if (!coupon) {
    return { valid: false, message: 'Invalid or inactive promotional code.' };
  }

  if (new Date(coupon.expiryDate).getTime() < Date.now()) {
    return { valid: false, message: 'This coupon has expired.' };
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, message: 'Coupon maximum redemption limit reached.' };
  }

  if (subtotal < coupon.minOrderValue) {
    return {
      valid: false,
      message: `Minimum order amount of BDT ${coupon.minOrderValue} required for this coupon.`,
    };
  }

  let discount = 0;
  if (coupon.discountType === 'PERCENTAGE') {
    discount = (subtotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = Math.min(subtotal, coupon.discountValue);
  }

  return {
    valid: true,
    code: coupon.code,
    discount: Number(discount.toFixed(2)),
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    message: `Coupon ${coupon.code} applied! Saved BDT ${discount.toFixed(2)}`,
  };
}

export async function createCoupon(data: Omit<Coupon, 'id' | 'usedCount'>): Promise<Coupon> {
  const db = ensureDatabase();
  const newCoupon: Coupon = {
    ...data,
    code: data.code.toUpperCase().trim(),
    id: `coup-${Date.now()}`,
    usedCount: 0,
  };
  db.coupons.unshift(newCoupon);
  saveDatabase(db);
  return newCoupon;
}

export async function deleteCoupon(id: string): Promise<boolean> {
  const db = ensureDatabase();
  const index = db.coupons.findIndex((c) => c.id === id);
  if (index === -1) return false;

  db.coupons.splice(index, 1);
  saveDatabase(db);
  return true;
}

// ==========================================
// ADMIN ANALYTICS
// ==========================================

export async function getAdminAnalytics() {
  const db = ensureDatabase();

  const totalRevenue = db.orders
    .filter((o) => o.orderStatus !== 'CANCELLED' && o.orderStatus !== 'REFUNDED')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = db.orders.filter((o) => o.orderStatus === 'PENDING').length;
  const completedOrders = db.orders.filter((o) => o.orderStatus === 'DELIVERED').length;
  const totalOrders = db.orders.length;
  const totalCustomers = db.users.filter((u) => u.role === 'CUSTOMER').length;

  const lowStockCount = db.products.reduce((count, p) => {
    const isLow = p.variants.some((v) => v.stock <= (v.lowStockThreshold || 5));
    return isLow ? count + 1 : count;
  }, 0);

  const bestSellingProducts = [...db.products]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 5);

  // Category sales breakdown
  const categorySales: Record<string, number> = {};
  for (const order of db.orders) {
    if (order.orderStatus === 'CANCELLED') continue;
    for (const item of order.items) {
      const prod = db.products.find((p) => p.id === item.productId);
      const catName = prod?.categoryName || 'Other';
      categorySales[catName] = (categorySales[catName] || 0) + item.total;
    }
  }

  // Monthly revenue mock curve based on real orders
  const revenueHistory = [
    { month: 'Apr', revenue: 14200 },
    { month: 'May', revenue: 18900 },
    { month: 'Jun', revenue: 24500 },
    { month: 'Jul', revenue: 31200 },
    { month: 'Aug', revenue: 38400 },
    { month: 'Sep', revenue: Math.round(totalRevenue + 41200) },
  ];

  return {
    totalRevenue: Number(totalRevenue.toFixed(2)),
    todayRevenue: Number((totalRevenue * 0.18).toFixed(2)),
    monthlyRevenue: Number((totalRevenue * 0.65).toFixed(2)),
    totalOrders,
    pendingOrders,
    completedOrders,
    totalCustomers,
    lowStockCount,
    bestSellingProducts,
    categorySales,
    revenueHistory,
  };
}

// ==========================================
// USERS & AUTH API
// ==========================================

export async function getUsers(): Promise<User[]> {
  const db = ensureDatabase();
  return db.users;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = ensureDatabase();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const db = ensureDatabase();
  return db.users.find((u) => u.id === id) || null;
}

export async function createUser(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  const db = ensureDatabase();
  const newUser: User = {
    ...data,
    id: `usr-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  saveDatabase(db);
  return newUser;
}
