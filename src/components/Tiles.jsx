import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { resolveAssetUrl } from '../api/client';

const FIXED_SIZES = [
  '10x10', '10x20', '15x15', '20x20', '30x30', '30x60',
  '40x40', '45x45', '60x60', '60x120', '80x80', '120x120',
];
const FIXED_TYPES = [
  'ceramic', 'porcelain', 'marble', 'granite', 'travertine', 'slate',
  'mosaic', 'glass', 'terrazzo', 'quarry', 'cement', 'limestone',
];
const FIXED_COLORS = [
  'white', 'gray', 'beige', 'black', 'cream', 'charcoal',
  'brown', 'taupe', 'blue', 'green', 'terracotta',
];
const COLOR_HEX = {
  white: '#F5F2ED',
  gray: '#5C554D',
  beige: '#D9C8B4',
  black: '#211D19',
  cream: '#F2E8D5',
  charcoal: '#3A352F',
  brown: '#B8957A',
  taupe: '#A89885',
  blue: '#7A92A3',
  green: '#8A9678',
  terracotta: '#C2784A',
};

function titleCase(value) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

/** Best-effort check for whether a raw string is a browser-recognized CSS color (e.g. "gold", "ivory"). */
function isValidCssColor(value) {
  if (typeof document === 'undefined') return false;
  const el = document.createElement('option');
  el.style.color = '';
  el.style.color = value;
  return el.style.color !== '';
}

/**
 * Distinct values of `field` across `tiles` that don't already (case-insensitively)
 * match one of `fixedList`'s entries — used to extend Size/Type filter options with
 * whatever an admin has actually entered beyond the curated list, sorted A-Z.
 */
function collectUniqueExtras(tiles, field, fixedList) {
  const fixedLower = new Set(fixedList.map((v) => v.toLowerCase()));
  const seen = new Map(); // lowercase -> first-seen original casing
  (tiles || []).forEach((tile) => {
    const raw = (tile[field] || '').trim();
    if (!raw) return;
    const lower = raw.toLowerCase();
    if (fixedLower.has(lower)) return;
    if (!seen.has(lower)) seen.set(lower, raw);
  });
  return [...seen.values()].sort((a, b) => a.localeCompare(b));
}

/**
 * Distinct brand values across `tiles`, deduped case-insensitively against a
 * 'media' baseline that's always present even when the catalog is empty/new.
 */
function collectBrandOptions(tiles) {
  const seen = new Map();
  seen.set('media', 'media');
  (tiles || []).forEach((tile) => {
    const raw = (tile.brand || '').trim();
    if (!raw) return;
    const lower = raw.toLowerCase();
    if (!seen.has(lower)) seen.set(lower, raw);
  });
  const rest = [...seen.entries()]
    .filter(([lower]) => lower !== 'media')
    .map(([, raw]) => raw)
    .sort((a, b) => a.localeCompare(b));
  return ['media', ...rest];
}

/**
 * A tile's free-text `color` field (e.g. "golden white", "white, grey, blue") is
 * matched against the fixed palette by substring, not equality — see filteredTiles.
 * Any tile whose color text contains NONE of the fixed words gets its raw color
 * text added here as its own filter option, so it stays findable.
 */
function collectColorExtras(tiles, fixedColors) {
  const seen = new Map(); // lowercase value -> display label
  (tiles || []).forEach((tile) => {
    const raw = (tile.color || '').trim();
    if (!raw) return;
    const lower = raw.toLowerCase();
    const matchesFixed = fixedColors.some((c) => lower.includes(c));
    if (matchesFixed) return;
    if (!seen.has(lower)) seen.set(lower, raw);
  });
  return [...seen.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([value, raw]) => ({ value, label: titleCase(raw) }));
}

/**
 * Filter controls component.
 * Can be rendered vertically (for desktop sidebar) or in a multi-column grid (for mobile/tablet expandable section).
 */
