import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryListing = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/products?category=${slug}`);
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch category products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [slug]);
  
  return (
    <div className="bg-brand-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark capitalize mb-4 border-b-2 border-brand-cta inline-block pb-2">{slug?.replace('-', ' ')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">Explore our exclusive collection of premium {slug?.replace('-', ' ')}. Perfect for gifting and bringing joy.</p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-80">
                <div className="w-full h-48 bg-gray-100 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-100 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map(product => (
              <Link to={`/product/${product.slug}`} key={product._id} className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden h-full">
                <div className="h-48 overflow-hidden bg-gray-50 relative">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-brand-text mb-1 group-hover:text-brand-cta transition-colors line-clamp-2">{product.name}</h3>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-extrabold text-brand-dark">₹{product.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryListing;
