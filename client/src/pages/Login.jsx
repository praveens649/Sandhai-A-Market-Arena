import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  UserCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

const Login = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { loginCustomer, loginAdmin, isAuthenticated, isAdmin, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated, redirect to the user's role-specific home
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin || role === 'admin') {
        navigate('/app/admin', { replace: true });
      } else {
        navigate('/app/shop', { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, role, navigate]);

  const fillAdminCredentials = () => {
    setIsAdminMode(true);
    setEmail('superadmin@example.com');
    setPassword('12345678910');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      let authRes;
      if (isAdminMode) {
        authRes = await loginAdmin(email, password);
      } else {
        authRes = await loginCustomer(email, password);
      }

      // Check role returned from the decoded JWT payload
      const userRole = authRes?.role || (isAdminMode ? 'admin' : 'user');
      const fromPath = location.state?.from?.pathname;

      if (userRole === 'admin') {
        // If coming from an admin route, respect it; otherwise send to /app/admin
        if (fromPath && fromPath.startsWith('/app/admin')) {
          navigate(fromPath, { replace: true });
        } else {
          navigate('/app/admin', { replace: true });
        }
      } else {
        // Customer role: if coming from a customer route, respect it; don't route to an admin route!
        if (fromPath && fromPath.startsWith('/app') && !fromPath.startsWith('/app/admin')) {
          navigate(fromPath, { replace: true });
        } else {
          navigate('/app/shop', { replace: true });
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Authentication failed. Please check credentials.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/40 to-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30 mb-3">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sandhai</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">A Marketplace Arena</p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl mb-6 border border-slate-200/60">
          <button
            type="button"
            onClick={() => {
              setIsAdminMode(false);
              setError('');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
              !isAdminMode
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Customer</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsAdminMode(true);
              setError('');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
              isAdminMode
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Administrator</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold flex items-start gap-2.5">
            <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isAdminMode ? 'superadmin@example.com' : 'you@example.com'}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-slate-900 text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-11 py-3 rounded-xl bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-slate-900 text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/25 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isAdminMode ? 'Sign In as Administrator' : 'Sign In as Customer'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Admin Auto-fill Box */}
        {isAdminMode && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-900 mb-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Seeded Admin Credentials</span>
            </div>
            <div className="space-y-1 text-slate-700 font-mono text-[11px] mb-3 bg-white/80 p-2.5 rounded-lg border border-amber-200/40">
              <div>Email: <strong>superadmin@example.com</strong></div>
              <div>Pass: <strong>12345678910</strong></div>
            </div>
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-fill Admin Credentials</span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          {!isAdminMode ? (
            <p className="text-sm text-slate-600">
              New customer?{' '}
              <Link to="/signup" className="font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
                Create an account
              </Link>
            </p>
          ) : (
            <p className="text-sm text-slate-600">
              Customer store login?{' '}
              <button
                type="button"
                onClick={() => setIsAdminMode(false)}
                className="font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-4 cursor-pointer"
              >
                Switch to Customer
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Login;
