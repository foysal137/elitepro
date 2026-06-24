import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  Heart,
  User,
  Grid,
  X,
  PlaySquare,
  Home,
  ChevronRight,
  AlignLeft,
  Star,
  Zap,
  Store,
  LayoutGrid,
  ShoppingBag,
  Car,
  BookOpen,
  Headphones,
  Smartphone,
  Anchor,
  Gamepad2,
  ArrowLeft,
  RotateCcw,
  Info,
  FileText,
  MapPin,
  Ticket,
  Settings,
  CreditCard,
  Clock,
  ShieldCheck,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
} from "lucide-react";
import {
  Product,
  Category,
  Brand,
  MainCategory,
  HeroBanner,
  StoreEvent,
  PromoBanner,
  Order,
  AppSettings,
} from "../types";
import AccountPanel from "./AccountPanel";
import FacebookSkeleton from "./FacebookSkeleton";

export interface StorefrontProps {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  mainCategories: MainCategory[];
  heroBanners: HeroBanner[];
  storeEvents: StoreEvent[];
  promoBanners: PromoBanner[];
  cartCount: number;
  onOpenCart: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, options?: any) => void;
  onOpenBlog: () => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  currentSession: { name: string; phone: string } | null;
  onLoginSession: (session: { name: string; phone: string }) => void;
  onLogoutSession: () => void;
  orders: Order[];
  settings: AppSettings;
  onNotify: (type: 'success' | 'error' | 'warning', message: string) => void;
  onRefreshAllData: () => void;
}


