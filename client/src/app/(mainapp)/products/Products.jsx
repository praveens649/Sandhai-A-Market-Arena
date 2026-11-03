import { products } from "../../../utils/constants";
import ProductCard from "../home/_components/ProductCard";
import { useSearchParams } from "react-router-dom";
import { Filter, PackageSearch } from "lucide-react";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";

  const filteredProducts = category
    ? products.filter((item) => item.category === category)
    : products;

  const categories = ["Fruits", "Vegetables", "Dairy Products", "Grocery & Staples"];

  return (
    <section className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            SANDHAI STORE
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
            All Farm Products
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Explore our high quality grocery produce directly from farmers.
          </p>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSearchParams({})}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              !category
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
            }`}
          >
            All Categories ({products.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSearchParams({ category: cat })}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                category === cat
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 space-y-3">
          <PackageSearch className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No products found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Try switching your category filter above.</p>
        </div>
      )}
    </section>
  );
};

export default Products;
