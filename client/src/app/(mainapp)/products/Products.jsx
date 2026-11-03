import { products } from "../../../utils/constants";
import ProductCard from "../home/_components/ProductCard";
import { useSearchParams } from "react-router-dom";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";

  const filteredProducts = category
    ? products.filter((item) => item.category === category)
    : products;

  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <span className="section-label">SANDHAI STORE</span>
          <h2>All Products</h2>
          <p>Explore our grocery collection.</p>
        </div>
      </div>

      <select
        className="category-filter"
        value={category}
        onChange={(e) =>
          setSearchParams(e.target.value ? { category: e.target.value } : {})
        }
      >
        <option value="">All Categories</option>
        <option value="Fruits">Fruits</option>
        <option value="Vegetables">Vegetables</option>
        <option value="Dairy Products">Dairy Products</option>
        <option value="Grocery & Staples">Grocery & Staples</option>
      </select>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && <p>No products found.</p>}
    </section>
  );
};

export default Products;