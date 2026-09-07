import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-brand-dark border-b border-brand-dark transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded bg-brand-cta flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:bg-brand-secondary group-hover:text-brand-dark transition-colors duration-300">
              U
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">
              UnfoldJoy
            </span>
          </Link>
          <nav className="hidden md:flex space-x-8 items-center">
            <Link to="/about" className="text-brand-secondary hover:text-white font-medium transition-colors">About</Link>
            <Link to="/contact" className="text-brand-secondary hover:text-white font-medium transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-brand-secondary hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-dark border-t border-white/10">
          <div className="px-4 pt-2 pb-4 space-y-1 shadow-lg">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-brand-secondary hover:text-white hover:bg-white/5 rounded-md transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-brand-secondary hover:text-white hover:bg-white/5 rounded-md transition-colors"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-brand-secondary hover:text-white hover:bg-white/5 rounded-md transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
