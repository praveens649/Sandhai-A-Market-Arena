import { useState } from "react";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { useToast } from "../../../context/ToastContext";
import ConfirmDialog from "../_components/ConfirmDialog";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(() =>
    JSON.parse(localStorage.getItem("sandhai-wishlist") || "[]")
  );

  const [removeId, setRemoveId] = useState(null);
  const { showToast } = useToast();

  const saveWishlist = (updated) => {
    setWishlist(updated);
    localStorage.setItem("sandhai-wishlist", JSON.stringify(updated));
  };

  const moveToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("sandhai-cart") || "[]");
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("sandhai-cart", JSON.stringify(cart));

    saveWishlist(wishlist.filter((item) => item.id !== product.id));
    showToast(`${product.name} moved to cart!`, "success");
  };

  const removeProduct = () => {
    saveWishlist(wishlist.filter((item) => item.id !== removeId));
    setRemoveId(null);
    showToast("Product removed from wishlist.", "success");
  };

  return (
    <section className="section">
      <span className="section-label">YOUR FAVOURITES</span>
      <h2>My Wishlist <Heart size={22} /></h2>

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <Heart size={45} />
          <h3>Your wishlist is empty</h3>
          <p>Add your favourite products to view them here.</p>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>

              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3>{product.name}</h3>
                <div className="product-price">
                  ₹{product.price} <span>/ {product.unit}</span>
                </div>
              </div>

              <button
                className="add-cart-btn"
                onClick={() => moveToCart(product)}
              >
                <ShoppingCart size={17} />
                Move to Cart
              </button>

              <button
                className="remove-wishlist-btn"
                onClick={() => setRemoveId(product.id)}
              >
                <Trash2 size={16} />
                Remove
              </button>
            </article>
          ))}
        </div>
      )}

      {removeId !== null && (
        <ConfirmDialog
          title="Remove from Wishlist?"
          message="Are you sure you want to remove this product?"
          onConfirm={removeProduct}
          onCancel={() => setRemoveId(null)}
        />
      )}
    </section>
  );
};

export default Wishlist;