import React, { useEffect } from 'react';

export default function TileModal({ tile, onClose }) {
  useEffect(() => {
    if (!tile) return;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [tile, onClose]);

  if (!tile) return null;

  const mockupLabels = [
    'Room Installation',
    'Bathroom Mockup',
    'Kitchen View',
    'Close-up Detail',
  ];

  const patternTypes = [
    { name: 'Straight Lay', cells: 36, cols: 6, mode: 'straight' },
    { name: 'Diagonal', cells: 36, cols: 6, mode: 'diagonal' },
    { name: 'Herringbone', cells: 64, cols: 8, mode: 'herringbone' },
    { name: 'Basketweave', cells: 36, cols: 6, mode: 'basket' },
  ];

  const baseColor = tile.colors[0];
  const altColor = tile.colors[2] || tile.colors[0];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[200] bg-[#3D3229]/50 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-slide-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-[900px] w-full max-h-[85vh] overflow-y-auto shadow-2xl relative p-6 sm:p-10 animate-modal-slide-up text-[#3D3229]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-0 float-right z-20 w-10 h-10 rounded-full bg-white border-2 border-[#F0E8DF] flex items-center justify-center text-lg text-[#3D3229] hover:bg-[#F5EDE4] hover:border-[#D4956A] hover:text-[#A85D32] transition-all cursor-pointer shadow-xs"
          title="Close Modal"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Modal Header */}
        <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-[#3D3229] mb-1">
          {tile.name}
        </h2>
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#C2784A] mb-6">
          {tile.brand} &nbsp;·&nbsp; {tile.type.charAt(0).toUpperCase() + tile.type.slice(1)}
        </p>

        {/* Specs Chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="bg-[#F5EDE4] px-3.5 py-1.5 rounded-full text-xs font-medium text-[#3D3229] flex items-center gap-1.5">
            <i className="fa-solid fa-ruler text-[#C2784A]"></i> {tile.size} cm
          </span>
          <span className="bg-[#F5EDE4] px-3.5 py-1.5 rounded-full text-xs font-medium text-[#3D3229] flex items-center gap-1.5 capitalize">
            <i className="fa-solid fa-palette text-[#C2784A]"></i> {tile.color}
          </span>
          <span className="bg-[#F5EDE4] px-3.5 py-1.5 rounded-full text-xs font-medium text-[#3D3229] flex items-center gap-1.5">
            <i className="fa-solid fa-layer-group text-[#C2784A]"></i> {tile.specs.thickness}
          </span>
          <span className="bg-[#F5EDE4] px-3.5 py-1.5 rounded-full text-xs font-medium text-[#3D3229] flex items-center gap-1.5">
            <i className="fa-solid fa-spray-can-sparkles text-[#C2784A]"></i> {tile.specs.finish}
          </span>
          <span className="bg-[#F5EDE4] px-3.5 py-1.5 rounded-full text-xs font-medium text-[#3D3229] flex items-center gap-1.5">
            <i className="fa-solid fa-grip text-[#C2784A]"></i> {tile.specs.slipResistance}
          </span>
          <span className="bg-[#F5EDE4] px-3.5 py-1.5 rounded-full text-xs font-medium text-[#3D3229] flex items-center gap-1.5">
            <i className="fa-solid fa-check-circle text-[#C2784A]"></i> {tile.specs.usage}
          </span>
        </div>

        {/* Description */}
        <p className="text-[#6B5D51] text-sm sm:text-base leading-relaxed mb-8">
          {tile.description}
        </p>

        {/* Orientation Patterns */}
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D3229] mb-3 flex items-center gap-1.5">
          <span>📐</span> Orientation Patterns
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {patternTypes.map((p, idx) => {
            const side = Math.sqrt(p.cells);
            const cellsArray = Array.from({ length: p.cells });

            return (
              <div key={idx} className="text-center">
                <div
                  className="aspect-square rounded-lg border-2 border-[#F0E8DF] overflow-hidden grid gap-[1px] bg-[#F0E8DF]"
                  style={{
                    gridTemplateColumns: `repeat(${side}, 1fr)`,
                    gridTemplateRows: `repeat(${side}, 1fr)`,
                  }}
                >
                  {cellsArray.map((_, i) => {
                    const row = Math.floor(i / side);
                    const col = i % side;
                    let color = baseColor;

                    if (p.mode === 'diagonal' && (row + col) % 3 === 0) {
                      color = altColor;
                    } else if (
                      p.mode === 'herringbone' &&
                      (row % 4 < 2 ? col % 2 : (col + 1) % 2) === 0
                    ) {
                      color = altColor;
                    } else if (
                      p.mode === 'basket' &&
                      (Math.floor(row / 2) + Math.floor(col / 2)) % 2 === 0
                    ) {
                      color = altColor;
                    } else if (
                      p.mode === 'straight' &&
                      (row + col) % 2 === 0
                    ) {
                      color = altColor;
                    }

                    return (
                      <span
                        key={i}
                        style={{
                          backgroundColor: color,
                          opacity: 0.8 + (i % 5) * 0.04,
                        }}
                        className="rounded-[1px]"
                      />
                    );
                  })}
                </div>
                <p className="text-xs font-medium text-[#A89885] mt-1.5">
                  {p.name}
                </p>
              </div>
            );
          })}
        </div>

        {/* Installation Mockups */}
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D3229] mb-3 flex items-center gap-1.5">
          <span>🖼️</span> Installation Mockups
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {tile.mockupSeeds.map((seed, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-xl overflow-hidden bg-[#F5EDE4] relative border border-[#F0E8DF] shadow-xs group"
            >
              <img
                src={`https://picsum.photos/seed/${seed}/600/400`}
                alt={`${tile.name} - ${mockupLabels[i] || 'Mockup'}`}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-0 inset-x-0 p-2 bg-[#3D3229]/75 text-white text-[11px] text-center font-medium tracking-wide">
                {mockupLabels[i] || `View ${i + 1}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
