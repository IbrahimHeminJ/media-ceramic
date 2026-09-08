import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * TileModal Component
 *
 * Displays detailed information about a selected tile:
 * - Left column (desktop) / Top section (mobile) with full-height main tile image
 * - Specifications, badges, description
 * - Conditional PDF download button
 * - Up to 4 orientation pattern images
 * - Installation mockups
 * - Full-screen lightbox viewer for main image, mockups, and patterns
 */
export default function TileModal({ tile, onClose }) {
  const { t } = useTranslation();
  // State for the full-screen lightbox image viewer
  const [fullscreenImage, setFullscreenImage] = useState(null);

  // Manage body scroll and Escape key shortcuts
  useEffect(() => {
    if (!tile) return;

    // Prevent background page scrolling while modal is open
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        // If fullscreen image viewer is active, close lightbox first; otherwise close modal
        if (fullscreenImage) {
          setFullscreenImage(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [tile, onClose, fullscreenImage]);

  if (!tile) return null;

  const mockupLabels = [
    t('modal.mockups.roomInstallation', 'Room Installation'),
    t('modal.mockups.bathroomMockup', 'Bathroom Mockup'),
    t('modal.mockups.kitchenView', 'Kitchen View'),
    t('modal.mockups.closeUpDetail', 'Close-up Detail'),
  ];

  // Main tile image source (ready for future backend property integration)
  const mainImageSrc =
    tile.image || `https://picsum.photos/seed/${tile.id}-tile/800/800`;

  // Up to 4 orientations maximum
  const orientationsList = Array.isArray(tile.orientations)
    ? tile.orientations.slice(0, 4)
    : [];

  // Mockups list (supports mockupSeeds array or mockup image objects)
  const mockupsList = tile.mockupSeeds || tile.mockups || [];

  return (
    <>
      {/* MODAL BACKDROP */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[200] bg-[#3D3229]/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8 animate-fade-slide-in"
      >
        {/* MODAL CONTAINER: Responsive 2-column on desktop, stacked on mobile */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl max-w-[1050px] w-full max-h-[90vh] md:h-[85vh] shadow-2xl relative overflow-hidden flex flex-col md:flex-row animate-modal-slide-up text-[#3D3229]"
        >
          {/* LEFT PANEL: Main Tile Image (Full height on desktop, top banner on mobile) */}
          <div className="w-full md:w-[380px] lg:w-[420px] md:h-full h-64 sm:h-72 shrink-0 relative bg-[#FAF7F4] border-b md:border-b-0 md:border-r border-[#F0E8DF] overflow-hidden group">
            <img
              src={mainImageSrc}
              alt={tile.name}
              onClick={() =>
                setFullscreenImage({
                  src: mainImageSrc,
                  alt: `${tile.name} - Tile Swatch`,
                  title: `${tile.name} - Full Tile View`,
                })
              }
              className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500"
              title="Click to view full screen"
            />

            {/* Quick Fullscreen Overlay Cue */}
            <button
              type="button"
              onClick={() =>
                setFullscreenImage({
                  src: mainImageSrc,
                  alt: `${tile.name} - Tile Swatch`,
                  title: `${tile.name} - Full Tile View`,
                })
              }
              className="absolute bottom-4 right-4 bg-[#3D3229]/80 hover:bg-[#C2784A] text-white px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer opacity-90 group-hover:opacity-100"
              title={t('modal.clickToViewFullscreen', 'Click to view full screen')}
            >
              <i className="fa-solid fa-expand text-xs"></i>
              <span>{t('modal.fullscreen', 'Fullscreen')}</span>
            </button>
          </div>

          {/* RIGHT PANEL: Scrollable Tile Information */}
          <div className="flex-1 min-w-0 h-full overflow-y-auto p-6 sm:p-8 md:p-10 relative flex flex-col justify-start">
            {/* Modal Header & Close Button */}
            <div className="flex justify-between items-start gap-4 mb-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#3D3229] leading-tight">
                  {tile.name}
                </h2>
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#C2784A] mt-1">
                  {tile.brand} &nbsp;·&nbsp;{' '}
                  {tile.type.charAt(0).toUpperCase() + tile.type.slice(1)}
                </p>
              </div>

              <button
                onClick={onClose}
                className="shrink-0 w-10 h-10 rounded-full bg-[#FAF7F4] border-2 border-[#F0E8DF] flex items-center justify-center text-lg text-[#3D3229] hover:bg-[#F5EDE4] hover:border-[#D4956A] hover:text-[#A85D32] transition-all cursor-pointer shadow-xs"
                title={t('modal.close', 'Close Modal')}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Specifications Chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-[#F5EDE4] px-3.5 py-1.5 rounded-full text-xs font-medium text-[#3D3229] flex items-center gap-1.5">
                <i className="fa-solid fa-ruler text-[#C2784A]"></i> {tile.size} cm
              </span>
              <span className="bg-[#F5EDE4] px-3.5 py-1.5 rounded-full text-xs font-medium text-[#3D3229] flex items-center gap-1.5 capitalize">
                <i className="fa-solid fa-palette text-[#C2784A]"></i> {tile.color}
              </span>
              {tile.specs?.thickness && (
                <span className="bg-[#F5EDE4] px-3.5 py-1.5 rounded-full text-xs font-medium text-[#3D3229] flex items-center gap-1.5">
                  <i className="fa-solid fa-layer-group text-[#C2784A]"></i>{' '}
                  {tile.specs.thickness}
                </span>
              )}
              {tile.specs?.finish && (
                <span className="bg-[#F5EDE4] px-3.5 py-1.5 rounded-full text-xs font-medium text-[#3D3229] flex items-center gap-1.5">
                  <i className="fa-solid fa-spray-can-sparkles text-[#C2784A]"></i>{' '}
                  {tile.specs.finish}
                </span>
              )}
              {tile.specs?.slipResistance && (
                <span className="bg-[#F5EDE4] px-3.5 py-1.5 rounded-full text-xs font-medium text-[#3D3229] flex items-center gap-1.5">
                  <i className="fa-solid fa-grip text-[#C2784A]"></i>{' '}
                  {tile.specs.slipResistance}
                </span>
              )}
              {tile.specs?.usage && (
                <span className="bg-[#F5EDE4] px-3.5 py-1.5 rounded-full text-xs font-medium text-[#3D3229] flex items-center gap-1.5">
                  <i className="fa-solid fa-check-circle text-[#C2784A]"></i>{' '}
                  {tile.specs.usage}
                </span>
              )}
            </div>

            {/* Tile Description */}
            <p className="text-[#6B5D51] text-sm sm:text-base leading-relaxed mb-6">
              {tile.description}
            </p>

            {/* CONDITIONAL PDF DOWNLOAD BUTTON (Shown only when tile has a pdfUrl) */}
            {tile.pdfUrl && (
              <div className="mb-8">
                <a
                  href={tile.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-[#FDFAF6] border-2 border-[#E8DDD4] hover:border-[#C2784A] text-[#3D3229] hover:text-[#C2784A] rounded-full text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer group"
                >
                  <i className="fa-solid fa-file-pdf text-[#C2784A] group-hover:scale-110 transition-transform text-base"></i>
                  <span>{t('modal.downloadPdf', 'Download Specification Sheet (PDF)')}</span>
                  <i className="fa-solid fa-arrow-down text-xs text-[#A89885] group-hover:text-[#C2784A] transition-colors"></i>
                </a>
              </div>
            )}

            {/* ORIENTATIONS (Images, maximum 4 per tile) */}
            {orientationsList.length > 0 && (
              <div className="mb-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D3229] mb-3 flex items-center gap-1.5">
                  <span>📐</span> {t('modal.orientationPatterns', 'Orientation Patterns')}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {orientationsList.map((pattern, idx) => {
                    const name =
                      typeof pattern === 'object'
                        ? pattern.name
                        : `Pattern ${idx + 1}`;
                    const imgSrc =
                      typeof pattern === 'object' ? pattern.image : pattern;

                    return (
                      <div key={idx} className="text-center group">
                        <div
                          onClick={() =>
                            setFullscreenImage({
                              src: imgSrc,
                              alt: `${tile.name} - ${name}`,
                              title: `${tile.name} (${name})`,
                            })
                          }
                          className="aspect-square rounded-xl border-2 border-[#F0E8DF] hover:border-[#C2784A] overflow-hidden bg-[#FAF7F4] shadow-xs cursor-pointer relative transition-all"
                          title={`${t('modal.clickToExpand', 'Click to expand')} ${name}`}
                        >
                          <img
                            src={imgSrc}
                            alt={`${tile.name} - ${name}`}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <p className="text-xs font-medium text-[#6B5D51] mt-1.5 truncate">
                          {name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* INSTALLATION MOCKUPS (Clickable for full screen) */}
            {mockupsList.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D3229] mb-3 flex items-center gap-1.5">
                  <span>🖼️</span> {t('modal.installationMockups', 'Installation Mockups')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {mockupsList.map((mockup, i) => {
                    const imgSrc =
                      typeof mockup === 'object'
                        ? mockup.image
                        : typeof mockup === 'string' && mockup.startsWith('http')
                        ? mockup
                        : `https://picsum.photos/seed/${mockup}/800/600`;
                    const label =
                      (typeof mockup === 'object' ? mockup.label : null) ||
                      mockupLabels[i] ||
                      `Mockup ${i + 1}`;

                    return (
                      <div
                        key={i}
                        onClick={() =>
                          setFullscreenImage({
                            src: imgSrc,
                            alt: `${tile.name} - ${label}`,
                            title: `${tile.name} - ${label}`,
                          })
                        }
                        className="aspect-[4/3] rounded-xl overflow-hidden bg-[#F5EDE4] relative border border-[#F0E8DF] shadow-xs group cursor-pointer"
                        title={`${t('modal.clickToViewFullscreen', 'Click to view full screen')}: ${label}`}
                      >
                        <img
                          src={imgSrc}
                          alt={`${tile.name} - ${label}`}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                          className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute bottom-0 inset-x-0 p-2 bg-[#3D3229]/75 text-white text-[11px] text-center font-medium tracking-wide">
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX IMAGE VIEWER (For Main Tile, Mockups & Orientations) */}
      {fullscreenImage && (
        <div
          onClick={() => setFullscreenImage(null)}
          className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-slide-in select-none"
        >
          {/* Top Exit / Close Button */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
            <button
              onClick={() => setFullscreenImage(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-[#C2784A] text-white border border-white/25 hover:border-[#C2784A] text-xs sm:text-sm font-semibold backdrop-blur-sm transition-all cursor-pointer shadow-lg"
              title={`${t('modal.exitFullscreen', 'Exit Fullscreen')} (Esc)`}
            >
              <i className="fa-solid fa-xmark text-base"></i>
              <span>{t('modal.exitFullscreen', 'Exit Fullscreen')}</span>
            </button>
          </div>

          {/* Fullscreen Image Content */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-[95vw] max-h-[85vh] flex flex-col items-center justify-center"
          >
            <img
              src={fullscreenImage.src}
              alt={fullscreenImage.alt || 'Tile Fullscreen'}
              className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-xl shadow-2xl border border-white/10"
            />
            {fullscreenImage.title && (
              <p className="text-white/90 text-xs sm:text-sm font-medium mt-3 text-center px-4 py-1.5 bg-black/50 rounded-full backdrop-blur-xs">
                {fullscreenImage.title}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
