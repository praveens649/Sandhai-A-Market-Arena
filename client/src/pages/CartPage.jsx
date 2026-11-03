import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import KadaiCartView from '../_components/KadaiCartView';
import { X } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cart,
    coupon,
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    applyCouponCode,
    removeCoupon,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    paymentMethod,
    setPaymentMethod,
    placeOrder,
    addAddress,
    updateAddress,
    deleteAddress,
  } = useStore();

  const [actionLoading, setActionLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    recipientName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    isDefault: false,
  });

  const handleCheckout = async () => {
    setActionLoading(true);
    const res = await placeOrder();
    setActionLoading(false);
    if (res.success) {
      navigate('/app/orders');
    }
  };

  const handleOpenCreateAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      recipientName: '',
      phone: '',
      addressLine: '',
      city: '',
      state: '',
      postalCode: '',
      isDefault: false,
    });
    setShowAddressModal(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddress(addr);
    setAddressForm({
      recipientName: addr.recipientName || '',
      phone: addr.phone || '',
      addressLine: addr.addressLine || '',
      city: addr.city || '',
      state: addr.state || '',
      postalCode: addr.postalCode || '',
      isDefault: Boolean(addr.isDefault),
    });
    setShowAddressModal(true);
  };

  const handleDeleteAddress = async (id) => {
    await deleteAddress(id);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (editingAddress) {
      const res = await updateAddress(editingAddress._id, addressForm);
      if (res.success) {
        setShowAddressModal(false);
        setEditingAddress(null);
      }
    } else {
      const res = await addAddress(addressForm);
      if (res.success) {
        setShowAddressModal(false);
      }
    }
  };

  return (
    <div>
      <KadaiCartView
        cart={cart}
        coupon={coupon}
        subtotal={subtotal}
        discountAmount={discountAmount}
        shippingFee={shippingFee}
        totalAmount={totalAmount}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        onApplyCoupon={applyCouponCode}
        onRemoveCoupon={removeCoupon}
        onContinueShopping={() => navigate('/app/shop')}
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        onSelectAddress={setSelectedAddressId}
        onOpenAddressModal={handleOpenCreateAddress}
        onEditAddress={handleOpenEditAddress}
        onDeleteAddress={handleDeleteAddress}
        paymentMethod={paymentMethod}
        onSelectPaymentMethod={setPaymentMethod}
        onCheckout={handleCheckout}
        actionLoading={actionLoading}
      />

      {/* Address Create/Edit Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg">
                {editingAddress ? 'Edit Delivery Address' : 'New Delivery Address'}
              </h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={addressForm.recipientName}
                  onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  placeholder="9876543210"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Address Line</label>
                <input
                  type="text"
                  required
                  value={addressForm.addressLine}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })}
                  placeholder="Flat No, Street, Landmark"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    placeholder="Chennai"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    placeholder="600001"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  placeholder="Tamil Nadu"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer mt-2"
              >
                {editingAddress ? 'Save Changes' : 'Save Delivery Address'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

