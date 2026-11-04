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
  Clock,
  Sparkles,
  Award,
  BadgePercent,
  Check,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Leaf,
    badge: '100% Farm Fresh',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    iconColor: 'text-emerald-600 bg-emerald-50',
    title: 'Farm-to-Door Produce',
    description:
      'Directly procured from local Tamil Nadu farmers within 24 hours of harvest. No prolonged cold storage, no chemical ripening.',
  },
  {
    icon: Truck,
    badge: 'Free Shipping',
    badgeColor: 'bg-blue-100 text-blue-800',
    iconColor: 'text-blue-600 bg-blue-50',
    title: 'Free Delivery on ₹500+',
    description:
      'Enjoy free doorstep delivery on all orders above ₹500. Flat nominal fee of ₹40 for smaller orders with no hidden surcharges.',
  },
  {
    icon: BadgePercent,
    badge: 'Save 10% Extra',
    badgeColor: 'bg-amber-100 text-amber-800',
    iconColor: 'text-amber-600 bg-amber-50',
    title: 'Coupon Discounts & Savings',
    description:
      'Use promo code SAVE10 at checkout to unlock an instant 10% discount on your entire cart across all grocery and fresh item categories.',
  },
  {
    icon: ShieldCheck,
    badge: 'Quality Checked',
    badgeColor: 'bg-purple-100 text-purple-800',
    iconColor: 'text-purple-600 bg-purple-50',
    title: 'Rigorous Quality Checks',
    description:
      'Every fruit, vegetable, and staple is physically inspected and weighed for grade-A freshness, packaging hygiene, and net weight.',
  },
  {
    icon: Clock,
    badge: 'Express Service',
    badgeColor: 'bg-rose-100 text-rose-800',
    iconColor: 'text-rose-600 bg-rose-50',
    title: 'Rapid Order Fulfillment',
    description:
      'Orders are packed in eco-friendly packaging and dispatched promptly, ensuring delicate greens and fruits reach you intact.',
  },
  {
    icon: Award,
    badge: 'Trusted Arena',
    badgeColor: 'bg-teal-100 text-teal-800',
    iconColor: 'text-teal-600 bg-teal-50',
    title: 'Flexible Payment Modes',
    description:
      'Full flexibility with Cash on Delivery (COD), UPI (GPay, PhonePe, Paytm), NetBanking, and credit/debit cards.',
  },
];

const CATEGORIES = [
  {
    title: 'Fresh Farm Fruits',
    subtitle: 'Apples, Bananas, Oranges, Pomegranates',
    tag: 'Seasonal & Crisp',
    image:
      'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Organic Vegetables',
    subtitle: 'Greens, Native Root Veggies & Daily Staples',
    tag: 'Harvested Daily',
    image:
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Pure Dairy Products',
    subtitle: 'Farm Milk, Artisan Butter, Paneer & Curd',
    tag: 'Rich & Natural',
    image:
      'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Grocery & Grain Staples',
    subtitle: 'Aged Basmati, Cold-Pressed Oils, Pulses',
    tag: 'Unpolished Grains',
    image:
      'https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=700&q=80',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Explore & Fill Your Bag',
    desc: 'Browse hundreds of farm-fresh fruits, organic greens, staples, and dairy at honest local prices.',
  },
  {
    step: '02',
    title: 'Apply Code & Select Address',
    desc: 'Apply promo SAVE10 for 10% off, choose or add your saved delivery address, and pick COD or online pay.',
  },
  {
    step: '03',
    title: 'Instant Dispatch to Doorstep',
    desc: 'Track your order with live status updates as our delivery partners bring fresh produce straight to you.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Kavitha Ramachandran',
    location: 'Chennai, Tamil Nadu',
    rating: 5,
    quote:
      'The freshness of tomatoes and greens from Sandhai is far superior to supermarket apps. The SAVE10 coupon worked smoothly and delivery was right on time.',
  },
  {
    name: 'Vignesh Balaji',
    location: 'Coimbatore, Tamil Nadu',
    rating: 5,
    quote:
      'I love the transparent pricing and free delivery above ₹500. Cash on delivery option gives full peace of mind. Truly feels like a local sandhai brought online!',
  },
  {
    name: 'Deepa Natarajan',
    location: 'Madurai, Tamil Nadu',
    rating: 5,
    quote:
      'Clean interface, quick cart updates, and high quality dairy and fruits. It has become our household go-to for weekly grocery orders.',
  },
];

