import React, { useState } from "react";
import { X, BookOpen, Clock, Tag, ArrowRight, ArrowLeft } from "lucide-react";
import { BlogPost, Product } from "../types";

interface BlogCenterProps {
  posts: BlogPost[];
  onSelectProduct: (product: Product) => void;
  products: Product[];
  onClose: () => void;
}

export default function BlogCenter({
  posts,
  onSelectProduct,
  products,
  onClose
}: BlogCenterProps) {
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  // Helper matching tag slug to actual product item in catalog
  const handleProductShortcutClick = (tagSlug: string) => {
    const matched = products.find(p => p.tags.some(t => t.toLowerCase() === tagSlug.toLowerCase()) || p.name.toLowerCase().includes(tagSlug.toLowerCase()));
    if (matched) {
      onSelectProduct(matched);
      setActivePost(null);
    } else {
      alert(`Our central warehouse has sold out of '${tagSlug}' items momentarily. Browse standard collections in the storefront grid!`);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800" id="blog-center-root">
      
      {/* 1. TOP COVER BANNERS */}
      <header className="bg-slate-900 text-white py-14 px-6 relative overflow-hidden" id="blog-header-hero">
        <div className="absolute inset-0 opacity-15 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800')" }} />
        <div className="max-w-4xl mx-auto flex flex-col gap-3 relative text-center">
          <button 
            onClick={onClose}
            className="self-center bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-all mb-4 cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Close Blog and Return Storefront</span>
          </button>
          
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">Bengali Organic Lifestyle (Our Blog)</h2>
          <p className="text-slate-300 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
            Read expert insights on pure unbranded honey collection, high-grade organic ghee testing benchmarks, and local artisan traditional Jamdani saree care guides.
          </p>
        </div>
      </header>

      {/* 2. BODY CONTENT SECTION */}
      <section className="max-w-6xl mx-auto py-12 px-6" id="blog-posts-grid-sc">
        
        {posts.length === 0 ? (
          <div className="text-center py-16 flex flex-col gap-3">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto animate-pulse" />
            <p className="text-slate-500 text-sm italic">No blog posts have been compiled on site yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              return (
                <article 
                  key={post.id}
                  className="bg-white border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col h-full text-left cursor-pointer"
                  onClick={() => setActivePost(post)}
                >
                  <img 
                    src={post.coverImage || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400"} 
                    alt={post.title}
                    className="h-44 w-full object-cover border-b"
                  />
                  <div className="p-5 flex flex-col gap-3 flex-grow">
                    <div className="flex gap-2 text-[10px] font-bold text-slate-400 uppercase font-mono items-center">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-2 hover:text-emerald-600 transition-all">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {post.content}
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                        {post.tags.map(tag => (
                          <span 
                            key={tag}
                            className="bg-slate-100 text-[9px] font-bold text-slate-600 px-2 py-0.5 rounded-sm uppercase tracking-wide font-mono"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-extrabold hover:underline uppercase tracking-wide border-t pt-3 mt-1.5">
                      <span>Read Full Insight</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        )}

      </section>

      {/* ================= DETAILED POST MODAL VIEWER ================= */}
      {activePost && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[120] p-4 text-left" id="blog-detailed-modal">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col p-6 md:p-8 text-xs text-slate-800 shadow-2xl relative animate-scale-up">
            
            <button 
              onClick={() => setActivePost(null)}
              className="absolute right-5 top-5 p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Content cover image */}
            <img 
              src={activePost.coverImage} 
              alt={activePost.title} 
              className="w-full h-56 object-cover rounded-2xl border mb-5 shadow-xs"
            />

            <div className="flex gap-2 text-[10px] font-bold text-slate-400 uppercase font-mono items-center mb-2">
              <Clock className="w-3.5 h-3.5 text-slate-300" />
              <span>Published on: {new Date(activePost.publishedAt).toLocaleString()}</span>
              <span>• Author: Merchant Admin</span>
            </div>

            <h2 className="font-extrabold text-slate-900 text-xl md:text-2xl mt-1 tracking-tight leading-snug">
              {activePost.title}
            </h2>

            {/* Reading description */}
            <div className="text-slate-650 text-xs md:text-sm leading-relaxed whitespace-pre-line py-5 border-y border-slate-100 my-4 text-justify">
              {activePost.content}
            </div>

            {/* Coupons campaign dynamic highlight inside post */}
            <div className="bg-amber-50 border border-amber-250/30 p-4 rounded-xl flex flex-col gap-2 shadow-2xs mb-5">
              <div className="flex items-center gap-1.5 font-bold text-amber-850">
                <Tag className="w-4 h-4 text-amber-600 animate-bounce" />
                <span>Special Promo Discount Code for readers!</span>
              </div>
              <p className="text-xs text-amber-800 leading-normal">
                Want to buy our certified premium items now? Simply copy coupon voucher and apply at Checkout: <strong className="font-mono bg-white border border-amber-200 text-[#0f172a] text-xs px-2 py-0.5 rounded ml-1 tracking-wider uppercase font-bold">KHALIS100</strong> or <strong className="font-mono bg-white border border-amber-200 text-[#0f172a] text-xs px-2 py-0.5 rounded tracking-wider uppercase font-bold">EIDMUBARAK</strong> for extra discounts!
              </p>
            </div>

            {/* Connected Tag conversion triggers shortcuts */}
            {activePost.tags && activePost.tags.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Discussed items in stock:</span>
                <div className="flex flex-wrap gap-2">
                  {activePost.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleProductShortcutClick(tag)}
                      className="bg-emerald-55/10 hover:bg-emerald-55/20 border border-emerald-500/20 text-emerald-800 text-[10.5px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer select-none"
                    >
                      <span>Show '{tag}' models</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={() => setActivePost(null)}
              className="mt-6 w-full bg-slate-900 hover:bg-black text-white text-xs font-bold py-2.5 rounded-xl uppercase text-center border cursor-pointer select-none"
            >
              Back to blog overview
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
