import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, ArrowLeft, MessageCircle, ShoppingBag, Clock, Heart } from 'lucide-react';

const CategoryListing = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes, allCatsRes] = await Promise.all([
          axios.get(`/api/categories/${slug}`).catch(() => ({ data: null })),
          axios.get(`/api/products?category=${slug}`).catch(() => ({ data: [] })),
          axios.get('/api/categories').catch(() => ({ data: [] }))
        ]);

        setCategory(catRes.data);
        setProducts(prodRes.data || []);
        setAllCategories(allCatsRes.data || []);
      } catch (error) {
        console.error('Failed to fetch category data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const categoryName = category?.name || slug?.replace(/-/g, ' ');

  useEffect(() => {
    if (categoryName) {
      document.title = `${categoryName} Collection | UnfoldJoy Patna - Curated Gifts`;
    }
  }, [categoryName]);

  const handleWhatsAppInquiry = () => {
    const whatsappNum = import.meta.env.VITE_WHATSAPP_NUMBER || '919693867664';
    const message = `Hi UnfoldJoy! I noticed the ${categoryName} collection is coming soon. Please let me know when it launches or if you have custom pieces available!`;
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="bg-brand-light min-h-screen">
      {/* Category Header Banner */}
      <div className="relative bg-gradient-to-b from-brand-secondary/40 via-brand-light to-brand-light pt-10 pb-12 overflow-hidden border-b border-brand-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-dark/70 hover:text-brand-cta mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex items-center gap-5 text-center md:text-left">
              {category?.image && (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-md border-2 border-white flex-shrink-0">
                  <img
                    src={category.image}
                    alt={categoryName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-cta/10 text-brand-cta mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Category Showcase
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-dark capitalize tracking-tight">
                  {categoryName}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1 max-w-xl">
                  Handcrafted delights, thoughtful gifting, and timeless joy crafted especially for you.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/shop"
                className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-brand-dark font-semibold text-sm hover:border-brand-cta hover:text-brand-cta transition-colors shadow-sm inline-flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Browse All Items
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          /* Loading Skeleton */
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-80"
              >
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          /* High-End COMING SOON PAGE */
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-white rounded-3xl shadow-xl border border-brand-secondary/40 p-8 sm:p-14 text-center overflow-hidden">
              {/* Decorative subtle background accents */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-secondary/30 rounded-full blur-3xl pointer-events-none -translate-y-12 translate-x-12"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-light rounded-full blur-2xl pointer-events-none translate-y-12 -translate-x-12"></div>

              {/* Glowing Icon Badge */}
              <div className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-brand-cta to-brand-dark text-white shadow-lg shadow-brand-cta/30 mb-6 transform hover:scale-105 transition-transform duration-300">
                <Clock className="w-10 h-10 sm:w-12 sm:h-12 animate-pulse" />
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-cta"></span>
                </span>
              </div>

              {/* Badge */}
              <div className="inline-block px-4 py-1.5 bg-brand-secondary/30 text-brand-dark rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest mb-4">
                ✨ Launching Very Soon ✨
              </div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark mb-4 tracking-tight">
                Curating Joy for <span className="text-brand-cta capitalize">{categoryName}</span>
              </h2>

              {/* Description */}
              <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto mb-8 leading-relaxed font-light">
                We are currently handcrafting and assembling our brand-new {categoryName} collection!
                Every piece is selected to bring smiles and celebrate special memories.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <button
                  onClick={handleWhatsAppInquiry}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-brand-cta text-white font-bold rounded-2xl shadow-lg hover:opacity-95 transform hover:-translate-y-0.5 transition-all text-base"
                >
                  <MessageCircle className="w-5 h-5" />
                  Notify Me on WhatsApp
                </button>
                <Link
                  to="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-light text-brand-dark font-bold rounded-2xl border border-brand-secondary hover:bg-brand-secondary/40 transition-all text-base"
                >
                  <ShoppingBag className="w-5 h-5 text-brand-cta" />
                  Explore Shop
                </Link>
              </div>

              <div className="pt-8 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-500">
                <Heart className="w-4 h-4 text-brand-cta fill-current" />
                Handcrafted with love by the UnfoldJoy team
              </div>
            </div>

            {/* Other Categories to Browse */}
            {allCategories.length > 1 && (
              <div className="mt-16">
                <div className="text-center mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-brand-dark">
                    Explore Other Categories
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Discover our other delightful collections while this one prepares to unfold
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {allCategories
                    .filter((c) => c.slug !== slug)
                    .slice(0, 4)
                    .map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/category/${cat.slug}`}
                        className="group bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-cta transition-all text-center flex flex-col items-center"
                      >
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border border-gray-100 group-hover:scale-105 transition-transform">
                          <img
                            src={cat.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400'}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-sm font-bold text-brand-dark group-hover:text-brand-cta transition-colors">
                          {cat.name}
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Products Grid (When items are added by admin) */
          <div>
            <div className="flex justify-between items-center mb-8">
              <p className="text-sm text-gray-500 font-medium">
                Showing <span className="font-bold text-brand-dark">{products.length}</span> {products.length === 1 ? 'item' : 'items'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {products.map((product) => (
                <Link
                  to={`/product/${product.slug}`}
                  key={product._id}
                  className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden h-full"
                >
                  <div className="h-48 sm:h-56 overflow-hidden bg-gray-50 relative">
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {product.isFeatured && (
                      <span className="absolute top-3 left-3 bg-brand-cta text-white text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-brand-text mb-1 group-hover:text-brand-cta transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </div>
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-50">
                      <span className="text-lg sm:text-xl font-extrabold text-brand-dark">
                        ₹{product.price}
                      </span>
                      <span className="text-xs text-brand-cta font-semibold group-hover:underline">
                        View Details &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryListing;
