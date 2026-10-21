import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  Search,
  Sparkles,
  LayoutGrid,
  Layers,
  ArrowUpDown,
  ShoppingBag,
  MessageCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';
  const initialMinPrice = searchParams.get('minPrice') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('mixed'); // 'mixed' | 'by-category'

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        let url = '/api/products';
        const params = new URLSearchParams();
        if (initialMaxPrice) params.append('maxPrice', initialMaxPrice);
        if (initialMinPrice) params.append('minPrice', initialMinPrice);
        if (sortBy) params.append('sort', sortBy);

        const [prodRes, catRes] = await Promise.all([
          axios.get(`${url}?${params.toString()}`).catch(() => ({ data: [] })),
          axios.get('/api/categories').catch(() => ({ data: [] }))
        ]);

        setProducts(prodRes.data || []);
        setCategories(catRes.data || []);
      } catch (error) {
        console.error('Failed to fetch shop data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [sortBy, initialMaxPrice, initialMinPrice]);

  // Sync state if url changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Handle Category Pill Click
  const handleCategorySelect = (catSlug) => {
    setSelectedCategory(catSlug);
    if (catSlug) {
      setSearchParams({ category: catSlug });
    } else {
      setSearchParams({});
    }
  };

  // Filter products for "mixed" view
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !selectedCategory ||
      (p.category && (p.category.slug === selectedCategory || p.category._id === selectedCategory));

    return matchesSearch && matchesCategory;
  });

  const handleWhatsAppQuickOrder = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const whatsappNum = import.meta.env.VITE_WHATSAPP_NUMBER || '919693867664';
    const message = `Hi UnfoldJoy! I want to order "${product.name}" priced at ₹${product.price}. Could you please share the order details?`;
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const ProductCard = ({ product }) => (
    <Link
      to={`/product/${product.slug}`}
      key={product._id}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden h-full"
    >
      <div className="h-48 sm:h-56 overflow-hidden bg-gray-50 relative">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.isFeatured && (
          <span className="absolute top-3 left-3 bg-brand-cta text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow">
            Best Seller
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between">
        <div>
          {product.category?.name && (
            <span className="text-[11px] font-bold text-brand-cta uppercase tracking-wider block mb-1">
              {product.category.name}
            </span>
          )}
          <h3 className="text-sm sm:text-base font-bold text-brand-text mb-2 group-hover:text-brand-cta transition-colors line-clamp-2">
            {product.name}
          </h3>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between gap-2">
          <div>
            <span className="text-lg sm:text-xl font-extrabold text-brand-dark">
              ₹{product.price}
            </span>
          </div>

          <button
            onClick={(e) => handleWhatsAppQuickOrder(e, product)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-brand-light text-brand-cta hover:bg-brand-cta hover:text-white transition-all text-xs font-bold inline-flex items-center gap-1.5 border border-brand-secondary/50 shadow-sm"
            title="Order quickly on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Order</span>
          </button>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="bg-brand-light min-h-screen">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-brand-secondary/40 via-brand-light to-brand-light pt-10 pb-8 border-b border-brand-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-cta/10 text-brand-cta mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Store Catalog
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
                Shop All Collections
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Browse every item mixed or explore items organized by category.
              </p>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-white p-1 rounded-2xl border border-gray-200 shadow-sm">
              <button
                onClick={() => setViewMode('mixed')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  viewMode === 'mixed'
                    ? 'bg-brand-cta text-white shadow-sm'
                    : 'text-gray-600 hover:text-brand-dark'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                All Items (Mixed)
              </button>
              <button
                onClick={() => setViewMode('by-category')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  viewMode === 'by-category'
                    ? 'bg-brand-cta text-white shadow-sm'
                    : 'text-gray-600 hover:text-brand-dark'
                }`}
              >
                <Layers className="w-4 h-4" />
                By Categories
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Sort Controls (Always available in Mixed mode) */}
        {viewMode === 'mixed' && (
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-grow max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by title or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-cta/30 focus:border-brand-cta transition-all"
              />
            </div>

            {/* Price Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-cta/30"
              >
                <option value="newest">Latest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        )}

        {/* Category Filter Pills (In Mixed View) */}
        {viewMode === 'mixed' && categories.length > 0 && (
          <div className="flex overflow-x-auto gap-2 pb-4 mb-6" style={{ scrollbarWidth: 'none' }}>
            <button
              onClick={() => handleCategorySelect('')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                !selectedCategory
                  ? 'bg-brand-dark text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Items (Mixed)
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-brand-dark text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* VIEW MODE 1: ALL ITEMS MIXED */}
        {viewMode === 'mixed' && (
          <div>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-72 bg-gray-200 animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              /* Empty / Coming Soon Catalog State */
              <div className="bg-white rounded-3xl p-10 sm:p-16 text-center border border-brand-secondary/40 max-w-2xl mx-auto shadow-sm my-8">
                <div className="w-20 h-20 rounded-3xl bg-brand-secondary/30 text-brand-cta flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-10 h-10 animate-pulse" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-dark mb-3">
                  {selectedCategory
                    ? 'Collection Launching Soon'
                    : 'Fresh Catalog Coming Soon'}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto mb-8 font-light leading-relaxed">
                  {selectedCategory
                    ? `No listings found for this category yet. Products will be added shortly through the admin panel!`
                    : `We are currently curating and uploading new handcrafted pieces. Please check back shortly or explore by category!`}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setSearchTerm('');
                    }}
                    className="px-6 py-3 bg-brand-light text-brand-dark font-bold rounded-xl text-sm border border-brand-secondary hover:bg-brand-secondary/40 transition-colors"
                  >
                    Clear Filters
                  </button>
                  <a
                    href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '919693867664'}?text=${encodeURIComponent("Hi UnfoldJoy! I'm looking for special gift items. Could you share your latest catalog?")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 bg-brand-cta text-white font-bold rounded-xl text-sm shadow hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Inquire on WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    Showing <span className="font-bold text-brand-dark">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW MODE 2: BY CATEGORIES AS PER CATEGORIES */}
        {viewMode === 'by-category' && (
          <div className="space-y-12">
            {/* Category Quick Jump Bar */}
            <div className="flex overflow-x-auto gap-2 pb-2" style={{ scrollbarWidth: 'none' }}>
              {categories.map((cat) => (
                <a
                  key={cat._id}
                  href={`#category-section-${cat.slug}`}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-brand-dark hover:bg-brand-light border border-gray-200 shadow-sm whitespace-nowrap transition-colors"
                >
                  {cat.name}
                </a>
              ))}
            </div>

            {loading ? (
              <div className="space-y-8">
                {[1, 2].map((i) => (
                  <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-white rounded-2xl p-8">
                No categories found. Please add categories via Admin Panel.
              </div>
            ) : (
              categories.map((cat) => {
                // Find products for this category
                const catProducts = products.filter(
                  (p) => p.category && (p.category._id === cat._id || p.category.slug === cat.slug)
                );

                return (
                  <section
                    key={cat._id}
                    id={`category-section-${cat.slug}`}
                    className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm scroll-mt-24"
                  >
                    {/* Category Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-100 mb-6 gap-4">
                      <div className="flex items-center gap-4">
                        {cat.image && (
                          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex-shrink-0">
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <h2 className="text-xl sm:text-2xl font-extrabold text-brand-dark">
                            {cat.name}
                          </h2>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {catProducts.length > 0
                              ? `${catProducts.length} items available in this category`
                              : 'Curated collection launching soon'}
                          </p>
                        </div>
                      </div>

                      <Link
                        to={`/category/${cat.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-cta hover:text-brand-dark transition-colors"
                      >
                        View Category Page <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                    {/* Products in this category OR Category Coming Soon Box */}
                    {catProducts.length === 0 ? (
                      <div className="bg-brand-light rounded-2xl p-6 sm:p-8 text-center border border-brand-secondary/30">
                        <Clock className="w-8 h-8 text-brand-cta mx-auto mb-2 animate-pulse" />
                        <h4 className="text-base font-bold text-brand-dark mb-1">
                          Coming Soon
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-4">
                          We are assembling new items for {cat.name}. Open the category page to get notified on launch!
                        </p>
                        <Link
                          to={`/category/${cat.slug}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-cta text-white font-bold rounded-xl text-xs shadow hover:opacity-90"
                        >
                          Open {cat.name} Page
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                        {catProducts.map((p) => (
                          <ProductCard key={p._id} product={p} />
                        ))}
                      </div>
                    )}
                  </section>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
