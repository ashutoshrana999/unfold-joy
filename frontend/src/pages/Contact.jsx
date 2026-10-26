import { useEffect } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Truck } from 'lucide-react';
import InstagramIcon from '../components/InstagramIcon';

const Contact = () => {
  useEffect(() => {
    document.title = 'Contact UnfoldJoy Patna | WhatsApp Gifting & Pan-India Orders';
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-cta bg-brand-secondary/30 px-3 py-1 rounded-full">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-dark mt-3 tracking-tight">
          We’d Love to Help You Gift Joyfully
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Based in Patna with swift pan-India courier delivery. Connect with us for custom hampers, product queries, or bulk inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-secondary/30">
          <h2 className="text-2xl font-bold text-brand-dark mb-2">Send Us a Note</h2>
          <p className="text-sm text-brand-text mb-6">
            Looking for a specific jewelry style, custom teddy hamper, or urgent delivery in Patna? Message us below or ping on WhatsApp!
          </p>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Thanks for reaching out! We'll get back to you promptly."); }}>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Your Name</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-brand-cta focus:border-brand-cta text-sm" placeholder="Enter your name" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email or Phone</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-brand-cta focus:border-brand-cta text-sm" placeholder="your@email.com or phone" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Your Message or Custom Request</label>
              <textarea rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-brand-cta focus:border-brand-cta text-sm" placeholder="Tell us about the item or hamper you need..." required></textarea>
            </div>
            <button type="submit" className="w-full bg-brand-cta text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity text-sm shadow">
              Send Message
            </button>
          </form>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-7 rounded-2xl border border-brand-secondary/40 shadow-sm">
            <img src="/logo.png" alt="Unfold Joy Patna" className="h-10 w-auto object-contain mb-4" />
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-cta shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-brand-dark">Our Office</h3>
                <p className="text-sm text-brand-text mt-1">
                  Patna, Bihar<br />
                  <span className="text-xs text-brand-cta font-medium">✨ Serving Patna locally with express dispatch & delivery across all India 🇮🇳</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-brand-secondary/40 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-brand-dark">Instant Assistance & Social</h3>
            
            <div className="space-y-2 text-sm text-brand-text">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-cta" />
                <span><strong>Phone / WhatsApp:</strong> +91 96938 67664</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-cta" />
                <span><strong>Email:</strong> <a href="mailto:unfoldjoy.29@gmail.com" className="text-brand-cta hover:underline">unfoldjoy.29@gmail.com</a></span>
              </p>
              <p className="flex items-center gap-2">
                <InstagramIcon className="w-4 h-4 text-pink-500" />
                <span><strong>Instagram:</strong> <a href="https://www.instagram.com/unfoldjoy.in" target="_blank" rel="noopener noreferrer" className="text-pink-600 font-bold hover:underline">@unfoldjoy.in</a></span>
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a 
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '919693867664'}?text=${encodeURIComponent("Hi UnfoldJoy! I have a question regarding an order or custom hamper.")}`} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-green-600 transition-colors shadow-sm text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>

              <a 
                href="https://www.instagram.com/unfoldjoy.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500 text-white font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm text-sm"
              >
                <InstagramIcon className="w-4 h-4" />
                Visit @unfoldjoy.in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
