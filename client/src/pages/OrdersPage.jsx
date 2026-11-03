import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Package, ArrowLeft } from 'lucide-react';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { myOrders, cancelOrder } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200/80">
        <div>
          <h2 className="text-xl font-black text-slate-900">My Orders ({myOrders.length})</h2>
          <p className="text-xs text-slate-500 mt-0.5">Track your order statuses and invoices</p>
        </div>
        <button
          onClick={() => navigate('/app/shop')}
          className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </button>
      </div>

      {myOrders.length > 0 ? (
        <div className="space-y-4">
          {myOrders.map((ord) => (
            <div key={ord._id} className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span className="font-mono font-bold text-emerald-700 text-sm">#{ord._id.slice(-8)}</span>
                  <div className="text-xs text-slate-400">
                    Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      ord.orderStatus === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : ord.orderStatus === 'Cancelled'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : 'bg-blue-100 text-blue-800 border-blue-300'
                    }`}
                  >
                    {ord.orderStatus}
                  </span>
                  {ord.orderStatus === 'Ordered' && (
                    <button
                      onClick={() => cancelOrder(ord._id)}
                      className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                {ord.items?.map((item, i) => (
                  <div key={i} className="flex justify-between text-slate-700">
                    <span>{item.name || 'Product'} × {item.quantity}</span>
                    <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Method: <strong>{ord.paymentMethod}</strong></span>
                <span className="font-black text-slate-900 text-sm">Total: ₹{ord.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No orders yet</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            When you purchase items from Sandhai, they will appear here with live tracking.
          </p>
          <button
            onClick={() => navigate('/app/shop')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Shop Now</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

