import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';

const ProtectedRoute = ({ children, requiredRole = null, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <span className="text-sm font-semibold text-slate-500">Checking credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check adminOnly or requiredRole
  const needsAdmin = adminOnly || requiredRole === 'admin';
  if (needsAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
        <div className="bg-white border border-rose-200 shadow-xl rounded-3xl p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Access Restricted</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            This module requires <strong className="text-rose-600 font-bold">Administrator</strong> privileges. You are currently logged in as a standard Customer (<span className="font-mono text-slate-800">{user?.email}</span>).
          </p>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              to="/app"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Customer Arena</span>
            </Link>
            <button
              onClick={logout}
              className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out & Switch Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
