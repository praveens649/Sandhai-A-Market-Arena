import { products } from "../../../../utils/constants";
import ProductCard from "./ProductCard";

const LatestProducts = () => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            JUST ARRIVED
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
            Latest Farm Arrivals
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Fresh stocks restocked today from organic local harvest.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.slice(4, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default LatestProducts;
