import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3 animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-44 bg-slate-200 rounded-xl" />
      
      {/* Category & Title Skeleton */}
      <div className="space-y-2">
        <div className="w-16 h-3 bg-slate-200 rounded" />
        <div className="w-3/4 h-4 bg-slate-200 rounded" />
        <div className="w-24 h-3 bg-slate-200 rounded" />
      </div>

      {/* Price & Button Skeleton */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="w-20 h-5 bg-slate-200 rounded" />
        <div className="w-24 h-8 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
};

export default SkeletonCard;