// Real-time Event Countdown Component (moved outside to prevent re-creation and fix loop)
const EventCountdown = React.memo(({ expiryTime, onExpire }: { expiryTime: string; onExpire: () => void }) => {
  const [remTime, setRemTime] = useState({ hours: 0, minutes: 0, seconds: 0, cs: 0, isExpired: false });
  const expiredCalledRef = React.useRef(false);

  useEffect(() => {
    const updateTime = () => {
      const diff = new Date(expiryTime).getTime() - Date.now();
      if (diff <= 0) {
        setRemTime({ hours: 0, minutes: 0, seconds: 0, cs: 0, isExpired: true });
        if (!expiredCalledRef.current) {
          expiredCalledRef.current = true;
          onExpire();
        }
        return false;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const cs = Math.floor((diff % 1000) / 10);
      setRemTime({ hours, minutes, seconds, cs, isExpired: false });
      return true;
    };

    const active = updateTime();
    if (!active) return;

    const interval = setInterval(() => {
      const stillActive = updateTime();
      if (!stillActive) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [expiryTime, onExpire]);

  if (remTime.isExpired) {
    return <span className="text-white text-xs font-bold bg-red-600 px-2 py-0.5 rounded shadow">ইভেন্ট শেষ হয়েছে</span>;
  }

  return (
    <div className="flex items-center gap-0.5 text-[#00c09d] font-mono font-bold text-[11px]">
      <span className="bg-white px-1 py-0.5 rounded-sm shadow-sm">
        {remTime.hours.toString().padStart(2, "0")}
      </span>
      <span className="text-white font-black">:</span>
      <span className="bg-white px-1 py-0.5 rounded-sm shadow-sm">
        {remTime.minutes.toString().padStart(2, "0")}
      </span>
      <span className="text-white font-black">:</span>
      <span className="bg-white px-1 py-0.5 rounded-sm shadow-sm">
        {remTime.seconds.toString().padStart(2, "0")}
      </span>
      <span className="text-white font-black">:</span>
      <span className="bg-white px-1 py-0.5 rounded-sm shadow-sm">
        {remTime.cs.toString().padStart(2, "0")}
      </span>
    </div>
  );
});

export default function Storefront({
  products,
  categories,
  brands,
  mainCategories,
  heroBanners,
  storeEvents,
  promoBanners,
  cartCount,
  onOpenCart,
  onSelectProduct,
  onAddToCart,
  onOpenBlog,
  wishlist,
  onToggleWishlist,
  currentSession,
  onLoginSession,
  onLogoutSession,
  orders,
  settings,
  onNotify,
  onRefreshAllData
}: StorefrontProps) {
  const [bottomTab, setBottomTab] = useState<
    "home" | "category" | "wishlist" | "profile"
  >("home");
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [pageLoadingLayout, setPageLoadingLayout] = useState<"main" | "categories" | "favorites" | "profile">("main");
  const [fakeProgress, setFakeProgress] = useState(0);

  const changeTabWithLoading = (tabId: "home" | "category" | "wishlist" | "profile", layoutType: "main" | "categories" | "favorites" | "profile") => {
    setShowSearchResults(false);
    setIsPageLoading(true);
    setPageLoadingLayout(layoutType);
    setFakeProgress(10);
    
    const interval = setInterval(() => {
      setFakeProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setFakeProgress(100);
      setBottomTab(tabId);
      setTimeout(() => {
        setIsPageLoading(false);
        setFakeProgress(0);
      }, 150);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 700);
  };

  const handleSelectMainCategory = (catId: string) => {
    setIsPageLoading(true);
    setPageLoadingLayout("categories");
    setFakeProgress(15);
    const interval = setInterval(() => {
      setFakeProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 100);
    setTimeout(() => {
      clearInterval(interval);
      setFakeProgress(100);
      setActiveMainCategoryId(catId);
      setActivePopularCategory(null);
      setBottomTab("home");
      setTimeout(() => {
        setIsPageLoading(false);
        setFakeProgress(0);
      }, 150);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 600);
  };
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [profileActiveTab, setProfileActiveTab] = useState<string>("menu");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authStep, setAuthStep] = useState<
    "phone" | "otp" | "complete_profile"
  >("phone");
  const [pendingPhone, setPendingPhone] = useState("");
  const [otpArray, setOtpArray] = useState<string[]>(Array(6).fill(""));
  const [otpTimer, setOtpTimer] = useState(120);

  useEffect(() => {
    let interval: any;
    if (authStep === "otp") {
      setOtpTimer(120);
      setOtpArray(Array(6).fill(""));
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [authStep]);

  const formatOtpTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}s`;
  };
  const [pendingName, setPendingName] = useState("");

  const handleSendOtp = () => {
    if (!pendingPhone || pendingPhone.length < 11) {
      onNotify('error', "Please enter a valid mobile number");
      return;
    }
    setAuthStep("otp");
  };

  const handleVerifyOtp = () => {
    setAuthStep("complete_profile");
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [showBanner, setShowBanner] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      alert("আপনার ব্রাউজারে এটি অলরেডি ইনস্টলড আছে অথবা সরাসরি ব্রাউজার মেনু থেকে 'Add to Home Screen' ক্লিক করে ইনস্টল করতে পারেন।");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA install prompt response outcome: ${outcome}`);
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const [activeFeedTab, setActiveFeedTab] = useState<string>("For You");
  const [activeCategoryTab, setActiveCategoryTab] = useState("Automotive");
  const [activeMainCategoryId, setActiveMainCategoryId] = useState<
    string | null
  >(null);
  const [activePopularCategory, setActivePopularCategory] = useState<
    string | null
  >(null);

  const heroImages = [
    "https://images.unsplash.com/photo-1555529733-0e67056058e1?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&q=80&w=400",
  ];
  const [heroIdx, setHeroIdx] = useState(0);

  const [timeLeft, setTimeLeft] = useState({
    hours: 10,
    minutes: 22,
    seconds: 16,
    cs: 8,
  });

  useEffect(() => {
    const slideCount =
      heroBanners.length > 0 ? heroBanners.length : heroImages.length;
    const t2 = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % slideCount);
    }, 4000);
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds, cs } = prev;
        cs--;
        if (cs < 0) {
          cs = 99;
          seconds--;
        }
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        return { hours, minutes, seconds, cs };
      });
    }, 10);
    return () => {
      clearInterval(t);
      clearInterval(t2);
    };
  }, []);

  const dts = (n: number) => n.toString().padStart(2, "0");

  // Dynamic Site Logo component
  const SiteLogoComp = ({ className = "w-6 h-6", style, iconOnly = false }: { className?: string, style?: React.CSSProperties, iconOnly?: boolean }) => {
    if (settings?.siteLogo && !iconOnly) {
      return <img src={settings.siteLogo} alt={settings.siteName} className={className} style={style} />;
    }
    return (
      <svg
        viewBox="0 0 200 200"
        className={className}
        style={style}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50 50 L100 20 L150 50 L150 150 L100 180 L50 150 Z"
          fill="currentColor"
        />
        <path d="M100 20 L100 100 L50 75 Z" fill="rgba(0,0,0,0.1)" />
        <path d="M100 100 L150 75 L150 150 L100 180 Z" fill="rgba(0,0,0,0.2)" />
      </svg>
    );
  };



  const renderSearchResultsView = () => {
    const query = searchTerm.trim().toLowerCase();
    const searchResultsProducts = products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(query);
      const matchDesc = p.description?.toLowerCase().includes(query) || p.shortDescription?.toLowerCase().includes(query) || false;
      const matchTags = p.tags?.some(t => t.toLowerCase().includes(query)) || false;
      return matchName || matchDesc || matchTags;
    });

    // In case no items found, recommend some discounted/new arrival products
    const recommendedProducts = products.filter(p => p.discountPercent > 0 || p.isNewArrival).slice(0, 4);

    return (
      <div className="flex-grow flex flex-col bg-[#f0f2f5] pb-[70px] animate-fade-in">
        {/* CUSTOM SEARCH HEADER */}
        <header className="bg-white text-slate-800 px-4 py-3 flex items-center gap-3 sticky top-0 z-40 border-b border-gray-100 shadow-sm shrink-0">
          <button
            onClick={() => {
              setShowSearchResults(false);
              setSearchTerm("");
            }}
            className="p-1 -ml-1 text-slate-600 hover:bg-slate-50 rounded-full transition-all cursor-pointer outline-none"
          >
            <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
          </button>
          
          {/* Active Search input inside results header */}
          <div className="flex-1 flex items-center border border-gray-300 rounded-full px-3 py-1.5 bg-slate-50">
            <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchTerm.trim()) {
                  setIsPageLoading(true);
                  setPageLoadingLayout("categories");
                  setTimeout(() => {
                    setIsPageLoading(false);
                  }, 400);
                }
              }}
              className="w-full text-xs bg-transparent focus:outline-none placeholder-gray-400 text-slate-800 font-medium"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="text-gray-400 hover:text-slate-600 cursor-pointer p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button className="relative p-1.5 hover:bg-slate-50 rounded-full cursor-pointer" onClick={onOpenCart}>
            <ShoppingCart className="w-5.5 h-5.5 text-slate-700" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                {cartCount}
              </span>
            )}
          </button>
        </header>

        {/* RESULTS SECTION */}
        <div className="flex-grow">
          <div className="bg-white px-4 py-3 border-b border-gray-100 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">অনুসন্ধান ফলাফল</span>
              <h2 className="text-sm font-bold text-slate-800 mt-0.5">
                "{searchTerm}" এর জন্য {searchResultsProducts.length}টি পণ্য পাওয়া গেছে
              </h2>
            </div>
          </div>

          {searchResultsProducts.length > 0 ? (
            <div className="p-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                {searchResultsProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-xl p-3 flex flex-col shadow-sm cursor-pointer border border-transparent hover:border-[#00c09d] transition-all relative group"
                    onClick={() => onSelectProduct(p)}
                  >
                    {/* Image wrapper */}
                    <div className="h-36 bg-slate-50 rounded-lg mb-2.5 flex items-center justify-center overflow-hidden border border-slate-100 relative">
                      <img
                        src={p.gallery?.[0]}
                        className="max-h-full max-w-full object-contain mix-blend-multiply p-2 transition-transform duration-300 group-hover:scale-105"
                        alt=""
                      />

                      {/* Heart toggle overlays */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(p.id);
                        }}
                        className="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-white active:scale-95 transition-all rounded-full shadow-sm flex items-center justify-center cursor-pointer z-10 border border-slate-100"
                        title={
                          wishlist.includes(p.id)
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >
                        <Heart
                          className={`w-4 h-4 ${wishlist.includes(p.id) ? "text-red-500 fill-current" : "text-gray-400"}`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 mb-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-[11px] font-semibold text-gray-600">
                        {p.rating}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        ({p.reviewsCount})
                      </span>
                      {p.isNewArrival && (
                        <span className="bg-pink-50 text-pink-500 text-[9px] font-black px-1.5 py-0.5 rounded ml-auto uppercase tracking-wide">
                          New
                        </span>
                      )}
                    </div>

                    <h4 className="text-[12px] font-bold text-slate-800 line-clamp-2 h-[34px] leading-tight mb-2 tracking-tight group-hover:text-[#00c09d] transition-colors">
                      {p.name}
                    </h4>

                    <div className="mt-auto pt-1.5 border-t border-slate-50 flex flex-col">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[#00c09d] font-bold text-sm">
                          ৳{p.salePrice || p.price}
                        </span>
                        {p.discountPercent > 0 && (
                          <span className="bg-red-50 text-red-500 text-[9px] font-bold px-1 rounded">
                            -{p.discountPercent}%
                          </span>
                        )}
                      </div>
                      {p.discountPercent > 0 && (
                        <span className="text-gray-400 text-[10px] line-through mt-0.5 block">
                          ৳{p.price}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="px-4 py-12 flex flex-col items-center justify-center text-center animate-fade-in bg-white min-h-[45vh] rounded-b-2xl border-b border-gray-100">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5 border border-slate-100 text-slate-300">
                <Search className="w-10 h-10" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">
                দুঃখিত, আপনার খোঁজা পণ্যটি পাওয়া যায়নি!
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[280px] mb-8">
                দয়া করে সঠিক বানান পরীক্ষা করুন অথবা অন্য কোনো কি-ওয়ার্ড দিয়ে চেষ্টা করুন।
              </p>

              {/* RECOMMENDED PRODUCTS SECTION */}
              <div className="w-full max-w-md pt-8 border-t border-slate-100 text-left">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 px-1">
                  আপনি হয়তো পছন্দ করতে পারেন (Recommended)
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {recommendedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white rounded-xl p-2.5 flex flex-col shadow-sm cursor-pointer border border-slate-100 relative"
                      onClick={() => onSelectProduct(p)}
                    >
                      <div className="h-28 bg-slate-50 rounded-lg mb-2 flex items-center justify-center overflow-hidden border border-slate-50 relative">
                        <img
                          src={p.gallery?.[0]}
                          className="max-h-full max-w-full object-contain mix-blend-multiply p-1.5"
                          alt=""
                        />
                      </div>
                      <h5 className="text-[11px] font-bold text-slate-800 line-clamp-1 leading-tight mb-1">
                        {p.name}
                      </h5>
                      <span className="text-[#00c09d] font-bold text-xs">
                        ৳{p.salePrice || p.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#f0f2f5] min-h-screen text-slate-800 flex flex-col font-sans pb-[70px] relative selection:bg-[#00c09d] selection:text-white mx-auto max-w-md w-full shadow-2xl overflow-hidden">
      {/* Dynamic Browser loading bar */}
      {isPageLoading && (
        <div 
          className="absolute top-0 left-0 h-[3.5px] bg-[#00c09d] transition-all duration-150 ease-out z-[9999]"
          style={{ width: `${fakeProgress}%` }}
        />
      )}
      {/* 1. APP INSTALL BANNER */}
      {showBanner && bottomTab === "home" && !activeMainCategoryId && !activePopularCategory && (
        <div className="bg-white px-3 py-2.5 flex items-center justify-between border-b border-gray-100 z-50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBanner(false)}
              className="text-gray-400 p-1 -ml-1"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 border border-gray-100 rounded-lg flex items-center justify-center bg-white shadow-sm overflow-hidden shrink-0">
              <div className="bg-slate-800 text-[#00c09d] w-6 h-6 rounded flex items-center justify-center">
                <SiteLogoComp className="w-4 h-4 text-[#00c09d]" iconOnly />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 tracking-tight leading-tight">
                Try the app & save more
              </span>
              <span className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5">
                Enjoy more features on our new app
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="flex text-amber-500 text-[10px] tracking-tighter">
                  ★★★★★
                </div>
                <span className="text-[9px] text-gray-500 font-medium">
                  (10k+)
                </span>
              </div>
            </div>
          </div>
          <button
            className="bg-[#187fff] hover:bg-blue-600 active:scale-95 transition-transform text-white text-[11px] font-bold px-4 py-1.5 rounded-full shrink-0 shadow-sm"
            onClick={handleInstallPWA}
          >
            Open
          </button>
        </div>
      )}

      {/* 2. HEADER */}
      {bottomTab === "home" && !showSearchResults && (
        activePopularCategory ? (
          <header className="bg-white text-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActivePopularCategory(null)}
                className="p-1 -ml-1 text-slate-600"
              >
                <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
              </button>
              <span className="font-semibold text-[17px] tracking-tight">
                Products
              </span>
            </div>
            <button className="relative p-1" onClick={onOpenCart}>
              <ShoppingCart
                className="w-6 h-6 text-slate-700"
                strokeWidth={1.5}
              />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                  {cartCount}
                </span>
              )}
            </button>
          </header>
        ) : activeMainCategoryId ? (
          <header className="bg-white text-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveMainCategoryId(null)}
                className="p-1 -ml-1 text-slate-600"
              >
                <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
              </button>
              <span className="font-semibold text-[17px] tracking-tight">
                {mainCategories.find((c) => c.id === activeMainCategoryId)?.name}
              </span>
            </div>
            <button className="relative p-1" onClick={onOpenCart}>
              <ShoppingCart
                className="w-6 h-6 text-slate-700"
                strokeWidth={1.5}
              />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                  {cartCount}
                </span>
              )}
            </button>
          </header>
        ) : (
          <div className="bg-[#00c09d] text-white w-full sticky top-0 z-40">
            <header className="px-4 pt-4 pb-3 flex items-center justify-between" style={{ backgroundColor: settings?.headerColor, color: settings?.headerTextColor }}>
              <div
                className="flex items-center gap-2 cursor-pointer pl-1"
                onClick={() => changeTabWithLoading("home", "main")}
              >
                <div className="relative w-8 h-8 flex items-center justify-center overflow-hidden rounded-lg">
                  {settings?.siteLogo ? (
                    <img src={settings.siteLogo} className="w-full h-full object-contain" alt={settings.siteName} />
                  ) : (
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full"
                      fill="currentColor"
                    >
                      <path d="M15,25 L50,5 L85,25 L85,75 L50,95 L15,75 Z" />
                      <path
                        d="M50,45 L85,25 M15,25 L50,45 L50,95"
                        stroke="white"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="font-black text-2xl tracking-wide font-sans" style={{ color: settings?.headerTextColor }}>
                  {settings?.siteName}
                </span>
              </div>
              <button className="relative p-1" onClick={onOpenCart}>
                <ShoppingCart className="w-6 h-6" strokeWidth={1.5} style={{ color: settings?.headerTextColor }} />
                {cartCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2"
                    style={{ backgroundColor: settings.primaryColor, borderColor: settings.headerColor }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </header>

            {/* INTEGRATED SEARCH BAR WITH ROUNDED WHITE BACKGROUND TOP AND CONTRAST */}
            <div style={{ backgroundColor: settings.headerColor }} className="px-0 pb-0 pt-0">
              <div className="bg-white rounded-t-[28px] px-4 pt-5 pb-4 text-slate-800 border-b border-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
                <div className="flex items-center border-[2px] rounded-full overflow-hidden p-1 bg-white" style={{ borderColor: settings.primaryColor }}>
                  <Search
                    className="w-5 h-5 text-gray-400 ml-2.5 shrink-0"
                    strokeWidth={2.5}
                  />
                  <input
                    type="text"
                    placeholder={`Search in ${settings.siteName}...`}
                    className="flex-grow py-1.5 px-2 text-[12.5px] text-slate-800 focus:outline-none placeholder-gray-400 font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchTerm.trim()) {
                        setIsPageLoading(true);
                        setPageLoadingLayout("categories");
                        setTimeout(() => {
                          setShowSearchResults(true);
                          setIsPageLoading(false);
                        }, 500);
                      }
                    }}
                  />
                  <button
                    className="hover:bg-opacity-90 active:scale-95 transition-all text-white text-xs font-bold px-5 py-2 rounded-full shrink-0 shadow-sm cursor-pointer"
                    style={{ backgroundColor: settings.primaryColor }}
                    onClick={() => {
                      if (searchTerm.trim()) {
                        setIsPageLoading(true);
                        setPageLoadingLayout("categories");
                        setTimeout(() => {
                          setShowSearchResults(true);
                          setIsPageLoading(false);
                        }, 500);
                      }
                    }}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {isPageLoading ? (
        <FacebookSkeleton layout={pageLoadingLayout} />
      ) : showSearchResults ? (
        renderSearchResultsView()
      ) : (
        <>
          {/* ======================= HOME TAB ======================= */}
          {bottomTab === "home" &&
        !activeMainCategoryId &&
        !activePopularCategory && (
          <div className="flex-grow flex flex-col bg-white rounded-b-3xl pb-2 relative z-20 pt-2">

            {/* HERO BANNER SECTION */}
            <div className="px-4">
              <div className="w-full bg-slate-100 rounded-xl overflow-hidden aspect-[21/9] relative border border-gray-100">
                {heroBanners.length > 0 && heroBanners[heroIdx] ? (
                  <img
                    src={heroBanners[heroIdx].image}
                    alt=""
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => {
                      const catId = heroBanners[heroIdx].targetCategoryId;
                      if (catId) {
                        handleSelectMainCategory(catId);
                      }
                    }}
                  />
                ) : (
                  <img
                    src={heroImages[heroIdx]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}

                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                  {(heroBanners.length > 0 ? heroBanners : heroImages).map(
                    (_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === heroIdx ? "w-5 bg-[#00c09d]" : "w-1.5 bg-white/70"}`}
                      ></div>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* RECTANGULAR CHIPS */}
            <div className="flex gap-2.5 px-4 mt-4 overflow-x-auto scrollbar-none pb-2">
              {mainCategories.map((chip, i) => (
                <div
                  key={chip.id}
                  className="border border-gray-150 rounded-lg px-3 py-2 flex items-center justify-between gap-3 min-w-[155px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] shrink-0 cursor-pointer"
                  onClick={() => handleSelectMainCategory(chip.id)}
                >
                  <span className="text-[12px] font-semibold text-slate-800 line-clamp-1">
                    {chip.name}
                  </span>
                  <div className="w-8 h-8 rounded shrink-0 bg-teal-50">
                    <img
                      src={chip.icon}
                      className="w-full h-full object-cover rounded"
                      alt=""
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* DYNAMIC STORE EVENTS SEC (e.g. Flash Sale, Campaigns) */}
            {storeEvents.map((ev, eventIdx) => {
              const evProducts = products
                .filter((p) => p.eventId === ev.id)
                .slice(0, 10);
              if (evProducts.length === 0) return null;

              return (
                <div key={ev.id} className="mt-4">
                  <div
                    className="bg-slate-900 px-4 py-3 flex items-center justify-between relative overflow-hidden"
                    style={
                      ev.banner
                        ? {
                            backgroundImage: `url(${ev.banner})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : {}
                    }
                  >
                    {/* Fallback gradient if no banner */}
                    {!ev.banner && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#ed4322] to-[#fd5e12]"></div>
                    )}
                    <div className="absolute inset-0 bg-black/30"></div>{" "}
                    {/* Overlay for text readability */}
                    <div className="flex items-center gap-1.5 z-10 relative">
                      {ev.icon ? (
                        <img
                          src={ev.icon}
                          className="w-5 h-5 rounded-sm"
                          alt=""
                        />
                      ) : (
                        <svg
                          className="w-4 h-4 text-yellow-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                      )}
                      <span className="text-white font-extrabold text-base tracking-tight italic">
                        {ev.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 z-10 relative">
                      <span className="text-white text-[11px] font-medium hidden sm:inline">
                        Closing in
                      </span>
                      {ev.expiryTime ? (
                        <EventCountdown 
                          expiryTime={ev.expiryTime} 
                          onExpire={() => onRefreshAllData()} 
                        />
                      ) : (
                        <div className="flex items-center gap-0.5 text-[#00c09d] font-mono font-bold text-[11px]">
                          <span className="bg-white px-1 py-0.5 rounded-sm shadow-sm">
                            {dts(timeLeft.hours)}
                          </span>
                          <span className="text-white font-black">:</span>
                          <span className="bg-white px-1 py-0.5 rounded-sm shadow-sm">
                            {dts(timeLeft.minutes)}
                          </span>
                          <span className="text-white font-black">:</span>
                          <span className="bg-white px-1 py-0.5 rounded-sm shadow-sm">
                            {dts(timeLeft.seconds)}
                          </span>
                          <span className="text-white font-black">:</span>
                          <span className="bg-white px-1 py-0.5 rounded-sm shadow-sm">
                            {dts(timeLeft.cs)}
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      className="border border-white/70 text-white text-[10px] items-center gap-1 flex font-medium px-3 py-1 rounded-full z-10 shrink-0 bg-black/20 hover:bg-black/40"
                      onClick={() => setActiveFeedTab(ev.title)}
                    >
                      See All
                    </button>
                  </div>

                  {/* Horizontally scrolled items for this event */}
                  <div className="px-4 pb-5 pt-2 flex gap-3 overflow-x-auto scrollbar-none snap-x relative">
                    {/* Extend background downward for consistency if needed, showing the real uploaded background */}
                    <div
                      className="absolute inset-0 top-0 h-full w-full z-0"
                      style={
                        ev.banner
                          ? {
                              backgroundImage: `url(${ev.banner})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }
                          : { backgroundColor: "#fd5e12" }
                      }
                    ></div>
                    <div className="absolute inset-0 bg-black/20 z-0"></div>

                    {evProducts.map((p, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-lg w-32 shrink-0 flex flex-col relative overflow-hidden snap-center z-10 shadow-sm"
                        onClick={() => onSelectProduct(p)}
                      >
                        <div className="h-28 p-2 flex items-center justify-center">
                          <img
                            src={p.gallery?.[0] || ""}
                            alt={p.name}
                            className="max-h-full object-contain mix-blend-multiply"
                          />
                        </div>
                        <div className="flex h-[26px]">
                          <div className="w-[60%] bg-[#e0fffa] flex items-center justify-center pl-1 shrink-0 relative">
                            <span className="text-[#00c09d] text-[11px] font-black tracking-tighter">
                              ৳{p.salePrice || p.price}
                            </span>
                            <div className="absolute right-[-10px] top-0 border-t-[26px] border-t-white border-l-[10px] border-l-transparent border-r-[10px] border-r-[#00c09d] z-10"></div>
                          </div>
                          <div className="flex-1 bg-[#00c09d] flex items-center justify-center -ml-2 pl-3 pb-0.5">
                            <span className="text-white text-[10px] font-black tracking-tighter shrink-0">
                              -{p.discountPercent || 0}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="w-full h-2 bg-[#f0f2f5] mt-1"></div>

            {/* POPULAR CATEGORIES (CIRCLE GRID) */}
            <div className="pt-4 px-4 pb-4 bg-white">
              <h3 className="text-[13px] font-semibold text-slate-900 mb-4 ml-1">
                Popular Categories
              </h3>
              <div className="grid grid-cols-4 gap-y-5 gap-x-2">
                {[
                  {
                    n: "Electronics Device",
                    i: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=100",
                  },
                  {
                    n: "Fishing & Farming...",
                    i: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=100",
                  },
                  {
                    n: "Gaming Products",
                    i: "https://images.unsplash.com/photo-1606144042873-77c41456b3b2?w=100",
                  },
                  {
                    n: "Gifts",
                    i: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=100",
                  },
                  {
                    n: "Organic Fertilizer",
                    i: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=100",
                  },
                  {
                    n: "Packaging & Boxes",
                    i: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=100",
                  },
                  {
                    n: "Sports & Out Doors",
                    i: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=100",
                  },
                  {
                    n: "TV & Home Appliances",
                    i: "https://images.unsplash.com/photo-1550005973-b4d2417726af?w=100",
                  },
                ].map((c, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1.5 cursor-pointer"
                    onClick={() => setActivePopularCategory(c.n)}
                  >
                    <div className="w-14 h-14 bg-slate-50 border border-transparent hover:border-[#00c09d] transition-colors rounded-full overflow-hidden flex items-center justify-center p-2.5 shrink-0 shadow-sm">
                      <img
                        src={c.i}
                        alt=""
                        className="w-full h-full object-cover mix-blend-multiply rounded-full opacity-95"
                      />
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-center text-slate-700 leading-tight font-medium break-words px-1 max-w-[70px]">
                      {c.n}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full h-2 bg-[#f0f2f5]"></div>

            {/* DYNAMIC PROMO BANNERS */}
            {promoBanners.length > 0 && (
              <div className="bg-white flex flex-col">
                {promoBanners.map((pb) => (
                  <div
                    key={pb.id}
                    className="px-4 py-4"
                    onClick={() => {
                      if (pb.targetCategoryId) {
                        handleSelectMainCategory(pb.targetCategoryId);
                      } else if (pb.targetUrl) {
                        window.open(pb.targetUrl, "_blank");
                      }
                    }}
                  >
                    <div className="w-full rounded-lg overflow-hidden relative flex items-center cursor-pointer shadow-sm">
                      <img
                        src={pb.image}
                        className="w-full object-cover"
                        alt="Promo Banner"
                      />
                    </div>
                  </div>
                ))}
                <div className="w-full h-2 bg-[#f0f2f5]"></div>
              </div>
            )}

            {/* SHOP REEL */}
            <div className="bg-white pt-4 pb-4">
              <div className="flex items-center gap-1.5 px-4 mb-3">
                <PlaySquare className="w-4 h-4 fill-[#db2777] text-white" />
                <h3 className="text-[13px] font-semibold text-slate-900">
                  Shop Reel
                </h3>
              </div>

              <div className="flex gap-3 px-4 overflow-x-auto scrollbar-none snap-x">
                {[
                  {
                    brand: "Quick pic",
                    brandImg:
                      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100",
                    img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300",
                  },
                  {
                    brand: "Deshi Dukan",
                    brandImg:
                      "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=100",
                    img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=300",
                  },
                ].map((r, i) => (
                  <div
                    key={i}
                    className="w-36 shrink-0 aspect-[3/4] relative rounded-xl overflow-hidden snap-center bg-gray-100 cursor-pointer shadow-sm"
                    onClick={onOpenBlog}
                  >
                    <img
                      src={r.img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
                    <div className="absolute top-2 left-2 w-9 h-9 border-2 border-[#00c09d] rounded-full bg-white flex items-center justify-center p-0.5 overflow-hidden shadow">
                      <img
                        src={r.brandImg}
                        className="w-full h-full object-cover rounded-full"
                        alt=""
                      />
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center justify-between right-3 text-white">
                      <span className="text-[11px] font-bold">{r.brand}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full h-2 bg-[#f0f2f5]"></div>

            {/* FEED TABS */}
            <div className="flex mt-2 bg-white px-2 sticky top-[60px] z-30 border-b border-gray-100 overflow-x-auto hide-scroll">
              {["For You", "Products", ...storeEvents.map((e) => e.title)].map(
                (tab, idx) => {
                  const ev = storeEvents.find((e) => e.title === tab);
                  return (
                    <button
                      key={tab + idx}
                      className={`flex-1 min-w-[max-content] px-4 py-3 text-[13px] font-bold justify-center border-b-2 relative flex items-center transition-all ${activeFeedTab === tab ? "border-[#00c09d] text-[#00c09d]" : "border-transparent text-gray-500"}`}
                      onClick={() => setActiveFeedTab(tab)}
                    >
                      {tab === "For You" && (
                        <Heart
                          className="mr-1.5 w-4 h-4 text-pink-500"
                          fill="currentColor"
                        />
                      )}
                      {tab === "Products" && (
                        <ShoppingBag className="mr-1.5 w-4 h-4 text-[#00c09d]" />
                      )}
                      {ev && ev.icon ? (
                        <img
                          src={ev.icon}
                          className="w-4 h-4 mr-1.5 rounded"
                          alt=""
                        />
                      ) : ev ? (
                        <Zap
                          className="mr-1.5 w-4 h-4 text-yellow-500"
                          fill="currentColor"
                        />
                      ) : null}
                      {tab === "Flash Sale" && !ev && (
                        <Zap
                          className="mr-1.5 w-4 h-4 text-yellow-500"
                          fill="currentColor"
                        />
                      )}
                      <span>{tab}</span>
                    </button>
                  );
                },
              )}
            </div>

            {/* PRODUCT FEED GRID */}
            <div className="bg-[#f0f2f5] p-2 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                {(() => {
                  const activeEv = storeEvents.find(
                    (e) => e.title === activeFeedTab,
                  );
                  const filteredProducts = activeEv
                    ? products.filter((p) => p.eventId === activeEv.id)
                    : products;
                  return filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white rounded-lg p-2.5 flex flex-col shadow-sm cursor-pointer border border-transparent hover:border-[#00c09d] transition-colors"
                      onClick={() => onSelectProduct(p)}
                    >
                      {/* Image wrapper */}
                      <div className="h-36 bg-gray-50 rounded mb-2 flex items-center justify-center overflow-hidden border border-gray-100 relative">
                        <img
                          src={p.gallery?.[0]}
                          className="max-h-full max-w-full object-contain mix-blend-multiply"
                          alt=""
                        />

                        {/* Heart toggle overlays */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(p.id);
                          }}
                          className="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-white active:scale-95 transition-all rounded-full shadow flex items-center justify-center cursor-pointer z-10"
                          title={
                            wishlist.includes(p.id)
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                        >
                          <Heart
                            className={`w-4 h-4 ${wishlist.includes(p.id) ? "text-red-500 fill-current" : "text-gray-400"}`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-[10px] text-gray-500">
                          {p.rating} ({p.reviewsCount})
                        </span>
                        {p.isNewArrival && (
                          <span className="text-pink-500 text-[10px] ml-auto">
                            ✦ New
                          </span>
                        )}
                      </div>

                      <h4 className="text-[11px] font-medium text-slate-800 line-clamp-2 h-[32px] leading-tight mb-2 tracking-tight">
                        {p.name}
                      </h4>

                      <div className="mt-auto">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[#00c09d] font-bold text-sm">
                            ৳{p.salePrice || p.price}
                          </span>
                          {p.discountPercent > 0 && (
                            <span className="bg-red-50 text-red-500 text-[9px] font-bold px-1 rounded">
                              -{p.discountPercent}%
                            </span>
                          )}
                        </div>
                        {p.discountPercent > 0 && (
                          <span className="text-gray-400 text-[10px] line-through mt-0.5 block">
                            ৳{p.price}
                          </span>
                        )}
                      </div>
                    </div>
                  ));
                })()}
              </div>

              <div className="py-5 flex justify-center">
                <button className="bg-[#00c09d] text-white text-[13px] font-bold px-5 py-2.5 rounded shadow-sm flex items-center gap-2 active:scale-95 transition-transform">
                  Load More
                  <div className="w-5 h-5 rounded-full border border-white flex items-center justify-center shrink-0">
                    <svg
                      className="w-3 h-3 -rotate-90"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      ></path>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

      {/* ======================= ACTIVE MAIN CATEGORY VIEW ======================= */}
      {activeMainCategoryId &&
        (() => {
          const cat = mainCategories.find((c) => c.id === activeMainCategoryId);
          if (!cat) return null;

          // Simulating the 63 items found mapping
          return (
            <div className="flex-grow flex flex-col bg-[#f0f2f5] pb-2">
              <div className="bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                <div className="rounded border border-gray-100 overflow-hidden w-full max-h-36 mb-3">
                  <img
                    src={cat.banner}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col border-r border-gray-100 pr-3 min-w-[70px]">
                    <span className="text-sm font-semibold text-gray-700">
                      {((cat.name.length * 15 + products.length) % 150) + 20}{" "}
                      items
                    </span>
                    <span className="text-xs text-gray-400">found</span>
                  </div>

                  <div className="flex-1 flex items-center border border-gray-300 rounded px-3 py-2 bg-white">
                    <Search
                      className="w-4 h-4 text-gray-400 mr-2 shrink-0"
                      strokeWidth={2}
                    />
                    <input
                      type="text"
                      placeholder="Search product name..."
                      className="w-full text-[13px] focus:outline-none placeholder-gray-400 text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white mt-1 px-4 py-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-teal-50 overflow-hidden shrink-0">
                  <img
                    src={cat.icon}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
                <h3 className="font-semibold text-slate-800 text-sm tracking-tight">
                  {cat.name}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-1 px-2 pb-6">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded p-2 flex flex-col cursor-pointer border border-transparent shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                    onClick={() => onSelectProduct(p)}
                  >
                    <div className="h-36 bg-gray-50 rounded mb-2 flex items-center justify-center overflow-hidden border border-gray-100 relative">
                      <img
                        src={p.gallery?.[0]}
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                        alt=""
                      />

                      {/* Heart toggle overlays */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(p.id);
                        }}
                        className="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-white active:scale-95 transition-all rounded-full shadow flex items-center justify-center cursor-pointer z-10"
                        title={
                          wishlist.includes(p.id)
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >
                        <Heart
                          className={`w-4 h-4 ${wishlist.includes(p.id) ? "text-red-500 fill-current" : "text-gray-400"}`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] text-gray-500">
                        {p.rating} ({p.reviewsCount})
                      </span>
                      {p.isNewArrival && (
                        <span className="text-pink-500 text-[10px] ml-auto">
                          ✦ New
                        </span>
                      )}
                    </div>

                    <h4 className="text-[11px] font-medium text-slate-800 line-clamp-2 h-[32px] leading-tight mb-2 tracking-tight">
                      {p.name}
                    </h4>

                    <div className="mt-auto">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[#00c09d] font-bold text-sm">
                          ৳{p.salePrice || p.price}
                        </span>
                        {p.discountPercent > 0 && (
                          <span className="bg-amber-400 text-white text-[9px] font-bold px-1 rounded-full">
                            -{p.discountPercent}%
                          </span>
                        )}
                      </div>
                      {p.discountPercent > 0 && (
                        <span className="text-gray-400 text-[10px] line-through mt-0.5 block">
                          ৳{p.price}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

      {/* ======================= ACTIVE POPULAR CATEGORY VIEW ======================= */}
      {activePopularCategory && (
        <div className="flex-grow flex flex-col bg-[#f0f2f5] pb-2">
          <div className="bg-white px-4 py-3 pb-4 mb-1">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <h2 className="text-lg font-bold text-slate-900 leading-tight">
                  {activePopularCategory}
                </h2>
                <span className="text-[13px] text-gray-500">
                  {((activePopularCategory.length * 15 + products.length) %
                    150) +
                    20}{" "}
                  items found
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 border border-gray-300 rounded px-2.5 py-1 text-[12px] font-medium text-slate-700 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                  <AlignLeft className="w-3.5 h-3.5 text-gray-500" />
                  Filter
                </button>
                <button
                  className="flex items-center gap-1.5 border border-gray-300 rounded px-2.5 py-1 text-[12px] font-medium text-slate-700 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                  onClick={() => {
                    setActivePopularCategory(null);
                    changeTabWithLoading("category", "categories");
                  }}
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-gray-500" />
                  Categories
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 px-2 pb-6 pt-1">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded p-2 flex flex-col cursor-pointer border border-transparent shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                onClick={() => onSelectProduct(p)}
              >
                <div className="h-36 bg-gray-50 rounded mb-2 flex items-center justify-center overflow-hidden border border-gray-100 relative">
                  <img
                    src={p.gallery?.[0]}
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                    alt=""
                  />

                  {/* Heart toggle overlays */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(p.id);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-white active:scale-95 transition-all rounded-full shadow flex items-center justify-center cursor-pointer z-10"
                    title={
                      wishlist.includes(p.id)
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  >
                    <Heart
                      className={`w-4 h-4 ${wishlist.includes(p.id) ? "text-red-500 fill-current" : "text-gray-400"}`}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-[10px] text-gray-500">
                    {p.rating} ({p.reviewsCount})
                  </span>
                  {p.isNewArrival && (
                    <span className="text-pink-500 text-[10px] ml-auto">
                      ✦ New
                    </span>
                  )}
                </div>

                <h4 className="text-[11px] font-medium text-slate-800 line-clamp-2 h-[32px] leading-tight mb-2 tracking-tight">
                  {p.name}
                </h4>

                <div className="mt-auto">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[#00c09d] font-bold text-sm">
                      ৳{p.salePrice || p.price}
                    </span>
                    {p.discountPercent > 0 && (
                      <span className="bg-amber-400 text-white text-[9px] font-bold px-1 rounded-full">
                        -{p.discountPercent}%
                      </span>
                    )}
                  </div>
                  {p.discountPercent > 0 && (
                    <span className="text-gray-400 text-[10px] line-through mt-0.5 block">
                      ৳{p.price}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic Footer */}
          <footer className="mt-8 border-t border-slate-100" style={{ backgroundColor: settings.footerColor, color: settings.footerTextColor }}>
            <div className="px-6 py-10 flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                 <div className="flex items-center gap-2">
                    {settings.siteLogo ? (
                      <img src={settings.siteLogo} className="h-8 object-contain" alt="" />
                    ) : (
                      <SiteLogoComp className="w-6 h-6" style={{ color: settings.primaryColor }} iconOnly />
                    )}
                    <span className="font-black text-xl tracking-tight">{settings.siteName}</span>
                 </div>
                 <p className="text-[11px] leading-relaxed opacity-70">
                    {settings.footerText}
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <h5 className="font-bold text-[13px]">Contact Info</h5>
                  <div className="flex flex-col gap-2 text-[11px] opacity-80">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{settings.contactPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{settings.contactEmail}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{settings.contactAddress}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <h5 className="font-bold text-[13px]">Follow Us</h5>
                  <div className="flex gap-4">
                    <a href={settings.facebookUrl} className="opacity-80 hover:opacity-100" target="_blank" rel="noreferrer"><Facebook className="w-5 h-5" /></a>
                    <a href={settings.instagramUrl} className="opacity-80 hover:opacity-100" target="_blank" rel="noreferrer"><Instagram className="w-5 h-5" /></a>
                    <a href={settings.youtubeUrl} className="opacity-80 hover:opacity-100" target="_blank" rel="noreferrer"><Youtube className="w-5 h-5" /></a>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200/50 text-center">
                <p className="text-[10px] opacity-60 font-medium">
                  {settings.copyrightText}
                </p>
              </div>
            </div>
            <div className="h-[70px]" /> {/* Spacer for bottom tab bar */}
          </footer>
        </div>
      )}

      {/* ======================= CATEGORY TAB ======================= */}
      {bottomTab === "category" && (
        <div className="flex-grow flex flex-col bg-white">
          <div className="flex items-center px-4 py-3 border-b border-gray-100 bg-[#f8f9fa]">
            <span className="text-sm font-semibold">Categories</span>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Column Sidebar */}
            <div className="w-[110px] bg-[#fdfdfd] border-r border-gray-100 overflow-y-auto scrollbar-none flex flex-col">
              {[
                {
                  n: "Automotive",
                  icon: <Car className="w-6 h-6 text-gray-500" />,
                },
                {
                  n: "Books",
                  icon: <BookOpen className="w-6 h-6 text-gray-500" />,
                },
                {
                  n: "Electronic Accessories",
                  icon: <Headphones className="w-6 h-6 text-gray-500" />,
                },
                {
                  n: "Electronics Device",
                  icon: <Smartphone className="w-6 h-6 text-gray-500" />,
                },
                {
                  n: "Fishing & Farming Accessories",
                  icon: <Anchor className="w-6 h-6 text-gray-500" />,
                },
                {
                  n: "Gaming Products",
                  icon: <Gamepad2 className="w-6 h-6 text-gray-500" />,
                },
              ].map((c) => (
                <div
                  key={c.n}
                  className={`flex flex-col items-center justify-center py-5 px-1.5 text-center cursor-pointer min-h-[90px] border-l-4 transition-colors ${activeCategoryTab === c.n ? "border-[#00c09d] bg-[#f0fcf9]" : "border-transparent"}`}
                  onClick={() => setActiveCategoryTab(c.n)}
                >
                  <div className="text-2xl mb-1.5 bg-slate-50 w-10 h-10 rounded shadow-sm flex items-center justify-center grayscale-[0.2]">
                    {c.icon}
                  </div>
                  <span className="text-[10px] font-medium text-slate-700 leading-[1.1]">
                    {c.n}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Column Accordions */}
            <div className="flex-1 bg-white p-3 overflow-y-auto pb-4">
              <h3 className="text-[13px] font-semibold text-slate-800 mb-3 ml-1">
                {activeCategoryTab}
              </h3>

              <div className="flex flex-col gap-2">
                {[
                  "Exterior Accessories",
                  "Moto Parts & Spares",
                  "Motorcycle Riding...",
                  "Oil & Fluids",
                  "Vehicle Care",
                  "Vehicle Fluids &...",
                ].map((sub) => (
                  <div
                    key={sub}
                    className="bg-white border border-gray-150 rounded-lg p-3 flex justify-between items-center shadow-sm cursor-pointer hover:border-[#00c09d] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="text-gray-400 bg-gray-50 p-1 rounded-sm">
                        <AlignLeft className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700">
                        {sub}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= OTHER TABS ======================= */}
      {bottomTab === "wishlist" && (
        <AccountPanel
          currentSession={currentSession}
          orders={orders}
          onLogout={() => {
            onLogoutSession();
            changeTabWithLoading("home", "main");
          }}
          wishlist={wishlist}
          products={products}
          onOpenCart={onOpenCart}
          onClose={() => changeTabWithLoading("home", "main")}
          onToggleWishlist={onToggleWishlist}
          onSelectProduct={onSelectProduct}
          onAddToCart={onAddToCart}
          initialTab="favorites"
        />
      )}

      {bottomTab === "profile" &&
        (() => {
          if (!currentSession) {
            return (
              <div className="flex-grow bg-[#f0f2f5] p-4 flex flex-col justify-center min-h-[calc(100vh-140px)] w-full">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
                  <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mb-4 text-[#00c09d]">
                    <User className="w-7 h-7" />
                  </div>

                  <h3 className="text-sm font-bold text-slate-800 text-center uppercase tracking-normal">
                    Log In Required
                  </h3>
                  <p className="text-[12px] text-gray-500 text-center mt-1 mb-6 leading-relaxed max-w-[280px]">
                    Log in to view your profile, manage addresses, and check
                    order history.
                  </p>

                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setAuthStep("phone");
                    }}
                    className="w-full bg-[#00c09d] hover:bg-[#00b08f] text-white text-sm font-bold py-3.5 rounded-lg shadow-sm transition-all focus:outline-none"
                  >
                    Login / Sign Up
                  </button>
                </div>
              </div>
            );
          }

          return (
            <AccountPanel
              currentSession={currentSession}
              orders={orders}
              onLogout={() => {
                onLogoutSession();
                changeTabWithLoading("home", "main");
              }}
              wishlist={wishlist}
              products={products}
              onOpenCart={onOpenCart}
              onClose={() => changeTabWithLoading("home", "main")}
              onToggleWishlist={onToggleWishlist}
              onSelectProduct={onSelectProduct}
              initialTab={profileActiveTab}
              onTabChange={(tabId) => setProfileActiveTab(tabId)}
            />
          );
        })()}
        </>
      )}

      <div className="fixed bottom-0 left-0 right-0 lg:max-w-md lg:mx-auto bg-white border-t border-gray-150 flex justify-around items-center h-[60px] pb-safe-area shadow-[0_-2px_10px_rgba(0,0,0,0.03)] z-[100]">
        {[
          { id: "home", label: "Home", icon: Home },
          { id: "category", label: "Category", icon: LayoutGrid },
          { id: "wishlist", label: "Wishlist", icon: Heart },
          { id: "profile", label: "My Profile", icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = bottomTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`flex flex-col items-center justify-center gap-1 py-1.5 px-4 transition-colors ${active ? "text-[#00c09d]" : "text-gray-400"}`}
              onClick={() => {
                if (tab.id === "profile") {
                  setIsProfileDrawerOpen(true);
                } else {
                  const targetLayout = tab.id === "home" ? "main" : tab.id === "category" ? "categories" : tab.id === "wishlist" ? "favorites" : "profile";
                  changeTabWithLoading(tab.id as any, targetLayout);
                }
              }}
            >
              <Icon
                className={`w-5 h-5 ${active ? "stroke-[2.5]" : "stroke-[1.5]"}`}
                style={{ color: active ? settings.primaryColor : undefined }}
              />
              <span
                className={`text-[10px] ${active ? "font-bold" : "font-medium text-slate-500"}`}
                style={{ color: active ? settings.primaryColor : undefined }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ======================= PROFILE MENU DRAWER ======================= */}
      {isProfileDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[110] backdrop-blur-[1px] animate-fade-in"
            onClick={() => setIsProfileDrawerOpen(false)}
          ></div>
          <div className="fixed top-0 bottom-0 right-[calc(max(0px,100vw-448px)/2)] w-[82%] sm:w-[340px] max-w-[345px] bg-white z-[120] shadow-2xl flex flex-col pt-0 animate-slide-left overflow-hidden">
            <AccountPanel
              currentSession={currentSession}
              orders={orders}
              onLogout={() => {
                onLogoutSession();
                setIsProfileDrawerOpen(false);
              }}
              wishlist={wishlist}
              products={products}
              onOpenCart={onOpenCart}
              onClose={() => setIsProfileDrawerOpen(false)}
              onToggleWishlist={onToggleWishlist}
              onSelectProduct={(p) => {
                setIsProfileDrawerOpen(false);
                onSelectProduct(p);
              }}
              onAddToCart={onAddToCart}
              initialTab="menu"
              onLoginTrigger={() => {
                setIsProfileDrawerOpen(false);
                setShowAuthModal(true);
                setAuthStep("phone");
                setPendingPhone("");
                setOtpArray(Array(6).fill(""));
              }}
              onTabChange={(tabId) => {
                setIsProfileDrawerOpen(false);
                setProfileActiveTab(tabId);
                changeTabWithLoading("profile", "profile");
              }}
            />
          </div>
        </>
      )}

      {/* ======================= AUTH MODAL ======================= */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[130] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAuthModal(false)}
          ></div>
          <div className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl p-6 relative z-10 animate-fade-in flex flex-col items-center">
            <button
              className="absolute top-4 right-4 p-1 text-slate-500 hover:bg-slate-100 rounded-full"
              onClick={() => setShowAuthModal(false)}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 mb-4">
              <SiteLogoComp className="w-full h-full object-contain" />
            </div>

            {authStep === "phone" ? (
              <>
                <h2 className="text-[22px] font-bold tracking-tight text-slate-800 text-center mb-1">
                  Continue with Phone Number
                </h2>
                <p className="text-slate-500 text-center text-[15px] mb-8 max-w-[260px]">
                  Enjoy exciting deals and offers & checkout faster
                </p>

                <div className="w-full mb-5">
                  <label className="block text-slate-700 font-medium text-[15px] mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                      +88
                    </span>
                    <input
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={pendingPhone}
                      onChange={(e) => setPendingPhone(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3.5 outline-none focus:border-[#00c09d] transition-colors text-[15px]"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSendOtp}
                  className="w-full bg-[#00c09d] hover:bg-[#00b08f] text-white font-medium py-3.5 rounded-lg shadow-sm transition-colors text-[16px]"
                >
                  Send OTP
                </button>
              </>
            ) : authStep === "otp" ? (
              <>
                <div className="flex flex-col items-center">
                  <div className="w-[60px] h-[60px] mb-4">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full text-[#142e43]"
                      fill="currentColor"
                    >
                      <path d="M20,20 L50,0 L80,20 L80,80 L50,100 L20,80 Z" />
                      <path
                        d="M50,45 L80,25 M20,25 L50,45 L50,100"
                        stroke="#00c09d"
                        strokeWidth="6"
                      />
                      <path
                        d="M40,30 L60,30 C65,30 65,40 60,40 L40,40 Z"
                        fill="#00c09d"
                      />
                    </svg>
                  </div>
                  <h2 className="text-[26px] font-bold tracking-tight text-slate-800 text-center mb-2">
                    OTP Verification
                  </h2>
                  <p className="text-slate-600 text-center text-[15px] mb-8">
                    Please enter it below to continue shopping
                  </p>

                  <p className="text-slate-800 text-[15px] mb-1 font-medium self-start w-full">
                    An OTP has been sent to{" "}
                    <span className="font-bold">{pendingPhone}</span>..
                  </p>
                  <button
                    className="text-[#00c09d] text-[15px] mb-6 font-medium hover:underline self-start bg-transparent border-none cursor-pointer p-0"
                    onClick={() => setAuthStep("phone")}
                  >
                    Change number
                  </button>

                  <div className="w-full flex justify-between gap-1 sm:gap-2 mb-8">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <input
                        key={index}
                        id={`otp-input-${index}`}
                        type="text"
                        maxLength={1}
                        className="w-[42px] sm:w-[48px] h-[52px] border border-gray-300 rounded-lg text-center text-2xl font-medium focus:border-[#00c09d] outline-none shadow-sm"
                        value={otpArray[index] || ""}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          if (val) {
                            const newOtpArray = [...otpArray];
                            newOtpArray[index] = val[val.length - 1];
                            setOtpArray(newOtpArray);
                            if (index < 5) {
                              setTimeout(() => {
                                document
                                  .getElementById(`otp-input-${index + 1}`)
                                  ?.focus();
                              }, 10);
                            }
                          }
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Backspace" &&
                            !otpArray[index] &&
                            index > 0
                          ) {
                            const newOtpArray = [...otpArray];
                            newOtpArray[index - 1] = "";
                            setOtpArray(newOtpArray);
                            setTimeout(() => {
                              document
                                .getElementById(`otp-input-${index - 1}`)
                                ?.focus();
                            }, 10);
                          } else if (e.key === "Backspace") {
                            const newOtpArray = [...otpArray];
                            newOtpArray[index] = "";
                            setOtpArray(newOtpArray);
                          }
                        }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleVerifyOtp}
                    className="w-full bg-[#00c09d] hover:bg-[#00b08f] text-white font-medium py-3.5 rounded-lg shadow-sm transition-colors text-[16px] mb-5 mt-2"
                  >
                    Verify
                  </button>
                  <p className="text-slate-500 text-[15px] text-center w-full">
                    Code expires in {formatOtpTime(otpTimer)}
                  </p>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-[22px] font-bold tracking-tight text-slate-800 text-center mb-1">
                  Complete Profile
                </h2>
                <p className="text-slate-500 text-center text-[15px] mb-8 max-w-[260px]">
                  Add your details to secure your account
                </p>

                <div className="w-full mb-6">
                  <label className="block text-slate-700 font-medium text-[15px] mb-2">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={pendingName}
                    onChange={(e) => setPendingName(e.target.value)}
                    placeholder="e.g. Abul Kashem"
                    className="w-full border border-gray-300 focus:border-[#00c09d] rounded-lg px-4 py-3.5 text-[15px] outline-none transition-colors"
                  />
                </div>

                <button
                  onClick={() => {
                    if (!pendingName) {
                      onNotify('error', "Please enter your name");
                      return;
                    }
                    onLoginSession({ name: pendingName, phone: pendingPhone });
                    setShowAuthModal(false);
                    setIsProfileDrawerOpen(false);
                    setBottomTab("profile");
                  }}
                  className="w-full bg-[#82dfca] hover:bg-[#00c09d] text-white font-semibold py-3.5 rounded-lg shadow transition-colors text-[15px]"
                >
                  Save & Login
                </button>

                <div className="w-full mt-8">
                  <div className="relative flex items-center mb-6">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-500 text-xs text-center font-medium">
                      Or continue with
                    </span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  <div className="flex flex-col gap-3 w-full">
                    <button
                      className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-3 hover:bg-slate-50 transition-colors shadow-sm"
                      onClick={() => {
                        onLoginSession({
                          name: pendingName || "Google User",
                          phone: pendingPhone,
                        });
                        setShowAuthModal(false);
                        setIsProfileDrawerOpen(false);
                        setBottomTab("profile");
                      }}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 48 48">
                        <path
                          fill="#FFC107"
                          d="M43.6 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8 2.9l6.3-6.3C34.6 3.2 29.6 1 24 1 11.3 1 1 11.3 1 24s10.3 23 23 23c12.1 0 22.4-9 23.8-20.7z"
                        />
                        <path
                          fill="#FF3D00"
                          d="M6.3 14.6l6.6 4.8c1.7-4.4 6-7.4 11.1-7.4 3.1 0 5.9 1.1 8 2.9l6.3-6.3C34.6 3.2 29.6 1 24 1 15 1 7.2 6.1 3 13.9l3.3 0.7z"
                        />
                        <path
                          fill="#4CAF50"
                          d="M24 44c5.2 0 9.8-1.7 13.2-4.6l-6.7-5.3C28.8 35.8 26.6 37 24 37c-5.8 0-10.7-3.8-12.4-9l-6.6 5C9 40.5 15.9 44 24 44z"
                        />
                        <path
                          fill="#1976D2"
                          d="M43.6 20H43v-2H24v8.5h11.8C34.7 33.9 30.1 37 24 37v2c5.8 0 10.7-3.8 12.4-9h6.7c0.4-1.9 0.6-3.8 0.6-5.8 0-1.4-0.1-2.8-0.1-4.2z"
                        />
                      </svg>
                      <span className="text-[15px] font-semibold text-slate-700">
                        Google
                      </span>
                    </button>
                    <button
                      className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-3 hover:bg-slate-50 transition-colors shadow-sm"
                      onClick={() => {
                        onLoginSession({
                          name: pendingName || "Facebook User",
                          phone: pendingPhone,
                        });
                        setShowAuthModal(false);
                        setIsProfileDrawerOpen(false);
                        setBottomTab("profile");
                      }}
                    >
                      <svg
                        className="w-5 h-5 text-[#1877F2]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span className="text-[15px] font-semibold text-slate-700">
                        Facebook
                      </span>
                    </button>
                    <button
                      className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-3 hover:bg-slate-50 transition-colors shadow-sm"
                      onClick={() => {
                        onLoginSession({
                          name: pendingName || "Email User",
                          phone: pendingPhone,
                        });
                        setShowAuthModal(false);
                        setIsProfileDrawerOpen(false);
                        setBottomTab("profile");
                      }}
                    >
                      <svg
                        className="w-5 h-5 text-gray-500 relative"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-[15px] font-semibold text-slate-700">
                        Email
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
