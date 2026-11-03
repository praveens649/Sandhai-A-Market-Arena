import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "../../../context/ToastContext";
import ConfirmDialog from "../_components/ConfirmDialog";

const Checkout = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem("sandhai-cart") || "[]")
  );

  const [addresses, setAddresses] = useState(() =>
    JSON.parse(localStorage.getItem("sandhai-addresses") || "[]")
  );

  const [selectedAddress, setSelectedAddress] = useState(
    () => localStorage.getItem("sandhai-selected-address") || ""
  );

  const [payment, setPayment] = useState("Cash on Delivery");
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    house: "",
    city: "",
    pincode: ""
  });

  const [showForm, setShowForm] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = subtotal > 0 ? 30 : 0;
  const total = subtotal + deliveryFee;

  const saveAddresses = (updated) => {
    setAddresses(updated);
    localStorage.setItem("sandhai-addresses", JSON.stringify(updated));
  };

  const handleAddressChange = (e) => {
    setAddressForm({
      ...addressForm,
      [e.target.name]: e.target.value
    });
  };

  const saveAddress = (e) => {
    e.preventDefault();

    let updated;

    if (editingId !== null) {
      updated = addresses.map((address) =>
        address.id === editingId
          ? { ...addressForm, id: editingId }
          : address
      );
    } else {
      const newAddress = {
        ...addressForm,
        id: Date.now()
      };
      updated = [...addresses, newAddress];
    }

    saveAddresses(updated);

    if (!selectedAddress) {
      setSelectedAddress(String(updated[updated.length - 1].id));
    }

    setAddressForm({
      name: "",
      phone: "",
      house: "",
      city: "",
      pincode: ""
    });

    setEditingId(null);
    setShowForm(false);
    showToast("Address saved successfully!", "success");
  };

  const editAddress = (address) => {
    setAddressForm({
      name: address.name,
      phone: address.phone,
      house: address.house,
      city: address.city,
      pincode: address.pincode
    });

    setEditingId(address.id);
    setShowForm(true);
  };

  const deleteAddress = () => {
    const updated = addresses.filter(
      (address) => address.id !== deleteId
    );

    saveAddresses(updated);

    if (selectedAddress === String(deleteId)) {
      setSelectedAddress("");
      localStorage.removeItem("sandhai-selected-address");
    }

    setDeleteId(null);
    showToast("Address deleted.", "success");
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      showToast("Your cart is empty.", "error");
      return;
    }

    const address = addresses.find(
      (item) => String(item.id) === selectedAddress
    );

    if (!address) {
      showToast("Please select a delivery address.", "error");
      return;
    }

    const orders = JSON.parse(
      localStorage.getItem("sandhai-orders") || "[]"
    );

    const newOrder = {
      id: `SH${Date.now()}`,
      items: cart,
      address,
      subtotal,
      deliveryFee,
      total,
      paymentMethod: payment,
      paymentStatus: payment === "Cash on Delivery" ? "Pay on delivery" : "Pending",
      status: "Placed",
      date: new Date().toISOString()
    };

    localStorage.setItem(
      "sandhai-orders",
      JSON.stringify([newOrder, ...orders])
    );

    localStorage.removeItem("sandhai-cart");
    localStorage.setItem("sandhai-selected-address", selectedAddress);

    setCart([]);
    showToast("Order placed successfully!", "success");
    navigate("/orders");
  };

  return (
    <section className="section checkout-page">
      <span className="section-label">COMPLETE YOUR PURCHASE</span>
      <h2>Address and Checkout</h2>

      <div className="checkout-layout">
        <div className="checkout-main">
          <div className="checkout-panel">
            <div className="checkout-heading">
              <h3><MapPin size={20} /> Delivery Addresses</h3>
              <button
                className="secondary-btn"
                onClick={() => {
                  setEditingId(null);
                  setAddressForm({
                    name: "",
                    phone: "",
                    house: "",
                    city: "",
                    pincode: ""
                  });
                  setShowForm(!showForm);
                }}
              >
                <Plus size={17} /> Add Address
              </button>
            </div>

            {addresses.length === 0 && (
              <p className="result-count">No saved addresses. Add one to continue.</p>
            )}

            {addresses.map((address) => (
              <div className="address-card" key={address.id}>
                <input
                  type="radio"
                  name="deliveryAddress"
                  checked={selectedAddress === String(address.id)}
                  onChange={() => {
                    setSelectedAddress(String(address.id));
                    localStorage.setItem(
                      "sandhai-selected-address",
                      String(address.id)
                    );
                  }}
                />

                <div className="address-content">
                  <strong>{address.name}</strong>
                  <p>{address.house}, {address.city}</p>
                  <p>Phone: {address.phone}</p>
                  <p>PIN: {address.pincode}</p>
                </div>

                <button onClick={() => editAddress(address)} aria-label="Edit address">
                  <Pencil size={17} />
                </button>

                <button onClick={() => setDeleteId(address.id)} aria-label="Delete address">
                  <Trash2 size={17} />
                </button>
              </div>
            ))}

            {showForm && (
              <form className="address-form" onSubmit={saveAddress}>
                <h3>{editingId !== null ? "Edit Address" : "Add New Address"}</h3>

                <input
                  name="name"
                  placeholder="Full name"
                  value={addressForm.name}
                  onChange={handleAddressChange}
                  required
                />

                <input
                  name="phone"
                  placeholder="Phone number"
                  value={addressForm.phone}
                  onChange={handleAddressChange}
                  required
                />

                <input
                  name="house"
                  placeholder="House number, street and area"
                  value={addressForm.house}
                  onChange={handleAddressChange}
                  required
                />

                <input
                  name="city"
                  placeholder="City"
                  value={addressForm.city}
                  onChange={handleAddressChange}
                  required
                />

                <input
                  name="pincode"
                  placeholder="PIN code"
                  value={addressForm.pincode}
                  onChange={handleAddressChange}
                  required
                />

                <button className="primary-btn" type="submit">
                  Save Address
                </button>

                <button
                  className="secondary-btn"
                  type="button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </form>
            )}
          </div>

          <div className="checkout-panel">
            <h3>Payment Method</h3>

            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                checked={payment === "Cash on Delivery"}
                onChange={() => setPayment("Cash on Delivery")}
              />
              Cash on Delivery
            </label>

            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                checked={payment === "UPI"}
                onChange={() => setPayment("UPI")}
              />
              UPI
            </label>

            {payment === "UPI" && (
              <p className="result-count">
                UPI is shown as a frontend payment option. A real payment gateway
                must be integrated before accepting payments.
              </p>
            )}
          </div>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>

          {cart.map((item) => (
            <div key={item.id}>
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <hr />

          <div>
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div>
            <span>Delivery Charge</span>
            <span>₹{deliveryFee}</span>
          </div>

          <hr />

          <div className="summary-total">
            <strong>Total</strong>
            <strong>₹{total}</strong>
          </div>

          <button
            className="primary-btn checkout-btn"
            onClick={placeOrder}
            disabled={cart.length === 0}
          >
            Place Order
          </button>
        </div>
      </div>

      {deleteId !== null && (
        <ConfirmDialog
          title="Delete Address?"
          message="Are you sure you want to delete this address?"
          onConfirm={deleteAddress}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </section>
  );
};

export default Checkout;