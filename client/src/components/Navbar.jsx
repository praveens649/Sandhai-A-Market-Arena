import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import ThemeToggle from './ThemeToggle';
import { 
  ShoppingBag, 
  LogOut, 
  ShoppingCart, 
  Heart, 
  Package, 
  LayoutDashboard,
  Tags,
  Users,
  Menu,
  X,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { cart, wishlist } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const cartCount = cart?.totalItems || 0;
  const wishlistCount = wishlist?.length || 0;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <Link 
            to={isAdmin ? '/app/admin' : '/app/shop'} 
            className="flex items-center gap-2.5 select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-200">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  Sandhai
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isAdmin 
                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700' 
                    : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                }`}>
                  {isAdmin ? 'ADMIN CONSOLE' : 'MARKET'}
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">A Marketplace Arena</p>
            </div>
          </Link>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/90 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            {isAdmin ? (
              /* Admin Route Navigation Links */
              <>
                <NavLink
                  to="/app/admin"
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-amber-800 dark:text-amber-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`
                  }
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overview</span>
                </NavLink>

                <NavLink
                  to="/app/admin/products"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-amber-800 dark:text-amber-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`
                  }
                >
                  <Package className="w-4 h-4" />
                  <span>Products</span>
                </NavLink>

                <NavLink
                  to="/app/admin/categories"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-amber-800 dark:text-amber-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`
                  }
                >
                  <Tags className="w-4 h-4" />
                  <span>Categories</span>
                </NavLink>

                <NavLink
                  to="/app/admin/orders"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-amber-800 dark:text-amber-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`
                  }
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>All Orders</span>
                </NavLink>

                <NavLink
                  to="/app/admin/users"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-amber-800 dark:text-amber-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`
                  }
                >
                  <Users className="w-4 h-4" />
                  <span>Customers</span>
                </NavLink>
              </>
            ) : (
              /* Customer Route Navigation Links */
              <>
                <NavLink
                  to="/app/shop"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                      isActive || location.pathname.startsWith('/app/product')
                        ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`
                  }
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop</span>
                </NavLink>

                <NavLink
                  to="/app/cart"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 relative ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`
                  }
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none">
                      {cartCount}
                    </span>
                  )}
                </NavLink>

                <NavLink
                  to="/app/wishlist"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 relative ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`
                  }
                >
                  <Heart className="w-4 h-4" />
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none">
                      {wishlistCount}
                    </span>
                  )}
                </NavLink>

                <NavLink
                  to="/app/orders"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`
                  }
                >
                  <Package className="w-4 h-4" />
                  <span>My Orders</span>
                </NavLink>
              </>
            )}
          </nav>

          {/* User Profile Badge, Theme Toggle & Logout */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {user && (
              <div className="hidden sm:flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 px-3 py-1.5 rounded-xl transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                  isAdmin 
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' 
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                }`}>
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                    <span>{user.name}</span>
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md uppercase tracking-wider ${
                      isAdmin 
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700' 
                        : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700'
                    }`}>
                      {isAdmin ? 'Admin' : 'Customer'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[130px]">{user.email}</div>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white border border-rose-200 dark:border-rose-800/80 hover:border-rose-600 shadow-xs hover:shadow-md transition-all duration-150 cursor-pointer active:scale-95"
              title="Sign out of Sandhai account"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-2">
          {isAdmin ? (
            <>
              <Link
                to="/app/admin"
                onClick={closeMobileMenu}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview Dashboard</span>
              </Link>
              <Link
                to="/app/admin/products"
                onClick={closeMobileMenu}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Package className="w-4 h-4" />
                <span>Products Management</span>
              </Link>
              <Link
                to="/app/admin/categories"
                onClick={closeMobileMenu}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Tags className="w-4 h-4" />
                <span>Categories Management</span>
              </Link>
              <Link
                to="/app/admin/orders"
                onClick={closeMobileMenu}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>All Orders</span>
              </Link>
              <Link
                to="/app/admin/users"
                onClick={closeMobileMenu}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Users className="w-4 h-4" />
                <span>Customer Accounts</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/app/shop"
                onClick={closeMobileMenu}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop Catalog</span>
              </Link>
              <Link
                to="/app/cart"
                onClick={closeMobileMenu}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Cart</span>
                </div>
                {cartCount > 0 && (
                  <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">{cartCount}</span>
                )}
              </Link>
              <Link
                to="/app/wishlist"
                onClick={closeMobileMenu}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4" />
                  <span>Wishlist</span>
                </div>
                {wishlistCount > 0 && (
                  <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">{wishlistCount}</span>
                )}
              </Link>
              <Link
                to="/app/orders"
                onClick={closeMobileMenu}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Package className="w-4 h-4" />
                <span>My Orders</span>
              </Link>
            </>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Theme</span>
            <ThemeToggle showLabel />
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 font-bold text-xs cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
