import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapPin, Plus, Pencil, Trash2, ArrowLeft, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { useToast } from "../../../context/ToastContext";
import ConfirmDialog from "../_components/ConfirmDialog";

const Checkout = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sandhai-cart") || "[]");
    } catch (e) {
      return [];
    }
  });

  const [addresses, setAddresses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sandhai-addresses") || "[]");
    } catch (e) {
      return [];
    }
  });

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
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const deliveryFee = subtotal >= 500 ? 0 : subtotal > 0 ? 40 : 0;
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
      paymentStatus: payment === "Cash on Delivery" ? "Pending" : "Completed",
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
    showToast("Order placed successfully! Thank you for ordering from Sandhai.", "success");
    navigate("/orders");
  };

  return (
    <section className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            COMPLETE PURCHASE
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
            Address & Checkout
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Confirm your delivery address and choose a payment method.
          </p>
        </div>

        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main checkout column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Delivery Addresses panel */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>Delivery Addresses</span>
              </h3>
              <button
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
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
                <Plus className="w-4 h-4" />
                <span>Add Address</span>
              </button>
            </div>

            {addresses.length === 0 && (
              <p className="text-xs text-rose-600 font-semibold p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800">
                No saved addresses. Please add a delivery address to proceed.
              </p>
            )}

            <div className="space-y-3">
              {addresses.map((address) => (
                <label
                  key={address.id}
                  className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedAddress === String(address.id)
                      ? "bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-500 shadow-xs"
                      : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryAddress"
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    checked={selectedAddress === String(address.id)}
                    onChange={() => {
                      setSelectedAddress(String(address.id));
                      localStorage.setItem(
                        "sandhai-selected-address",
                        String(address.id)
                      );
                    }}
                  />

                  <div className="flex-1 text-xs space-y-0.5">
                    <strong className="text-sm font-bold text-slate-900 dark:text-white block">
                      {address.name}
                    </strong>
                    <p className="text-slate-600 dark:text-slate-300">{address.house}, {address.city}</p>
                    <p className="text-slate-400">Phone: {address.phone} | PIN: {address.pincode}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        editAddress(address);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setDeleteId(address.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </label>
              ))}
            </div>

            {/* Address Form */}
            {showForm && (
              <form
                onSubmit={saveAddress}
                className="mt-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-3 text-xs"
              >
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {editingId !== null ? "Edit Delivery Address" : "Add New Delivery Address"}
                </h4>

                <input
                  name="name"
                  placeholder="Full recipient name"
                  value={addressForm.name}
                  onChange={handleAddressChange}
                  required
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 outline-none focus:border-emerald-500"
                />

                <input
                  name="phone"
                  placeholder="Phone number"
                  value={addressForm.phone}
                  onChange={handleAddressChange}
                  required
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 outline-none focus:border-emerald-500"
                />

                <input
                  name="house"
                  placeholder="House / Flat No, Street, Area"
                  value={addressForm.house}
                  onChange={handleAddressChange}
                  required
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 outline-none focus:border-emerald-500"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    name="city"
                    placeholder="City"
                    value={addressForm.city}
                    onChange={handleAddressChange}
                    required
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 outline-none focus:border-emerald-500"
                  />

                  <input
                    name="pincode"
                    placeholder="PIN code"
                    value={addressForm.pincode}
                    onChange={handleAddressChange}
                    required
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Payment Method Panel */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white">Payment Method</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label
                className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  payment === "Cash on Delivery"
                    ? "bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-500 font-bold text-emerald-800 dark:text-emerald-300"
                    : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={payment === "Cash on Delivery"}
                  onChange={() => setPayment("Cash on Delivery")}
                />
                <span>Cash on Delivery (Pay upon arrival)</span>
              </label>

              <label
                className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  payment === "UPI"
                    ? "bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-500 font-bold text-emerald-800 dark:text-emerald-300"
                    : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={payment === "UPI"}
                  onChange={() => setPayment("UPI")}
                />
                <span>Online UPI / QR Code</span>
              </label>
            </div>
          </div>

        </div>

        {/* Order Summary sidebar */}
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-5 h-fit">
          <h3 className="text-base font-black text-slate-900 dark:text-white">Order Summary</h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-48 overflow-y-auto pr-1 text-xs">
            {cart.map((item) => (
              <div key={item.id} className="py-2 flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="truncate max-w-[160px]">{item.name} × {item.quantity}</span>
                <span className="font-bold">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-700 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Delivery Charge</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {subtotal >= 500 ? "FREE" : "₹40.00"}
              </span>
            </div>

            <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-700">
              <span>Total Amount</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={placeOrder}
            disabled={cart.length === 0 || !selectedAddress}
            className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>Place Order Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {deleteId !== null && (
        <ConfirmDialog
          title="Delete Address?"
          message="Are you sure you want to delete this delivery address?"
          onConfirm={deleteAddress}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </section>
  );
};

export default Checkout;
