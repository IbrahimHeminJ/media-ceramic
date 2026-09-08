import React, { useState, useMemo } from 'react';

/**
 * Predefined Icons catalog for Social Links management.
 * Provides administrators with instant, visual icon selection.
 */
const PRESET_ICONS = [
  { id: 'instagram', label: 'Instagram', icon: 'fa-brands fa-instagram', color: 'text-[#E1306C]' },
  { id: 'pinterest', label: 'Pinterest', icon: 'fa-brands fa-pinterest', color: 'text-[#BD081C]' },
  { id: 'facebook', label: 'Facebook', icon: 'fa-brands fa-facebook', color: 'text-[#1877F2]' },
  { id: 'youtube', label: 'YouTube', icon: 'fa-brands fa-youtube', color: 'text-[#FF0000]' },
  { id: 'tiktok', label: 'TikTok', icon: 'fa-brands fa-tiktok', color: 'text-black' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'fa-brands fa-whatsapp', color: 'text-[#25D366]' },
  { id: 'twitter', label: 'X (Twitter)', icon: 'fa-brands fa-x-twitter', color: 'text-black' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'fa-brands fa-linkedin', color: 'text-[#0A66C2]' },
  { id: 'telegram', label: 'Telegram', icon: 'fa-brands fa-telegram', color: 'text-[#229ED9]' },
  { id: 'discord', label: 'Discord', icon: 'fa-brands fa-discord', color: 'text-[#5865F2]' },
  { id: 'envelope', label: 'Email', icon: 'fa-solid fa-envelope', color: 'text-[#C2784A]' },
  { id: 'globe', label: 'Website', icon: 'fa-solid fa-globe', color: 'text-[#B8754F]' },
  { id: 'phone', label: 'Phone', icon: 'fa-solid fa-phone', color: 'text-[#2E7D32]' },
  { id: 'location', label: 'Showroom', icon: 'fa-solid fa-location-dot', color: 'text-[#C2784A]' },
];

/**
 * Dashboard Component
 *
 * Administrative management interface with:
 * 1. Quick Info Section (Total Tiles, Colors Available, Supplier & Material Diversity)
 * 2. Main Dashboard with 3 Tabs:
 *    - List Tab: Table view, search filter, View Details, Edit Modal, Permanent Remove, and Excel Export.
 *    - Tile Addition Tab: Form to upload media (Main Image, PDF Brochure, up to 4 Orientations) and fill technical specs.
 *    - Social Links Tab: Interface to create and permanently delete social links with icon picker and live preview.
 *
 * Implements HCI UI/UX principles (immediate visual feedback, error prevention, clear hierarchy, undo/cancel controls).
 */
