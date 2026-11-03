import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
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
  MapPin
} from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, cartCount = 0, wishlistCount = 0 }) => {
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleTabClick(isAdmin ? 'overview' : 'shop')} 
            className="flex items-center gap-2.5 cursor-pointer select-none group"
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
          </div>

          {/* Desktop Navigation Tabs: Dynamic Role-Based */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
            {isAdmin ? (
              /* Admin Navigation Tabs */
              <>
                <button
                  onClick={() => handleTabClick('overview')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-white text-amber-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => handleTabClick('admin-products')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                    activeTab === 'admin-products'
                      ? 'bg-white text-amber-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Products</span>
                </button>

                <button
                  onClick={() => handleTabClick('admin-categories')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                    activeTab === 'admin-categories'
                      ? 'bg-white text-amber-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Tags className="w-4 h-4" />
                  <span>Categories</span>
                </button>

                <button
                  onClick={() => handleTabClick('admin-orders')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                    activeTab === 'admin-orders'
                      ? 'bg-white text-amber-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>All Orders</span>
                </button>

                <button
                  onClick={() => handleTabClick('admin-users')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                    activeTab === 'admin-users'
                      ? 'bg-white text-amber-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Customers</span>
                </button>
              </>
            ) : (
              /* Customer Navigation Tabs */
              <>
                <button
                  onClick={() => handleTabClick('shop')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                    activeTab === 'shop'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop</span>
                </button>

                <button
                  onClick={() => handleTabClick('cart')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer relative ${
                    activeTab === 'cart'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none">
                      {cartCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleTabClick('wishlist')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer relative ${
                    activeTab === 'wishlist'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleTabClick('orders')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>My Orders</span>
                </button>
              </>
            )}
          </nav>

          {/* User Profile Badge & High-Visibility Logout Button */}
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

            {/* HIGH-VISIBILITY PROMINENT LOGOUT BUTTON */}
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
          {user && (
            <div className="pb-3 border-b border-slate-100 mb-3 flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">{user.name} ({isAdmin ? 'Admin' : 'Customer'})</div>
                <div className="text-[11px] text-slate-500">{user.email}</div>
              </div>
            </div>
          )}

          {isAdmin ? (
            <>
              <button
                onClick={() => handleTabClick('overview')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-left ${
                  activeTab === 'overview' ? 'bg-amber-50 text-amber-800' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview Dashboard</span>
              </button>
              <button
                onClick={() => handleTabClick('admin-products')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-left ${
                  activeTab === 'admin-products' ? 'bg-amber-50 text-amber-800' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Products Management</span>
              </button>
              <button
                onClick={() => handleTabClick('admin-categories')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-left ${
                  activeTab === 'admin-categories' ? 'bg-amber-50 text-amber-800' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Tags className="w-4 h-4" />
                <span>Categories Management</span>
              </button>
              <button
                onClick={() => handleTabClick('admin-orders')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-left ${
                  activeTab === 'admin-orders' ? 'bg-amber-50 text-amber-800' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>All Orders</span>
              </button>
              <button
                onClick={() => handleTabClick('admin-users')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-left ${
                  activeTab === 'admin-users' ? 'bg-amber-50 text-amber-800' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Customer Accounts</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleTabClick('shop')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-left ${
                  activeTab === 'shop' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop Catalog</span>
              </button>
              <button
                onClick={() => handleTabClick('cart')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold text-left ${
                  activeTab === 'cart' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Cart</span>
                </div>
                {cartCount > 0 && (
                  <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">{cartCount}</span>
                )}
              </button>
              <button
                onClick={() => handleTabClick('wishlist')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold text-left ${
                  activeTab === 'wishlist' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4" />
                  <span>Wishlist</span>
                </div>
                {wishlistCount > 0 && (
                  <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">{wishlistCount}</span>
                )}
              </button>
              <button
                onClick={() => handleTabClick('orders')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-left ${
                  activeTab === 'orders' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>My Orders</span>
              </button>
            </>
          )}

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs"
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
