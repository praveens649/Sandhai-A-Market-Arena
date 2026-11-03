import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../api/client';
import {
  Package,
  Users,
  ShoppingBag,
  IndianRupee,
  Search,
  ShoppingCart,
  Heart,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  Tag,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Truck
} from 'lucide-react';

const MainApp = () => {
  const { user, isAdmin } = useAuth();
  
  // Navigation tab state
  const [activeTab, setActiveTab] = useState('shop'); // 'shop', 'cart', 'wishlist', 'orders', 'addresses'
  
  // Data states
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cart & Wishlist states
  const [cart, setCart] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  
  // Orders & Addresses states
  const [myOrders, setMyOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  
  // Admin stats
  const [adminStats, setAdminStats] = useState(null);
  
  // Loading & Alert states
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Address modal form
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipientName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    isDefault: false,
  });

  const showToast = (message, type = 'success') => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  // 1. Initial Data Fetching
  const loadInitialData = async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        const res = await api.get('/api/admin/dashboard');
        if (res.data.success) {
          setAdminStats(res.data.dashboard);
        }
      } else {
        // Customer fetch
        const [catRes, prodRes, cartRes, wishRes, addrRes, orderRes] = await Promise.all([
          api.get('/api/categories'),
          api.get('/api/products?limit=50'),
          api.get('/api/cart').catch(() => ({ data: { cart: null } })),
          api.get('/api/wishlist').catch(() => ({ data: { wishlist: { products: [] } } })),
          api.get('/api/addresses').catch(() => ({ data: { addresses: [] } })),
          api.get('/api/orders/my-orders').catch(() => ({ data: { orders: [] } })),
        ]);

        if (catRes.data.success) setCategories(catRes.data.categories);
        if (prodRes.data.success) setProducts(prodRes.data.products);
        if (cartRes.data.success) setCart(cartRes.data.cart);
        if (wishRes.data.success) setWishlist(wishRes.data.wishlist.products || []);
        if (addrRes.data.success) {
          setAddresses(addrRes.data.addresses || []);
          const def = addrRes.data.addresses.find((a) => a.isDefault) || addrRes.data.addresses[0];
          if (def) setSelectedAddressId(def._id);
        }
        if (orderRes.data.success) setMyOrders(orderRes.data.orders || []);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [isAdmin]);

  // 2. Cart Operations
  const handleAddToCart = async (productId, quantity = 1) => {
    setActionLoading(true);
    try {
      const res = await api.post('/api/cart/items', { productId, quantity });
      if (res.data.success) {
        setCart(res.data.cart);
        showToast('Item added to cart!');
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      const res = await api.patch(`/api/cart/items/${productId}`, { quantity });
      if (res.data.success) {
        setCart(res.data.cart);
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const res = await api.delete(`/api/cart/items/${productId}`);
      if (res.data.success) {
        setCart(res.data.cart);
        showToast('Item removed from cart');
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    }
  };

  // 3. Wishlist Operations
  const handleToggleWishlist = async (productId) => {
    const isSaved = wishlist.some((p) => (p._id || p) === productId);
    try {
      if (isSaved) {
        const res = await api.delete(`/api/wishlist/items/${productId}`);
        if (res.data.success) {
          setWishlist(res.data.wishlist.products || []);
          showToast('Removed from wishlist');
        }
      } else {
        const res = await api.post('/api/wishlist/items', { productId });
        if (res.data.success) {
          setWishlist(res.data.wishlist.products || []);
          showToast('Added to wishlist!');
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    }
  };

  // 4. Address Creation
  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/addresses', newAddress);
      if (res.data.success) {
        setAddresses([res.data.address, ...addresses]);
        setSelectedAddressId(res.data.address._id);
        setShowAddressModal(false);
        setNewAddress({
          recipientName: '',
          phone: '',
          addressLine: '',
          city: '',
          state: '',
          postalCode: '',
          isDefault: false,
        });
        showToast('Delivery address saved!');
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    }
  };

  // 5. Checkout & Place Order
  const handleCheckout = async () => {
    if (!selectedAddressId) {
      showToast('Please select or add a delivery address first', 'error');
      return;
    }
    setActionLoading(true);
    try {
      const res = await api.post('/api/orders', {
        addressId: selectedAddressId,
        paymentMethod,
      });
      if (res.data.success) {
        showToast('Order placed successfully! Thank you for ordering from Sandhai.');
        setCart({ items: [], subtotal: 0, totalItems: 0 });
        // Refresh orders
        const orderRes = await api.get('/api/orders/my-orders');
        if (orderRes.data.success) setMyOrders(orderRes.data.orders);
        setActiveTab('orders');
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (p.category?._id || p.category) === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar with High-Visibility Logout Button */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        cartCount={cart?.totalItems || 0}
        wishlistCount={wishlist?.length || 0}
      />

      {/* Floating Feedback Notification */}
      {feedback.message && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-bold border ${
            feedback.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-300'
              : 'bg-emerald-50 text-emerald-800 border-emerald-300'
          }`}>
            {feedback.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        </div>
      )}

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* ========================================================================= */}
        {/* ============================= ADMIN VIEW ================================ */}
        {/* ========================================================================= */}
        {isAdmin ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 rounded-3xl text-white p-8 shadow-xl shadow-amber-950/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-bold mb-3 backdrop-blur-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Administrator Control Center</span>
                  </div>
                  <h1 className="text-3xl font-black tracking-tight">Admin Overview</h1>
                  <p className="text-amber-100/80 text-sm mt-1 max-w-xl">
                    Manage categories, products, customer accounts, and order fulfillment in the Sandhai Marketplace.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-right">
                  <div className="text-xs font-semibold text-amber-200">Database Status</div>
                  <div className="text-sm font-bold text-white flex items-center gap-2 justify-end mt-0.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>MongoDB Atlas Live</span>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center text-slate-400 font-semibold">
                Loading administrative statistics...
              </div>
            ) : adminStats ? (
              <>
                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900">{adminStats.totalProducts}</div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Active Products</div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900">{adminStats.totalUsers}</div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Registered Customers</div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900">{adminStats.totalOrders}</div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Total Orders Placed</div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <IndianRupee className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900">
                        ₹{adminStats.totalSales?.toLocaleString('en-IN') || 0}
                      </div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Total Revenue</div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders Overview */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Recent Customer Orders</h3>
                      <p className="text-xs text-slate-500">Live order transactions processed through Sandhai</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {adminStats.recentOrders?.length || 0} Orders
                    </span>
                  </div>

                  {adminStats.recentOrders?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 font-bold text-xs uppercase border-b border-slate-200">
                          <tr>
                            <th className="py-3 px-4">Order ID</th>
                            <th className="py-3 px-4">Customer</th>
                            <th className="py-3 px-4">Items</th>
                            <th className="py-3 px-4">Amount</th>
                            <th className="py-3 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                          {adminStats.recentOrders.map((ord) => (
                            <tr key={ord._id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                                #{ord._id.slice(-6)}
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-slate-900">
                                  {ord.user?.name || ord.deliveryAddress?.recipientName}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {ord.user?.email || ord.deliveryAddress?.phone}
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-xs">
                                {ord.items?.length || 0} product(s)
                              </td>
                              <td className="py-3.5 px-4 font-bold text-slate-900">
                                ₹{ord.totalAmount}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                  ord.orderStatus === 'Delivered'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : ord.orderStatus === 'Processing'
                                    ? 'bg-sky-100 text-sky-800'
                                    : ord.orderStatus === 'Cancelled'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {ord.orderStatus}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-400 font-medium">
                      No orders placed yet.
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        ) : (
          /* ========================================================================= */
          /* =========================== CUSTOMER VIEW =============================== */
          /* ========================================================================= */
          <div className="space-y-8">
            
            {/* 1. SHOP TAB */}
            {activeTab === 'shop' && (
              <>
                {/* Hero Promotional Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 text-white p-8 sm:p-10 shadow-xl shadow-emerald-950/20">
                  <div className="relative z-10 max-w-2xl space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-bold backdrop-blur-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Direct Farm-to-Table Marketplace</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                      Fresh Produce, Handpicked Daily.
                    </h1>
                    <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
                      Shop 100% organic fruits, farm-fresh vegetables, dairy, and grocery staples directly sourced from farmers.
                    </p>
                    <div className="pt-2 flex items-center gap-3 text-xs font-semibold text-emerald-200">
                      <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                        <Truck className="w-4 h-4 text-emerald-300" />
                        <span>Free Delivery on orders over ₹500</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative backdrop shapes */}
                  <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />
                </div>

                {/* Search & Category Filter Section */}
                <div className="space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search crisp apples, farm tomatoes, milk, organic rice..."
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200/90 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-xs outline-none text-sm text-slate-800 transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        selectedCategory === 'all'
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                      }`}
                    >
                      All Categories ({products.length})
                    </button>

                    {categories.map((cat) => {
                      const count = products.filter((p) => (p.category?._id || p.category) === cat._id).length;
                      return (
                        <button
                          key={cat._id}
                          onClick={() => setSelectedCategory(cat._id)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                            selectedCategory === cat._id
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                          }`}
                        >
                          <span>{cat.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                            selectedCategory === cat._id ? 'bg-emerald-800/60 text-emerald-100' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Product Grid */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">Available Farm Produce</h2>
                    <span className="text-xs font-bold text-slate-500">{filteredProducts.length} items found</span>
                  </div>

                  {loading ? (
                    <div className="py-20 text-center text-slate-400 font-semibold">
                      Loading fresh items from MongoDB...
                    </div>
                  ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {filteredProducts.map((prod) => {
                        const inWishlist = wishlist.some((p) => (p._id || p) === prod._id);
                        return (
                          <div
                            key={prod._id}
                            className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col group"
                          >
                            {/* Product Image Box */}
                            <div className="relative h-44 bg-slate-100 overflow-hidden">
                              {prod.image ? (
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                  <Package className="w-12 h-12" />
                                </div>
                              )}

                              {/* Wishlist Toggle Button */}
                              <button
                                onClick={() => handleToggleWishlist(prod._id)}
                                className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-all cursor-pointer ${
                                  inWishlist
                                    ? 'bg-rose-50 text-rose-600'
                                    : 'bg-white/80 text-slate-400 hover:text-rose-600 hover:bg-white'
                                }`}
                                title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                              >
                                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600' : ''}`} />
                              </button>

                              {/* Category Badge */}
                              <div className="absolute bottom-3 left-3">
                                <span className="bg-slate-900/75 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                                  {prod.category?.name || 'Produce'}
                                </span>
                              </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-4 flex-1 flex flex-col justify-between">
                              <div>
                                <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-700 transition-colors">
                                  {prod.name}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                  {prod.description}
                                </p>
                              </div>

                              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                                <div>
                                  <div className="text-lg font-black text-slate-900 leading-tight">
                                    ₹{prod.price}
                                    <span className="text-xs font-semibold text-slate-400 ml-1">/ {prod.unit || 'kg'}</span>
                                  </div>
                                  <div className="text-[10px] font-bold text-emerald-600">
                                    {prod.stock > 0 ? `${prod.stock} in stock` : 'Out of stock'}
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleAddToCart(prod._id, 1)}
                                  disabled={actionLoading || prod.stock <= 0}
                                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-xs transition-all duration-150 cursor-pointer disabled:opacity-50"
                                >
                                  <ShoppingCart className="w-3.5 h-3.5" />
                                  <span>Add</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8">
                      <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <h4 className="font-bold text-slate-800 text-base">No items match your criteria</h4>
                      <p className="text-xs text-slate-500 mt-1">Try another category or clear your search query.</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* 2. CART TAB */}
            {activeTab === 'cart' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Shopping Cart</h2>
                    <p className="text-xs text-slate-500">Review selected produce and proceed to checkout</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('shop')}
                    className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span>Continue shopping</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {cart && cart.items?.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-3">
                      {cart.items.map((item) => (
                        <div
                          key={item.product?._id}
                          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                              {item.product?.image ? (
                                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                  <Package className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">{item.product?.name}</h4>
                              <div className="text-xs font-semibold text-slate-500 mt-0.5">
                                ₹{item.product?.price} / {item.product?.unit || 'kg'}
                              </div>
                              <div className="text-xs font-extrabold text-emerald-700 mt-1">
                                Subtotal: ₹{(item.product?.price || 0) * item.quantity}
                              </div>
                            </div>
                          </div>

                          {/* Quantity Controls & Remove */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
                              <button
                                onClick={() => handleUpdateQuantity(item.product?._id, item.quantity - 1)}
                                className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-bold px-1.5 text-slate-900">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.product?._id, item.quantity + 1)}
                                className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemoveFromCart(item.product?._id)}
                              className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary & Address Checkout Panel */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5 h-fit">
                      <h3 className="text-base font-black text-slate-900">Order Summary</h3>

                      <div className="space-y-2.5 text-sm text-slate-600 border-b border-slate-100 pb-4">
                        <div className="flex justify-between">
                          <span>Items Subtotal</span>
                          <span className="font-bold text-slate-900">₹{cart.subtotal}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1">
                            <span>Delivery Fee</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                              {cart.subtotal >= 500 ? 'FREE' : '₹40'}
                            </span>
                          </span>
                          <span className="font-bold text-slate-900">
                            {cart.subtotal >= 500 ? '₹0' : '₹40'}
                          </span>
                        </div>
                        {cart.subtotal < 500 && (
                          <p className="text-[11px] text-amber-700 font-medium">
                            Add ₹{500 - cart.subtotal} more to unlock <strong>FREE Delivery</strong>!
                          </p>
                        )}
                        <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                          <span>Total Amount</span>
                          <span className="text-emerald-700">
                            ₹{cart.subtotal + (cart.subtotal >= 500 ? 0 : 40)}
                          </span>
                        </div>
                      </div>

                      {/* Delivery Address Choice */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            Delivery Address
                          </label>
                          <button
                            onClick={() => setShowAddressModal(true)}
                            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                          >
                            + New Address
                          </button>
                        </div>

                        {addresses.length > 0 ? (
                          <select
                            value={selectedAddressId}
                            onChange={(e) => setSelectedAddressId(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500"
                          >
                            {addresses.map((a) => (
                              <option key={a._id} value={a._id}>
                                {a.recipientName} - {a.addressLine}, {a.city} ({a.postalCode})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="text-xs text-rose-600 font-semibold p-2 bg-rose-50 rounded-lg border border-rose-200">
                            Please add a delivery address below before checkout.
                          </div>
                        )}
                      </div>

                      {/* Payment Method */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Payment Method
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {['COD', 'UPI'].map((method) => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setPaymentMethod(method)}
                              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                paymentMethod === method
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                                  : 'bg-white border-slate-200 text-slate-600'
                              }`}
                            >
                              {method === 'COD' ? 'Cash on Delivery' : 'Online UPI'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={handleCheckout}
                        disabled={actionLoading || !selectedAddressId}
                        className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {actionLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Place Order Now</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 p-8">
                    <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-800 text-base">Your cart is empty</h3>
                    <p className="text-xs text-slate-500 mt-1 mb-5">Browse the market and add fresh goods to your cart.</p>
                    <button
                      onClick={() => setActiveTab('shop')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs transition-all"
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 3. WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Saved Favorites</h2>
                  <p className="text-xs text-slate-500">Products you have bookmarked for easy reordering</p>
                </div>

                {wishlist.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {wishlist.map((prod) => (
                      <div
                        key={prod._id}
                        className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs p-4 flex flex-col justify-between"
                      >
                        <div className="relative h-40 bg-slate-100 rounded-2xl overflow-hidden mb-3">
                          {prod.image ? (
                            <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Package className="w-10 h-10" />
                            </div>
                          )}
                          <button
                            onClick={() => handleToggleWishlist(prod._id)}
                            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 text-rose-600 flex items-center justify-center shadow-xs cursor-pointer"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{prod.name}</h4>
                          <div className="text-sm font-extrabold text-slate-900 mt-1">
                            ₹{prod.price} <small className="text-slate-400 font-normal">/ {prod.unit || 'kg'}</small>
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddToCart(prod._id, 1)}
                          className="mt-4 w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Move to Cart</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 p-8">
                    <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-800 text-base">Your wishlist is empty</h3>
                    <p className="text-xs text-slate-500 mt-1">Save your favorite seasonal items by tapping the heart icon.</p>
                  </div>
                )}
              </div>
            )}

            {/* 4. ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Order History</h2>
                  <p className="text-xs text-slate-500">Track and view your recent farm grocery orders</p>
                </div>

                {myOrders.length > 0 ? (
                  <div className="space-y-4">
                    {myOrders.map((ord) => (
                      <div
                        key={ord._id}
                        className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                          <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order ID</div>
                            <div className="font-mono font-bold text-sm text-slate-900">#{ord._id}</div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              ord.orderStatus === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.orderStatus === 'Processing'
                                ? 'bg-sky-100 text-sky-800'
                                : ord.orderStatus === 'Cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {ord.orderStatus}
                            </span>
                            <span className="text-xs text-slate-400">
                              {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Order Items Snapshot */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                              <div className="w-10 h-10 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <Package className="w-4 h-4" />
                                  </div>
                                )}
                              </div>
                              <div className="text-xs">
                                <div className="font-bold text-slate-900">{item.name}</div>
                                <div className="text-slate-500">
                                  {item.quantity} {item.unit || 'kg'} × ₹{item.price}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer & Total */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="text-slate-500">
                            Deliver to: <strong>{ord.deliveryAddress?.recipientName}</strong>, {ord.deliveryAddress?.addressLine}, {ord.deliveryAddress?.city}
                          </div>
                          <div className="text-right">
                            <span className="text-slate-500 mr-2">Total Paid:</span>
                            <span className="text-base font-black text-emerald-700">₹{ord.totalAmount}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 p-8">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-800 text-base">No orders placed yet</h3>
                    <p className="text-xs text-slate-500 mt-1">Your orders will appear here once you make your first purchase.</p>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Inline Address Creation Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg">New Delivery Address</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={newAddress.recipientName}
                  onChange={(e) => setNewAddress({ ...newAddress, recipientName: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  placeholder="9876543210"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Address Line</label>
                <input
                  type="text"
                  required
                  value={newAddress.addressLine}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
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
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    placeholder="Chennai"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
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
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  placeholder="Tamil Nadu"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer mt-2"
              >
                Save Delivery Address
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MainApp;
