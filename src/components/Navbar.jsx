import React from 'react';

export default function Navbar({ activePage, onNavigate }) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'tiles', label: 'Tiles' },
    { id: 'social', label: 'Social' },
  ];

  return (
    <nav className="sticky top-0 z-[100] bg-[#FAF7F4]/85 backdrop-blur-xl border-b border-[#F0E8DF] transition-all px-4 sm:px-8">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between h-14 sm:h-16">
        {/* Brand */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 font-serif text-xl sm:text-2xl font-semibold text-[#3D3229] hover:text-[#C2784A] transition-colors cursor-pointer"
          title="TERRA TILE CO."
        >
          <span className="w-7 h-7 sm:w-8 sm:h-8 bg-[#C2784A] rounded-lg flex items-center justify-center text-white text-xs sm:text-sm shadow-sm">
            <i className="fa-solid fa-cube"></i>
          </span>
          <span>TERRA TILE</span>
        </button>

        {/* Nav Links Desktop / Mobile */}
        <ul className="flex items-center gap-1.5 list-none max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:bg-white/95 max-sm:backdrop-blur-xl max-sm:border-t max-sm:border-[#F0E8DF] max-sm:justify-around max-sm:py-2 max-sm:px-4 max-sm:z-[100] max-sm:shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`inline-block px-3.5 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full transition-all cursor-pointer tracking-wide ${
                    isActive
                      ? 'bg-[#E8D5C4] text-[#A85D32] font-semibold shadow-xs'
                      : 'text-[#6B5D51] font-medium hover:text-[#3D3229] hover:bg-[#F5EDE4]'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
