import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, ShieldCheck, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="brand">
          <div className="brand-icon">
            <ShoppingBag size={24} />
          </div>
          <div>
            <div className="brand-title">Sandhai</div>
            <div className="brand-subtitle">A Marketplace Arena</div>
          </div>
        </div>

        {user && (
          <div className="nav-user-section">
            <div className="user-badge">
              <span className={`role-pill ${isAdmin ? 'role-admin' : 'role-user'}`}>
                {isAdmin ? (
                  <>
                    <ShieldCheck size={14} /> Admin
                  </>
                ) : (
                  <>
                    <User size={14} /> Customer
                  </>
                )}
              </span>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-email">{user.email}</span>
              </div>
            </div>

            <button onClick={logout} className="logout-btn" title="Sign out">
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

