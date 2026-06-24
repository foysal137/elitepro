import React, { useState } from "react";
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Tag, 
  MapPin, 
  Phone, 
  User, 
  BookOpen, 
  CheckCircle, 
  Smartphone, 
  CreditCard,
  Lock,
  Compass,
  AlertTriangle,
  FileCheck,
  Truck,
  ArrowLeft,
  ShoppingCart,
  Store
} from "lucide-react";
import { Product, AppSettings, Coupon, Order } from "../types";

const CashOnDeliveryIcon = () => (
  <svg className="w-10 h-8 flex-shrink-0" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="8" width="40" height="24" rx="2" fill="#10B981" />
    <circle cx="24" cy="20" r="6" fill="#047857" />
    <rect x="8" y="12" width="6" height="16" rx="1" fill="#34D399" opacity="0.5" />
    <rect x="34" y="12" width="6" height="16" rx="1" fill="#34D399" opacity="0.5" />
    <path d="M28 24C28 24 32 18 36 20C40 22 42 24 46 22C50 20 54 24 54 28C54 32 46 38 40 38C34 38 30 34 28 30V24Z" fill="#FDBA74" />
    <path d="M36 20C34 22 34 26 36 28" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

interface CartItem {
  product: Product;
  quantity: number;
  variant: {
    size?: string;
    color?: string;
    ram?: string;
    storage?: string;
  };
}

interface CartAndCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  settings: AppSettings;
  coupons: Coupon[];
  currentSession?: { name: string; phone: string } | null;
  onOrderPlaced: (order: Order) => void;
}

