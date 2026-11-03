import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import {
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Plus,
  Minus,
  ShoppingCart,
  Zap,
  ArrowLeft,
} from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, loadingProducts } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const product = products.find((p) => p._id === id);
  const relatedProducts = products.filter((p) => p._id !== id);

  if (loadingProducts) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span className="text-sm font-semibold text-slate-500">Loading product details...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-slate-200/80 max-w-lg mx-auto">
        <h2 className="text-2xl font-black text-slate-900">Product not found</h2>
        <p className="text-xs text-slate-500">The product you are looking for does not exist or has been removed.</p>
        <Link
          to="/app/shop"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : [
        product.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600',
        'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600',
        'https://images.unsplash.com/photo-1584473457406-6240486418e9?w=600',
        'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600',
      ];

  const savings = product.discountPercentage > 0
    ? Math.round(product.originalPrice - product.price)
    : 0;

  const handleBuyNow = async () => {
    await addToCart(product._id, quantity);
    navigate('/app/cart');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Breadcrumb Navigation (Page 5) */}
      <div className="text-xs text-slate-400 font-medium flex items-center gap-2">
        <Link to="/app/shop" className="hover:text-emerald-700 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-600 font-semibold">{product.category?.name || 'Produce'}</span>
        <span>/</span>
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              {product.discountPercentage > 0 && (
                <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-orange-600 text-white font-black text-xs">
                  -{product.discountPercentage}%
                </span>
              )}
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-black/60 text-[10px] text-white font-semibold">
                Image {selectedImageIndex + 1} of {images.length}
              </span>
            </div>

            {/* Thumbnail Row */}
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info & Purchasing */}
          <div className="space-y-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  {product.category?.name || 'Produce'}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {product.stock > 0 ? (
                    <span className="text-emerald-700">In stock · {product.stock}</span>
                  ) : (
                    <span className="text-rose-600">Out of stock</span>
                  )}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating & Brand */}
              <div className="mt-2 flex items-center gap-2 text-xs">
                <div className="flex items-center text-amber-600 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                  {product.rating || 4.5}
                </div>
                <span className="text-slate-400 font-medium">{product.reviewCount || 128} reviews</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-semibold">Brand: Sandhai Farm Select</span>
              </div>

              {/* Price, Struck-through & Savings (Page 5) */}
              <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-black text-slate-900">₹{product.price}</span>
                  {product.discountPercentage > 0 && (
                    <span className="text-sm text-slate-400 line-through font-semibold">
                      ₹{product.originalPrice}
                    </span>
                  )}
                  {savings > 0 && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      You save ₹{savings} ({product.discountPercentage}%)
                    </span>
                  )}
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                {product.description ||
                  'Directly sourced from trusted local farms. Packed under strict hygienic conditions to preserve vital nutrients and freshness.'}
              </p>
            </div>

            {/* Stepper & Actions */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">Quantity</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-white rounded-l-xl text-slate-600 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3.5 text-xs font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-white rounded-r-xl text-slate-600 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Dual Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => addToCart(product._id, quantity)}
                  className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to cart</span>
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Buy now</span>
                </button>
              </div>

              {/* 3 Value Proposition Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px]">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                  <Truck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <div className="font-bold text-slate-900">Free shipping</div>
                  <div className="text-slate-400">Orders ₹500+</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                  <RotateCcw className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <div className="font-bold text-slate-900">Fresh guarantee</div>
                  <div className="text-slate-400">Same-day inspection</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <div className="font-bold text-slate-900">Verified origin</div>
                  <div className="text-slate-400">100% farm fresh</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Description | Specs | Reviews (Page 5) */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-4 border-b border-slate-200 text-xs font-bold mb-4">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
                activeTab === 'description'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
                activeTab === 'specs'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Reviews ({product.reviewCount || 128})
            </button>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed min-h-16">
            {activeTab === 'description' && (
              <p>{product.description || 'Full natural organic produce harvested fresh daily.'}</p>
            )}
            {activeTab === 'specs' && (
              <div className="grid grid-cols-2 gap-2 max-w-md">
                <div className="text-slate-400">Unit:</div>
                <div className="font-bold text-slate-800">{product.unit || 'kg'}</div>
                <div className="text-slate-400">Category:</div>
                <div className="font-bold text-slate-800">{product.category?.name || 'General'}</div>
                <div className="text-slate-400">Stock Status:</div>
                <div className="font-bold text-slate-800">{product.stock} available</div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="flex items-center gap-1 text-amber-500">
                  ★★★★★ <span className="text-slate-900 font-bold ml-1">Excellent quality!</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  "Very fresh and delivered properly packed. Will definitely order again."
                </p>
              </div>
            )}
          </div>
        </div>

        {/* You may also like related items */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="font-black text-slate-900 text-sm mb-4">You may also like</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedProducts.slice(0, 4).map((rel) => (
                <div
                  key={rel._id}
                  onClick={() => navigate(`/app/product/${rel._id}`)}
                  className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 hover:border-emerald-400 cursor-pointer transition-all"
                >
                  <img
                    src={rel.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300'}
                    alt={rel.name}
                    className="w-full h-24 rounded-xl object-cover bg-white mb-2"
                  />
                  <div className="font-bold text-slate-900 text-xs truncate">{rel.name}</div>
                  <div className="text-xs font-black text-emerald-700 mt-0.5">₹{rel.price}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;

