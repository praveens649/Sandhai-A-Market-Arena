import React from 'react';
import { useAdmin } from '../../_hook/useAdmin';
import { Search, ShoppingBag } from 'lucide-react';

const AdminOrdersPage = () => {
  const {
    filteredOrders,
    orderStatusFilter,
    setOrderStatusFilter,
    orderSearchQuery,
    setOrderSearchQuery,
    handleUpdateOrderStatus,
    toastMessage,
  } = useAdmin();

  return (
    <div className="space-y-6">
      {toastMessage.text && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xl">
          {toastMessage.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80">
        <div>
          <h2 className="text-xl font-black text-slate-900">Customer Orders ({filteredOrders.length})</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time order statuses, shipping info, and payment verification</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setOrderStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                orderStatusFilter === st
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={orderSearchQuery}
          onChange={(e) => setOrderSearchQuery(e.target.value)}
          placeholder="Search by Order ID (#...), Customer Name, Email, or Phone..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 shadow-xs"
        />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((ord) => (
          <div key={ord._id} className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
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
                  Customer: <strong className="text-slate-900">{ord.user?.name || ord.deliveryAddress?.recipientName}</strong>{' '}
                  <span className="text-slate-400">({ord.user?.email || ord.deliveryAddress?.phone})</span>
                </div>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-bold text-slate-500">Status:</span>
                <select
                  value={ord.orderStatus}
                  onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                  className="text-xs font-bold p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 outline-none focus:border-amber-500 cursor-pointer"
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
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Items Breakdown</div>
                <div className="space-y-1.5">
                  {ord.items?.map((item, idx) => (
                    <div key={idx} className="text-xs flex items-center justify-between bg-slate-50 p-2 rounded-xl">
                      <span className="font-medium text-slate-800">
                        {item.name || 'Product'} × {item.quantity}
                      </span>
                      <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Fulfillment Details</div>
                <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 text-slate-600">
                  <div>Address: {ord.deliveryAddress?.addressLine}, {ord.deliveryAddress?.city} - {ord.deliveryAddress?.postalCode}</div>
                  <div>Payment: <strong className="text-slate-800">{ord.paymentMethod}</strong> ({ord.paymentStatus})</div>
                  <div className="text-sm font-black text-slate-900 pt-1.5 border-t border-slate-200 flex justify-between">
                    <span>Total Amount:</span>
                    <span className="text-emerald-700">₹{ord.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="bg-white p-16 text-center rounded-3xl border border-slate-200/80 space-y-2">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No orders found</h3>
            <p className="text-xs text-slate-400">No orders match the selected status filter or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
