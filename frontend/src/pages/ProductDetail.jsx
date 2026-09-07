import { useParams } from 'react-router-dom';
import { MessageCircle, Star, ShieldCheck, Truck } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${slug}`);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-brand-light flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="min-h-screen bg-brand-light flex items-center justify-center text-brand-dark text-xl font-bold">Product not found</div>;
  
  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in ordering: ${product.name} (₹${product.price}). Link: ${window.location.href}`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank');
    // Optionally log click here
    axios.post('/api/whatsapp-click', { productId: product._id }).catch(() => {});
  };

  return (
    <div className="bg-brand-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-1/2">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-3xl bg-white shadow-xl relative group border border-gray-100">
               <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
               {product.isFeatured && (
                 <div className="absolute top-6 left-6 bg-brand-cta/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-white tracking-wide uppercase shadow-lg">
                   Best Seller
                 </div>
               )}
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4">
              {product.images.map((img, i) => (
                <div key={i} className="aspect-w-1 aspect-h-1 rounded-xl bg-white border-2 border-transparent hover:border-brand-cta cursor-pointer overflow-hidden transition-all shadow-sm">
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
               <div className="flex text-brand-cta"><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/></div>
               <span className="text-sm text-gray-500 font-medium">(4.9/5 reviews)</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-text mb-4 leading-tight">{product.name}</h1>
            <p className="text-3xl text-brand-dark font-extrabold mb-6">₹ {product.price}</p>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed font-light">
              {product.description}
            </p>
            
            <div className="space-y-5 mb-10 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
               <div className="flex items-center gap-4 text-gray-700">
                 <ShieldCheck className="w-7 h-7 text-brand-cta" />
                 <span className="font-medium text-lg">Premium Quality Guarantee</span>
               </div>
               <div className="flex items-center gap-4 text-gray-700">
                 <Truck className="w-7 h-7 text-brand-cta" />
                 <span className="font-medium text-lg">Fast & Secure Shipping</span>
               </div>
            </div>

            <button onClick={handleWhatsApp} className="w-full sm:w-auto bg-brand-cta hover:opacity-90 text-white font-bold py-4 px-10 rounded-full shadow-lg transform transition hover:-translate-y-1 flex items-center justify-center gap-3 text-lg border-2 border-transparent">
              <MessageCircle className="w-6 h-6" />
              Order on WhatsApp
            </button>
            <p className="text-sm text-gray-500 mt-5 text-center sm:text-left flex items-center gap-2 justify-center sm:justify-start">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cta opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-cta"></span>
              </span>
              We usually reply within 5 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
