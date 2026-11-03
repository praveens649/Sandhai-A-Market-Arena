import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../_hook/useAdmin';
import AdminAnalyticsChart from '../../_components/AdminAnalyticsChart';
import {
  ShieldCheck,
  Package,
  Users,
  ShoppingBag,
  IndianRupee,
  Plus,
  ArrowRight,
  AlertTriangle,
  Tags,
  Store,
} from 'lucide-react';

const AdminOverviewPage = () => {
  const navigate = useNavigate();
  const { stats, products, orders, loading, analyticsData } = useAdmin();

  // Find low stock items (< 10)
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock < 10);

  return (
    <div className="space-y-6">
      {/* ── Top Hero Banner (Sandhai Admin Gold & Slate Theme) ── */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 rounded-3xl text-white p-8 shadow-xl shadow-amber-950/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-bold mb-3 backdrop-blur-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Administrator Control Center</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">Executive Dashboard</h1>
            <p className="text-amber-100/80 text-sm mt-1 max-w-xl">
              Complete oversight over Sandhai Marketplace transactions, inventory health, and fulfillment pipeline.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate('/app/admin/products')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Manage Catalog</span>
            </button>
            <button
              onClick={() => navigate('/app/admin/orders')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Customer Orders</span>
            </button>
            <button
              onClick={() => navigate('/app/shop')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
              title="Preview Customer Store"
            >
              <Store className="w-4 h-4" />
              <span className="hidden sm:inline">Store Preview</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span className="text-sm font-semibold text-slate-500">Loading store analytics...</span>
        </div>
      ) : (
        <>
          {/* ── 4 Top KPI Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => navigate('/app/admin/products')}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-amber-400 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{products.length}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  Listed Products
                </div>
              </div>
            </div>

            <div
              onClick={() => navigate('/app/admin/users')}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-amber-400 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">
                  {stats?.totalUsers || analyticsData.activeUsersCount}
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  Customers
                </div>
              </div>
            </div>

            <div
              onClick={() => navigate('/app/admin/orders')}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-amber-400 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">
                  {orders.length}
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  Total Orders
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <IndianRupee className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">
                  ₹{analyticsData.totalRevenue.toLocaleString('en-IN')}
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  Processed Revenue
                </div>
              </div>
            </div>
          </div>

          {/* ── Visual Analytics Chart Component ── */}
          <AdminAnalyticsChart analyticsData={analyticsData} />

          {/* ── Low Stock Alert Notice & Recent Orders ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Low Stock Warning Box */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-amber-50 text-amber-700">
                    <AlertTriangle className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">Low Stock Alerts</h3>
                </div>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg">
                  {lowStockProducts.length} items
                </span>
              </div>

              {lowStockProducts.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {lowStockProducts.slice(0, 4).map((p) => (
                    <div key={p._id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{p.name}</div>
                        <div className="text-slate-400 text-[11px]">{p.category?.name || 'Produce'}</div>
                      </div>
                      <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                        {p.stock} {p.unit} left
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  All inventory healthy. No critical low stock items.
                </div>
              )}

              <button
                onClick={() => navigate('/app/admin/products')}
                className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors cursor-pointer"
              >
                Inspect All Stock →
              </button>
            </div>

            {/* Recent Orders Overview Stream */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Recent Store Orders</h3>
                  <p className="text-xs text-slate-500">Live order processing stream</p>
                </div>
                <button
                  onClick={() => navigate('/app/admin/orders')}
                  className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {orders.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {orders.slice(0, 5).map((ord) => (
                    <div key={ord._id} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                          #{ord._id.slice(-4)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">
                            {ord.user?.name || ord.deliveryAddress?.recipientName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {ord.items?.length || 0} product(s) • {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-black text-slate-900 text-sm">₹{ord.totalAmount}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.orderStatus === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-400">No orders placed yet.</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOverviewPage;
