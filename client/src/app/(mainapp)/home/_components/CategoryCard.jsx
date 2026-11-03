import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/products?category=${encodeURIComponent(category.name)}`}
      className="group relative bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-700">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
      </div>

      <div className="p-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {category.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
            {category.description}
          </p>
        </div>

        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 group-hover:bg-emerald-600 group-hover:text-white text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 transition-colors">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