const LandingPage = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handlePrimaryCTA = () => {
    if (user) {
      navigate(isAdmin ? '/app/admin' : '/app/shop');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-100 selection:text-emerald-900 transition-colors duration-200">
      {/* Sticky Clean Navbar */}
      <LandingNavbar />

      {/* ── 1. HERO SECTION ── */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden bg-gradient-to-b from-emerald-50/70 via-teal-50/30 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 transition-colors">
        {/* Soft background glow accents */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-emerald-200/40 via-teal-200/30 to-emerald-100/40 dark:from-emerald-500/10 dark:via-teal-500/10 dark:to-emerald-500/5 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Tamil Nadu's Farm-Fresh Marketplace Arena</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.12] tracking-tight">
                Fresh Groceries & Farm Harvest,{' '}
                <span className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500 dark:from-emerald-400 dark:via-emerald-300 dark:to-teal-300 bg-clip-text text-transparent">
                  Direct to Your Door
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Sandhai brings the authentic pulse of local morning markets directly to your home. Enjoy
                handpicked fruits, crisp seasonal vegetables, pure dairy, and pantry staples with free delivery on orders above ₹500.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={handlePrimaryCTA}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl shadow-emerald-600/25 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{user ? (isAdmin ? 'Go to Admin Console' : 'Enter Shop Catalog') : 'Start Shopping Free'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {!user && (
                  <Link
                    to="/login"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-slate-800 shadow-xs transition-all duration-150 text-center"
                  >
                    Customer / Admin Login
                  </Link>
                )}
              </div>

              {/* Micro Trust Points */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Free shipping on ₹500+</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Save 10% with code SAVE10</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Cash on Delivery & UPI</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Mockup / Visual Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl shadow-emerald-950/10 dark:shadow-slate-950/60 border border-slate-200/90 dark:border-slate-800 space-y-4 transition-colors">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                      S
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">Sandhai Fresh Express</div>
                      <div className="text-[10px] text-slate-400 font-medium">Morning Harvest • Live Stock</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                    Farm Direct
                  </span>
                </div>

                {/* Featured Products Snapshot */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                    <img
                      src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=120&q=80"
                      alt="Shimla Apples"
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs text-slate-900 dark:text-white truncate">Shimla Fresh Royal Apples</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">₹180 / kg</div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      In Stock
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                    <img
                      src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=120&q=80"
                      alt="Organic Farm Spinach"
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs text-slate-900 dark:text-white truncate">Organic Native Spinach</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">₹35 / bunch</div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      Harvested Today
                    </span>
                  </div>
                </div>

                {/* Promotional Banner */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">Special Promo</div>
                    <div className="text-xs font-black">Use code SAVE10 for 10% OFF</div>
                  </div>
                  <span className="px-2.5 py-1 bg-white text-emerald-800 font-black text-xs rounded-xl shadow-xs">
                    SAVE10
                  </span>
                </div>

                {/* Floating Rating Badge */}
                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>4.9 / 5.0</span>
                    <span className="text-slate-400 font-normal">(1,840+ local reviews)</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600">✓ Verified Arena</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. POPULAR CATEGORIES ── */}
      <section className="py-16 sm:py-20 bg-slate-50/70 dark:bg-slate-900/50 border-y border-slate-200/60 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Market Aisle</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                Explore Essential Categories
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                Fresh natural produce, morning dairy staples, and premium kitchen essentials sourced daily.
              </p>
            </div>
            <button
              onClick={handlePrimaryCTA}
              className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIES.map((cat, idx) => (
              <div
                key={idx}
                onClick={handlePrimaryCTA}
                className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="h-44 sm:h-48 overflow-hidden relative">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-xs text-[10px] font-black text-slate-900 dark:text-white shadow-xs">
                      {cat.tag}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{cat.subtitle}</p>
                  </div>
                  <div className="pt-3 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400 border-t border-slate-100 dark:border-slate-800">
                    <span>Shop Fresh</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. VALUE PROPOSITIONS (WHY CHOOSE SANDHAI) ── */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">The Sandhai Advantage</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Why Thousands Trust Our Marketplace Arena
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              We blend traditional street market freshness with modern e-commerce reliability, fair pricing, and doorstep convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 shadow-xs hover:shadow-lg transition-all duration-300 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${feat.iconColor} dark:bg-slate-800`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${feat.badgeColor} dark:bg-slate-800 dark:text-emerald-300`}>
                      {feat.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{feat.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ── */}
      <section className="py-16 sm:py-20 bg-slate-50/80 dark:bg-slate-900/50 border-t border-slate-200/60 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Simple Process</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              How Ordering Works on Sandhai
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Fresh produce from morning stalls to your kitchen in three painless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs relative space-y-3"
              >
                <span className="font-mono font-black text-3xl text-emerald-600/25 dark:text-emerald-400/25 block">
                  {step.step}
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. CUSTOMER TESTIMONIALS ── */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Verified Reviews</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Loved by Families Across the Region
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="bg-slate-50/80 dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/70 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">"{t.quote}"</p>
                </div>
                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800">
                  <div className="font-bold text-xs text-slate-900 dark:text-white">{t.name}</div>
                  <div className="text-[11px] text-slate-400">{t.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. BOTTOM CALL TO ACTION BANNER ── */}
      <section className="py-12 sm:py-16 bg-gradient-to-tr from-emerald-800 via-emerald-700 to-teal-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-600/50 border border-emerald-400/40 text-emerald-200 text-xs font-black uppercase tracking-widest">
            Join 10,000+ Smart Shoppers
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Ready to taste genuine morning market freshness?
          </h2>
          <p className="text-sm sm:text-base text-emerald-100/90 max-w-xl mx-auto leading-relaxed">
            Create your account in seconds, apply coupon SAVE10, and receive crisp fresh produce delivered directly to your doorstep.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={handlePrimaryCTA}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm bg-white text-emerald-800 hover:bg-emerald-50 shadow-xl shadow-emerald-950/20 active:scale-95 transition-all cursor-pointer"
            >
              {user ? (isAdmin ? 'Go to Admin Console' : 'Shop the Catalog') : 'Get Started Free'}
            </button>
            {!user && (
              <Link
                to="/login"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-sm bg-emerald-900/60 hover:bg-emerald-900/80 text-white border border-emerald-500/40 transition-all text-center"
              >
                Sign In to Account
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── 7. FOOTER ── */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-black text-sm">
              S
            </div>
            <div>
              <span className="font-black text-slate-100 text-sm tracking-tight block">Sandhai</span>
              <span className="text-[10px] text-slate-500">A Marketplace Arena</span>
            </div>
          </div>

          <div className="text-center sm:text-right space-y-1">
            <p className="text-slate-400">
              © {new Date().getFullYear()} Sandhai Marketplace Arena. All rights reserved.
            </p>
            <p className="text-[11px] text-slate-600">
              Designed with farm-fresh standards • JWT Authentication • Role-Based Security
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
