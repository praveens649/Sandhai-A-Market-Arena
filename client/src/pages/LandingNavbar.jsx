import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div className="leading-none">
              <span className="block text-lg font-black text-slate-900 tracking-tight">Sandhai</span>
              <span className="block text-[10px] font-semibold text-emerald-600 uppercase tracking-widest">Marketplace Arena</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
            <a href="#categories" className="hover:text-emerald-600 transition-colors">Categories</a>
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How it works</a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <button
                onClick={() => navigate(isAdmin ? '/app/admin' : '/app/shop')}
                className="px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 transition-all cursor-pointer"
              >
                {isAdmin ? 'Admin Console →' : 'Go to Shop →'}
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-xl text-sm font-bold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3">
          <a href="#features" onClick={() => setMenuOpen(false)} className="block text-sm font-semibold text-slate-700 hover:text-emerald-600 py-2">Features</a>
          <a href="#categories" onClick={() => setMenuOpen(false)} className="block text-sm font-semibold text-slate-700 hover:text-emerald-600 py-2">Categories</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="block text-sm font-semibold text-slate-700 hover:text-emerald-600 py-2">How it works</a>
          <div className="pt-2 flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => { navigate(isAdmin ? '/app/admin' : '/app/shop'); setMenuOpen(false); }}
                className="w-full py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white cursor-pointer"
              >
                {isAdmin ? 'Admin Console →' : 'Go to Shop →'}
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="w-full py-2.5 rounded-xl text-sm font-bold text-center border-2 border-slate-200 text-slate-700">Login</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="w-full py-2.5 rounded-xl text-sm font-bold text-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white">Get Started Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;

