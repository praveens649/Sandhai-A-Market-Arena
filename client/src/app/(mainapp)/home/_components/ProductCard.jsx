
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useToast } from "../../../../context/ToastContext";

const ProductCard = ({ product }) => {
  const { showToast } = useToast();

  const [isWishlisted, setIsWishlisted] = useState(() => {
    const wishlist = JSON.parse(
      localStorage.getItem("sandhai-wishlist") || "[]"
    );

    return wishlist.some(
      (item) => String(item.id) === String(product.id)
    );
  });

  const addToCart = () => {
    const cart = JSON.parse(
      localStorage.getItem("sandhai-cart") || "[]"
    );

    const existing = cart.find(
      (item) => String(item.id) === String(product.id)
    );

    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("sandhai-cart", JSON.stringify(cart));
    showToast(`${product.name} added to cart!`, "success");
  };

  const toggleWishlist = () => {
    const wishlist = JSON.parse(
      localStorage.getItem("sandhai-wishlist") || "[]"
    );

    const exists = wishlist.some(
      (item) => String(item.id) === String(product.id)
    );

    let updatedWishlist;

    if (exists) {
      updatedWishlist = wishlist.filter(
        (item) => String(item.id) !== String(product.id)
      );
      setIsWishlisted(false);
      showToast(`${product.name} removed from wishlist.`, "success");
    } else {
      updatedWishlist = [...wishlist, product];
      setIsWishlisted(true);
      showToast(`${product.name} added to wishlist!`, "success");
    }

    localStorage.setItem(
      "sandhai-wishlist",
      JSON.stringify(updatedWishlist)
    );
  };

  return (
    <div className="product-card">
      <button
        className={`wishlist-heart ${isWishlisted ? "active" : ""}`}
        onClick={toggleWishlist}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <Heart
          size={21}
          fill={isWishlisted ? "currentColor" : "none"}
        />
      </button>

      <Link to={`/product/${product.id}`}>
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h3>{product.name}</h3>

          <div className="product-rating">
            <Star size={15} fill="currentColor" />
            {product.rating}
          </div>

          <div className="product-price">
            ₹{product.price}
            <span> / {product.unit}</span>
          </div>
        </div>
      </Link>

      <button className="add-cart-btn" onClick={addToCart}>
        <ShoppingCart size={17} />
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
