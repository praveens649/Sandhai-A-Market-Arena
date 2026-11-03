import { categories } from "../../../../utils/constants";
import CategoryCard from "./CategoryCard";

const CategorySection = () => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            SHOP BY CATEGORY
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
            Explore Fresh Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Everything your kitchen needs, carefully curated into four core aisles.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
