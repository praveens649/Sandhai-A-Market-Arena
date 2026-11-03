import { categories } from "../../../utils/constants";
import CategoryCard from "../home/_components/CategoryCard";

const Categories = () => {
  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <span className="section-label">SANDHAI COLLECTION</span>
          <h2>All Grocery Categories</h2>
          <p>Explore our fresh and quality grocery collections.</p>
        </div>
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
          />
        ))}
      </div>
    </section>
  );
};

export default Categories;