import { products } from "../../../../utils/constants";
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <span className="section-label">OUR SELECTION</span>
          <h2>Featured Products</h2>
          <p>Popular picks for your everyday needs.</p>
        </div>
      </div>

      <div className="product-grid">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;