export default function CartAndCheckout({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  settings,
  coupons,
  currentSession,
  onOrderPlaced
}: CartAndCheckoutProps) {
  // Navigation states
  const [step, setStep] = useState<"cart" | "checkout" | "payment_otp" | "success">("cart");

  // Input states
  const [customerName, setCustomerName] = useState(currentSession?.name || "");
  const [phone, setPhone] = useState(currentSession?.phone || "");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'SSLCommerz'>("COD");

  // Prefill when drawer opens
  React.useEffect(() => {
    if (isOpen && currentSession) {
      if (!customerName) setCustomerName(currentSession.name || "");
      if (!phone) setPhone(currentSession.phone || "");
    }
  }, [isOpen, currentSession]);

  // Discount voucher states
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<Coupon | null>(null);
  const [voucherError, setVoucherError] = useState("");

  // OTP mock states
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState("");

  // Mock payment details (bKash/Nagad wallet popup inputs)
  const [walletPhone, setWalletPhone] = useState("");
  const [walletPin, setWalletPin] = useState("");

  // Success detail storage
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  if (!isOpen) return null;

  // Calculators
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product.salePrice || item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  // Apply Coupon Code
  const handleApplyVoucher = () => {
    setVoucherError("");
    const matched = coupons.find(c => c.code === voucherCode.toUpperCase().trim() && c.isActive);
    if (!matched) {
      setVoucherError("Invalid or expired coupon!");
      setAppliedVoucher(null);
      return;
    }
    if (subtotal < matched.minOrderAmount) {
      setVoucherError(`Minimum order value of ৳${matched.minOrderAmount} required for this coupon.`);
      setAppliedVoucher(null);
      return;
    }
    setAppliedVoucher(matched);
  };

  const discountAmount = appliedVoucher 
    ? (appliedVoucher.discountType === "percentage" 
        ? Math.round((subtotal * appliedVoucher.discountValue) / 100) 
        : appliedVoucher.discountValue)
    : 0;

  const total = Math.max(0, subtotal - discountAmount + 80);

  // Validate mobile number prior to ordering
  const isBDPhoneValid = (num: string) => {
    const cleanStr = num.replace(/[^\d]/g, "");
    return cleanStr.length === 11 && (cleanStr.startsWith("017") || cleanStr.startsWith("018") || cleanStr.startsWith("019") || cleanStr.startsWith("015") || cleanStr.startsWith("016") || cleanStr.startsWith("013") || cleanStr.startsWith("014"));
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");

    if (!agreedToTerms) {
      setOtpError("You must agree to the Terms and Conditions and Policies to proceed.");
      return;
    }

    if (!customerName || !phone || !address) {
      setOtpError("Please fill name, phone, and complete delivery address.");
      return;
    }

    if (!isBDPhoneValid(phone)) {
      setOtpError("Please enter standard 11-digit mobile number");
      return;
    }

    // Check if security configuration demands SMS OTP verification
    if (settings.otpVerificationEnabled) {
      setCheckoutLoading(true);
      try {
        const res = await fetch("/api/otp/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone })
        });
        await res.json();
        setStep("payment_otp");
        setOtpSent(true);
      } catch (err) {
        setOtpError("Error sending OTP. Network issue.");
      }
      setCheckoutLoading(false);
      return;
    }

    triggerCheckoutOrder();
  };

  // Perform backend Checkout request
  const triggerCheckoutOrder = async () => {
    setCheckoutLoading(true);
    setOtpError("");

    try {
      const orderPayload = {
        customerName,
        phone,
        address,
        notes,
        paymentMethod,
        items: cartItems.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          sku: item.product.sku,
          price: item.product.salePrice || item.product.price,
          quantity: item.quantity,
          variant: item.variant
        })),
        couponCode: appliedVoucher ? appliedVoucher.code : undefined,
        otpVerified: settings.otpVerificationEnabled
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.error || "Failed to process checkout transaction.");
        return;
      }

      const createdOrder = data.order;
      if (paymentMethod !== "COD") {
        // Init SSLCommerz payment for digital methods
        setCheckoutLoading(true);
        const sslRes = await fetch("/api/payment/sslcommerz/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: createdOrder.id,
            amount: createdOrder.total,
            customerName,
            phone,
            address
          })
        });
        const sslData = await sslRes.json();
        if (sslData.success && sslData.gatewayPageURL) {
          window.location.href = sslData.gatewayPageURL; // Redirect to SSLCommerz
          return;
        } else {
          console.error("SSLCommerz Init Error:", sslData);
          setOtpError(sslData.error || "Payment Gateway failed to initialize. Please check configuration or try Cash on Delivery.");
          setCheckoutLoading(false);
          return;
        }
      }

      setLatestOrder(createdOrder);
      setStep("success");
      onOrderPlaced(createdOrder);
      onClearCart();
    } catch (err: any) {
      setOtpError("Network conflict dispatching order state. Try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setCheckoutLoading(true);
    setOtpError("");
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otpInput })
      });
      const data = await res.json();
      if (data.success) {
        triggerCheckoutOrder();
      } else {
        setOtpError(data.error || "Incorrect OTP! Please check your mobile.");
      }
    } catch (err) {
      setOtpError("Network error. Could not verify OTP.");
    }
    setCheckoutLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-end z-[120] animate-fade-in text-slate-800" id="cart-drawer-root">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl relative overflow-hidden animate-slide-left">
        
        {/* TOP HEADER */}
        {step === "checkout" ? (
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
            <button 
              onClick={() => setStep("cart")}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-700 cursor-pointer transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-slate-900 text-base">
              Checkout
            </h3>
            <div className="relative p-1">
              <ShoppingCart className="w-5 h-5 text-slate-800" />
              <span className="absolute -top-1 -right-1 bg-[#00c09d] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartItems.length}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">
                Your Shopping Cart
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5.5 h-5.5" />
            </button>
          </div>
        )}

        {/* STEPPERS WRAPPER */}
        <div className="flex-grow flex flex-col overflow-hidden">

          {/* ================= STEP 1: CART LIST ================= */}
          {step === "cart" && (
            <div className="flex flex-col h-full">
              {cartItems.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center gap-4">
                  <div className="bg-emerald-50 text-emerald-650 p-5 rounded-full animate-bounce">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <h4 className="font-extrabold text-slate-700 text-sm uppercase">Your Cart is empty</h4>
                  <p className="text-slate-400 text-xs max-w-xs leading-relaxed">Your cart is currently empty. Please select products from our collections to proceed.</p>
                  <button 
                    onClick={onClose}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-full cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="flex flex-col flex-grow">
                  
                  {/* Cart scroll items */}
                  <div className="flex-grow p-4 flex flex-col gap-4 overflow-y-auto">
                    {cartItems.map((item, idx) => {
                      const price = item.product.salePrice || item.product.price;
                      return (
                        <div 
                          key={idx} 
                          className="flex gap-3 border-b border-slate-100 pb-3 items-center"
                          id={`cart-item-${item.product.id}`}
                        >
                          <img 
                            src={(item.variant as any)?.image || item.product.gallery[0]} 
                            alt={item.product.name} 
                            className="w-14 h-14 object-cover rounded-xl border flex-shrink-0"
                          />
                          <div className="flex-grow flex flex-col gap-1 text-left">
                            <h4 className="font-extrabold text-slate-800 text-xs leading-snug line-clamp-2">
                              {item.product.name}
                            </h4>
                            <div className="flex flex-wrap gap-1.5 text-[10px]">
                              {item.variant?.size && (
                                <span className="bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-sm">Size: {item.variant.size}</span>
                              )}
                              {item.variant?.color && (
                                <span className="bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-sm">Color: {item.variant.color}</span>
                              )}
                            </div>
                            <span className="font-mono text-xs font-bold text-emerald-600 text-[11px]">
                              ৳{price.toLocaleString()} x {item.quantity}
                            </span>
                          </div>

                          {/* Control */}
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex border items-center rounded-md bg-white text-xs">
                              <button 
                                onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                                className="px-1.5 py-0.5 font-bold hover:bg-slate-50 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="px-1.5 font-mono text-[10px] font-bold">{item.quantity}</span>
                              <button 
                                onClick={() => onUpdateQuantity(idx, Math.min(item.product.stock, item.quantity + 1))}
                                className="px-1.5 py-0.5 font-bold hover:bg-slate-50 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                            
                            <button
                              onClick={() => onRemoveItem(idx)}
                              className="text-red-500 hover:text-red-700 p-1 rounded-full cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pricing summaries + voucher codes */}
                  <div className="p-4 border-t bg-slate-50 flex flex-col gap-3">
                    
                    {/* VOUCHER APPLICATION CARD */}
                    <div className="flex gap-2 relative">
                      <div className="relative flex-grow">
                        <input
                          type="text"
                          placeholder="Enter Promo Code"
                          value={voucherCode}
                          onChange={(e) => setVoucherCode(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 pl-8 text-xs focus:outline-emerald-500 placeholder-slate-400 font-bold uppercase"
                        />
                        <Tag className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                      </div>
                      <button
                        onClick={handleApplyVoucher}
                        className="bg-slate-900 border border-slate-900 hover:bg-black text-white text-xs font-extrabold px-3 py-2 rounded-lg cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    {voucherError && (
                      <p className="text-[10px] text-red-600 font-semibold">{voucherError}</p>
                    )}

                    {appliedVoucher && (
                      <div className="bg-emerald-55/10 border border-emerald-200 text-emerald-800 text-[10px] font-bold px-3 py-1.5 rounded-lg flex justify-between items-center">
                        <span>Coupon Active: <strong>{appliedVoucher.code}</strong> (-৳{discountAmount})</span>
                        <button onClick={() => setAppliedVoucher(null)} className="text-red-500 font-extrabold hover:underline uppercase">Remove</button>
                      </div>
                    )}

                    {/* Cost math */}
                    <div className="flex flex-col gap-2 border-b border-slate-200/50 pb-2 mt-1 font-semibold text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-mono text-slate-800">৳{subtotal.toLocaleString()}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-red-600 font-bold">
                          <span>Discount</span>
                          <span className="font-mono">-৳{discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[11px] font-normal text-slate-400">
                        <span>Delivery</span>
                        <span className="text-emerald-600 font-bold uppercase">Free standard BD</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-baseline font-extrabold text-slate-800 py-1">
                      <span className="text-sm">Total Payable Amount:</span>
                      <span className="font-mono text-emerald-600 text-xl">৳{total.toLocaleString()}</span>
                    </div>

                    {/* Next step button */}
                    <button
                      onClick={() => setStep("checkout")}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-emerald-700/10 flex items-center justify-center gap-1.5 text-xs uppercase cursor-pointer"
                    >
                      <span>Proceed to Checkout</span>
                      <Compass className="w-4 h-4 animate-spin-slow" />
                    </button>

                  </div>

                </div>
              )}
            </div>
          )}

          {/* ================= STEP 2: CHECKOUT INFO FORM ================= */}
          {step === "checkout" && (
            <form onSubmit={handleCheckoutSubmit} className="flex-grow flex flex-col h-full bg-[#f4f6f9] overflow-hidden text-left">
              {/* Scrollable Area */}
              <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-4">
                
                {/* 1. SHIPPING ADDRESS CARD */}
                <div className="bg-white rounded-xl shadow-xs p-4 flex flex-col gap-4 border border-slate-100">
                  <h4 className="font-bold text-slate-900 text-sm pb-1 border-b border-slate-100 flex items-center gap-2">
                    <span>Shipping Address</span>
                  </h4>

                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-0.5">
                        <span>Your Name</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00c09d] focus:ring-1 focus:ring-[#00c09d] transition-all font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-0.5">
                        <span>Phone Number</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="01993183822"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        maxLength={11}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00c09d] focus:ring-1 focus:ring-[#00c09d] transition-all font-mono font-semibold"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-0.5">
                        <span>Address</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        placeholder="Enter Address e.g. House 12, Road 4, Banani, Dhaka 1213"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        rows={3}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00c09d] focus:ring-1 focus:ring-[#00c09d] transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. CART ITEMS CARD */}
                <div className="bg-white rounded-xl shadow-xs p-4 flex flex-col gap-3 border border-slate-100">
                  <h4 className="font-bold text-slate-900 text-sm pb-1 border-b border-slate-100 flex items-center gap-2">
                    <span>Cart Items</span>
                  </h4>

                  {/* Merchant Bar */}
                  <div className="flex items-center gap-2 py-1 text-slate-700 text-xs font-semibold">
                    <Store className="w-4 h-4 text-slate-400" />
                    <span>KenakataBD</span>
                    <span className="text-slate-400 font-normal">&gt;</span>
                  </div>

                  <p className="text-xs text-slate-500 font-semibold mb-1">Items ({cartItems.length})</p>

                  {/* Items list */}
                  <div className="flex flex-col gap-3">
                    {cartItems.map((item, idx) => {
                      const itemPrice = item.product.salePrice || item.product.price;
                      const hasDiscount = item.product.salePrice && item.product.price > item.product.salePrice;
                      const calculatedDiscount = hasDiscount ? (item.product.price - item.product.salePrice) : 890;
                      
                      return (
                        <div key={idx} className="flex gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0 items-start">
                          <img 
                            src={(item.variant as any)?.image || item.product.gallery[0]} 
                            alt={item.product.name} 
                            className="w-14 h-14 object-cover rounded-lg border border-slate-150 flex-shrink-0"
                          />
                          <div className="flex-grow flex flex-col gap-1 text-left min-w-0">
                            <h5 className="font-semibold text-slate-800 text-xs leading-normal line-clamp-2">
                              {item.product.name}
                            </h5>
                            
                            {/* Discount badge */}
                            <span className="text-[#00c09d] font-bold text-xs">
                              ৳{calculatedDiscount.toLocaleString()} Discount
                            </span>

                            {/* Option attributes if any */}
                            {item.variant && (item.variant.size || item.variant.color) && (
                              <div className="flex gap-1.5 text-[10px] text-slate-400">
                                {item.variant.size && <span>Size: {item.variant.size}</span>}
                                {item.variant.color && <span>Color: {item.variant.color}</span>}
                              </div>
                            )}
                          </div>

                          {/* Quantity selection buttons matching screenshot style */}
                          <div className="flex items-center border border-slate-200 rounded-full bg-slate-50/50 flex-shrink-0 h-8 px-1">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                              className="w-6 h-6 flex items-center justify-center font-bold text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-2 font-mono text-xs font-bold text-slate-800">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(idx, Math.min(item.product.stock, item.quantity + 1))}
                              className="w-6 h-6 flex items-center justify-center font-bold text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. ORDER SUMMARY CARD */}
                <div className="bg-white rounded-xl shadow-xs p-4 flex flex-col gap-3 border border-slate-100">
                  <h4 className="font-bold text-slate-900 text-sm pb-1 border-b border-slate-100">
                    Order Summary
                  </h4>

                  <div className="flex flex-col gap-2.5 text-xs text-slate-600 font-medium">
                    <div className="flex justify-between">
                      <span>Price ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                      <span className="font-semibold text-slate-800 font-mono">৳{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span className="font-semibold text-[#00c09d] font-mono">-৳{discountAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping fee</span>
                      <span className="font-semibold text-slate-800 font-mono">৳80</span>
                    </div>

                    {/* Store / Packly Coupon promo input */}
                    <div className="flex gap-2 my-1">
                      <input
                        type="text"
                        placeholder={`Store / ${settings?.siteName || "Packly"} Coupon`}
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        className="flex-grow border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#00c09d] uppercase font-semibold"
                      />
                      <button
                        type="button"
                        onClick={handleApplyVoucher}
                        className="bg-[#00c09d] hover:bg-[#00ab8b] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    {voucherError && (
                      <p className="text-[10px] text-red-600 font-semibold mt-[-4px]">{voucherError}</p>
                    )}

                    {appliedVoucher && (
                      <div className="bg-emerald-50 border border-emerald-150 text-emerald-800 text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex justify-between items-center mt-[-4px]">
                        <span>Coupon: <strong>{appliedVoucher.code}</strong> (-৳{discountAmount})</span>
                        <button type="button" onClick={() => setAppliedVoucher(null)} className="text-red-500 hover:underline uppercase text-[9px]">Remove</button>
                      </div>
                    )}

                    <div className="flex justify-between border-t border-slate-100 pt-2.5 text-slate-700">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-900 font-mono">৳{total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900 text-sm">
                      <span>Total</span>
                      <span className="font-mono">৳{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* 4. PAYMENT OPTION CARD */}
                <div className="bg-white rounded-xl shadow-xs p-4 flex flex-col gap-3 border border-slate-100">
                  <h4 className="font-bold text-slate-900 text-sm pb-1 border-b border-slate-100">
                    Payment Option
                  </h4>

                  <div className="flex flex-col gap-3">
                    
                    {/* CASH ON DELIVERY OPTION */}
                    <div
                      onClick={() => setPaymentMethod('COD')}
                      className={`border rounded-xl p-3 cursor-pointer flex items-center justify-between transition-all ${
                        paymentMethod === 'COD'
                          ? "border-[#00c09d] bg-[#e6f7f4]/20 ring-1 ring-[#00c09d]/30"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                          paymentMethod === 'COD' ? "border-[#00c09d]" : "border-slate-300"
                        }`}>
                          {paymentMethod === 'COD' && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#00c09d]" />
                          )}
                        </div>
                        <span className="font-semibold text-xs text-slate-800">Cash on Delivery</span>
                      </div>
                      <CashOnDeliveryIcon />
                    </div>

                    {/* SSLCOMMERZ PAYMENT OPTION */}
                    <div
                      onClick={() => setPaymentMethod('SSLCommerz')}
                      className={`border rounded-xl p-3 cursor-pointer flex flex-col gap-2 transition-all ${
                        paymentMethod === 'SSLCommerz'
                          ? "border-[#00c09d] bg-[#e6f7f4]/20 ring-1 ring-[#00c09d]/30"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                            paymentMethod === 'SSLCommerz' ? "border-[#00c09d]" : "border-slate-300"
                          }`}>
                            {paymentMethod === 'SSLCommerz' && (
                              <div className="w-2.5 h-2.5 rounded-full bg-[#00c09d]" />
                            )}
                          </div>
                          <span className="font-semibold text-xs text-slate-800">Credit/Debit Cards (SSLCommerz)</span>
                        </div>
                      </div>

                      {/* PAYMENT GATEWAY LOGOS LIST */}
                      <div className="flex items-center gap-2 flex-wrap pl-7 mt-1.5">
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" 
                          alt="Visa" 
                          className="h-3 object-contain opacity-80"
                        />
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
                          alt="Mastercard" 
                          className="h-4 object-contain opacity-80"
                        />
                      </div>
                    </div>

                  </div>
                </div>

                {/* 5. AGREEMENT CHECKBOX */}
                <div className="flex items-start gap-2.5 px-1 py-1">
                  <input
                    type="checkbox"
                    id="terms-checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 text-[#00c09d] border-slate-300 rounded focus:ring-[#00c09d] mt-0.5"
                  />
                  <label htmlFor="terms-checkbox" className="text-[11px] text-slate-500 leading-normal select-none">
                    I have read and agree to the <a href="#" className="text-[#00c09d] hover:underline font-semibold">Terms and Conditions</a>, <a href="#" className="text-[#00c09d] hover:underline font-semibold">Privacy Policy</a>, and <a href="#" className="text-[#00c09d] hover:underline font-semibold">Refund and Return Policy</a>.
                  </label>
                </div>

                {otpError && (
                  <p className="text-xs text-red-600 font-bold border-l-2 border-red-500 pl-2 my-2">{otpError}</p>
                )}

              </div>

              {/* Bottom Sticky Action Footer */}
              <div className="bg-white border-t border-slate-200 p-4 flex items-center justify-between gap-4 mt-auto">
                <div className="flex flex-col text-left">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">Total :</span>
                  <span className="text-slate-900 font-extrabold text-base font-mono">৳{total.toLocaleString()}</span>
                </div>
                <button
                  type="submit"
                  disabled={checkoutLoading || !agreedToTerms}
                  className="flex-grow bg-[#00c09d] hover:bg-teal-600 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-lg text-sm tracking-wide transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  {checkoutLoading ? "Processing..." : "Place Order"}
                </button>
              </div>
            </form>
          )}

          {/* ================= STEP 3: OTP VERIFICATION MODAL SIMULATION ================= */}
          {step === "payment_otp" && (
            <div className="p-6 flex flex-col gap-5 text-center my-auto">
              <div className="mx-auto bg-slate-100 p-4 rounded-full text-emerald-600">
                <Lock className="w-10 h-10 animate-bounce" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm uppercase">2-Step OTP Account Verification</h3>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  We sent a generated OTP code regarding security rules validation to <strong>{phone}</strong>. Enter code below:
                </p>
              </div>

              <div className="flex flex-col gap-2 max-w-xs mx-auto">
                <input
                  type="text"
                  placeholder="Enter 4 Digit OTP Code"
                  maxLength={4}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="text-center font-mono font-extrabold tracking-widest text-lg border-2 border-slate-350 focus:border-emerald-500 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white"
                />
              </div>

              {otpError && (
                <p className="text-xs text-red-600 font-bold leading-normal">{otpError}</p>
              )}

              <div className="flex gap-2 justify-center max-w-sm mx-auto w-full mt-4">
                <button
                  type="button"
                  onClick={() => setStep("checkout")}
                  className="flex-grow bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 rounded-lg text-xs"
                >
                  Edit details
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={checkoutLoading}
                  className="flex-grow bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold py-2.5 rounded-lg text-xs uppercase"
                >
                  {checkoutLoading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 4: SUCCESS INVOICE DETAIL ================= */}
          {step === "success" && latestOrder && (
            <div className="p-6 flex flex-col gap-6 text-left" id="checkout-completed-portal">
              
              <div className="text-center flex flex-col gap-2 py-4">
                <div className="mx-auto bg-emerald-100 p-3 rounded-full text-emerald-600 shadow-sm">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <h3 className="font-extrabold text-slate-950 text-base uppercase tracking-tight">Order Placed Successfully!</h3>
                <p className="text-slate-500 text-xs">Your order has been placed successfully.</p>
              </div>

              {/* Order Invoice stats card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-3 font-semibold text-xs leading-relaxed shadow-3xs">
                
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-emerald-700 font-extrabold">INVOICE: #{latestOrder.id}</span>
                  <span className="font-mono text-[10px] text-slate-400">{new Date(latestOrder.date).toLocaleString()}</span>
                </div>

                <div className="flex flex-col gap-1.5 font-normal text-slate-650 tracking-wide text-[11px]">
                  <p><strong>Customer Name:</strong> {latestOrder.customerName}</p>
                  <p><strong>Phone Code:</strong> {latestOrder.phone}</p>
                  <p><strong>Delivery Address:</strong> {latestOrder.address}</p>
                  <p><strong>Method Used:</strong> {latestOrder.paymentMethod} ({latestOrder.paymentStatus})</p>
                </div>

                {/* Courier automated tracker assignment info */}
                {latestOrder.courier ? (
                  <div className="bg-emerald-55/10 text-emerald-800 border border-emerald-250/20 p-3 rounded-lg flex flex-col gap-1 text-[11px]">
                    <div className="flex justify-between items-center font-bold">
                      <span className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" />
                        <span>API Courier Assigned:</span>
                      </span>
                      <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-sm text-[9px] uppercase font-mono">{latestOrder.courier.api}</span>
                    </div>
                    <p className="mt-1"><strong>Tracking ID Assigned:</strong> <span className="font-mono bg-white border px-1.5 py-0.5 rounded text-xs font-bold text-slate-800">{latestOrder.courier.trackingId}</span></p>
                    <p className="text-[10px] text-slate-400 italic">Dispatched status auto synced inside courier dashboard logs.</p>
                  </div>
                ) : (
                  <div className="bg-amber-55/10 text-amber-850 p-3 rounded-lg flex flex-col gap-1 text-[11px] border border-amber-250/25">
                    <div className="flex items-center gap-1 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Security Watch warning flagged</span>
                    </div>
                    <p className="leading-relaxed">This purchase holds special security risk warnings. Admin review determines manual dispatch of tracking parameters.</p>
                  </div>
                )}

                {/* AI Score panel */}
                <div className="bg-white border p-3 rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-slate-500" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wide">Placer Risk grading</span>
                      <span className="font-bold text-slate-800 tracking-wide">{latestOrder.riskLevel} ALERT STATUS</span>
                    </div>
                  </div>
                  <div className={`font-mono font-extrabold text-base px-2.5 py-1 rounded-md text-white ${
                    latestOrder.riskLevel === "LOW" ? "bg-emerald-600" : latestOrder.riskLevel === "MEDIUM" ? "bg-amber-500" : "bg-red-600"
                  }`}>
                    {latestOrder.riskScore}%
                  </div>
                </div>

                <div className="flex justify-between items-baseline font-extrabold mt-2 text-sm border-t border-slate-200/55 pt-2">
                  <span>Grand Total Paid:</span>
                  <span className="font-mono text-emerald-600 text-lg">৳{latestOrder.total.toLocaleString()}</span>
                </div>

              </div>

              {/* Continue button */}
              <button
                onClick={() => { setStep("cart"); onClose(); }}
                className="w-full bg-slate-900 border hover:bg-black text-white py-3.5 rounded-xl font-bold text-xs uppercase cursor-pointer text-center tracking-wide"
              >
                Close & Return Shopfront
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
