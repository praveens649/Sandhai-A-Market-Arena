import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight 
} from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { signup, isAuthenticated, isAdmin, role } = useAuth();
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      // New signup is always a customer
      navigate('/app/shop', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Signup failed. Please try again.'
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Join Sandhai</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Create your customer account</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold flex items-start gap-2.5">
            <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Ramesh Kumar"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-slate-900 text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="ramesh@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-slate-900 text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Phone Number <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <div className="relative flex items-center">
              <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
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
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
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

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-slate-900 text-sm transition-all"
              />
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
                <span>Create Customer Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;
