export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  subcategories: {
    id: string;
    name: string;
    slug: string;
    childCategories: {
      id: string;
      name: string;
      slug: string;
    }[];
  }[];
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
}

export interface ProductVariant {
  id?: string;
  color?: string;
  size?: string;
  ram?: string;
  storage?: string;
  image?: string;
  price?: number;
  stock?: number;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  slug: string;
  categoryId: string;
  subcategoryId?: string;
  childCategoryId?: string;
  brandId?: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice?: number;
  costPrice: number;
  discountPercent?: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  lowStockAlertLimit: number;
  gallery: string[];
  videoUrl?: string;
  tags: string[];
  weight?: string;
  sizes?: string[];
  colors?: string[];
  ram?: string[];
  storage?: string[];
  variants?: ProductVariant[];
  specifications: { key: string; value: string }[];
  isFeatured?: boolean;
  isBestSelling?: boolean;
  isNewArrival?: boolean;
  isTrending?: boolean;
  seoTitle?: string;
  metaDescription?: string;
  deliveryInsideDhaka?: number;
  deliveryOutsideDhaka?: number;
  deliveryTime?: string;
  eventId?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: {
    size?: string;
    color?: string;
    ram?: string;
    storage?: string;
  };
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
  paymentMethod: 'COD' | 'bKash' | 'Nagad' | 'Rocket' | 'SSLCommerz' | 'Stripe';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  deliveryStatus: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Returned' | 'Cancelled';
  date: string;
  riskScore: number; // 0 to 100
  riskReasons: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  courier?: {
    api: 'Steadfast' | 'Pathao' | 'RedX' | 'Sundarban' | 'Paperfly';
    trackingId?: string;
    requestSent: boolean;
    sentAt?: string;
    status: string;
  };
  deviceInfo: string;
  ipAddress: string;
  deliveryCharge?: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  ordersCount: number;
  totalSpent: number;
  isBlacklisted: boolean;
  riskCount: number;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  isActive: boolean;
  expiryDate: string;
}

export interface AppSettings {
  // Brand & Identity
  siteName: string;
  siteLogo: string;
  siteFavicon: string;
  
  // Theme & Colors
  primaryColor: string;
  headerColor: string;
  footerColor: string;
  headerTextColor: string;
  footerTextColor: string;
  
  // Contact & Social
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  
  // Footer Content
  footerText: string;
  copyrightText: string;

  // Operational Settings
  otpVerificationEnabled: boolean;
  autoCourierRequest: boolean;
  defaultCourier: 'Steadfast' | 'Pathao' | 'RedX' | 'Sundarban' | 'Paperfly';
  maxOrdersPerPhonePerHour: number;
  lowStockThreshold: number;
  
  // Integration Keys
  smsGatewayUrl: string;
  smsApiKey: string;
  smsSenderId?: string;
  sslStoreId?: string;
  sslStorePass?: string;
  sslIsLive?: boolean;
  fbPixelId: string;
  googleAnalyticsId: string;
  googleClientId?: string;
  facebookAppId?: string;
  
  // Specific Integrations
  bulkSmsApiKey?: string;
  bulkSmsSenderId?: string;

  // PWA Configurations
  pwaName?: string;
  pwaShortName?: string;
  pwaIconUrl?: string;
  pwaStartUrl?: string;
}

export interface QuestionAnswer {
  id: string;
  productId: string;
  question: string;
  answer?: string;
  askedBy: string;
  answeredBy?: string;
  createdAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  tags: string[];
}

export interface HeroBanner {
  id: string;
  image: string;
  targetCategoryId: string | null;
}

export interface MainCategory {
  id: string;
  name: string;
  icon: string;
  banner: string;
  url: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  badge1: string;
  badge2: string;
  image: string;
  targetUrl?: string;
  targetCategoryId?: string | null;
}

export interface StoreEvent {
  id: string;
  title: string;
  icon: string;
  banner: string;
  targetUrl?: string;
  expiryTime?: string;
}

export interface ShopReel {
  id: string;
  title: string;
  handle: string;
  coverImage: string;
}
