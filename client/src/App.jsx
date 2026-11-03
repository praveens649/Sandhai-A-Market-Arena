import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Marketing & Auth Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Protected App Layout
import MainApp from './pages/MainApp';

// Customer Feature Pages (React Router Driven)
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import OrdersPage from './pages/OrdersPage';

// Admin Feature Pages (React Router Driven)
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

// Smart index redirect based on verified JWT role
const AppIndexRedirect = () => {
  const { role, isAdmin } = useAuth();
  return <Navigate to={role === 'admin' || isAdmin ? '/app/admin' : '/app/shop'} replace />;
};

// Smart orders alias: admin goes to all orders console, customer goes to customer orders
const OrdersRedirect = () => {
  const { role, isAdmin } = useAuth();
  return <Navigate to={role === 'admin' || isAdmin ? '/app/admin/orders' : '/app/orders'} replace />;
};

// Smart cart alias: admin goes to admin overview, customer goes to cart
const CartRedirect = () => {
  const { role, isAdmin } = useAuth();
  return <Navigate to={role === 'admin' || isAdmin ? '/app/admin' : '/app/cart'} replace />;
};

// Smart wishlist alias
const WishlistRedirect = () => {
  const { role, isAdmin } = useAuth();
  return <Navigate to={role === 'admin' || isAdmin ? '/app/admin' : '/app/wishlist'} replace />;
};

// Top-level /product/:id redirect to /app/product/:id
const ProductAliasRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/app/product/${id}`} replace />;
};

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <StoreProvider>
          <ThemeProvider>
            <BrowserRouter>
              <Routes>
                {/* ── Public Landing & Auth ── */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* ── Top-level Convenience Aliases (Page 1 of PDF) ── */}
                <Route path="/shop" element={<Navigate to="/app/shop" replace />} />
                <Route path="/cart" element={<CartRedirect />} />
                <Route path="/wishlist" element={<WishlistRedirect />} />
                <Route path="/orders" element={<OrdersRedirect />} />
                <Route path="/product/:id" element={<ProductAliasRedirect />} />

                {/* ── Protected Authenticated Routes with Nested React Router ── */}
                <Route
                  path="/app"
                  element={
                    <ProtectedRoute>
                      <MainApp />
                    </ProtectedRoute>
                  }
                >
                  {/* Default /app routes based on JWT role */}
                  <Route index element={<AppIndexRedirect />} />

                  {/* Customer Catalog & Product Viewing */}
                  <Route path="shop" element={<ShopPage />} />
                  <Route path="product/:id" element={<ProductDetailPage />} />

                  {/* Customer Private Routes (Restricted from Admin role) */}
                  <Route
                    path="cart"
                    element={
                      <ProtectedRoute userOnly>
                        <CartPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="wishlist"
                    element={
                      <ProtectedRoute userOnly>
                        <WishlistPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="orders"
                    element={
                      <ProtectedRoute userOnly>
                        <OrdersPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Protected Routes (Restricted from Customer role) */}
                  <Route
                    path="admin"
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminOverviewPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/products"
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminProductsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/categories"
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminCategoriesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/orders"
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminOrdersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/users"
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminUsersPage />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* ── Catch-all Fallback ── */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </StoreProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
