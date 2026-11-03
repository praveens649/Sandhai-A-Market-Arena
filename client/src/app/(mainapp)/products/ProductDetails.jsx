import { useParams, Link } from "react-router-dom";
import { products } from "../../../utils/constants";
import { useToast } from "../../../context/ToastContext";
import { ShoppingCart, Star, ArrowLeft, Truck, ShieldCheck, Check } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find((item) => item.id === Number(id));
  const { showToast } = useToast();

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Product not found</h2>
        <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  const addToCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("sandhai-cart") || "[]");
      const existing = cart.find((item) => item.id === product.id);

      if (existing) existing.quantity += 1;
      else cart.push({ ...product, quantity: 1 });

      localStorage.setItem("sandhai-cart", JSON.stringify(cart));
      showToast(`${product.name} added to cart!`, "success");
    } catch (e) {
      showToast("Could not update cart", "error");
    }
  };

  return (
    <section className="space-y-8 pb-12">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Products</span>
      </Link>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 overflow-hidden shadow-xl shadow-slate-200/40 dark:shadow-none p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* Product Image */}
        <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-700/50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-slate-900/80 backdrop-blur-xs text-white text-xs font-black px-3 py-1.5 rounded-lg uppercase tracking-wider">
              {product.category}
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-1.5 text-amber-500 text-sm font-bold mb-2">
              <Star className="w-4 h-4 fill-amber-500" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">/ 5 customer rating</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {product.name}
            </h1>

            <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-3">
              ₹{product.price}
              <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 ml-1.5">
                / {product.unit}
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-b border-slate-100 dark:border-slate-700 py-4">
            {product.description}
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>100% Organic & Fresh</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Free Delivery &gt; ₹500</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={addToCart}
              className="flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            <Link
              to="/products"
              className="py-3.5 px-6 rounded-2xl font-bold text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-center transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProductDetails;
