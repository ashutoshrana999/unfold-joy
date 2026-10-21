import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-brand-secondary py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <Link to="/" className="inline-block mb-3">
            <img
              src="/logo-white.png"
              alt="Unfold Joy"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <p className="text-sm text-brand-secondary/80 max-w-sm leading-relaxed mb-4">
            Bringing moments of sheer joy with every gift. We curate the best jewelry, keepsakes,
            and heartwarming presents just for you and your loved ones.
          </p>
          <div className="text-xs text-brand-secondary/90 space-y-1">
            <p><span className="text-white font-medium">WhatsApp / Phone:</span> +91 96938 67664</p>
            <p><span className="text-white font-medium">Email:</span> <a href="mailto:unfoldjoy.29@gmail.com" className="hover:text-white transition-colors">unfoldjoy.29@gmail.com</a></p>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-white mb-4 uppercase tracking-wider text-xs">
            Quick Navigation
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="text-brand-secondary hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="text-brand-secondary hover:text-white transition-colors">
                Shop All Collections
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-brand-secondary hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-brand-secondary hover:text-white transition-colors">
                Contact & Support
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-bold text-white mb-4 uppercase tracking-wider text-xs">
            WhatsApp Orders
          </h3>
          <p className="text-sm text-brand-secondary/80 mb-3">
            Direct customer assistance and instant checkout on WhatsApp!
          </p>
          <p className="text-xs text-white font-semibold mb-3">
            📱 +91 96938 67664
          </p>
          <a
            href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '919693867664'}?text=${encodeURIComponent("Hi UnfoldJoy! I have an inquiry about your products.")}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-cta text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-md"
          >
            Chat & Order on WhatsApp
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-8 border-t border-white/10 text-xs text-brand-secondary/60 text-center">
        &copy; {new Date().getFullYear()} UnfoldJoy. All rights reserved. Handcrafted with care.
      </div>
    </footer>
  );
};

export default Footer;
