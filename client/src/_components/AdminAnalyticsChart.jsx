import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  ShoppingBag,
  IndianRupee,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
} from 'lucide-react';

const AdminAnalyticsChart = ({ analyticsData }) => {
  const [activeChartTab, setActiveChartTab] = useState('revenue'); // 'revenue' or 'status'
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  const {
    last7Days = [],
    statusCounts = { Ordered: 0, Delivered: 0, Cancelled: 0 },
    totalRevenue = 0,
    averageOrderValue = 0,
    completionRate = 0,
    totalOrders = 0,
    activeUsersCount = 0,
  } = analyticsData || {};

  // Find max sales for proportional bar scaling
  const maxSales = Math.max(...last7Days.map((d) => d.sales), 500);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
      {/* Top Header with Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-50 text-amber-700">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="font-black text-slate-900 text-lg tracking-tight">
              Store Sales & Performance Analytics
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time revenue metrics, weekly sales volume, and order fulfillment distribution
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveChartTab('revenue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeChartTab === 'revenue'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>7-Day Sales Trend</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveChartTab('status')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeChartTab === 'status'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Fulfillment Ratio</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Average Order Value
          </div>
          <div className="text-lg font-black text-slate-900 mt-0.5">
            ₹{averageOrderValue}
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Fulfillment Rate
          </div>
          <div className="text-lg font-black text-emerald-700 mt-0.5">
            {completionRate}%
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Active Buyers
          </div>
          <div className="text-lg font-black text-slate-900 mt-0.5">
            {activeUsersCount} users
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Gross Processed
          </div>
          <div className="text-lg font-black text-emerald-700 mt-0.5">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* ── 1. REVENUE BAR CHART VIEW ── */}
      {activeChartTab === 'revenue' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-2">
            <span>Daily Sales Volume (₹)</span>
            <span>Max Scale: ₹{maxSales}</span>
          </div>

          {/* SVG & Bar Visualization */}
          <div className="h-56 w-full flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-slate-100 relative">
            {/* Background Grid Lines */}
            <div className="absolute inset-x-0 top-6 border-b border-dashed border-slate-200 pointer-events-none" />
            <div className="absolute inset-x-0 top-28 border-b border-dashed border-slate-200 pointer-events-none" />

            {last7Days.map((item, idx) => {
              const heightPercent = maxSales > 0 ? Math.max(12, (item.sales / maxSales) * 100) : 12;
              const isHovered = hoveredBarIndex === idx;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                >
                  {/* Floating Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-12 z-20 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl shadow-xl pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                      <div>₹{item.sales}</div>
                      <div className="text-[10px] text-emerald-400 font-medium">
                        {item.orders} order(s)
                      </div>
                    </div>
                  )}

                  {/* Visual Bar with Gradient */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[42px] rounded-t-xl transition-all duration-300 ${
                      item.sales > 0
                        ? 'bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:from-emerald-500 group-hover:to-teal-300 shadow-sm'
                        : 'bg-slate-200 group-hover:bg-slate-300'
                    } ${isHovered ? 'ring-4 ring-emerald-500/20 scale-[1.03]' : ''}`}
                  />

                  {/* Day Label */}
                  <span className="text-[11px] font-bold text-slate-700 mt-2 block">
                    {item.day}
                  </span>
                  <span className="text-[9px] font-medium text-slate-400 block -mt-0.5">
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-2">
            <span>Hover on bars to inspect orders and daily revenue</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 inline-block" />
              <span>Revenue (INR)</span>
            </span>
          </div>
        </div>
      )}

      {/* ── 2. ORDER FULFILLMENT DISTRIBUTION ── */}
      {activeChartTab === 'status' && (
        <div className="space-y-4 pt-2">
          <div className="space-y-3">
            {[
              {
                label: 'Ordered',
                count: statusCounts.Ordered || 0,
                color: 'bg-blue-500',
                textColor: 'text-blue-700',
                bgColor: 'bg-blue-50',
                icon: Clock,
              },
              {
                label: 'Delivered',
                count: statusCounts.Delivered || 0,
                color: 'bg-emerald-600',
                textColor: 'text-emerald-700',
                bgColor: 'bg-emerald-50',
                icon: CheckCircle2,
              },
              {
                label: 'Cancelled',
                count: statusCounts.Cancelled || 0,
                color: 'bg-rose-500',
                textColor: 'text-rose-700',
                bgColor: 'bg-rose-50',
                icon: XCircle,
              },
            ].map(({ label, count, color, textColor, bgColor, icon: Icon }) => {
              const percentage = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;

              return (
                <div key={label} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <span className={`p-1 rounded-lg ${bgColor} ${textColor}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-slate-800">{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-normal">{count} orders</span>
                      <span className={`${textColor} font-black`}>{percentage}%</span>
                    </div>
                  </div>

                  {/* Horizontal Progress Bar */}
                  <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                    <div
                      className={`${color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalyticsChart;

