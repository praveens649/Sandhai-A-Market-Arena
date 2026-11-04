import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../_hook/useAdmin';
import {
  Search,
  ShoppingBag,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Receipt,
  Copy,
  Check,
  Printer,
  X,
  CreditCard,
  RefreshCw,
  IndianRupee,
  Download,
  User,
  Phone,
  Mail,
  ArrowUpDown,
  Filter,
} from 'lucide-react';

const AdminOrdersPage = () => {
  const {
    orders = [],
    handleUpdateOrderStatus,
    refreshAll,
    loading,
  } = useAdmin();

  // Local state
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'amount_high' | 'amount_low'
  const [copiedId, setCopiedId] = useState(null);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // 1. KPI Metrics
  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const orderedCount = orders.filter((o) => o.orderStatus === 'Ordered').length;
    const deliveredCount = orders.filter((o) => o.orderStatus === 'Delivered').length;
    const cancelledCount = orders.filter((o) => o.orderStatus === 'Cancelled').length;

    // Total gross revenue from valid orders
    const totalRevenue = orders
      .filter((o) => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

    return {
      totalOrders,
      orderedCount,
      deliveredCount,
      cancelledCount,
      totalRevenue,
    };
  }, [orders]);

  // 2. Filter & Search Logic
  const filteredOrders = useMemo(() => {
    return orders
      .filter((ord) => {
        // Status filter
        if (orderStatusFilter !== 'ALL' && ord.orderStatus !== orderStatusFilter) {
          return false;
        }

        // Payment method filter
        if (paymentMethodFilter !== 'ALL' && ord.paymentMethod !== paymentMethodFilter) {
          return false;
        }

        // Search filter
        if (orderSearchQuery.trim()) {
          const q = orderSearchQuery.toLowerCase().trim();
          const matchId = (ord._id || '').toLowerCase().includes(q);
          const matchName = (ord.user?.name || ord.deliveryAddress?.recipientName || '').toLowerCase().includes(q);
          const matchEmail = (ord.user?.email || '').toLowerCase().includes(q);
          const matchPhone = (ord.deliveryAddress?.phone || ord.user?.phone || '').includes(q);
          const matchCity = (ord.deliveryAddress?.city || '').toLowerCase().includes(q);
          const matchItem = ord.items?.some((i) => (i.name || '').toLowerCase().includes(q));

          return matchId || matchName || matchEmail || matchPhone || matchCity || matchItem;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'oldest') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        if (sortBy === 'amount_high') {
          return (b.totalAmount || 0) - (a.totalAmount || 0);
        }
        if (sortBy === 'amount_low') {
          return (a.totalAmount || 0) - (b.totalAmount || 0);
        }
        // Default newest
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [orders, orderStatusFilter, paymentMethodFilter, orderSearchQuery, sortBy]);

  // 3. Actions
  const handleCopyOrderId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshAll();
    setIsRefreshing(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await handleUpdateOrderStatus(orderId, newStatus);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleExportCSV = () => {
    if (!filteredOrders.length) return;

    const headers = [
      'Order ID',
      'Placed At',
      'Customer Name',
      'Customer Email',
      'Recipient Phone',
      'Delivery City',
      'Address',
      'Items Count',
      'Total Amount (INR)',
      'Payment Method',
      'Payment Status',
      'Order Status',
    ];

    const rows = filteredOrders.map((ord) => [
      `"${ord._id}"`,
      `"${new Date(ord.createdAt).toLocaleString('en-IN')}"`,
      `"${ord.user?.name || ord.deliveryAddress?.recipientName || 'Customer'}"`,
      `"${ord.user?.email || 'N/A'}"`,
      `"${ord.deliveryAddress?.phone || 'N/A'}"`,
      `"${ord.deliveryAddress?.city || 'N/A'}"`,
      `"${(ord.deliveryAddress?.addressLine || '').replace(/"/g, '""')}"`,
      ord.items?.length || 0,
      ord.totalAmount || 0,
      ord.paymentMethod || 'COD',
      ord.paymentStatus || 'Pending',
      ord.orderStatus || 'Ordered',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sandhai-orders-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAllFilters = () => {
    setOrderStatusFilter('ALL');
    setPaymentMethodFilter('ALL');
    setOrderSearchQuery('');
    setSortBy('newest');
  };

  // Helper for status styles
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: CheckCircle2,
          label: 'Delivered',
        };
      case 'Cancelled':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          icon: XCircle,
          label: 'Cancelled',
        };
      case 'Ordered':
      default:
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
          icon: Clock,
          label: 'Ordered',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header Strip ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900">Customer Orders</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-200">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time fulfillment pipeline, rapid status dispatch, customer contact details, and printable invoices.
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing || loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            title="Refresh order list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-600' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={filteredOrders.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            title="Export filtered orders to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ── KPI Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Orders */}
        <div
          onClick={() => setOrderStatusFilter('ALL')}
          className={`p-4 rounded-3xl border transition-all cursor-pointer ${
            orderStatusFilter === 'ALL'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/20'
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900">{metrics.totalOrders}</div>
          <span className="text-[11px] text-slate-400 font-medium">All recorded orders</span>
        </div>

        {/* Active / Ordered */}
        <div
          onClick={() => setOrderStatusFilter('Ordered')}
          className={`p-4 rounded-3xl border transition-all cursor-pointer ${
            orderStatusFilter === 'Ordered'
              ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400/20'
              : 'bg-white border-slate-200/80 hover:border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between text-blue-700 mb-2">
            <span className="text-xs font-bold">Active / Ordered</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-900">{metrics.orderedCount}</div>
          <span className="text-[11px] text-blue-600 font-medium">Needs packing / dispatch</span>
        </div>

        {/* Delivered */}
        <div
          onClick={() => setOrderStatusFilter('Delivered')}
          className={`p-4 rounded-3xl border transition-all cursor-pointer ${
            orderStatusFilter === 'Delivered'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20'
              : 'bg-white border-slate-200/80 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-bold">Delivered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-900">{metrics.deliveredCount}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Successfully fulfilled</span>
        </div>

        {/* Cancelled */}
        <div
          onClick={() => setOrderStatusFilter('Cancelled')}
          className={`p-4 rounded-3xl border transition-all cursor-pointer ${
            orderStatusFilter === 'Cancelled'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400/20'
              : 'bg-white border-slate-200/80 hover:border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-bold">Cancelled</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-900">{metrics.cancelledCount}</div>
          <span className="text-[11px] text-rose-600 font-medium">Voided orders</span>
        </div>

        {/* Gross Revenue */}
        <div className="col-span-2 lg:col-span-1 p-4 rounded-3xl border bg-gradient-to-br from-emerald-500/10 via-amber-500/10 to-transparent border-slate-200/80">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-xs font-bold">Gross Revenue</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-900">₹{metrics.totalRevenue.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-emerald-700 font-medium">From active & delivered</span>
        </div>
      </div>

      {/* ── Search & Filter Controls Bar ── */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Top row: Status Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'ALL', label: 'All Orders', count: metrics.totalOrders },
              { id: 'Ordered', label: 'Ordered', count: metrics.orderedCount },
              { id: 'Delivered', label: 'Delivered', count: metrics.deliveredCount },
              { id: 'Cancelled', label: 'Cancelled', count: metrics.cancelledCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setOrderStatusFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  orderStatusFilter === tab.id
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    orderStatusFilter === tab.id
                      ? 'bg-white/25 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Payment Method filter dropdown */}
          <div className="flex items-center gap-2">
            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="ALL">All Payment Types</option>
              <option value="COD">Cash on Delivery (COD)</option>
              <option value="Online">Online / UPI</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="NetBanking">NetBanking</option>
            </select>
          </div>
        </div>

        {/* Bottom row: Search input & Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={orderSearchQuery}
              onChange={(e) => setOrderSearchQuery(e.target.value)}
              placeholder="Search by Order ID (#...), Customer Name, Email, Phone, City, or Product..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:bg-white transition-all"
            />
            {orderSearchQuery && (
              <button
                onClick={() => setOrderSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold px-3 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount_high">Highest Amount</option>
              <option value="amount_low">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Orders List ── */}
      <div className="space-y-4">
        {filteredOrders.map((ord) => {
          const statusBadge = getStatusBadge(ord.orderStatus);
          const StatusIcon = statusBadge.icon;
          const isUpdatingThis = updatingOrderId === ord._id;

          return (
            <div
              key={ord._id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 space-y-5 shadow-xs hover:border-slate-300 transition-all"
            >
              {/* Order Card Top Bar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleCopyOrderId(ord._id)}
                      className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200/80 font-mono text-xs font-bold text-amber-900 transition-all cursor-pointer"
                      title="Click to copy full Order ID"
                    >
                      <span>#{ord._id.slice(-8).toUpperCase()}</span>
                      {copiedId === ord._id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                      )}
                    </button>

                    <span className="text-slate-300">•</span>

                    <span className="text-xs font-medium text-slate-500">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    <span className="text-slate-300">•</span>

                    {/* Payment Badge */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                      <CreditCard className="w-3 h-3 text-slate-500" />
                      <span>{ord.paymentMethod}</span>
                      <span className="text-slate-400">/</span>
                      <span
                        className={
                          ord.paymentStatus === 'Completed'
                            ? 'text-emerald-700 font-black'
                            : 'text-amber-700 font-black'
                        }
                      >
                        {ord.paymentStatus === 'Completed' ? 'Paid' : ord.paymentStatus || 'Pending'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Status Switcher & Print Invoice */}
                <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
                  {/* Status Indicator & Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Status:</span>
                    <div className="relative">
                      <select
                        value={ord.orderStatus}
                        disabled={isUpdatingThis}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className={`text-xs font-bold pl-3 pr-8 py-2 rounded-xl border outline-none cursor-pointer appearance-none transition-all ${statusBadge.bg} ${
                          isUpdatingThis ? 'opacity-50 pointer-events-none' : ''
                        }`}
                      >
                        <option value="Ordered" className="bg-white text-slate-900">Ordered</option>
                        <option value="Delivered" className="bg-white text-slate-900">Delivered</option>
                        <option value="Cancelled" className="bg-white text-slate-900">Cancelled</option>
                      </select>
                      <StatusIcon className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* View / Print Invoice Button */}
                  <button
                    onClick={() => setActiveInvoiceOrder(ord)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5 text-slate-600" />
                    <span>Invoice Slip</span>
                  </button>
                </div>
              </div>

              {/* Order Card Middle Grid: Customer + Delivery + Items Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Customer & Delivery Column (5 cols) */}
                <div className="md:col-span-5 space-y-3">
                  {/* Customer Details */}
                  <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>Customer Profile</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                        {(ord.user?.name || ord.deliveryAddress?.recipientName || 'U').slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-black text-slate-900 truncate">
                          {ord.user?.name || ord.deliveryAddress?.recipientName || 'Customer'}
                        </div>
                        {ord.user?.email && (
                          <a
                            href={`mailto:${ord.user.email}`}
                            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-amber-700 transition-colors truncate"
                          >
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{ord.user.email}</span>
                          </a>
                        )}
                        {(ord.deliveryAddress?.phone || ord.user?.phone) && (
                          <a
                            href={`tel:${ord.deliveryAddress?.phone || ord.user?.phone}`}
                            className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-amber-700 transition-colors"
                          >
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{ord.deliveryAddress?.phone || ord.user?.phone}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Delivery Address</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      {ord.deliveryAddress?.recipientName}
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      {ord.deliveryAddress?.addressLine}
                      <br />
                      {ord.deliveryAddress?.city}, {ord.deliveryAddress?.state} -{' '}
                      <span className="font-mono font-bold text-slate-700">
                        {ord.deliveryAddress?.postalCode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items & Financial Breakdown Column (7 cols) */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
                      <div className="flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-slate-500" />
                        <span>Ordered Items ({ord.items?.length || 0})</span>
                      </div>
                      <span className="text-slate-400 font-mono">Line Totals</span>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {ord.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-3 p-2 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-8 h-8 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <Package className="w-4 h-4" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                              <p className="text-[10px] text-slate-500">
                                ₹{item.price} × {item.quantity} {item.unit || 'kg'}
                              </p>
                            </div>
                          </div>

                          <span className="text-xs font-bold text-slate-900 shrink-0 font-mono">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary Bar */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-4 text-slate-500">
                      <div>
                        Items: <strong className="text-slate-700">₹{ord.itemsTotal || ord.totalAmount}</strong>
                      </div>
                      <div>
                        Delivery: <strong className="text-emerald-700">{ord.deliveryCharge ? `₹${ord.deliveryCharge}` : 'FREE'}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-600">Total:</span>
                      <span className="text-base font-black text-emerald-700 font-mono">
                        ₹{Number(ord.totalAmount).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Card Footer Quick Actions */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] text-slate-400">
                  Last updated:{' '}
                  {new Date(ord.updatedAt || ord.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>

                <div className="flex items-center gap-2">
                  {ord.orderStatus === 'Ordered' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(ord._id, 'Delivered')}
                        disabled={isUpdatingThis}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark as Delivered</span>
                      </button>

                      <button
                        onClick={() => handleStatusChange(ord._id, 'Cancelled')}
                        disabled={isUpdatingThis}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Order</span>
                      </button>
                    </>
                  )}

                  {ord.orderStatus === 'Delivered' && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Fulfillment Complete</span>
                    </span>
                  )}

                  {ord.orderStatus === 'Cancelled' && (
                    <button
                      onClick={() => handleStatusChange(ord._id, 'Ordered')}
                      disabled={isUpdatingThis}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                    >
                      <span>Reopen to Ordered</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* ── Empty State ── */}
        {filteredOrders.length === 0 && (
          <div className="bg-white p-12 sm:p-16 text-center rounded-3xl border border-slate-200/80 space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="font-black text-slate-900 text-base">No orders found</h3>
              <p className="text-xs text-slate-500">
                {orderSearchQuery || orderStatusFilter !== 'ALL' || paymentMethodFilter !== 'ALL'
                  ? 'No customer orders match your current filters or search term.'
                  : 'No customer orders have been placed in the store yet.'}
              </p>
            </div>
            {(orderSearchQuery || orderStatusFilter !== 'ALL' || paymentMethodFilter !== 'ALL') && (
              <button
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Admin Printable Invoice / Slip Modal ── */}
      {activeInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            {/* Modal Actions Bar (Not Printed) */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-700" />
                <span className="font-bold text-xs text-slate-800">Sandhai Store Fulfillment Slip</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setActiveInvoiceOrder(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Content Body */}
            <div className="p-6 sm:p-8 space-y-6 text-slate-800 font-sans" id="printable-order-slip">
              {/* Store & Invoice Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                      S
                    </div>
                    <span className="text-lg font-black text-slate-900 tracking-tight">SANDHAI FRESH MART</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Organic, Farm-Fresh Groceries & Daily Essentials
                  </p>
                  <p className="text-[11px] text-slate-400">support@sandhai.in • +91 98765 43210</p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs font-mono font-bold text-amber-900 uppercase">
                    SLIP #{activeInvoiceOrder._id.slice(-8).toUpperCase()}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Date:{' '}
                    {new Date(activeInvoiceOrder.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                  <span
                    className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      activeInvoiceOrder.orderStatus === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : activeInvoiceOrder.orderStatus === 'Cancelled'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    Status: {activeInvoiceOrder.orderStatus}
                  </span>
                </div>
              </div>

              {/* Customer & Delivery Coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Customer Account
                  </span>
                  <div className="font-bold text-slate-900">
                    {activeInvoiceOrder.user?.name || activeInvoiceOrder.deliveryAddress?.recipientName}
                  </div>
                  <div className="text-slate-600">{activeInvoiceOrder.user?.email || 'N/A'}</div>
                  <div className="text-slate-600">{activeInvoiceOrder.user?.phone || activeInvoiceOrder.deliveryAddress?.phone}</div>
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Delivery Address
                  </span>
                  <div className="font-bold text-slate-900">
                    {activeInvoiceOrder.deliveryAddress?.recipientName}
                  </div>
                  <div className="text-slate-600">
                    {activeInvoiceOrder.deliveryAddress?.addressLine}
                  </div>
                  <div className="text-slate-600">
                    {activeInvoiceOrder.deliveryAddress?.city}, {activeInvoiceOrder.deliveryAddress?.state} -{' '}
                    {activeInvoiceOrder.deliveryAddress?.postalCode}
                  </div>
                  <div className="text-slate-600">Tel: {activeInvoiceOrder.deliveryAddress?.phone}</div>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 text-left font-bold text-[10px] uppercase tracking-wider">
                      <th className="py-2">Item Description</th>
                      <th className="py-2 text-right">Price</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeInvoiceOrder.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 font-medium text-slate-800">
                          {item.name}
                          <span className="text-slate-400 text-[10px] ml-1">({item.unit || 'kg'})</span>
                        </td>
                        <td className="py-2.5 text-right font-mono text-slate-600">
                          ₹{Number(item.price).toFixed(2)}
                        </td>
                        <td className="py-2.5 text-center font-bold text-slate-800">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 text-right font-mono font-bold text-slate-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals & Payment Summary */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                <div className="space-y-1">
                  <div>
                    Payment Method:{' '}
                    <strong className="text-slate-900">{activeInvoiceOrder.paymentMethod}</strong>
                  </div>
                  <div>
                    Payment Status:{' '}
                    <strong
                      className={
                        activeInvoiceOrder.paymentStatus === 'Completed'
                          ? 'text-emerald-700'
                          : 'text-amber-700'
                      }
                    >
                      {activeInvoiceOrder.paymentStatus === 'Completed' ? 'Paid' : activeInvoiceOrder.paymentStatus || 'Pending'}
                    </strong>
                  </div>
                </div>

                <div className="w-full sm:w-56 space-y-1.5 text-right">
                  <div className="flex justify-between text-slate-500">
                    <span>Items Subtotal:</span>
                    <span className="font-mono text-slate-800">
                      ₹{(activeInvoiceOrder.itemsTotal || activeInvoiceOrder.totalAmount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Delivery Charge:</span>
                    <span className="font-mono text-slate-800">
                      {activeInvoiceOrder.deliveryCharge ? `₹${activeInvoiceOrder.deliveryCharge.toFixed(2)}` : 'FREE'}
                    </span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-200">
                    <span>Grand Total:</span>
                    <span className="text-emerald-700 font-mono">
                      ₹{Number(activeInvoiceOrder.totalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Receipt Footer */}
              <div className="pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400">
                Thank you for shopping with Sandhai Fresh Mart! • Keep this slip for fulfillment and delivery records.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
