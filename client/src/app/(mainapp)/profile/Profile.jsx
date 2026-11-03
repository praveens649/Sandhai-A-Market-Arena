import { useAuth } from "../../../context/AuthContext";
import { User, Mail, Phone, ShieldCheck, LogOut, MapPin, Package, Heart } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Profile = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <section className="space-y-8 pb-12 max-w-4xl mx-auto">
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          ACCOUNT SETTINGS
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
          My Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 p-6 sm:p-10 shadow-xs space-y-8">
        
        {/* User Top Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-700 pb-8">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black ${
              isAdmin ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
            }`}>
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">{user?.name || "Sandhai Customer"}</h2>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isAdmin
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300"
                    : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300"
                }`}>
                  {isAdmin ? "Admin" : "Customer"}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user?.email || "customer@sandhai.com"}</p>
            </div>
          </div>

          {/* HIGH-VISIBILITY LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl font-bold text-xs bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Account</span>
          </button>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              <User className="w-3.5 h-3.5" />
              <span>Full Name</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{user?.name || "Not provided"}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              <Mail className="w-3.5 h-3.5" />
              <span>Email Address</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{user?.email || "Not provided"}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              <Phone className="w-3.5 h-3.5" />
              <span>Contact Number</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{user?.phone || "+91 98765 43210"}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Account Role & Access</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white capitalize">{user?.role || "Customer"}</div>
          </div>
        </div>

        {/* Quick Shortcut Hub */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Quick Shortcuts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              to="/orders"
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-100 dark:border-slate-700 transition-colors flex items-center gap-3 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <Package className="w-5 h-5 text-emerald-600" />
              <span>My Orders</span>
            </Link>

            <Link
              to="/wishlist"
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-100 dark:border-slate-700 transition-colors flex items-center gap-3 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <Heart className="w-5 h-5 text-rose-500" />
              <span>Saved Wishlist</span>
            </Link>

            <Link
              to="/checkout"
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-100 dark:border-slate-700 transition-colors flex items-center gap-3 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <MapPin className="w-5 h-5 text-sky-600" />
              <span>Saved Addresses</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Profile;
