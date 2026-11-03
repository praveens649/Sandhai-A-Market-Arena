import React, { useState, useEffect } from 'react';
import api from '../../api/client';

const AdminOrdersPage = () => {
  const [orders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/orders');
      setAllOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId, orderStatus) => {
    try {
      const res = await api.patch(`/api/admin/orders/${orderId}/status`, { orderStatus });
      if (res.data.success) {
        showToast(`Order status updated to ${orderStatus}`);
        setAllOrders(orders.map((o) => (o._id === orderId ? { ...o, orderStatus } : o)));
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'ALL') return true;
    return o.orderStatus === statusFilter;
  });

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl">
          {toastMessage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80">
        <div>
          <h2 className="text-xl font-black text-slate-900">All Customer Orders ({orders.length})</h2>
          <p className="text-xs text-slate-500 mt-0.5">Track fulfillment, delivery stages, and receipts</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((ord) => (
          <div key={ord._id} className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-800 text-sm">#{ord._id.slice(-8)}</span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-bold text-slate-600">
                    {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="text-xs text-slate-700 mt-1">
                  Customer: <strong className="text-slate-900">{ord.user?.name || ord.deliveryAddress?.recipientName}</strong> ({ord.user?.email || ord.deliveryAddress?.phone})
                </div>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Status:</span>
                <select
                  value={ord.orderStatus}
                  onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                  className="text-xs font-bold p-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Items</div>
                <div className="space-y-1.5">
                  {ord.items?.map((item, idx) => (
                    <div key={idx} className="text-xs flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                      <span className="font-medium text-slate-800">
                        {item.name || 'Product'} × {item.quantity}
                      </span>
                      <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Shipping & Payment</div>
                <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1 text-slate-600">
                  <div>Address: {ord.deliveryAddress?.addressLine}, {ord.deliveryAddress?.city} - {ord.deliveryAddress?.postalCode}</div>
                  <div>Payment: <strong className="text-slate-800">{ord.paymentMethod}</strong> ({ord.paymentStatus})</div>
                  <div className="text-sm font-black text-slate-900 pt-1 border-t border-slate-200 flex justify-between">
                    <span>Total Amount:</span>
                    <span>₹{ord.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400 font-semibold">
            No orders found matching status "{statusFilter}".
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;

