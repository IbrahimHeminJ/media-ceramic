import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { tilesData } from '../data/tilesData';

export default function Tiles({ tiles = tilesData, onSelectTile }) {
  const { t } = useTranslation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filters, setFilters] = useState({
    size: 'all',
    color: 'all',
    type: 'all',
    brand: 'all',
    name: '',
  });

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const resetFilters = () => {
    setFilters({
      size: 'all',
      color: 'all',
      type: 'all',
      brand: 'all',
      name: '',
    });
  };

  const filteredTiles = useMemo(() => {
    return (tiles || tilesData).filter((tile) => {
      if (filters.size !== 'all' && tile.size !== filters.size) return false;
      if (filters.color !== 'all' && tile.color !== filters.color) return false;
      if (filters.type !== 'all' && tile.type !== filters.type) return false;
      if (
        filters.brand !== 'all' &&
        tile.brand.toLowerCase() !== filters.brand.toLowerCase()
      )
        return false;
      if (filters.name) {
        const query = filters.name.toLowerCase().trim();
        const matchesName = tile.name.toLowerCase().includes(query);
        const matchesBrand = tile.brand.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand) return false;
      }
      return true;
    });
  }, [filters, tiles]);

  const sizeOptions = ['all', '30x30', '60x60', '30x60', '20x120'];
  const colorOptions = [
    { value: 'all', label: t('tiles.allColors', 'All Colors') },
    { value: 'white', label: t('tiles.colors.white', 'White'), hex: '#f5f2ed' },
    { value: 'beige', label: t('tiles.colors.beige', 'Beige'), hex: '#d9c8b4' },
    { value: 'gray', label: t('tiles.colors.gray', 'Gray'), hex: '#5c554d' },
    { value: 'brown', label: t('tiles.colors.brown', 'Brown'), hex: '#b8957a' },
    { value: 'terracotta', label: t('tiles.colors.terracotta', 'Terracotta'), hex: '#c2784a' },
  ];
  const typeOptions = ['all', 'porcelain', 'ceramic', 'marble', 'terrazzo'];
  const brandOptions = [
    'all',
    'terra tile co.',
    'marazzi',
    'florim',
    'casalgrande',
  ];

  return (
    <section className="animate-fade-slide-in flex-1 max-w-[1400px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* HEADER */}
      <div className="text-center mb-6 sm:mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C2784A] block mb-2">
          {t('tiles.badge', 'Our Collection')}
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#3D3229] tracking-tight mb-4">
          {t('tiles.title', 'Find your perfect tile.')}
        </h2>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="inline-flex items-center gap-2 px-5 py-2 bg-white border-2 border-[#F0E8DF] rounded-full font-semibold text-sm text-[#3D3229] hover:border-[#D4956A] hover:bg-[#FDFAF6] hover:text-[#A85D32] transition-all cursor-pointer shadow-xs"
        >
          <i className="fa-solid fa-sliders text-sm"></i> Toggle Filters
        </button>
      </div>

      {/* LAYOUT GRID */}
      <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
        {/* SIDEBAR FILTERS */}
        <aside
          className={`w-full md:w-64 bg-white rounded-2xl border border-[#F0E8DF] p-5 shadow-xs transition-all duration-300 ${
            sidebarCollapsed
              ? 'hidden md:hidden'
              : 'block md:sticky md:top-20 md:max-h-[calc(100vh-100px)] md:overflow-y-auto'
          }`}
        >
          {/* Search Filter */}
          <div className="mb-6">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-2">
              {t('tiles.search', 'Search')}
            </label>
            <input
              type="text"
              placeholder={t('tiles.searchPlaceholder', 'Search by name...')}
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-[#F0E8DF] rounded-full text-sm bg-[#FAF7F4] focus:outline-none focus:border-[#D4956A] text-[#3D3229] transition-all"
            />
          </div>

          {/* Size Filter */}
          <div className="mb-6">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-2">
              {t('tiles.size', 'Size')}
            </label>
            <div className="space-y-1.5">
              {sizeOptions.map((sz) => {
                const isActive = filters.size === sz;
                const label = sz === 'all' ? t('tiles.allSizes', 'All Sizes') : `${sz.replace('x', '×')} cm`;
                return (
                  <button
                    key={sz}
                    onClick={() => handleFilterChange('size', sz)}
                    className={`w-full text-left px-4 py-2 rounded-full text-xs font-medium border-2 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#C2784A] text-white border-[#C2784A] font-semibold'
                        : 'bg-white text-[#6B5D51] border-[#F0E8DF] hover:border-[#D4956A] hover:text-[#A85D32] hover:bg-[#FDFAF6]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Filter */}
          <div className="mb-6">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-2">
              {t('tiles.color', 'Color')}
            </label>
            <div className="space-y-1.5">
              {colorOptions.map((c) => {
                const isActive = filters.color === c.value;
                return (
                  <button
                    key={c.value}
                    onClick={() => handleFilterChange('color', c.value)}
                    className={`w-full text-left flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border-2 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#C2784A] text-white border-[#C2784A] font-semibold'
                        : 'bg-white text-[#6B5D51] border-[#F0E8DF] hover:border-[#D4956A] hover:text-[#A85D32] hover:bg-[#FDFAF6]'
                    }`}
                  >
                    {c.hex && (
                      <span
                        className="w-4 h-4 rounded-full border border-white/50 shadow-xs shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                    )}
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Type Filter */}
          <div className="mb-6">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-2">
              {t('tiles.type', 'Type')}
            </label>
            <div className="space-y-1.5">
              {typeOptions.map((tKey) => {
                const isActive = filters.type === tKey;
                const label =
                  tKey === 'all'
                    ? t('tiles.allTypes', 'All Types')
                    : t(`tiles.types.${tKey}`, tKey.charAt(0).toUpperCase() + tKey.slice(1));
                return (
                  <button
                    key={tKey}
                    onClick={() => handleFilterChange('type', tKey)}
                    className={`w-full text-left px-4 py-2 rounded-full text-xs font-medium border-2 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#C2784A] text-white border-[#C2784A] font-semibold'
                        : 'bg-white text-[#6B5D51] border-[#F0E8DF] hover:border-[#D4956A] hover:text-[#A85D32] hover:bg-[#FDFAF6]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="mb-6">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-2">
              {t('tiles.brand', 'Brand')}
            </label>
            <div className="space-y-1.5">
              {brandOptions.map((b) => {
                const isActive = filters.brand === b;
                const label =
                  b === 'all'
                    ? t('tiles.allBrands', 'All Brands')
                    : b
                        .split(' ')
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(' ');
                return (
                  <button
                    key={b}
                    onClick={() => handleFilterChange('brand', b)}
                    className={`w-full text-left px-4 py-2 rounded-full text-xs font-medium border-2 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#C2784A] text-white border-[#C2784A] font-semibold'
                        : 'bg-white text-[#6B5D51] border-[#F0E8DF] hover:border-[#D4956A] hover:text-[#A85D32] hover:bg-[#FDFAF6]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border-2 border-[#E8DDD4] bg-[#FAF7F4] text-[#6B5D51] hover:bg-[#E8D5C4] hover:text-[#A85D32] hover:border-[#D4956A] font-semibold text-xs transition-all cursor-pointer"
          >
            <i className="fa-solid fa-rotate-left"></i> {t('tiles.resetFilters', 'Reset Filters')}
          </button>
        </aside>

        {/* MAIN TILES GRID */}
        <main className="flex-1 w-full min-w-0">
          {filteredTiles.length === 0 ? (
            <div className="text-center py-16 px-4 text-[#A89885]">
              <i className="fa-solid fa-magnifying-glass text-4xl mb-4 text-[#E8DDD4] block"></i>
              <p className="text-base">
                {t('tiles.noMatchTitle', 'No tiles match your filters.')}<br />
                {t('tiles.noMatchSubtitle', 'Try adjusting your criteria.')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-16">
              {filteredTiles.map((tile) => (
                <div
                  key={tile.id}
                  onClick={() => onSelectTile(tile)}
                  className="group bg-white rounded-2xl overflow-hidden cursor-pointer border border-[#F0E8DF] hover:border-[#E8DDD4] shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative"
                  title={t('tiles.clickForDetails', 'Click for details')}
                >
                  {/* Badge */}
                  {tile.badge && (
                    <span
                      className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm text-white ${
                        tile.badge === 'new'
                          ? 'bg-[#2E7D32]'
                          : tile.badge === 'featured'
                          ? 'bg-[#F9A825] text-[#3D3229]'
                          : 'bg-[#E53935]'
                      }`}
                    >
                      {t(`tiles.badges.${tile.badge}`, tile.badge)}
                    </span>
                  )}

                  {/* Tile Swatch Image Box - displays tile image from backend/data */}
                  <div className="aspect-square relative overflow-hidden bg-[#FAF7F4] flex items-center justify-center">
                    <img
                      src={tile.image || `https://picsum.photos/seed/${tile.id}-tile/600/600`}
                      alt={tile.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    <h3 className="font-serif text-lg font-semibold text-[#3D3229] mb-2 group-hover:text-[#C2784A] transition-colors">
                      {tile.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 text-xs text-[#A89885]">
                      <span className="bg-[#F5EDE4] text-[#6B5D51] px-2.5 py-0.5 rounded-full font-medium">
                        {tile.size} cm
                      </span>
                      <span className="bg-[#F5EDE4] text-[#6B5D51] px-2.5 py-0.5 rounded-full font-medium capitalize">
                        {tile.type}
                      </span>
                      <span className="bg-[#F5EDE4] text-[#6B5D51] px-2.5 py-0.5 rounded-full font-medium">
                        {tile.brand}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </section>
  );
}
