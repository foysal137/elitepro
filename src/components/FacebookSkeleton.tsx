import React from "react";

interface SkeletonProps {
  layout?: "main" | "categories" | "favorites" | "profile" | "feed";
}

export default function FacebookSkeleton({ layout = "main" }: SkeletonProps) {
  // Common Shimmer Line helper
  const ShimmerLine = ({ className = "h-4 bg-slate-200 rounded" }: { className?: string }) => (
    <div className={`animate-pulse ${className}`} style={{ animationDuration: "1.2s" }} />
  );

  const renderHomeSkeleton = () => (
    <div className="flex-grow flex flex-col bg-slate-50 w-full min-h-screen">
      {/* Search Bar Skeleton */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="h-10 bg-slate-100 rounded-full animate-pulse flex items-center px-4 gap-2">
          <div className="w-4 h-4 rounded-full bg-slate-200" />
          <div className="w-32 h-3 bg-slate-200 rounded" />
        </div>
      </div>

      {/* Main categories top row skeleton */}
      <div className="px-4 py-3 bg-white flex gap-4 overflow-x-auto scrollbar-none">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="w-11 h-11 rounded-full bg-slate-100 animate-pulse border border-slate-50" />
            <div className="w-12 h-2.5 bg-slate-100 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Hero Banner Shimmer Slider */}
      <div className="px-4 py-3 bg-white">
        <div className="w-full h-40 rounded-2xl bg-slate-100 animate-pulse relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>
      </div>

      {/* Grid of Flash sales */}
      <div className="px-4 py-4 bg-white mt-1 border-t border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="w-28 h-4 bg-slate-200 rounded animate-pulse" />
          <div className="w-16 h-3.5 bg-slate-100 rounded animate-pulse" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-100 p-2.5 flex flex-col gap-3">
              <div className="w-full aspect-square bg-slate-100 rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="w-4/5 h-3 bg-slate-200 rounded animate-pulse" />
                <div className="w-1/2 h-3.5 bg-slate-200 rounded animate-pulse" />
              </div>
              <div className="flex justify-between items-center pt-1.5 border-t border-slate-50">
                <div className="w-10 h-3 bg-slate-100 rounded animate-pulse" />
                <div className="w-8 h-8 rounded-full bg-[#e6faf6] flex items-center justify-center animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCategoriesSkeleton = () => (
    <div className="flex-grow flex bg-white min-h-screen">
      {/* Category Sidebar */}
      <div className="w-[84px] bg-slate-50 border-r border-gray-100 flex flex-col gap-3 py-4 shrink-0">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col items-center gap-1 px-1">
            <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse mb-1" />
            <div className="w-12 h-2 bg-slate-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
      {/* Grid right layout */}
      <div className="flex-1 p-4 bg-white flex flex-col gap-4">
        <div className="w-32 h-4 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className="flex flex-col items-center justify-center gap-2 border border-slate-50 p-2 rounded-xl">
              <div className="w-14 h-14 bg-slate-100 rounded-xl animate-pulse" />
              <div className="w-12 h-2 bg-slate-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFavoritesSkeleton = () => (
    <div className="flex-grow flex flex-col bg-slate-50 p-4 min-h-screen">
      <div className="w-28 h-5 bg-slate-200 rounded animate-pulse mb-6" />
      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-3 flex gap-3 border border-gray-100 animate-pulse relative">
            <div className="w-16 h-16 bg-slate-100 rounded-lg shrink-0" />
            <div className="flex-grow flex flex-col justify-between py-1">
              <div className="space-y-1.5">
                <div className="w-3/4 h-3 bg-slate-200 rounded" />
                <div className="w-1/4 h-2.5 bg-slate-100 rounded" />
              </div>
              <div className="w-16 h-4.5 bg-slate-200 rounded" />
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 absolute top-2 right-2 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfileSkeleton = () => (
    <div className="flex-grow flex flex-col bg-white min-h-screen">
      <div className="px-6 pt-6 pb-5 border-b border-gray-100 flex flex-col">
        <div className="w-12 h-12 bg-slate-100 rounded-full animate-pulse mb-3" />
        <div className="w-24 h-4 bg-slate-200 rounded animate-pulse" />
      </div>

      <div className="px-6 pt-6 pb-2">
        <div className="w-20 h-3 bg-slate-100 rounded animate-pulse mb-5" />
      </div>

      <div className="flex flex-col px-6 gap-6">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="flex items-center gap-4 py-0.5">
            <div className="w-6 h-6 bg-slate-100 rounded animate-pulse shrink-0" />
            <div className="w-32 h-3.5 bg-slate-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderFeedSkeleton = () => (
    <div className="grid grid-cols-2 gap-2 w-full">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white rounded-lg p-2.5 flex flex-col shadow-sm border border-gray-100">
          <div className="h-36 bg-gray-50 rounded mb-2 animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-100 rounded w-4/5 animate-pulse" />
            <div className="h-3 bg-gray-100 rounded w-2/5 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {layout === "main" && renderHomeSkeleton()}
      {layout === "categories" && renderCategoriesSkeleton()}
      {layout === "favorites" && renderFavoritesSkeleton()}
      {layout === "profile" && renderProfileSkeleton()}
      {layout === "feed" && renderFeedSkeleton()}
    </>
  );
}
