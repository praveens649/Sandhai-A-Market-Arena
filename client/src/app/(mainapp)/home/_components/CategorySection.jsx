import { categories } from "../../../../utils/constants";
import CategoryCard from "./CategoryCard";

const CategorySection = () => {
  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <span className="section-label">SHOP BY CATEGORY</span>
          <h2>Explore Our Categories</h2>
          <p>Everything you need, all in one place.</p>
        </div>
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;