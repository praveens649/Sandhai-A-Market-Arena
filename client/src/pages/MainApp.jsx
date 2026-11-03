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
  Truck,
  Edit,
  X,
  UserCheck,
  UserX,
  Filter,
  Check,
  RefreshCw,
  Tags
} from 'lucide-react';

const MainApp = () => {
  const { user, isAdmin } = useAuth();

  // Tab state: Admin defaults to 'overview', customer defaults to 'shop'
  const [activeTab, setActiveTab] = useState(isAdmin ? 'overview' : 'shop');

  // Shared data states
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Customer states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Admin states
  const [adminStats, setAdminStats] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    unit: 'kg',
    stock: '',
    image: '',
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image: '',
  });

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

  // Sync initial tab when role changes
  useEffect(() => {
    setActiveTab(isAdmin ? 'overview' : 'shop');
  }, [isAdmin]);

  // Initial Data Fetching
  const loadData = async () => {
    setLoading(true);
    try {
      // Both admin and customers need categories and products
      const [catRes, prodRes] = await Promise.all([
        api.get('/api/categories'),
        api.get('/api/products?limit=100'),
      ]);

      if (catRes.data.success) setCategories(catRes.data.categories);
      if (prodRes.data.success) setProducts(prodRes.data.products);

      if (isAdmin) {
        // Fetch Admin-only endpoints
        const [dashRes, ordersRes, usersRes] = await Promise.all([
          api.get('/api/admin/dashboard').catch(() => ({ data: { dashboard: null } })),
          api.get('/api/admin/orders').catch(() => ({ data: { orders: [] } })),
          api.get('/api/admin/users').catch(() => ({ data: { users: [] } })),
        ]);

        if (dashRes.data.dashboard) setAdminStats(dashRes.data.dashboard);
        if (ordersRes.data.orders) setAllOrders(ordersRes.data.orders);
        if (usersRes.data.users) setAllUsers(usersRes.data.users);
      } else {
        // Fetch Customer-only endpoints
        const [cartRes, wishRes, addrRes, orderRes] = await Promise.all([
          api.get('/api/cart').catch(() => ({ data: { cart: null } })),
          api.get('/api/wishlist').catch(() => ({ data: { wishlist: { products: [] } } })),
          api.get('/api/addresses').catch(() => ({ data: { addresses: [] } })),
          api.get('/api/orders/my-orders').catch(() => ({ data: { orders: [] } })),
        ]);

        if (cartRes.data.cart) setCart(cartRes.data.cart);
        if (wishRes.data.wishlist) setWishlist(wishRes.data.wishlist.products || []);
        if (addrRes.data.addresses) {
          setAddresses(addrRes.data.addresses || []);
          const def = addrRes.data.addresses.find((a) => a.isDefault) || addrRes.data.addresses[0];
          if (def) setSelectedAddressId(def._id);
        }
        if (orderRes.data.orders) setMyOrders(orderRes.data.orders || []);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      showToast('Could not sync data with server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isAdmin]);

  // =========================================================================
  // ── CUSTOMER ACTIONS: Cart, Wishlist, Orders, Addresses
  // =========================================================================

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

  const handleMoveWishlistToCart = async (productId) => {
    await handleAddToCart(productId, 1);
    await handleToggleWishlist(productId);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await api.patch(`/api/orders/${orderId}/cancel`);
      if (res.data.success) {
        showToast('Order cancelled successfully');
        const orderRes = await api.get('/api/orders/my-orders');
        if (orderRes.data.success) setMyOrders(orderRes.data.orders);
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    }
  };

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

  // =========================================================================
  // ── ADMIN ACTIONS: Products CRUD, Categories CRUD, Order Status, User Status
  // =========================================================================

  const openCreateProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      category: categories[0]?._id || '',
      price: '',
      unit: 'kg',
      stock: '',
      image: '',
    });
    setShowProductModal(true);
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      category: product.category?._id || product.category || categories[0]?._id || '',
      price: product.price,
      unit: product.unit || 'kg',
      stock: product.stock,
      image: product.image || '',
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        name: productForm.name,
        description: productForm.description,
        category: productForm.category,
        price: Number(productForm.price),
        unit: productForm.unit,
        stock: Number(productForm.stock),
        image: productForm.image,
      };

      if (editingProduct) {
        const res = await api.put(`/api/products/${editingProduct._id}`, payload);
        if (res.data.success) {
          showToast('Product updated successfully!');
          setProducts(products.map((p) => (p._id === editingProduct._id ? res.data.product : p)));
        }
      } else {
        const res = await api.post('/api/products', payload);
        if (res.data.success) {
          showToast('Product added to catalog!');
          setProducts([res.data.product, ...products]);
        }
      }
      setShowProductModal(false);
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await api.delete(`/api/products/${productId}`);
      if (res.data.success) {
        showToast('Product deleted');
        setProducts(products.filter((p) => p._id !== productId));
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    }
  };

  const openCreateCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '', description: '', image: '' });
    setShowCategoryModal(true);
  };

  const openEditCategoryModal = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({ name: cat.name, description: cat.description || '', image: cat.image || '' });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingCategory) {
        const res = await api.put(`/api/categories/${editingCategory._id}`, categoryForm);
        if (res.data.success) {
          showToast('Category updated!');
          setCategories(categories.map((c) => (c._id === editingCategory._id ? res.data.category : c)));
        }
      } else {
        const res = await api.post('/api/categories', categoryForm);
        if (res.data.success) {
          showToast('Category created!');
          setCategories([...categories, res.data.category]);
        }
      }
      setShowCategoryModal(false);
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Delete this category? Products in this category may be affected.')) return;
    try {
      const res = await api.delete(`/api/categories/${categoryId}`);
      if (res.data.success) {
        showToast('Category deleted');
        setCategories(categories.filter((c) => c._id !== categoryId));
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, orderStatus) => {
    try {
      const res = await api.patch(`/api/admin/orders/${orderId}/status`, { orderStatus });
      if (res.data.success) {
        showToast(`Order status updated to ${orderStatus}`);
        setAllOrders(allOrders.map((o) => (o._id === orderId ? { ...o, orderStatus } : o)));
        if (adminStats) {
          // refresh stats
          api.get('/api/admin/dashboard').then((r) => r.data.dashboard && setAdminStats(r.data.dashboard));
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    }
  };

  const handleToggleUserStatus = async (userId, currentActive) => {
    try {
      const newActive = !currentActive;
      const res = await api.patch(`/api/admin/users/${userId}/status`, { isActive: newActive });
      if (res.data.success) {
        showToast(`Customer account ${newActive ? 'activated' : 'deactivated'}`);
        setAllUsers(allUsers.map((u) => (u._id === userId ? { ...u, isActive: newActive } : u)));
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    }
  };

  // Filtered products list for Customer Shop
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (p.category?._id || p.category) === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filtered orders for Admin Orders tab
  const filteredAdminOrders = allOrders.filter((ord) => {
    if (orderStatusFilter === 'ALL') return true;
    return ord.orderStatus === orderStatusFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar with Dynamic Role-Based Navigation & High-Visibility Logout */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart?.totalItems || 0}
        wishlistCount={wishlist?.length || 0}
      />

      {/* Floating Feedback Notification */}
      {feedback.message && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-bold border ${
              feedback.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-300'
                : 'bg-emerald-50 text-emerald-800 border-emerald-300'
            }`}
          >
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
        {/* ============================= ADMIN ZONE ================================ */}
        {/* ========================================================================= */}
        {isAdmin ? (
          <div className="space-y-6">
            {/* ── 1. ADMIN OVERVIEW TAB ── */}
            {activeTab === 'overview' && (
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
                        Manage products, categories, customer orders, and account status with full privileges.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={openCreateProductModal}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Product</span>
                      </button>
                      <button
                        onClick={openCreateCategoryModal}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
                      >
                        <Tags className="w-4 h-4" />
                        <span>Add Category</span>
                      </button>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="py-20 text-center text-slate-400 font-semibold">
                    Loading administrative metrics...
                  </div>
                ) : (
                  <>
                    {/* Metric Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div
                        onClick={() => setActiveTab('admin-products')}
                        className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-amber-400 transition-colors cursor-pointer group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Package className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-2xl font-black text-slate-900">{products.length}</div>
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Active Products</div>
                        </div>
                      </div>

                      <div
                        onClick={() => setActiveTab('admin-users')}
                        className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-amber-400 transition-colors cursor-pointer group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Users className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-2xl font-black text-slate-900">{adminStats?.totalUsers || allUsers.length}</div>
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Customers</div>
                        </div>
                      </div>

                      <div
                        onClick={() => setActiveTab('admin-orders')}
                        className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-amber-400 transition-colors cursor-pointer group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-2xl font-black text-slate-900">{adminStats?.totalOrders || allOrders.length}</div>
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Total Orders</div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <IndianRupee className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-2xl font-black text-slate-900">
                            ₹{adminStats?.totalSales?.toLocaleString('en-IN') || 0}
                          </div>
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Total Revenue</div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Access Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Products Summary Card */}
                      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            <Package className="w-4 h-4 text-amber-600" />
                            <span>Catalog Inventory ({products.length})</span>
                          </h3>
                          <button
                            onClick={() => setActiveTab('admin-products')}
                            className="text-xs font-bold text-amber-700 hover:underline"
                          >
                            Manage Products →
                          </button>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {products.slice(0, 4).map((p) => (
                            <div key={p._id} className="py-2.5 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100'}
                                  alt={p.name}
                                  className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                                />
                                <div>
                                  <div className="font-bold text-slate-900 text-xs">{p.name}</div>
                                  <div className="text-[11px] text-slate-400">Stock: {p.stock} {p.unit}</div>
                                </div>
                              </div>
                              <span className="font-bold text-xs text-slate-900">₹{p.price}/{p.unit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Orders Preview */}
                      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-purple-600" />
                            <span>Recent Orders ({allOrders.length})</span>
                          </h3>
                          <button
                            onClick={() => setActiveTab('admin-orders')}
                            className="text-xs font-bold text-amber-700 hover:underline"
                          >
                            View All Orders →
                          </button>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {allOrders.slice(0, 4).map((o) => (
                            <div key={o._id} className="py-2.5 flex items-center justify-between">
                              <div>
                                <div className="font-bold text-slate-900 text-xs">
                                  #{o._id.slice(-6)} — {o.user?.name || o.deliveryAddress?.recipientName || 'Customer'}
                                </div>
                                <div className="text-[11px] text-slate-400">{o.items?.length || 0} items • ₹{o.totalAmount}</div>
                              </div>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  o.orderStatus === 'Delivered'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : o.orderStatus === 'Cancelled'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {o.orderStatus}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── 2. ADMIN PRODUCTS MANAGEMENT TAB ── */}
            {activeTab === 'admin-products' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Products Management</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Create, update, or remove products from the Sandhai catalog
                    </p>
                  </div>
                  <button
                    onClick={openCreateProductModal}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Product</span>
                  </button>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-600 font-bold text-xs uppercase border-b border-slate-200">
                        <tr>
                          <th className="py-3.5 px-4">Product</th>
                          <th className="py-3.5 px-4">Category</th>
                          <th className="py-3.5 px-4">Price / Unit</th>
                          <th className="py-3.5 px-4">Stock</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                        {products.map((p) => (
                          <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100'}
                                  alt={p.name}
                                  className="w-11 h-11 rounded-xl object-cover bg-slate-100 shrink-0"
                                />
                                <div>
                                  <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                                  <div className="text-xs text-slate-400 line-clamp-1">{p.description}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700">
                                {p.category?.name || 'General'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              ₹{p.price} <span className="text-xs text-slate-400 font-normal">/ {p.unit}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                  p.stock > 10
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : p.stock > 0
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {p.stock > 0 ? `${p.stock} in stock` : 'Out of Stock'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => openEditProductModal(p)}
                                  className="p-2 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                                  title="Edit product"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p._id)}
                                  className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Delete product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── 3. ADMIN CATEGORIES MANAGEMENT TAB ── */}
            {activeTab === 'admin-categories' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Categories Management</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Organize the marketplace with product categories
                    </p>
                  </div>
                  <button
                    onClick={openCreateCategoryModal}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Category</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {categories.map((c) => (
                    <div key={c._id} className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3">
                      <img
                        src={c.image || 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300'}
                        alt={c.name}
                        className="w-full h-32 rounded-xl object-cover bg-slate-100"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{c.description}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditCategoryModal(c)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-amber-700 hover:bg-amber-50 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(c._id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 4. ADMIN ALL ORDERS MANAGEMENT TAB ── */}
            {activeTab === 'admin-orders' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Customer Orders ({allOrders.length})</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Review all marketplace purchases and update delivery statuses
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {['ALL', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setOrderStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          orderStatusFilter === status
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredAdminOrders.map((ord) => (
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

                        {/* Status update selector */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500">Status:</span>
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
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

                      {/* Items */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Items</div>
                          <div className="space-y-1.5">
                            {ord.items?.map((item, idx) => (
                              <div key={idx} className="text-xs flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                                <span className="font-medium text-slate-800">
                                  {item.name || item.productId?.name || 'Product'} × {item.quantity}
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

                  {filteredAdminOrders.length === 0 && (
                    <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400 font-semibold">
                      No orders found matching status "{orderStatusFilter}".
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── 5. ADMIN USERS MANAGEMENT TAB ── */}
            {activeTab === 'admin-users' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80">
                  <h2 className="text-xl font-black text-slate-900">Customer Accounts ({allUsers.length})</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    View registered customers and manage account status
                  </p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-600 font-bold text-xs uppercase border-b border-slate-200">
                        <tr>
                          <th className="py-3.5 px-4">Customer</th>
                          <th className="py-3.5 px-4">Contact</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                        {allUsers.map((u) => (
                          <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                                  {u.name ? u.name[0].toUpperCase() : 'U'}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 text-sm">{u.name}</div>
                                  <div className="text-xs text-slate-400">{u.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-xs text-slate-600 font-mono">
                              {u.phone || 'No phone'}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                  u.isActive
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {u.isActive ? 'Active' : 'Deactivated'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => handleToggleUserStatus(u._id, u.isActive)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                                  u.isActive
                                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                }`}
                              >
                                {u.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* =========================== CUSTOMER ZONE =============================== */
          /* ========================================================================= */
          <div className="space-y-8">
            {/* ── 1. CUSTOMER SHOP TAB ── */}
            {activeTab === 'shop' && (
              <>
                {/* Hero Banner */}
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
                </div>

                {/* Search & Category Filter */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search fresh vegetables, fruits, groceries..."
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm shadow-xs focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    />
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        selectedCategory === 'all'
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-400'
                      }`}
                    >
                      All Items
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => setSelectedCategory(cat._id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                          selectedCategory === cat._id
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-400'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Products Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900">
                      Catalog Products ({filteredProducts.length})
                    </h3>
                  </div>

                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {filteredProducts.map((prod) => {
                        const isWishlisted = wishlist.some((w) => (w._id || w) === prod._id);
                        return (
                          <div
                            key={prod._id}
                            className="bg-white rounded-3xl border border-slate-200/80 p-4 flex flex-col justify-between hover:shadow-lg hover:shadow-slate-200/50 hover:border-emerald-200 transition-all duration-200 group"
                          >
                            <div className="relative">
                              <img
                                src={prod.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400'}
                                alt={prod.name}
                                className="w-full h-44 rounded-2xl object-cover bg-slate-100 group-hover:scale-[1.02] transition-transform duration-200"
                              />

                              {/* Customer Wishlist Heart Button */}
                              <button
                                onClick={() => handleToggleWishlist(prod._id)}
                                className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md shadow-sm transition-transform active:scale-90 cursor-pointer ${
                                  isWishlisted
                                    ? 'bg-rose-50 text-rose-500 border border-rose-200'
                                    : 'bg-white/90 text-slate-400 hover:text-rose-500 border border-slate-200/60'
                                }`}
                                title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                              >
                                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                              </button>

                              <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white uppercase tracking-wider">
                                {prod.category?.name || 'Fresh'}
                              </span>
                            </div>

                            <div className="mt-3 flex-1 flex flex-col justify-between">
                              <div>
                                <h4 className="font-extrabold text-slate-900 text-sm leading-tight line-clamp-1">
                                  {prod.name}
                                </h4>
                                <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                                  {prod.description}
                                </p>
                              </div>

                              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                <div>
                                  <div className="text-base font-black text-slate-900">
                                    ₹{prod.price}
                                    <span className="text-xs font-normal text-slate-400 ml-1">/{prod.unit}</span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleAddToCart(prod._id, 1)}
                                  disabled={actionLoading || prod.stock <= 0}
                                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                                    prod.stock > 0
                                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 active:scale-95'
                                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                  }`}
                                >
                                  <ShoppingCart className="w-3.5 h-3.5" />
                                  <span>{prod.stock > 0 ? 'Add' : 'Sold Out'}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-16 text-center bg-white rounded-3xl border border-slate-200">
                      <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                      <div className="text-slate-600 font-bold text-sm">No products found</div>
                      <div className="text-slate-400 text-xs mt-1">Try another category or search keyword.</div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── 2. CUSTOMER WISHLIST TAB ── */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200/80">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">My Wishlist ({wishlist.length})</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Your saved favourite items</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('shop')}
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    Continue Shopping →
                  </button>
                </div>

                {wishlist.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {wishlist.map((prod) => (
                      <div key={prod._id} className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
                        <img
                          src={prod.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400'}
                          alt={prod.name}
                          className="w-full h-36 rounded-xl object-cover bg-slate-100"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{prod.name}</h4>
                          <div className="text-xs font-black text-emerald-700 mt-1">₹{prod.price} / {prod.unit}</div>
                        </div>
                        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                          <button
                            onClick={() => handleMoveWishlistToCart(prod._id)}
                            className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Move to Cart</span>
                          </button>
                          <button
                            onClick={() => handleToggleWishlist(prod._id)}
                            className="p-2 rounded-xl bg-slate-100 text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center bg-white rounded-3xl border border-slate-200">
                    <Heart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <div className="text-slate-700 font-bold text-sm">Your wishlist is empty</div>
                    <p className="text-slate-400 text-xs mt-1 mb-4">Save products while browsing to find them easily later.</p>
                    <button
                      onClick={() => setActiveTab('shop')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer"
                    >
                      Browse Products
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── 3. CUSTOMER CART TAB ── */}
            {activeTab === 'cart' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80">
                  <h2 className="text-xl font-black text-slate-900">Shopping Cart ({cart?.totalItems || 0} items)</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Review items and proceed to checkout</p>
                </div>

                {cart && cart.items?.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-3">
                      {cart.items.map((item) => (
                        <div key={item.productId} className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100'}
                              alt={item.name}
                              className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0"
                            />
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                              <div className="text-xs text-slate-500">₹{item.price} each</div>
                              <div className="text-xs font-black text-emerald-700 mt-0.5">₹{item.price * item.quantity}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                              <button
                                onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                                className="p-1.5 hover:bg-white rounded-l-xl text-slate-600 cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-3 text-xs font-bold text-slate-900">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                                className="p-1.5 hover:bg-white rounded-r-xl text-slate-600 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemoveFromCart(item.productId)}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary & Address Checkout Panel */}
                    <div className="space-y-4">
                      {/* Delivery Free Progress */}
                      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs">
                        <div className="flex items-center justify-between font-bold text-emerald-900 mb-1.5">
                          <span>Free Delivery Threshold</span>
                          <span>{cart.subtotal >= 500 ? 'Unlocked! 🎉' : `Add ₹${500 - cart.subtotal} more`}</span>
                        </div>
                        <div className="w-full bg-emerald-200/60 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, (cart.subtotal / 500) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Address Selector */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Delivery Address</span>
                          <button
                            onClick={() => setShowAddressModal(true)}
                            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add New</span>
                          </button>
                        </div>

                        {addresses.length > 0 ? (
                          <div className="space-y-2">
                            {addresses.map((a) => (
                              <label
                                key={a._id}
                                className={`block p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                                  selectedAddressId === a._id
                                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className="flex items-center justify-between font-bold text-slate-900">
                                  <span>{a.recipientName}</span>
                                  <input
                                    type="radio"
                                    name="address"
                                    checked={selectedAddressId === a._id}
                                    onChange={() => setSelectedAddressId(a._id)}
                                    className="text-emerald-600"
                                  />
                                </div>
                                <div className="text-slate-500 mt-1">{a.addressLine}, {a.city}</div>
                                <div className="text-slate-400 font-mono mt-0.5">{a.phone}</div>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowAddressModal(true)}
                            className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 text-slate-600 font-bold text-xs cursor-pointer"
                          >
                            + Add a Delivery Address
                          </button>
                        )}
                      </div>

                      {/* Payment Method Selector */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Payment Option</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('COD')}
                            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              paymentMethod === 'COD'
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            Cash on Delivery
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('Online')}
                            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              paymentMethod === 'Online'
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            UPI / Online
                          </button>
                        </div>
                      </div>

                      {/* Bill Summary */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-600">Order Summary</div>
                        <div className="space-y-1.5 text-xs text-slate-600">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-bold text-slate-900">₹{cart.subtotal}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Delivery Charges</span>
                            <span className="font-bold text-slate-900">
                              {cart.subtotal >= 500 ? <span className="text-emerald-600">FREE</span> : '₹40'}
                            </span>
                          </div>
                          <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-black text-slate-900">
                            <span>Grand Total</span>
                            <span className="text-emerald-700">₹{cart.subtotal + (cart.subtotal >= 500 ? 0 : 40)}</span>
                          </div>
                        </div>

                        <button
                          onClick={handleCheckout}
                          disabled={actionLoading}
                          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {actionLoading ? 'Processing Order...' : 'Place Order Now →'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center bg-white rounded-3xl border border-slate-200">
                    <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <div className="text-slate-700 font-bold text-sm">Your cart is empty</div>
                    <p className="text-slate-400 text-xs mt-1 mb-4">Discover fresh produce and grocery items from our catalog.</p>
                    <button
                      onClick={() => setActiveTab('shop')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer"
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── 4. CUSTOMER MY ORDERS TAB ── */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200/80">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">My Orders ({myOrders.length})</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Track your placed orders and fulfillment status</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('shop')}
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    Continue Shopping →
                  </button>
                </div>

                {myOrders.length > 0 ? (
                  <div className="space-y-4">
                    {myOrders.map((ord) => (
                      <div key={ord._id} className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                          <div>
                            <div className="font-mono font-bold text-emerald-700 text-sm">#{ord._id.slice(-8)}</div>
                            <div className="text-xs text-slate-400">
                              Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded-full ${
                                ord.orderStatus === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.orderStatus === 'Processing'
                                  ? 'bg-sky-100 text-sky-800'
                                  : ord.orderStatus === 'Cancelled'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {ord.orderStatus}
                            </span>

                            {ord.orderStatus === 'Pending' && (
                              <button
                                onClick={() => handleCancelOrder(ord._id)}
                                className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                              >
                                Cancel Order
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          {ord.items?.map((item, i) => (
                            <div key={i} className="text-xs flex items-center justify-between">
                              <span className="text-slate-800 font-medium">
                                {item.name || 'Product'} × {item.quantity}
                              </span>
                              <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-slate-500">Payment: <strong>{ord.paymentMethod}</strong> ({ord.paymentStatus})</span>
                          <span className="font-black text-slate-900 text-sm">Total: ₹{ord.totalAmount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center bg-white rounded-3xl border border-slate-200">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <div className="text-slate-700 font-bold text-sm">No orders yet</div>
                    <p className="text-slate-400 text-xs mt-1 mb-4">When you place orders, they will appear here with live tracking.</p>
                    <button
                      onClick={() => setActiveTab('shop')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer"
                    >
                      Explore Products
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* ── MODALS: Product Form, Category Form, Address Form */}
      {/* ========================================================================= */}

      {/* Product Create/Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Organic Farm Tomatoes"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Category</label>
                  <select
                    required
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Unit</label>
                  <select
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="kg">kg (Kilogram)</option>
                    <option value="g">g (Gram)</option>
                    <option value="piece">piece</option>
                    <option value="pack">pack</option>
                    <option value="litre">litre</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="45"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="50"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Image URL</label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Short description of the item..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer mt-2 disabled:opacity-50"
              >
                {actionLoading ? 'Saving Product...' : editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Category Create/Edit Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Organic Dairy"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Description</label>
                <input
                  type="text"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Fresh milk, paneer, and cheese"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Image URL</label>
                <input
                  type="url"
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer mt-2 disabled:opacity-50"
              >
                {actionLoading ? 'Saving Category...' : editingCategory ? 'Update Category' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Address Create Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg">New Delivery Address</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
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
