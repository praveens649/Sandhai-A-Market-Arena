import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Truck, ShieldCheck } from "lucide-react";

const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white p-8 sm:p-12 shadow-xl shadow-emerald-950/20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-bold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FRESHNESS DELIVERED DAILY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Fresh Choices.<br />
            <span className="text-emerald-300">Better Living.</span>
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-lg">
            Shop 100% farm-fresh fruits, organic leafy vegetables, artisan dairy, and everyday staples directly at Sandhai.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-emerald-800 font-black text-sm shadow-lg shadow-black/10 hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer"
            >
              <span>Shop All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
              <Truck className="w-4 h-4 text-emerald-300" />
              <span>Free Delivery &gt; ₹500</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=900"
              alt="Fresh grocery collection"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>

      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
    </section>
  );
};

export default HeroBanner;
