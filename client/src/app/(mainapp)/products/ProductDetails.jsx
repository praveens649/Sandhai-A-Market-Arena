import { useParams, Link } from "react-router-dom";
import { products } from "../../../utils/constants";
import { useToast } from "../../../context/ToastContext";

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find((item) => item.id === Number(id));
  const { showToast } = useToast();

  if (!product) return <div className="section"><h2>Product not found</h2></div>;

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("sandhai-cart") || "[]");
    const existing = cart.find((item) => item.id === product.id);

    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });

    localStorage.setItem("sandhai-cart", JSON.stringify(cart));
    showToast("Product added to cart!", "success");
  };

  return (
    <section className="section detail-page">
      <img src={product.image} alt={product.name} />

      <div>
        <span className="section-label">{product.category}</span>
        <h1>{product.name}</h1>
        <h2>₹{product.price} / {product.unit}</h2>
        <p>{product.description}</p>
        <p>⭐ {product.rating} / 5</p>

        <button className="primary-btn" onClick={addToCart}>
          Add to Cart
        </button>

        <Link to="/products" className="back-link">
          Continue Shopping
        </Link>
      </div>
    </section>
  );
};

export default ProductDetails;