export default function Dashboard({
  user,
  tiles = [],
  socialLinks = [],
  onSelectTile,
  onAddTile,
  onUpdateTile,
  onDeleteTile,
  onAddSocialLink,
  onDeleteSocialLink,
  onLogout,
}) {
  // Active Tab: 'list' | 'add' | 'social'
  const [activeTab, setActiveTab] = useState('list');

  // Search query for List Tab
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [editingTile, setEditingTile] = useState(null);
  const [tileToDelete, setTileToDelete] = useState(null);
  const [socialToDelete, setSocialToDelete] = useState(null);

  // User notification toast state
  const [toastMessage, setToastMessage] = useState(null);

  // Trigger temporary notification toast
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // =========================================================================
  // 1. QUICK INFO METRICS CALCULATION
  // =========================================================================
  const quickMetrics = useMemo(() => {
    const totalTiles = tiles.length;
    const uniqueColors = new Set(
      tiles.map((t) => (t.color || '').toLowerCase().trim()).filter(Boolean)
    ).size;
    const uniqueBrands = new Set(
      tiles.map((t) => (t.brand || '').toLowerCase().trim()).filter(Boolean)
    ).size;
    const uniqueTypes = new Set(
      tiles.map((t) => (t.type || '').toLowerCase().trim()).filter(Boolean)
    ).size;

    return {
      totalTiles,
      totalColors: uniqueColors,
      totalBrands: uniqueBrands,
      totalTypes: uniqueTypes,
      totalSocialLinks: socialLinks.length,
    };
  }, [tiles, socialLinks]);

  // =========================================================================
  // 2. FILTERED TILES FOR LIST TAB
  // =========================================================================
  const filteredTiles = useMemo(() => {
    if (!searchQuery.trim()) return tiles;
    const query = searchQuery.toLowerCase().trim();
    return tiles.filter((tile) => {
      const matchName = (tile.name || '').toLowerCase().includes(query);
      const matchBrand = (tile.brand || '').toLowerCase().includes(query);
      const matchType = (tile.type || '').toLowerCase().includes(query);
      const matchColor = (tile.color || '').toLowerCase().includes(query);
      const matchSize = (tile.size || '').toLowerCase().includes(query);
      return matchName || matchBrand || matchType || matchColor || matchSize;
    });
  }, [tiles, searchQuery]);

  // =========================================================================
  // 3. EXCEL / CSV EXPORT HANDLER
  // =========================================================================
  const handleExportToExcel = () => {
    if (tiles.length === 0) {
      showToast('No tiles available to export.');
      return;
    }

    const headers = [
      'ID',
      'Tile Name',
      'Brand',
      'Size (cm)',
      'Color Category',
      'Material Type',
      'Badge',
      'Thickness',
      'Finish',
      'Slip Resistance',
      'Usage',
      'PDF Specification URL',
      'Main Image URL',
      'Orientations Count',
      'Orientations List',
      'Description',
    ];

    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const formatted = String(str).replace(/"/g, '""');
      return `"${formatted}"`;
    };

    const rows = tiles.map((tile) => {
      const orientationsList = Array.isArray(tile.orientations)
        ? tile.orientations
            .map((o) => (typeof o === 'object' ? o.name : o))
            .join('; ')
        : '';
      const orientationsCount = Array.isArray(tile.orientations)
        ? tile.orientations.length
        : 0;

      return [
        escapeCsv(tile.id),
        escapeCsv(tile.name),
        escapeCsv(tile.brand),
        escapeCsv(tile.size),
        escapeCsv(tile.color),
        escapeCsv(tile.type),
        escapeCsv(tile.badge || 'None'),
        escapeCsv(tile.specs?.thickness || ''),
        escapeCsv(tile.specs?.finish || ''),
        escapeCsv(tile.specs?.slipResistance || ''),
        escapeCsv(tile.specs?.usage || ''),
        escapeCsv(tile.pdfUrl || 'N/A'),
        escapeCsv(tile.image || ''),
        escapeCsv(orientationsCount),
        escapeCsv(orientationsList),
        escapeCsv(tile.description || ''),
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `terra-tile-catalog-${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Excel spreadsheet export generated and downloaded successfully!');
  };

  // =========================================================================
  // 4. DELETE HANDLERS
  // =========================================================================
  const confirmDeleteTile = () => {
    if (!tileToDelete) return;
    const tileName = tileToDelete.name;
    onDeleteTile(tileToDelete.id);
    setTileToDelete(null);
    showToast(`Tile "${tileName}" was permanently removed.`);
  };

  const confirmDeleteSocialLink = () => {
    if (!socialToDelete) return;
    const linkName = socialToDelete.name;
    onDeleteSocialLink(socialToDelete.id);
    setSocialToDelete(null);
    showToast(`Social link "${linkName}" was removed.`);
  };

  return (
    <div className="flex-1 max-w-[1340px] w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 animate-fade-slide-in text-[#3D3229]">
      {/* NOTIFICATION TOAST */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[250] bg-[#3D3229] text-white px-5 py-3 rounded-2xl shadow-xl border border-white/10 flex items-center gap-3 animate-fade-slide-in text-sm font-medium">
          <i className="fa-solid fa-circle-check text-[#C2784A] text-base"></i>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-white/60 hover:text-white cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>
      )}

      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#F0E8DF]">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C2784A] block mb-1">
            Admin Management Portal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3D3229] tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-[#6B5D51] mt-1">
            Logged in as{' '}
            <span className="font-semibold text-[#3D3229]">
              {user?.username || 'Administrator'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-[#F0E8DF] hover:border-[#C2784A] hover:bg-[#FDFAF6] text-[#3D3229] hover:text-[#A85D32] rounded-full font-semibold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
            title="Log out"
          >
            <i className="fa-solid fa-arrow-right-from-bracket text-xs"></i>
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* PART 1: QUICK INFO (3 CORE INFORMATIONS)                              */}
      {/* ===================================================================== */}
      <div className="mb-10">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#A89885] mb-4 flex items-center gap-2">
          <i className="fa-solid fa-chart-simple text-[#C2784A]"></i> Quick Info Overview
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1: Total Number of Tiles */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#F0E8DF] shadow-xs relative overflow-hidden group hover:border-[#E8DDD4] hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-1">
                  Catalog Inventory
                </span>
                <h4 className="text-sm font-semibold text-[#6B5D51]">
                  Total Number of Tiles
                </h4>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-[#F5EDE4] text-[#A85D32] flex items-center justify-center text-lg shrink-0">
                <i className="fa-solid fa-cubes"></i>
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-4xl font-serif font-bold text-[#3D3229]">
                {quickMetrics.totalTiles}
              </span>
              <span className="text-xs font-semibold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">
                Active Catalog
              </span>
            </div>
            <p className="text-xs text-[#A89885] mt-2">
              Available tiles in live collection
            </p>
          </div>

          {/* Card 2: Total Number of Colors Available */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#F0E8DF] shadow-xs relative overflow-hidden group hover:border-[#E8DDD4] hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-1">
                  Palette Options
                </span>
                <h4 className="text-sm font-semibold text-[#6B5D51]">
                  Colors Available
                </h4>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-[#F5EDE4] text-[#A85D32] flex items-center justify-center text-lg shrink-0">
                <i className="fa-solid fa-palette"></i>
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-4xl font-serif font-bold text-[#3D3229]">
                {quickMetrics.totalColors}
              </span>
              <span className="text-xs font-semibold text-[#C2784A] bg-[#F5EDE4] px-2.5 py-0.5 rounded-full">
                Distinct Palettes
              </span>
            </div>
            <p className="text-xs text-[#A89885] mt-2">
              White, beige, terracotta, gray &amp; brown
            </p>
          </div>

          {/* Card 3: Suggested Key Info - Supplier Brands & Material Depth */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#F0E8DF] shadow-xs relative overflow-hidden group hover:border-[#E8DDD4] hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-1">
                  Supplier &amp; Materials
                </span>
                <h4 className="text-sm font-semibold text-[#6B5D51]">
                  Brands &amp; Materials
                </h4>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-[#F5EDE4] text-[#A85D32] flex items-center justify-center text-lg shrink-0">
                <i className="fa-solid fa-gem"></i>
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-serif font-bold text-[#3D3229]">
                {quickMetrics.totalBrands}
              </span>
              <span className="text-sm font-medium text-[#6B5D51]">Brands</span>
              <span className="text-sm text-[#A89885]">/</span>
              <span className="text-2xl font-serif font-bold text-[#3D3229]">
                {quickMetrics.totalTypes}
              </span>
              <span className="text-xs font-medium text-[#6B5D51]">Types</span>
            </div>
            <p className="text-xs text-[#A89885] mt-2">
              Porcelain, ceramic, marble &amp; terrazzo
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* PART 2: MAIN DASHBOARD TABS (List, Tile Addition, Social Links)       */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-3xl border border-[#F0E8DF] shadow-sm overflow-hidden">
        {/* Tab Headers */}
        <div className="flex flex-wrap border-b border-[#F0E8DF] bg-[#FAF7F4]/60 px-6 pt-4 gap-2 sm:gap-3">
          {/* Tab 1: List */}
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 sm:px-5 py-3 font-semibold text-xs sm:text-sm rounded-t-2xl transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'list'
                ? 'bg-white text-[#C2784A] border-[#C2784A] shadow-xs'
                : 'text-[#6B5D51] hover:text-[#3D3229] border-transparent hover:bg-white/50'
            }`}
          >
            <i className="fa-solid fa-list-check"></i>
            <span>Tile Collection List</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] bg-[#F5EDE4] text-[#A85D32] font-bold">
              {tiles.length}
            </span>
          </button>

          {/* Tab 2: Add Tile */}
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 sm:px-5 py-3 font-semibold text-xs sm:text-sm rounded-t-2xl transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'add'
                ? 'bg-white text-[#C2784A] border-[#C2784A] shadow-xs'
                : 'text-[#6B5D51] hover:text-[#3D3229] border-transparent hover:bg-white/50'
            }`}
          >
            <i className="fa-solid fa-plus-circle"></i>
            <span>Add New Tile</span>
          </button>

          {/* Tab 3: Social Links */}
          <button
            onClick={() => setActiveTab('social')}
            className={`px-4 sm:px-5 py-3 font-semibold text-xs sm:text-sm rounded-t-2xl transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'social'
                ? 'bg-white text-[#C2784A] border-[#C2784A] shadow-xs'
                : 'text-[#6B5D51] hover:text-[#3D3229] border-transparent hover:bg-white/50'
            }`}
          >
            <i className="fa-solid fa-share-nodes"></i>
            <span>Social Links</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] bg-[#F5EDE4] text-[#A85D32] font-bold">
              {socialLinks.length}
            </span>
          </button>
        </div>

        {/* =================================================================== */}
        {/* TAB 1: LIST TAB                                                     */}
        {/* =================================================================== */}
        {activeTab === 'list' && (
          <div className="p-6 sm:p-8">
            {/* List Controls: Search and Excel Export */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A89885]">
                  <i className="fa-solid fa-magnifying-glass text-sm"></i>
                </span>
                <input
                  type="text"
                  placeholder="Search by tile name, brand, material, size..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-[#F0E8DF] rounded-full text-sm bg-[#FAF7F4] focus:outline-none focus:border-[#C2784A] text-[#3D3229] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#A89885] hover:text-[#3D3229] cursor-pointer"
                  >
                    <i className="fa-solid fa-xmark text-xs"></i>
                  </button>
                )}
              </div>

              {/* Action Buttons: Export to Excel */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleExportToExcel}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-full text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer"
                  title="Export complete tile list to Excel spreadsheet"
                >
                  <i className="fa-solid fa-file-excel text-sm"></i>
                  <span>Export to Excel</span>
                </button>
              </div>
            </div>

            {/* Tiles Data Table */}
            {filteredTiles.length === 0 ? (
              <div className="text-center py-16 px-4 text-[#A89885] border-2 border-dashed border-[#F0E8DF] rounded-2xl">
                <i className="fa-solid fa-layer-group text-4xl mb-3 text-[#E8DDD4] block"></i>
                <p className="text-base text-[#6B5D51] font-medium">
                  No tiles found matching your search.
                </p>
                <p className="text-xs mt-1">Try clearing your search query or add a new tile.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-[#F0E8DF]">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#FAF7F4] text-[#6B5D51] border-b border-[#F0E8DF] text-[11px] font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Tile</th>
                      <th className="py-3.5 px-4">Brand &amp; Type</th>
                      <th className="py-3.5 px-4">Size &amp; Thickness</th>
                      <th className="py-3.5 px-4">Finish &amp; Slip</th>
                      <th className="py-3.5 px-4">Spec PDF</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E8DF]">
                    {filteredTiles.map((tile) => (
                      <tr
                        key={tile.id}
                        className="hover:bg-[#FDFAF6] transition-colors group"
                      >
                        {/* Tile Swatch & Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#FAF7F4] border border-[#F0E8DF] shrink-0 shadow-2xs">
                              <img
                                src={
                                  tile.image ||
                                  `https://picsum.photos/seed/${tile.id}-tile/200/200`
                                }
                                alt={tile.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-serif font-semibold text-[#3D3229] group-hover:text-[#C2784A] transition-colors">
                                  {tile.name}
                                </span>
                                {tile.badge && (
                                  <span
                                    className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                      tile.badge === 'new'
                                        ? 'bg-[#E8F5E9] text-[#2E7D32]'
                                        : tile.badge === 'featured'
                                        ? 'bg-[#FFF8E1] text-[#F57F17]'
                                        : 'bg-[#FFEBEE] text-[#C62828]'
                                    }`}
                                  >
                                    {tile.badge}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-[#A89885] capitalize">
                                {tile.color} palette
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Brand & Type */}
                        <td className="py-3 px-4">
                          <div className="text-[#3D3229] font-medium">{tile.brand}</div>
                          <span className="text-xs text-[#A89885] capitalize">
                            {tile.type}
                          </span>
                        </td>

                        {/* Size & Thickness */}
                        <td className="py-3 px-4">
                          <div className="text-[#3D3229] font-medium">
                            {tile.size} cm
                          </div>
                          <span className="text-xs text-[#A89885]">
                            {tile.specs?.thickness || 'Standard'}
                          </span>
                        </td>

                        {/* Finish & Slip */}
                        <td className="py-3 px-4">
                          <div className="text-[#3D3229]">
                            {tile.specs?.finish || 'Matte'}
                          </div>
                          <span className="text-xs text-[#A89885]">
                            {tile.specs?.slipResistance || 'R10'}
                          </span>
                        </td>

                        {/* Spec PDF Status */}
                        <td className="py-3 px-4">
                          {tile.pdfUrl ? (
                            <a
                              href={tile.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-[#C2784A] hover:underline font-medium"
                              title="Download/view PDF"
                            >
                              <i className="fa-solid fa-file-pdf"></i>
                              <span>PDF Available</span>
                            </a>
                          ) : (
                            <span className="text-xs text-[#A89885]">None</span>
                          )}
                        </td>

                        {/* Action Buttons: View, Edit, Remove */}
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {/* View Modal Trigger */}
                            <button
                              onClick={() => onSelectTile(tile)}
                              className="w-8 h-8 rounded-full bg-[#FAF7F4] hover:bg-[#E8D5C4] text-[#3D3229] hover:text-[#A85D32] flex items-center justify-center transition-all cursor-pointer"
                              title="View Tile Details (Modal)"
                            >
                              <i className="fa-regular fa-eye text-xs"></i>
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => setEditingTile(tile)}
                              className="w-8 h-8 rounded-full bg-[#FAF7F4] hover:bg-[#C2784A] text-[#3D3229] hover:text-white flex items-center justify-center transition-all cursor-pointer"
                              title="Edit Tile Information"
                            >
                              <i className="fa-solid fa-pen-to-square text-xs"></i>
                            </button>

                            {/* Remove Button */}
                            <button
                              onClick={() => setTileToDelete(tile)}
                              className="w-8 h-8 rounded-full bg-[#FAF7F4] hover:bg-[#E53935] text-[#3D3229] hover:text-white flex items-center justify-center transition-all cursor-pointer"
                              title="Permanently Remove Tile"
                            >
                              <i className="fa-regular fa-trash-can text-xs"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: TILE ADDITION FORM                                           */}
        {/* =================================================================== */}
        {activeTab === 'add' && (
          <div className="p-6 sm:p-10">
            <TileForm
              onSubmit={(newTileData) => {
                onAddTile(newTileData);
                showToast(`New tile "${newTileData.name}" was added successfully!`);
                setActiveTab('list');
              }}
              onCancel={() => setActiveTab('list')}
            />
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: SOCIAL LINKS MANAGEMENT TAB                                  */}
        {/* =================================================================== */}
        {activeTab === 'social' && (
          <div className="p-6 sm:p-10">
            <SocialLinksManager
              socialLinks={socialLinks}
              onAddLink={(newLink) => {
                onAddSocialLink(newLink);
                showToast(`Social link "${newLink.name}" added successfully!`);
              }}
              onDeleteLink={(link) => setSocialToDelete(link)}
            />
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* EDIT TILE MODAL                                                       */}
      {/* ===================================================================== */}
      {editingTile && (
        <EditTileModal
          tile={editingTile}
          onSave={(updatedTile) => {
            onUpdateTile(updatedTile);
            setEditingTile(null);
            showToast(`Tile "${updatedTile.name}" updated successfully!`);
          }}
          onClose={() => setEditingTile(null)}
        />
      )}

      {/* ===================================================================== */}
      {/* PERMANENT DELETE CONFIRMATION MODAL (HCI Error Prevention)           */}
      {/* ===================================================================== */}
      {tileToDelete && (
        <div
          onClick={() => setTileToDelete(null)}
          className="fixed inset-0 z-[220] bg-[#3D3229]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-slide-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-[440px] w-full p-6 sm:p-8 shadow-2xl border border-[#F0E8DF] animate-modal-slide-up text-[#3D3229]"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FFEBEE] text-[#C62828] flex items-center justify-center text-xl mx-auto mb-4">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>

            <h3 className="font-serif text-2xl font-semibold text-center mb-2">
              Remove Tile Permanently?
            </h3>
            <p className="text-xs sm:text-sm text-[#6B5D51] text-center leading-relaxed mb-6">
              Are you sure you want to remove{' '}
              <strong className="text-[#3D3229]">{tileToDelete.name}</strong> from the
              collection? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setTileToDelete(null)}
                className="px-5 py-2.5 bg-[#FAF7F4] hover:bg-[#F5EDE4] text-[#6B5D51] rounded-full text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteTile}
                className="px-6 py-2.5 bg-[#E53935] hover:bg-[#C62828] text-white rounded-full text-xs font-semibold transition-all shadow-md cursor-pointer"
              >
                Yes, Delete Tile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SOCIAL LINK DELETE CONFIRMATION MODAL                                */}
      {/* ===================================================================== */}
      {socialToDelete && (
        <div
          onClick={() => setSocialToDelete(null)}
          className="fixed inset-0 z-[220] bg-[#3D3229]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-slide-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-[440px] w-full p-6 sm:p-8 shadow-2xl border border-[#F0E8DF] animate-modal-slide-up text-[#3D3229]"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FFEBEE] text-[#C62828] flex items-center justify-center text-xl mx-auto mb-4">
              <i className="fa-solid fa-trash-can"></i>
            </div>

            <h3 className="font-serif text-2xl font-semibold text-center mb-2">
              Remove Social Link?
            </h3>
            <p className="text-xs sm:text-sm text-[#6B5D51] text-center leading-relaxed mb-6">
              Are you sure you want to remove{' '}
              <strong className="text-[#3D3229]">{socialToDelete.name}</strong> from the Social
              Hub page?
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setSocialToDelete(null)}
                className="px-5 py-2.5 bg-[#FAF7F4] hover:bg-[#F5EDE4] text-[#6B5D51] rounded-full text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteSocialLink}
                className="px-6 py-2.5 bg-[#E53935] hover:bg-[#C62828] text-white rounded-full text-xs font-semibold transition-all shadow-md cursor-pointer"
              >
                Yes, Delete Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===========================================================================
// SUB-COMPONENT: SOCIAL LINKS MANAGER (CREATION & DELETION)
// ===========================================================================
/**
 * SocialLinksManager component
 *
 * Implements HCI UI/UX principles:
 * - Direct icon selection with visual badges
 * - Immediate live preview of the generated social button
 * - Clean layout splitting Creation form and Active links management
 */
function SocialLinksManager({ socialLinks = [], onAddLink, onDeleteLink }) {
  const [selectedIcon, setSelectedIcon] = useState(PRESET_ICONS[0]);
  const [customIconClass, setCustomIconClass] = useState('');
  const [name, setName] = useState('');
  const [href, setHref] = useState('');
  const [error, setError] = useState('');

  const activeIconClass = customIconClass.trim() || selectedIcon.icon;
  const activeIconColor = selectedIcon.color || 'text-[#C2784A]';

  /**
   * Normalizes destination URLs so external links always open in external pages
   * instead of being treated as relative local subpaths (e.g. 'instagram.com' -> 'https://instagram.com').
   */
  const formatDestinationUrl = (url) => {
    if (!url) return '#';
    const trimmed = url.trim();
    if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('mailto:') ||
      trimmed.startsWith('tel:') ||
      trimmed.startsWith('#')
    ) {
      return trimmed;
    }
    if (trimmed.startsWith('//')) {
      return `https:${trimmed}`;
    }
    return `https://${trimmed}`;
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter a display name for the social link.');
      return;
    }

    if (!href.trim()) {
      setError('Please enter a destination URL (or mailto/tel).');
      return;
    }

    const normalizedHref = formatDestinationUrl(href);

    const newLink = {
      id: String(Date.now()),
      name: name.trim(),
      href: normalizedHref,
      icon: activeIconClass,
      color: activeIconColor,
    };

    onAddLink(newLink);

    // Reset input fields
    setName('');
    setHref('');
    setCustomIconClass('');
  };

  return (
    <div className="space-y-10">
      {/* Header Info */}
      <div className="border-b border-[#F0E8DF] pb-4">
        <h3 className="font-serif text-2xl font-semibold text-[#3D3229]">
          Social Links Hub Manager
        </h3>
        <p className="text-xs sm:text-sm text-[#6B5D51] mt-1">
          Create new contact and social links or remove existing ones from the public Social page.
        </p>
      </div>

      {/* SECTION 1: CREATE NEW SOCIAL LINK */}
      <div className="bg-[#FAF7F4] rounded-3xl p-6 sm:p-8 border border-[#F0E8DF]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#C2784A] mb-4 flex items-center gap-2">
          <i className="fa-solid fa-circle-plus"></i> Create New Social Link
        </h4>

        {error && (
          <div className="mb-4 p-3 bg-[#FFF2F0] border border-[#FFCCC7] rounded-xl text-xs text-[#CF1322] flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleCreateSubmit} className="space-y-6">
          {/* Step 1: Icon Selector */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-2">
              1. Choose An Icon *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
              {PRESET_ICONS.map((preset) => {
                const isSelected =
                  !customIconClass && selectedIcon.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedIcon(preset);
                      setCustomIconClass('');
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#C2784A] shadow-sm scale-105'
                        : 'bg-white/60 border-[#F0E8DF] hover:bg-white hover:border-[#D4956A]'
                    }`}
                  >
                    <i className={`${preset.icon} ${preset.color} text-xl mb-1`}></i>
                    <span className="text-[10px] font-semibold text-[#6B5D51] truncate max-w-full">
                      {preset.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Icon override */}
            <div className="mt-3">
              <input
                type="text"
                value={customIconClass}
                onChange={(e) => setCustomIconClass(e.target.value)}
                placeholder="Or custom FontAwesome class (e.g. fa-brands fa-threads)..."
                className="w-full px-3.5 py-2 border border-[#F0E8DF] rounded-xl text-xs bg-white focus:outline-none focus:border-[#C2784A]"
              />
            </div>
          </div>

          {/* Step 2: Name & URL Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-1.5">
                2. Display Name / Label *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Instagram — @terratile.co"
                className="w-full px-4 py-2.5 border-2 border-[#F0E8DF] rounded-xl text-sm bg-white focus:outline-none focus:border-[#C2784A] text-[#3D3229]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-1.5">
                3. Destination Link (URL / mailto / tel) *
              </label>
              <input
                type="text"
                required
                value={href}
                onChange={(e) => setHref(e.target.value)}
                placeholder="e.g. https://instagram.com/terratile.co"
                className="w-full px-4 py-2.5 border-2 border-[#F0E8DF] rounded-xl text-sm bg-white focus:outline-none focus:border-[#C2784A] text-[#3D3229]"
              />
            </div>
          </div>

          {/* Step 3: Live Preview & Submit */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-[#F0E8DF]">
            <div className="flex-1 max-w-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A89885] block mb-1.5">
                Live Button Preview:
              </span>
              <div className="flex items-center justify-center gap-3 px-5 py-3 rounded-full border-2 border-[#F0E8DF] font-semibold text-xs text-[#3D3229] bg-white shadow-2xs">
                <i className={`${activeIconClass} ${activeIconColor} text-base w-5 text-center`}></i>
                <span className="truncate">{name || 'Button Preview Label'}</span>
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#C2784A] hover:bg-[#A85D32] text-white rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer shrink-0"
            >
              <i className="fa-solid fa-plus text-xs"></i>
              <span>Create Social Link</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: ACTIVE SOCIAL LINKS LIST */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#C2784A] flex items-center gap-2">
            <i className="fa-solid fa-list"></i> Active Social Links ({socialLinks.length})
          </h4>
          <span className="text-xs text-[#A89885]">
            Changes apply in real time to the public Social page
          </span>
        </div>

        {socialLinks.length === 0 ? (
          <div className="text-center py-12 px-4 border-2 border-dashed border-[#F0E8DF] rounded-2xl text-[#A89885]">
            <i className="fa-solid fa-share-nodes text-3xl mb-2 text-[#E8DDD4] block"></i>
            <p className="text-sm">No social links configured. Add your first link above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {socialLinks.map((link) => (
              <div
                key={link.id}
                className="bg-white rounded-2xl p-4 border border-[#F0E8DF] shadow-xs flex items-center justify-between gap-3 hover:border-[#E8DDD4] transition-all"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF7F4] border border-[#F0E8DF] flex items-center justify-center text-lg shrink-0">
                    <i className={`${link.icon} ${link.color || 'text-[#C2784A]'}`}></i>
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-semibold text-sm text-[#3D3229] truncate">
                      {link.name}
                    </h5>
                    <a
                      href={formatDestinationUrl(link.href)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#A89885] hover:text-[#C2784A] truncate block transition-colors"
                      title={link.href}
                    >
                      {link.href}
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteLink(link)}
                  className="w-9 h-9 rounded-full bg-[#FAF7F4] hover:bg-[#FFEBEE] text-[#6B5D51] hover:text-[#C62828] border border-[#F0E8DF] hover:border-[#FFCDD2] flex items-center justify-center text-sm transition-all cursor-pointer shrink-0"
                  title={`Delete link "${link.name}"`}
                >
                  <i className="fa-regular fa-trash-can"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===========================================================================
// SUB-COMPONENT: TILE ADDITION / EDIT FORM
// ===========================================================================
/**
 * Default fallback labels assigned sequentially to newly added mockups.
 */
const DEFAULT_MOCKUP_LABELS = [
  'Room Installation',
  'Bathroom Mockup',
  'Kitchen View',
  'Close-up Detail',
];

/**
 * Normalizes initial installation mockup data into structured objects { label, image }.
 *
 * Supports:
 * - Direct mockup objects: { label: string, image: string }
 * - Seed identifiers: 'carrara-room' -> converted to Picsum mockup image URL
 * - Web/Data URLs: 'https://...' or 'data:image/...'
 *
 * @param {Object|null} initialData - Tile data if in edit mode
 * @returns {Array<{label: string, image: string}>} - Array of normalized mockup objects (0 to 4)
 */
const getInitialMockups = (initialData) => {
  if (!initialData) return [];
  const list = Array.isArray(initialData.mockups)
    ? initialData.mockups
    : Array.isArray(initialData.mockupSeeds)
    ? initialData.mockupSeeds
    : [];

  if (list.length === 0) return [];

  return list.slice(0, 4).map((item, index) => {
    if (typeof item === 'object' && item !== null) {
      return {
        label:
          item.label ||
          item.name ||
          DEFAULT_MOCKUP_LABELS[index] ||
          `Mockup ${index + 1}`,
        image: item.image || '',
      };
    }
    if (typeof item === 'string') {
      const isFullUrl =
        item.startsWith('http://') ||
        item.startsWith('https://') ||
        item.startsWith('data:');
      return {
        label: DEFAULT_MOCKUP_LABELS[index] || `Mockup ${index + 1}`,
        image: isFullUrl
          ? item
          : `https://picsum.photos/seed/${item}/800/600`,
      };
    }
    return {
      label: DEFAULT_MOCKUP_LABELS[index] || `Mockup ${index + 1}`,
      image: '',
    };
  });
};

/**
 * TileForm handles creation and editing of tiles with all required fields,
 * image uploads (as data URLs or web URLs), PDF brochure, up to 4 orientations,
 * and up to 4 installation mockups (minimum 0, maximum 4).
 */
function TileForm({ initialData = null, onSubmit, onCancel }) {
  const [name, setName] = useState(initialData?.name || '');
  const [brand, setBrand] = useState(initialData?.brand || 'Marazzi');
  const [customBrand, setCustomBrand] = useState('');
  const [size, setSize] = useState(initialData?.size || '60x60');
  const [customSize, setCustomSize] = useState('');
  const [color, setColor] = useState(initialData?.color || 'white');
  const [type, setType] = useState(initialData?.type || 'porcelain');
  const [badge, setBadge] = useState(initialData?.badge || 'none');

  // Technical Specs
  const [thickness, setThickness] = useState(initialData?.specs?.thickness || '9mm');
  const [finish, setFinish] = useState(initialData?.specs?.finish || 'Matte');
  const [slipResistance, setSlipResistance] = useState(
    initialData?.specs?.slipResistance || 'R10'
  );
  const [usage, setUsage] = useState(initialData?.specs?.usage || 'Floor & Wall');
  const [description, setDescription] = useState(initialData?.description || '');

  // Media
  const [image, setImage] = useState(
    initialData?.image || 'https://picsum.photos/seed/new-tile-sample/800/800'
  );
  const [pdfUrl, setPdfUrl] = useState(initialData?.pdfUrl || '');

  // Up to 4 orientations
  const [orientations, setOrientations] = useState(
    initialData?.orientations && initialData.orientations.length > 0
      ? initialData.orientations.slice(0, 4)
      : [
          { name: 'Straight Lay', image: 'https://picsum.photos/seed/pattern-1/500/500' },
          { name: 'Diagonal 45°', image: 'https://picsum.photos/seed/pattern-2/500/500' },
        ]
  );

  // Up to 4 installation mockups (minimum 0, maximum 4)
  const [mockups, setMockups] = useState(() => getInitialMockups(initialData));

  const [formError, setFormError] = useState('');

  // Handle local image file upload converting to Data URL preview
  const handleFileUpload = (e, callback) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add orientation (cannot exceed 4)
  const handleAddOrientation = () => {
    if (orientations.length >= 4) return;
    setOrientations((prev) => [
      ...prev,
      {
        name: `Pattern ${prev.length + 1}`,
        image: `https://picsum.photos/seed/orientation-${Date.now()}/500/500`,
      },
    ]);
  };

  // Remove orientation
  const handleRemoveOrientation = (index) => {
    setOrientations((prev) => prev.filter((_, i) => i !== index));
  };

  // Update orientation name or image
  const handleUpdateOrientation = (index, field, value) => {
    setOrientations((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  /**
   * Add a new installation mockup scene (capped at 4 maximum).
   * Automatically assigns sequential default label and placeholder seed.
   */
  const handleAddMockup = () => {
    if (mockups.length >= 4) return;
    const nextIdx = mockups.length;
    setMockups((prev) => [
      ...prev,
      {
        label:
          DEFAULT_MOCKUP_LABELS[nextIdx] ||
          `Installation Scene ${nextIdx + 1}`,
        image: `https://picsum.photos/seed/mockup-${Date.now()}-${nextIdx + 1}/800/600`,
      },
    ]);
  };

  /**
   * Remove an installation mockup at a given index.
   * Allows removing all mockups down to 0.
   */
  const handleRemoveMockup = (index) => {
    setMockups((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Update specific field ('label' or 'image') of a mockup at a given index.
   */
  const handleUpdateMockup = (index, field, value) => {
    setMockups((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please provide a Tile Name.');
      return;
    }

    const finalBrand = brand === 'other' ? customBrand.trim() || 'Terra Tile Co.' : brand;
    const finalSize = size === 'other' ? customSize.trim() || '60x60' : size;

    const newTileData = {
      id: initialData?.id || Date.now(),
      name: name.trim(),
      brand: finalBrand,
      size: finalSize,
      color: color.trim().toLowerCase(),
      type: type.trim().toLowerCase(),
      badge: badge === 'none' ? null : badge,
      description: description.trim() || 'Crafted with premium natural minerals.',
      specs: {
        thickness: thickness.trim(),
        finish: finish.trim(),
        slipResistance: slipResistance.trim(),
        usage: usage.trim(),
      },
      image: image.trim(),
      pdfUrl: pdfUrl.trim() ? pdfUrl.trim() : null,
      orientations: orientations.slice(0, 4),
      mockups: mockups.slice(0, 4),
      mockupSeeds: mockups.slice(0, 4),
      colors: initialData?.colors || ['#f5f2ed', '#ece6db', '#e0d8cc', '#d4c9b8'],
    };

    onSubmit(newTileData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header Info */}
      <div className="border-b border-[#F0E8DF] pb-4">
        <h3 className="font-serif text-2xl font-semibold text-[#3D3229]">
          {initialData ? 'Edit Tile Information' : 'Add New Tile to Collection'}
        </h3>
        <p className="text-xs sm:text-sm text-[#6B5D51] mt-1">
          Complete the required details, technical specifications, and visual assets below.
        </p>
      </div>

      {/* Error alert */}
      {formError && (
        <div className="p-3.5 bg-[#FFF2F0] border border-[#FFCCC7] rounded-xl text-xs sm:text-sm text-[#CF1322] flex items-center gap-2.5">
          <i className="fa-solid fa-circle-exclamation shrink-0"></i>
          <span>{formError}</span>
        </div>
      )}

      {/* SECTION 1: BASIC INFORMATION */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#C2784A] mb-4 flex items-center gap-2">
          <i className="fa-solid fa-circle-info"></i> Basic Information
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Tile Name */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-1.5">
              Tile Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Carrara Elegance"
              className="w-full px-4 py-2.5 border-2 border-[#F0E8DF] rounded-xl text-sm bg-[#FAF7F4] focus:outline-none focus:border-[#C2784A] text-[#3D3229]"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-1.5">
              Brand / Manufacturer *
            </label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-[#F0E8DF] rounded-xl text-sm bg-[#FAF7F4] focus:outline-none focus:border-[#C2784A] text-[#3D3229]"
            >
              <option value="Marazzi">Marazzi</option>
              <option value="Terra Tile Co.">Terra Tile Co.</option>
              <option value="Florim">Florim</option>
              <option value="Casalgrande">Casalgrande</option>
              <option value="other">Custom Brand...</option>
            </select>
            {brand === 'other' && (
              <input
                type="text"
                placeholder="Enter custom brand"
                value={customBrand}
                onChange={(e) => setCustomBrand(e.target.value)}
                className="mt-2 w-full px-4 py-2 border-2 border-[#F0E8DF] rounded-xl text-sm bg-[#FAF7F4]"
              />
            )}
          </div>

          {/* Size */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-1.5">
              Size Format *
            </label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-[#F0E8DF] rounded-xl text-sm bg-[#FAF7F4] focus:outline-none focus:border-[#C2784A] text-[#3D3229]"
            >
              <option value="60x60">60x60 cm</option>
              <option value="30x60">30x60 cm</option>
              <option value="30x30">30x30 cm</option>
              <option value="20x120">20x120 cm</option>
              <option value="other">Custom size...</option>
            </select>
            {size === 'other' && (
              <input
                type="text"
                placeholder="e.g. 45x90"
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                className="mt-2 w-full px-4 py-2 border-2 border-[#F0E8DF] rounded-xl text-sm bg-[#FAF7F4]"
              />
            )}
          </div>

          {/* Color Category */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-1.5">
              Color Palette *
            </label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-[#F0E8DF] rounded-xl text-sm bg-[#FAF7F4] focus:outline-none focus:border-[#C2784A] text-[#3D3229]"
            >
              <option value="white">White</option>
              <option value="beige">Beige</option>
              <option value="gray">Gray</option>
              <option value="brown">Brown</option>
              <option value="terracotta">Terracotta</option>
            </select>
          </div>

          {/* Material Type */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-1.5">
              Material Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-[#F0E8DF] rounded-xl text-sm bg-[#FAF7F4] focus:outline-none focus:border-[#C2784A] text-[#3D3229]"
            >
              <option value="porcelain">Porcelain</option>
              <option value="ceramic">Ceramic</option>
              <option value="marble">Marble</option>
              <option value="terrazzo">Terrazzo</option>
            </select>
          </div>

          {/* Badge */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-1.5">
              Catalog Badge
            </label>
            <select
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-[#F0E8DF] rounded-xl text-sm bg-[#FAF7F4] focus:outline-none focus:border-[#C2784A] text-[#3D3229]"
            >
              <option value="none">None (Standard)</option>
              <option value="featured">Featured (Gold)</option>
              <option value="popular">Popular (Red)</option>
              <option value="new">New (Green)</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 2: TECHNICAL SPECIFICATIONS */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#C2784A] mb-4 flex items-center gap-2">
          <i className="fa-solid fa-sliders"></i> Technical Specifications
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Thickness */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-1.5">
              Thickness
            </label>
            <input
              type="text"
              value={thickness}
              onChange={(e) => setThickness(e.target.value)}
              placeholder="e.g. 9mm or 10mm"
              className="w-full px-4 py-2.5 border-2 border-[#F0E8DF] rounded-xl text-sm bg-[#FAF7F4] focus:outline-none focus:border-[#C2784A] text-[#3D3229]"
            />
          </div>

          {/* Finish */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-1.5">
              Surface Finish
            </label>
            <input
              type="text"
              value={finish}
              onChange={(e) => setFinish(e.target.value)}
              placeholder="e.g. Matte, Honed, Polished"
              className="w-full px-4 py-2.5 border-2 border-[#F0E8DF] rounded-xl text-sm bg-[#FAF7F4] focus:outline-none focus:border-[#C2784A] text-[#3D3229]"
            />
          </div>

          {/* Slip Resistance */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-1.5">
              Slip Resistance
            </label>
            <input
              type="text"
              value={slipResistance}
              onChange={(e) => setSlipResistance(e.target.value)}
              placeholder="e.g. R9, R10, R11, R12"
              className="w-full px-4 py-2.5 border-2 border-[#F0E8DF] rounded-xl text-sm bg-[#FAF7F4] focus:outline-none focus:border-[#C2784A] text-[#3D3229]"
            />
          </div>

          {/* Usage */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-1.5">
              Recommended Usage
            </label>
            <input
              type="text"
              value={usage}
              onChange={(e) => setUsage(e.target.value)}
              placeholder="e.g. Floor & Wall"
              className="w-full px-4 py-2.5 border-2 border-[#F0E8DF] rounded-xl text-sm bg-[#FAF7F4] focus:outline-none focus:border-[#C2784A] text-[#3D3229]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: DESCRIPTION */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-1.5">
          Tile Description
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe tile texture, aesthetic qualities, and ideal applications..."
          className="w-full px-4 py-3 border-2 border-[#F0E8DF] rounded-xl text-sm bg-[#FAF7F4] focus:outline-none focus:border-[#C2784A] text-[#3D3229]"
        ></textarea>
      </div>

      {/* SECTION 4: MEDIA & ASSETS (MAIN IMAGE & PDF) */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#C2784A] mb-4 flex items-center gap-2">
          <i className="fa-solid fa-photo-film"></i> Media &amp; Specification Assets
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Swatch Image */}
          <div className="p-5 bg-[#FAF7F4] rounded-2xl border border-[#F0E8DF]">
            <label className="text-xs font-bold uppercase tracking-wider text-[#3D3229] block mb-2">
              Main Tile Swatch Image *
            </label>
            <div className="flex gap-4 items-start">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-[#F0E8DF] shrink-0 shadow-xs">
                <img
                  src={image || 'https://via.placeholder.com/150'}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Image URL (e.g. https://...)"
                  className="w-full px-3 py-1.5 border border-[#F0E8DF] rounded-lg text-xs bg-white focus:outline-none focus:border-[#C2784A]"
                />
                <div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#F0E8DF] hover:border-[#C2784A] text-[#6B5D51] hover:text-[#3D3229] rounded-lg text-xs font-medium cursor-pointer transition-all">
                    <i className="fa-solid fa-upload text-[10px]"></i> Upload Image File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setImage)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Specification PDF Sheet */}
          <div className="p-5 bg-[#FAF7F4] rounded-2xl border border-[#F0E8DF]">
            <label className="text-xs font-bold uppercase tracking-wider text-[#3D3229] block mb-2">
              Brochure / Specification Sheet (PDF)
            </label>
            <p className="text-xs text-[#6B5D51] mb-2">
              Optional link or PDF document for technical download button.
            </p>
            <div className="space-y-2">
              <input
                type="text"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="PDF link (e.g. https://.../specs.pdf)"
                className="w-full px-3 py-2 border border-[#F0E8DF] rounded-lg text-xs bg-white focus:outline-none focus:border-[#C2784A]"
              />
              <div>
                <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#F0E8DF] hover:border-[#C2784A] text-[#6B5D51] hover:text-[#3D3229] rounded-lg text-xs font-medium cursor-pointer transition-all">
                  <i className="fa-solid fa-file-pdf text-[#C2784A]"></i> Upload PDF File
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileUpload(e, setPdfUrl)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: ORIENTATIONS (MAX 4 PATTERN IMAGES) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#C2784A] flex items-center gap-2">
            <i className="fa-solid fa-shapes"></i> Orientation Patterns (Max 4 Images)
          </h4>

          {orientations.length < 4 && (
            <button
              type="button"
              onClick={handleAddOrientation}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F5EDE4] hover:bg-[#E8D5C4] text-[#A85D32] text-xs font-semibold transition-all cursor-pointer"
            >
              <i className="fa-solid fa-plus text-[10px]"></i> Add Pattern ({orientations.length}/4)
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {orientations.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#FAF7F4] rounded-2xl p-4 border border-[#F0E8DF] relative group"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-white border border-[#F0E8DF] mb-3 relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <label className="absolute bottom-2 right-2 bg-[#3D3229]/80 hover:bg-[#C2784A] text-white p-1.5 rounded-lg text-[10px] cursor-pointer backdrop-blur-xs transition-all">
                  <i className="fa-solid fa-camera"></i>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileUpload(e, (dataUrl) =>
                        handleUpdateOrientation(idx, 'image', dataUrl)
                      )
                    }
                    className="hidden"
                  />
                </label>
              </div>

              <input
                type="text"
                value={item.name}
                onChange={(e) =>
                  handleUpdateOrientation(idx, 'name', e.target.value)
                }
                placeholder="Pattern Name"
                className="w-full px-2.5 py-1.5 border border-[#F0E8DF] rounded-lg text-xs bg-white focus:outline-none focus:border-[#C2784A] font-medium"
              />

              <button
                type="button"
                onClick={() => handleRemoveOrientation(idx)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white text-[#C62828] border border-[#FFCCC7] hover:bg-[#FFEBEE] flex items-center justify-center text-[10px] shadow-2xs transition-all cursor-pointer"
                title="Remove pattern"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: INSTALLATION MOCKUPS (MIN 0, MAX 4 SCENE IMAGES) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C2784A] flex items-center gap-2">
              <i className="fa-solid fa-images"></i> Installation Mockups (Max 4 Images)
            </h4>
            <span className="text-[11px] text-[#A89885] mt-0.5 block">
              Provide real-world room, kitchen, bathroom, or architectural mockups.
            </span>
          </div>

          {mockups.length < 4 && (
            <button
              type="button"
              onClick={handleAddMockup}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F5EDE4] hover:bg-[#E8D5C4] text-[#A85D32] text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            >
              <i className="fa-solid fa-plus text-[10px]"></i>
              <span>Add Mockup ({mockups.length}/4)</span>
            </button>
          )}
        </div>

        {mockups.length === 0 ? (
          <div className="text-center py-8 px-4 border-2 border-dashed border-[#F0E8DF] rounded-2xl text-[#A89885]">
            <i className="fa-regular fa-images text-2xl mb-1.5 text-[#E8DDD4] block"></i>
            <p className="text-xs font-medium text-[#6B5D51]">
              No installation mockups added (0/4).
            </p>
            <p className="text-[11px] mt-0.5">
              Click &quot;Add Mockup&quot; above to attach room or detail scene previews.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockups.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#FAF7F4] rounded-2xl p-4 border border-[#F0E8DF] relative group flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white border border-[#F0E8DF] mb-3 relative">
                    <img
                      src={
                        item.image ||
                        'https://via.placeholder.com/400x300?text=No+Image'
                      }
                      alt={item.label || `Mockup ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                      }}
                    />
                    <label
                      className="absolute bottom-2 right-2 bg-[#3D3229]/80 hover:bg-[#C2784A] text-white p-1.5 rounded-lg text-[10px] cursor-pointer backdrop-blur-xs transition-all"
                      title="Upload local image file"
                    >
                      <i className="fa-solid fa-camera"></i>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload(e, (dataUrl) =>
                            handleUpdateMockup(idx, 'image', dataUrl)
                          )
                        }
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#A89885] block mb-1">
                        Mockup Label
                      </label>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) =>
                          handleUpdateMockup(idx, 'label', e.target.value)
                        }
                        placeholder="e.g. Room Installation"
                        className="w-full px-2.5 py-1.5 border border-[#F0E8DF] rounded-lg text-xs bg-white focus:outline-none focus:border-[#C2784A] font-medium text-[#3D3229]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#A89885] block mb-1">
                        Image URL / Source
                      </label>
                      <input
                        type="text"
                        value={item.image}
                        onChange={(e) =>
                          handleUpdateMockup(idx, 'image', e.target.value)
                        }
                        placeholder="Image URL or upload"
                        className="w-full px-2.5 py-1.5 border border-[#F0E8DF] rounded-lg text-xs bg-white focus:outline-none focus:border-[#C2784A] text-[#6B5D51]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveMockup(idx)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white text-[#C62828] border border-[#FFCCC7] hover:bg-[#FFEBEE] flex items-center justify-center text-[10px] shadow-2xs transition-all cursor-pointer"
                  title="Remove mockup"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FORM ACTION BUTTONS */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#F0E8DF]">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 bg-[#FAF7F4] hover:bg-[#F5EDE4] text-[#6B5D51] rounded-full text-sm font-semibold transition-all cursor-pointer"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-8 py-3 bg-[#C2784A] hover:bg-[#A85D32] text-white rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          <i className="fa-solid fa-floppy-disk text-xs"></i>
          <span>{initialData ? 'Save Changes' : 'Add Tile to Catalog'}</span>
        </button>
      </div>
    </form>
  );
}

// ===========================================================================
// SUB-COMPONENT: EDIT TILE MODAL
// ===========================================================================
function EditTileModal({ tile, onSave, onClose }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[220] bg-[#3D3229]/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-slide-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-[860px] w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 shadow-2xl border border-[#F0E8DF] relative animate-modal-slide-up"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#FAF7F4] border border-[#F0E8DF] text-[#3D3229] hover:bg-[#F5EDE4] flex items-center justify-center text-sm transition-all cursor-pointer"
          title="Close Modal"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <TileForm
          initialData={tile}
          onSubmit={onSave}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
