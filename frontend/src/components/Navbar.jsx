import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-brand-dark border-b border-white/10 transition-all shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center group py-2">
            <img
              src="/logo-white.png"
              alt="Unfold Joy"
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-sm"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link
              to="/"
              className={`font-medium transition-colors ${
                isActive('/') ? 'text-white font-bold border-b-2 border-brand-cta pb-1' : 'text-brand-secondary hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/shop') ? 'text-white font-bold border-b-2 border-brand-cta pb-1' : 'text-brand-secondary hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-brand-secondary" />
              Shop
            </Link>
            <Link
              to="/about"
              className={`font-medium transition-colors ${
                isActive('/about') ? 'text-white font-bold border-b-2 border-brand-cta pb-1' : 'text-brand-secondary hover:text-white'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`font-medium transition-colors ${
                isActive('/contact') ? 'text-white font-bold border-b-2 border-brand-cta pb-1' : 'text-brand-secondary hover:text-white'
              }`}
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/shop"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-cta text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 shadow-sm transition-all"
            >
              Browse Shop
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-brand-secondary hover:text-white transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-dark border-t border-white/10">
          <div className="px-4 pt-3 pb-5 space-y-2 shadow-lg">
            <div className="px-3 py-2 border-b border-white/10 mb-2">
              <img
                src="/logo-white.png"
                alt="Unfold Joy"
                className="h-8 w-auto object-contain"
              />
            </div>
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-brand-secondary hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-brand-secondary hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              Shop All Items
            </Link>
            <Link 
              to="/about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-brand-secondary hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              About Us
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-brand-secondary hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
