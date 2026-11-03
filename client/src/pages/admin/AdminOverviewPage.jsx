import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import {
  ShieldCheck,
  Package,
  Users,
  ShoppingBag,
  IndianRupee,
  Plus,
  Tags,
} from 'lucide-react';

const AdminOverviewPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/api/admin/dashboard')
      .then((res) => {
        if (res.data.dashboard) setStats(res.data.dashboard);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 rounded-3xl text-white p-8 shadow-xl shadow-amber-950/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-bold mb-3 backdrop-blur-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Administrator Control Center</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">Admin Overview</h1>
            <p className="text-amber-100/80 text-sm mt-1 max-w-xl">
              Real-time store metrics, inventory management, customer support, and fulfillment controls.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/app/admin/products')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Manage Products</span>
            </button>
            <button
              onClick={() => navigate('/app/admin/orders')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Orders</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 font-semibold">
          Loading metrics...
        </div>
      ) : (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => navigate('/app/admin/products')}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-amber-400 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{stats?.totalProducts || 0}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Active Products</div>
              </div>
            </div>

            <div
              onClick={() => navigate('/app/admin/users')}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-amber-400 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{stats?.totalUsers || 0}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Customers</div>
              </div>
            </div>

            <div
              onClick={() => navigate('/app/admin/orders')}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-amber-400 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{stats?.totalOrders || 0}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Total Orders</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <IndianRupee className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">
                  ₹{stats?.totalSales?.toLocaleString('en-IN') || 0}
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Total Revenue</div>
              </div>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Recent Customer Transactions</h3>
                <p className="text-xs text-slate-500">Live order processing stream</p>
              </div>
              <button
                onClick={() => navigate('/app/admin/orders')}
                className="text-xs font-bold text-amber-700 hover:underline"
              >
                View All Orders →
              </button>
            </div>

            {stats?.recentOrders?.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {stats.recentOrders.map((ord) => (
                  <div key={ord._id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-amber-800">#{ord._id.slice(-8)}</span>
                      <span className="text-slate-400 mx-2">•</span>
                      <span className="font-bold text-slate-800">{ord.user?.name || ord.deliveryAddress?.recipientName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900">₹{ord.totalAmount}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold ${
                          ord.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.orderStatus === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">No recent orders.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOverviewPage;

