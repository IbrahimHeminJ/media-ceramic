import React, { useState } from 'react';

export default function Home({ onNavigate }) {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
    }, 4000);
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="animate-fade-slide-in flex-1 pb-16 sm:pb-24">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden py-12 sm:py-20 text-center px-4 max-w-[860px] mx-auto">
        {/* Radial Background Glow */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-80"
          style={{
            background:
              'radial-gradient(circle, rgba(194,120,74,0.12) 0%, transparent 70%)',
          }}
        />

        <span className="inline-block px-4 py-1.5 bg-[#E8D5C4] text-[#A85D32] rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
          Premium Floor &amp; Wall Tiling
        </span>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-semibold text-[#3D3229] tracking-tight leading-[1.15] mb-5">
          Warm floors,<br />
          beautiful <span className="text-[#C2784A] italic">walls</span>.
        </h1>

        <p className="text-base sm:text-lg text-[#6B5D51] max-w-[560px] mx-auto mb-8 leading-relaxed">
          We craft timeless surfaces that bring warmth and character to every space. From natural stone to artisanal porcelain — each tile tells a story of craftsmanship.
        </p>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          <button
            onClick={() => onNavigate('tiles')}
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#C2784A] text-white rounded-full font-semibold text-sm sm:text-base hover:bg-[#A85D32] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
          >
            Explore Collection <i className="fa-solid fa-arrow-right text-xs"></i>
          </button>
          <button
            onClick={scrollToContact}
            className="inline-flex items-center gap-2 px-7 py-3 bg-transparent border-2 border-[#E8DDD4] text-[#3D3229] rounded-full font-semibold text-sm sm:text-base hover:border-[#C2784A] hover:text-[#A85D32] hover:bg-[#FDFAF6] transition-all cursor-pointer"
          >
            Get in Touch
          </button>
        </div>
      </div>

      {/* OUR STORY SECTION */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-12 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Tile Swatch Visual */}
          <div className="aspect-[4/3] bg-gradient-to-br from-[#E8D5C4] via-[#F5EDE4] to-[#dcc8b0] rounded-2xl shadow-lg flex items-center justify-center p-6">
            <div className="w-[70%] aspect-square bg-white rounded-xl p-2 grid grid-cols-3 grid-rows-3 gap-1 shadow-md">
              <span className="rounded bg-[#d4b896]"></span>
              <span className="rounded bg-[#c9a882]"></span>
              <span className="rounded bg-[#d4b896]"></span>
              <span className="rounded bg-[#bf9e78]"></span>
              <span className="rounded bg-[#c9a882]"></span>
              <span className="rounded bg-[#bf9e78]"></span>
              <span className="rounded bg-[#d4b896]"></span>
              <span className="rounded bg-[#bf9e78]"></span>
              <span className="rounded bg-[#d4b896]"></span>
            </div>
          </div>

          {/* Text Content */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C2784A] block mb-2">
              Our Story
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-[#3D3229] tracking-tight mb-4">
              Rooted in craftsmanship, designed for modern living.
            </h2>
            <p className="text-[#6B5D51] text-base leading-relaxed">
              TERRA TILE CO. was born from a deep appreciation for natural materials and timeless design. We source the finest clays, stones, and minerals to create tiles that don't just cover surfaces — they transform them. Every piece is a marriage of tradition and innovation, crafted to bring warmth underfoot and beauty to every wall.
            </p>
          </div>
        </div>
      </div>

      {/* OUR VISION SECTION */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 my-8">
        <div className="bg-[#FDFAF6] rounded-3xl p-6 sm:p-14 border border-[#F0E8DF] shadow-xs">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C2784A] block mb-2">
            Our Vision
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-[#3D3229] tracking-tight mb-8">
            What we stand for.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 text-center rounded-2xl bg-[#FAF7F4] border border-transparent hover:border-[#E8DDD4] hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 bg-[#E8D5C4] rounded-full flex items-center justify-center mx-auto mb-4 text-xl text-[#A85D32]">
                <i className="fa-solid fa-seedling"></i>
              </div>
              <h3 className="font-serif text-xl text-[#3D3229] font-medium mb-2">
                Sustainable Sourcing
              </h3>
              <p className="text-sm text-[#6B5D51] leading-relaxed">
                We partner with ethical quarries and use recycled materials wherever possible to minimize our environmental footprint.
              </p>
            </div>

            <div className="p-6 text-center rounded-2xl bg-[#FAF7F4] border border-transparent hover:border-[#E8DDD4] hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 bg-[#E8D5C4] rounded-full flex items-center justify-center mx-auto mb-4 text-xl text-[#A85D32]">
                <i className="fa-solid fa-hand-sparkles"></i>
              </div>
              <h3 className="font-serif text-xl text-[#3D3229] font-medium mb-2">
                Artisanal Quality
              </h3>
              <p className="text-sm text-[#6B5D51] leading-relaxed">
                Each tile undergoes rigorous quality checks. We believe in slow production and lasting beauty over mass manufacturing.
              </p>
            </div>

            <div className="p-6 text-center rounded-2xl bg-[#FAF7F4] border border-transparent hover:border-[#E8DDD4] hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 bg-[#E8D5C4] rounded-full flex items-center justify-center mx-auto mb-4 text-xl text-[#A85D32]">
                <i className="fa-solid fa-house-chimney"></i>
              </div>
              <h3 className="font-serif text-xl text-[#3D3229] font-medium mb-2">
                Warm Minimalism
              </h3>
              <p className="text-sm text-[#6B5D51] leading-relaxed">
                Our designs embrace clean lines and warm tones — creating spaces that feel both modern and deeply inviting.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TRUSTED BY SECTION */}
      <div className="max-w-[860px] mx-auto px-4 py-12 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C2784A] block mb-6">
          Trusted By
        </span>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {['HAVEN HOMES', 'STUDIO OAK', 'THE DESIGN CO.', 'URBAN NEST', 'CRAFT & CLAY', 'MODERN LIVING'].map((brand, i) => (
            <span
              key={i}
              className="font-serif text-lg sm:text-xl font-semibold text-[#A89885] grayscale opacity-50 hover:opacity-90 hover:grayscale-0 hover:text-[#3D3229] transition-all cursor-default tracking-wide"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* CONTACT SECTION */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-12 sm:py-16" id="contact-section">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C2784A] block mb-2">
          Contact
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-[#3D3229] tracking-tight mb-8">
          Let's talk about your project.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-3xl p-6 sm:p-10 border border-[#F0E8DF] shadow-xs">
          {/* Contact Details */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-[#F5EDE4] rounded-full flex items-center justify-center text-[#A85D32] shrink-0 text-base">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#3D3229]">Visit Our Showroom</h4>
                <p className="text-sm text-[#6B5D51] mt-0.5">
                  127 Warm Street, Design District<br />
                  Portland, OR 97201
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-[#F5EDE4] rounded-full flex items-center justify-center text-[#A85D32] shrink-0 text-base">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#3D3229]">Email Us</h4>
                <p className="text-sm text-[#6B5D51] mt-0.5">hello@terratile.co</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-[#F5EDE4] rounded-full flex items-center justify-center text-[#A85D32] shrink-0 text-base">
                <i className="fa-solid fa-phone"></i>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#3D3229]">Call Us</h4>
                <p className="text-sm text-[#6B5D51] mt-0.5">+1 (503) 555-0147</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {formSubmitted && (
              <div className="p-3 bg-[#E8D5C4]/50 border border-[#C2784A] text-[#A85D32] text-sm rounded-xl flex items-center gap-2">
                <i className="fa-solid fa-circle-check"></i>
                Message sent! We'll get back to you soon.
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                required
                className="w-full px-4 py-3 border-2 border-[#F0E8DF] rounded-xl text-sm bg-[#FAF7F4] focus:outline-none focus:border-[#D4956A] focus:bg-[#FDFAF6] transition-all text-[#3D3229]"
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 border-2 border-[#F0E8DF] rounded-xl text-sm bg-[#FAF7F4] focus:outline-none focus:border-[#D4956A] focus:bg-[#FDFAF6] transition-all text-[#3D3229]"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Subject"
                className="w-full px-4 py-3 border-2 border-[#F0E8DF] rounded-xl text-sm bg-[#FAF7F4] focus:outline-none focus:border-[#D4956A] focus:bg-[#FDFAF6] transition-all text-[#3D3229]"
              />
            </div>
            <div>
              <textarea
                placeholder="Tell us about your project..."
                required
                rows={4}
                className="w-full px-4 py-3 border-2 border-[#F0E8DF] rounded-xl text-sm bg-[#FAF7F4] focus:outline-none focus:border-[#D4956A] focus:bg-[#FDFAF6] transition-all text-[#3D3229] resize-y"
              ></textarea>
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#C2784A] text-white rounded-full font-semibold text-sm hover:bg-[#A85D32] transition-all shadow-md cursor-pointer"
            >
              Send Message <i className="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
