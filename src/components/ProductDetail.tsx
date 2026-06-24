import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Minus, 
  Plus, 
  Box, 
  MessageCircle, 
  CheckCircle,
  Star
} from "lucide-react";
import { Product, ProductReview, QuestionAnswer, AppSettings } from "../types";

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, options?: any) => void;
  onCheckoutDirectly: (product: Product, quantity: number, options?: any) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  relatedProducts?: Product[]; // Pass related products
  settings?: AppSettings;
}

export default function ProductDetail({
  product,
  onClose,
  onAddToCart,
  onCheckoutDirectly,
  wishlist,
  onToggleWishlist,
  relatedProducts = [],
  settings
}: ProductDetailProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [qaList, setQaList] = useState<QuestionAnswer[]>([]);
  const [qaText, setQaText] = useState("");

  useEffect(() => {
    fetchReviewsAndQA();
    setActiveImageIdx(0);
    setQuantity(1);
    setSelectedVariant(product.variants && product.variants.length > 0 ? product.variants[0] : null);
  }, [product]);

  const fetchReviewsAndQA = async () => {
    try {
      const resRev = await fetch(`/api/reviews/${product.id}`);
      const dataRev = await resRev.json();
      setReviews(dataRev);

      const resQA = await fetch(`/api/questions/${product.id}`);
      const dataQA = await resQA.json();
      setQaList(dataQA);
    } catch (e) {
      console.error("Failed to read reviews database from server", e);
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="fixed inset-0 bg-slate-50 z-[120] flex flex-col overflow-hidden animate-fade-in sm:items-center">
      <div className="w-full h-full max-w-md bg-white flex flex-col relative sm:shadow-2xl">
        
        {/* Top Navbar */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 shrink-0 sticky top-0 z-20">
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-sm font-semibold text-slate-800 line-clamp-1 flex-1 mx-3">{product.name}</h1>
          <button className="p-1 hover:bg-slate-100 rounded-full transition-colors relative cursor-pointer" onClick={onClose}>
            <ShoppingCart className="w-5 h-5 text-slate-700" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white"></span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-[72px] bg-slate-100 hide-scrollbar">
          {/* Main Image */}
          <div className="w-full bg-white relative aspect-square">
            <img 
              src={product.gallery && product.gallery[activeImageIdx] ? product.gallery[activeImageIdx] : "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600"} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-white px-4 py-3 pb-4 mb-2">
            {/* Title & Actions */}
            <div className="flex gap-2 items-start justify-between">
              <h2 className="text-base font-semibold text-slate-800 leading-snug">{product.name}</h2>
            </div>
            
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2 text-xs text-amber-500">
                <div className="flex items-center">
                  <span className="font-bold mr-1 text-slate-800">{product.rating}</span>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                  ))}
                </div>
                <span className="text-amber-600 font-medium">{reviews.length} Reviews</span>
                <span className="text-amber-600 font-medium">{qaList.length} Questions answered</span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => onToggleWishlist(product.id)}
                  className="text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}`} />
                </button>
                <button className="text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="mt-2.5 flex items-end gap-2">
              <span className="text-xl font-bold font-mono tracking-tight text-teal-500">
                ৳{(selectedVariant?.price ? (product.salePrice || product.price) + selectedVariant.price : (product.salePrice || product.price)).toLocaleString()}
              </span>
              {product.salePrice && (
                <span className="text-sm text-slate-400 line-through font-mono">
                  ৳{product.price.toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-2 text-xs font-medium">
              <span className="text-emerald-500">{(selectedVariant ? selectedVariant.stock : product.stock) > 0 ? "In Stock" : "Out of Stock"}</span>
              <span className="text-slate-300">|</span>
              <span className="text-pink-500 flex items-center gap-0.5"><span className="text-[10px]">✨</span> New</span>
            </div>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="flex flex-col gap-2 mt-4">
                <span className="text-slate-700 font-medium text-sm">Select Variant</span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariant(v)}
                      className={`flex flex-col gap-1 p-2 rounded-xl border text-left transition-all ${selectedVariant?.id === v.id ? 'border-teal-500 bg-teal-50/50 ring-1 ring-teal-500/30' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <div className="flex items-center gap-2">
                        {v.image && <img src={v.image} alt="variant" className="w-8 h-8 rounded object-cover shadow-sm border border-slate-100" />}
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800">
                            {[v.color, v.size, v.ram, v.storage].filter(Boolean).join(" - ") || `Variant ${idx + 1}`}
                          </span>
                          {v.price ? <span className="text-[10px] text-teal-600 font-medium">+৳{v.price}</span> : null}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mt-4">
              <span className="text-slate-700 font-medium text-sm">Quantity</span>
              <div className="flex items-center rounded-full border border-slate-200">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-l-full cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-semibold text-sm">{quantity}</span>
                <button 
                   onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                  className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-r-full cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Delivery Options */}
          <div className="bg-white px-4 py-4 mb-2">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Delivery Options</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <Box className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-slate-800">Inside Dhaka</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Delivery Charge: ৳{product.deliveryInsideDhaka !== undefined ? product.deliveryInsideDhaka : 60} 
                    {product.deliveryTime ? ` (${product.deliveryTime})` : " (1-2 Days)"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Box className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-slate-800">Outside Dhaka</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Delivery Charge: ৳{product.deliveryOutsideDhaka !== undefined ? product.deliveryOutsideDhaka : 120} 
                    {product.deliveryTime ? ` (${product.deliveryTime})` : " (3-5 Days)"}
                  </p>
                </div>
              </div>
              {product.deliveryTime && (
                <div className="flex items-start gap-3">
                  <Box className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-slate-800">Estimated Delivery Time</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{product.deliveryTime}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white px-4 py-4 mb-2">
            <h3 className="text-base font-bold text-slate-800 mb-3">Description</h3>
            <div className="text-sm text-slate-600 leading-relaxed font-medium">
              <p className="mb-2">What It Is</p>
              <p className="whitespace-pre-line text-slate-500">{product.description || "Detailed description not appended for this item. Contact support for more specific product specifications and usages."}</p>
            </div>
            {/* Specification snippet */}
            <div className="mt-4 pt-4 border-t border-slate-100">
               <h3 className="text-base font-bold text-slate-800 mb-3">Specification</h3>
               <div className="flex flex-col gap-1 text-sm text-slate-600">
                 {product.specifications && product.specifications.length > 0 ? (
                   product.specifications.map((s, idx) => (
                     <p key={idx}>{s.key}: {s.value}</p>
                   ))
                 ) : (
                    <>
                      <p>Size: Standard</p>
                      <p>Made In: BD</p>
                    </>
                 )}
               </div>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="bg-white px-4 py-4 mb-2">
            <h3 className="text-base font-bold text-slate-800 mb-4">Customer reviews</h3>
            
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex items-end gap-2 mb-1">
                 <span className="text-3xl font-extrabold text-slate-800 leading-none">{product.rating}</span>
                 <div className="flex items-center text-slate-200 fill-slate-200 pb-1">
                   {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : ''}`} />
                   ))}
                 </div>
              </div>
              <p className="text-xs text-slate-500 mb-4">of {reviews.length} reviews</p>
              
              {/* Review Bars mock */}
              {[5,4,3,2,1].map(r => (
                <div key={r} className="flex items-center gap-2 mb-1.5 text-xs text-slate-500">
                  <span className="w-2">{r}</span>
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <div className="h-1.5 bg-slate-200 rounded-full flex-1 overflow-hidden">
                     <div className={`h-full bg-amber-400 rounded-full`} style={{ width: reviews.length > 0 ? (r === 5 ? '80%' : '5%') : '0%' }}></div>
                  </div>
                  <span className="w-6 text-right">({reviews.filter(x => x.rating === r).length})</span>
                </div>
              ))}

              <div className="bg-white mt-4 p-3 rounded-lg border border-slate-100 flex flex-col gap-2 relative overflow-hidden">
                 <div className="flex items-center gap-2">
                   <div className="bg-emerald-500 rounded-full p-0.5"><CheckCircle className="w-3.5 h-3.5 text-white" /></div>
                   <span className="font-medium text-slate-800 text-sm">{settings?.siteName || "Packly"} Assured <span className="text-emerald-500 font-bold">100% Authentic!</span></span>
                 </div>
                 <p className="text-xs text-slate-500 leading-relaxed">Our products are ensured directly from brands or authorized distributors. They're stored and shipped directly from our climate-controlled hubs.</p>
              </div>
            </div>
            
            {/* Reviews List */}
            <div className="mt-4 flex flex-col gap-4">
               {reviews.slice(0, 3).map((r, idx) => (
                 <div key={idx} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mb-1">by {r.customerName} - {r.createdAt}</p>
                    <p className="text-sm text-slate-700">{r.comment}</p>
                 </div>
               ))}
            </div>
          </div>

          {/* Q&A */}
          <div className="bg-white px-4 py-4 mb-2">
            <h3 className="text-base font-bold text-slate-800 mb-4">Questions About this Product ({qaList.length})</h3>
            <div className="border border-slate-200 rounded-lg p-3">
               <textarea 
                 value={qaText}
                 onChange={e => setQaText(e.target.value)}
                 placeholder="Enter your questions here"
                 className="w-full text-sm text-slate-600 outline-none resize-none h-16"
               />
            </div>
            <button className="w-full mt-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 rounded-md text-sm transition-colors cursor-pointer">
              Ask Question
            </button>
            <div className="mt-4 pt-4 border-t border-slate-100">
               {qaList.length === 0 ? (
                 <p className="text-slate-600 text-sm">No question found</p>
               ) : (
                 <div className="flex flex-col gap-3">
                   {qaList.map((qa, i) => (
                     <div key={i} className="flex flex-col gap-1">
                       <p className="text-sm font-semibold text-slate-800"><span className="text-emerald-600">Q:</span> {qa.question}</p>
                       {qa.answer && <p className="text-sm text-slate-600 ml-5"><span className="text-slate-400">A:</span> {qa.answer}</p>}
                     </div>
                   ))}
                 </div>
               )}
            </div>
          </div>

          {/* Related Products row */}
          {relatedProducts.length > 0 && (
             <div className="bg-white px-4 py-4 pb-8">
               <h3 className="text-base font-semibold text-slate-800 mb-4">Customers Also Viewed</h3>
               <div className="flex gap-3 overflow-x-auto pb-4 snap-x pr-4">
                 {relatedProducts.map(p => (
                   <div key={p.id} onClick={() => {}} className="min-w-[140px] w-[140px] border border-slate-100 rounded-lg overflow-hidden snap-start flex-shrink-0 flex flex-col cursor-pointer">
                     <div className="h-32 bg-slate-50 w-full p-2 relative">
                        <img src={p.gallery?.[0] || 'https://via.placeholder.com/150'} className="w-full h-full object-cover rounded mix-blend-multiply" alt={p.name} />
                        {p.discountPercent && <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1 rounded">-{p.discountPercent}%</div>}
                     </div>
                     <div className="p-2 pt-1 flex flex-col flex-1">
                        <h4 className="text-xs font-medium text-slate-800 line-clamp-2 leading-tight h-8">{p.name}</h4>
                        <p className="text-sm font-bold text-teal-500 mt-1">৳{p.salePrice || p.price}</p>
                        <div className="flex items-center gap-1 mt-auto">
                          <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                          <span className="text-[10px] text-slate-500">{p.rating} (0)</span>
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          )}

        </div>

        {/* BOTTOM FIXED CTA BAR */}
        <div className="absolute bottom-0 left-0 right-0 h-[72px] bg-white border-t border-slate-100 px-4 py-3 flex items-center gap-3 z-30">
          <button 
            disabled={isOutOfStock}
            onClick={() => onAddToCart(product, quantity, { variant: selectedVariant })}
            className="flex-1 bg-white border border-teal-500 text-teal-600 font-medium py-2.5 rounded text-sm hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:border-slate-300 disabled:text-slate-400 cursor-pointer"
          >
            Add to Cart
          </button>
          <button 
            disabled={isOutOfStock}
            onClick={() => onCheckoutDirectly(product, quantity, { variant: selectedVariant })}
            className="flex-1 bg-teal-500 text-white font-medium py-2.5 rounded text-sm hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:bg-slate-300 cursor-pointer"
          >
            Buy Now
          </button>
        </div>

      </div>
    </div>
  );
}
