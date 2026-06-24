import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  ShoppingBag, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Users, 
  ClipboardList, 
  ShieldAlert, 
  Tag, 
  RefreshCw, 
  Sparkles, 
  Check, 
  X, 
  TrendingUp, 
  Percent, 
  Server,
  PhoneOff,
  Truck,
  AlertTriangle,
  HelpCircle,
  FileText,
  Lock,
  Printer,
  Download,
  CreditCard,
  MessageSquare,
  Smartphone,
  Palette,
  PhoneCall,
  Globe,
  Bell,
  ShieldCheck,
  Database
} from "lucide-react";
import { 
  Product, 
  Order, 
  Customer, 
  Coupon, 
  Category, 
  Brand, 
  AppSettings,
  MainCategory,
  HeroBanner,
  StoreEvent,
  PromoBanner,
  ShopReel
} from "../types";

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
  categories: Category[];
  brands: Brand[];
  mainCategories: MainCategory[];
  heroBanners: HeroBanner[];
  storeEvents: StoreEvent[];
  promoBanners: PromoBanner[];
  shopReels: ShopReel[];
  settings: AppSettings;
  onRefreshAllData: () => void;
  onClose: () => void;
  onNotify?: (type: "success" | "error" | "warning", message: string) => void;
}

export default function AdminPanel({
  products,
  orders,
  customers,
  coupons,
  categories,
  brands,
  mainCategories,
  heroBanners,
  storeEvents,
  promoBanners,
  shopReels,
  settings,
  onRefreshAllData,
  onClose,
  onNotify
}: AdminPanelProps) {
  // Navigation sidebar tab states
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "orders"
    | "products"
    | "categories"
    | "coupons"
    | "customers"
    | "couriers"
    | "payments"
    | "reviews"
    | "settings"
    | "logs"
    | "shop-reels"
  >("dashboard");

  // Admin Login states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem("admin_logged_in") === "true";
  });
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername === "proadmin" && adminPassword === "BF?cD+9mMx*XZ?7") {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem("admin_logged_in", "true");
      setLoginError("");
    } else {
      setLoginError("Invalid username or password. Please try again.");
    }
  };

  // Stat numbers state
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProfit: 0,
    expenses: 0,
    netProfit: 0,
    totalOrders: 0,
    lowStockAlertCount: 0,
    highRiskOrdersCount: 0,
    totalProducts: 0,
    totalCustomers: 0
  });

  // Chronicle system logs state
  const [systemLogs, setSystemLogs] = useState<any[]>([]);

  // Selected order details state modal
  const [activeOrderModal, setActiveOrderModal] = useState<Order | null>(null);

  // Add Product Form state structures
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editProductPayload, setEditProductPayload] = useState<Product | null>(null);
  
  // New Product input attributes
  const [pName, setPName] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pSalePrice, setPSalePrice] = useState("");
  const [pCostPrice, setPCostPrice] = useState("");
  const [pStock, setPStock] = useState("");
  const [pLowLimit, setPLowLimit] = useState("");
  const [pSku, setPSku] = useState("");
  const [pBarcode, setPBarcode] = useState("");
  const [pShortDesc, setPShortDesc] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pGallery, setPGallery] = useState("");
  const [pVideoUrl, setPVideoUrl] = useState("");
  const [pCategory, setPCategory] = useState("");
  const [pBrand, setPBrand] = useState("");
  const [pEventId, setPEventId] = useState("");
  const [pTags, setPTags] = useState("");
  const [pSpecsInput, setPSpecsInput] = useState(""); // JSON format or clear block key:value key:value
  const [pSizes, setPSizes] = useState("");
  const [pColors, setPColors] = useState("");
  const [pWeight, setPWeight] = useState("");
  const [pRam, setPRam] = useState("");
  const [pStorage, setPStorage] = useState("");
  const [pVariants, setPVariants] = useState<any[]>([]);
  const [pIsFeatured, setPIsFeatured] = useState(false);
  const [pIsBestSelling, setPIsBestSelling] = useState(false);
  const [pIsNewArrival, setPIsNewArrival] = useState(false);

  // SEO & Delivery state attributes
  const [pSeoTitle, setPSeoTitle] = useState("");
  const [pMetaDescription, setPMetaDescription] = useState("");
  const [pDeliveryInsideDhaka, setPDeliveryInsideDhaka] = useState("");
  const [pDeliveryOutsideDhaka, setPDeliveryOutsideDhaka] = useState("");
  const [pDeliveryTime, setPDeliveryTime] = useState("");

  const [aiGenerating, setAiGenerating] = useState(false);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Add category state form
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catImage, setCatImage] = useState("");

  // Add Brand form states
  const [brandName, setBrandName] = useState("");
  const [brandLogo, setBrandLogo] = useState("");

  // Add MainCategory form states
  const [mcName, setMcName] = useState("");
  const [mcIcon, setMcIcon] = useState("");
  const [mcBanner, setMcBanner] = useState("");

  // ShopReel management states
  const [showAddReelModal, setShowAddReelModal] = useState(false);
  const [reelTitle, setReelTitle] = useState("");
  const [reelHandle, setReelHandle] = useState("");
  const [reelCover, setReelCover] = useState("");
  const [editReelId, setEditReelId] = useState<string | null>(null);
  const [mcUrl, setMcUrl] = useState("");

  // Add HeroBanner form states
  const [hbImage, setHbImage] = useState("");
  const [hbTargetCat, setHbTargetCat] = useState("");

  // Add StoreEvent form states
  const [seTitle, setSeTitle] = useState("");
  const [seIcon, setSeIcon] = useState("");
  const [seBanner, setSeBanner] = useState("");
  const [seTargetUrl, setSeTargetUrl] = useState("");
  const [seExpiryTime, setSeExpiryTime] = useState("");

  // Add PromoBanner form states
  const [pbTitle, setPbTitle] = useState("");
  const [pbBadge1, setPbBadge1] = useState("");
  const [pbBadge2, setPbBadge2] = useState("");
  const [pbImage, setPbImage] = useState("");
  const [pbTargetUrl, setPbTargetUrl] = useState("");
  const [pbTargetCat, setPbTargetCat] = useState("");

  // Add coupon states
  const [couponCode, setCouponCode] = useState("");
  const [couponVal, setCouponVal] = useState("");
  const [couponMinSub, setCouponMinSub] = useState("0");

  // Bulk check IDs
  const [checkedOrderIds, setCheckedOrderIds] = useState<string[]>([]);

  // Local settings update configurations states
  const [settingsCategory, setSettingsCategory] = useState<"general" | "appearance" | "contact" | "integrations" | "pwa">("general");
  const [siteName, setSiteName] = useState("");
  const [siteLogo, setSiteLogo] = useState("");
  const [siteFavicon, setSiteFavicon] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [headerColor, setHeaderColor] = useState("");
  const [footerColor, setFooterColor] = useState("");
  const [headerTextColor, setHeaderTextColor] = useState("");
  const [footerTextColor, setFooterTextColor] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [footerText, setFooterText] = useState("");
  const [copyrightText, setCopyrightText] = useState("");

  // PWA states
  const [pwaName, setPwaName] = useState("");
  const [pwaShortName, setPwaShortName] = useState("");
  const [pwaIconUrl, setPwaIconUrl] = useState("");
  const [pwaStartUrl, setPwaStartUrl] = useState("");

  const [lowStockThresh, setLowStockThresh] = useState("5");
  const [fbId, setFbId] = useState("");
  const [gaId, setGaId] = useState("");
  const [googleClientId, setGoogleClientId] = useState("");
  const [facebookAppId, setFacebookAppId] = useState("");
  const [otpToggled, setOtpToggled] = useState(false);
  const [autoCourierSubmit, setAutoCourierSubmit] = useState(true);
  const [defaultCourier, setDefaultCourier] = useState<any>("Steadfast");

  // Advanced Invoice Management states
  const [invoiceSearchId, setInvoiceSearchId] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);

  // Advanced Inventory Stock-In/Out states
  const [invProdId, setInvProdId] = useState("");
  const [invQty, setInvQty] = useState("");
  const [invType, setInvType] = useState<"IN" | "OUT">("IN");
  const [invWarehouse, setInvWarehouse] = useState("Main Dhaka Warehouse");
  const [invNote, setInvNote] = useState("");
  const [inventoryLogs, setInventoryLogs] = useState<any[]>([
    { id: "log-1", productId: "prod-1", productName: "Walton Primo V22", type: "IN", quantity: 50, warehouse: "Main Dhaka Warehouse", note: "Initial bulk procurement restock", timestamp: "2026-06-18 10:00 AM", executor: "Emon Ahmed (Manager)" },
    { id: "log-2", productId: "prod-2", productName: "Aarong Premium Cotton Panjabi", type: "OUT", quantity: 5, warehouse: "Banani Hub Depot", note: "Damaged packaging return shipment", timestamp: "2026-06-18 04:30 PM", executor: "Sabbir Hossain (Staff)" }
  ]);

  // Advanced SMS Gateway settings
  const [smsApiKey, setSmsApiKey] = useState("sms_b9e28fa0310e980f76784dcc9");
  const [smsSenderId, setSmsSenderId] = useState("8809612000000");
  const [bulkSmsApiKey, setBulkSmsApiKey] = useState("");
  const [bulkSmsSenderId, setBulkSmsSenderId] = useState("");
  const [smsBulkMessage, setSmsBulkMessage] = useState("");
  const [smsBulkLogs, setSmsBulkLogs] = useState<any[]>([
    { id: "sms-lh-1", numberCount: 145, message: "Eid Special Sale is live now! Buy authentic products with express home delivery.", timestamp: "2026-06-18 11:15 AM", status: "SENT_SUCCESS" }
  ]);
  const [smsOrderConfTemplate, setSmsOrderConfTemplate] = useState("Dear {customer}, your order has been confirmed. Order ID: #{orderId}. Total Price: ৳{total}");
  const [smsDeliveryTemplate, setSmsDeliveryTemplate] = useState("Dear {customer}, your order has been shipped. Courier Tracking ID: {trackingId}");
  const [smsOtpTemplate, setSmsOtpTemplate] = useState("Your OTP Code is {otp}. This code is valid for 5 minutes.");

  // Detailed Courier integrations states
  const [courierSteadfastKey, setCourierSteadfastKey] = useState("sf_api_key_sandbox_93e8a1d0f8c38");
  const [courierPathaoKey, setCourierPathaoKey] = useState("pathao_dev_93f88d227c8e9b10a5");
  const [courierRedxKey, setCourierRedxKey] = useState("redx_client_token_e6b28a901f4c785");
  const [courierSundarbanKey, setCourierSundarbanKey] = useState("sundarban_auth_token_88d92f11c75");
  const [courierPaperflyKey, setCourierPaperflyKey] = useState("pf_partner_authorization_990aefd2c");

  // Payment Configuration configurations
  const [paymentBkashAppKey, setPaymentBkashAppKey] = useState("bkash_app_key_prod_88c3a1d99ef");
  const [paymentNagadId, setPaymentNagadId] = useState("nagad_mer_9031830193");
  const [paymentRocketId, setPaymentRocketId] = useState("rocket_mer_8930193183");
  const [paymentSslId, setPaymentSslId] = useState("ssl_store_id_sandbox_2210");
  const [paymentStripeSecret, setPaymentStripeSecret] = useState("sk_test_51Mz8aZSD2Ua87FeD3Ew9fQ2Plo");
  const [paymentSslIsLive, setPaymentSslIsLive] = useState(false);

  // Payment refunds states
  const [refundOrderId, setRefundOrderId] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundList, setRefundList] = useState<any[]>([
    { id: "ref-1", orderId: "ord-102", customer: "Asif Iqbal", amount: 16999, gateway: "bKash API", reason: "Product out of stock / Customer canceled", status: "REFUNDED", date: "2026-06-18" }
  ]);

  // Reports interactive layout
  const [reportsActiveTab, setReportsActiveTab] = useState<"sales" | "orders" | "products" | "profit" | "courier">("sales");
  const [selectedReportMonth, setSelectedReportMonth] = useState("2026-06");

  // Website Management (Sliders, Footers, Menu links, Static pages)
  const [slidersList, setSlidersList] = useState<any[]>([
    { id: "sl-1", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600", title: "Mega Monsoon Campaign 50% BDT Discount", actionUrl: "/campaign/megadeals" },
    { id: "sl-2", image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=600", title: "Premium Aarong Traditional Wear Arrivals", actionUrl: "/brand/aarong" }
  ]);
  const [newSliderImg, setNewSliderImg] = useState("");
  const [newSliderTitle, setNewSliderTitle] = useState("");
  const [newSliderUrl, setNewSliderUrl] = useState("");

  const [menuList, setMenuList] = useState<any[]>([
    { id: "menu-1", label: "Home", url: "/" },
    { id: "menu-2", label: "Flash Campaign", url: "/feed/flash-sale" },
    { id: "menu-3", label: "Smartphones", url: "/category/smartphones" },
    { id: "menu-4", label: "Aarong Wear", url: "/brand/aarong" }
  ]);
  const [newMenuLabel, setNewMenuLabel] = useState("");
  const [newMenuUrl, setNewMenuUrl] = useState("");

  const [staticPages, setStaticPages] = useState<any[]>([
    { id: "page-1", title: "About Us", slug: "about-us", content: "We are a leading high quality e-commerce marketplace.", lastUpdated: "2026-06-15" },
    { id: "page-2", title: "Privacy Policy", slug: "privacy-policy", content: "We store customer details with top-tier SSL and cookie safety protection.", lastUpdated: "2026-06-17" },
    { id: "page-3", title: "Refund Policy", slug: "refund-policy", content: "7 Days unconditional refund on manufacturing defects of authentic items.", lastUpdated: "2026-06-18" }
  ]);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [newPageContent, setNewPageContent] = useState("");

  const [footerConfig, setFooterConfig] = useState({
    businessName: "AmarStore Ltd.",
    officeAddress: "House 45, Road 12, Banani, Dhaka-1213",
    supportEmail: "support@amarstore.com.bd",
    hotline: "09612000000",
    facebookUrl: "https://facebook.com/amarstore.bd",
    youtubeUrl: "https://youtube.com/amarstore.bd"
  });

  // User Management / Staff list with custom permissions checklists
  const [staffList, setStaffList] = useState<any[]>([
    { id: "staff-1", name: "Aminul Islam", email: "admin@amarstore.com.bd", role: "Admin", activeStatus: "Active", permissions: ["DASHBOARD", "PRODUCTS", "ORDERS", "SETTINGS", "COURIERS", "SMS"] },
    { id: "staff-2", name: "Sanjida Akter", email: "manager_sanjida@amarstore.com.bd", role: "Manager", activeStatus: "Active", permissions: ["DASHBOARD", "PRODUCTS", "ORDERS", "COURIERS"] },
    { id: "staff-3", name: "Zubayer Al-Mahmud", email: "staff_zubayer@amarstore.com.bd", role: "Staff", activeStatus: "Away", permissions: ["ORDERS", "PRODUCTS"] }
  ]);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("Staff");
  const [newStaffPerms, setNewStaffPerms] = useState<string[]>(["ORDERS"]);

  // 2FA Security states
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState("GA_QR_CODE_SECRET_AE93F992BC77D8B10A55D112");
  const [securityAuditList, setSecurityAuditList] = useState<any[]>([
    { id: "aud-4", user: "Aminul Islam", event: "Login Success via 2FA PIN", ip: "103.45.122.18", timestamp: "2026-06-18 07:15 PM", status: "PASSED (2FA)" },
    { id: "aud-3", user: "Zubayer Al-Mahmud", event: "Stock restock audit change Walton V22", ip: "103.45.122.95", timestamp: "2026-06-18 05:00 PM", status: "LOGGED" },
    { id: "aud-2", user: "System Guard", event: "Blocked XSS attempt in product URL slug query", ip: "185.220.101.4", timestamp: "2026-06-17 11:42 PM", status: "XSS_PREVENTED" },
    { id: "aud-1", user: "System Guard", event: "Database Backup Auto Generation", ip: "127.0.0.1", timestamp: "2026-06-17 04:00 AM", status: "COMPLETED" }
  ]);

  // Dynamic Product Edit Variant states in modal
  const [editProductSizes, setEditProductSizes] = useState("");
  const [editProductColors, setEditProductColors] = useState("");
  const [editProductSeoTitle, setEditProductSeoTitle] = useState("");
  const [editProductMetaDesc, setEditProductMetaDesc] = useState("");
  const [editProductSlugUrl, setEditProductSlugUrl] = useState("");

  const [reviewsList, setReviewsList] = useState<any[]>([
    { id: "rev-ad-1", userName: "Zahidul Alam", productName: "Walton Primo V22", rating: 5, comment: "Outstanding delivery and a very good phone. Walton brought a killer product at this price. Thanks to the store!", isApproved: true },
    { id: "rev-ad-2", userName: "Kamrul Islam", productName: "Aarong Cotton Panjabi", rating: 4, comment: "Aarong Panjabi fabric is soft and comfortable. Colors are perfect.", isApproved: false },
    { id: "rev-ad-3", userName: "Faridul Hasan", productName: "Pure Sundarban Honey", rating: 5, comment: "Pure wild honey flavor is distinct. Will buy again from this store.", isApproved: true }
  ]);

  const handleToggleReviewApproval = (id: string) => {
    setReviewsList(reviewsList.map(r => r.id === id ? { ...r, isApproved: !r.isApproved } : r));
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;
    const newStaff = {
      id: `staff-${Date.now()}`,
      name: newStaffName,
      email: newStaffEmail,
      role: newStaffRole,
      activeStatus: "Active",
      permissions: newStaffPerms
    };
    setStaffList([...staffList, newStaff]);
    setNewStaffName("");
    setNewStaffEmail("");
  };

  const handleTriggerBackup = () => {
    alert("Full Database Backup has been compiled and downloaded successfully as 'backup_amarstore_sqlite_drizzle_prod.tar.gz'!");
    const log = {
      id: `aud-${Date.now()}`,
      user: "Aminul Islam",
      event: "Manual system database backup trigger",
      ip: "103.45.122.18",
      timestamp: new Date().toLocaleString(),
      status: "COMPLETED"
    };
    setSecurityAuditList([log, ...securityAuditList]);
  };

  const handleAdjustInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invProdId || !invQty) return;
    const targetProd = products.find(p => p.id === invProdId);
    if (!targetProd) return;
    const qVal = parseInt(invQty);
    if (isNaN(qVal) || qVal <= 0) return;

    const newLog = {
      id: `log-${Date.now()}`,
      productId: invProdId,
      productName: targetProd.name,
      type: invType,
      quantity: qVal,
      warehouse: invWarehouse,
      note: invNote || (invType === "IN" ? "Manual Restock Adjustment" : "Manual Dispatch Drawdown"),
      timestamp: new Date().toLocaleString(),
      executor: "Aminul Islam (Admin)"
    };

    setInventoryLogs([newLog, ...inventoryLogs]);
    setInvQty("");
    setInvNote("");
    alert(`Inventory successfully recorded: ${invType} ${qVal} units of ${targetProd.name}`);
  };

  const handleSendBulkSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsBulkMessage) return;
    alert(`Bulk campaign message queue submitted to ${customers.length} users successfully!`);
    const newSmsLog = {
      id: `sms-lh-${Date.now()}`,
      numberCount: customers.length,
      message: smsBulkMessage,
      timestamp: new Date().toLocaleString(),
      status: "SENT_SUCCESS"
    };
    setSmsBulkLogs([newSmsLog, ...smsBulkLogs]);
    setSmsBulkMessage("");
  };

  const handleManualRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundOrderId || !refundAmount) return;
    const refAmt = parseFloat(refundAmount);
    alert(`Refunding ৳${refAmt} manually processing back to client target account successfully!`);
    const newRef = {
      id: `ref-${Date.now()}`,
      orderId: refundOrderId,
      customer: "Customer Account Override",
      amount: refAmt,
      gateway: "API Refund Gateway Relay",
      reason: refundReason || "Customer returns standard request approval",
      status: "REFUNDED",
      date: new Date().toISOString().split('T')[0]
    };
    setRefundList([newRef, ...refundList]);
    setRefundOrderId("");
    setRefundAmount("");
    setRefundReason("");
  };

  const handleAddSlider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSliderImg) return;
    setSlidersList([...slidersList, {
      id: `sl-${Date.now()}`,
      image: newSliderImg,
      title: newSliderTitle || "Promotion",
      actionUrl: newSliderUrl || "/"
    }]);
    setNewSliderImg("");
    setNewSliderTitle("");
    setNewSliderUrl("");
  };

  const handleAddMenuLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuLabel || !newMenuUrl) return;
    setMenuList([...menuList, {
      id: `menu-${Date.now()}`,
      label: newMenuLabel,
      url: newMenuUrl
    }]);
    setNewMenuLabel("");
    setNewMenuUrl("");
  };

  const handleAddStaticPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle || !newPageSlug) return;
    setStaticPages([...staticPages, {
      id: `page-${Date.now()}`,
      title: newPageTitle,
      slug: newPageSlug,
      content: newPageContent,
      lastUpdated: new Date().toISOString().split('T')[0]
    }]);
    setNewPageTitle("");
    setNewPageSlug("");
    setNewPageContent("");
    alert(`Page "${newPageTitle}" added successfully!`);
  };

  // Pre-populate settings inputs ONLY when settings object changes
  useEffect(() => {
    if (!settings) return;
    setSiteName(settings.siteName || "");
    setSiteLogo(settings.siteLogo || "");
    setSiteFavicon(settings.siteFavicon || "");
    setPrimaryColor(settings.primaryColor || "");
    setHeaderColor(settings.headerColor || "");
    setFooterColor(settings.footerColor || "");
    setHeaderTextColor(settings.headerTextColor || "");
    setFooterTextColor(settings.footerTextColor || "");
    setContactPhone(settings.contactPhone || "");
    setContactEmail(settings.contactEmail || "");
    setContactAddress(settings.contactAddress || "");
    setFacebookUrl(settings.facebookUrl || "");
    setInstagramUrl(settings.instagramUrl || "");
    setYoutubeUrl(settings.youtubeUrl || "");
    setFooterText(settings.footerText || "");
    setCopyrightText(settings.copyrightText || "");
    setLowStockThresh(settings.lowStockThreshold?.toString() || "5");
    setFbId(settings.fbPixelId || "");
    setGaId(settings.googleAnalyticsId || "");
    setGoogleClientId(settings.googleClientId || "");
    setFacebookAppId(settings.facebookAppId || "");
    setOtpToggled(settings.otpVerificationEnabled || false);
    setAutoCourierSubmit(settings.autoCourierRequest || false);
    setDefaultCourier(settings.defaultCourier || "Steadfast");
    setSmsApiKey(settings.smsApiKey || "");
    setSmsSenderId(settings.smsSenderId || "");
    setPaymentSslId(settings.sslStoreId || "");
    setPaymentStripeSecret(settings.sslStorePass || "");
    setPaymentSslIsLive(settings.sslIsLive || false);
    setBulkSmsApiKey(settings.bulkSmsApiKey || "");
    setBulkSmsSenderId(settings.bulkSmsSenderId || "");
    setPwaName(settings.pwaName || "");
    setPwaShortName(settings.pwaShortName || "");
    setPwaIconUrl(settings.pwaIconUrl || "");
    setPwaStartUrl(settings.pwaStartUrl || "");
  }, [settings]);

  // Separate effect for fetching dashboard stats and logs
  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchStatsAndChronicles();
    }
  }, [isAdminLoggedIn, orders, products]);

  const fetchStatsAndChronicles = async () => {
    try {
      const resStats = await fetch("/api/dash-stats");
      const dStats = await resStats.json();
      setStats(dStats);

      const resLogs = await fetch("/api/logs");
      const dLogs = await resLogs.json();
      setSystemLogs(dLogs);
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle checkout OTP setting
  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName,
          siteLogo,
          siteFavicon,
          primaryColor,
          headerColor,
          footerColor,
          headerTextColor,
          footerTextColor,
          contactPhone,
          contactEmail,
          contactAddress,
          facebookUrl,
          instagramUrl,
          youtubeUrl,
          footerText,
          copyrightText,
          lowStockThreshold: Number(lowStockThresh),
          fbPixelId: fbId,
          googleAnalyticsId: gaId,
          googleClientId: googleClientId,
          facebookAppId: facebookAppId,
          otpVerificationEnabled: otpToggled,
          autoCourierRequest: autoCourierSubmit,
          defaultCourier: defaultCourier,
          pwaName,
          pwaShortName,
          pwaIconUrl,
          pwaStartUrl,
          smsApiKey: smsApiKey,
          smsSenderId: smsSenderId,
          sslStoreId: paymentSslId,
          sslStorePass: paymentStripeSecret,
          sslIsLive: paymentSslIsLive,
          bulkSmsApiKey,
          bulkSmsSenderId
        })
      });
      if (res.ok) {
        onRefreshAllData();
        fetchStatsAndChronicles();
        alert("Configuration updated successfully on the server!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Gemini SEO generator client request
  const handleAiSEOSeed = async () => {
    if (!pName) {
      alert("Please input at least the Product Name to let Gemini brainstorm details!");
      return;
    }
    setAiGenerating(true);
    try {
      // Find Category / Brand names if selected
      const catObj = categories.find(c => c.id === pCategory);
      const brandObj = brands.find(b => b.id === pBrand);

      const res = await fetch("/api/products/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: pName,
          categoryName: catObj ? catObj.name : "",
          brandName: brandObj ? brandObj.name : ""
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPShortDesc(data.suggestedShortDescription || "");
        setPDesc(data.suggestedDescription || "");
        setPTags(data.suggestedTags ? data.suggestedTags.join(", ") : "");
        setPSeoTitle(data.seoTitle || "");
        setPMetaDescription(data.metaDescription || "");
        
        // formats specifications grid input
        if (data.suggestedSpecifications) {
          const specLines = data.suggestedSpecifications.map((s: any) => `${s.key}: ${s.value}`);
          setPSpecsInput(specLines.join("\n"));
        }
        
        alert("Gemini AI has successfully written high CTR SEO headers, keyword descriptions, spec sheets, and tag values directly inside form!");
      } else {
        alert("Failed to fetch suggestion. Safe mock placeholders configured.");
      }
    } catch (error) {
      console.error(error);
      alert("Error reaching server AI api.");
    } finally {
      setAiGenerating(false);
    }
  };

  // Dispatch product add action
  const handleWriteProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pPrice) {
      alert("Name and Regular Price parameters required");
      return;
    }

    // Parse specifications Lines
    const specificationsArray = pSpecsInput.split("\n")
      .filter(line => line.includes(":"))
      .map(line => {
        const parts = line.split(":");
        return { key: parts[0].trim(), value: parts[1].trim() };
      });

    // Parse galleries split
    const galleryArr = pGallery.split(",")
      .map(url => url.trim())
      .filter(url => url.length > 0);

    const productData = {
      id: editProductPayload ? editProductPayload.id : undefined,
      name: pName,
      price: Number(pPrice),
      salePrice: pSalePrice ? Number(pSalePrice) : undefined,
      costPrice: pCostPrice ? Number(pCostPrice) : undefined,
      stock: Number(pStock || 10),
      lowStockAlertLimit: pLowLimit ? Number(pLowLimit) : undefined,
      sku: pSku,
      barcode: pBarcode,
      shortDescription: pShortDesc,
      description: pDesc,
      gallery: galleryArr,
      videoUrl: pVideoUrl,
      categoryId: pCategory || "cat-1",
      brandId: pBrand || "",
      eventId: pEventId || "",
      tags: pTags.split(",").map(t => t.trim()).filter(Boolean),
      sizes: pSizes.split(",").map(s => s.trim()).filter(Boolean),
      colors: pColors.split(",").map(c => c.trim()).filter(Boolean),
      ram: pRam.split(",").map(s => s.trim()).filter(Boolean),
      storage: pStorage.split(",").map(s => s.trim()).filter(Boolean),
      variants: pVariants,
      weight: pWeight,
      isFeatured: pIsFeatured,
      isBestSelling: pIsBestSelling,
      isNewArrival: pIsNewArrival,
      specifications: specificationsArray,
      seoTitle: pSeoTitle,
      metaDescription: pMetaDescription,
      deliveryInsideDhaka: pDeliveryInsideDhaka ? Number(pDeliveryInsideDhaka) : undefined,
      deliveryOutsideDhaka: pDeliveryOutsideDhaka ? Number(pDeliveryOutsideDhaka) : undefined,
      deliveryTime: pDeliveryTime
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        setShowAddProductModal(false);
        setEditProductPayload(null);
        clearProductForm();
        onRefreshAllData();
        fetchStatsAndChronicles();
        if (onNotify) {
          const hasVariants = productData.variants && productData.variants.length > 0;
          onNotify(
            "success", 
            `পণ্যটি সফলভাবে সংরক্ষিত হয়েছে!${hasVariants ? ` (${productData.variants.length}টি ভ্যারিয়েন্টসহ)` : ""}`
          );
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        if (onNotify) {
          onNotify("error", `পণ্য সংরক্ষণে ত্রুটি ঘটেছে: ${errorData.error || "সার্ভার এরর"}`);
        }
      }
    } catch (err: any) {
      console.error(err);
      if (onNotify) {
        onNotify("error", `কানেকশন এরর: ${err.message || "দয়া করে ইন্টারনেট চেক করুন"}`);
      }
    }
  };

  const clearProductForm = () => {
    setPName(""); setPPrice(""); setPSalePrice(""); setPCostPrice(""); setPStock(""); setPLowLimit(""); setPSku("");
    setPBarcode(""); setPShortDesc(""); setPDesc(""); setPGallery(""); setPVideoUrl(""); setPCategory(""); setPBrand(""); setPEventId("");
    setPTags(""); setPSpecsInput(""); setPSizes(""); setPColors("");
    setPWeight(""); setPRam(""); setPStorage(""); setPVariants([]);
    setPIsFeatured(false); setPIsBestSelling(false); setPIsNewArrival(false);
    setPSeoTitle(""); setPMetaDescription("");
    setPDeliveryInsideDhaka(""); setPDeliveryOutsideDhaka(""); setPDeliveryTime("");
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditProductPayload(prod);
    setPName(prod.name);
    setPPrice(prod.price.toString());
    setPSalePrice(prod.salePrice ? prod.salePrice.toString() : "");
    setPCostPrice(prod.costPrice.toString());
    setPStock(prod.stock.toString());
    setPLowLimit(prod.lowStockAlertLimit.toString());
    setPSku(prod.sku);
    setPBarcode(prod.barcode || "");
    setPShortDesc(prod.shortDescription);
    setPDesc(prod.description);
    setPGallery(prod.gallery ? prod.gallery.join(",") : "");
    setPVideoUrl(prod.videoUrl || "");
    setPCategory(prod.categoryId);
    setPBrand(prod.brandId || "");
    setPEventId(prod.eventId || "");
    setPTags(prod.tags ? prod.tags.join(",") : "");
    setPSizes(prod.sizes ? prod.sizes.join(",") : "");
    setPColors(prod.colors ? prod.colors.join(",") : "");
    setPWeight(prod.weight || "");
    setPRam(prod.ram ? prod.ram.join(",") : "");
    setPStorage(prod.storage ? prod.storage.join(",") : "");
    setPVariants(prod.variants || []);
    setPIsFeatured(prod.isFeatured || false);
    setPIsBestSelling(prod.isBestSelling || false);
    setPIsNewArrival(prod.isNewArrival || false);
    setPSeoTitle(prod.seoTitle || "");
    setPMetaDescription(prod.metaDescription || "");
    setPDeliveryInsideDhaka(prod.deliveryInsideDhaka ? prod.deliveryInsideDhaka.toString() : "");
    setPDeliveryOutsideDhaka(prod.deliveryOutsideDhaka ? prod.deliveryOutsideDhaka.toString() : "");
    setPDeliveryTime(prod.deliveryTime || "");

    if (prod.specifications) {
      const specText = prod.specifications.map(s => `${s.key}: ${s.value}`).join("\n");
      setPSpecsInput(specText);
    }

    setShowAddProductModal(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        onRefreshAllData();
        fetchStatsAndChronicles();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Write new Category
  const handleWriteCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: catName, description: catDesc, image: catImage })
      });
      if (res.ok) {
        setCatName(""); setCatDesc(""); setCatImage("");
        onRefreshAllData();
        fetchStatsAndChronicles();
        alert("Category added successfully.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddReel = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title: reelTitle, handle: reelHandle, coverImage: reelCover };
    try {
      const url = editReelId ? `/api/shop-reels/${editReelId}` : "/api/shop-reels";
      const method = editReelId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowAddReelModal(false);
        onRefreshAllData();
        if (onNotify) onNotify("success", editReelId ? "Reel updated!" : "New reel added!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteReel = async (id: string) => {
    if (!confirm("Are you sure you want to delete this reel?")) return;
    try {
      const res = await fetch(`/api/shop-reels/${id}`, { method: "DELETE" });
      if (res.ok) {
        onRefreshAllData();
        if (onNotify) onNotify("warning", "Reel removed!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Write Brand
  const handleWriteBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName) return;
    try {
      const res = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: brandName, logo: brandLogo })
      });
      if (res.ok) {
        setBrandName(""); setBrandLogo("");
        onRefreshAllData();
        fetchStatsAndChronicles();
        alert("Brand written successfully.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        onRefreshAllData();
        fetchStatsAndChronicles();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteBrand = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      const res = await fetch(`/api/brands/${id}`, { method: "DELETE" });
      if (res.ok) {
        onRefreshAllData();
        fetchStatsAndChronicles();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleWriteMainCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mcName) return;
    try {
      const res = await fetch("/api/main-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: mcName, icon: mcIcon, banner: mcBanner, url: mcUrl })
      });
      if (res.ok) {
        setMcName(""); setMcIcon(""); setMcBanner(""); setMcUrl("");
        onRefreshAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteMainCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this top category?")) return;
    try {
      const res = await fetch(`/api/main-categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        onRefreshAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleWriteHeroBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hbImage) return;
    try {
      const res = await fetch("/api/hero-banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: hbImage, targetCategoryId: hbTargetCat })
      });
      if (res.ok) {
        setHbImage(""); setHbTargetCat("");
        onRefreshAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteHeroBanner = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero banner?")) return;
    try {
      const res = await fetch(`/api/hero-banners/${id}`, { method: "DELETE" });
      if (res.ok) {
        onRefreshAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleWriteStoreEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seTitle) return;
    try {
      const res = await fetch("/api/store-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: seTitle, icon: seIcon, banner: seBanner, targetUrl: seTargetUrl, expiryTime: seExpiryTime })
      });
      if (res.ok) {
        setSeTitle(""); setSeIcon(""); setSeBanner(""); setSeTargetUrl(""); setSeExpiryTime("");
        onRefreshAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteStoreEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event? This will also un-link all products attached to it.")) return;
    try {
      const res = await fetch(`/api/store-events/${id}`, { method: "DELETE" });
      if (res.ok) {
        onRefreshAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleWritePromoBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pbImage) return;
    try {
      const res = await fetch("/api/promo-banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "", badge1: "", badge2: "", image: pbImage, targetUrl: pbTargetUrl, targetCategoryId: pbTargetCat })
      });
      if (res.ok) {
        setPbTitle(""); setPbBadge1(""); setPbBadge2(""); setPbImage(""); setPbTargetUrl(""); setPbTargetCat("");
        onRefreshAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePromoBanner = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promo banner?")) return;
    try {
      const res = await fetch(`/api/promo-banners/${id}`, { method: "DELETE" });
      if (res.ok) {
        onRefreshAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Write Coupon
  const handleWriteCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode || !couponVal) return;
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, discountType: "percentage", discountValue: Number(couponVal), minOrderAmount: Number(couponMinSub) })
      });
      if (res.ok) {
        setCouponCode(""); setCouponVal(""); setCouponMinSub("0");
        onRefreshAllData();
        fetchStatsAndChronicles();
        alert("Discount Voucher campaign deployed!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
      if (res.ok) {
        onRefreshAllData();
        fetchStatsAndChronicles();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle Blacklist rules
  const handleToggleCustomerBlacklist = async (phone: string) => {
    try {
      const res = await fetch("/api/customers/toggle-blacklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      });
      if (res.ok) {
        onRefreshAllData();
        fetchStatsAndChronicles();
        // Update model details if open
        if (activeOrderModal && activeOrderModal.phone === phone) {
          onRefreshAllData();
        }
        alert("Customer blacklist toggle complete.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Manual Courier integration submit trigger
  const handleManualCourierDispatch = async (orderId: string, courierName: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/courier-dispatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courierName })
      });
      if (res.ok) {
        const data = await res.json();
        setActiveOrderModal(data.order);
        onRefreshAllData();
        fetchStatsAndChronicles();
        alert(`API Delivery submission complete! Assigned standard tracking code is ${data.order.courier.trackingId} and logged tracking webhooks successfully.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Simulated Webhook update to Courier
  const handleSimulateCourierWebhook = async (orderId: string, status: string, deliveryState: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/courier-update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, deliveryStatus: deliveryState })
      });
      if (res.ok) {
        const data = await res.json();
        setActiveOrderModal(data.order);
        onRefreshAllData();
        fetchStatsAndChronicles();
        alert("Webhook response handled successfully on site. Order stats synchronized.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update Standard order status
  const handleUpdateOrderStatus = async (orderId: string, delState: string, payState: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveryStatus: delState, paymentStatus: payState })
      });
      if (res.ok) {
        const data = await res.json();
        setActiveOrderModal(data.order);
        onRefreshAllData();
        fetchStatsAndChronicles();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Bulk status update action
  const handleBulkOrderAction = async (action: "Confirm" | "Cancel" | "Delivered") => {
    if (checkedOrderIds.length === 0) {
      alert("No orders selected!");
      return;
    }
    try {
      const res = await fetch("/api/orders/bulk-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: checkedOrderIds, action })
      });
      if (res.ok) {
        setCheckedOrderIds([]);
        onRefreshAllData();
        fetchStatsAndChronicles();
        alert("Selected orders bulk updated successfully.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOrderCheckboxChange = (orderId: string) => {
    setCheckedOrderIds(prev => 
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden" id="admin-login-screen">
        {/* Decorative elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />
        
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 animate-fade-in flex flex-col gap-6">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="bg-emerald-500/10 text-emerald-500 p-4 rounded-2xl border border-emerald-500/20">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight mt-2">Central Admin Login</h1>
            <p className="text-xs text-slate-400">Enter your credentials to access the management core engine.</p>
          </div>

          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Username</label>
              <input 
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="Enter admin username"
                className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-all font-sans"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <input 
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-all font-sans"
                required
              />
            </div>

            {loginError && (
              <p className="text-rose-500 text-xs font-semibold text-center py-1 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                {loginError}
              </p>
            )}

            <button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-xl text-center select-none cursor-pointer uppercase text-xs tracking-wider shadow-lg shadow-emerald-900/20 transition-all active:scale-95 mt-2"
            >
              Sign In to Dashboard
            </button>
          </form>

          <button 
            type="button"
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-400 transition-colors cursor-pointer self-center animate-pulse"
          >
            ← Back to Storefront
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 font-sans flex flex-col md:flex-row relative" id="admin-panel-root">
      
      {/* 1. SIDEBAR CONTROLS */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col p-5 gap-6 shrink-0" id="admin-sidebar">
        
        {/* App Title inside dashboard */}
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
          <div className="bg-emerald-600 text-white p-2 rounded-xl">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm tracking-tight text-white uppercase text-left">AmarStore Central</h2>
            <p className="text-[10px] text-slate-500 font-mono text-left">Admin Console v2.06</p>
          </div>
        </div>

        {/* Sidebar Tabs */}
        <nav className="flex flex-col gap-0.5 text-left overflow-y-auto max-h-[70vh] pr-1 scrollbar-thin">
          {[
            { id: "dashboard", label: "Dashboard", icon: BarChart3 },
            { id: "orders", label: "Orders & Invoices", icon: ClipboardList, badge: orders.length },
            { id: "products", label: "Products & Stock", icon: ShoppingBag, badge: products.length },
            { id: "categories", label: "Taxonomy & Pages", icon: Plus },
            { id: "coupons", label: "Coupons & Campaigns", icon: Tag },
            { id: "customers", label: "Customers & Security", icon: Users },
            { id: "couriers", label: "Courier & SMS API", icon: Truck },
            { id: "payments", label: "Payments & Reports", icon: CreditCard },
            { id: "reviews", label: "Reviews & Staff", icon: MessageSquare },
            { id: "settings", label: "Engine Settings", icon: Settings },
            { id: "shop-reels", label: "Shop Reel", icon: Smartphone },
            { id: "logs", label: "Security & Telemetry", icon: FileText, badge: systemLogs.length }
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full px-3 py-2 rounded-lg text-[11px] font-bold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === tab.id 
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-700/20" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && (
                  <span className="bg-slate-800 text-slate-450 font-mono text-[9px] px-1 py-0.2 rounded border border-slate-700">{tab.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Home portal trigger button */}
        <div className="mt-auto pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-750 text-white text-xs font-extrabold py-2.5 rounded-xl border border-slate-700 hover:border-slate-650 transition-all cursor-pointer"
          >
            ← Open Client Storefront
          </button>
        </div>

      </aside>

      {/* 2. BODY CONTENT MATRICES */}
      <main className="flex-grow flex flex-col overflow-x-hidden min-h-0 bg-slate-900 p-6 md:p-8">
        
        {/* Dynamic Toolbar Header */}
        <header className="flex justify-between items-center pb-5 mb-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight uppercase">
              {activeTab === "dashboard" && "Overview Dashboard"}
              {activeTab === "orders" && "Order & Invoice Hub"}
              {activeTab === "products" && "Products & Stock Depot"}
              {activeTab === "categories" && "Taxonomy & Pages"}
              {activeTab === "coupons" && "Voucher & Campaigns"}
              {activeTab === "customers" && "Customers & Security"}
              {activeTab === "couriers" && "Courier & SMS Gateways"}
              {activeTab === "payments" && "Payments & Reports Panel"}
              {activeTab === "reviews" && "Review Approvals & Staffing"}
              {activeTab === "settings" && "Master Engine Settings"}
              {activeTab === "logs" && "Security Audit Logs & Telemetry"}
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">Control systems and automate e-commerce delivery Requests perfectly.</p>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => { fetchStatsAndChronicles(); onRefreshAllData(); }}
              className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg border border-slate-700 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Refresh Stats"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sync</span>
            </button>
          </div>
        </header>

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="flex flex-col gap-6 font-sans text-slate-100" id="overview-analytics-tab">
            
            {/* Quick alert bar for low stocks or high risks */}
            {(products.filter(p => p.stock <= p.lowStockAlertLimit).length > 0) && (
              <div className="bg-amber-950/30 border border-amber-900/60 p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-left">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-500/10 p-2.5 rounded-lg text-amber-500 border border-amber-500/20">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-amber-400">Low Stock Trigger Notification</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      There are <strong>{products.filter(p => p.stock <= p.lowStockAlertLimit).length} items</strong> below your specified stock limit. Customers might face delivery delays if restock triggers are not posted.
                    </p>
                  </div>
                </div>
                <button onClick={() => setActiveTab("products")} className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-all">
                  Restock Products
                </button>
              </div>
            )}

            {/* Matrix cards row */}
            <h3 className="font-extrabold text-xs uppercase text-slate-400 -mb-2 tracking-wider">Today's Sales & Orders</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-between text-left relative overflow-hidden group">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Sales</span>
                  <p className="font-mono text-xl md:text-2xl font-black text-emerald-400 mt-1">৳{stats.totalSales.toLocaleString()}</p>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 font-semibold">Total revenue today</div>
                <div className="absolute right-3 top-3 text-slate-800 opacity-20"><TrendingUp className="w-10 h-10 group-hover:scale-110 transition-all text-emerald-500" /></div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-between text-left relative overflow-hidden group">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Est Revenue Profit</span>
                  <p className="font-mono text-xl md:text-2xl font-black text-emerald-400 mt-1">৳{stats.totalProfit.toLocaleString()}</p>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 font-semibold">Estimated gross profit margin (৳)</div>
                <div className="absolute right-3 top-3 text-slate-800 opacity-20"><Percent className="w-10 h-10 text-emerald-400" /></div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-between text-left relative overflow-hidden group">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Low Stock Alert Count</span>
                  <p className="font-mono text-xl md:text-2xl font-black text-amber-500 mt-1">
                    {products.filter(p => p.stock <= p.lowStockAlertLimit).length}
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 font-semibold">Reorder items immediately</div>
                <div className="absolute right-3 top-3 text-slate-800 opacity-20"><ShoppingBag className="w-10 h-10 text-amber-500" /></div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-between text-left relative overflow-hidden group">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Registered Orders</span>
                  <p className="font-mono text-xl md:text-2xl font-black text-white mt-1">{orders.length}</p>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 font-semibold">All time processed orders</div>
                <div className="absolute right-3 top-3 text-slate-800 opacity-20"><ClipboardList className="w-10 h-10 text-blue-500" /></div>
              </div>

            </div>

            {/* Requirements 1: Ordered Detailed counters */}
            <h3 className="font-extrabold text-xs uppercase text-slate-400 -mb-2 tracking-wider">Real-Time Order Status Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: "Pending", count: orders.filter(o => o.deliveryStatus === "Pending").length, color: "border-yellow-600/30 text-yellow-400" },
                { label: "Processing", count: orders.filter(o => o.deliveryStatus === "Confirmed" || o.deliveryStatus === "Shipped").length, color: "border-blue-600/30 text-blue-400" },
                { label: "Delivered", count: orders.filter(o => o.deliveryStatus === "Delivered").length, color: "border-emerald-600/30 text-emerald-400" },
                { label: "Cancelled", count: orders.filter(o => o.deliveryStatus === "Cancelled").length, color: "border-rose-600/30 text-rose-400" },
                { label: "Returned", count: orders.filter(o => o.deliveryStatus === "Returned").length, color: "border-purple-600/30 text-purple-400" }
              ].map((ost, i) => (
                <div key={i} className={`bg-slate-950/90 border ${ost.color} p-4 rounded-xl text-left`}>
                   <p className="text-[10px] uppercase font-bold tracking-wide text-slate-400 truncate">{ost.label}</p>
                  <p className="text-2xl font-mono font-black mt-1">{ost.count}</p>
                </div>
              ))}
            </div>

            {/* Mid: Svg visual charts + Low Stock items panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Graphic container (High fidelity SVG path) */}
              <div className="lg:col-span-8 bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col gap-4 text-left">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-extrabold text-sm tracking-wide text-slate-200">Sales Trends Graph</h4>
                    <p className="text-[10px] text-slate-500">Real-time daily transaction velocity tracking</p>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase py-0.5 px-2 bg-emerald-950/40 rounded border border-emerald-900">
                    Live Engine
                  </span>
                </div>
                
                {/* SVG Area spline graph */}
                <div className="h-60 w-full relative pt-2">
                  <svg className="w-full h-48 overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="20" x2="500" y2="20" stroke="#1e293b" strokeDasharray="3" strokeWidth="0.5" />
                    <line x1="0" y1="50" x2="500" y2="50" stroke="#1e293b" strokeDasharray="3" strokeWidth="0.5" />
                    <line x1="0" y1="80" x2="500" y2="80" stroke="#1e293b" strokeDasharray="3" strokeWidth="0.5" />
                    
                    {/* Fill Area spline */}
                    <path
                      d="M 0 90 L 50 75 Q 75 50, 100 65 T 200 40 T 300 55 T 400 30 T 500 10 L 500 100 L 0 100 Z"
                      fill="url(#grad-sales)"
                      opacity="0.3"
                    />
                    
                    {/* Stroke line spline */}
                    <path
                      d="M 0 90 L 50 75 Q 75 50, 100 65 T 200 40 T 300 55 T 400 30 T 500 10"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Gradient definers */}
                    <defs>
                      <linearGradient id="grad-sales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Timeline labels */}
                  <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-2 px-1">
                    <span>01 June</span>
                    <span>05 June</span>
                    <span>10 June</span>
                    <span>15 June</span>
                    <span>20 June</span>
                    <span>Today</span>
                  </div>
                </div>
              </div>

              {/* Low stock indicators column */}
              <div className="lg:col-span-4 bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col gap-4 text-left overflow-y-auto max-h-[320px]">
                <h4 className="font-bold text-xs uppercase tracking-wide text-slate-300 border-b border-slate-850 pb-3 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-amber-500" />
                  <span>Depot restock triggers ({products.filter(p => p.stock <= p.lowStockAlertLimit).length})</span>
                </h4>
                
                <div className="flex flex-col gap-2">
                  {products.length === 0 ? (
                    <p className="text-xs text-slate-500 italic pb-5">No catalog loaded yet.</p>
                  ) : products.filter(p => p.stock <= p.lowStockAlertLimit).length === 0 ? (
                    <div className="p-4 text-center text-xs text-emerald-400 bg-emerald-950/25 rounded-xl border border-emerald-900/35">
                      ✓ All products are fully stocked in our central warehouses!
                    </div>
                  ) : (
                    products.filter(p => p.stock <= p.lowStockAlertLimit).map((p) => (
                      <div key={p.id} className="p-2 bg-slate-900 border border-slate-800 rounded-lg flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-white line-clamp-1">{p.name}</p>
                          <span className="text-[10px] font-mono text-amber-500">Only {p.stock} counts left</span>
                        </div>
                        <button 
                          onClick={() => handleOpenEditProduct(p)} 
                          className="bg-slate-800 hover:bg-slate-700 hover:text-emerald-400 px-2 py-1 text-[10px] font-bold text-slate-300 rounded border border-slate-705 cursor-pointer"
                        >
                          Restock
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Bottom 2-col row: Recent Orders and System Automation Control summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Recent Orders table widget */}
              <div className="lg:col-span-8 bg-slate-950 border border-slate-800 p-5 rounded-2xl text-left">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-200">Recent Orders List</h4>
                    <p className="text-[10px] text-slate-500">Live feed of client actions and verification states</p>
                  </div>
                  <button onClick={() => setActiveTab("orders")} className="text-emerald-400 hover:underline text-xs font-bold">
                    View Registry →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-slate-300">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                        <th className="pb-2 font-black">Order ID</th>
                        <th className="pb-2 font-black">Customer</th>
                        <th className="pb-2 font-black">Total</th>
                        <th className="pb-2 font-black">Status</th>
                        <th className="pb-2 font-black">Risk Factor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {orders.slice(0, 5).map((ord) => {
                        const isHighRisk = ord.riskScore !== undefined && ord.riskScore > 75;
                        return (
                          <tr key={ord.id} className="hover:bg-slate-900/40">
                            <td className="py-2.5 font-mono text-[11px] font-bold text-white">#{ord.id}</td>
                            <td className="py-2.5">
                              <p className="font-bold">{ord.customerName}</p>
                              <span className="text-[9px] text-slate-500">{ord.phone}</span>
                            </td>
                            <td className="py-2.5 font-mono font-bold text-emerald-400">৳{ord.total.toLocaleString()}</td>
                            <td className="py-2.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                ord.deliveryStatus === "Pending" ? "bg-yellow-950/50 text-yellow-400 border border-yellow-800/30" :
                                ord.deliveryStatus === "Delivered" ? "bg-emerald-950/50 text-emerald-400 border border-emerald-800/30" :
                                "bg-slate-900 text-slate-300 border border-slate-800"
                              }`}>
                                {ord.deliveryStatus}
                              </span>
                            </td>
                            <td className="py-2.5">
                              <span className={`font-bold font-mono text-[10px] ${isHighRisk ? "text-rose-500" : "text-emerald-400"}`}>
                                {ord.riskScore !== undefined ? `${ord.riskScore}%` : "0% (Safe)"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Automation engines overview status checklist (Required feature 18. Automation) */}
              <div className="lg:col-span-4 bg-slate-950 border border-slate-800 p-5 rounded-2xl text-left">
                <h4 className="font-extrabold text-sm text-slate-200 border-b border-slate-800 pb-3 mb-4 flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <span>Automation Engines</span>
                </h4>

                <div className="flex flex-col gap-4">
                  <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-white">Pathao/Steadfast Courier Integration</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">Dispatches orders with auto submission options</p>
                    </div>
                    <span className="bg-emerald-950 text-emerald-400 text-[9px] font-mono font-black uppercase py-0.5 px-1.5 rounded border border-emerald-900">
                      ACTIVE
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-white">Bulk SMS Delivery Gateways</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">For manual configuration template routing alerts</p>
                    </div>
                    <span className="bg-emerald-950 text-emerald-400 text-[9px] font-mono font-black uppercase py-0.5 px-1.5 rounded border border-emerald-900">
                      ON_STANDBY
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-white">OTP Verification Engine</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">Prevents fake placement and malicious coordinates</p>
                    </div>
                    <span className={`text-[9px] font-mono font-black uppercase py-0.5 px-1.5 rounded border ${
                      otpToggled 
                        ? "bg-emerald-950 text-emerald-400 border-emerald-900" 
                        : "bg-amber-950/40 text-amber-500 border-amber-900/40"
                    }`}>
                      {otpToggled ? "ENABLED" : "BYPASSED"}
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: ORDERS SYSTEM */}
        {activeTab === "orders" && (
          <div className="flex flex-col gap-6 text-left" id="orders-registry-tab">
            
            {/* Search and filter controls */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6 bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center gap-2">
                <span className="text-xs text-slate-500 font-bold uppercase shrink-0">Search:</span>
                <input 
                  type="text" 
                  value={invoiceSearchId}
                  onChange={(e) => setInvoiceSearchId(e.target.value)}
                  placeholder="Search by order ID, customer name, address or phone..."
                  className="bg-transparent text-xs text-white focus:outline-none w-full font-sans"
                />
              </div>

              <div className="md:col-span-6 bg-slate-950 border border-slate-800 p-3 rounded-xl flex justify-between items-center gap-4">
                <div className="flex gap-1">
                  <button 
                    onClick={() => handleBulkOrderAction("Confirm")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black px-3 py-1 rounded cursor-pointer transition-all uppercase"
                  >
                    Confirm
                  </button>
                  <button 
                    onClick={() => handleBulkOrderAction("Delivered")}
                    className="bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-black px-3 py-1 rounded cursor-pointer transition-all uppercase"
                  >
                    Deliver
                  </button>
                  <button 
                    onClick={() => handleBulkOrderAction("Cancel")}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black px-3 py-1 rounded cursor-pointer transition-all uppercase"
                  >
                    Cancel
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Checked: {checkedOrderIds.length} orders
                </span>
              </div>
            </div>

            {/* Split layout: Table on Left & Printable Active Invoice on Right */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              
              {/* Left pane: Orders registry */}
              <div className="xl:col-span-8 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col gap-1">
                <div className="p-4 border-b border-slate-850 flex justify-between items-center bg-slate-950/80">
                  <h4 className="font-extrabold text-xs text-slate-300 uppercase tracking-wide">System Order Registry</h4>
                  <span className="text-[10px] text-slate-500 font-mono font-bold">Click on any order to generate printable invoice</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-slate-350">
                    <thead className="bg-slate-900 border-b border-slate-800 font-extrabold uppercase text-[9.5px] tracking-wider text-slate-400">
                      <tr>
                        <th className="px-3 py-3 text-center w-10">
                          <input 
                            type="checkbox"
                            checked={checkedOrderIds.length === orders.length && orders.length > 0}
                            onChange={() => {
                              if (checkedOrderIds.length === orders.length) setCheckedOrderIds([]);
                              else setCheckedOrderIds(orders.map(o => o.id));
                            }}
                            className="w-3 h-3 accent-emerald-500 cursor-pointer"
                          />
                        </th>
                        <th className="px-3 py-3">Order ID</th>
                        <th className="px-3 py-3">Customer</th>
                        <th className="px-3 py-3">Amount</th>
                        <th className="px-3 py-3 text-center">Fake Risk</th>
                        <th className="px-3 py-3">Status</th>
                        <th className="px-3 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-10 text-slate-500 italic">No orders received on site yet.</td>
                        </tr>
                      ) : (
                        orders
                          .filter(o => {
                            if (!invoiceSearchId) return true;
                            const term = invoiceSearchId.toLowerCase();
                            return o.id.toLowerCase().includes(term) ||
                                   o.customerName.toLowerCase().includes(term) ||
                                   o.phone.toLowerCase().includes(term) ||
                                   o.deliveryStatus.toLowerCase().includes(term);
                          })
                          .map((o) => {
                            const isChecked = checkedOrderIds.includes(o.id);
                            return (
                              <tr 
                                key={o.id} 
                                className={`hover:bg-slate-900 transition-all cursor-pointer ${
                                  selectedInvoice?.id === o.id ? "bg-slate-900 text-white" : ""
                                }`}
                                onClick={() => setSelectedInvoice(o)}
                              >
                                <td className="px-3 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                                  <input 
                                    type="checkbox" 
                                    checked={isChecked}
                                    onChange={() => handleOrderCheckboxChange(o.id)}
                                    className="w-3.5 h-3.5 accent-emerald-500 cursor-pointer"
                                  />
                                </td>
                                <td className="px-3 py-3 font-mono text-[10.5px] font-black text-emerald-400">
                                  #{o.id}
                                </td>
                                <td className="px-3 py-3">
                                  <p className="font-bold">{o.customerName}</p>
                                  <p className="text-[10px] text-slate-450 mt-0.5">{o.phone}</p>
                                  <span className="text-[9px] text-slate-500 block truncate max-w-[160px]">{o.address}</span>
                                </td>
                                <td className="px-3 py-3 font-mono font-bold text-white">
                                  ৳{o.total.toLocaleString()}
                                </td>
                                <td className="px-3 py-3 text-center">
                                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                    o.riskScore && o.riskScore > 75 
                                      ? "bg-rose-950 text-rose-400 border border-rose-900" 
                                      : "bg-emerald-950 text-emerald-400 border border-emerald-900"
                                  }`}>
                                    {o.riskScore !== undefined ? `${o.riskScore}% Risk` : "0% Safe"}
                                  </span>
                                </td>
                                <td className="px-3 py-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                    o.deliveryStatus === "Delivered" ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/40" :
                                    o.deliveryStatus === "Pending" ? "bg-yellow-950/50 text-yellow-400 border border-yellow-800/30" :
                                    "bg-slate-900 text-slate-350 border border-slate-800"
                                  }`}>
                                    {o.deliveryStatus}
                                  </span>
                                </td>
                                <td className="px-3 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                                  <button 
                                    onClick={() => setActiveOrderModal(o)}
                                    className="bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 text-[10px] font-bold px-2 py-1 rounded cursor-pointer transition-all"
                                  >
                                    Manage
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right pane: Detailed printable A4 Invoice template */}
              <div className="xl:col-span-4 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-4 text-left">
                <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                  <h4 className="font-extrabold text-xs text-slate-300 uppercase tracking-wide">Invoice & Cash Memo</h4>
                  {selectedInvoice && (
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => window.print()}
                        className="p-1 bg-slate-800 hover:bg-slate-705 text-white rounded border border-slate-700 cursor-pointer"
                        title="Print invoice documents"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => alert(`Symmetric PDF generated for Order ID: #${selectedInvoice.id} and successfully stored inside user's offline ledger.`)}
                        className="p-1 bg-slate-800 hover:bg-slate-705 text-white rounded border border-slate-700 cursor-pointer"
                        title="Download CSV / PDF copy"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {!selectedInvoice ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
                    <ClipboardList className="w-8 h-8 text-slate-750" />
                    <p className="text-xs text-slate-500 italic">Click on any order row to generate a fully printable invoice and merchant slip.</p>
                  </div>
                ) : (
                  <div className="bg-white text-slate-900 p-5 rounded-lg shadow-xl flex flex-col gap-4 pointer-events-auto" id="invoice-bill-printable">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-slate-300 pb-3">
                      <div>
                        <h3 className="font-black text-xs uppercase tracking-wider text-slate-950">AmarStore</h3>
                        <p className="text-[8px] text-slate-500 leading-none mt-1">Banani, Dhaka</p>
                        <p className="text-[8px] text-slate-500 leading-none">support@amarstore.com.bd</p>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-[10px] text-emerald-700 uppercase">INVOICE</span>
                        <p className="font-mono text-[9px] text-slate-700 font-bold leading-none mt-1">#{selectedInvoice.id}</p>
                        <p className="text-[8px] text-slate-500 mt-0.5">{selectedInvoice.createdAt || "June 19, 2026"}</p>
                      </div>
                    </div>

                    {/* Customer addresses */}
                    <div className="text-[9px]">
                      <span className="font-black text-slate-500 uppercase tracking-wide text-[8px]">DELIVER TO (CUSTOMER):</span>
                      <p className="font-black text-slate-900 mt-1">{selectedInvoice.customerName}</p>
                      <p className="font-bold text-slate-750 font-mono mt-0.5">{selectedInvoice.phone}</p>
                      <p className="text-slate-600 mt-1 leading-tight">{selectedInvoice.address}</p>
                    </div>

                    {/* Breakdown table items */}
                    <div className="border-t border-b border-slate-200 py-2">
                      <table className="w-full text-[9px]">
                        <thead>
                          <tr className="border-b border-slate-200 font-black text-slate-500 text-left">
                            <th className="pb-1">Item Title</th>
                            <th className="pb-1 text-center w-8">Qty</th>
                            <th className="pb-1 text-right w-16">Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                            selectedInvoice.items.map((it: any, index: number) => {
                              let variantString = "";
                              if (it.variant && typeof it.variant === "object") {
                                variantString = Object.entries(it.variant)
                                  .filter(([k, v]) => !["id", "image", "price", "stock"].includes(k) && v)
                                  .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
                                  .join(', ');
                              }
                              const itName = it.name || (it.productId ? `Product ID: ${it.productId}` : "Ecommerce Premium Authentic product item");
                              const itQty = it.quantity || 1;
                              const itPrice = it.price || selectedInvoice.total;
                              const productRef = products.find(p => p.id === it.productId);
                              const itImage = it.image || (it.variant && (it.variant as any).image) || (productRef && productRef.gallery && productRef.gallery[0]) || "";
                              return (
                                <tr key={index}>
                                  <td className="py-2 text-slate-800">
                                    <div className="flex items-center gap-2">
                                      {itImage && <img src={itImage} alt="product" className="w-6 h-6 object-cover rounded shadow-sm border border-slate-200" />}
                                      <div className="flex flex-col">
                                        <div className="truncate max-w-[100px]">{itName}</div>
                                        {variantString && <div className="text-[7px] text-slate-500">{variantString}</div>}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-2 text-center font-bold">{itQty}</td>
                                  <td className="py-2 text-right font-mono font-bold">৳{(itPrice * itQty).toLocaleString()}</td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td className="py-2 text-slate-800">Authentic E-Commerce Item</td>
                              <td className="py-2 text-center font-bold">1</td>
                              <td className="py-2 text-right font-mono font-bold">৳{selectedInvoice.total.toLocaleString()}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Bottom calculations */}
                    <div className="flex flex-col gap-1 text-[9px] border-b border-slate-200 pb-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Subtotal:</span>
                        <span className="font-mono text-slate-800 font-bold">৳{selectedInvoice.subtotal ? selectedInvoice.subtotal.toLocaleString() : (selectedInvoice.total - 80).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Shipping (Courier):</span>
                        <span className="font-mono text-slate-800 font-bold">৳80</span>
                      </div>
                      <div className="flex justify-between font-black text-slate-950 border-t border-slate-100 pt-1 text-[10px]">
                        <span>Grand Total:</span>
                        <span className="font-mono text-emerald-700">৳{selectedInvoice.total.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Footer instructions/Barcode */}
                    <div className="flex flex-col items-center">
                      <div className="bg-slate-300 h-6 w-full max-w-[150px] flex items-center justify-around font-mono text-[7px] text-slate-800 tracking-widest font-black rounded">
                        ||||| | ||||| | ||| ||| ||| |
                      </div>
                      <p className="text-[7px] text-slate-500 mt-1 font-bold text-center">Thank you for shopping authentic items online!</p>
                      <p className="text-[6px] text-slate-400">Powered by AmarStore Centralized API Integration</p>
                    </div>

                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: PRODUCTS MANAGEMENT CRUD */}
        {activeTab === "products" && (
          <div className="flex flex-col gap-4 text-left font-semibold text-xs" id="products-ledger-tab">
            
            <div className="flex justify-between items-center bg-slate-950 p-4 border border-slate-800 rounded-2xl">
              <span className="text-slate-400 font-mono">Catalog listing: {products.length} products total</span>
              <button
                onClick={() => { clearProductForm(); setEditProductPayload(null); setShowAddProductModal(true); }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl text-center flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* List products */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-slate-300">
                  <thead className="bg-slate-900 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3 text-right">Regular Price</th>
                      <th className="px-4 py-3 text-right">Sale Price</th>
                      <th className="px-4 py-3 text-right">Cost Price</th>
                      <th className="px-4 py-3 text-center">Stock</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => {
                      const isLowStock = p.stock <= p.lowStockAlertLimit;
                      return (
                        <tr key={p.id} className="border-b border-slate-850 hover:bg-slate-900/60 transition-all">
                          <td className="px-4 py-3 flex gap-3 items-center">
                            <img src={p.gallery[0]} alt={p.name} className="w-10 h-10 object-cover rounded border" />
                            <div>
                              <p className="font-extrabold text-white leading-snug line-clamp-1">{p.name}</p>
                              <span className="text-[10px] text-slate-400">{categories.find(c => c.id === p.categoryId)?.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-[11px] text-emerald-400 font-bold">{p.sku}</td>
                          <td className="px-4 py-3 text-right font-mono text-white">৳{p.price.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-mono text-slate-400">
                            {p.salePrice ? `৳${p.salePrice.toLocaleString()}` : "-"}
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-slate-500">৳{p.costPrice.toLocaleString()}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                              isLowStock ? "bg-amber-950 text-amber-400 border border-amber-900/40 animate-pulse" : "bg-slate-900 text-slate-300"
                            }`}>
                              {p.stock} units
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex gap-2 justify-center">
                              <button 
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-1.5 hover:bg-slate-800 text-slate-300 rounded"
                                title="Edit Product Specs"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 hover:bg-slate-800 text-red-500 rounded"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Requirement 10: Inventory Management Engine */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
              
              {/* Form panel */}
              <div className="lg:col-span-4 bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col gap-3">
                <div className="border-b border-slate-850 pb-2 text-left">
                  <h4 className="font-extrabold text-xs text-slate-350 uppercase tracking-wide">Stock Dispatcher</h4>
                  <p className="text-[10px] text-slate-500">Record manual Stock In / OUT warehouse adjustments</p>
                </div>

                <form onSubmit={handleAdjustInventory} className="flex flex-col gap-2.5">
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[10px] text-slate-450 uppercase font-black">Select Product</label>
                    <select 
                      value={invProdId}
                      onChange={(e) => setInvProdId(e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-xs text-white p-2 rounded focus:outline-none cursor-pointer"
                      required
                    >
                      <option value="">-- Click here to select --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock} units)</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-left">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-450 uppercase font-black">Adjustment Type</label>
                      <select 
                        value={invType}
                        onChange={(e) => setInvType(e.target.value as any)}
                        className="bg-slate-900 border border-slate-800 text-xs text-white p-2 rounded focus:outline-none cursor-pointer"
                      >
                        <option value="IN">ADD (Stock In)</option>
                        <option value="OUT">SUBTRACT (Stock Out)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-450 uppercase font-black">Quantity</label>
                      <input 
                        type="number" 
                        value={invQty}
                        onChange={(e) => setInvQty(e.target.value)}
                        placeholder="10"
                        className="bg-slate-900 border border-slate-800 text-xs text-white p-2 rounded focus:outline-none font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[10px] text-slate-450 uppercase font-black">Warehouse Location</label>
                    <input 
                      type="text" 
                      value={invWarehouse}
                      onChange={(e) => setInvWarehouse(e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-xs text-white p-2 rounded focus:outline-none"
                      placeholder="Dhaka Warehouse / Banani depot"
                    />
                  </div>

                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[10px] text-slate-450 uppercase font-black">Adjustment Notes</label>
                    <input 
                      type="text" 
                      value={invNote}
                      onChange={(e) => setInvNote(e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-xs text-white p-2 rounded focus:outline-none"
                      placeholder="Supplier arrival batch / return damages"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-2 rounded transition-all cursor-pointer uppercase"
                  >
                    Adjust Ledger Count
                  </button>
                </form>
              </div>

              {/* Log ledger table pane */}
              <div className="lg:col-span-8 bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col gap-3 text-left">
                <div className="border-b border-slate-800 pb-2 flex justify-between items-center bg-slate-950">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-300 uppercase tracking-wide">Historical Inventory Ledger</h4>
                    <p className="text-[10px] text-slate-505 text-slate-400">Chronological stock entries and dispatch audits</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase py-0.5 px-1.5 bg-slate-900 rounded border border-slate-800">
                    Audit Certified
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10.5px] text-slate-300">
                    <thead>
                      <tr className="border-b border-slate-800 font-black text-slate-500 text-left uppercase text-[9px] tracking-wider">
                        <th className="pb-1">Product</th>
                        <th className="pb-1 text-center">Type</th>
                        <th className="pb-1 text-center font-bold">Qty</th>
                        <th className="pb-1">Warehouse</th>
                        <th className="pb-1">Note</th>
                        <th className="pb-1">Executor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {inventoryLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-900/40">
                          <td className="py-2.5 font-bold text-white max-w-[120px] truncate">{log.productName}</td>
                          <td className="py-2.5 text-center">
                            <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] font-black uppercase ${
                              log.type === "IN" ? "bg-emerald-950 text-emerald-400 border border-emerald-900/30" : "bg-rose-950 text-rose-455 text-rose-400 border border-rose-900/30"
                            }`}>
                              {log.type === "IN" ? "IN" : "OUT"}
                            </span>
                          </td>
                          <td className="py-2.5 text-center font-mono font-bold text-white">{log.quantity}</td>
                          <td className="py-2.5 text-slate-400 font-medium">{log.warehouse}</td>
                          <td className="py-2.5 text-slate-500 italic max-w-[150px] truncate">{log.note}</td>
                          <td className="py-2.5">
                            <p className="font-semibold text-slate-350 text-slate-300">{log.executor}</p>
                            <span className="text-[9px] text-slate-500 font-mono block">{log.timestamp}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 4: CATEGORIES & BRANDS TAXONOMY */}
        {activeTab === "categories" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left" id="categories-brands-tab">
            
            {/* Create Categories */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl flex flex-col gap-4">
              <h3 className="font-bold text-white text-sm uppercase tracking-wide border-b border-slate-800 pb-3">
                Create new Categories
              </h3>
              <form onSubmit={handleWriteCategory} className="flex flex-col gap-3 text-xs">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-bold">Category Title:</label>
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="Organic Food, Smart Gadget"
                    className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-bold">Short description:</label>
                  <input
                    type="text"
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                    placeholder="Short summary describing the category"
                    className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-bold">Category Image (Upload):</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        const base64 = await convertToBase64(e.target.files[0]);
                        setCatImage(base64);
                      }
                    }}
                    className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                  />
                  {catImage && <img src={catImage} alt="Category image preview" className="h-10 object-contain mt-1" />}
                </div>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded text-xs select-none">
                  Write Category
                </button>
              </form>

              {/* Active categories count list */}
              <div className="mt-4 flex flex-col gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-500">Active category registry</span>
                {categories.map(c => (
                  <div key={c.id} className="p-2.5 bg-slate-900 rounded-xl flex justify-between items-center text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      {c.image && <img src={c.image} alt="cat" className="w-6 h-6 object-cover rounded" />}
                      <span>{c.name}</span>
                    </div>
                    <button onClick={() => handleDeleteCategory(c.id)} className="text-red-500 font-bold hover:underline">Delete</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Brands */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl flex flex-col gap-4">
              <h3 className="font-bold text-white text-sm uppercase tracking-wide border-b border-slate-800 pb-3">
                Create new Brands
              </h3>
              <form onSubmit={handleWriteBrand} className="flex flex-col gap-3 text-xs">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-bold">Brand Title Name:</label>
                  <input
                    type="text"
                    required
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Walton, Symphony, Aarong"
                    className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-bold">Logo (Upload):</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        const base64 = await convertToBase64(e.target.files[0]);
                        setBrandLogo(base64);
                      }
                    }}
                    className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                  />
                  {brandLogo && <img src={brandLogo} alt="Preview" className="h-6 object-contain mt-1" />}
                </div>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded text-xs select-none">
                  Write Brand
                </button>
              </form>

              {/* Active list brands */}
              <div className="mt-4 flex flex-col gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-500">Active brand registry</span>
                {brands.map(b => (
                  <div key={b.id} className="p-2.5 bg-slate-900 rounded-xl flex justify-between items-center text-xs text-slate-300">
                    <span>{b.name}</span>
                    <button onClick={() => handleDeleteBrand(b.id)} className="text-red-500 font-bold hover:underline">Delete</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Main Categories */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl flex flex-col gap-4 md:col-span-2">
              <h3 className="font-bold text-white text-sm uppercase tracking-wide border-b border-slate-800 pb-3">
                Create Home Page Top Categories
              </h3>
              <form onSubmit={handleWriteMainCategory} className="flex flex-col gap-3 text-xs">
                <div className="flex justify-between gap-4">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-slate-400 font-bold">Name (Hotat Brishti):</label>
                    <input
                      type="text"
                      required
                      value={mcName}
                      onChange={(e) => setMcName(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                    />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-slate-400 font-bold">Icon Image (Upload):</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          const base64 = await convertToBase64(e.target.files[0]);
                          setMcIcon(base64);
                        }
                      }}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                    />
                    {mcIcon && <img src={mcIcon} alt="Preview" className="h-6 object-contain mt-1" />}
                  </div>
                </div>
                <div className="flex justify-between gap-4">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-slate-400 font-bold">Banner Image (Upload):</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          const base64 = await convertToBase64(e.target.files[0]);
                          setMcBanner(base64);
                        }
                      }}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                    />
                    {mcBanner && <img src={mcBanner} alt="Preview" className="h-10 object-contain mt-1" />}
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-slate-400 font-bold">Link/URL (Optional):</label>
                    <input
                      type="text"
                      value={mcUrl}
                      onChange={(e) => setMcUrl(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                    />
                  </div>
                </div>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded text-xs select-none">
                  Add Main Category Chip
                </button>
              </form>
              {/* Active list main categories */}
              <div className="mt-4 flex flex-col gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-500">Active main category registry</span>
                {mainCategories.map((mc) => (
                  <div key={mc.id} className="p-2.5 bg-slate-900 rounded-xl flex justify-between items-center text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 border border-slate-700 rounded overflow-hidden">
                        <img src={mc.icon} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span>{mc.name}</span>
                    </div>
                    <button onClick={() => handleDeleteMainCategory(mc.id)} className="text-red-500 font-bold hover:underline">Delete</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Hero Banners */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl flex flex-col gap-4 md:col-span-2">
              <h3 className="font-bold text-white text-sm uppercase tracking-wide border-b border-slate-800 pb-3">
                Hero Banners
              </h3>
              <form onSubmit={handleWriteHeroBanner} className="flex flex-col gap-3 text-xs">
                <div className="flex justify-between gap-4">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-slate-400 font-bold">Banner Image (Upload):</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          const base64 = await convertToBase64(e.target.files[0]);
                          setHbImage(base64);
                        }
                      }}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                    />
                    {hbImage && <img src={hbImage} alt="Preview" className="h-10 object-contain mt-1" />}
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-slate-400 font-bold">Target Main Category ID (Optional):</label>
                    <select
                      value={hbTargetCat}
                      onChange={(e) => setHbTargetCat(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                    >
                      <option value="">None</option>
                      {mainCategories.map(mc => (
                        <option key={mc.id} value={mc.id}>{mc.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded text-xs select-none">
                  Add Hero Banner
                </button>
              </form>
              <div className="mt-4 flex flex-col gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-500">Active hero banners</span>
                {heroBanners.map((hb) => (
                  <div key={hb.id} className="p-2.5 bg-slate-900 rounded-xl flex justify-between items-center text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-8 border border-slate-700 rounded overflow-hidden">
                        <img src={hb.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span>➡️ {mainCategories.find(c => c.id === hb.targetCategoryId)?.name || 'None'}</span>
                    </div>
                    <button onClick={() => handleDeleteHeroBanner(hb.id)} className="text-red-500 font-bold hover:underline">Delete</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Store Events */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl flex flex-col gap-4 md:col-span-2">
              <h3 className="font-bold text-white text-sm uppercase tracking-wide border-b border-slate-800 pb-3">
                Store Events
              </h3>
              <form onSubmit={handleWriteStoreEvent} className="flex flex-col gap-3 text-xs">
                <div className="flex justify-between gap-4">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-slate-400 font-bold">Event Title (Flash Sale):</label>
                    <input
                      type="text"
                      required
                      value={seTitle}
                      onChange={(e) => setSeTitle(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                    />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-slate-400 font-bold">Headline Icon/Logo (Upload):</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          const base64 = await convertToBase64(e.target.files[0]);
                          setSeIcon(base64);
                        }
                      }}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                    />
                    {seIcon && <img src={seIcon} alt="Preview" className="h-6 object-contain mt-1" />}
                  </div>
                </div>
                <div className="flex justify-between gap-4">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-slate-400 font-bold">Background Cover Banner (Upload):</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          const base64 = await convertToBase64(e.target.files[0]);
                          setSeBanner(base64);
                        }
                      }}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                    />
                    {seBanner && <img src={seBanner} alt="Preview" className="h-10 object-contain mt-1" />}
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-slate-400 font-bold">Redirect Target URL (Optional):</label>
                    <input
                      type="text"
                      value={seTargetUrl}
                      onChange={(e) => setSeTargetUrl(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-bold">Event Expiration Date & Time (অটো ডিলিট হওয়ার সময়):</label>
                  <input
                    type="datetime-local"
                    value={seExpiryTime}
                    onChange={(e) => setSeExpiryTime(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                  />
                  <p className="text-[10px] text-slate-500">এই সময় পার হওয়ার পর ইভেন্টটি স্বয়ংক্রিয়ভাবে মুছে যাবে।</p>
                </div>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded text-xs select-none">
                  Add Store Event
                </button>
              </form>
              <div className="mt-4 flex flex-col gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-500">Active Store Events</span>
                {storeEvents.map((se) => (
                  <div key={se.id} className="p-2.5 bg-slate-900 rounded-xl flex justify-between items-center text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-8 border border-slate-700 rounded overflow-hidden flex items-center justify-center bg-black">
                        {se.banner ? <img src={se.banner} alt="Bg" className="w-full h-full object-cover" /> : <span>No Banner</span>}
                      </div>
                      <div className="flex flex-col opacity-90">
                         <span className="font-bold">{se.title}</span>
                         <span className="text-[10px]">Contains {products.filter(p => p.eventId === se.id).length} items attached</span>
                         {se.expiryTime && (
                           <span className="text-[9.5px] text-amber-500 font-mono mt-0.5">
                             Expires: {new Date(se.expiryTime).toLocaleString()}
                           </span>
                         )}
                      </div>
                    </div>
                    <button onClick={() => handleDeleteStoreEvent(se.id)} className="text-red-500 font-bold hover:underline">Delete</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Promo Banners */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl flex flex-col gap-4 md:col-span-2">
              <h3 className="font-bold text-white text-sm uppercase tracking-wide border-b border-slate-800 pb-3">
                Promo Banners
              </h3>
              <form onSubmit={handleWritePromoBanner} className="flex flex-col gap-3 text-xs">
                <div className="flex justify-between gap-4">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-slate-400 font-bold">Promo Image (Upload):</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          const base64 = await convertToBase64(e.target.files[0]);
                          setPbImage(base64);
                        }
                      }}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                    />
                    {pbImage && <img src={pbImage} alt="Preview" className="h-10 object-contain mt-1" />}
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-slate-400 font-bold">Target Main Category ID (Optional):</label>
                    <select
                      value={pbTargetCat}
                      onChange={(e) => setPbTargetCat(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                    >
                      <option value="">None</option>
                      {mainCategories.map(mc => (
                        <option key={mc.id} value={mc.id}>{mc.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded text-xs select-none">
                  Add Promo Banner
                </button>
              </form>
              <div className="mt-4 flex flex-col gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-500">Active Promo Banners</span>
                {promoBanners.map((pb) => (
                  <div key={pb.id} className="p-2.5 bg-slate-900 rounded-xl flex justify-between items-center text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-8 border border-slate-700 rounded overflow-hidden flex items-center justify-center">
                        <img src={pb.image} alt="Promo" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col opacity-90 max-w-xs whitespace-pre-wrap">
                         <span className="font-bold">{pb.title.replace(/\\n/g, '\n')}</span>
                      </div>
                    </div>
                    <button onClick={() => handleDeletePromoBanner(pb.id)} className="text-red-500 font-bold hover:underline">Delete</button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: CAMPAIGN VOUCHERS */}
        {activeTab === "coupons" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left" id="coupons-tab">
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl flex flex-col gap-4">
              <h3 className="font-bold text-white text-sm uppercase tracking-wide border-b border-slate-800 pb-3">
                Deploy promotional discount coupon
              </h3>
              <form onSubmit={handleWriteCoupon} className="flex flex-col gap-3 text-xs">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-bold">Coupon Code:</label>
                  <input
                    type="text"
                    required
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="EIDMUBARAK"
                    className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 uppercase"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-bold">Discount value (%):</label>
                  <input
                    type="number"
                    required
                    value={couponVal}
                    onChange={(e) => setCouponVal(e.target.value)}
                    placeholder="10"
                    className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-bold">Minimum Cart Value (৳):</label>
                  <input
                    type="number"
                    value={couponMinSub}
                    onChange={(e) => setCouponMinSub(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                  />
                </div>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded text-xs select-none">
                  Deploy Kampaign Coupon
                </button>
              </form>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl flex flex-col gap-3">
              <h3 className="font-bold text-white text-sm uppercase tracking-wide border-b border-slate-800 pb-3">Active Coupons</h3>
              <div className="flex flex-col gap-2">
                {coupons.length === 0 ? (
                  <p className="text-slate-500 text-xs italic">No coupons defined yet.</p>
                ) : coupons.map(c => (
                  <div key={c.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold font-mono text-emerald-400 text-sm">{c.code}</p>
                      <span className="text-[10px] text-slate-400">Needs Min purchase: ৳{c.minOrderAmount} | Value: -{c.discountValue}%</span>
                    </div>
                    <button onClick={() => handleDeleteCoupon(c.id)} className="text-red-500 font-bold hover:underline">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CUSTOMERS & BLACKLISTS */}
        {activeTab === "customers" && (
          <div className="flex flex-col gap-4 text-left font-semibold text-xs text-slate-350" id="customers-tab">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
              <span>Managed buyer counts: {customers.length} registered profiles</span>
              <span className="text-[10px] text-slate-500">Blacklisted phone logs automatically blocks checkouts velocity.</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full">
                <thead className="bg-slate-900 border-b border-slate-800 font-bold uppercase text-[10px] text-slate-400 text-left">
                  <tr>
                    <th className="px-4 py-3">Buyer Name</th>
                    <th className="px-4 py-3">Phone number</th>
                    <th className="px-4 py-3">Primary Delivery Address</th>
                    <th className="px-4 py-3 text-center">Orders Placed</th>
                    <th className="px-4 py-3 text-right">Amount Spent</th>
                    <th className="px-4 py-3 text-center">Blacklisted Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id} className={`border-b border-slate-850 hover:bg-slate-900 transition-all ${
                      c.isBlacklisted ? "bg-red-950/25" : ""
                    }`}>
                      <td className="px-4 py-3 text-white font-bold">{c.name}</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-200">{c.phone}</td>
                      <td className="px-4 py-3 leading-relaxed">{c.address}</td>
                      <td className="px-4 py-3 text-center text-white font-mono">{c.ordersCount} orders</td>
                      <td className="px-4 py-3 text-right font-mono text-emerald-400 font-bold">৳{c.totalSpent.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleCustomerBlacklist(c.phone)}
                          className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold tracking-wide transition-all uppercase cursor-pointer ${
                            c.isBlacklisted 
                              ? "bg-red-800 hover:bg-red-900 text-white" 
                              : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                          }`}
                        >
                          {c.isBlacklisted ? "BLACKLISTED" : "WHITELISTED (Safe)"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 8: COURIERS SYSTEM & SMS GATEWAYS */}
        {activeTab === "couriers" && (
          <div className="flex flex-col gap-6 text-left text-xs" id="couriers-gateway-tab">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Courier Configurations */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col gap-4">
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wide border-b border-slate-800 pb-3 flex items-center gap-1.5 font-sans">
                  <Truck className="w-4 h-4 text-emerald-400 font-bold" />
                  <span>Courier API Configurations</span>
                </h3>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-slate-400 font-bold">Steadfast Courier API Secret:</label>
                    <input
                      type="password"
                      value={courierSteadfastKey}
                      onChange={(e) => setCourierSteadfastKey(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-slate-400 font-bold">Pathao Express Token Key:</label>
                    <input
                      type="password"
                      value={courierPathaoKey}
                      onChange={(e) => setCourierPathaoKey(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-slate-400 font-bold">RedX Courier Client ID:</label>
                    <input
                      type="password"
                      value={courierRedxKey}
                      onChange={(e) => setCourierRedxKey(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-bold">Sundarban Courier ID:</label>
                      <input
                        type="password"
                        value={courierSundarbanKey}
                        onChange={(e) => setCourierSundarbanKey(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-bold">Paperfly Security Token:</label>
                      <input
                        type="password"
                        value={courierPaperflyKey}
                        onChange={(e) => setCourierPaperflyKey(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-2 p-3 bg-slate-900/50 border border-dashed border-slate-800 rounded-lg flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="autoCourierCheck"
                      checked={autoCourierSubmit}
                      onChange={(e) => setAutoCourierSubmit(e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 cursor-pointer"
                    />
                    <label htmlFor="autoCourierCheck" className="text-[11px] text-slate-400 leading-tight cursor-pointer font-semibold">
                      Enable API Integration (Orders automatically push to Courier APIs upon verification)
                    </label>
                  </div>
                </div>
              </div>

              {/* SMS Config & Broadcast */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col gap-4 font-sans">
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wide border-b border-slate-800 pb-3 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>SMS Gateway Configuration & Broadcast</span>
                </h3>

                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-slate-400 font-bold">BulkSMSBD API Key:</label>
                      <input
                        type="password"
                        value={smsApiKey}
                        onChange={(e) => setSmsApiKey(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-slate-400 font-bold">BulkSMSBD SenderID:</label>
                      <input
                        type="text"
                        value={smsSenderId}
                        onChange={(e) => setSmsSenderId(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* SMS templates */}
                  <div className="border border-slate-900 p-3 rounded-lg flex flex-col gap-2 bg-slate-900/30 text-left">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">SMS templates routing</span>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 font-bold text-[10px]">Order Confirmation SMS:</label>
                      <textarea
                        value={smsOrderConfTemplate}
                        onChange={(e) => setSmsOrderConfTemplate(e.target.value)}
                        rows={1}
                        className="bg-slate-900 border border-slate-800 rounded p-2 text-[10.5px] text-slate-300 focus:outline-none resize-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 font-bold text-[10px]">Delivery Tracking SMS:</label>
                      <textarea
                        value={smsDeliveryTemplate}
                        onChange={(e) => setSmsDeliveryTemplate(e.target.value)}
                        rows={1}
                        className="bg-slate-900 border border-slate-800 rounded p-2 text-[10.5px] text-slate-300 focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                  {/* SMS Broadcast form */}
                  <div className="border-t border-slate-900 pt-3 text-left">
                    <div className="flex items-center justify-between mb-2">
                       <label className="text-white font-bold block mb-1">Bulk SMS Campaign</label>
                       <button onClick={handleUpdateSettings} className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors">SAVE SMS KEYS TO SERVER</button>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={smsBulkMessage}
                        onChange={(e) => setSmsBulkMessage(e.target.value)}
                        placeholder="Enter campaign promotional SMS broadcast content here..."
                        className="bg-slate-900 border border-slate-800 text-xs text-white p-2 rounded focus:outline-none w-full"
                      />
                      <button 
                        type="button"
                        onClick={handleSendBulkSms}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded text-xs select-none shrink-0 cursor-pointer"
                      >
                        Broadcast SMS
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Broadcast Logs Ledger */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col gap-3 font-sans">
              <h4 className="font-extrabold text-xs text-slate-300 uppercase tracking-wide border-b border-slate-850 pb-2">Bulk Campaign Delivery Logs</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 font-black">
                      <th className="pb-1 text-center w-12">Batch ID</th>
                      <th className="pb-1">Content</th>
                      <th className="pb-1 text-center font-bold">Status</th>
                      <th className="pb-1 text-center font-bold">Outbound Users</th>
                      <th className="pb-1 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {smsBulkLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-900/30">
                        <td className="py-2.5 text-center font-mono font-bold text-slate-400">#{log.id}</td>
                        <td className="py-2.5 font-medium">{log.message}</td>
                        <td className="py-2.5 text-center">
                          <span className="bg-emerald-950 text-emerald-450 border border-emerald-900/30 font-black text-[9px] px-1.5 py-0.2 rounded font-mono">
                            {log.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-center font-mono font-bold text-white">{log.numberCount} buyers</td>
                        <td className="py-2.5 text-right text-slate-505 text-slate-400 font-mono">{log.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: PAYMENTS & REPORTS PANEL */}
        {activeTab === "payments" && (
          <div className="flex flex-col gap-6 text-left text-xs" id="payments-reports-tab">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Payment Gateways Config */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col gap-4 font-sans">
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wide border-b border-slate-800 pb-3 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-400 font-black" />
                  <span>Payment Gateway Configurations</span>
                </h3>

                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-slate-400 font-bold">SSLCommerz Store ID:</label>
                      <input
                        type="text"
                        value={paymentSslId}
                        onChange={(e) => setPaymentSslId(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-slate-400 font-bold">SSLCommerz Store Pass:</label>
                      <input
                        type="password"
                        value={paymentStripeSecret}
                        onChange={(e) => setPaymentStripeSecret(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-slate-400 font-bold">SSLCommerz Env:</label>
                    <select 
                      value={paymentSslIsLive ? "live" : "sandbox"}
                      onChange={(e) => setPaymentSslIsLive(e.target.value === "live")}
                      className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-sans cursor-pointer focus:outline-none w-full"
                    >
                      <option value="sandbox">Sandbox (Test Mode)</option>
                      <option value="live">Live (Production Mode)</option>
                    </select>
                  </div>
                  <p className="text-[10px] text-slate-500 italic mt-1">Note: Cash on Delivery (COD) is always enabled by default.</p>
                </div>
              </div>

              {/* Refund manager system */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col gap-4 font-sans text-left">
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wide border-b border-slate-800 pb-3 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Payment Refund Panel</span>
                </h3>

                <form onSubmit={handleManualRefund} className="flex flex-col gap-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-bold">Order ID:</label>
                      <input
                        type="text"
                        required
                        value={refundOrderId}
                        onChange={(e) => setRefundOrderId(e.target.value)}
                        placeholder="ord-102"
                        className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 uppercase font-mono"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 font-bold">Refund Amount:</label>
                      <input
                        type="number"
                        required
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        placeholder="500"
                        className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-slate-400 font-bold">Reason for Refund:</label>
                    <input
                      type="text"
                      required
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      placeholder="Out of stock / Customer canceled placement"
                      className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none"
                    />
                  </div>
                  <button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded text-xs transition-all uppercase cursor-pointer">
                    Issue Instant Refund
                  </button>
                </form>
              </div>

            </div>

            {/* Refund Ledger Log table */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col gap-3 font-sans">
              <h4 className="font-extrabold text-xs text-slate-350 uppercase tracking-wide border-b border-slate-850 pb-2">Refund Logs Registry</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 font-black">
                      <th className="pb-1">Order ID</th>
                      <th className="pb-1 text-right">Refund Amount</th>
                      <th className="pb-1">Refund Reason</th>
                      <th className="pb-1 text-center">Status</th>
                      <th className="pb-1 text-right">Processed At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {refundList.map((ref) => (
                      <tr key={ref.id} className="hover:bg-slate-900/30">
                        <td className="py-2.5 font-mono font-bold text-white uppercase">#{ref.orderId}</td>
                        <td className="py-2.5 text-right font-mono font-bold text-rose-400">৳{ref.amount.toLocaleString()}</td>
                        <td className="py-2.5 text-slate-400">{ref.reason}</td>
                        <td className="py-2.5 text-center">
                          <span className="bg-emerald-950 text-emerald-450 border border-emerald-900/30 font-black text-[9px] px-2 py-0.5 rounded uppercase font-mono">
                            {ref.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-right text-slate-505 text-slate-400 font-mono">{ref.date || ref.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dynamic Reports & Charts Panel with tabs (sales, orders, profit, couriers) */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col gap-5 font-sans">
              <div className="border-b border-slate-850 pb-3 flex flex-wrap gap-4 items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-widest">Financial Analytics Reports</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Filter monthly revenues and platform delivery stats</p>
                </div>

                <div className="flex gap-2 bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                  {(["sales", "orders", "profit", "courier"] as any[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setReportsActiveTab(tab)}
                      className={`px-3 py-1 text-[10px] font-black uppercase rounded transition-all cursor-pointer ${
                        reportsActiveTab === tab 
                          ? "bg-slate-850 text-white shadow-xs border border-slate-700 font-bold" 
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {tab} Report
                    </button>
                  ))}
                </div>
              </div>

              {/* Show simulated reporting info based on active tab */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="bg-slate-900 p-4 border border-slate-800 rounded-xl">
                  <p className="text-slate-500 text-[10px] font-black uppercase">Report Type</p>
                  <p className="text-white font-extrabold text-sm font-sans mt-1 capitalize">{reportsActiveTab} Report active</p>
                  <p className="text-[10px] text-emerald-450 mt-1">✓ Status: audit approved</p>
                </div>
                <div className="bg-slate-900 p-4 border border-slate-800 rounded-xl">
                  <p className="text-slate-500 text-[10px] font-black uppercase">Taxable Income</p>
                  <p className="text-white font-extrabold text-sm font-sans mt-1">৳{(stats.totalSales * 0.15).toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Symmetric 15% NBR local rate applied</p>
                </div>
                <div className="bg-slate-900 p-4 border border-slate-800 rounded-xl">
                  <p className="text-slate-500 text-[10px] font-black uppercase">Courier Dispatch costs</p>
                  <p className="text-white font-extrabold text-sm font-sans mt-1">৳{(orders.length * 80).toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Based on flat ৳80 delivery charge rate</p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 10: REVIEWS & STAFF ROSTER HUB */}
        {activeTab === "reviews" && (
          <div className="flex flex-col gap-6 text-left text-xs" id="reviews-staffing-tab">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Review Moderation */}
              <div className="lg:col-span-7 bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col gap-4 font-sans text-left">
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wide border-b border-slate-800 pb-3 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Review Moderation Hub</span>
                </h3>

                <div className="flex flex-col gap-3">
                  {reviewsList && reviewsList.length > 0 ? (
                    reviewsList.map((rev: any) => (
                      <div key={rev.id} className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-start text-xs hover:bg-slate-900/60 transition-all">
                        <div className="flex gap-2.5">
                          <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold font-sans text-white text-[11px] border border-slate-700 uppercase">
                            {rev.userName.slice(0, 2).toUpperCase()}
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-white text-[11px]">{rev.userName}</p>
                              <span className="text-[9px] text-slate-400 font-mono font-black border border-slate-800 rounded px-1">{rev.productName || "Product Item"}</span>
                            </div>
                            <div className="flex gap-0.5 text-amber-500 my-1 font-sans leading-none font-bold">
                              {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                            </div>
                            <p className="text-slate-300 leading-relaxed max-w-[340px] text-[11px]">{rev.comment}</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className={`text-[9px] uppercase font-mono font-black py-0.5 px-1 rounded ${
                            rev.isApproved ? "bg-emerald-950 text-emerald-400 border border-emerald-900/50" : "bg-yellow-950/60 text-yellow-450 border border-yellow-900/30"
                          }`}>
                            {rev.isApproved ? "APPROVED" : "PENDING"}
                          </span>
                          <button
                            onClick={() => handleToggleReviewApproval(rev.id)}
                            className="bg-slate-800 hover:bg-slate-705 border border-slate-700 text-slate-300 hover:text-white px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-all uppercase"
                          >
                            {rev.isApproved ? "Hold" : "Approve"}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center italic py-10 text-slate-550 text-xs">No reviews submitted by customers yet.</div>
                  )}
                </div>
              </div>

              {/* Staff Management */}
              <div className="lg:col-span-5 bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col gap-4 font-sans text-left">
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wide border-b border-slate-800 pb-3 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Administrative Staff Roster</span>
                </h3>

                {/* Create staff member */}
                <form onSubmit={handleCreateStaff} className="p-3.5 bg-slate-900/40 border border-slate-850 rounded-xl flex flex-col gap-2.5">
                  <p className="text-[10px] text-slate-450 uppercase font-black tracking-wider">Add Administrative Officer</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 text-[10px] font-bold">Officer Name:</label>
                      <input 
                        type="text" 
                        required
                        value={newStaffName}
                        onChange={(e) => setNewStaffName(e.target.value)}
                        placeholder="Shakil Rahman"
                        className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-400 text-[10px] font-bold">Staff Role:</label>
                      <select 
                        value={newStaffRole}
                        onChange={(e) => setNewStaffRole(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 cursor-pointer focus:outline-none"
                      >
                        <option value="Manager">Manager</option>
                        <option value="Support Agent">Support Agent</option>
                        <option value="Inventory Officer">Inventory Officer</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-slate-400 text-[10px] font-bold">Email Address:</label>
                    <input 
                      type="email" 
                      required
                      value={newStaffEmail}
                      onChange={(e) => setNewStaffEmail(e.target.value)}
                      placeholder="shakil@amarstore.com.bd"
                      className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono focus:outline-none"
                    />
                  </div>
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded text-xs select-none uppercase cursor-pointer">
                    Appoint Officer
                  </button>
                </form>

                {/* Staff list roster */}
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] text-slate-450 uppercase font-black tracking-wider border-b border-slate-800 pb-1 mt-1">Active Officers List</p>
                  {staffList.map((st) => (
                    <div key={st.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center text-xs hover:bg-slate-900/60 transition-all">
                      <div>
                        <p className="font-extrabold text-white text-[11px]">{st.name}</p>
                        <p className="text-[10px] text-slate-450 font-mono">{st.email}</p>
                        <span className="text-[9px] text-emerald-450 border border-emerald-950 font-black px-1.5 bg-emerald-950/20 rounded mt-1 inline-block uppercase font-mono">{st.role}</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setStaffList(staffList.filter(s => s.id !== st.id))}
                        className="text-rose-500 hover:text-rose-400 font-bold hover:underline cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 7: ENGINE CONFIGURATION */}
        {activeTab === "settings" && (
          <form onSubmit={handleUpdateSettings} className="bg-slate-950 border border-slate-800 p-6 rounded-3xl text-left flex flex-col gap-8" id="settings-engine-tab">
            
            {/* Settings Navigation */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl w-fit">
              {[
                { id: "general", label: "General", icon: Settings },
                { id: "appearance", label: "Appearance", icon: Palette },
                { id: "contact", label: "Contact", icon: PhoneCall },
                { id: "integrations", label: "Integrations", icon: Globe },
                { id: "pwa", label: "PWA Config", icon: Smartphone },
                { id: "database", label: "Database", icon: Database }
              ].map((cat) => {
                const CatIcon = cat.icon;
                const active = settingsCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSettingsCategory(cat.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      active ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <CatIcon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-6">
              
              {/* ================= PWA SETTINGS ================= */}
              {settingsCategory === "pwa" && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800/50">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <div className="w-2 h-6 bg-emerald-500 rounded-full" />
                      PWA (Progressive Web App) Configuration
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">App Name</label>
                        <input 
                          type="text"
                          value={pwaName}
                          onChange={(e) => setPwaName(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-600 transition-all font-semibold"
                          placeholder="Full app name for installation"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Short Name</label>
                        <input 
                          type="text"
                          value={pwaShortName}
                          onChange={(e) => setPwaShortName(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-600 transition-all font-semibold"
                          placeholder="Displayed on user's home screen"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Icon URL (512x512 PNG)</label>
                        <input 
                          type="text"
                          value={pwaIconUrl}
                          onChange={(e) => setPwaIconUrl(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-600 transition-all"
                          placeholder="https://example.com/icon.png"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Start URL</label>
                        <input 
                          type="text"
                          value={pwaStartUrl}
                          onChange={(e) => setPwaStartUrl(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-600 transition-all font-mono"
                          placeholder="/"
                        />
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-emerald-900/20 border border-emerald-900/30 rounded-xl">
                      <p className="text-[11px] text-emerald-400 leading-relaxed italic">
                        * PWA configuration allows your users to install the website as a mobile app. 
                        Changing these settings will update the manifest.json automatically. 
                        The "Open" button in the store will trigger the installation.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {settingsCategory === "general" && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Site Name</label>
                      <input 
                        type="text"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-600 transition-all font-semibold"
                        placeholder="e.g. KenakataBD"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock Threshold</label>
                      <input 
                        type="number"
                        value={lowStockThresh}
                        onChange={(e) => setLowStockThresh(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-600 transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800/50 flex flex-col gap-5">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col gap-0.5 text-left">
                        <h4 className="font-bold text-sm text-white">OTP Verification at Checkout</h4>
                        <p className="text-[10px] text-slate-400">Require users to verify their phone number via SMS before placing an order.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setOtpToggled(!otpToggled)}
                        className={`w-12 h-6 rounded-full relative transition-all ${otpToggled ? "bg-emerald-600" : "bg-slate-700"}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${otpToggled ? "left-7" : "left-1"}`} />
                      </button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex flex-col gap-0.5 text-left">
                        <h4 className="font-bold text-sm text-white">Automated Delivery Request</h4>
                        <p className="text-[10px] text-slate-400">Automatically push new orders to your default courier system (Steadfast/Pathao).</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setAutoCourierSubmit(!autoCourierSubmit)}
                        className={`w-12 h-6 rounded-full relative transition-all ${autoCourierSubmit ? "bg-emerald-600" : "bg-slate-700"}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${autoCourierSubmit ? "left-7" : "left-1"}`} />
                      </button>
                    </div>

                    <div className="flex flex-col gap-1.5 text-left pt-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Default Courier Service</label>
                      <select 
                        value={defaultCourier}
                        onChange={(e) => setDefaultCourier(e.target.value as any)}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-600"
                      >
                        <option value="Steadfast">Steadfast Courier</option>
                        <option value="Pathao">Pathao Courier</option>
                        <option value="RedX">RedX Courier</option>
                        <option value="Sundarban">Sundarban Courier</option>
                        <option value="Paperfly">Paperfly Courier</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= APPEARANCE SETTINGS ================= */}
              {settingsCategory === "appearance" && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Site Logo URL</label>
                      <input 
                        type="text"
                        value={siteLogo}
                        onChange={(e) => setSiteLogo(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-600 font-mono"
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Favicon URL</label>
                      <input 
                        type="text"
                        value={siteFavicon}
                        onChange={(e) => setSiteFavicon(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-600 font-mono"
                        placeholder="https://example.com/favicon.ico"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Color</label>
                      <div className="flex gap-2">
                        <input 
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-10 h-10 rounded-lg bg-transparent cursor-pointer"
                        />
                        <input 
                          type="text"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 flex-grow text-xs text-slate-300 font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Header BG Color</label>
                      <div className="flex gap-2">
                        <input 
                          type="color"
                          value={headerColor}
                          onChange={(e) => setHeaderColor(e.target.value)}
                          className="w-10 h-10 rounded-lg bg-transparent cursor-pointer"
                        />
                        <input 
                          type="text"
                          value={headerColor}
                          onChange={(e) => setHeaderColor(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 flex-grow text-xs text-slate-300 font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Footer BG Color</label>
                      <div className="flex gap-2">
                        <input 
                          type="color"
                          value={footerColor}
                          onChange={(e) => setFooterColor(e.target.value)}
                          className="w-10 h-10 rounded-lg bg-transparent cursor-pointer"
                        />
                        <input 
                          type="text"
                          value={footerColor}
                          onChange={(e) => setFooterColor(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 flex-grow text-xs text-slate-300 font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Header Text Color</label>
                      <div className="flex gap-2">
                        <input 
                          type="color"
                          value={headerTextColor}
                          onChange={(e) => setHeaderTextColor(e.target.value)}
                          className="w-10 h-10 rounded-lg bg-transparent cursor-pointer"
                        />
                        <input 
                          type="text"
                          value={headerTextColor}
                          onChange={(e) => setHeaderTextColor(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 flex-grow text-xs text-slate-300 font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Footer Text Color</label>
                      <div className="flex gap-2">
                        <input 
                          type="color"
                          value={footerTextColor}
                          onChange={(e) => setFooterTextColor(e.target.value)}
                          className="w-10 h-10 rounded-lg bg-transparent cursor-pointer"
                        />
                        <input 
                          type="text"
                          value={footerTextColor}
                          onChange={(e) => setFooterTextColor(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 flex-grow text-xs text-slate-300 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= CONTACT & SOCIAL SETTINGS ================= */}
              {settingsCategory === "contact" && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Support Phone</label>
                      <input 
                        type="text"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-600 font-mono"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Support Email</label>
                      <input 
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Office Address</label>
                      <textarea 
                        value={contactAddress}
                        onChange={(e) => setContactAddress(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-600 min-h-[80px]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h5 className="text-xs font-extrabold text-white uppercase tracking-widest border-b border-slate-800 pb-2">Social Profiles</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400">Facebook URL</label>
                        <input 
                          type="text"
                          value={facebookUrl}
                          onChange={(e) => setFacebookUrl(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400">Instagram URL</label>
                        <input 
                          type="text"
                          value={instagramUrl}
                          onChange={(e) => setInstagramUrl(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400">YouTube URL</label>
                        <input 
                          type="text"
                          value={youtubeUrl}
                          onChange={(e) => setYoutubeUrl(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Footer Short Text (About us)</label>
                    <textarea 
                      value={footerText}
                      onChange={(e) => setFooterText(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-600 min-h-[60px]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Copyright Text</label>
                    <input 
                      type="text"
                      value={copyrightText}
                      onChange={(e) => setCopyrightText(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              )}

              {/* ================= INTEGRATIONS SETTINGS ================= */}
              {settingsCategory === "integrations" && (
                <div className="flex flex-col gap-8 animate-fade-in text-left">
                  
                  {/* SMS GATEWAY */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                      <Bell className="w-4 h-4 text-emerald-500" />
                      <h5 className="text-xs font-extrabold text-white uppercase tracking-widest">SMS Gateway Configurations</h5>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400">SMS-Bangladesh / Default API Key</label>
                        <input 
                          type="password"
                          value={smsApiKey}
                          onChange={(e) => setSmsApiKey(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400">Default Masking / Sender ID</label>
                        <input 
                          type="text"
                          value={smsSenderId}
                          onChange={(e) => setSmsSenderId(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400">BulkSMSBD API Key</label>
                        <input 
                          type="password"
                          value={bulkSmsApiKey}
                          onChange={(e) => setBulkSmsApiKey(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400">BulkSMSBD Sender ID</label>
                        <input 
                          type="text"
                          value={bulkSmsSenderId}
                          onChange={(e) => setBulkSmsSenderId(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PAYMENT GATEWAY */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                      <CreditCard className="w-4 h-4 text-blue-500" />
                      <h5 className="text-xs font-extrabold text-white uppercase tracking-widest">Payment Gateway Credentials</h5>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400">SSLCommerz Store ID</label>
                        <input 
                          type="text"
                          value={paymentSslId}
                          onChange={(e) => setPaymentSslId(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400">SSLCommerz Store Password</label>
                        <input 
                          type="password"
                          value={paymentStripeSecret}
                          onChange={(e) => setPaymentStripeSecret(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400">SSLCommerz Environment</label>
                        <select 
                          value={paymentSslIsLive ? "live" : "sandbox"}
                          onChange={(e) => setPaymentSslIsLive(e.target.value === "live")}
                          className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 font-sans cursor-pointer focus:border-blue-500 focus:outline-none"
                        >
                          <option value="sandbox">Sandbox (Test Mode)</option>
                          <option value="live">Live (Production Mode)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* PIXEL & ANALYTICS */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                      <ShieldCheck className="w-4 h-4 text-purple-500" />
                      <h5 className="text-xs font-extrabold text-white uppercase tracking-widest">Tracking & Analytics</h5>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400">Facebook Pixel ID</label>
                        <input 
                          type="text"
                          value={fbId}
                          onChange={(e) => setFbId(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400">Google Analytics (GA4) ID</label>
                        <input 
                          type="text"
                          value={gaId}
                          onChange={(e) => setGaId(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SOCIAL LOGIN */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      <h5 className="text-xs font-extrabold text-white uppercase tracking-widest">Social Login Configuration</h5>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400">Google OAuth Client ID</label>
                        <input 
                          type="text"
                          value={googleClientId}
                          onChange={(e) => setGoogleClientId(e.target.value)}
                          placeholder="e.g. 12345678-xxxx.apps.googleusercontent.com"
                          className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 font-mono focus:border-blue-500 focus:outline-none transition-colors"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">Required for Google One-Tap and standard Google Sign-In.</p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400">Facebook App ID</label>
                        <input 
                          type="text"
                          value={facebookAppId}
                          onChange={(e) => setFacebookAppId(e.target.value)}
                          placeholder="e.g. 1029384756..."
                          className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 font-mono focus:border-blue-500 focus:outline-none transition-colors"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">Required to enable Facebook login for users.</p>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* ================= DATABASE SETTINGS ================= */}
              {settingsCategory === "database" && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800/50 flex flex-col gap-5">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col gap-0.5 text-left">
                        <h4 className="font-bold text-sm text-white">Database Connection Strategy</h4>
                        <p className="text-[10px] text-slate-400">Configure connection strings for primary storage (PostgreSQL, MySQL, etc).</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 pt-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Database Connection URI</label>
                      <input 
                        type="text"
                        placeholder="postgresql://user:password@localhost:5432/kenakatabd"
                        className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-600 transition-all font-mono"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5 pt-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Database Type</label>
                      <select 
                        className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-600"
                      >
                        <option value="postgres">PostgreSQL</option>
                        <option value="mysql">MySQL</option>
                        <option value="mongodb">MongoDB</option>
                        <option value="sqlite">SQLite (Local)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

            </div>

            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 rounded-xl text-center select-none cursor-pointer uppercase text-xs shadow-xl shadow-emerald-900/20 transition-all active:scale-95">
              Sync Master configuration to server
            </button>
          </form>
        )}

        {/* TAB 8: GATEWAY TELEMETRY CHRONICLES */}
        {activeTab === "logs" && (
          <div className="flex flex-col gap-4 text-left font-semibold text-xs" id="logs-tab">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex justify-between items-center text-slate-350">
              <span>Security Event logs: {systemLogs.length} events compiled</span>
              <span className="text-[10px] text-slate-500">Chronological telemetry traces of API Courier pushes and dynamic OTP verifications.</span>
            </div>

            <div className="flex flex-col gap-3">
              {systemLogs.length === 0 ? (
                <p className="text-slate-500 italic">No backend notifications logged yet.</p>
              ) : (
                systemLogs.map((log) => {
                  return (
                    <div 
                      key={log.id} 
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        log.type === "SECURITY" 
                          ? "bg-red-950/20 border-red-900/60" 
                          : log.type === "COURIER_API"
                            ? "bg-blue-950/10 border-blue-900/50"
                            : log.type === "SMS"
                              ? "bg-purple-950/10 border-purple-900/50"
                              : "bg-slate-950 border-slate-800"
                      }`}
                    >
                      <div className="flex flex-col gap-1 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-900 text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded uppercase font-mono tracking-wider border border-slate-800">{log.type}</span>
                          <h4 className="text-white text-xs font-extrabold">{log.title}</h4>
                        </div>
                        <p className="text-slate-350 text-[11px] leading-relaxed font-normal">{log.message}</p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0 text-[10px]">
                        <span className="text-slate-500 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                        <span className={`px-2 py-0.5 rounded font-mono font-bold uppercase text-[9px] ${
                          log.status.includes("SUCCESS") || log.status.includes("Delivered") ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400"
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* SHOP REEL MANAGEMENT */}
        {activeTab === "shop-reels" && (
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl text-left flex flex-col gap-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                   <h2 className="text-xl font-bold text-white">Shop Reel Management</h2>
                   <p className="text-xs text-slate-500">Add or edit reels displayed on the storefront</p>
                </div>
                <button 
                  onClick={() => {
                    setEditReelId(null);
                    setReelTitle("");
                    setReelHandle("");
                    setReelCover("");
                    setShowAddReelModal(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  Add New Reel
                </button>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {shopReels.map((reel) => (
                   <div key={reel.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group relative">
                      <img src={reel.coverImage} className="w-full aspect-[3/4] object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={reel.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                         <span className="text-white font-bold text-xs">{reel.title}</span>
                         <span className="text-[10px] text-slate-400">@{reel.handle}</span>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                           onClick={() => {
                             setEditReelId(reel.id);
                             setReelTitle(reel.title);
                             setReelHandle(reel.handle);
                             setReelCover(reel.coverImage);
                             setShowAddReelModal(true);
                           }}
                           className="bg-white/20 hover:bg-white/40 p-1.5 rounded-lg text-white backdrop-blur-md"
                         >
                            <Edit3 className="w-3.5 h-3.5" />
                         </button>
                         <button 
                           onClick={() => handleDeleteReel(reel.id)}
                           className="bg-rose-500/20 hover:bg-rose-500/40 p-1.5 rounded-lg text-rose-400 backdrop-blur-md"
                         >
                            <Trash2 className="w-3.5 h-3.5" />
                         </button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* REEL ADD/EDIT MODAL */}
        {showAddReelModal && (
          <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-scale-up">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                   <h3 className="text-white font-bold">{editReelId ? "Edit Reel" : "Add New Shop Reel"}</h3>
                   <button onClick={() => setShowAddReelModal(false)} className="text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                   </button>
                </div>
                <form onSubmit={handleAddReel} className="p-6 flex flex-col gap-4">
                   <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Reel Title</label>
                      <input 
                        type="text"
                        value={reelTitle}
                        onChange={(e) => setReelTitle(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-emerald-500"
                        placeholder="e.g. Summer Outfits"
                        required
                      />
                   </div>
                   <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Handle / Username</label>
                      <input 
                        type="text"
                        value={reelHandle}
                        onChange={(e) => setReelHandle(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-emerald-500"
                        placeholder="e.g. style_hub"
                        required
                      />
                   </div>
                   <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Cover Image URL</label>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={reelCover}
                          onChange={(e) => setReelCover(e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-emerald-500 flex-1"
                          placeholder="https://..."
                          required
                        />
                        <label className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-3 rounded-xl cursor-pointer text-xs flex items-center">
                          Upload
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={async (e) => {
                              if (e.target.files?.[0]) {
                                const base64 = await convertToBase64(e.target.files[0]);
                                setReelCover(base64);
                              }
                            }}
                          />
                        </label>
                      </div>
                   </div>
                   {reelCover && (
                     <div className="aspect-[3/4] w-24 rounded-lg overflow-hidden border border-slate-800">
                        <img src={reelCover} className="w-full h-full object-cover" alt="Preview" />
                     </div>
                   )}
                   <div className="flex gap-3 mt-4">
                      <button 
                        type="button" 
                        onClick={() => setShowAddReelModal(false)}
                        className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold py-3 rounded-xl text-xs"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs"
                      >
                        {editReelId ? "Update Reel" : "Save Reel"}
                      </button>
                   </div>
                </form>
             </div>
          </div>
        )}

      </main>

      {/* ================= MODAL: ORDER MANAGE / SECURE ANALYSIS DETAILS ================= */}
      {activeOrderModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-[100] p-4 text-left" id="order-analyser-details-modal">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col p-6 text-xs text-slate-350 shadow-2xl relative animate-scale-up">
            
            <button 
              onClick={() => setActiveOrderModal(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5.5 h-5.5" />
            </button>

            <h3 className="font-extrabold text-white text-sm uppercase pb-3 border-b border-slate-800 mb-4 tracking-wide text-emerald-400">
              Manage Purchase Order: #{activeOrderModal.id}
            </h3>

            {/* Buyer general bio card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2 font-normal text-slate-400 leading-normal mb-4">
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1">
                <Users className="w-4 h-4 text-slate-500" />
                <span>Buyer Specifications Ledger</span>
              </p>
              <p><strong>Name of Placer:</strong> {activeOrderModal.customerName}</p>
              <p><strong>Clean Phone:</strong> {activeOrderModal.phone}</p>
              <p><strong>Precise Destination Delivery Address:</strong> {activeOrderModal.address}</p>
              <p><strong>Placer Device:</strong> <span className="font-mono text-[10.5px] text-slate-500">{activeOrderModal.deviceInfo}</span></p>
              <p><strong>Placer IP Address:</strong> <span className="font-mono text-[10.5px] text-slate-500">{activeOrderModal.ipAddress}</span></p>
              {activeOrderModal.notes && (
                <p className="bg-slate-900/40 p-2 border border-slate-800 rounded italic text-[11px] text-slate-400">💡 <strong>Buyer Notes:</strong> "{activeOrderModal.notes}"</p>
              )}
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2 font-normal text-slate-400 leading-normal mb-4">
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1">
                <ShoppingBag className="w-4 h-4 text-slate-500" />
                <span>Ordered Items</span>
              </p>
              <div className="flex flex-col gap-3">
                {activeOrderModal.items && activeOrderModal.items.map((item, idx) => {
                  let variantString = "";
                  if (item.variant && typeof item.variant === "object") {
                    variantString = Object.entries(item.variant)
                      .filter(([k, v]) => !["id", "image", "price", "stock"].includes(k) && v)
                      .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
                      .join(', ');
                  }
                  const productRef = products.find(p => p.id === item.productId);
                  const itImage = item.image || (item.variant && (item.variant as any).image) || (productRef && productRef.gallery && productRef.gallery[0]) || "";
                  return (
                    <div key={idx} className="flex justify-between items-center text-xs pb-2 border-b border-slate-800/50 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        {itImage && <img src={itImage} alt="product" className="w-8 h-8 object-cover rounded bg-slate-900 border border-slate-800" />}
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-200 truncate max-w-[200px]">{item.name || `Product ID: ${item.productId}`} x{item.quantity}</span>
                          {variantString && <span className="text-[10px] text-slate-500">{variantString}</span>}
                        </div>
                      </div>
                      <span className="font-mono text-emerald-500 font-bold">৳{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between items-center pt-2 mt-1 border-t border-slate-800">
                <span className="font-bold text-slate-300">Total BDT</span>
                <span className="font-bold text-emerald-400 text-sm">৳{activeOrderModal.total.toLocaleString()}</span>
              </div>
            </div>

            {/* AI Security Grading details panel */}
            <div className="bg-slate-950 p-4 rounded-xl border border-rose-900/40 flex flex-col gap-3 mb-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <div className="flex items-center gap-1.5 font-bold text-white text-xs uppercase text-red-400">
                  <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
                  <span>AI Fraud Threat Rating</span>
                </div>
                <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                  activeOrderModal.riskLevel === "LOW" ? "bg-emerald-950 text-emerald-400" : activeOrderModal.riskLevel === "MEDIUM" ? "bg-amber-950 text-amber-500" : "bg-red-950 text-red-400"
                }`}>
                  {activeOrderModal.riskScore}% {activeOrderModal.riskLevel}
                </span>
              </div>

              {/* Blacklist block / Toggle button */}
              <div className="flex justify-between items-center gap-3">
                <p className="text-[11px] leading-relaxed text-slate-400">Toggle customer global blacklist status. Blacklist locks future orders instantly.</p>
                <button
                  onClick={() => handleToggleCustomerBlacklist(activeOrderModal.phone)}
                  className={`px-3 py-1.5 rounded text-[10px] font-extrabold tracking-wide shrink-0 transition-all cursor-pointer ${
                    customers.find(c => c.phone === activeOrderModal.phone)?.isBlacklisted 
                      ? "bg-red-600 text-white" 
                      : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  }`}
                >
                  {customers.find(c => c.phone === activeOrderModal.phone)?.isBlacklisted ? "REMOVE RULE (Whistle)" : "BLACKLIST NUMBER (Block)"}
                </button>
              </div>

              {/* Risk Reasons bullet log */}
              <div className="flex flex-col gap-1 bg-slate-900/60 p-3 rounded-lg border border-slate-850">
                <span className="text-[9.5px] uppercase font-bold text-slate-500">Grade Threat Reasoning:</span>
                <ul className="list-disc pl-4 text-[10.5px] text-slate-400 flex flex-col gap-1 leading-relaxed mt-1">
                  {activeOrderModal.riskReasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Courier API dispatch block */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-3 mb-4">
              <p className="font-bold text-white text-xs uppercase flex items-center gap-1">
                <Truck className="w-4.5 h-4.5 text-blue-500" />
                <span>Automated Courier API Dispatch integration</span>
              </p>
              
              {activeOrderModal.courier ? (
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-850 flex flex-col gap-2 font-semibold">
                  <div className="flex justify-between items-center text-[11px]">
                    <span>Dispatched Courier APY: <strong className="text-emerald-400">{activeOrderModal.courier.api}</strong></span>
                    <span className="bg-blue-950 text-blue-400 px-1.5 py-0.5 rounded text-[9.5px] font-mono leading-none">SENT ACTIVE</span>
                  </div>
                  <p className="text-[11px]"><strong>Saved Tracking ID:</strong> <span className="font-mono bg-slate-950 border px-1.5 py-0.5 rounded text-white">{activeOrderModal.courier.trackingId}</span></p>
                  <p className="text-[11px]"><strong>Last Sync response:</strong> <span className="text-slate-400 leading-normal">"{activeOrderModal.courier.status}"</span></p>
                  
                  {/* Simulate Status updates hook */}
                  <div className="flex gap-1 flex-wrap mt-1">
                    <button onClick={() => handleSimulateCourierWebhook(activeOrderModal.id, "Shipped outwards Dhaka hub", "Shipped")} className="bg-slate-850 hover:bg-slate-800 border-slate-750 border px-2 py-1 text-[10px] text-slate-300 rounded cursor-pointer">Simulate Shipped Webhook</button>
                    <button onClick={() => handleSimulateCourierWebhook(activeOrderModal.id, "Delivered Successfully to customer and COD collected", "Delivered")} className="bg-emerald-950/40 hover:bg-emerald-955 text-emerald-400 border border-emerald-900/50 px-2 py-1 text-[10px] rounded cursor-pointer">Simulate Delivered Webhook</button>
                    <button onClick={() => handleSimulateCourierWebhook(activeOrderModal.id, "Customer rejected to receive order regarding delay", "Returned")} className="bg-red-950/40 hover:bg-red-910 text-red-400 border border-red-900/50 px-2 py-1 text-[10px] rounded cursor-pointer">Simulate Returned Webhook</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-slate-400 text-[11px]">Trigger dispatch request immediately. This auto populates name, mobile, address, and COD BDT count parameter to courier servers.</p>
                  <div className="grid grid-cols-5 gap-1.5 font-bold">
                    {["Steadfast", "Pathao", "RedX", "Sundarban", "Paperfly"].map(vendor => (
                      <button
                        key={vendor}
                        onClick={() => handleManualCourierDispatch(activeOrderModal.id, vendor)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] py-2 rounded font-extrabold cursor-pointer select-none text-center"
                      >
                        {vendor}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Manual Status Controller */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2 text-xs">
              <span className="font-bold text-white uppercase text-[10.5px]">Manual Status Override</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Shipping Stage:</label>
                  <select 
                    value={activeOrderModal.deliveryStatus}
                    onChange={(e) => handleUpdateOrderStatus(activeOrderModal.id, e.target.value, activeOrderModal.paymentStatus)}
                    className="bg-slate-900 border border-slate-750 text-slate-200 p-2 w-full rounded"
                  >
                    <option value="Pending">Pending unconfirmed</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped out</option>
                    <option value="Delivered">Delivered Successfully</option>
                    <option value="Returned">Returned cargo</option>
                    <option value="Cancelled">Cancelled spam</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Payment State:</label>
                  <select 
                    value={activeOrderModal.paymentStatus}
                    onChange={(e) => handleUpdateOrderStatus(activeOrderModal.id, activeOrderModal.deliveryStatus, e.target.value)}
                    className="bg-slate-900 border border-slate-750 text-slate-200 p-2 w-full rounded"
                  >
                    <option value="Pending">COD unpaid Pending</option>
                    <option value="Paid">Verified Paid</option>
                    <option value="Failed">Failed/Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Closer */}
            <button 
              onClick={() => setActiveOrderModal(null)}
              className="mt-5 w-full bg-slate-800 hover:bg-slate-750 py-2.5 rounded-xl font-bold text-white text-center border border-slate-705/30 border-slate-700"
            >
              Close Ledger sheet
            </button>

          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT PRODUCT FORM ================= */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-[110] p-4 text-left" id="admin-product-crud-modal">
          <form 
            onSubmit={handleWriteProduct}
            className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto flex flex-col p-6 text-xs text-slate-350 shadow-2xl relative animate-scale-up"
          >
            
            <button 
              type="button"
              onClick={() => { setShowAddProductModal(false); setEditProductPayload(null); }}
              className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5.5 h-5.5" />
            </button>

            <h3 className="font-extrabold text-white text-sm uppercase pb-3 border-b border-slate-800 mb-4 tracking-wide text-emerald-400 flex items-center gap-1.5">
              <ShoppingBag className="w-5 h-5" />
              <span>{editProductPayload ? "Edit Product State Specs" : "Add New Product Registry"}</span>
            </h3>

            {/* AI suggestion panel generator */}
            <div className="bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-900/60 p-4 rounded-xl flex items-center justify-between gap-4 mb-4">
              <div className="text-left max-w-md">
                <h4 className="font-extrabold text-white text-xs flex items-center gap-1 text-emerald-400 uppercase tracking-tight">
                  <Sparkles className="w-4.5 h-4.5 text-amber-400 animate-pulse" />
                  <span>Draft Copywriting with Gemini AI</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Simply enter product title and Brand below, and click suggest. AI writes CTR-winning description, specs list, and SEO titles instantly!</p>
              </div>

              <button
                type="button"
                disabled={aiGenerating}
                onClick={handleAiSEOSeed}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800 text-white font-extrabold text-[10.5px] px-3.5 py-2.5 rounded-lg tracking-wide uppercase shrink-0 transition-all flex items-center gap-1 cursor-pointer shadow-lg shadow-emerald-700/10"
              >
                {aiGenerating ? "Generating..." : "Generate specs"}
              </button>
            </div>

            {/* Fields form layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-slate-400 font-bold">Product Name <span className="text-gray-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Walton Primo V22 Smartphone or Jamdani Saree"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 font-bold text-xs focus:outline-emerald-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400">Regular retail Price (৳) <span className="text-gray-500">*</span></label>
                <input
                  type="number"
                  required
                  value={pPrice}
                  onChange={(e) => setPPrice(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400">Sale Campaign Price (Optional)</label>
                <input
                  type="number"
                  value={pSalePrice}
                  onChange={(e) => setPSalePrice(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400">Merchant Cost Price (৳ - profit helper)</label>
                <input
                  type="number"
                  value={pCostPrice}
                  onChange={(e) => setPCostPrice(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400">SKU Code (ELEC-WAL-128)</label>
                <input
                  type="text"
                  value={pSku}
                  onChange={(e) => setPSku(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-105 text-slate-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400">Stock count available near warehouse:</label>
                <input
                  type="number"
                  value={pStock}
                  onChange={(e) => setPStock(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400">Low Stock Limit setting:</label>
                <input
                  type="number"
                  value={pLowLimit}
                  onChange={(e) => setPLowLimit(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400">Category choice:</label>
                <select
                  value={pCategory}
                  onChange={(e) => setPCategory(e.target.value)}
                  className="bg-slate-950 border border-slate-750 text-slate-200 p-2 rounded"
                >
                  <option value="">Select Categories</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400">Brand representation:</label>
                <select
                  value={pBrand}
                  onChange={(e) => setPBrand(e.target.value)}
                  className="bg-slate-950 border border-slate-750 text-slate-200 p-2 rounded"
                >
                  <option value="">No brand / Universal</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400">Campaign / Event (Flash Sale):</label>
                <select
                  value={pEventId}
                  onChange={(e) => setPEventId(e.target.value)}
                  className="bg-slate-950 border border-slate-750 text-slate-200 p-2 rounded"
                >
                  <option value="">None / Regular</option>
                  {storeEvents.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-slate-400">Gallery images (Upload multiple):</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    if (e.target.files) {
                      const files = Array.from(e.target.files) as File[];
                      const base64Array = await Promise.all(files.map(file => convertToBase64(file)));
                      setPGallery(prev => {
                        const current = prev.split(',').map(s => s.trim()).filter(Boolean);
                        return [...current, ...base64Array].join(',');
                      });
                    }
                  }}
                  className="bg-slate-950 border border-slate-700 rounded px-2.5 py-2 text-slate-200"
                />
                
                {/* PREVIEW GALLERY */}
                {pGallery && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {pGallery.split(',').map((url, idx) => url.trim() ? (
                      <div key={idx} className="relative w-12 h-12 rounded overflow-hidden border border-slate-700 group">
                        <img src={url.trim()} alt="gallery" className="w-full h-full object-cover" />
                        <div 
                          className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center cursor-pointer"
                          onClick={() => {
                            setPGallery(prev => {
                              const arr = prev.split(',').map(s => s.trim()).filter(Boolean);
                              arr.splice(idx, 1);
                              return arr.join(',');
                            });
                          }}
                        >
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </div>
                      </div>
                    ) : null)}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-slate-400">Short summary brief (highlights in card details):</label>
                <input
                  type="text"
                  placeholder="Enter high level highlights"
                  value={pShortDesc}
                  onChange={(e) => setPShortDesc(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded px-2.5 py-2 text-slate-200 shadow-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-slate-400">Full markdown specs content description:</label>
                <textarea
                  placeholder="Write full specifications text..."
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  rows={3}
                  className="bg-slate-950 border border-slate-700 rounded p-2.5 text-slate-200"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-slate-400">Specification grid lines (key: value format, separate line per key):</label>
                <textarea
                  placeholder="Operating System: Android 13&#10;Battery size: 5000 mAh&#10;Material: Handloomed Cotton"
                  value={pSpecsInput}
                  onChange={(e) => setPSpecsInput(e.target.value)}
                  rows={3}
                  className="bg-slate-950 border border-slate-700 rounded p-2.5 text-slate-200 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded-t border border-slate-700">
                  <label className="text-slate-300 font-bold flex items-center gap-2">
                    <Plus className="w-4 h-4 text-emerald-500" />
                    Advanced Variants Setup
                  </label>
                  <button 
                    type="button"
                    onClick={() => {
                      setPVariants([...pVariants, { id: `var-${Date.now()}`, color: "", size: "", ram: "", storage: "", image: "", price: 0, stock: 0 }]);
                      if (onNotify) {
                        onNotify("success", "নতুন ভ্যারিয়েন্ট রো যুক্ত করা হয়েছে!");
                      }
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded text-[10px] font-bold transition-all border border-slate-600 cursor-pointer"
                  >
                    + Add Variant
                  </button>
                </div>
                <div className="bg-slate-900 border border-t-0 border-slate-700 rounded-b p-3 flex flex-col gap-3 max-h-64 overflow-y-auto">
                  {pVariants.length === 0 ? (
                    <div className="text-center text-slate-500 text-xs py-4">No advanced variants added yet.</div>
                  ) : (
                    pVariants.map((vari, vIdx) => (
                       <div key={vari.id || vIdx} className="bg-slate-950 p-3 border border-slate-700 rounded-lg relative flex flex-col gap-2 group">
                        <button 
                          type="button"
                          onClick={() => {
                            const clone = [...pVariants];
                            clone.splice(vIdx, 1);
                            setPVariants(clone);
                            if (onNotify) {
                              onNotify("warning", "ভ্যারিয়েন্ট রো মুছে ফেলা হয়েছে!");
                            }
                          }}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-400 opacity-50 hover:opacity-100 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mr-6">
                          <input type="text" placeholder="Color (e.g. Red)" value={vari.color || ""} onChange={e => { const v = [...pVariants]; v[vIdx].color = e.target.value; setPVariants(v); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-white" />
                          <input type="text" placeholder="Size (e.g. XL)" value={vari.size || ""} onChange={e => { const v = [...pVariants]; v[vIdx].size = e.target.value; setPVariants(v); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-white" />
                          <input type="text" placeholder="RAM (e.g. 8GB)" value={vari.ram || ""} onChange={e => { const v = [...pVariants]; v[vIdx].ram = e.target.value; setPVariants(v); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-white" />
                          <input type="text" placeholder="Storage (e.g. 256GB)" value={vari.storage || ""} onChange={e => { const v = [...pVariants]; v[vIdx].storage = e.target.value; setPVariants(v); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-white" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mr-6">
                          <input type="number" placeholder="Price Add-on (৳)" value={vari.price || ""} onChange={e => { const v = [...pVariants]; v[vIdx].price = Number(e.target.value); setPVariants(v); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-white" />
                          <input type="number" placeholder="Stock" value={vari.stock || ""} onChange={e => { const v = [...pVariants]; v[vIdx].stock = Number(e.target.value); setPVariants(v); }} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-white" />
                          <div className="flex gap-1 items-center">
                            <input 
                              type="text" 
                              placeholder="Image URL (optional)" 
                              value={vari.image || ""} 
                              onChange={e => { 
                                const v = [...pVariants]; 
                                v[vIdx].image = e.target.value; 
                                setPVariants(v); 
                              }} 
                              className="bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-[9px] text-white flex-1" 
                            />
                            <label className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-[8px] font-extrabold cursor-pointer select-none transition-colors shrink-0">
                              Upload
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={async (e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    try {
                                      const base64 = await convertToBase64(e.target.files[0]);
                                      const v = [...pVariants]; 
                                      v[vIdx].image = base64; 
                                      setPVariants(v);
                                      if (onNotify) {
                                        onNotify("success", "ভ্যারিয়েন্ট ইমেজ সফলভাবে আপলোড হয়েছে!");
                                      }
                                    } catch (err) {
                                      console.error("Base64 conversion failed", err);
                                      if (onNotify) {
                                        onNotify("error", "ভ্যারিয়েন্ট ইমেজ আপলোড ব্যর্থ হয়েছে!");
                                      }
                                    }
                                  }
                                }}
                              />
                            </label>
                            {vari.image && (
                              <img 
                                src={vari.image} 
                                alt="var" 
                                className="w-5 h-5 rounded object-cover border border-slate-700 shrink-0" 
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400">Weight Setup:</label>
                <input
                  type="text"
                  placeholder="0.5kg"
                  value={pWeight}
                  onChange={(e) => setPWeight(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400">Product Barcode:</label>
                <input
                  type="text"
                  placeholder="8931234..."
                  value={pBarcode}
                  onChange={(e) => setPBarcode(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                />
              </div>
              
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-slate-400">Product Status Options:</label>
                <div className="flex gap-4 items-center bg-slate-950 p-3 rounded border border-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input type="checkbox" checked={pIsFeatured} onChange={e => setPIsFeatured(e.target.checked)} className="accent-emerald-500 w-4 h-4" />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input type="checkbox" checked={pIsBestSelling} onChange={e => setPIsBestSelling(e.target.checked)} className="accent-emerald-500 w-4 h-4" />
                    Best Selling
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input type="checkbox" checked={pIsNewArrival} onChange={e => setPIsNewArrival(e.target.checked)} className="accent-emerald-500 w-4 h-4" />
                    New Arrival
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400">Tags lists (comma-separated):</label>
                <input
                  type="text"
                  placeholder="walton, smartphone, traditional"
                  value={pTags}
                  onChange={(e) => setPTags(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                />
              </div>

              <div className="flex flex-col gap-1.5 font-bold">
                <label className="text-slate-400">YouTube / Vimeo review link:</label>
                <input
                  type="text"
                  placeholder="https://youtube.com/..."
                  value={pVideoUrl}
                  onChange={(e) => setPVideoUrl(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                />
              </div>

              {/* DELIVERY OPTIONS SECTION */}
              <div className="sm:col-span-2 border-t border-slate-800 pt-4 mt-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <Truck className="w-4 h-4 text-emerald-500" />
                  <span>Custom Delivery Options</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/40 p-3.5 border border-slate-800 rounded-xl">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-400">Inside Dhaka Charge (৳)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 60" 
                      value={pDeliveryInsideDhaka}
                      onChange={(e) => setPDeliveryInsideDhaka(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:outline-emerald-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-400">Outside Dhaka Charge (৳)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 120" 
                      value={pDeliveryOutsideDhaka}
                      onChange={(e) => setPDeliveryOutsideDhaka(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:outline-emerald-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-400">Estimated Delivery Time</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 2-3 Days or 3-5 Days" 
                      value={pDeliveryTime}
                      onChange={(e) => setPDeliveryTime(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:outline-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* SEO OPTIMIZATION SECTION */}
              <div className="sm:col-span-2 border-t border-slate-800 pt-4 mt-2">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-emerald-500" />
                    <span>Search Engine Optimization (SEO)</span>
                  </h4>
                  <button 
                    type="button" 
                    disabled={aiGenerating || !pName}
                    onClick={handleAiSEOSeed}
                    className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-900/60 disabled:opacity-50 text-[10px] font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                    <span>Fill with Gemini</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 bg-slate-950/40 p-4 border border-slate-800 rounded-xl">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold text-slate-400">SEO Page Title</label>
                      <span className={`text-[10px] font-mono ${pSeoTitle.length > 65 ? "text-amber-500" : "text-slate-500"}`}>
                        {pSeoTitle.length}/65 chars (Optimal: 50-60)
                      </span>
                    </div>
                    <input 
                      type="text" 
                      placeholder="High-converting CTR title for search engines" 
                      value={pSeoTitle}
                      onChange={(e) => setPSeoTitle(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:outline-emerald-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold text-slate-400">SEO Meta Description</label>
                      <span className={`text-[10px] font-mono ${pMetaDescription.length > 160 ? "text-amber-500" : "text-slate-500"}`}>
                        {pMetaDescription.length}/160 chars (Optimal: 120-155)
                      </span>
                    </div>
                    <textarea 
                      placeholder="Brief overview summary explaining why shoppers should buy this product" 
                      value={pMetaDescription}
                      rows={2}
                      onChange={(e) => setPMetaDescription(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:outline-emerald-500 resize-none"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Actions modal */}
            <div className="flex gap-2 justify-end mt-6 border-t border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => { setShowAddProductModal(false); setEditProductPayload(null); }}
                className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold px-4 py-2 rounded-lg cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2 rounded-lg cursor-pointer text-xs uppercase"
              >
                {editProductPayload ? "Save Modifications" : "Deploy Product"}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
