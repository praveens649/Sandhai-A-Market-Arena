import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import {
  Package,
  ArrowLeft,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  RotateCcw,
  Receipt,
  Copy,
  Check,
  Printer,
  X,
  CreditCard,
  RefreshCw,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { myOrders = [], cancelOrder, refreshOrders, addToCart } = useStore();
  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'Ordered' | 'Delivered' | 'Cancelled'
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);
  const [reorderingId, setReorderingId] = useState(null);

  // 1. KPI Metrics
  const metrics = useMemo(() => {
    const totalOrders = myOrders.length;
    const orderedCount = myOrders.filter((o) => o.orderStatus === 'Ordered').length;
    const deliveredCount = myOrders.filter((o) => o.orderStatus === 'Delivered').length;
    const cancelledCount = myOrders.filter((o) => o.orderStatus === 'Cancelled').length;

    // Total spent on non-cancelled orders
    const totalSpent = myOrders
      .filter((o) => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

    return {
      totalOrders,
      orderedCount,
      deliveredCount,
      cancelledCount,
      totalSpent,
    };
  }, [myOrders]);

  // 2. Filter & Search Logic
  const filteredOrders = useMemo(() => {
    return myOrders.filter((ord) => {
      // Status filter
      if (statusFilter !== 'ALL' && ord.orderStatus !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const idMatch = (ord._id || '').toLowerCase().includes(query);
        const recipientMatch = (ord.deliveryAddress?.recipientName || '').toLowerCase().includes(query);
        const cityMatch = (ord.deliveryAddress?.city || '').toLowerCase().includes(query);
        const phoneMatch = (ord.deliveryAddress?.phone || '').includes(query);
        const itemMatch = ord.items?.some((i) => (i.name || '').toLowerCase().includes(query));

        return idMatch || recipientMatch || cityMatch || phoneMatch || itemMatch;
      }

      return true;
    });
  }, [myOrders, statusFilter, searchQuery]);

  // 3. Actions
  const handleCopyOrderId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    showToast('Order ID copied to clipboard!', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshOrders();
    setRefreshing(false);
  };

  const handleReorder = async (order) => {
    if (!order.items || order.items.length === 0) return;
    setReorderingId(order._id);
    try {
      for (const item of order.items) {
        const prodId = item.productId?._id || item.productId;
        await addToCart(prodId, item.quantity || 1);
      }
      showToast('Items from order added to cart!', 'success');
      navigate('/app/cart');
    } catch (err) {
      showToast('Could not reorder all items', 'error');
    } finally {
      setReorderingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* ── Top Header Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              My Orders & Receipts
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
              {myOrders.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time fulfillment tracking, delivery records, invoices, and rapid reorders
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
        

          <button
            type="button"
            onClick={() => navigate('/app/shop')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
       
     

      {/* ── KPI Strip ── */}
      
         

            {/* Search Input */}
            <div className="relative sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search orders, items, cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500 shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      

      {/* ── Orders List ── */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((ord) => {
            const isOrdered = ord.orderStatus === 'Ordered';
            const isDelivered = ord.orderStatus === 'Delivered';
            const isCancelled = ord.orderStatus === 'Cancelled';

            return (
              <div
                key={ord._id}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow duration-200 space-y-4"
              >
                {/* ── Order Header Row ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {/* Order ID Badge with copy */}
                    <button
                      type="button"
                      onClick={() => handleCopyOrderId(ord._id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 font-mono font-bold text-xs text-slate-800 transition-colors cursor-pointer"
                      title="Click to copy full Order ID"
                    >
                      <span>#{ord._id.slice(-8)}</span>
                      {copiedId === ord._id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400" />
                      )}
                    </button>

                    <span className="text-xs text-slate-400 font-medium">
                      Placed on{' '}
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    {/* Payment Badge */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-50 border border-slate-200 text-slate-600">
                      <CreditCard className="w-3 h-3" />
                      <span>{ord.paymentMethod}</span>
                      <span className="text-slate-400">•</span>
                      <span className={ord.paymentStatus === 'Completed' ? 'text-emerald-700' : 'text-amber-700'}>
                        {ord.paymentStatus}
                      </span>
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
                        isDelivered
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : isCancelled
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : 'bg-blue-50 text-blue-800 border-blue-300'
                      }`}
                    >
                      {isDelivered && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {isCancelled && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                      {isOrdered && <Clock className="w-3.5 h-3.5 text-blue-600" />}
                      <span>{ord.orderStatus}</span>
                    </span>
                  </div>
                </div>

                {/* ── Order Body (Items & Delivery Grid) ── */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                  {/* Items List (Col 7) */}
                  <div className="md:col-span-7 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Purchased Produce ({ord.items?.length || 0})
                    </span>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {ord.items?.map((item, idx) => {
                        const imgSrc =
                          item.image ||
                          'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=120&q=80';

                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
                          >
                            <img
                              src={imgSrc}
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-cover shrink-0 bg-white"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-slate-900 truncate">{item.name || 'Product'}</div>
                              <div className="text-slate-500 text-[11px] mt-0.5">
                                ₹{item.price} <span className="text-slate-400">/{item.unit || 'kg'}</span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-mono text-slate-500 block text-[11px]">
                                Qty: {item.quantity}
                              </span>
                              <span className="font-black text-slate-900 text-xs mt-0.5 block">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delivery & Billing Summary (Col 5) */}
                  <div className="md:col-span-5 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
                    <div>
                      <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Delivery Address</span>
                      </div>
                      <div className="font-bold text-slate-900 leading-tight">
                        {ord.deliveryAddress?.recipientName}
                      </div>
                      <div className="text-slate-600 text-[11px] leading-relaxed mt-0.5">
                        {ord.deliveryAddress?.addressLine}, {ord.deliveryAddress?.city},{' '}
                        {ord.deliveryAddress?.state} - {ord.deliveryAddress?.postalCode}
                      </div>
                      <div className="text-slate-400 font-mono text-[11px] mt-0.5">
                        Phone: {ord.deliveryAddress?.phone}
                      </div>
                    </div>

                    <div className="border-t border-slate-200/80 pt-2.5 space-y-1 text-[11px]">
                      <div className="flex justify-between text-slate-600">
                        <span>Items Subtotal:</span>
                        <span className="font-medium">₹{ord.itemsTotal || ord.totalAmount}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Delivery Fee:</span>
                        <span className="font-medium">
                          {Number(ord.deliveryCharge) > 0 ? `₹${ord.deliveryCharge}` : 'FREE'}
                        </span>
                      </div>
                      <div className="flex justify-between font-black text-slate-900 text-xs pt-1 border-t border-slate-200">
                        <span>Total Paid / Due:</span>
                        <span className="text-emerald-700 text-sm">₹{ord.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Order Footer Actions ── */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {/* View Invoice Button */}
                    <button
                      type="button"
                      onClick={() => setActiveInvoiceOrder(ord)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Receipt className="w-3.5 h-3.5 text-slate-500" />
                      <span>Receipt & Invoice</span>
                    </button>

                    {/* Reorder Button */}
                    <button
                      type="button"
                      onClick={() => handleReorder(ord)}
                      disabled={reorderingId === ord._id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 hover:bg-emerald-50 text-emerald-800 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${reorderingId === ord._id ? 'animate-spin' : ''}`} />
                      <span>Order Again</span>
                    </button>
                  </div>

                  {/* Cancel Order Action */}
                  {isOrdered && (
                    <button
                      type="button"
                      onClick={() => cancelOrder(ord._id)}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : myOrders.length > 0 ? (
        /* Empty Filter Search Results */
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-6 space-y-3">
          <Search className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No orders match your filter</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            We couldn't find any orders matching "{searchQuery}" under status "{statusFilter}".
          </p>
          <button
            type="button"
            onClick={() => {
              setStatusFilter('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Zero Orders Overall Empty State */
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">No orders placed yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
              When you purchase farm-fresh produce or groceries from Sandhai, your invoices and live tracking will appear right here.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/app/shop')}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Market Catalog</span>
          </button>
        </div>
      )}

      {/* ── Printable Invoice Slip Modal ── */}
      {activeInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative my-8">
            {/* Modal Actions */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                  S
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base leading-tight">Order Invoice</h3>
                  <span className="font-mono text-xs text-slate-400">#{activeInvoiceOrder._id}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  title="Print invoice slip"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInvoiceOrder(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Receipt Content */}
            <div className="space-y-4 text-xs">
              {/* Meta strip */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Date of Issue</span>
                  <span className="font-bold text-slate-900">
                    {new Date(activeInvoiceOrder.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Status & Payment</span>
                  <span className="font-bold text-slate-900">
                    {activeInvoiceOrder.orderStatus} • {activeInvoiceOrder.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Delivery Address Details */}
              <div className="border border-slate-100 rounded-2xl p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Billed & Shipped To</span>
                <div className="font-bold text-slate-900">{activeInvoiceOrder.deliveryAddress?.recipientName}</div>
                <div className="text-slate-600 text-[11px]">
                  {activeInvoiceOrder.deliveryAddress?.addressLine}, {activeInvoiceOrder.deliveryAddress?.city},{' '}
                  {activeInvoiceOrder.deliveryAddress?.state} - {activeInvoiceOrder.deliveryAddress?.postalCode}
                </div>
                <div className="text-slate-400 font-mono text-[11px]">
                  Phone: {activeInvoiceOrder.deliveryAddress?.phone}
                </div>
              </div>

              {/* Itemized Table */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-500">
                    <tr>
                      <th className="p-3">Item</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Price</th>
                      <th className="p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeInvoiceOrder.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-medium text-slate-800">
                          {item.name}{' '}
                          <span className="text-[10px] text-slate-400">({item.unit || 'kg'})</span>
                        </td>
                        <td className="p-3 text-center font-mono">{item.quantity}</td>
                        <td className="p-3 text-right font-mono text-slate-600">₹{item.price}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Invoice Calculations */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">₹{activeInvoiceOrder.itemsTotal || activeInvoiceOrder.totalAmount}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charges:</span>
                  <span className="font-mono">
                    {Number(activeInvoiceOrder.deliveryCharge) > 0 ? `₹${activeInvoiceOrder.deliveryCharge}` : 'FREE'}
                  </span>
                </div>
                <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total:</span>
                  <span className="text-emerald-700 font-mono text-base">₹{activeInvoiceOrder.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Note */}
            <p className="text-[11px] text-center text-slate-400">
              Thank you for supporting local farmers and artisans via Sandhai Marketplace Arena.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
