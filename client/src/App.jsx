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

// Smart index redirect based on role
const AppIndexRedirect = () => {
  const { isAdmin } = useAuth();
  return <Navigate to={isAdmin ? '/app/admin' : '/app/shop'} replace />;
};

// Top-level /product/:id redirect to /app/product/:id
const ProductAliasRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/app/product/${id}`} replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <StoreProvider>
        <ThemeProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                {/* ── Public Landing & Auth ── */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* ── Top-level Convenience Aliases (Page 1 of PDF) ── */}
                <Route path="/shop" element={<Navigate to="/app/shop" replace />} />
                <Route path="/cart" element={<Navigate to="/app/cart" replace />} />
                <Route path="/product/:id" element={<ProductAliasRedirect />} />
                <Route path="/wishlist" element={<Navigate to="/app/wishlist" replace />} />
                <Route path="/orders" element={<Navigate to="/app/orders" replace />} />

                {/* ── Protected Authenticated Routes with Nested React Router ── */}
                <Route
                  path="/app"
                  element={
                    <ProtectedRoute>
                      <MainApp />
                    </ProtectedRoute>
                  }
                >
                  {/* Default /app routes based on role */}
                  <Route index element={<AppIndexRedirect />} />

                  {/* Customer Routes */}
                  <Route path="shop" element={<ShopPage />} />
                  <Route path="product/:id" element={<ProductDetailPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="wishlist" element={<WishlistPage />} />
                  <Route path="orders" element={<OrdersPage />} />

                  {/* Admin Protected Routes */}
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
          </ToastProvider>
        </ThemeProvider>
      </StoreProvider>
    </AuthProvider>
  );
};

export default App;
