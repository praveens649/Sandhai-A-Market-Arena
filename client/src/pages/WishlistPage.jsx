import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, moveWishlistToCart } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200/80">
        <div>
          <h2 className="text-xl font-black text-slate-900">My Wishlist ({wishlist.length})</h2>
          <p className="text-xs text-slate-500 mt-0.5">Items saved for later purchase</p>
        </div>
        <button
          onClick={() => navigate('/app/shop')}
          className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </button>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {wishlist.map((prod) => (
            <div key={prod._id} className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
              <div
                onClick={() => navigate(`/app/product/${prod._id}`)}
                className="w-full h-40 rounded-xl overflow-hidden bg-slate-100 cursor-pointer"
              >
                <img
                  src={prod.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400'}
                  alt={prod.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <h4
                  onClick={() => navigate(`/app/product/${prod._id}`)}
                  className="font-bold text-slate-900 text-sm truncate hover:text-emerald-700 cursor-pointer"
                >
                  {prod.name}
                </h4>
                <div className="text-xs font-black text-emerald-700 mt-1">₹{prod.price} / {prod.unit || 'kg'}</div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => moveWishlistToCart(prod._id)}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>
                <button
                  onClick={() => toggleWishlist(prod._id)}
                  className="p-2 rounded-xl bg-slate-100 text-rose-600 hover:bg-rose-50 cursor-pointer"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
          <Heart className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">Your wishlist is empty</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Click the heart icon on any product in the store to save it here.
          </p>
          <button
            onClick={() => navigate('/app/shop')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Start Browsing</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;

