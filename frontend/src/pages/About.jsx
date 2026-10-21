const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-extrabold text-brand-dark mb-6">About UnfoldJoy</h1>
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-brand-secondary/30">
        <div className="mb-6">
          <img src="/logo.png" alt="Unfold Joy" className="h-14 sm:h-16 w-auto object-contain" />
        </div>
        <p className="text-lg text-brand-text mb-4 leading-relaxed">
          Welcome to UnfoldJoy, your number one source for all things joyful! We're dedicated to giving you the very best of gifts, with a focus on quality, customer service, and uniqueness.
        </p>
        <p className="text-lg text-brand-text mb-4 leading-relaxed">
          Founded with a passion for spreading happiness, UnfoldJoy has come a long way from its beginnings. When we first started out, our passion for curated gifting drove us to do intense research, so that UnfoldJoy can offer you the world's most elegant teddy bears, exquisite jewelry, and memorable gift boxes.
        </p>
        <p className="text-lg text-brand-text leading-relaxed mb-6">
          We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
        </p>

        <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center gap-6 text-sm text-brand-text">
          <p><strong>WhatsApp / Phone:</strong> +91 96938 67664</p>
          <p><strong>Email:</strong> <a href="mailto:unfoldjoy.29@gmail.com" className="text-brand-cta hover:underline">unfoldjoy.29@gmail.com</a></p>
        </div>
      </div>
    </div>
  );
};

export default About;
