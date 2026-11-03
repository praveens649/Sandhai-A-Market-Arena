import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Truck,
  Sparkles,
} from 'lucide-react';

const KadaiCartView = ({
  cart,
  coupon,
  subtotal,
  discountAmount,
  shippingFee,
  totalAmount,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onApplyCoupon,
  onRemoveCoupon,
  onContinueShopping,
  // Checkout & Address Integration
  addresses = [],
  selectedAddressId,
  onSelectAddress,
  onOpenAddressModal,
  paymentMethod,
  onSelectPaymentMethod,
  onCheckout,
  actionLoading = false,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState(null);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = onApplyCoupon(couponInput);
    setCouponFeedback(res);
  };

  const items = cart?.items || [];
  const totalItemCount = cart?.totalItems || 0;

  if (items.length === 0) {
    return (
      <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 p-6 max-w-xl mx-auto my-8 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-slate-900">Your cart is empty</h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
          Looks like you haven't added any fresh produce to your cart yet. Explore our catalog!
        </p>
        <button
          onClick={onContinueShopping}
          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Start Shopping</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header (Page 6: Shopping cart (N items) ← Continue shopping) */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Shopping cart <span className="text-slate-400 font-normal text-lg">({totalItemCount} items)</span>
        </h2>
        <button
          onClick={onContinueShopping}
          className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue shopping</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                PRODUCT
              </span>
              <button
                onClick={onClearCart}
                className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Clear cart
              </button>
            </div>

            {/* Item Rows */}
            <div className="divide-y divide-slate-100">
              {items.map((item) => {
                const pId = item.productId?._id || item.productId;
                return (
                  <div key={pId} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=120'}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-snug">{item.name}</h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mt-0.5">
                          {item.category?.name || 'Produce'}
                        </span>
                        <div className="text-xs text-slate-500 mt-1">₹{item.price} each</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5">
                      {/* Stepper − N + */}
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                        <button
                          onClick={() => onUpdateQuantity(pId, item.quantity - 1)}
                          className="p-1.5 hover:bg-white rounded-l-xl text-slate-600 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-black text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(pId, item.quantity + 1)}
                          className="p-1.5 hover:bg-white rounded-r-xl text-slate-600 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <span className="font-black text-slate-900 text-sm w-16 text-right">
                        ₹{item.price * item.quantity}
                      </span>

                      {/* Remove Trash Button */}
                      <button
                        onClick={() => onRemoveItem(pId)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Address Integration */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Delivery Address
              </span>
              <button
                onClick={onOpenAddressModal}
                className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                + Add New Address
              </button>
            </div>

            {addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {addresses.map((a) => (
                  <label
                    key={a._id}
                    className={`block p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                      selectedAddressId === a._id
                        ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{a.recipientName}</span>
                      <input
                        type="radio"
                        name="deliveryAddress"
                        checked={selectedAddressId === a._id}
                        onChange={() => onSelectAddress(a._id)}
                        className="text-emerald-600"
                      />
                    </div>
                    <div className="text-slate-500 mt-1 line-clamp-1">{a.addressLine}, {a.city}</div>
                    <div className="text-slate-400 font-mono mt-0.5">{a.phone}</div>
                  </label>
                ))}
              </div>
            ) : (
              <button
                onClick={onOpenAddressModal}
                className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 text-slate-600 font-bold text-xs cursor-pointer"
              >
                + Add a Delivery Address
              </button>
            )}
          </div>
        </div>

        {/* Right: Order Summary (Page 6) */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <h3 className="font-black text-slate-900 text-lg">Order summary</h3>

            {/* Coupon Code Input (Page 6) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Coupon code
              </label>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. SAVE10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 uppercase font-semibold outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {/* Coupon Feedback Message (Page 1 & 6) */}
              {couponFeedback && (
                <div
                  className={`text-xs font-bold flex items-center gap-1.5 ${
                    couponFeedback.isValid ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {couponFeedback.isValid ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>{couponFeedback.message}</span>
                </div>
              )}
            </div>

            {/* Financial Breakdown (Page 6) */}
            <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <div className="flex justify-between">
                <span>Subtotal ({totalItemCount} items)</span>
                <span className="font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
              </div>

              {coupon.isValid && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon ({coupon.code})</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-slate-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 uppercase">FREE</span>
                  ) : (
                    `₹${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>

              {/* Grand Total */}
              <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                <span className="font-black text-slate-900 text-sm">Total</span>
                <span className="text-2xl font-black text-slate-900">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-2">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Payment Method
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onSelectPaymentMethod('COD')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    paymentMethod === 'COD'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  Cash on Delivery
                </button>
                <button
                  type="button"
                  onClick={() => onSelectPaymentMethod('Online')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    paymentMethod === 'Online'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  Online / UPI
                </button>
              </div>
            </div>

            {/* Proceed to Checkout CTA (Page 6) */}
            <button
              onClick={onCheckout}
              disabled={actionLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {actionLoading ? 'Processing Order...' : 'Proceed to checkout'}
            </button>

            <p className="text-[11px] text-slate-400 text-center">
              Prices in INR. The cart is saved after refresh.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KadaiCartView;

