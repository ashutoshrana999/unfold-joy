import { Link } from 'react-router-dom';
import { MapPin, Truck, MessageCircle, Mail, Phone } from 'lucide-react';
import InstagramIcon from './InstagramIcon';

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-brand-secondary py-14 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand & Local Focus Column */}
        <div className="md:col-span-1">
          <Link to="/" className="inline-block mb-3">
            <img
              src="/logo-white.png"
              alt="Unfold Joy - Curated Gifts in Patna & India"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <p className="text-xs text-brand-secondary/80 leading-relaxed mb-4">
            Curated gifting boutique bringing joyful moments with every parcel. Specializing in aesthetic earrings, keyrings, cuddly teddy bears, hair accessories, and bespoke gift hampers.
          </p>
          <div className="space-y-1.5 text-xs text-brand-secondary/90">
            <div className="flex items-center gap-2 text-white font-medium">
              <MapPin className="w-3.5 h-3.5 text-brand-cta shrink-0" />
              <span>Patna City, Bihar (HQ)</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-brand-cta shrink-0" />
              <span>Pan-India Courier Delivery 🇮🇳</span>
            </div>
          </div>
        </div>

        {/* Popular Categories (SEO Rich Links) */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">
            Trending Gifting
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/category/earrings" className="text-brand-secondary/90 hover:text-white transition-colors">
                • Aesthetic Earrings & Jhumkas
              </Link>
            </li>
            <li>
              <Link to="/shop?search=keyring" className="text-brand-secondary/90 hover:text-white transition-colors">
                • Stylish Keyrings & Charms
              </Link>
            </li>
            <li>
              <Link to="/category/teddy-bears" className="text-brand-secondary/90 hover:text-white transition-colors">
                • Soft Plush Teddy Bears
              </Link>
            </li>
            <li>
              <Link to="/category/hair-accessories" className="text-brand-secondary/90 hover:text-white transition-colors">
                • Korean Hair Accessories & Clips
              </Link>
            </li>
            <li>
              <Link to="/category/gift-box" className="text-brand-secondary/90 hover:text-white transition-colors">
                • Custom Gift Boxes & Hampers
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Navigation */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">
            Quick Links
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/" className="text-brand-secondary/90 hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="text-brand-secondary/90 hover:text-white transition-colors">
                Shop All Collections
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-brand-secondary/90 hover:text-white transition-colors">
                About UnfoldJoy Patna
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-brand-secondary/90 hover:text-white transition-colors">
                Contact & Custom Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* Instagram & WhatsApp Connect */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">
            Connect & Order
          </h3>
          <p className="text-xs text-brand-secondary/80 mb-3 leading-relaxed">
            Follow our daily stories, unboxing videos, and new drops on Instagram:
          </p>
          <a
            href="https://www.instagram.com/unfoldjoy.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 mb-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500 text-white font-bold text-xs hover:opacity-95 transition-opacity shadow-sm"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>@unfoldjoy.in</span>
          </a>

          <div className="pt-2 text-xs space-y-1.5 border-t border-white/10 mt-2">
            <p className="text-white font-medium flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-brand-cta" /> +91 96938 67664
            </p>
            <p className="text-brand-secondary/80 flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-brand-cta" /> unfoldjoy.29@gmail.com
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-secondary/60">
        <p>&copy; {new Date().getFullYear()} UnfoldJoy. All rights reserved. Handcrafted & Curated in Patna, Bihar.</p>
        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/unfoldjoy.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <InstagramIcon className="w-3.5 h-3.5" /> Instagram: unfoldjoy.in
          </a>
          <span>•</span>
          <span className="text-brand-secondary/80">Delivering Pan-India 🇮🇳</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
