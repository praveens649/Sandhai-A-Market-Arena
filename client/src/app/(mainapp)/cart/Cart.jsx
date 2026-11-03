
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useToast } from "../../../context/ToastContext";

function Cart() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("sandhai-cart")) || [];
  });

  useEffect(() => {
    localStorage.setItem("sandhai-cart", JSON.stringify(cart));
  }, [cart]);

  const increaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: (item.quantity || 1) - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    showToast("Product removed from cart.", "success");
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const goToCheckout = () => {
    if (cart.length === 0) {
      showToast("Your cart is empty.", "error");
      return;
    }

    navigate("/checkout");
  };

  return (
    <div className="cart-page">
      <div className="page-heading">
        <h1>My Shopping Cart</h1>
        <p>Review your selected products before checkout.</p>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <ShoppingCart size={60} />
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>

          <button
            className="primary-btn"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img
                  src={item.image || item.imageUrl}
                  alt={item.name}
                  className="cart-product-image"
                />

                <div className="cart-product-info">
                  <h3>{item.name}</h3>
                  <p>₹{Number(item.price).toFixed(2)}</p>

                  <div className="quantity-control">
                    <button onClick={() => decreaseQuantity(item.id)}>
                      <Minus size={16} />
                    </button>

                    <span>{item.quantity || 1}</span>

                    <button onClick={() => increaseQuantity(item.id)}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="cart-item-actions">
                  <h3>
                    ₹
                    {(
                      Number(item.price || 0) *
                      Number(item.quantity || 1)
                    ).toFixed(2)}
                  </h3>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 size={18} />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Delivery Charge</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="summary-row total-row">
              <strong>Total</strong>
              <strong>₹{subtotal.toFixed(2)}</strong>
            </div>

            <button
              className="primary-btn checkout-btn"
              onClick={goToCheckout}
            >
              Proceed to Checkout
            </button>

            <button
              className="continue-shopping-btn"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
