import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingNavbar = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-transform shrink-0">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div className="leading-none">
              <span className="block text-lg font-black text-slate-900 tracking-tight">Sandhai</span>
              <span className="block text-[10px] font-semibold text-emerald-600 uppercase tracking-widest">Marketplace Arena</span>
            </div>
          </Link>

          {/* Action CTAs (Responsive across Mobile & Desktop) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <button
                onClick={() => navigate(isAdmin ? '/app/admin' : '/app/shop')}
                className="px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 active:scale-95 transition-all cursor-pointer"
              >
                {isAdmin ? 'Admin Console →' : 'Go to Shop →'}
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 active:scale-95 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
