import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Normalize current language (e.g. 'en-US' -> 'en')
  const currentLangCode = (i18n.language || 'en').split('-')[0].toLowerCase();
  const currentLang =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLangCode) ||
    SUPPORTED_LANGUAGES[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectLanguage = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Change Language"
        className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full bg-white/80 hover:bg-white border border-[#F0E8DF] hover:border-[#D4956A] text-[#3D3229] transition-all cursor-pointer shadow-xs hover:shadow-sm focus:outline-none"
      >
        <i className="fa-solid fa-globe text-[#C2784A] text-xs sm:text-sm"></i>
        <span className="font-semibold text-xs uppercase tracking-wider">{currentLang.code}</span>
        <span className="hidden sm:inline text-xs text-[#6B5D51]">· {currentLang.nativeName}</span>
        <i
          className={`fa-solid fa-chevron-down text-[10px] text-[#A89885] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#C2784A]' : ''
          }`}
        ></i>
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-44 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#F0E8DF] shadow-xl py-1.5 z-[150] animate-fade-slide-in origin-top-right rtl:origin-top-left"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-3 py-1.5 border-b border-[#F0E8DF]/70 text-[10px] font-bold uppercase tracking-wider text-[#A89885]">
            Select Language
          </div>

          <div className="p-1 space-y-0.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = currentLangCode === lang.code;

              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.code)}
                  role="menuitem"
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all cursor-pointer text-left rtl:text-right ${
                    isSelected
                      ? 'bg-[#F5EDE4] text-[#A85D32] font-semibold'
                      : 'text-[#3D3229] hover:bg-[#FAF7F4] hover:text-[#C2784A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm leading-none">{lang.flag}</span>
                    <div>
                      <div className="font-medium text-xs">{lang.nativeName}</div>
                      <div className="text-[10px] text-[#A89885]">{lang.label}</div>
                    </div>
                  </div>

                  {isSelected && (
                    <i className="fa-solid fa-check text-xs text-[#C2784A]"></i>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
