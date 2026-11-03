import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../api/client';
import {
  Package,
  Users,
  ShoppingBag,
  IndianRupee,
  Layers,
  Database,
  CheckCircle,
  Clock,
  Truck,
  Sparkles,
} from 'lucide-react';

const MainApp = () => {
  const { user, isAdmin } = useAuth();
  const [adminStats, setAdminStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        if (isAdmin) {
          // Fetch admin dashboard stats from MongoDB backend
          const res = await api.get('/api/admin/dashboard');
          if (res.data.success) {
            setAdminStats(res.data.dashboard);
          }
        } else {
          // Fetch categories and products for customer
          const [catRes, prodRes] = await Promise.all([
            api.get('/api/categories'),
            api.get('/api/products?limit=8'),
          ]);
          if (catRes.data.success) setCategories(catRes.data.categories);
          if (prodRes.data.success) setProducts(prodRes.data.products);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load data from MongoDB server.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAdmin]);

  return (
    <div className="mainapp-layout">
      <Navbar />

      <main className="mainapp-content">
        {/* Protected Route Banner */}
        <div className="status-banner">
          <div className="status-item">
            <span className="status-dot"></span>
            <span><strong>Protected Session Active:</strong> Logged in as <code>{user?.email}</code></span>
          </div>
          <div className="db-badge">
            <Database size={15} />
            <span>MongoDB Atlas Connected</span>
          </div>
        </div>

        {error && <div className="alert-error mb-4">{error}</div>}

        {isAdmin ? (
          /* ================= ADMIN VIEW ================= */
          <div className="admin-view">
            <div className="section-header">
              <div>
                <h2>Administrator Dashboard</h2>
                <p>Overview of products, orders, and sales across Sandhai</p>
              </div>
              <span className="role-tag admin-tag">Admin Panel</span>
            </div>

            {loading ? (
              <div className="loading-box">Loading admin statistics from MongoDB...</div>
            ) : adminStats ? (
              <>
                {/* Stats Grid */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon icon-products">
                      <Package size={22} />
                    </div>
                    <div>
                      <div className="stat-value">{adminStats.totalProducts}</div>
                      <div className="stat-label">Active Products</div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon icon-users">
                      <Users size={22} />
                    </div>
                    <div>
                      <div className="stat-value">{adminStats.totalUsers}</div>
                      <div className="stat-label">Registered Customers</div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon icon-orders">
                      <ShoppingBag size={22} />
                    </div>
                    <div>
                      <div className="stat-value">{adminStats.totalOrders}</div>
                      <div className="stat-label">Total Orders</div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon icon-revenue">
                      <IndianRupee size={22} />
                    </div>
                    <div>
                      <div className="stat-value">₹{adminStats.totalSales?.toLocaleString('en-IN') || 0}</div>
                      <div className="stat-label">Total Revenue</div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders Section */}
                <div className="dashboard-section mt-8">
                  <div className="section-title-row">
                    <h3>Recent Orders</h3>
                    <span className="count-badge">{adminStats.recentOrders?.length || 0} recent</span>
                  </div>

                  {adminStats.recentOrders?.length > 0 ? (
                    <div className="table-responsive">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total (₹)</th>
                            <th>Payment</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminStats.recentOrders.map((ord) => (
                            <tr key={ord._id}>
                              <td><code>#{ord._id.slice(-6)}</code></td>
                              <td>
                                <div className="customer-cell">
                                  <strong>{ord.user?.name || ord.deliveryAddress?.recipientName}</strong>
                                  <small>{ord.user?.email || ord.deliveryAddress?.phone}</small>
                                </div>
                              </td>
                              <td>{ord.items?.length || 0} item(s)</td>
                              <td>₹{ord.totalAmount}</td>
                              <td><span className="pay-badge">{ord.paymentMethod}</span></td>
                              <td>
                                <span className={`order-status-badge status-${ord.orderStatus?.toLowerCase()}`}>
                                  {ord.orderStatus}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state">No orders placed yet.</div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        ) : (
          /* ================= CUSTOMER VIEW ================= */
          <div className="customer-view">
            {/* Hero Welcome */}
            <div className="customer-hero">
              <div className="hero-content">
                <span className="hero-tag"><Sparkles size={14} /> Fresh & Organic Marketplace</span>
                <h1>Vanakkam, {user?.name}!</h1>
                <p>Welcome to your personal marketplace arena. Explore fresh fruits, vegetables, dairy, and grocery staples sourced directly from farms.</p>
              </div>
            </div>

            {loading ? (
              <div className="loading-box">Loading marketplace items from MongoDB...</div>
            ) : (
              <>
                {/* Grocery Categories */}
                <div className="marketplace-section">
                  <div className="section-title-row">
                    <div>
                      <h2>Grocery Categories</h2>
                      <p>Browse fresh selections curated by categories</p>
                    </div>
                  </div>

                  <div className="categories-grid">
                    {categories.map((cat) => (
                      <div key={cat._id} className="category-card">
                        {cat.image && (
                          <div className="category-img-wrapper">
                            <img src={cat.image} alt={cat.name} className="category-img" />
                          </div>
                        )}
                        <div className="category-info">
                          <h3>{cat.name}</h3>
                          <p>{cat.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Featured Products */}
                {products.length > 0 && (
                  <div className="marketplace-section mt-8">
                    <div className="section-title-row">
                      <div>
                        <h2>Featured Products</h2>
                        <p>High quality farm-fresh produce available for instant order</p>
                      </div>
                    </div>

                    <div className="products-grid">
                      {products.map((prod) => (
                        <div key={prod._id} className="product-card">
                          {prod.image ? (
                            <img src={prod.image} alt={prod.name} className="product-img" />
                          ) : (
                            <div className="product-img-fallback">
                              <Package size={32} />
                            </div>
                          )}
                          <div className="product-body">
                            <span className="product-category">{prod.category?.name || 'Produce'}</span>
                            <h4 className="product-name">{prod.name}</h4>
                            <p className="product-desc">{prod.description}</p>
                            <div className="product-footer">
                              <div className="product-price">
                                ₹{prod.price} <small>/ {prod.unit || 'kg'}</small>
                              </div>
                              <span className="stock-pill">
                                {prod.stock > 0 ? `${prod.stock} in stock` : 'Out of stock'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MainApp;

