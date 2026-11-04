import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Plus,
  Minus,
  ShoppingCart,
  Zap,
} from 'lucide-react';

const ProductDetailModal = ({
  product,
  relatedProducts = [],
  quantityInCart = 0,
  onClose,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
}) => {
  if (!product) return null;

  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const productImage = product.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600';

  const savings = product.discountPercentage > 0
    ? Math.round(product.originalPrice - product.price)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Breadcrumb (Page 5) */}
        <div className="text-xs text-slate-400 font-medium mb-4 flex items-center gap-1.5">
          <span>Home</span>
          <span>/</span>
          <span className="text-slate-600 font-semibold">{product.category?.name || 'Produce'}</span>
          <span>/</span>
          <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Product Media */}
          <div>
            <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
              {product.discountPercentage > 0 && (
                <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-orange-600 text-white font-black text-xs">
                  -{product.discountPercentage}%
                </span>
              )}
              <img
                src={productImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Info & Purchase Controls */}
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              {/* Category & Stock Status Pill */}
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

              {/* Title */}
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                {product.name}
              </h2>

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

              {/* Price, Strike-through & Savings (Page 5) */}
              <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
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

              {/* Short Description */}
              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                {product.description ||
                  'Directly sourced from trusted local farms. Packed under strict hygienic conditions to preserve vital nutrients and freshness.'}
              </p>
            </div>

            {/* Quantity Stepper & Dual Buttons (Page 5) */}
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
                  onClick={() => onAddToCart(product._id, quantity)}
                  className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to cart</span>
                </button>
                <button
                  type="button"
                  onClick={() => onBuyNow && onBuyNow(product._id, quantity)}
                  className="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Buy now</span>
                </button>
              </div>

              {/* 3 Value Proposition Badges (Page 5) */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px]">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                  <Truck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <div className="font-bold text-slate-900">Free shipping</div>
                  <div className="text-slate-400">On orders of ₹500+</div>
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

        {/* Bottom Tabs: Description | Specifications | Reviews (Page 5) */}
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

          <div className="text-xs text-slate-600 leading-relaxed min-h-20">
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
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-1 text-amber-500 mb-1">
                    ★★★★★ <span className="text-slate-900 font-bold ml-1">Excellent quality!</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    "Very fresh and delivered properly packed. Will definitely order again."
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* "You may also like" Related Products Carousel (Page 5) */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="font-black text-slate-900 text-sm mb-4">You may also like</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedProducts.slice(0, 4).map((rel) => (
                <div
                  key={rel._id}
                  onClick={() => {
                    if (onClose) onClose();
                    navigate(`/app/product/${rel._id}`);
                  }}
                  className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 hover:border-emerald-400 cursor-pointer transition-all group"
                  title={`View ${rel.name}`}
                >
                  <img
                    src={rel.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300'}
                    alt={rel.name}
                    className="w-full h-24 rounded-xl object-cover bg-white mb-2 group-hover:scale-105 transition-transform"
                  />
                  <div className="font-bold text-slate-900 text-xs truncate group-hover:text-emerald-700 transition-colors">{rel.name}</div>
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

export default ProductDetailModal;

