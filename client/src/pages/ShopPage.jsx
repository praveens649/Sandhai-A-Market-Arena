import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useProducts } from '../_hook/useProducts';

import FilterSidebar from '../_components/FilterSidebar';
import ActiveFilterChips from '../_components/ActiveFilterChips';
import KadaiProductCard from '../_components/KadaiProductCard';
import SkeletonCard from '../_components/SkeletonCard';
import ErrorState from '../_components/ErrorState';

import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';

const ShopPage = () => {
  const navigate = useNavigate();
  const {
    addToCart,
    updateCartQuantity,
    getItemQuantityInCart,
    wishlist,
    toggleWishlist,
  } = useStore();

  const {
    categories,
    loading,
    error,
    retry,
    filteredProducts,
    paginatedProducts,
    totalPages,
    currentPage,
    setCurrentPage,
    selectedCategories,
    toggleCategory,
    priceRange,
    setPriceRange,
    applyPriceFilter,
    minRating,
    setMinRating,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    clearAllFilters,
    removeFilter,
    setProducts,
    products,
  } = useProducts();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Hero Banner (Page 4: "Shop smarter, save more") */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 text-white p-8 sm:p-10 shadow-xl shadow-emerald-950/20">
        <div className="relative z-10 max-w-xl space-y-3">
          <span className="text-[11px] font-black uppercase tracking-widest text-emerald-200">
            THIS WEEK ONLY
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Shop smarter, save more
          </h1>
          <p className="text-emerald-100/90 text-sm leading-relaxed">
            Use code <strong className="text-amber-300 underline font-mono">SAVE10</strong> for 10% off your cart. Free shipping on orders of ₹500 or more.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                const deals = products.filter((p) => p.discountPercentage > 0);
                if (deals.length > 0) setProducts([...deals]);
              }}
              className="px-6 py-2.5 rounded-xl bg-white text-emerald-800 font-black text-xs hover:bg-emerald-50 shadow-md transition-all cursor-pointer"
            >
              Shop deals
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar & Mobile Filter Trigger */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products, brands and more..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm shadow-xs focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
          />
        </div>
        {/* Mobile Filters Trigger */}
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="lg:hidden px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Main 2-Column Product List Area (Page 4) */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Filter Sidebar (Desktop) */}
        <div className="hidden lg:block">
          <FilterSidebar
            categories={categories}
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            onApplyPrice={applyPriceFilter}
            minRating={minRating}
            onRatingChange={setMinRating}
            onClearAll={clearAllFilters}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden">
            <FilterSidebar
              categories={categories}
              selectedCategories={selectedCategories}
              onToggleCategory={toggleCategory}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              onApplyPrice={() => {
                applyPriceFilter();
                setMobileFilterOpen(false);
              }}
              minRating={minRating}
              onRatingChange={setMinRating}
              onClearAll={clearAllFilters}
            />
          </div>
        )}

        {/* Right Column: Products Grid & Controls (Page 4) */}
        <div className="flex-1 space-y-4">
          {/* Header bar: "All products", Showing count & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">All products</h2>
              <span className="text-xs text-slate-400 font-medium">
                Showing {filteredProducts.length} products
              </span>
            </div>

            {/* Sort Dropdown (Page 4) */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-bold outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Rating: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips (Page 4) */}
          <ActiveFilterChips
            categories={categories}
            selectedCategories={selectedCategories}
            minRating={minRating}
            priceRange={priceRange}
            onRemoveFilter={removeFilter}
          />

          {/* Loading Skeletons State (Page 3) */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            /* Error State (Page 3) */
            <ErrorState message={error} onRetry={retry} />
          ) : paginatedProducts.length > 0 ? (
            /* Product Grid (Page 4: 4 columns desktop, 2 mobile) */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedProducts.map((prod) => (
                <KadaiProductCard
                  key={prod._id}
                  product={prod}
                  quantityInCart={getItemQuantityInCart(prod._id)}
                  isWishlisted={wishlist.some((w) => (w._id || w) === prod._id)}
                  onAddToCart={addToCart}
                  onUpdateQuantity={updateCartQuantity}
                  onToggleWishlist={toggleWishlist}
                  onSelectProduct={(p) => navigate(`/app/product/${p._id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-sm">No products match your filters</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">Try clearing one or more active filters.</p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination: ‹ 1 2 3 › (Page 4) */}
          {totalPages > 1 && (
            <div className="pt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-9 h-9 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    currentPage === idx + 1
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;

