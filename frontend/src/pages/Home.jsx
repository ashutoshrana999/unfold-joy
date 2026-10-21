import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, ArrowRight, ShoppingBag, Heart, ShieldCheck, Truck, Clock } from 'lucide-react';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [under99, setUnder99] = useState([]);
  const [under199, setUnder199] = useState([]);
  const [settings, setSettings] = useState({ showUnder99: false, showUnder199: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories, latest products (max 10), and settings
        const [catsRes, latestRes, settingsRes] = await Promise.all([
          axios.get('/api/categories').catch(() => ({ data: [] })),
          axios.get('/api/products?limit=10&sort=newest').catch(() => ({ data: [] })),
          axios.get('/api/settings').catch(() => ({ data: { showUnder99: false, showUnder199: false } }))
        ]);

        setCategories(catsRes.data || []);
        setLatestProducts(latestRes.data || []);
        
        const currentSettings = settingsRes.data || { showUnder99: false, showUnder199: false };
        setSettings(currentSettings);

        // Only fetch under 99 / under 199 if enabled by admin
        const promises = [];
        if (currentSettings.showUnder99) {
          promises.push(axios.get('/api/products?maxPrice=99').then(res => setUnder99(res.data.slice(0, 8))).catch(() => {}));
        }
        if (currentSettings.showUnder199) {
          promises.push(axios.get('/api/products?minPrice=100&maxPrice=199').then(res => setUnder199(res.data.slice(0, 8))).catch(() => {}));
        }
        await Promise.all(promises);
      } catch (error) {
        console.error('Failed to fetch home page data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const ProductCard = ({ product }) => (
    <Link
      to={`/product/${product.slug}`}
      className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden h-full"
    >
      <div className="h-48 sm:h-52 overflow-hidden bg-gray-50 relative">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.isFeatured && (
          <span className="absolute top-3 left-3 bg-brand-cta text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow">
            Featured
          </span>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          {product.category?.name && (
            <span className="text-[11px] font-semibold text-brand-cta uppercase tracking-wider block mb-1">
              {product.category.name}
            </span>
          )}
          <h3 className="text-sm font-bold text-brand-text mb-1 group-hover:text-brand-cta transition-colors line-clamp-2">
            {product.name}
          </h3>
        </div>
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-50">
          <span className="text-lg font-extrabold text-brand-dark">₹{product.price}</span>
          <span className="text-xs text-brand-cta font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            View &rarr;
          </span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen">
      {/* 1. Hero Section */}
      <section 
        className="relative overflow-hidden py-16 md:py-24 border-b border-brand-secondary/30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/hero-bg.png')` }}
      >
        {/* Soft elegant backdrop overlay for high legibility while letting the beautiful background shine */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7F2FF]/60 via-transparent to-[#F7F2FF]/80 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Brand Logo in Hero */}
          <div className="flex justify-center mb-5">
            <img 
              src="/logo.png" 
              alt="Unfold Joy" 
              className="h-16 sm:h-20 md:h-24 w-auto object-contain drop-shadow-sm transition-transform hover:scale-105"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-brand-secondary/50 text-brand-dark text-xs sm:text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-brand-cta" />
            <span>Unfold Moments of Pure Joy</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-6 tracking-tight text-brand-dark max-w-4xl mx-auto leading-tight drop-shadow-sm">
            Curated Gifts for Every <span className="text-brand-cta">Special Moment</span>
          </h1>

          <p className="text-base sm:text-xl text-gray-700 mb-10 max-w-2xl mx-auto font-normal leading-relaxed bg-white/60 backdrop-blur-[2px] rounded-2xl py-2 px-4 border border-white/50">
            Discover our handcrafted collections of jewelry, keepsakes, and heartwarming gifts
            tailored to bring a bright smile to your loved ones.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-cta text-white rounded-2xl font-bold text-lg hover:opacity-95 transition-all shadow-lg shadow-brand-cta/25 hover:shadow-xl hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-5 h-5" />
              Explore All Items
            </Link>
            <a
              href="#categories"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/90 backdrop-blur-md text-brand-dark rounded-2xl font-bold text-lg hover:bg-white border border-gray-200 transition-all shadow-sm"
            >
              Shop by Category
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* Quick value props */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-16 max-w-3xl mx-auto pt-8 border-t border-brand-secondary/50 text-left">
            <div className="flex items-center gap-3 bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-white/70 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-brand-cta/10 shadow-sm flex items-center justify-center text-brand-cta flex-shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-brand-dark">Handpicked with Love</h4>
                <p className="text-[11px] sm:text-xs text-gray-600">Every item carefully chosen</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-white/70 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-brand-cta/10 shadow-sm flex items-center justify-center text-brand-cta flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-brand-dark">Assured Quality</h4>
                <p className="text-[11px] sm:text-xs text-gray-600">Premium finishing always</p>
              </div>
            </div>
            <div className="flex items-center gap-3 col-span-2 md:col-span-1 bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-white/70 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-brand-cta/10 shadow-sm flex items-center justify-center text-brand-cta flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-brand-dark">Swift Delivery</h4>
                <p className="text-[11px] sm:text-xs text-gray-600">Fast dispatch & easy tracking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop By Category Section */}
      <section id="categories" className="bg-brand-light py-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-cta block mb-1">
                Browse Collections
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
                Shop by Category
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-sm font-bold text-brand-cta hover:text-brand-dark flex items-center gap-1.5 transition-colors"
            >
              View All Categories in Shop <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div
            className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 pt-2 snap-x"
            style={{ scrollbarWidth: 'none' }}
          >
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col items-center min-w-[105px] sm:min-w-[130px]">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-200 animate-pulse rounded-full mb-3"></div>
                  <div className="h-4 bg-gray-200 animate-pulse w-16 rounded"></div>
                </div>
              ))
            ) : categories.length === 0 ? (
              <div className="w-full text-center py-8 text-gray-500">
                No categories available. Add categories from Admin Panel.
              </div>
            ) : (
              categories.map((cat) => (
                <Link
                  to={`/category/${cat.slug}`}
                  key={cat._id}
                  className="flex flex-col items-center min-w-[105px] sm:min-w-[130px] snap-start group"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 border-2 border-white group-hover:border-brand-cta transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:scale-105 relative bg-white">
                    <img
                      src={cat.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400'}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-brand-text text-center group-hover:text-brand-cta transition-colors">
                    {cat.name}
                  </h3>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 3. Latest Section (Shows latest listed items, max 10) */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-cta block mb-1">
                Fresh Off The Bench
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
                Latest Arrivals
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-sm font-bold text-brand-cta hover:text-brand-dark flex items-center gap-1.5 transition-colors"
            >
              Browse All in Shop <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : latestProducts.length === 0 ? (
            /* Friendly Coming Soon State for Latest Arrivals */
            <div className="bg-brand-light rounded-3xl p-8 sm:p-12 text-center border border-brand-secondary/40 max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-brand-cta/10 text-brand-cta flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-brand-dark mb-2">
                New Arrivals Dropping Soon!
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 font-light">
                Our latest collection of gifts and jewelry is being handcrafted. Check back shortly
                or explore our categories to see what is coming next!
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-cta text-white font-bold rounded-xl text-sm shadow hover:opacity-90 transition-opacity"
              >
                <ShoppingBag className="w-4 h-4" />
                Go to Shop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {latestProducts.slice(0, 10).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Optional Section: Under ₹99 (Shown ONLY when enabled by Admin) */}
      {settings.showUnder99 && (
        <section className="bg-brand-secondary/20 py-16 border-t border-brand-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-cta block mb-1">
                  Budget Delights
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
                  Steals Under ₹99
                </h2>
              </div>
              <Link
                to="/shop?maxPrice=99"
                className="text-sm font-bold text-brand-cta hover:text-brand-dark flex items-center gap-1.5 transition-colors"
              >
                View All &rarr;
              </Link>
            </div>

            {under99.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center text-gray-500">
                Products under ₹99 will appear here once added through the admin panel.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {under99.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. Optional Section: Under ₹199 (Shown ONLY when enabled by Admin) */}
      {settings.showUnder199 && (
        <section className="bg-brand-light py-16 border-t border-brand-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-cta block mb-1">
                  Value Picks
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
                  Finds Under ₹199
                </h2>
              </div>
              <Link
                to="/shop?minPrice=100&maxPrice=199"
                className="text-sm font-bold text-brand-cta hover:text-brand-dark flex items-center gap-1.5 transition-colors"
              >
                View All &rarr;
              </Link>
            </div>

            {under199.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center text-gray-500">
                Products under ₹199 will appear here once added through the admin panel.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {under199.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 6. WhatsApp Order & Assistance Banner */}
      <section className="bg-gradient-to-r from-brand-dark via-[#6F4794] to-brand-dark py-14 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/10 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-white/20">
            <div className="space-y-3 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <img src="/logo-white.png" alt="Unfold Joy" className="h-9 w-auto object-contain" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Looking for Custom Gifting or Quick Orders?
              </h2>
              <p className="text-brand-secondary text-sm sm:text-base max-w-xl">
                Chat with us directly on WhatsApp for personalized recommendations, custom gift hampers, or instant order assistance.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs sm:text-sm text-brand-secondary pt-1">
                <span>📱 <strong>WhatsApp:</strong> +91 96938 67664</span>
                <span>✉️ <strong>Email:</strong> unfoldjoy.29@gmail.com</span>
              </div>
            </div>

            <div className="flex-shrink-0">
              <a
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '919693867664'}?text=${encodeURIComponent("Hi UnfoldJoy! I want to place an order.")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>💬 Order on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
