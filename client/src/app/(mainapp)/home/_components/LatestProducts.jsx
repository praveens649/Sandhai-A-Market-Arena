import { products } from "../../../../utils/constants";
import ProductCard from "./ProductCard";

const LatestProducts = () => {
  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <span className="section-label">JUST ARRIVED</span>
          <h2>Latest Products</h2>
          <p>Discover more fresh products from Sandhai.</p>
        </div>
      </div>

      <div className="product-grid">
        {products.slice(4, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default LatestProducts;