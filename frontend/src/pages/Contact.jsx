const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-extrabold text-brand-dark mb-6">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-secondary/30">
          <h2 className="text-2xl font-bold text-brand-dark mb-4">Get in Touch</h2>
          <p className="text-brand-text mb-6">
            Have a question about a product or an order? We're here to help! Fill out the form or reach out via WhatsApp.
          </p>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Thanks for reaching out! We'll get back to you soon."); }}>
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">Name</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-cta focus:border-brand-cta" placeholder="Your Name" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">Email</label>
              <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-cta focus:border-brand-cta" placeholder="your@email.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">Message</label>
              <textarea rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-cta focus:border-brand-cta" placeholder="How can we help?" required></textarea>
            </div>
            <button type="submit" className="w-full bg-brand-cta text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition-opacity">
              Send Message
            </button>
          </form>
        </div>
        
        <div className="space-y-8">
          <div className="bg-brand-light p-8 rounded-2xl border border-brand-secondary/50">
            <h3 className="text-xl font-bold text-brand-dark mb-2">Our Office</h3>
            <p className="text-brand-text">123 Joy Avenue, Happiness District<br />Mumbai, MH 400001<br />India</p>
          </div>
          <div className="bg-brand-light p-8 rounded-2xl border border-brand-secondary/50">
            <h3 className="text-xl font-bold text-brand-dark mb-2">Direct Contact</h3>
            <p className="text-brand-text mb-2"><strong>Email:</strong> hello@unfoldjoy.com</p>
            <p className="text-brand-text mb-4"><strong>Phone:</strong> +91 98765 43210</p>
            <a href="https://wa.me/919876543210" className="inline-block bg-green-500 text-white font-bold px-6 py-2 rounded-md hover:bg-green-600 transition-colors">
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
