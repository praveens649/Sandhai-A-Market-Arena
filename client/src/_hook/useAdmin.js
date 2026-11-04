import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '../context/ToastContext';
import {
  fetchAdminDashboard,
  fetchAdminOrders,
  updateAdminOrderStatus,
  fetchAdminUsers,
  updateAdminUserStatus,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from '../_action/adminActions';
import api from '../api/client';

export const useAdmin = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState({ text: '', type: 'success' });

  // Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');

  const { showToast: triggerToast } = useToast();

  const showToast = useCallback((text, type = 'success') => {
    setToastMessage({ text, type });
    triggerToast(text, type);
  }, [triggerToast]);

  // Fetch all admin data
  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, ordersRes, usersRes, prodRes, catRes] = await Promise.all([
        fetchAdminDashboard().catch(() => ({ dashboard: null })),
        fetchAdminOrders().catch(() => ({ orders: [] })),
        fetchAdminUsers().catch(() => ({ users: [] })),
        api.get('/api/products?limit=100').catch(() => ({ data: { products: [] } })),
        api.get('/api/categories').catch(() => ({ data: { categories: [] } })),
      ]);

      if (dashRes.dashboard) setStats(dashRes.dashboard);
      setOrders(ordersRes.orders || []);
      setUsers(usersRes.users || []);
      setProducts(prodRes.data?.products || []);
      setCategories(catRes.data?.categories || []);
    } catch (err) {
      console.error('Failed to load admin dataset:', err);
      setError(err.message || 'Could not fetch admin data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Order Operations
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await updateAdminOrderStatus(orderId, newStatus);
      if (res.success) {
        showToast(`Order marked as ${newStatus}`);
        setOrders((prev) =>
          prev.map((ord) => (ord._id === orderId ? { ...ord, orderStatus: newStatus } : ord))
        );
        // Refresh dashboard stats
        fetchAdminDashboard().then((d) => d.dashboard && setStats(d.dashboard));
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // User Operations
  const handleToggleUserStatus = async (userId, currentActive) => {
    try {
      const newActive = !currentActive;
      const res = await updateAdminUserStatus(userId, newActive);
      if (res.success) {
        showToast(`Customer account ${newActive ? 'activated' : 'deactivated'}`);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isActive: newActive } : u))
        );
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Product Operations
  const handleSaveProduct = async (productData, editingId = null) => {
    try {
      if (editingId) {
        const res = await updateAdminProduct(editingId, productData);
        if (res.success) {
          showToast('Product updated successfully!');
          setProducts((prev) =>
            prev.map((p) => (p._id === editingId ? res.product : p))
          );
          return { success: true };
        }
      } else {
        const res = await createAdminProduct(productData);
        if (res.success) {
          showToast('Product created successfully!');
          setProducts((prev) => [res.product, ...prev]);
          return { success: true };
        }
      }
      return { success: false };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const res = await deleteAdminProduct(productId);
      if (res.success) {
        showToast('Product removed permanently', 'info');
        setProducts((prev) => prev.filter((p) => p._id !== productId));
        return true;
      }
      return false;
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
      return false;
    }
  };

  // Category Operations
  const handleSaveCategory = async (categoryData, editingId = null) => {
    try {
      if (editingId) {
        const res = await updateAdminCategory(editingId, categoryData);
        if (res.success) {
          showToast('Category updated!');
          setCategories((prev) =>
            prev.map((c) => (c._id === editingId ? res.category : c))
          );
          return { success: true };
        }
      } else {
        const res = await createAdminCategory(categoryData);
        if (res.success) {
          showToast('Category added!');
          setCategories((prev) => [...prev, res.category]);
          return { success: true };
        }
      }
      return { success: false };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const res = await deleteAdminCategory(categoryId);
      if (res.success) {
        showToast('Category deleted successfully', 'info');
        setCategories((prev) => prev.filter((c) => c._id !== categoryId));
        return true;
      }
      return false;
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
      return false;
    }
  };

  // Computed Analytics Data for Chart (Revenue Trend, Status Breakdown, AOV)
  const analyticsData = useMemo(() => {
    // 1. Calculate Last 7 Days Revenue Trend
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayName = days[d.getDay()];
      const dateString = d.toISOString().split('T')[0];

      // Sum all orders on this date that are not cancelled
      const daySales = orders
        .filter((o) => {
          if (o.orderStatus === 'Cancelled') return false;
          const orderDate = new Date(o.createdAt).toISOString().split('T')[0];
          return orderDate === dateString;
        })
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      const orderCount = orders.filter((o) => {
        const orderDate = new Date(o.createdAt).toISOString().split('T')[0];
        return orderDate === dateString;
      }).length;

      last7Days.push({
        day: dayName,
        date: `${d.getDate()}/${d.getMonth() + 1}`,
        sales: daySales,
        orders: orderCount,
      });
    }

    // 2. Order Status Breakdown
    const statusCounts = {
      Ordered: orders.filter((o) => o.orderStatus === 'Ordered' || o.orderStatus === 'Pending' || o.orderStatus === 'Processing' || o.orderStatus === 'Shipped').length,
      Delivered: orders.filter((o) => o.orderStatus === 'Delivered').length,
      Cancelled: orders.filter((o) => o.orderStatus === 'Cancelled').length,
    };

    // 3. Financial Metrics
    const validOrders = orders.filter((o) => o.orderStatus !== 'Cancelled');
    const totalRevenue = validOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const averageOrderValue = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;
    const completionRate =
      orders.length > 0 ? Math.round((statusCounts.Delivered / orders.length) * 100) : 0;

    return {
      last7Days,
      statusCounts,
      totalRevenue,
      averageOrderValue,
      completionRate,
      totalOrders: orders.length,
      activeUsersCount: users.filter((u) => u.isActive).length,
    };
  }, [orders, users]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchStatus = orderStatusFilter === 'ALL' || ord.orderStatus === orderStatusFilter;
      if (!matchStatus) return false;
      if (!orderSearchQuery.trim()) return true;
      const q = orderSearchQuery.toLowerCase();
      const matchId = ord._id?.toLowerCase().includes(q);
      const matchName = (ord.user?.name || ord.deliveryAddress?.recipientName || '').toLowerCase().includes(q);
      const matchEmail = (ord.user?.email || '').toLowerCase().includes(q);
      const matchPhone = (ord.deliveryAddress?.phone || '').toLowerCase().includes(q);
      const matchCity = (ord.deliveryAddress?.city || '').toLowerCase().includes(q);
      const matchItem = ord.items?.some((i) => (i.name || '').toLowerCase().includes(q));
      return matchId || matchName || matchEmail || matchPhone || matchCity || matchItem;
    });
  }, [orders, orderStatusFilter, orderSearchQuery]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    if (!productSearchQuery.trim()) return products;
    const q = productSearchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [products, productSearchQuery]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    if (!userSearchQuery.trim()) return users;
    const q = userSearchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q)
    );
  }, [users, userSearchQuery]);

  return {
    stats,
    orders,
    filteredOrders,
    users,
    filteredUsers,
    products,
    filteredProducts,
    categories,
    loading,
    error,
    toastMessage,
    refreshAll: loadAllData,
    // Analytics
    analyticsData,
    // Filter controls
    orderStatusFilter,
    setOrderStatusFilter,
    orderSearchQuery,
    setOrderSearchQuery,
    productSearchQuery,
    setProductSearchQuery,
    userSearchQuery,
    setUserSearchQuery,
    // Operations
    handleUpdateOrderStatus,
    handleToggleUserStatus,
    handleSaveProduct,
    handleDeleteProduct,
    handleSaveCategory,
    handleDeleteCategory,
  };
};

