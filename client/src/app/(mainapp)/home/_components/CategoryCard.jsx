import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/products?category=${encodeURIComponent(category.name)}`}
      className="category-card"
    >
      <img src={category.image} alt={category.name} />

      <div className="category-info">
        <div>
          <h3>{category.name}</h3>
          <p>{category.description}</p>
        </div>

        <ArrowUpRight size={22} />
      </div>
    </Link>
  );
};

export default CategoryCard;