import React from 'react';
import { X } from 'lucide-react';

const ActiveFilterChips = ({
  categories = [],
  selectedCategories = [],
  minRating = 0,
  priceRange = { min: '', max: '' },
  onRemoveFilter,
}) => {
  const hasActiveFilters =
    selectedCategories.length > 0 || minRating > 0 || priceRange.min !== '' || priceRange.max !== '';

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs py-2">
      <span className="font-bold text-slate-500">Active:</span>

      {/* Selected Categories */}
      {selectedCategories.map((catId) => {
        const cat = categories.find((c) => c._id === catId);
        return (
          <span
            key={catId}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold"
          >
            <span>{cat ? cat.name : 'Category'}</span>
            <button
              onClick={() => onRemoveFilter('category', catId)}
              className="hover:text-emerald-950 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        );
      })}

      {/* Rating Filter Chip */}
      {minRating > 0 && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
          <span>{minRating} stars & up</span>
          <button
            onClick={() => onRemoveFilter('rating')}
            className="hover:text-amber-950 cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Price Range Chip */}
      {(priceRange.min !== '' || priceRange.max !== '') && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 font-semibold">
          <span>
            ₹{priceRange.min || 0} - ₹{priceRange.max || 'Any'}
          </span>
          <button
            onClick={() => onRemoveFilter('price')}
            className="hover:text-slate-950 cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}
    </div>
  );
};

export default ActiveFilterChips;

