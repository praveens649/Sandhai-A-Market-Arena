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
  Pencil,
} from 'lucide-react';

const KadaiCartView = ({
  cart,
  coupon,
  subtotal = 0,
  discountAmount = 0,
  shippingFee = 0,
  totalAmount = 0,
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
  onEditAddress,
  onDeleteAddress,
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
  const totalItemCount = cart?.totalItems || items.reduce((acc, i) => acc + (i.quantity || 1), 0);

  // Safe numerical calculations
  const safeSubtotal = Number(subtotal || 0);
  const safeDiscount = Number(discountAmount || 0);
  const safeShipping = Number(shippingFee || 0);
  const safeTotal = Number(totalAmount || 0);

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
    <div className="space-y-6 w-full max-w-full">
      {/* Header (Page 6: Shopping cart (N items) ← Continue shopping) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Shopping cart <span className="text-slate-400 font-normal text-lg">({totalItemCount} items)</span>
        </h2>
        <button
          onClick={onContinueShopping}
          className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue shopping</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 w-full items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-4 min-w-0 w-full">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
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
              {items.map((item, idx) => {
                // Robust extraction: supports populated item.product and flat item formats
                const productObj =
                  item.product && typeof item.product === 'object'
                    ? item.product
                    : item.productId && typeof item.productId === 'object'
                    ? item.productId
                    : {};

                const pId =
                  productObj._id ||
                  (typeof item.product === 'string' ? item.product : null) ||
                  (typeof item.productId === 'string' ? item.productId : null) ||
                  item._id;

                const name = productObj.name || item.name || 'Fresh Produce Item';
                const price = Number(productObj.price ?? item.price ?? 0);
                const unit = productObj.unit || item.unit || 'kg';
                const image =
                  productObj.image ||
                  item.image ||
                  'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=120';
                const categoryName =
                  productObj.category?.name ||
                  (typeof productObj.category === 'string' ? productObj.category : null) ||
                  item.category?.name ||
                  'PRODUCE';
                const quantity = Number(item.quantity || 1);
                const lineTotal = price * quantity;

                return (
                  <div key={pId || idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <img
                        src={image}
                        alt={name}
                        className="w-16 h-16 rounded-2xl object-cover bg-slate-100 shrink-0 border border-slate-200/60"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-slate-900 text-sm leading-snug truncate">{name}</h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mt-0.5">
                          {categoryName}
                        </span>
                        <div className="text-xs text-slate-500 mt-1 font-medium">
                          ₹{price} <span className="text-[10px] text-slate-400">/{unit} each</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                      {/* Stepper − N + */}
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(pId, quantity - 1)}
                          className="p-1.5 hover:bg-white rounded-l-xl text-slate-600 cursor-pointer transition-colors"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-black text-slate-900 min-w-6 text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(pId, quantity + 1)}
                          className="p-1.5 hover:bg-white rounded-r-xl text-slate-600 cursor-pointer transition-colors"
                          title="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <span className="font-black text-slate-900 text-sm w-20 text-right">
                        ₹{lineTotal.toFixed(2)}
                      </span>

                      {/* Remove Trash Button */}
                      <button
                        type="button"
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
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Delivery Address
              </span>
              <button
                type="button"
                onClick={onOpenAddressModal}
                className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                + Add New Address
              </button>
            </div>

            {addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((a) => (
                  <div
                    key={a._id}
                    onClick={() => onSelectAddress(a._id)}
                    className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                      selectedAddressId === a._id
                        ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between font-bold text-slate-900 gap-2">
                        <span className="truncate">{a.recipientName}</span>
                        <input
                          type="radio"
                          name="deliveryAddress"
                          checked={selectedAddressId === a._id}
                          onChange={() => onSelectAddress(a._id)}
                          onClick={(e) => e.stopPropagation()}
                          className="text-emerald-600 cursor-pointer mt-0.5 shrink-0"
                        />
                      </div>
                      <div className="text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {a.addressLine}, {a.city}, {a.state} - {a.postalCode}
                      </div>
                      <div className="text-slate-400 font-mono mt-1 text-[11px]">{a.phone}</div>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 mt-3 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditAddress && onEditAddress(a);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                        title="Edit address"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteAddress && onDeleteAddress(a._id);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete address"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAddressModal}
                className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 text-slate-600 font-bold text-xs cursor-pointer"
              >
                + Add a Delivery Address
              </button>
            )}
          </div>
        </div>

        {/* Right: Order Summary (Page 6) */}
        <div className="space-y-4 min-w-0 w-full">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
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
                  className="flex-1 min-w-0 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 uppercase font-semibold outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-800 transition-colors cursor-pointer shrink-0"
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
                <span className="font-bold text-slate-900">₹{safeSubtotal.toFixed(2)}</span>
              </div>

              {coupon?.isValid && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon ({coupon.code})</span>
                  <span>-₹{safeDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-slate-900">
                  {safeShipping === 0 ? (
                    <span className="text-emerald-700 uppercase">FREE</span>
                  ) : (
                    `₹${safeShipping.toFixed(2)}`
                  )}
                </span>
              </div>

              {/* Grand Total */}
              <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                <span className="font-black text-slate-900 text-sm">Total</span>
                <span className="text-2xl font-black text-slate-900">
                  ₹{safeTotal.toFixed(2)}
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
