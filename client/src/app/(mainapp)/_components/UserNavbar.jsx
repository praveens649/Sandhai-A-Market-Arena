import { Link, NavLink, useNavigate } from "react-router-dom";
import { 
  ShoppingCart, 
  Heart, 
  User, 
  Store, 
  LogOut, 
  LogIn,
  Package,
  ShoppingBag
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect } from "react";

const UserNavbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Read cart & wishlist count
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const updateCounts = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("sandhai-cart") || "[]");
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(totalItems);

        const wishlist = JSON.parse(localStorage.getItem("sandhai-wishlist") || "[]");
        setWishlistCount(wishlist.length);
      } catch (e) {
        setCartCount(0);
        setWishlistCount(0);
      }
    };

    updateCounts();
    const interval = setInterval(updateCounts, 800);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group select-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-200">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  Sandhai
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  MARKET
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 hidden sm:block">A Marketplace Arena</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`
              }
            >
              Products
            </NavLink>

            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`
              }
            >
              My Orders
            </NavLink>

            {isAdmin && (
              <Link
                to="/app"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 hover:bg-amber-200"
              >
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Right Action Icons & PROMINENT LOGOUT */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <ThemeToggle />

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            <Link
              to="/profile"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Profile"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* PROMINENT LOGOUT BUTTON OR LOGIN */}
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 transition-all duration-200 shadow-xs cursor-pointer active:scale-95 ml-1"
                title="Sign out of account"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all duration-200 cursor-pointer ml-1"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

export default UserNavbar;
