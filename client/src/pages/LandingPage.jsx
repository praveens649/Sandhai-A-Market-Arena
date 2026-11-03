import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LandingNavbar from './LandingNavbar';
import {
  ShoppingBag,
  Truck,
  Star,
  ShieldCheck,
  Leaf,
  Tag,
  ArrowRight,
  CheckCircle2,
  Zap,
  Heart,
  Package,
  Users,
} from 'lucide-react';

// ──────────────────────────────────────────
// Static Data
// ──────────────────────────────────────────
const FEATURES = [
  {
    icon: Leaf,
    color: 'from-emerald-500 to-green-400',
    bg: 'bg-emerald-50',
    title: 'Farm Fresh Quality',
    desc: 'Directly sourced produce delivered at its freshest — no middlemen, no compromises.',
  },
  {
    icon: Truck,
    color: 'from-blue-500 to-cyan-400',
    bg: 'bg-blue-50',
    title: 'Free Delivery ≥ ₹500',
    desc: 'Orders above ₹500 ship free. Below that, a flat ₹40 covers your delivery.',
  },
  {
    icon: ShieldCheck,
    color: 'from-violet-500 to-purple-400',
    bg: 'bg-violet-50',
    title: 'Safe & Secure',
    desc: 'JWT-secured accounts, encrypted data, and verified payment flows keep you safe.',
  },
  {
    icon: Tag,
    color: 'from-amber-500 to-orange-400',
    bg: 'bg-amber-50',
    title: 'Best Prices Guaranteed',
    desc: 'Transparent pricing with zero hidden charges. What you see is what you pay.',
  },
  {
    icon: Zap,
    color: 'from-rose-500 to-pink-400',
    bg: 'bg-rose-50',
    title: 'Lightning Fast',
    desc: 'Browse thousands of products, add to cart, and checkout in under a minute.',
  },
  {
    icon: Heart,
    color: 'from-teal-500 to-emerald-400',
    bg: 'bg-teal-50',
    title: 'Curated Wishlist',
    desc: 'Save favourites to your wishlist and never lose track of what you love.',
  },
];

const CATEGORIES = [
  { name: 'Vegetables', emoji: '🥦', color: 'from-green-400 to-emerald-500', items: '120+ items' },
  { name: 'Fruits', emoji: '🍎', color: 'from-red-400 to-rose-500', items: '80+ items' },
  { name: 'Dairy & Eggs', emoji: '🥛', color: 'from-yellow-300 to-amber-400', items: '45+ items' },
  { name: 'Bakery', emoji: '🍞', color: 'from-orange-400 to-amber-500', items: '60+ items' },
  { name: 'Grains & Pulses', emoji: '🌾', color: 'from-yellow-500 to-lime-500', items: '90+ items' },
  { name: 'Beverages', emoji: '🧃', color: 'from-cyan-400 to-blue-500', items: '50+ items' },
];

const STEPS = [
  {
    step: '01',
    icon: ShoppingBag,
    title: 'Browse Products',
    desc: 'Explore thousands of fresh items across categories. Search, filter, and find exactly what you need.',
  },
  {
    step: '02',
    icon: Package,
    title: 'Add to Cart',
    desc: 'Add items to your cart or save them to your wishlist. Adjust quantities anytime before checkout.',
  },
  {
    step: '03',
    icon: Truck,
    title: 'Get Delivered',
    desc: 'Choose your saved address, pick COD or online payment, and your order arrives fresh.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Ananya Krishnan',
    role: 'Home Cook, Chennai',
    avatar: '👩‍🍳',
    rating: 5,
    text: 'Sandhai has completely changed how I shop for groceries. The quality is unmatched and delivery is always on time!',
  },
  {
    name: 'Rajesh Menon',
    role: 'Restaurant Owner, Bengaluru',
    avatar: '👨‍🍽️',
    rating: 5,
    text: "Bulk ordering for my restaurant has never been this easy. Great prices, consistent quality, and a smooth checkout.",
  },
  {
    name: 'Priya Sundaram',
    role: 'Working Professional, Coimbatore',
    avatar: '👩‍💼',
    rating: 5,
    text: 'The wishlist feature is so handy — I save things throughout the week and order in one go on Saturdays.',
  },
];

