import { Link } from "react-router-dom";
import { Store, Mail, Phone, MapPin, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Sandhai</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Sandhai is your trusted everyday marketplace arena. Sourcing farm-fresh fruits, organic vegetables, pure dairy, and grocery staples directly to your doorstep.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Quick Links</h4>
            <div className="flex flex-col space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Home</Link>
              <Link to="/products" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">All Products</Link>
              <Link to="/orders" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Order Tracking</Link>
              <Link to="/profile" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">My Account</Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Contact & Support</h4>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>support@sandhai.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>+91 98765 43210</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Chennai, Tamil Nadu, India</span>
              </p>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Sandhai — A Marketplace Arena. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for fresh produce shopping
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
