import React from 'react';
import { Star } from 'lucide-react';

const FilterSidebar = ({
  categories = [],
  selectedCategories = [],
  onToggleCategory,
  priceRange = { min: '', max: '' },
  onPriceChange,
  onApplyPrice,
  minRating = 0,
  onRatingChange,
  onClearAll,
}) => {
  return (
    <aside className="w-full lg:w-64 bg-white rounded-3xl border border-slate-200/80 p-5 space-y-6 shrink-0 h-fit">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-black text-slate-900 text-sm tracking-tight">Filters</h3>
        <button
          onClick={onClearAll}
          className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
        >
          Clear all
        </button>
      </div>

      {/* 1. Category Checkboxes */}
      <div className="space-y-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Category
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
          {categories.map((cat) => {
            const isChecked = selectedCategories.includes(cat._id);
            return (
              <label
                key={cat._id}
                className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer hover:text-slate-900"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleCategory(cat._id)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span>{cat.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Price Range */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Price (₹)
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => onPriceChange({ ...priceRange, min: e.target.value })}
            className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500 text-slate-800"
          />
          <span className="text-xs text-slate-400 font-bold">to</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => onPriceChange({ ...priceRange, max: e.target.value })}
            className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500 text-slate-800"
          />
        </div>
      </div>

      {/* 3. Customer Rating */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Customer Rating
        </div>
        <div className="space-y-2 text-xs font-medium text-slate-700">
          <label className="flex items-center gap-2.5 cursor-pointer hover:text-slate-900">
            <input
              type="radio"
              name="rating"
              checked={minRating === 4}
              onChange={() => onRatingChange(4)}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <span className="flex items-center gap-1">
              4 stars & up
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer hover:text-slate-900">
            <input
              type="radio"
              name="rating"
              checked={minRating === 3}
              onChange={() => onRatingChange(3)}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <span className="flex items-center gap-1">
              3 stars & up
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer hover:text-slate-900">
            <input
              type="radio"
              name="rating"
              checked={minRating === 0}
              onChange={() => onRatingChange(0)}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <span>Any rating</span>
          </label>
        </div>
      </div>

      {/* Apply Filters Button */}
      <button
        onClick={onApplyPrice}
        className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
      >
        Apply filters
      </button>
    </aside>
  );
};

export default FilterSidebar;

