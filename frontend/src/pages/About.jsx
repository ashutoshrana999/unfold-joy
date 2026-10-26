import { useEffect } from 'react';
import { MapPin, Truck, Sparkles, Heart, Gift, MessageCircle } from 'lucide-react';
import InstagramIcon from '../components/InstagramIcon';

const About = () => {
  useEffect(() => {
    document.title = 'About Us | UnfoldJoy Patna - Curated Gifts, Jewelry & Accessories';
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-cta bg-brand-secondary/30 px-3 py-1 rounded-full">
          Our Story & Passion
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-dark mt-3 tracking-tight">
          Spreading Smiles Across Patna & All of India 🎁
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-3">
          UnfoldJoy was founded in Patna, Bihar with a singular mission: to make heartfelt, aesthetic gifting effortless and accessible to everyone.
        </p>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-brand-secondary/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-10">
          <div>
            <img src="/logo.png" alt="Unfold Joy - Gifting Brand in Patna" className="h-14 sm:h-16 w-auto object-contain mb-6" />
            <h2 className="text-2xl font-bold text-brand-dark mb-4">
              Handpicked Accessories & Bespoke Gifts Handled with Love
            </h2>
            <p className="text-brand-text text-sm sm:text-base mb-4 leading-relaxed">
              At <strong>UnfoldJoy</strong>, we specialize in curated joy — from handpicked <strong>aesthetic earrings</strong> and statement jewelry to adorable <strong>plush teddy bears</strong>, trendy <strong>keyrings</strong>, and Korean-inspired <strong>hair accessories</strong>.
            </p>
            <p className="text-brand-text text-sm sm:text-base leading-relaxed">
              Whether you are looking for a spontaneous birthday surprise in Patna or sending a loving keepsake to a friend anywhere in India, every box is packaged with delicate care, personal warmth, and festive flair.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#FAF7FD] p-6 rounded-2xl border border-brand-secondary/40 text-center">
              <MapPin className="w-8 h-8 text-brand-cta mx-auto mb-2" />
              <h3 className="font-bold text-sm text-brand-dark">Rooted in Patna</h3>
              <p className="text-xs text-gray-600 mt-1">Prompt local delivery across all Patna neighborhoods</p>
            </div>
            <div className="bg-[#FAF7FD] p-6 rounded-2xl border border-brand-secondary/40 text-center">
              <Truck className="w-8 h-8 text-brand-cta mx-auto mb-2" />
              <h3 className="font-bold text-sm text-brand-dark">Pan-India Delivery</h3>
              <p className="text-xs text-gray-600 mt-1">Express shipping covering every pin code across India</p>
            </div>
            <div className="bg-[#FAF7FD] p-6 rounded-2xl border border-brand-secondary/40 text-center">
              <Sparkles className="w-8 h-8 text-brand-cta mx-auto mb-2" />
              <h3 className="font-bold text-sm text-brand-dark">Curated Quality</h3>
              <p className="text-xs text-gray-600 mt-1">Earrings, keyrings, plush toys & hair accessories</p>
            </div>
            <div className="bg-[#FAF7FD] p-6 rounded-2xl border border-brand-secondary/40 text-center">
              <Gift className="w-8 h-8 text-brand-cta mx-auto mb-2" />
              <h3 className="font-bold text-sm text-brand-dark">Custom Hampers</h3>
              <p className="text-xs text-gray-600 mt-1">Personalized gift boxes tailored to your budget</p>
            </div>
          </div>
        </div>

        {/* Community & Instagram */}
        <div className="p-6 bg-gradient-to-r from-brand-dark to-[#553272] rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold">Join our community on Instagram!</h3>
            <p className="text-xs sm:text-sm text-brand-secondary/90 mt-1">
              Catch daily new arrivals, customer reviews, packaging videos, and exclusive discounts on <strong>@unfoldjoy.in</strong>
            </p>
          </div>
          <a
            href="https://www.instagram.com/unfoldjoy.in"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500 text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2 shadow-md shrink-0"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Follow @unfoldjoy.in</span>
          </a>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs text-brand-text mt-8">
          <p><strong>Headquarters:</strong> Patna City, Bihar, India (PIN: 800001)</p>
          <p><strong>WhatsApp Support:</strong> +91 96938 67664</p>
          <p><strong>Official Inquiries:</strong> <a href="mailto:unfoldjoy.29@gmail.com" className="text-brand-cta hover:underline">unfoldjoy.29@gmail.com</a></p>
        </div>
      </div>
    </div>
  );
};

export default About;
