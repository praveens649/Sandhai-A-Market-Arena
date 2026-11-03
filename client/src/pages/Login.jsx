import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Lock, Mail, Eye, EyeOff, ShieldCheck, UserCheck } from 'lucide-react';

const Login = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { loginCustomer, loginAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/app';

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
      if (isAdminMode) {
        await loginAdmin(email, password);
      } else {
        await loginCustomer(email, password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Authentication failed. Please verify credentials.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <ShoppingBag size={32} />
          </div>
          <h1>Sandhai</h1>
          <p className="auth-tagline">A Marketplace Arena</p>
        </div>

        {/* Role Mode Tabs */}
        <div className="role-tabs">
          <button
            type="button"
            className={`tab-btn ${!isAdminMode ? 'tab-active' : ''}`}
            onClick={() => {
              setIsAdminMode(false);
              setError('');
            }}
          >
            <UserCheck size={16} />
            <span>Customer</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${isAdminMode ? 'tab-active' : ''}`}
            onClick={() => {
              setIsAdminMode(true);
              setError('');
            }}
          >
            <ShieldCheck size={16} />
            <span>Administrator</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert-error">
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isAdminMode ? 'superadmin@example.com' : 'customer@example.com'}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
              <button
                type="button"
                className="pwd-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? (
              <span className="spinner-text">Authenticating...</span>
            ) : (
              <span>{isAdminMode ? 'Sign In as Admin' : 'Sign In as Customer'}</span>
            )}
          </button>
        </form>

        {/* Quick Admin Credential Hint */}
        {isAdminMode && (
          <div className="admin-hint-box">
            <div className="hint-header">
              <ShieldCheck size={14} />
              <span>Default Seeded Admin Credentials</span>
            </div>
            <div className="hint-body">
              <div>Email: <code>superadmin@example.com</code></div>
              <div>Password: <code>12345678910</code></div>
            </div>
            <button type="button" onClick={fillAdminCredentials} className="autofill-btn">
              Auto-fill Admin Credentials
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="auth-footer">
          {!isAdminMode ? (
            <p>
              New customer?{' '}
              <Link to="/signup" className="auth-link">
                Create an account
              </Link>
            </p>
          ) : (
            <p>
              Switching to regular store?{' '}
              <button
                type="button"
                onClick={() => setIsAdminMode(false)}
                className="text-btn"
              >
                Customer login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

