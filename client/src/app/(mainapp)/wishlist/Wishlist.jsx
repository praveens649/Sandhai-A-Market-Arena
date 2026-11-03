import { useState } from "react";
import { Heart, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { useToast } from "../../../context/ToastContext";
import ConfirmDialog from "../_components/ConfirmDialog";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sandhai-wishlist") || "[]");
    } catch (e) {
      return [];
    }
  });

  const [removeId, setRemoveId] = useState(null);
  const { showToast } = useToast();

  const saveWishlist = (updated) => {
    setWishlist(updated);
    localStorage.setItem("sandhai-wishlist", JSON.stringify(updated));
  };

  const moveToCart = (product) => {
    try {
      const cart = JSON.parse(localStorage.getItem("sandhai-cart") || "[]");
      const existing = cart.find((item) => item.id === product.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("sandhai-cart", JSON.stringify(cart));
      saveWishlist(wishlist.filter((item) => item.id !== product.id));
      showToast(`${product.name} moved to cart!`, "success");
    } catch (e) {
      showToast("Could not move to cart", "error");
    }
  };

  const removeProduct = () => {
    saveWishlist(wishlist.filter((item) => item.id !== removeId));
    setRemoveId(null);
    showToast("Product removed from wishlist.", "success");
  };

  return (
    <section className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            YOUR FAVOURITES
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-3">
            <span>My Wishlist</span>
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Saved items bookmarked for quick purchasing.
          </p>
        </div>

        <Link
          to="/products"
          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          <span>Explore more products</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {wishlist.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Your wishlist is empty</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Tap the heart icon on any product to save it here for later.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
          >
            <span>Discover Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <article
              key={product.id}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 overflow-hidden shadow-xs hover:shadow-lg transition-all p-4 flex flex-col justify-between"
            >
              <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-700 mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setRemoveId(product.id)}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 text-rose-500 flex items-center justify-center shadow-xs cursor-pointer hover:bg-white"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  {product.category}
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1">
                  {product.name}
                </h4>
                <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                  ₹{product.price} <small className="text-slate-400 font-normal">/ {product.unit}</small>
                </div>
              </div>

              <button
                onClick={() => moveToCart(product)}
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-600 text-emerald-700 dark:text-emerald-300 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Move to Cart</span>
              </button>
            </article>
          ))}
        </div>
      )}

      {removeId !== null && (
        <ConfirmDialog
          title="Remove from Wishlist?"
          message="Are you sure you want to remove this product from your saved list?"
          onConfirm={removeProduct}
          onCancel={() => setRemoveId(null)}
        />
      )}
    </section>
  );
};

export default Wishlist;
