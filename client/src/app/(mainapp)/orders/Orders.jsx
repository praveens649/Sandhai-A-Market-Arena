import { useState } from "react";
import { Package, CalendarDays, MapPin, XCircle } from "lucide-react";
import { useToast } from "../../../context/ToastContext";
import ConfirmDialog from "../_components/ConfirmDialog";

const trackingStages = [
  "Placed",
  "Confirmed",
  "Packed",
  "Out for Delivery",
  "Delivered"
];

const Orders = () => {
  const [orders, setOrders] = useState(() =>
    JSON.parse(localStorage.getItem("sandhai-orders") || "[]")
  );

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelId, setCancelId] = useState(null);

  const { showToast } = useToast();

  const saveOrders = (updated) => {
    setOrders(updated);
    localStorage.setItem("sandhai-orders", JSON.stringify(updated));
  };

  const cancelOrder = () => {
    const updated = orders.map((order) =>
      order.id === cancelId
        ? { ...order, status: "Cancelled" }
        : order
    );

    saveOrders(updated);
    setSelectedOrder(null);
    setCancelId(null);

    showToast("Order cancellation requested.", "success");
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

  const getStageIndex = (status) => trackingStages.indexOf(status);

  return (
    <section className="section">
      <span className="section-label">YOUR PURCHASES</span>
      <h2>My Orders</h2>
      <p className="result-count">View and track your grocery orders.</p>

      {orders.length === 0 ? (
        <div className="empty-state">
          <Package size={45} />
          <h3>No orders yet</h3>
          <p>Your placed orders will appear here.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-header">
                <div>
                  <h3>Order #{order.id}</h3>
                  <p>
                    <CalendarDays size={15} />
                    {formatDate(order.date)}
                  </p>
                </div>

                <span className={`order-status ${order.status === "Cancelled" ? "cancelled" : ""}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-footer">
                <span>Total Amount</span>
                <strong>₹{order.total}</strong>
              </div>

              <div className="order-actions">
                <button
                  className="secondary-btn"
                  onClick={() => setSelectedOrder(order)}
                >
                  View Details & Track
                </button>

                {order.status === "Placed" && (
                  <button
                    className="cancel-order-btn"
                    onClick={() => setCancelId(order.id)}
                  >
                    <XCircle size={16} />
                    Cancel Order
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="order-modal-overlay">
          <div className="order-modal">
            <button
              className="modal-close"
              onClick={() => setSelectedOrder(null)}
            >
              ×
            </button>

            <h2>Order Details</h2>
            <p className="result-count">Order #{selectedOrder.id}</p>

            <h3>Items</h3>

            {selectedOrder.items.map((item) => (
              <div className="order-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div>
                  <strong>{item.name}</strong>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <strong>₹{item.price * item.quantity}</strong>
              </div>
            ))}

            <div className="order-detail-block">
              <h3>Delivery Address</h3>

              {selectedOrder.address ? (
                <>
                  <p>{selectedOrder.address.name}</p>
                  <p>{selectedOrder.address.house}, {selectedOrder.address.city}</p>
                  <p>{selectedOrder.address.phone}</p>
                  <p>PIN: {selectedOrder.address.pincode}</p>
                </>
              ) : (
                <p>Address information is unavailable for this order.</p>
              )}
            </div>

            <div className="order-detail-block">
              <h3>Payment Information</h3>
              <p>Method: {selectedOrder.paymentMethod || "Not specified"}</p>
              <p>Status: {selectedOrder.paymentStatus || "Not specified"}</p>
              <p>Total: ₹{selectedOrder.total}</p>
            </div>

            <div className="order-detail-block">
              <h3>Track Your Order</h3>

              {selectedOrder.status === "Cancelled" ? (
                <p className="cancelled-message">This order has been cancelled.</p>
              ) : (
                <div className="tracking-list">
                  {trackingStages.map((stage, index) => {
                    const currentIndex = getStageIndex(selectedOrder.status);

                    return (
                      <div
                        className={`tracking-stage ${
                          currentIndex >= index ? "completed" : ""
                        }`}
                        key={stage}
                      >
                        <span className="tracking-dot"></span>
                        <span>{stage}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedOrder.status === "Placed" && (
              <button
                className="cancel-order-btn"
                onClick={() => setCancelId(selectedOrder.id)}
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      )}

      {cancelId !== null && (
        <ConfirmDialog
          title="Cancel Order?"
          message="Are you sure you want to request cancellation of this order?"
          onConfirm={cancelOrder}
          onCancel={() => setCancelId(null)}
        />
      )}
    </section>
  );
};

export default Orders;