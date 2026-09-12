import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar({ activePage, onNavigate }) {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t('nav.home', 'Home') },
    { id: 'tiles', label: t('nav.tiles', 'Tiles') },
    { id: 'social', label: t('nav.social', 'Social') },
  ];

  return (
    <nav className="sticky top-0 z-[100] bg-[#FAF7F4]/95 backdrop-blur-xl border-b border-[#F0E8DF] transition-all">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between h-14 sm:h-16 px-4 sm:px-8">
        {/* Brand */}
        <button
          onClick={() => {
            onNavigate('home');
            setIsMobileMenuOpen(false);
          }}
          className="flex items-center gap-2 font-serif text-xl sm:text-2xl font-semibold text-[#3D3229] hover:text-[#C2784A] transition-colors cursor-pointer"
          title={t('common.companyName', 'Media Ceramic CO.')}
        >
          <span className="w-7 h-7 sm:w-8 sm:h-8 bg-[#C2784A] rounded-lg flex items-center justify-center text-white text-xs sm:text-sm shadow-sm">
            <i className="fa-solid fa-cube"></i>
          </span>
          <span>{t('nav.brand', 'Media Ceramic')}</span>
        </button>

        {/* Right Section: Desktop Nav links + Language Switcher + Hamburger */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop Navigation */}
          <ul className="hidden sm:flex items-center gap-1.5 list-none">
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

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Mobile Hamburger Button */}
          <button
            className="sm:hidden flex items-center justify-center w-8 h-8 text-[#3D3229] rounded-md hover:bg-[#F5EDE4] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-[#F0E8DF] bg-[#FAF7F4] shadow-lg absolute left-0 right-0 top-full">
          <ul className="flex flex-col list-none p-2">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 text-sm rounded-lg transition-all ${
                      isActive
                        ? 'bg-[#E8D5C4] text-[#A85D32] font-semibold'
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
      )}
    </nav>
  );
}
