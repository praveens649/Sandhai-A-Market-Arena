import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingBag, 
  ShieldCheck, 
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo with React Router Link */}
          <Link 
            to={isAdmin ? '/app/admin' : '/app/shop'} 
            className="flex items-center gap-2.5 select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-200">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Sandhai
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isAdmin 
                    ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isAdmin ? 'ADMIN CONSOLE' : 'MARKET'}
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">A Marketplace Arena</p>
            </div>
          </Link>

          {/* Desktop Navigation Tabs powered by React Router NavLink */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
            {isAdmin ? (
              /* Admin Route Navigation Links */
              <>
                <NavLink
                  to="/app/admin"
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                      isActive
                        ? 'bg-white text-amber-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
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
                        ? 'bg-white text-amber-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
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
                        ? 'bg-white text-amber-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
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
                        ? 'bg-white text-amber-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
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
                        ? 'bg-white text-amber-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
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
                        ? 'bg-white text-emerald-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
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
                        ? 'bg-white text-emerald-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
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
                        ? 'bg-white text-emerald-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
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
                        ? 'bg-white text-emerald-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`
                  }
                >
                  <Package className="w-4 h-4" />
                  <span>My Orders</span>
                </NavLink>
              </>
            )}
          </nav>

          {/* User Profile Badge & High-Visibility Logout */}
          <div className="flex items-center gap-2.5">
            {user && (
              <div className="hidden sm:flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                  isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                    <span>{user.name}</span>
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md uppercase tracking-wider ${
                      isAdmin 
                        ? 'bg-amber-500/10 text-amber-700 border border-amber-300' 
                        : 'bg-emerald-500/10 text-emerald-700 border border-emerald-300'
                    }`}>
                      {isAdmin ? 'Admin' : 'Customer'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-[130px]">{user.email}</div>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 shadow-xs hover:shadow-md transition-all duration-150 cursor-pointer active:scale-95"
              title="Sign out of Sandhai account"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2">
          {isAdmin ? (
            <>
              <Link
                to="/app/admin"
                onClick={closeMobileMenu}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview Dashboard</span>
              </Link>
              <Link
                to="/app/admin/products"
                onClick={closeMobileMenu}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <Package className="w-4 h-4" />
                <span>Products Management</span>
              </Link>
              <Link
                to="/app/admin/categories"
                onClick={closeMobileMenu}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <Tags className="w-4 h-4" />
                <span>Categories Management</span>
              </Link>
              <Link
                to="/app/admin/orders"
                onClick={closeMobileMenu}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>All Orders</span>
              </Link>
              <Link
                to="/app/admin/users"
                onClick={closeMobileMenu}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
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
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop Catalog</span>
              </Link>
              <Link
                to="/app/cart"
                onClick={closeMobileMenu}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
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
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
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
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <Package className="w-4 h-4" />
                <span>My Orders</span>
              </Link>
            </>
          )}

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs cursor-pointer"
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
