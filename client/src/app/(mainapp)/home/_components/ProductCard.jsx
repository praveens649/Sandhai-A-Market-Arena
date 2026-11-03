import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useToast } from "../../../../context/ToastContext";

const ProductCard = ({ product }) => {
  const { showToast } = useToast();

  const [isWishlisted, setIsWishlisted] = useState(() => {
    try {
      const wishlist = JSON.parse(
        localStorage.getItem("sandhai-wishlist") || "[]"
      );
      return wishlist.some(
        (item) => String(item.id) === String(product.id)
      );
    } catch (e) {
      return false;
    }
  });

  const addToCart = () => {
    try {
      const cart = JSON.parse(
        localStorage.getItem("sandhai-cart") || "[]"
      );

      const existing = cart.find(
        (item) => String(item.id) === String(product.id)
      );

      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("sandhai-cart", JSON.stringify(cart));
      showToast(`${product.name} added to cart!`, "success");
    } catch (e) {
      showToast("Could not update cart", "error");
    }
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const wishlist = JSON.parse(
        localStorage.getItem("sandhai-wishlist") || "[]"
      );

      const exists = wishlist.some(
        (item) => String(item.id) === String(product.id)
      );

      let updatedWishlist;

      if (exists) {
        updatedWishlist = wishlist.filter(
          (item) => String(item.id) !== String(product.id)
        );
        setIsWishlisted(false);
        showToast(`${product.name} removed from wishlist.`, "success");
      } else {
        updatedWishlist = [...wishlist, product];
        setIsWishlisted(true);
        showToast(`${product.name} added to wishlist!`, "success");
      }

      localStorage.setItem(
        "sandhai-wishlist",
        JSON.stringify(updatedWishlist)
      );
    } catch (e) {
      showToast("Could not update wishlist", "error");
    }
  };

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Image Box */}
      <div className="relative h-48 bg-slate-100 dark:bg-slate-700/50 overflow-hidden">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Wishlist Heart Toggle */}
        <button
          onClick={toggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition-all cursor-pointer ${
            isWishlisted
              ? "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
              : "bg-white/80 dark:bg-slate-900/80 text-slate-400 hover:text-rose-600 hover:bg-white"
          }`}
        >
          <Heart
            className="w-4 h-4 transition-colors"
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-1">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span>{product.rating}</span>
            <span className="text-slate-400 font-normal">/ 5</span>
          </div>

          <div className="text-lg font-black text-slate-900 dark:text-white mt-2">
            ₹{product.price}
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 ml-1">
              / {product.unit}
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={addToCart}
          className="w-full py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>

    </div>
  );
};

export default ProductCard;