// ──────────────────────────────────────────
// LandingPage Component
// ──────────────────────────────────────────
const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans">
      <LandingNavbar />

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-6">
              <Zap className="w-3.5 h-3.5" />
              Tamil Nadu's #1 Marketplace
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight mb-5">
              Your Local Market,{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Now Online
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-500 font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
              Sandhai is your trusted marketplace arena — fresh produce, household essentials, and more,
              delivered fast to your doorstep. Shop local, live better.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <button
                  onClick={() => navigate('/app')}
                  className="group px-8 py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-xl shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 hover:shadow-emerald-600/40 active:scale-[0.97] transition-all duration-200 flex items-center gap-2 cursor-pointer"
                >
                  Go to Your Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="group px-8 py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-xl shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 hover:shadow-emerald-600/40 active:scale-[0.97] transition-all duration-200 flex items-center gap-2"
                  >
                    Start Shopping Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 rounded-2xl font-bold text-base text-slate-700 border-2 border-slate-200 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Trust micro-text */}
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Free registration</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> No hidden fees</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 10,000+ products</span>
            </div>
          </div>

          {/* Hero Stats Bar */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: 'Happy Customers', value: '50K+', icon: Users },
              { label: 'Products Listed', value: '10K+', icon: ShoppingBag },
              { label: 'Cities Served', value: '25+', icon: Truck },
              { label: 'Daily Orders', value: '2K+', icon: Package },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white rounded-2xl p-4 text-center shadow-md shadow-slate-200/60 border border-slate-100">
                <Icon className="w-5 h-5 text-emerald-500 mx-auto mb-1.5" />
                <div className="text-2xl font-black text-slate-900">{value}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest bg-teal-50 text-teal-600 rounded-full border border-teal-200 mb-3">Why Sandhai</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Everything you need, nothing you don't
            </h2>
            <p className="mt-3 text-slate-500 font-medium max-w-xl mx-auto text-base">
              Built with simplicity and freshness at its core — for Tamil Nadu's everyday shopper.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} className="group p-6 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50/60 transition-all duration-300 bg-white">
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section id="categories" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200 mb-3">Shop by Category</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Fresh from every aisle
            </h2>
            <p className="mt-3 text-slate-500 font-medium max-w-xl mx-auto text-base">
              From farm-fresh veggies to artisan bakery — browse your favourite category and discover great deals.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(({ name, emoji, color, items }) => (
              <Link
                to="/login"
                key={name}
                className="group flex flex-col items-center p-5 rounded-2xl bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-300 text-center"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl shadow-md mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  {emoji}
                </div>
                <span className="text-sm font-bold text-slate-800">{name}</span>
                <span className="text-xs text-slate-400 font-medium mt-0.5">{items}</span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to={user ? '/app' : '/signup'}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-emerald-600 border-2 border-emerald-200 hover:bg-emerald-50 transition-all"
            >
              View all categories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest bg-blue-50 text-blue-600 rounded-full border border-blue-200 mb-3">Simple as 1-2-3</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              From browse to doorstep in minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-emerald-200 via-teal-300 to-emerald-200 transform -translate-y-1/2" />

            {STEPS.map(({ step, icon: Icon, title, desc }, idx) => (
              <div key={step} className="relative text-center flex flex-col items-center">
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 flex flex-col items-center justify-center shadow-xl shadow-emerald-600/25 mb-5">
                  <span className="text-[10px] font-bold text-emerald-100/70 uppercase tracking-widest">{step}</span>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to={user ? '/app' : '/signup'}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 transition-all"
            >
              Get started now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest bg-rose-50 text-rose-500 rounded-full border border-rose-200 mb-3">Customer Stories</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Loved by thousands across Tamil Nadu
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, avatar, rating, text }) => (
              <div key={name} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-5 italic">"{text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-xl">{avatar}</div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{name}</div>
                    <div className="text-xs text-slate-400 font-medium">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA BANNER ── */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="text-4xl mb-4">🛒</div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
            Ready to shop smarter?
          </h2>
          <p className="text-emerald-100 text-lg font-medium mb-8">
            Join 50,000+ happy customers. Fresh products, fast delivery, unbeatable prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <button
                onClick={() => navigate('/app')}
                className="px-8 py-4 rounded-2xl font-bold text-base text-emerald-700 bg-white shadow-lg hover:bg-emerald-50 transition-all cursor-pointer"
              >
                Go to Dashboard →
              </button>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="px-8 py-4 rounded-2xl font-bold text-base text-emerald-700 bg-white shadow-lg hover:bg-emerald-50 transition-all"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 rounded-2xl font-bold text-base text-white border-2 border-white/40 hover:bg-white/10 transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="block text-lg font-black text-white">Sandhai</span>
                  <span className="block text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">Marketplace Arena</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed">
                Your trusted local marketplace — bringing the best of Tamil Nadu's markets online.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-emerald-400 transition-colors">Features</a></li>
                <li><a href="#categories" className="hover:text-emerald-400 transition-colors">Categories</a></li>
                <li><a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How it Works</a></li>
                <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Login</Link></li>
                <li><Link to="/signup" className="hover:text-emerald-400 transition-colors">Sign Up</Link></li>
              </ul>
            </div>

            {/* Contact / Info */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>📧 support@sandhai.in</li>
                <li>📞 +91 98765 43210</li>
                <li>📍 Chennai, Tamil Nadu</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <span>© 2025 Sandhai — A Marketplace Arena. All rights reserved.</span>
            <span className="text-slate-600">Built with ❤️ in Tamil Nadu</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

