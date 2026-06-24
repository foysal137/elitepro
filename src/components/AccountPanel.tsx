import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, User, Package, MapPin, Search, Plus, EyeOff, LayoutGrid, RotateCcw, Clock, FileText, Heart, Star, ShieldCheck, Lock, LogOut, LogIn, Info, X, Edit3 } from 'lucide-react';
import { Product, Order } from '../types';

export default function AccountPanel({
  currentSession,
  orders,
  onLogout,
  wishlist,
  products,
  onOpenCart,
  onClose,
  onToggleWishlist,
  onSelectProduct,
  onAddToCart,
  initialTab,
  onLoginTrigger,
  onTabChange
}: {
  currentSession: any;
  orders: Order[];
  onLogout: () => void;
  wishlist: string[];
  products: Product[];
  onOpenCart: () => void;
  onClose?: () => void;
  onToggleWishlist?: (productId: string) => void;
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, qty: number) => void;
  initialTab?: string;
  onLoginTrigger?: () => void;
  onTabChange?: (tabId: string) => void;
}) {
  const [activeTab, setActiveTab] = useState(initialTab || "menu");
  const [ordersTab, setOrdersTab] = useState("all");
  const [reviewsTab, setReviewsTab] = useState("to_review");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [trackId, setTrackId] = useState("");
  const [trackedOrder, setTrackedOrder] = useState<any>(null);
  const [trackError, setTrackError] = useState("");

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const goBack = () => {
    if (activeTab !== "menu") {
      if (onClose) {
        onClose();
      } else if (onTabChange) {
        onTabChange("menu");
      } else {
        setActiveTab("menu");
      }
    }
  };

  const Header = ({ title }: { title: string }) => (
    <div className="flex items-center justify-between px-4 py-3.5 bg-white border-b border-gray-100 shrink-0 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-3">
        {activeTab !== "menu" && (
          <ArrowLeft className="w-6 h-6 text-slate-700 cursor-pointer" onClick={goBack} strokeWidth={1.5} />
        )}
        <h2 className="text-[17px] font-medium text-slate-800 tracking-tight">{title}</h2>
      </div>
      <div className="flex items-center gap-2">
        {(title !== "Change Password" && title !== "Two-Factor...") && onOpenCart && (
          <ShoppingCart className="w-6 h-6 text-slate-700 cursor-pointer" onClick={onOpenCart} strokeWidth={1.5} />
        )}
      </div>
    </div>
  );

  const userPhone = currentSession?.phone || "";
  const userOrders = orders.filter(o => o.phone === userPhone);
  const pendingCount = userOrders.filter(o => o.deliveryStatus === "Pending").length;
  const processingCount = userOrders.filter(o => ["Confirmed", "Shipped", "Processing"].includes(o.deliveryStatus)).length;
  const deliveredCount = userOrders.filter(o => o.deliveryStatus === "Delivered").length;
  const cancelledCount = userOrders.filter(o => o.deliveryStatus === "Cancelled").length;

  const renderDashboard = () => (
    <div className="flex flex-col w-full h-full pb-[80px]">
      <Header title="Dashboard" />
      <div className="px-4 py-4">
        <h3 className="text-lg font-medium mb-4 text-slate-800 tracking-tight">Dashboard</h3>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-50 p-4 relative overflow-hidden">
            <div className="bg-yellow-50 w-10 h-10 rounded-full flex items-center justify-center mb-3">
              <Clock className="w-5 h-5 text-yellow-500 fill-yellow-500/20" strokeWidth={2} />
            </div>
            <p className="text-[13px] text-gray-800 font-medium mb-1 line-clamp-1">Pending order</p>
            <p className="text-2xl font-semibold text-slate-800">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-50 p-4 relative overflow-hidden">
            <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center mb-3">
              <Package className="w-5 h-5 text-blue-500 fill-blue-500/20" strokeWidth={2} />
            </div>
            <p className="text-[13px] text-gray-800 font-medium mb-1 line-clamp-1">Processing order</p>
            <p className="text-2xl font-semibold text-slate-800">{processingCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-50 p-4 relative overflow-hidden">
            <div className="bg-green-50 w-10 h-10 rounded-full flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5 text-green-500 fill-green-500/20" strokeWidth={2} />
            </div>
            <p className="text-[13px] text-gray-800 font-medium mb-1 line-clamp-1">Delivered order</p>
            <p className="text-2xl font-semibold text-slate-800">{deliveredCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-50 p-4 relative overflow-hidden">
            <div className="bg-red-50 w-10 h-10 rounded-full flex items-center justify-center mb-3">
              <X className="w-5 h-5 text-red-400 stroke-[3]" />
            </div>
            <p className="text-[13px] text-gray-800 font-medium mb-1 line-clamp-1">Cancelled order</p>
            <p className="text-2xl font-semibold text-slate-800">{cancelledCount}</p>
          </div>
        </div>

        <h3 className="text-lg font-medium mb-4 text-slate-800 tracking-tight">Products may you like</h3>
        <div className="flex flex-col gap-3">
          {products.slice(0, 3).map(p => {
             const ds = p.discountPercent || (p.salePrice ? Math.round(((p.price - p.salePrice) / p.price) * 100) : 0);
             const currentPrice = p.salePrice || p.price;
             return (
              <div key={p.id} className="flex gap-4 border border-gray-100 rounded-xl p-3 relative bg-white shadow-sm">
                <img src={p.gallery?.[0] || 'https://via.placeholder.com/150'} className="w-20 h-20 object-cover rounded-lg bg-gray-50" alt={p.name} />
                <div className="flex flex-col justify-center flex-1 pr-8">
                  <h4 className="text-[13px] font-medium text-slate-800 leading-snug mb-1.5 line-clamp-2">{p.name}</h4>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3.5 h-3.5 text-[#ffc107] fill-[#ffc107]" />
                    <span className="text-[12px] text-gray-500">0 (0)</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[#00c09d] font-semibold text-[15px]">৳ {currentPrice}</span>
                    {ds > 0 && <span className="text-gray-400 line-through text-[11px]">৳ {p.price}</span>}
                    {ds > 0 && <span className="text-[#00c09d] text-[11px] font-medium">-{ds}%</span>}
                  </div>
                </div>
                <div className="absolute right-3 bottom-4 p-1.5 rounded-md text-[#00c09d]">
                  <ShoppingCart className="w-[20px] h-[20px]" strokeWidth={2.5} />
                </div>
              </div>
            );
          })}
        </div>
        <button className="mt-6 w-full bg-[#00c09d] text-white py-3.5 rounded-lg text-[15px] font-semibold shadow-sm">
          View More
        </button>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="flex flex-col w-full h-full pb-[80px]">
      <Header title="Profile" />
      <div className="p-4 flex-1">
        <div className="bg-white rounded-xl shadow-sm border border-gray-50 p-6 flex flex-col items-center min-h-[70vh]">
          <h3 className="text-[17px] font-medium mb-8 text-slate-800 tracking-tight self-start">My Profile</h3>
          <div className="w-[100px] h-[100px] bg-slate-100 rounded-full flex flex-col justify-end items-center mb-4 overflow-hidden border border-slate-200">
             <User className="w-[60px] h-[60px] text-slate-300 translate-y-3" strokeWidth={1.5} />
          </div>
          <p className="text-slate-500 text-[13px] mb-4">Member Since {currentSession ? "2026-06-23" : ""}</p>
          <button className="text-[#00c09d] font-medium text-[13px] flex items-center gap-2 mb-10 border border-[#00c09d] rounded-lg px-4 py-2">
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>

          <div className="flex flex-col gap-6 w-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-gray-100">
                <User className="w-[22px] h-[22px] text-slate-500" strokeWidth={1.5}/>
              </div>
              <div className="text-slate-700 text-[15px] font-medium">{currentSession?.name || 'Full Name'}</div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-gray-100">
                <Package className="w-[22px] h-[22px] text-slate-500" strokeWidth={1.5}/>
              </div>
              <div className="text-slate-700 text-[15px] font-medium">Email Address</div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-gray-100">
                <Clock className="w-[22px] h-[22px] text-slate-500" strokeWidth={1.5}/>
              </div>
              <div className="text-slate-700 text-[15px] font-medium">Date of Birth</div>
            </div>
            
            <div className="flex items-center gap-4 mt-2">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-gray-100">
                <ShieldCheck className="w-[22px] h-[22px] text-slate-500" strokeWidth={1.5}/>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-800 font-semibold">{currentSession?.phone}</span>
                  <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-[10px] h-[10px] text-blue-500 fill-blue-500" />
                  </div>
                </div>
                <div className="text-slate-400 text-[11px] font-bold uppercase mt-0.5 tracking-wider">Contact</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => {
    const tabs = ["All", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
    const filteredOrders = ordersTab === 'all' ? userOrders : userOrders.filter(o => o.deliveryStatus.toLowerCase() === ordersTab);

    return (
      <div className="flex flex-col w-full h-full pb-[80px]">
        <Header title="My Orders" />
        <div className="p-4 flex-1">
          <div className="bg-white pt-5 px-4 pb-20 shadow-sm border border-gray-50 rounded-xl min-h-[70vh]">
            <h3 className="text-[17px] font-medium mb-5 text-slate-800 tracking-tight">My Orders</h3>
            <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
              {tabs.map(t => (
                <button 
                  key={t}
                  onClick={() => setOrdersTab(t.toLowerCase())}
                  className={`whitespace-nowrap px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-colors shrink-0 ${ordersTab === t.toLowerCase() ? 'bg-slate-200 text-slate-800' : 'bg-slate-100 text-slate-500'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            
            {filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-[15px]">
                No orders found.
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-2">
                {filteredOrders.map(order => (
                  <div key={order.id} className="border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                       <div>
                         <p className="font-bold text-slate-800">Order #{order.id}</p>
                         <p className="text-xs text-slate-500 mt-1">{order.date || "Just now"}</p>
                       </div>
                       <div className="flex flex-col items-end gap-1">
                          <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${order.deliveryStatus === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {order.deliveryStatus}
                          </span>
                       </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                       {order.items && order.items.map((it, idx) => {
                         let variantString = "";
                         if (it.variant && typeof it.variant === "object") {
                           variantString = Object.entries(it.variant)
                             .filter(([k, v]) => !["id", "image", "price", "stock"].includes(k) && v)
                             .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
                             .join(', ');
                         }
                         const productRef = products.find(p => p.id === it.productId);
                         const itImage = it.image || (it.variant && (it.variant as any).image) || (productRef && productRef.gallery && productRef.gallery[0]) || "";
                         return (
                           <div key={idx} className="flex justify-between text-sm items-center">
                             <div className="flex items-center gap-3">
                               {itImage && <img src={itImage} alt="product" className="w-10 h-10 object-cover rounded border border-slate-200 shadow-sm" />}
                               <div className="flex flex-col">
                                 <span className="text-slate-800 font-medium truncate max-w-[200px]">{it.name || `Product ID: ${it.productId}`} x{it.quantity}</span>
                                 {variantString && <span className="text-[10px] text-slate-500">{variantString}</span>}
                               </div>
                             </div>
                             <span className="font-bold">৳{(it.price * it.quantity).toLocaleString()}</span>
                           </div>
                         );
                       })}
                    </div>
                    
                    <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-sm">
                       <span className="text-slate-500">Total Amount</span>
                       <span className="font-bold text-emerald-600 text-base">৳{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderEmptyState = (title: string, btnText: string | null = null) => (
    <div className="bg-white px-4 pt-16 pb-24 flex flex-col items-center justify-center rounded-xl shadow-sm border border-gray-50 min-h-[60vh] mt-4 mx-4">
      <div className="w-48 h-36 bg-[#ffd640] rounded-b-xl rounded-t-sm relative flex flex-col items-center justify-center mb-10 shadow-sm border-2 border-[#1e293b]">
         <div className="absolute top-[-14px] left-[-2px] right-2 h-7 bg-[#fceba1] rounded-t-xl z-[-1] border-2 border-[#1e293b]"></div>
         <div className="absolute -top-10 left-12 w-14 h-16 bg-white border-2 border-[#1e293b] rounded flex flex-col pt-2 items-center rotate-[-12deg] z-[-2]">
            <div className="w-8 border-b-2 border-dashed border-gray-300 mb-2"></div>
            <div className="w-8 border-b-2 border-dashed border-gray-300"></div>
            <span className="text-3xl text-[#1e293b] font-bold mt-1 opacity-20">?</span>
         </div>
         <div className="flex gap-5 mt-4">
           <div className="w-[9px] h-[9px] bg-[#1e293b] rounded-full"></div>
           <div className="w-[9px] h-[9px] bg-[#1e293b] rounded-full"></div>
         </div>
         <div className="mt-5 w-8 h-2.5 border-t-[3px] border-[#1e293b] rounded-[50%]"></div>
      </div>
      <h3 className="text-[17px] font-medium mb-6 text-slate-800">{title}</h3>
      {btnText && (
        <button className="bg-[#00c09d] text-white px-6 py-3.5 rounded-lg text-[15px] font-semibold w-full max-w-[200px]">{btnText}</button>
      )}
    </div>
  );

  const renderReturns = () => renderPlaceholder("My Returns");

  const renderFavorites = () => {
    const wishlistedProducts = products.filter(p => wishlist.includes(p.id));
    return (
      <div className="flex flex-col w-full h-full pb-[80px]">
        <Header title="My Favorites" />
        {wishlistedProducts.length === 0 ? (
          renderEmptyState("Your My Favorites list is empty!", "Continue Shopping")
        ) : (
          <div className="flex flex-col gap-3 p-4 overflow-y-auto">
            {wishlistedProducts.map((p) => {
              const currentPrice = p.salePrice || p.price;
              const hasDiscount = !!p.salePrice && p.salePrice < p.price;
              const discountP = hasDiscount ? Math.round(((p.price - p.salePrice) / p.price) * 100) : 0;
              return (
                <div 
                  key={p.id} 
                  className="bg-white rounded-xl p-3 flex gap-3 shadow-xs border border-gray-100 hover:border-[#00c09d] transition-colors relative cursor-pointer"
                  onClick={() => onSelectProduct?.(p)}
                >
                  <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center shrink-0">
                    <img src={p.gallery?.[0]} className="max-h-full max-w-full object-contain mix-blend-multiply" alt=""/>
                  </div>
                  <div className="flex-grow flex flex-col justify-between pr-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1 pr-5">
                        {p.name}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[#00c09d] font-bold text-sm">৳ {currentPrice}</span>
                          {hasDiscount && (
                            <span className="text-slate-400 line-through text-[10px]">৳ {p.price}</span>
                          )}
                        </div>
                        {onAddToCart && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCart(p, 1);
                            }}
                            className="bg-[#00c09d] hover:bg-teal-600 active:scale-95 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition-transform cursor-pointer shadow-xs ml-2 shrink-0"
                          >
                            Add to Drawer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist?.(p.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-full"
                    title="Remove from favorites"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderReviews = () => renderPlaceholder("My Reviews");

  const renderAddresses = () => renderPlaceholder("Address Book");

  const renderChangePassword = () => renderPlaceholder("Change Password");

  const handleTrack = () => {
    setTrackError("");
    setTrackedOrder(null);
    if (!trackId.trim()) {
      setTrackError("Please enter an Order ID");
      return;
    }
    const found = orders.find(o => o.id === trackId.trim().toUpperCase());
    if (found) {
      setTrackedOrder(found);
    } else {
      setTrackError("Order ID not found. Please check and try again.");
    }
  };

  const renderPlaceholder = (title: string) => (
    <div className="flex flex-col w-full h-full pb-[80px]">
      <Header title={title}/>
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center animate-fade-in">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
          <Clock className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">{title} Coming Soon</h3>
        <p className="text-sm text-slate-500 leading-relaxed">We are currently developing this feature to serve you better. Thank you for your patience!</p>
      </div>
    </div>
  );

  const render2FA = () => (
    <div className="flex flex-col w-full h-full pb-[80px]">
      <Header title="Two-Factor..."/>
      <div className="p-4 flex-1 max-w-lg mx-auto w-full">
        <div className="bg-white p-5 shadow-sm border border-gray-50 rounded-xl min-h-[50vh] flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-[#00c09d] mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-slate-800 tracking-tight">Security Center</h3>
          <p className="text-slate-500 mb-8 leading-relaxed text-[14px]">
            Add an extra layer of protection to your account with 2FA. This feature will be enabled for your region soon.
          </p>

          <button 
            disabled
            className="w-full bg-slate-100 text-slate-400 py-4 rounded-xl font-bold text-[15px] cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );

  const renderTrackOrder = () => (
    <div className="flex flex-col w-full h-full pb-[80px] bg-white">
      <Header title="Track Order" />
      <div className="flex-1 flex flex-col items-center pt-10 px-6 relative z-10 w-full">
        <h2 className="text-[24px] font-bold mb-2 text-slate-800 tracking-tight text-center">Track Your Order</h2>
        <p className="text-slate-500 mb-8 text-[14px] text-center">Enter Order ID to see real-time status.</p>
        
        <div className="w-full mb-6 max-w-md">
          <label className="block mb-2 text-slate-800 font-semibold text-[14px]">Order Id</label>
          <input 
            type="text" 
            placeholder="Enter Order ID (e.g. ORD-1234)" 
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-4 outline-none text-[15px] focus:border-[#00c09d] font-mono" 
          />
          {trackError && <p className="text-xs text-red-500 mt-2 font-medium">{trackError}</p>}
        </div>
        
        <button 
          onClick={handleTrack}
          className="w-full max-w-[300px] bg-[#00c09d] text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 text-[15px] shadow-sm transition-all active:scale-95"
        >
          Track Status <ArrowLeft className="w-[18px] h-[18px] rotate-180" strokeWidth={2.5}/>
        </button>

        {trackedOrder && (
          <div className="w-full max-w-md mt-10 p-5 bg-teal-50 rounded-2xl border border-teal-100 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Order Status</span>
              <span className="px-3 py-1 bg-white rounded-full text-[11px] font-bold text-teal-700 shadow-sm border border-teal-100">{trackedOrder.deliveryStatus}</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Recipient</span>
                <span className="font-bold text-slate-800">{trackedOrder.customerName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Total BDT</span>
                <span className="font-bold text-slate-800">৳{trackedOrder.total.toLocaleString()}</span>
              </div>
              <div className="flex flex-col gap-2 pt-3 border-t border-teal-100">
                <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1">Items</span>
                {trackedOrder.items && trackedOrder.items.map((it: any, idx: number) => {
                   let variantString = "";
                   if (it.variant && typeof it.variant === "object") {
                     variantString = Object.entries(it.variant)
                       .filter(([k, v]) => !["id", "image", "price", "stock"].includes(k) && v)
                       .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
                       .join(', ');
                   }
                   const productRef = products.find(p => p.id === it.productId);
                   const itImage = it.image || (it.variant && it.variant.image) || (productRef && productRef.gallery && productRef.gallery[0]) || "";
                   return (
                     <div key={idx} className="flex justify-between items-center text-xs">
                       <div className="flex items-center gap-2">
                         {itImage && <img src={itImage} alt="product" className="w-8 h-8 object-cover rounded border border-slate-200" />}
                         <div className="flex flex-col">
                           <span className="text-slate-800 truncate max-w-[160px] font-medium">{it.name || `Product ID: ${it.productId}`} x{it.quantity}</span>
                           {variantString && <span className="text-[9px] text-slate-500">{variantString}</span>}
                         </div>
                       </div>
                       <span className="font-bold">৳{(it.price * it.quantity).toLocaleString()}</span>
                     </div>
                   );
                })}
              </div>
              {trackedOrder.courier && (
                <div className="flex justify-between text-xs pt-3 border-t border-teal-100">
                  <span className="text-slate-500">Courier ID</span>
                  <span className="font-bold text-teal-700">{trackedOrder.courier.trackingId}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTerms = () => (
    <div className="flex flex-col w-full h-full pb-[80px] bg-white animate-fade-in">
      <Header title="Terms and Conditions" />
      <div className="p-6 max-w-2xl mx-auto text-slate-700 leading-relaxed space-y-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight border-b pb-2">Terms & Conditions</h1>
        <p className="text-xs text-slate-400">সর্বশেষ আপডেট: জুন ২০২৬</p>
        
        <p>আমাদের ওয়েবসাইট বা মোবাইল প্ল্যাটফর্ম ব্যবহার করার জন্য আপনাকে ধন্যবাদ। এই শর্তাবলী আমাদের প্ল্যাটফর্ম থেকে পণ্য কেনাকাটার ক্ষেত্রে প্রযোজ্য হবে।</p>
        
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-800">১. অর্ডার প্রক্রিয়া ও স্টক</h3>
          <p className="text-sm">আমরা যেকোনো অর্ডারের সঠিকতা নিশ্চিত করতে OTP ভেরিফিকেশন ব্যবহার করি। পণ্যের স্টক রিয়েল-টাইম আপডেট করা হয়, তবে কোনো প্রযুক্তিগত ভুলের কারণে স্টক শেষ হওয়া পণ্য অর্ডার হয়ে গেলে আমরা অর্ডারটি বাতিল ও পরিশোধিত মূল্য ফেরতের অধিকার রাখি।</p>
          
          <h3 className="text-base font-bold text-slate-800">২. মূল্য ও পেমেন্ট</h3>
          <p className="text-sm">পণ্য ডেলিভারির সময় ক্যাশ অন ডেলিভারি (COD) অথবা অনলাইন পেমেন্ট গেটওয়ের (SSLCommerz) মাধ্যমে পেমেন্ট সম্পন্ন করা যাবে। অনলাইন পেমেন্ট করার সময় আপনার ব্যাংক বা কার্ডের সম্পূর্ণ নিরাপত্তা পেমেন্ট গেটওয়ে দ্বারা নিয়ন্ত্রিত হয়।</p>
          
          <h3 className="text-base font-bold text-slate-800">৩. ডেলিভারি ও চার্জ</h3>
          <p className="text-sm">ঢাকা সিটির ভেতর সাধারণ ডেলিভারি ১-২ দিনের মধ্যে এবং ঢাকা সিটির বাইরে ৩-৫ দিনের মধ্যে সম্পন্ন হয়। প্রাকৃতিক দুর্যোগ বা অন্যান্য অনিবার্য কারণে ডেলিভারি বিলম্বিত হতে পারে।</p>
        </div>
      </div>
    </div>
  );

  const renderRefund = () => (
    <div className="flex flex-col w-full h-full pb-[80px] bg-white animate-fade-in">
      <Header title="Refund and Return Policy" />
      <div className="p-6 max-w-2xl mx-auto text-slate-700 leading-relaxed space-y-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight border-b pb-2">Refund & Return Policy</h1>
        <p className="text-xs text-slate-400">সর্বশেষ আপডেট: জুন ২০২৬</p>
        
        <p>আমরা গ্রাহক সন্তুষ্টিকে সর্বোচ্চ অগ্রাধিকার দিই। আপনি যদি আমাদের পণ্য নিয়ে সন্তুষ্ট না হন, তবে নির্দিষ্ট শর্ত সাপেক্ষে ফেরত বা পরিবর্তন করতে পারবেন।</p>
        
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-800">১. রিটার্ন বা এক্সচেঞ্জ সময়সীমা</h3>
          <p className="text-sm">পণ্য গ্রহণের পর সর্বোচ্চ ৭ দিনের মধ্যে যেকোনো ম্যানুফ্যাকচারিং ত্রুটির কারণে রিটার্ন বা এক্সচেঞ্জ দাবি করতে হবে।</p>
          
          <h3 className="text-base font-bold text-slate-800">২. ভিডিও আনবক্সিং প্রমাণ (বাধ্যতামূলক)</h3>
          <p className="text-sm text-red-600 font-semibold">প্যাকেট খোলার সময় সম্পূর্ণ একটি আনবক্সিং ভিডিও ধারণ করতে হবে। কোনো ভাঙা বা ভুল পণ্যের ক্ষেত্রে আনবক্সিং ভিডিও ছাড়া রিটার্ন বা রিফান্ড গ্রহণযোগ্য হবে না।</p>
          
          <h3 className="text-base font-bold text-slate-800">৩. রিটার্ন ডেলিভারি চার্জ</h3>
          <p className="text-sm">যদি ভুল পণ্য বা ক্ষতিগ্রস্ত পণ্য পাঠানো হয়, তবে রিটার্ন চার্জ সম্পূর্ণ আমরা বহন করব। অন্যথায় ডেলিভারি চার্জ গ্রাহককে বহন করতে হবে।</p>
        </div>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="flex flex-col w-full h-full pb-[80px] bg-white animate-fade-in">
      <Header title="Privacy Policy" />
      <div className="p-6 max-w-2xl mx-auto text-slate-700 leading-relaxed space-y-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight border-b pb-2">Privacy Policy</h1>
        <p className="text-xs text-slate-400">সর্বশেষ আপডেট: জুন ২০২৬</p>
        
        <p>আমরা আপনার গোপনীয়তাকে সম্মান করি এবং আপনার ব্যক্তিগত তথ্যের নিরাপত্তা নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ।</p>
        
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-800">১. সংগৃহীত তথ্য</h3>
          <p className="text-sm">অর্ডার প্রক্রিয়াকরণ এবং OTP যাচাইকরণের জন্য আমরা আপনার নাম, মোবাইল নম্বর, ইমেইল, এবং ডেলিভারি ঠিকানা সংগ্রহ করি।</p>
          
          <h3 className="text-base font-bold text-slate-800">২. তথ্যের ব্যবহার</h3>
          <p className="text-sm">আপনার সংগৃহীত তথ্য শুধুমাত্র অর্ডার ডেলিভারি নিশ্চিত করতে, কুরিয়ার সেবার সাথে শেয়ার করতে এবং গ্রাহক সেবা উন্নত করার কাজে ব্যবহৃত হয়। আমরা কোনো তৃতীয় পক্ষের কাছে আপনার তথ্য বিক্রি বা শেয়ার করি না।</p>
          
          <h3 className="text-base font-bold text-slate-800">৩. নিরাপত্তা</h3>
          <p className="text-sm">আমরা গ্রাহকদের তথ্যের সর্বোচ্চ নিরাপত্তা বজায় রাখতে আধুনিক এনক্রিপশন ও ভেরিফিকেশন ব্যবস্থা (যেমন OTP) ব্যবহার করি।</p>
        </div>
      </div>
    </div>
  );

  const renderMenuDrawer = () => {
    const listItems = [
      { id: "dashboard", icon: LayoutGrid, label: "Dashboard" },
      { id: "profile", icon: User, label: "Profile" },
      { id: "orders", icon: Package, label: "My Orders" },
      { id: "returns", icon: RotateCcw, label: "My Returns" },
      { id: "favorites", icon: Heart, label: "My Favorites" },
      { id: "reviews", icon: Star, label: "My Reviews" },
      { id: "addresses", icon: MapPin, label: "Saved Addresses" },
      { id: "password", icon: Lock, label: "Change Password" },
      { id: "2fa", icon: ShieldCheck, label: "Two-Factor Authentication" },
      { id: "track", icon: Search, label: "Track Order" },
      { id: "logout", icon: LogOut, label: "Logout", action: onLogout },
    ];
    
    const aboutItems = [
      { id: "terms", icon: Info, label: "Terms and Conditions" },
      { id: "refund", icon: FileText, label: "Refund and Return Policy" },
      { id: "privacy", icon: ShieldCheck, label: "Privacy Policy" },
    ];

    return (
      <>
        <div className="fixed inset-0 bg-black/40 z-[200] transition-opacity" onClick={() => setIsMenuOpen(false)}></div>
        <div className="fixed top-0 right-0 bottom-0 w-[80%] max-w-[340px] bg-white z-[210] shadow-xl flex flex-col overflow-y-auto animate-slide-left">
           <div className="flex justify-between items-center px-6 pt-8 pb-6 border-b border-gray-100 shrink-0">
             <div className="flex items-center gap-3 text-slate-800">
               <div className="w-[42px] h-[42px] rounded-full bg-slate-100 flex items-center justify-center border border-gray-200">
                 <User className="w-5 h-5 text-slate-400" />
               </div>
               <span className="font-semibold text-[17px]">{currentSession?.name || "N/A"}</span>
             </div>
             <X className="w-6 h-6 text-slate-500 cursor-pointer" onClick={() => setIsMenuOpen(false)} />
           </div>
           
           <div className="px-6 pt-6 flex-1">
             <h3 className="text-gray-400 text-[11px] font-bold mb-6 tracking-wider uppercase">MY ACCOUNT</h3>
             <ul className="space-y-6">
               {listItems.map(item => (
                 <li 
                  key={item.id} 
                  className="flex items-center gap-4 text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (item.action) item.action();
                    else setActiveTab(item.id);
                  }}
                 >
                   <item.icon className="w-[22px] h-[22px] text-slate-500" strokeWidth={1.5} />
                   <span className="text-[15px] font-medium">{item.label}</span>
                 </li>
               ))}
             </ul>

             <div className="pt-10 pb-10">
               <h3 className="text-gray-400 text-[11px] font-bold mb-6 tracking-wider uppercase">ABOUT</h3>
               <ul className="space-y-6">
                 {aboutItems.map(item => (
                   <li 
                    key={item.id} 
                    className="flex items-center gap-4 text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors"
                   >
                     <item.icon className="w-[22px] h-[22px] text-slate-500" strokeWidth={1.5} />
                     <span className="text-[15px] font-medium">{item.label}</span>
                   </li>
                 ))}
               </ul>
             </div>
           </div>
        </div>
      </>
    );
  };

  const renderRequireLogin = (itemLabel: string) => {
    return (
      <div className="flex flex-col w-full h-full pb-[80px] bg-white">
        <Header title={itemLabel} />
        <div className="p-6 flex-1 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-[#00c09d]" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Login Required</h3>
          <p className="text-slate-500 text-center text-sm mb-6 max-w-[240px]">
            Please login or sign up to view and access your {itemLabel.toLowerCase()}.
          </p>
          <button
            onClick={onLoginTrigger}
            className="bg-[#00c09d] hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-sm active:scale-95 transition-transform w-full max-w-[200px] text-center cursor-pointer"
          >
            Login / Signup
          </button>
        </div>
      </div>
    );
  };

  const renderMenu = () => {
    const listItems = [
      { id: "dashboard", icon: LayoutGrid, label: "Dashboard" },
      { id: "profile", icon: User, label: "Profile" },
      { id: "orders", icon: Package, label: "My Orders" },
      { id: "returns", icon: RotateCcw, label: "My Returns" },
      { id: "favorites", icon: Heart, label: "My Favorites" },
      { id: "reviews", icon: Star, label: "My Reviews" },
      { id: "addresses", icon: MapPin, label: "Saved Addresses" },
      { id: "password", icon: Lock, label: "Change Password" },
      { id: "2fa", icon: ShieldCheck, label: "Two-Factor Authentication" },
      { id: "track", icon: Search, label: "Track Order" },
      ...(currentSession 
        ? [{ id: "logout", icon: LogOut, label: "Logout", action: onLogout }]
        : [{ id: "login", icon: LogIn, label: "Login / Signup", action: onLoginTrigger }]
      )
    ];

    return (
      <div className="flex flex-col w-full bg-white pb-[80px]">
        {/* Profile/Avatar section exactly like the screenshot */}
        <div className="relative px-6 pt-6 pb-4 border-b border-gray-100 flex flex-col">
          {/* Close X button inside the menu */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 outline-none hover:bg-slate-50 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5.5 h-5.5" strokeWidth={1.5} />
          </button>

          {/* User information display block */}
          <div className="flex flex-col items-start mt-2">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 mb-3 shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]">
              <User className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
            </div>
            <span className="font-bold text-slate-800 text-[18px] tracking-tight leading-none mb-1">
              {currentSession?.name || "N/A"}
            </span>
          </div>
        </div>

        {/* Section MY ACCOUNT */}
        <div className="px-6 pt-5 pb-1">
          <h3 className="text-gray-400 text-[11.5px] font-bold tracking-wider uppercase">MY ACCOUNT</h3>
        </div>

        {/* List of items rendered without container card or shadow */}
        <div className="flex flex-col px-6 gap-5.5 pb-6 mt-3">
          {listItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    if (onTabChange) {
                      onTabChange(item.id);
                    } else {
                      setActiveTab(item.id);
                    }
                  }
                }}
                className="flex items-center gap-4 text-slate-700 hover:text-[#00c09d] transition-colors py-0.5 text-left outline-none cursor-pointer"
              >
                <Icon className="w-[19px] h-[19px] text-slate-500" strokeWidth={1.5} />
                <span className="text-[14.5px] font-medium text-slate-600 hover:text-[#00c09d] transition-colors">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Section ABOUT */}
        <div className="px-6 pt-5 pb-1 border-t border-gray-100 mt-2">
          <h3 className="text-gray-400 text-[11.5px] font-bold tracking-wider uppercase">ABOUT</h3>
        </div>

        {/* List of About items rendered exactly like the screenshot */}
        <div className="flex flex-col px-6 gap-5.5 pb-12 mt-3">
          {[
            { id: "terms", icon: Info, label: "Terms and Conditions" },
            { id: "refund", icon: FileText, label: "Refund and Return Policy" },
            { id: "privacy", icon: ShieldCheck, label: "Privacy Policy" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (onTabChange) {
                    onTabChange(item.id);
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className="flex items-center gap-4 text-slate-700 hover:text-[#00c09d] transition-colors py-0.5 text-left outline-none cursor-pointer"
              >
                <Icon className="w-[19px] h-[19px] text-slate-500" strokeWidth={1.5} />
                <span className="text-[14.5px] font-medium text-slate-600 hover:text-[#00c09d] transition-colors">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const requiresLogin = ["dashboard", "profile", "orders", "returns", "reviews", "addresses", "password", "2fa"];
  const isProtected = requiresLogin.includes(activeTab) && !currentSession;

  return (
    <div className="flex-1 flex flex-col bg-[#f0f2f5] w-full relative overflow-y-auto min-h-0">
       {isProtected ? renderRequireLogin(activeTab.toUpperCase()) : (
         <>
           {activeTab === "menu" && renderMenu()}
           {activeTab === "dashboard" && renderDashboard()}
           {activeTab === "profile" && renderProfile()}
           {activeTab === "orders" && renderOrders()}
           {activeTab === "returns" && renderReturns()}
           {activeTab === "favorites" && renderFavorites()}
           {activeTab === "reviews" && renderReviews()}
           {activeTab === "addresses" && renderAddresses()}
           {activeTab === "password" && renderChangePassword()}
           {activeTab === "2fa" && render2FA()}
           {activeTab === "track" && renderTrackOrder()}
           {activeTab === "terms" && renderTerms()}
           {activeTab === "refund" && renderRefund()}
           {activeTab === "privacy" && renderPrivacy()}
         </>
       )}
       
       {isMenuOpen && renderMenuDrawer()}
    </div>
  );
}
