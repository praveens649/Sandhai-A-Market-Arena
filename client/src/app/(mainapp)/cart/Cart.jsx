import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "../../../context/ToastContext";

function Cart() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sandhai-cart")) || [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("sandhai-cart", JSON.stringify(cart));
  }, [cart]);

  const increaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: (item.quantity || 1) - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    showToast("Product removed from cart.", "success");
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const goToCheckout = () => {
    if (cart.length === 0) {
      showToast("Your cart is empty.", "error");
      return;
    }
    navigate("/checkout");
  };

  return (
    <section className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            CHECKOUT READY
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
            My Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Review your selected farm products before checkout.
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {cart.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Your cart is empty</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Add fresh fruits, veggies, or grocery staples to get started!
            </p>
          </div>

          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-2 py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
          >
            <span>Start Shopping Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart items list */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-xs flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-700 overflow-hidden shrink-0">
                    <img
                      src={item.image || item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {item.name}
                    </h3>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                      ₹{Number(item.price).toFixed(2)} / {item.unit || "kg"}
                    </div>
                    <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-1.5">
                      Subtotal: ₹{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <span className="text-xs font-bold px-1.5 text-slate-900 dark:text-white">
                      {item.quantity || 1}
                    </span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart summary */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-6 h-fit">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Order Summary</h2>

            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700 pb-5">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Delivery Charge</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {subtotal >= 500 ? "FREE" : "₹40.00"}
                </span>
              </div>

              {subtotal < 500 && (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 text-xs font-medium">
                  Add ₹{(500 - subtotal).toFixed(2)} more to unlock <strong>FREE Delivery</strong>!
                </div>
              )}

              <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-slate-700">
                <span>Total</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  ₹{(subtotal + (subtotal >= 500 ? 0 : 40)).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={goToCheckout}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </section>
  );
}

export default Cart;
