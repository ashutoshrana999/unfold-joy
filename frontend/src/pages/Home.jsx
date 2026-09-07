import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [giftBoxes, setGiftBoxes] = useState([]);
  const [under99, setUnder99] = useState([]);
  const [under199, setUnder199] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, giftBoxRes, under99Res, under199Res] = await Promise.all([
          axios.get('/api/categories'),
          axios.get('/api/products?category=gift-box'),
          axios.get('/api/products?maxPrice=99'),
          axios.get('/api/products?minPrice=100&maxPrice=199')
        ]);

        setCategories(catsRes.data);
        setGiftBoxes(giftBoxRes.data.slice(0, 4));
        setUnder99(under99Res.data.slice(0, 4));
        setUnder199(under199Res.data.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const ProductCard = ({ product }) => (
    <Link to={`/product/${product.slug}`} className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 flex flex-col overflow-hidden h-full">
      <div className="h-48 overflow-hidden bg-gray-50 relative">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-sm md:text-base font-bold text-brand-text mb-1 group-hover:text-brand-cta transition-colors line-clamp-1">{product.name}</h3>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-extrabold text-brand-dark">₹{product.price}</span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-secondary text-brand-text relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-brand-dark">
            Curated Gifts for Every <span className="text-brand-cta">Special Moment</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-text mb-10 max-w-2xl mx-auto font-light">
            Discover our premium collection of handcrafted jewelry, elegant gift boxes, and cuddly bears.
          </p>
          <a href="#categories" className="inline-block px-8 py-4 bg-brand-cta text-white rounded font-bold text-lg hover:opacity-90 transition-colors shadow-lg">
            Start Exploring
          </a>
        </div>
      </section>

      {/* Shop By Category */}
      <section id="categories" className="bg-brand-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-brand-dark mb-8 text-center md:text-left border-b-2 border-brand-cta inline-block pb-1">Shop by Category</h2>
          <div className="flex overflow-x-auto gap-6 pb-6 snap-x" style={{ scrollbarWidth: 'none' }}>
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col items-center min-w-[100px] sm:min-w-[120px]">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-200 animate-pulse rounded-full mb-3"></div>
                  <div className="h-4 bg-gray-200 animate-pulse w-16 rounded"></div>
                </div>
              ))
            ) : (
              categories.map(cat => (
                <Link to={`/category/${cat.slug}`} key={cat._id} className="flex flex-col items-center min-w-[100px] sm:min-w-[120px] snap-start group">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-brand-cta transition-all shadow-sm">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <h3 className="text-sm font-bold text-brand-text text-center group-hover:text-brand-cta transition-colors">{cat.name}</h3>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Gift Box Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-brand-dark border-b-2 border-brand-cta inline-block pb-1">Perfect Gift Boxes</h2>
            <Link to="/category/gift-box" className="text-brand-cta hover:text-brand-dark font-medium text-sm">View All &rarr;</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {loading ? [...Array(4)].map((_, i) => <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-2xl"></div>) : giftBoxes.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Under 99 Section */}
      <section className="bg-brand-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-brand-dark border-b-2 border-brand-cta inline-block pb-1">Steals Under ₹99</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {loading ? [...Array(4)].map((_, i) => <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-2xl"></div>) : under99.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Under 199 Section */}
      <section className="bg-brand-light py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-brand-dark border-b-2 border-brand-cta inline-block pb-1">Finds Under ₹199</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {loading ? [...Array(4)].map((_, i) => <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-2xl"></div>) : under199.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
