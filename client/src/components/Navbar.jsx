import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, 
  ShieldCheck, 
  User, 
  LogOut, 
  ShoppingCart, 
  Heart, 
  Package, 
  MapPin 
} from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, cartCount = 0, wishlistCount = 0 }) => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab && setActiveTab('shop')} 
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-200">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Sandhai
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 tracking-wider">
                  MARKET
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">A Marketplace Arena</p>
            </div>
          </div>

          {/* Customer Navigation Tabs */}
          {!isAdmin && setActiveTab && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
              <button
                onClick={() => setActiveTab('shop')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'shop'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop</span>
              </button>

              <button
                onClick={() => setActiveTab('cart')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 relative ${
                  activeTab === 'cart'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="bg-emerald-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 relative ${
                  activeTab === 'wishlist'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="bg-rose-500 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'orders'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>My Orders</span>
              </button>
            </nav>
          )}

          {/* User Profile & High-Visibility Logout Button */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                  isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                    <span>{user.name}</span>
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md uppercase tracking-wider ${
                      isAdmin 
                        ? 'bg-amber-500/10 text-amber-700 border border-amber-300' 
                        : 'bg-emerald-500/10 text-emerald-700 border border-emerald-300'
                    }`}>
                      {isAdmin ? 'Admin' : 'User'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-[140px]">{user.email}</div>
                </div>
              </div>
            )}

            {/* HIGH-VISIBILITY PROMINENT LOGOUT BUTTON */}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95"
              title="Logout of Sandhai account"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