function FilterControls({
  filters,
  onFilterChange,
  onReset,
  sizeOptions,
  colorOptions,
  typeOptions,
  brandOptions,
  t,
  layout = 'vertical',
  showResetButton = true,
}) {
  const isGrid = layout === 'grid';

  return (
    <div className={isGrid ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6' : 'space-y-6'}>
      {/* Search Filter */}
      <div className={isGrid ? 'sm:col-span-2 md:col-span-3' : ''}>
        <label className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-2">
          {t('tiles.search', 'Search')}
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder={t('tiles.searchPlaceholder', 'Search by name...')}
            value={filters.name}
            onChange={(e) => onFilterChange('name', e.target.value)}
            className="w-full ps-10 pe-10 py-2.5 border-2 border-[#F0E8DF] rounded-full text-sm bg-[#FAF7F4] focus:outline-none focus:border-[#D4956A] text-[#3D3229] transition-all"
          />
          <span className="absolute start-3.5 top-1/2 -translate-y-1/2 text-[#A89885] pointer-events-none text-xs">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
          {filters.name && (
            <button
              type="button"
              onClick={() => onFilterChange('name', '')}
              aria-label={t('tiles.clearSearch', 'Clear search')}
              className="absolute end-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#E8DDD4] hover:bg-[#D4956A] hover:text-white text-[#6B5D51] flex items-center justify-center text-xs transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-2">
          {t('tiles.size', 'Size')}
        </label>
        <div className="space-y-1.5">
          {sizeOptions.map((sz) => {
            const isActive = filters.size === sz;
            const label =
              sz === 'all'
                ? t('tiles.allSizes', 'All Sizes')
                : `${sz.replace('x', '×')} cm`;
            return (
              <button
                key={sz}
                type="button"
                onClick={() => onFilterChange('size', sz)}
                className={`w-full text-start px-4 py-2 rounded-full text-xs font-medium border-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#C2784A] text-white border-[#C2784A] font-semibold shadow-xs'
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
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-2">
          {t('tiles.color', 'Color')}
        </label>
        <div className="space-y-1.5">
          {colorOptions.map((c) => {
            const isActive = filters.color === c.value;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => onFilterChange('color', c.value)}
                className={`w-full text-start flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-medium border-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#C2784A] text-white border-[#C2784A] font-semibold shadow-xs'
                    : 'bg-white text-[#6B5D51] border-[#F0E8DF] hover:border-[#D4956A] hover:text-[#A85D32] hover:bg-[#FDFAF6]'
                }`}
              >
                {c.hex && (
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-xs shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                )}
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Type Filter */}
      <div>
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
                type="button"
                onClick={() => onFilterChange('type', tKey)}
                className={`w-full text-start px-4 py-2 rounded-full text-xs font-medium border-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#C2784A] text-white border-[#C2784A] font-semibold shadow-xs'
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
      <div className={isGrid ? 'sm:col-span-2 md:col-span-3' : ''}>
        <label className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-2">
          {t('tiles.brand', 'Brand')}
        </label>
        <div className={isGrid ? 'flex flex-wrap gap-2' : 'space-y-1.5'}>
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
                type="button"
                onClick={() => onFilterChange('brand', b)}
                className={`${
                  isGrid ? 'px-4 py-2 text-xs font-medium rounded-full' : 'w-full text-start px-4 py-2 rounded-full text-xs font-medium'
                } border-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#C2784A] text-white border-[#C2784A] font-semibold shadow-xs'
                    : 'bg-white text-[#6B5D51] border-[#F0E8DF] hover:border-[#D4956A] hover:text-[#A85D32] hover:bg-[#FDFAF6]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset Filters (shown in Desktop sidebar) */}
      {showResetButton && !isGrid && (
        <button
          type="button"
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border-2 border-[#E8DDD4] bg-[#FAF7F4] text-[#6B5D51] hover:bg-[#E8D5C4] hover:text-[#A85D32] hover:border-[#D4956A] font-semibold text-xs transition-all cursor-pointer"
        >
          <i className="fa-solid fa-rotate-left"></i> {t('tiles.resetFilters', 'Reset Filters')}
        </button>
      )}
    </div>
  );
}

export default function Tiles({ tiles = [], onSelectTile }) {
  const { t } = useTranslation();

  // Mobile/Tablet expandable section state (hidden by default on screens < 1024px)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Desktop sidebar visibility state (visible by default on PC screens >= 1024px)
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

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

  // Toggle handler:
  // On screens < 1024px (mobile & tablet), moves the inline filter section down/up.
  // On screens >= 1024px (PC screen), collapses/expands the left sidebar.
  const handleToggleFilters = () => {
    if (window.innerWidth < 1024) {
      setMobileFiltersOpen((prev) => !prev);
    } else {
      setDesktopSidebarOpen((prev) => !prev);
    }
  };

  // Count active filters (excluding 'all' and empty search)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.size !== 'all') count++;
    if (filters.color !== 'all') count++;
    if (filters.type !== 'all') count++;
    if (filters.brand !== 'all') count++;
    if (filters.name && filters.name.trim() !== '') count++;
    return count;
  }, [filters]);

  const filteredTiles = useMemo(() => {
    return (tiles || []).filter((tile) => {
      if (filters.size !== 'all' && tile.size.toLowerCase() !== filters.size.toLowerCase()) return false;
      if (filters.color !== 'all' && !tile.color.toLowerCase().includes(filters.color.toLowerCase())) return false;
      if (filters.type !== 'all' && tile.type.toLowerCase() !== filters.type.toLowerCase()) return false;
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

  const sizeOptions = useMemo(
    () => ['all', ...FIXED_SIZES, ...collectUniqueExtras(tiles, 'size', FIXED_SIZES)],
    [tiles]
  );
  const typeOptions = useMemo(
    () => ['all', ...FIXED_TYPES, ...collectUniqueExtras(tiles, 'type', FIXED_TYPES)],
    [tiles]
  );
  const brandOptions = useMemo(() => ['all', ...collectBrandOptions(tiles)], [tiles]);
  const colorOptions = useMemo(() => {
    const fixed = FIXED_COLORS.map((value) => ({
      value,
      label: t(`tiles.colors.${value}`, titleCase(value)),
      hex: COLOR_HEX[value],
    }));
    const extras = collectColorExtras(tiles, FIXED_COLORS).map(({ value, label }) => ({
      value,
      label,
      hex: isValidCssColor(value) ? value : undefined,
    }));
    return [{ value: 'all', label: t('tiles.allColors', 'All Colors') }, ...fixed, ...extras];
  }, [tiles, t]);

  return (
    <section className="animate-fade-slide-in flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* HEADER */}
      <div className="text-center mb-6 sm:mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C2784A] block mb-2">
          {t('tiles.badge', 'Our Collection')}
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#3D3229] tracking-tight mb-2">
          {t('tiles.title', 'Find your perfect tile.')}
        </h2>
        <p className="text-xs sm:text-sm pt-4 text-[#8C7D6F] mb-5">
          {t('tiles.showingResults', {
            count: filteredTiles.length,
            defaultValue: `Showing ${filteredTiles.length} tiles`,
          })}
        </p>

        {/* Toggle Filters Button */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleToggleFilters}
            aria-expanded={mobileFiltersOpen || desktopSidebarOpen}
            className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full font-semibold text-sm transition-all cursor-pointer shadow-xs border-2 ${
              activeFilterCount > 0 || mobileFiltersOpen
                ? 'bg-[#FDFAF6] border-[#C2784A] text-[#A85D32] shadow-sm'
                : 'bg-white border-[#F0E8DF] text-[#3D3229] hover:border-[#D4956A] hover:bg-[#FDFAF6] hover:text-[#A85D32]'
            }`}
          >
            <i className="fa-solid fa-sliders text-sm"></i>
            <span>{t('tiles.toggleFilters', 'Filters')}</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#C2784A] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                {activeFilterCount}
              </span>
            )}
            {/* Dynamic arrow indicating down or up motion for mobile/tablet */}
            <i
              className={`fa-solid ${
                mobileFiltersOpen ? 'fa-chevron-up text-[#C2784A]' : 'fa-chevron-down text-[#A89885]'
              } text-xs transition-transform duration-200 lg:hidden`}
            ></i>
          </button>
        </div>

        {/* Active Filter Quick-Chips Bar */}
        {activeFilterCount > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
            <span className="text-xs font-medium text-[#A89885] me-1">
              {t('tiles.activeFilters', 'Active Filters')}:
            </span>

            {filters.name && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white border border-[#E8DDD4] text-[#6B5D51] shadow-xs">
                <span>"{filters.name}"</span>
                <button
                  type="button"
                  onClick={() => handleFilterChange('name', '')}
                  className="hover:text-[#C2784A] cursor-pointer text-[10px]"
                  title={t('tiles.clearSearch', 'Clear search')}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </span>
            )}

            {filters.size !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white border border-[#E8DDD4] text-[#6B5D51] shadow-xs">
                <span>{filters.size.replace('x', '×')} cm</span>
                <button
                  type="button"
                  onClick={() => handleFilterChange('size', 'all')}
                  className="hover:text-[#C2784A] cursor-pointer text-[10px]"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </span>
            )}

            {filters.color !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white border border-[#E8DDD4] text-[#6B5D51] shadow-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                  style={{
                    backgroundColor:
                      colorOptions.find((c) => c.value === filters.color)?.hex ||
                      'transparent',
                  }}
                />
                <span className="capitalize">{filters.color}</span>
                <button
                  type="button"
                  onClick={() => handleFilterChange('color', 'all')}
                  className="hover:text-[#C2784A] cursor-pointer text-[10px]"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </span>
            )}

            {filters.type !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white border border-[#E8DDD4] text-[#6B5D51] shadow-xs">
                <span className="capitalize">{filters.type}</span>
                <button
                  type="button"
                  onClick={() => handleFilterChange('type', 'all')}
                  className="hover:text-[#C2784A] cursor-pointer text-[10px]"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </span>
            )}

            {filters.brand !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white border border-[#E8DDD4] text-[#6B5D51] shadow-xs">
                <span className="capitalize">{filters.brand}</span>
                <button
                  type="button"
                  onClick={() => handleFilterChange('brand', 'all')}
                  className="hover:text-[#C2784A] cursor-pointer text-[10px]"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-[#C2784A] hover:text-[#A85D32] underline cursor-pointer ms-1"
            >
              {t('tiles.clearAll', 'Clear all')}
            </button>
          </div>
        )}
      </div>

      {/* MOBILE & TABLET EXPANDABLE FILTER SECTION (< 1024px) */}
      {/* Expands DOWN when toggled open, pushing the content down; collapses UP when toggled closed */}
      {mobileFiltersOpen && (
        <div className="lg:hidden w-full bg-white rounded-2xl border border-[#F0E8DF] p-5 sm:p-6 shadow-sm mb-8 animate-filter-slide-down">
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#F0E8DF]">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-[#FAF7F4] border border-[#F0E8DF] flex items-center justify-center text-[#C2784A] text-sm">
                <i className="fa-solid fa-sliders"></i>
              </span>
              <h3 className="font-serif text-lg font-semibold text-[#3D3229]">
                {t('tiles.filtersTitle', 'Filters')}
              </h3>
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#C2784A] text-white">
                  {activeFilterCount}
                </span>
              )}
            </div>
            {/* Close / Collapse Up button */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              aria-label={t('tiles.closeFilters', 'Close filters')}
              className="w-8 h-8 rounded-full bg-[#FAF7F4] hover:bg-[#F0E8DF] text-[#6B5D51] hover:text-[#3D3229] flex items-center justify-center text-xs transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-chevron-up"></i>
            </button>
          </div>

          <FilterControls
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
            sizeOptions={sizeOptions}
            colorOptions={colorOptions}
            typeOptions={typeOptions}
            brandOptions={brandOptions}
            t={t}
            layout="grid"
            showResetButton={false}
          />

          {/* Action Row */}
          <div className="mt-6 pt-4 border-t border-[#F0E8DF] flex flex-wrap items-center justify-end gap-3">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 rounded-full border-2 border-[#E8DDD4] bg-[#FAF7F4] hover:bg-[#E8D5C4] text-[#6B5D51] font-semibold text-xs transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-rotate-left me-1"></i> {t('tiles.resetFilters', 'Reset')}
              </button>
            )}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="px-6 py-2.5 rounded-full bg-[#C2784A] hover:bg-[#A85D32] text-white font-semibold text-xs transition-all cursor-pointer shadow-xs flex items-center gap-2"
            >
              <span>
                {t('tiles.showResults', {
                  count: filteredTiles.length,
                  defaultValue: `Show ${filteredTiles.length} Tiles`,
                })}
              </span>
              <i className="fa-solid fa-chevron-up text-[10px]"></i>
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      {/* w-full ensures that whether 0 or 100 tiles match, the sidebar stays fixed on the left and NEVER shifts to the center */}
      <div className="w-full flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
        {/* DESKTOP SIDEBAR FILTERS (Fixed on the left on PC screen >= 1024px; never appears on mobile/tablet) */}
        <aside
          className={`hidden transition-all duration-300 ${
            desktopSidebarOpen
              ? 'lg:block lg:w-68 xl:w-72 bg-white rounded-2xl border border-[#F0E8DF] p-5 shadow-xs lg:sticky lg:top-20 lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto shrink-0'
              : 'lg:hidden'
          }`}
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F0E8DF]">
            <h3 className="font-serif text-lg font-semibold text-[#3D3229] flex items-center gap-2">
              <i className="fa-solid fa-sliders text-[#C2784A] text-sm"></i>
              <span>{t('tiles.filtersTitle', 'Filters')}</span>
            </h3>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FAF7F4] text-[#C2784A] border border-[#F0E8DF]">
                {activeFilterCount}
              </span>
            )}
          </div>

          <FilterControls
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
            sizeOptions={sizeOptions}
            colorOptions={colorOptions}
            typeOptions={typeOptions}
            brandOptions={brandOptions}
            t={t}
            layout="vertical"
            showResetButton={true}
          />
        </aside>

        {/* MAIN TILES GRID */}
        <main className="flex-1 w-full min-w-0">
          {filteredTiles.length === 0 ? (
            <div className="w-full text-center py-20 px-4 text-[#A89885] bg-white rounded-2xl border border-[#F0E8DF] p-8">
              <i className="fa-solid fa-magnifying-glass text-4xl mb-4 text-[#E8DDD4] block"></i>
              <p className="text-base font-medium text-[#3D3229] mb-2">
                {t('tiles.noMatchTitle', 'No tiles match your filters.')}
              </p>
              <p className="text-sm text-[#A89885] mb-6">
                {t('tiles.noMatchSubtitle', 'Try adjusting your criteria.')}
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C2784A] text-white font-semibold text-xs hover:bg-[#A85D32] transition-colors cursor-pointer shadow-xs"
              >
                <i className="fa-solid fa-rotate-left"></i> {t('tiles.resetFilters', 'Reset Filters')}
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-6 pb-16 ${
                desktopSidebarOpen
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
                  : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
              }`}
            >
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
                      className={`absolute top-3 start-3 z-10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm text-white ${
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

                  {/* Tile Swatch Image Box */}
                  <div className="aspect-square relative overflow-hidden bg-[#FAF7F4] flex items-center justify-center">
                    <img
                      src={resolveAssetUrl(tile.imagePath) || `https://picsum.photos/seed/${tile.id}-tile/600/600`}
                      alt={tile.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    <h3 className="font-serif text-lg font-semibold text-[#3D3229] mb-2 group-hover:text-[#C2784A] transition-colors line-clamp-1">
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
