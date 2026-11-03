import { products } from "../../../../utils/constants";
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            OUR SELECTION
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
            Featured Products
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Hand-picked customer favorites and seasonal bestsellers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
