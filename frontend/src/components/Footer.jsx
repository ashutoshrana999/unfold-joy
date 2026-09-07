const Footer = () => {
  return (
    <footer className="bg-brand-dark text-brand-secondary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">UnfoldJoy</h3>
          <p className="text-sm">Bringing joy with every gift. We curate the best teddy bears, earrings, rings, and bracelets just for you.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/category/teddy-bears" className="text-white hover:text-brand-secondary transition-colors">Teddy Bears</a></li>
            <li><a href="/category/earrings" className="text-white hover:text-brand-secondary transition-colors">Earrings</a></li>
            <li><a href="/category/rings" className="text-white hover:text-brand-secondary transition-colors">Rings</a></li>
            <li><a href="/category/bracelets" className="text-white hover:text-brand-secondary transition-colors">Bracelets</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Contact Us</h3>
          <p className="text-sm mb-2">Order easily via WhatsApp!</p>
          <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '917759902716'}`} className="inline-flex items-center text-white hover:text-brand-secondary transition-colors font-medium">
            Chat with us
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-white/20 text-sm text-center">
        &copy; {new Date().getFullYear()} UnfoldJoy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
