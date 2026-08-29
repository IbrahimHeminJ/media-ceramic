import React from 'react';

export default function Social({ onNavigate }) {
  const socialLinks = [
    {
      name: 'Instagram — @terratile.co',
      href: 'https://instagram.com',
      icon: 'fa-brands fa-instagram',
      color: 'text-[#E1306C]',
    },
    {
      name: 'Pinterest — /terratile',
      href: 'https://pinterest.com',
      icon: 'fa-brands fa-pinterest',
      color: 'text-[#BD081C]',
    },
    {
      name: 'Facebook — Terra Tile Co.',
      href: 'https://facebook.com',
      icon: 'fa-brands fa-facebook',
      color: 'text-[#1877F2]',
    },
    {
      name: 'YouTube — @TerraTileOfficial',
      href: 'https://youtube.com',
      icon: 'fa-brands fa-youtube',
      color: 'text-[#FF0000]',
    },
    {
      name: 'TikTok — @terratile',
      href: 'https://tiktok.com',
      icon: 'fa-brands fa-tiktok',
      color: 'text-black',
    },
    {
      name: 'WhatsApp Business',
      href: 'https://whatsapp.com',
      icon: 'fa-brands fa-whatsapp',
      color: 'text-[#25D366]',
    },
    {
      name: 'Email Us',
      href: 'mailto:hello@terratile.co',
      icon: 'fa-solid fa-envelope',
      color: 'text-[#C2784A]',
    },
    {
      name: 'terratile.co',
      onClick: () => onNavigate('home'),
      icon: 'fa-solid fa-globe',
      color: 'text-[#B8754F]',
    },
  ];

  return (
    <section className="animate-fade-slide-in flex-1 flex items-center justify-center py-12 sm:py-16 px-4">
      <div className="bg-white rounded-3xl p-8 sm:p-12 text-center max-w-[440px] w-full shadow-xl border border-[#F0E8DF]">
        {/* Avatar */}
        <div className="w-22 h-22 rounded-full bg-gradient-to-br from-[#D4956A] to-[#C2784A] mx-auto mb-6 flex items-center justify-center text-3xl text-white shadow-lg">
          <i className="fa-solid fa-cube"></i>
        </div>

        {/* Title & Bio */}
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#3D3229] mb-1">
          TERRA TILE CO.
        </h2>
        <p className="text-[#C2784A] font-semibold text-sm mb-3">@terratile.co</p>
        <p className="text-[#6B5D51] text-sm leading-relaxed mb-8">
          Warm floors, beautiful walls. Crafted for living. 🌿<br />
          Premium tiling — showroom in Portland, OR.
        </p>

        {/* Social Buttons Stack */}
        <div className="flex flex-col gap-3">
          {socialLinks.map((link, idx) => {
            const className =
              'flex items-center justify-center gap-3 px-5 py-3.5 rounded-full border-2 border-[#F0E8DF] font-semibold text-sm text-[#3D3229] bg-[#FAF7F4] hover:bg-[#E8D5C4] hover:border-[#D4956A] hover:-translate-y-0.5 transition-all shadow-xs cursor-pointer';

            if (link.onClick) {
              return (
                <button key={idx} onClick={link.onClick} className={className}>
                  <i className={`${link.icon} ${link.color} text-lg w-6 text-center`}></i>
                  <span>{link.name}</span>
                </button>
              );
            }

            return (
              <a
                key={idx}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                <i className={`${link.icon} ${link.color} text-lg w-6 text-center`}></i>
                <span>{link.name}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
