import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Normalizes destination URLs so external links always open in external pages
 * instead of being treated as relative local subpaths (e.g. 'instagram.com' -> 'https://instagram.com').
 */
const formatDestinationUrl = (url) => {
  if (!url) return '#';
  const trimmed = url.trim();

  // If already an absolute protocol, mailto, tel, or anchor
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('#')
  ) {
    return trimmed;
  }

  // Handle protocol-relative URLs
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  // Prepend https:// for domain inputs like 'instagram.com', 'pinterest.com/Media Ceramic'
  return `https://${trimmed}`;
};

/**
 * Social Component
 *
 * Renders the social links hub page.
 * Dynamically maps `socialLinks` passed from state.
 */
export default function Social({ socialLinks = [], onNavigate }) {
  const { t } = useTranslation();

  return (
    <section className="animate-fade-slide-in flex-1 flex items-center justify-center py-12 sm:py-16 px-4">
      <div className="bg-white rounded-3xl p-8 sm:p-12 text-center max-w-[440px] w-full shadow-xl border border-[#F0E8DF]">
        {/* Avatar / Brand Icon */}
        <div className="w-22 h-22 rounded-full bg-gradient-to-br from-[#D4956A] to-[#C2784A] mx-auto mb-6 flex items-center justify-center text-3xl text-white shadow-lg">
          <i className="fa-solid fa-cube"></i>
        </div>

        {/* Title & Bio */}
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#3D3229] mb-1">
          {t('social.title', 'Media Ceramic TILE CO.')}
        </h2>
        <p className="text-[#C2784A] font-semibold text-sm mb-3">{t('social.handle', '@terratile.co')}</p>
        <p className="text-[#6B5D51] text-sm leading-relaxed mb-8">
          {t('social.bio1', 'Warm floors, beautiful walls. Crafted for living. 🌿')}<br />
          {t('social.bio2', 'Premium tiling — showroom in Portland, OR.')}
        </p>

        {/* Dynamic Social Buttons Stack */}
        <div className="flex flex-col gap-3">
          {socialLinks.length === 0 ? (
            <p className="text-sm text-[#A89885] py-4">{t('social.empty', 'No social links configured.')}</p>
          ) : (
            socialLinks.map((link, idx) => {
              const className =
                'flex items-center justify-center gap-3 px-5 py-3.5 rounded-full border-2 border-[#F0E8DF] font-semibold text-sm text-[#3D3229] bg-[#FAF7F4] hover:bg-[#E8D5C4] hover:border-[#D4956A] hover:-translate-y-0.5 transition-all shadow-xs cursor-pointer';

              // Internal site navigation link (e.g. Back to Home)
              if (link.isHomeLink || link.onClick) {
                return (
                  <button
                    key={link.id || idx}
                    onClick={() => (link.onClick ? link.onClick() : onNavigate('home'))}
                    className={className}
                  >
                    <i
                      className={`${link.icon || 'fa-solid fa-globe'} ${
                        link.color || 'text-[#B8754F]'
                      } text-lg w-6 text-center`}
                    ></i>
                    <span>{link.name}</span>
                  </button>
                );
              }

              // External destination link -> opens in a new page/tab
              const destinationHref = formatDestinationUrl(link.href);

              return (
                <a
                  key={link.id || idx}
                  href={destinationHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  <i
                    className={`${link.icon || 'fa-solid fa-link'} ${
                      link.color || 'text-[#C2784A]'
                    } text-lg w-6 text-center`}
                  ></i>
                  <span>{link.name}</span>
                </a>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
