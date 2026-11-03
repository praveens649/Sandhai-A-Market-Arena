import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchProducts, fetchCategories } from '../_action/productActions';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State (as specified in PDF Page 4)
  const [selectedCategories, setSelectedCategories] = useState([]); // array of selected category IDs
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [appliedPriceRange, setAppliedPriceRange] = useState({ min: '', max: '' });
  const [minRating, setMinRating] = useState(0); // 0 = Any, 3 = 3 stars & up, 4 = 4 stars & up
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-asc', 'price-desc', 'rating-desc'

  // Pagination (Page 4: 8 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetchProducts({ limit: 100 }),
        fetchCategories(),
      ]);

      // Enrich product objects with sample ratings & discount percentages if not present
      // to match Kadai design token expectations (Page 3 & 4)
      const enriched = (prodRes.products || []).map((p, idx) => {
        const dummyRatings = [4.5, 4.7, 4.3, 4.6, 4.8, 4.4, 4.2, 4.5, 4.1, 4.9];
        const dummyReviews = [128, 86, 212, 304, 59, 97, 410, 73, 115, 64];
        const dummyDiscounts = [20, 0, 10, 0, 0, 20, 0, 0, 15, 0];

        const rating = p.rating || dummyRatings[idx % dummyRatings.length];
        const reviewCount = p.reviewCount || dummyReviews[idx % dummyReviews.length];
        const discountPercentage = p.discountPercentage !== undefined ? p.discountPercentage : dummyDiscounts[idx % dummyDiscounts.length];
        const originalPrice = discountPercentage > 0 ? Math.round(p.price / (1 - discountPercentage / 100)) : p.price;

        return {
          ...p,
          rating,
          reviewCount,
          discountPercentage,
          originalPrice,
        };
      });

      setProducts(enriched);
      setCategories(catRes.categories || []);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err.message || 'Could not load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Toggle Category selection
  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
    setCurrentPage(1);
  };

  const applyPriceFilter = () => {
    setAppliedPriceRange({ ...priceRange });
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: '', max: '' });
    setAppliedPriceRange({ min: '', max: '' });
    setMinRating(0);
    setSearchQuery('');
    setSortBy('featured');
    setCurrentPage(1);
  };

  const removeFilter = (filterType, value) => {
    if (filterType === 'category') {
      setSelectedCategories((prev) => prev.filter((id) => id !== value));
    } else if (filterType === 'rating') {
      setMinRating(0);
    } else if (filterType === 'price') {
      setPriceRange({ min: '', max: '' });
      setAppliedPriceRange({ min: '', max: '' });
    }
    setCurrentPage(1);
  };

  // Filter & Sort Logic adhering to Kadai Store business rules
  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category Filter
        if (selectedCategories.length > 0) {
          const prodCatId = p.category?._id || p.category;
          if (!selectedCategories.includes(prodCatId)) return false;
        }

        // Price Filter
        const min = appliedPriceRange.min !== '' ? Number(appliedPriceRange.min) : 0;
        const max = appliedPriceRange.max !== '' ? Number(appliedPriceRange.max) : Infinity;
        if (p.price < min || p.price > max) return false;

        // Customer Rating Filter
        if (minRating > 0 && (p.rating || 0) < minRating) return false;

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          const matchCat = p.category?.name?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
        return 0; // 'featured' keeps original ordering
      });
  }, [products, selectedCategories, appliedPriceRange, minRating, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(start, start + itemsPerPage);
  }, [filteredAndSortedProducts, currentPage, itemsPerPage]);

  return {
    products,
    categories,
    loading,
    error,
    retry: loadData,
    filteredProducts: filteredAndSortedProducts,
    paginatedProducts,
    totalPages,
    currentPage,
    setCurrentPage,
    // Filters
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
  };
};

