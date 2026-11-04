import React from 'react';
import { Star, Heart, ShoppingCart, Plus, Minus } from 'lucide-react';

const KadaiProductCard = ({
  product,
  quantityInCart = 0,
  isWishlisted = false,
  onAddToCart,
  onUpdateQuantity,
  onToggleWishlist,
  onSelectProduct,
}) => {
  const {
    _id,
    name,
    description,
    price,
    unit = 'kg',
    stock = 0,
    image,
    category,
    rating = 4.5,
    reviewCount = 128,
    discountPercentage = 0,
    originalPrice = price,
  } = product;

  const isLowStock = stock > 0 && stock < 10;
  const isOutOfStock = stock <= 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 flex flex-col justify-between hover:shadow-lg dark:hover:shadow-slate-950/50 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 group">
      {/* Top Media Area */}
      <div className="relative">
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md bg-orange-600 text-white font-black text-[11px] shadow-xs">
            -{discountPercentage}%
          </span>
        )}

        {/* Wishlist Heart */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist && onToggleWishlist(_id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-xl backdrop-blur-md transition-all active:scale-90 cursor-pointer ${
            isWishlisted
              ? 'bg-rose-50 dark:bg-rose-950 text-rose-500 border border-rose-200 dark:border-rose-800'
              : 'bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:text-rose-500 border border-slate-200/60 dark:border-slate-700'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Product Image */}
        <div
          onClick={() => onSelectProduct && onSelectProduct(product)}
          className="w-full h-44 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
        >
          <img
            src={image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400'}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Body Area */}
      <div className="mt-3 flex-1 flex flex-col justify-between">
        <div onClick={() => onSelectProduct && onSelectProduct(product)} className="cursor-pointer">
          {/* Category Caption */}
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
            {category?.name || 'Produce'}
          </span>

          {/* Title */}
          <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            {name}
          </h4>

          {/* Star Rating & Review Count (Page 3 & 4) */}
          <div className="mt-1 flex items-center gap-1.5 text-xs">
            <span className="flex items-center text-amber-600 dark:text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1 inline" />
              {rating}
            </span>
            <span className="text-slate-400 font-medium">({reviewCount})</span>
            {isLowStock && (
              <span className="ml-auto text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-800">
                Only {stock} left
              </span>
            )}
          </div>
        </div>

        {/* Pricing Area */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-lg font-black text-slate-900 dark:text-white">
              ₹{price}
              <span className="text-xs font-normal text-slate-400 ml-0.5">/{unit}</span>
            </span>
            {discountPercentage > 0 && (
              <span className="text-xs text-slate-400 line-through font-medium">
                ₹{originalPrice}
              </span>
            )}
          </div>

          {/* Action Button: Stepper if in cart, "Add to cart" if not, or "Out of stock" */}
          {isOutOfStock ? (
            <button
              disabled
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold text-xs cursor-not-allowed"
            >
              Out of stock
            </button>
          ) : quantityInCart > 0 ? (
            /* In-Card Stepper: − N in cart + (Page 3 & 4) */
            <div className="flex items-center justify-between border border-emerald-600 bg-emerald-50/60 rounded-xl px-2 py-1.5">
              <button
                type="button"
                onClick={() => onUpdateQuantity(_id, quantityInCart - 1)}
                className="w-6 h-6 rounded-lg bg-white border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold hover:bg-emerald-100 cursor-pointer transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-black text-emerald-900">
                {quantityInCart} in cart
              </span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(_id, quantityInCart + 1)}
                className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold hover:bg-emerald-700 cursor-pointer transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            /* Default Add to Cart Button (Page 3) */
            <button
              type="button"
              onClick={() => onAddToCart(_id, 1)}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KadaiProductCard;

