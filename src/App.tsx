import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { 
  Product, 
  Order, 
  Customer, 
  Coupon, 
  Category, 
  Brand, 
  AppSettings, 
  BlogPost,
  MainCategory,
  HeroBanner,
  StoreEvent,
  PromoBanner
} from "./types";
import Storefront from "./components/Storefront";
import ProductDetail from "./components/ProductDetail";
import CartAndCheckout from "./components/CartAndCheckout";
import AdminPanel from "./components/AdminPanel";
import BlogCenter from "./components/BlogCenter";
import FacebookSkeleton from "./components/FacebookSkeleton";

export default function App() {
  // Navigation Routing States
  const [currentView, setCurrentView] = useState<"storefront" | "admin" | "blog">("storefront");

  // Core Database collections from Server
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>([]);
  const [storeEvents, setStoreEvents] = useState<StoreEvent[]>([]);
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'warning', message: string } | null>(null);

  // Interactive local states
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist and Session States
  const [currentSession, setCurrentSession] = useState<{ name: string; phone: string } | null>(() => {
    try {
      const val = localStorage.getItem("packly_user_session");
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const savedSession = localStorage.getItem("packly_user_session");
      const sessionObj = savedSession ? JSON.parse(savedSession) : null;
      const key = sessionObj ? `packly_wishlist_${sessionObj.phone}` : "packly_wishlist_guest";
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(true);

  // Sync wishlist updates whenever local state changes
  useEffect(() => {
    try {
      const key = currentSession ? `packly_wishlist_${currentSession.phone}` : "packly_wishlist_guest";
      localStorage.setItem(key, JSON.stringify(wishlist));
    } catch(e) {}
  }, [wishlist, currentSession]);

  const handleToggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleLoginSession = (sessionData: { name: string; phone: string }) => {
    setCurrentSession(sessionData);
    try {
      localStorage.setItem("packly_user_session", JSON.stringify(sessionData));
      
      // load wishlist of the newly logged in user session
      const key = `packly_wishlist_${sessionData.phone}`;
      const saved = localStorage.getItem(key);
      setWishlist(saved ? JSON.parse(saved) : []);
    } catch(e) {}
  };

  const handleLogoutSession = () => {
    setCurrentSession(null);
    try {
      localStorage.removeItem("packly_user_session");
      
      // fallback to guest wishlist
      const saved = localStorage.getItem("packly_wishlist_guest");
      setWishlist(saved ? JSON.parse(saved) : []);
    } catch(e) {}
  };

  // Synchronise databases on boot
  useEffect(() => {
    fetchEntireData();

    // Check location for hidden /control-cp path routing
    const handleRouteCheck = () => {
      const path = window.location.pathname;
      if (path === "/control-cp" || path.endsWith("/control-cp")) {
        setCurrentView("admin");
      } else if (path === "/blog" || path.endsWith("/blog")) {
        setCurrentView("blog");
      } else {
        setCurrentView("storefront");
      }
    };
    handleRouteCheck();
    window.addEventListener("popstate", handleRouteCheck);
    return () => {
      window.removeEventListener("popstate", handleRouteCheck);
    };
  }, []);

  // Update document title and theme dynamically when settings load
  useEffect(() => {
    if (settings) {
      document.title = settings.siteName || "KenakataBD";
      
      // Update Favicon
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = settings.siteFavicon || "/favicon.ico";

      // Update Theme Colors via CSS Variables
      document.documentElement.style.setProperty('--primary-color', settings.primaryColor || "#00c09d");
      document.documentElement.style.setProperty('--header-color', settings.headerColor || "#00c09d");
      document.documentElement.style.setProperty('--footer-color', settings.footerColor || "#1e293b");
    }
  }, [settings]);

  const [error, setError] = useState<string | null>(null);

  const fetchEntireData = async () => {
    try {
      const [
        resProd, 
        resCat, 
        resBrand, 
        resOrder, 
        resCust, 
        resCoupon, 
        resSettings, 
        resBlog,
        resMainCat,
        resHero,
        resEvents,
        resPromo
      ] = await Promise.all([
        fetch("/api/products").then(r => r.json()),
        fetch("/api/categories").then(r => r.json()),
        fetch("/api/brands").then(r => r.json()),
        fetch("/api/orders").then(r => r.json()),
        fetch("/api/customers").then(r => r.json()),
        fetch("/api/coupons").then(r => r.json()),
        fetch("/api/settings").then(r => r.json()),
        fetch("/api/blog").then(r => r.json()),
        fetch("/api/main-categories").then(r => r.json()),
        fetch("/api/hero-banners").then(r => r.json()),
        fetch("/api/store-events").then(r => r.json()),
        fetch("/api/promo-banners").then(r => r.json())
      ]);

      setProducts(Array.isArray(resProd) ? resProd : []);
      setCategories(Array.isArray(resCat) ? resCat : []);
      setBrands(Array.isArray(resBrand) ? resBrand : []);
      setOrders(Array.isArray(resOrder) ? resOrder : []);
      setCustomers(Array.isArray(resCust) ? resCust : []);
      setCoupons(Array.isArray(resCoupon) ? resCoupon : []);
      setSettings(resSettings);
      setBlogPosts(Array.isArray(resBlog) ? resBlog : []);
      setMainCategories(Array.isArray(resMainCat) ? resMainCat : []);
      setHeroBanners(Array.isArray(resHero) ? resHero : []);
      setStoreEvents(Array.isArray(resEvents) ? resEvents : []);
      setPromoBanners(Array.isArray(resPromo) ? resPromo : []);
    } catch (e) {
      console.error("Failed to synchronise DB streams from Express server API", e);
      setError("Failed to connect to the server. Please check your internet or try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const pStatus = urlParams.get("payment_status");
      if (pStatus === "success") {
        setNotification({ type: 'success', message: "Congratulations! Your digital payment was successful. Your order is confirmed." });
        urlParams.delete("payment_status");
        window.history.replaceState(null, "", "?" + urlParams.toString());
        setCartItems([]);
      } else if (pStatus === "failed") {
        setNotification({ type: 'error', message: "Payment failed or was declined. Please try again or switch to COD." });
        urlParams.delete("payment_status");
        window.history.replaceState(null, "", "?" + urlParams.toString());
      } else if (pStatus === "cancelled") {
        setNotification({ type: 'warning', message: "Payment was cancelled. You can retry from checkout." });
        urlParams.delete("payment_status");
        window.history.replaceState(null, "", "?" + urlParams.toString());
      }
    } catch (e) {
      console.error("Payment status processing error", e);
    }
  }, []);

  // Cart actions standard
  const handleAddToCart = (product: Product, quantity: number, options?: any) => {
    const variant = options?.variant;
    
    // Check stock validation
    if (variant && variant.id) {
      if (variant.stock !== undefined && variant.stock <= 0) {
        setNotification({ 
          type: 'error', 
          message: `দুঃখিত, এই ভ্যারিয়েন্টটি (স্টক শেষ) এখন পাওয়া যাচ্ছে না!` 
        });
        return;
      }
    } else if (product.stock !== undefined && product.stock <= 0) {
      setNotification({ 
        type: 'error', 
        message: `দুঃখিত, "${product.name}" পণ্যটির স্টক শেষ!` 
      });
      return;
    }

    setCartItems(prev => {
      // Find matching product and exact variant match
      const existsIdx = prev.findIndex(item => {
        if (item.product.id !== product.id) return false;
        if (options?.variant?.id) {
          return item.variant?.id === options.variant.id;
        }
        return true;
      });

      if (existsIdx > -1) {
        const copy = [...prev];
        copy[existsIdx].quantity += quantity;
        return copy;
      }
      return [...prev, { product, quantity, variant: options?.variant || {} }];
    });

    // Fire simulated Pixel and Analytics
    triggerAnalyticsPixel("AddToCart", { id: product.id, name: product.name, price: product.salePrice || product.price, quantity });
    
    // Success Notification in Bengali
    const variantLabel = variant && (variant.color || variant.size || variant.ram || variant.storage)
      ? ` (${[variant.color, variant.size, variant.ram, variant.storage].filter(Boolean).join(" / ")})`
      : "";
    
    setNotification({ 
      type: 'success', 
      message: `"${product.name}${variantLabel}" সফলভাবে কার্টে যুক্ত হয়েছে!` 
    });

    // Auto-open drawer for premium interaction
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (index: number, quantity: number) => {
    setCartItems(prev => 
      prev.map((item, i) => i === index ? { ...item, quantity } : item)
    );
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
    setNotification({
      type: 'warning',
      message: "কার্ট থেকে পণ্যটি সরিয়ে ফেলা হয়েছে!"
    });
  };

  const handleCheckoutDirectly = (product: Product, quantity: number, options?: any) => {
    const variant = options?.variant;
    
    // Check stock validation
    if (variant && variant.id) {
      if (variant.stock !== undefined && variant.stock <= 0) {
        setNotification({ 
          type: 'error', 
          message: `দুঃখিত, এই ভ্যারিয়েন্টটি (স্টক শেষ) এখন পাওয়া যাচ্ছে না!` 
        });
        return;
      }
    } else if (product.stock !== undefined && product.stock <= 0) {
      setNotification({ 
        type: 'error', 
        message: `দুঃখিত, "${product.name}" পণ্যটির স্টক শেষ!` 
      });
      return;
    }

    // Clear and add only this single product to cart, then proceed to direct buy checkout step triggers
    setCartItems([{ product, quantity, variant: options?.variant || {} }]);
    
    const variantLabel = variant && (variant.color || variant.size || variant.ram || variant.storage)
      ? ` (${[variant.color, variant.size, variant.ram, variant.storage].filter(Boolean).join(" / ")})`
      : "";

    setNotification({ 
      type: 'success', 
      message: `"${product.name}${variantLabel}" নিয়ে সরাসরি অর্ডারে এগিয়ে যাচ্ছেন!` 
    });

    setIsCartOpen(true);
    triggerAnalyticsPixel("InitiateCheckoutDirect", { id: product.id, name: product.name });
  };

  // Meta Pixel & Google Analytics mocks
  const triggerAnalyticsPixel = (eventName: string, data: any) => {
    console.log(`[FB-PIXEL-TRIGGER] Event: ${eventName}, pixelId: ${settings?.fbPixelId || "N/A"}. Payload:`, data);
    console.log(`[GOOGLE-ANALYTICS-ID] Event: ${eventName}, gaId: ${settings?.googleAnalyticsId || "N/A"}. Payload:`, data);
  };

  const handleClearCart = () => setCartItems([]);

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Top Slim Browser Loading Bar (Facebook/YouTube style) */}
        <div className="fixed top-0 left-0 right-0 h-[3px] bg-[#00c09d] animate-pulse z-50" />
        
        {/* Header skeleton */}
        <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shrink-0 sticky top-0 z-30 shadow-xs">
          <div className="w-24 h-6 bg-slate-200 animate-pulse rounded" />
          <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
        </header>

        {error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
             <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2">
                <X className="w-8 h-8" />
             </div>
             <h2 className="text-xl font-bold text-slate-800">Connection Error</h2>
             <p className="text-slate-500 max-w-xs">{error}</p>
             <button onClick={() => { setLoading(true); setError(null); fetchEntireData(); }} className="bg-[#00c09d] text-white px-6 py-2 rounded-lg font-bold">Retry</button>
          </div>
        ) : (
          /* Facebook Style Shimmer Skeleton layout */
          <FacebookSkeleton layout="main" />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-300">

      {/* Custom Global Toast */}
      {notification && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 text-white font-bold text-sm animate-fade-in border-b-4 ${
          notification.type === 'success' ? 'bg-emerald-600 border-emerald-800' : 
          notification.type === 'error' ? 'bg-rose-600 border-rose-800' : 'bg-amber-500 border-amber-700'
        }`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-2 hover:bg-black/10 rounded-full w-6 h-6 flex items-center justify-center transition-colors">✕</button>
        </div>
      )}
      
      {/* Dynamic Navigation Content Views router switcher */}
       {currentView === "admin" ? (
        <AdminPanel 
          products={products}
          orders={orders}
          customers={customers}
          coupons={coupons}
          categories={categories}
          brands={brands}
          mainCategories={mainCategories}
          heroBanners={heroBanners}
          storeEvents={storeEvents}
          promoBanners={promoBanners}
          settings={settings}
          onRefreshAllData={fetchEntireData}
          onNotify={(type, message) => setNotification({ type, message })}
          onClose={() => {
            try {
              window.history.pushState(null, "", "/");
            } catch (e) {
              console.warn("History pushState blocked", e);
            }
            setCurrentView("storefront");
          }}
        />
      ) : currentView === "blog" ? (
        <BlogCenter 
          posts={blogPosts}
          onSelectProduct={(p) => { setSelectedProduct(p); setCurrentView("storefront"); }}
          products={products}
          onClose={() => setCurrentView("storefront")}
        />
      ) : (
        <Storefront 
          products={products}
          categories={categories}
          brands={brands}
          mainCategories={mainCategories}
          heroBanners={heroBanners}
          storeEvents={storeEvents}
          promoBanners={promoBanners}
          onOpenCart={() => setIsCartOpen(true)}
          cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddToCart={(p) => handleAddToCart(p, 1)}
          onOpenBlog={() => setCurrentView("blog")}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          currentSession={currentSession}
          onLoginSession={handleLoginSession}
          onLogoutSession={handleLogoutSession}
          orders={orders}
          settings={settings}
          onNotify={(type, message) => setNotification({ type, message })}
          onRefreshAllData={fetchEntireData}
        />
      )}

      {/* product detail modal popup */}
      {selectedProduct && (
        <ProductDetail 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p, qty, opt) => { handleAddToCart(p, qty, opt); setSelectedProduct(null); }}
          onCheckoutDirectly={(p, qty, opt) => { handleCheckoutDirectly(p, qty, opt); setSelectedProduct(null); }}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          relatedProducts={products.filter(p => p.id !== selectedProduct.id && (p.categoryId === selectedProduct.categoryId || p.brandId === selectedProduct.brandId)).slice(0, 4)}
          settings={settings}
        />
      )}

      {/* Cart drawer modal */}
      <CartAndCheckout 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        settings={settings}
        coupons={coupons}
        currentSession={currentSession}
        onOrderPlaced={(order: Order) => {
          fetchEntireData(); // Updates stats ledger instantly
          if (order && order.phone) {
            const session = { name: order.customerName, phone: order.phone };
            localStorage.setItem("packly_user_session", JSON.stringify(session));
            setCurrentSession(session);
          }
        }}
      />

    </div>
  );
}
