import { useState } from "react";
import { Package, CalendarDays, MapPin, XCircle, CheckCircle2, Clock, Truck } from "lucide-react";
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
  const [orders, setOrders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sandhai-orders") || "[]");
    } catch (e) {
      return [];
    }
  });

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
    <section className="space-y-8 pb-12">
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          YOUR PURCHASES
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
          My Order History
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          View past purchases and track real-time delivery status.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 p-8 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">No orders yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Your placed grocery orders will appear here for easy tracking.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div>
                  <h3 className="font-mono font-bold text-base text-slate-900 dark:text-white">
                    Order #{order.id}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>{formatDate(order.date)}</span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === "Cancelled"
                      ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      : order.status === "Delivered"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Order total & actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mr-2">Total Amount:</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white">₹{order.total}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 transition-colors cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details & Track
                  </button>

                  {order.status === "Placed" && (
                    <button
                      className="py-2 px-3 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer flex items-center gap-1"
                      onClick={() => setCancelId(order.id)}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Details & Tracking Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Order Details</h2>
                <p className="text-xs font-mono text-emerald-600 font-bold">#{selectedOrder.id}</p>
              </div>
              <button
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm cursor-pointer"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Ordered Items</h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-48 overflow-y-auto pr-1">
                {selectedOrder.items.map((item) => (
                  <div className="py-2.5 flex items-center justify-between gap-3 text-sm" key={item.id}>
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover bg-slate-100" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-xs">{item.name}</div>
                        <div className="text-[11px] text-slate-400">Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <strong className="text-xs text-slate-900 dark:text-white">₹{item.price * item.quantity}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 text-xs space-y-1">
              <div className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">Delivery Address</div>
              {selectedOrder.address ? (
                <>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedOrder.address.name}</p>
                  <p className="text-slate-600 dark:text-slate-300">{selectedOrder.address.house}, {selectedOrder.address.city}</p>
                  <p className="text-slate-500">Phone: {selectedOrder.address.phone} | PIN: {selectedOrder.address.pincode}</p>
                </>
              ) : (
                <p className="text-slate-500">Address information unavailable.</p>
              )}
            </div>

            {/* Tracking Progress */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Delivery Status</h3>
              {selectedOrder.status === "Cancelled" ? (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-bold">
                  This order was cancelled.
                </div>
              ) : (
                <div className="space-y-2">
                  {trackingStages.map((stage, index) => {
                    const currentIndex = getStageIndex(selectedOrder.status);
                    const isPassed = currentIndex >= index;
                    return (
                      <div key={stage} className="flex items-center gap-3 text-xs">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isPassed
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                        }`}>
                          {isPassed ? "✓" : index + 1}
                        </div>
                        <span className={isPassed ? "font-bold text-slate-900 dark:text-white" : "text-slate-400"}>
                          {stage}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedOrder.status === "Placed" && (
              <button
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-700 cursor-pointer shadow-md shadow-rose-600/20"
                onClick={() => setCancelId(selectedOrder.id)}
              >
                Cancel This Order
              </button>
            )}
          </div>
        </div>
      )}

      {cancelId !== null && (
        <ConfirmDialog
          title="Cancel Order?"
          message="Are you sure you want to cancel this order? Stock will be restored."
          onConfirm={cancelOrder}
          onCancel={() => setCancelId(null)}
        />
      )}
    </section>
  );
};

export default Orders;
