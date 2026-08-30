import React from 'react';

/**
 * Dashboard Component
 *
 * Protected administrative / staff dashboard.
 * Only accessible after successful login at `/login`.
 * Features an administrative header, logout control, and placeholder overview cards
 * ready for subsequent detailed feature implementation.
 */
export default function Dashboard({ user, onLogout }) {
  return (
    <div className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 animate-fade-slide-in">
      {/* TOP BAR / DASHBOARD HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#F0E8DF]">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C2784A] block mb-1">
            Admin Management Portal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3D3229] tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-[#6B5D51] mt-1">
            Welcome back,{' '}
            <span className="font-semibold text-[#3D3229]">
              {user?.username || 'Administrator'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-[#F0E8DF] hover:border-[#C2784A] hover:bg-[#FDFAF6] text-[#3D3229] hover:text-[#A85D32] rounded-full font-semibold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
            title="Log out of Dashboard"
          >
            <i className="fa-solid fa-arrow-right-from-bracket text-xs"></i>
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD OVERVIEW CONTAINER (Ready for detailed dashboard specifications) */}
      <div className="space-y-6">
        {/* Welcome Notice Banner */}
        <div className="bg-[#FDFAF6] rounded-3xl p-6 sm:p-8 border border-[#F0E8DF] shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E8D5C4] text-[#A85D32] flex items-center justify-center text-xl shrink-0">
              <i className="fa-solid fa-gauge-high"></i>
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#3D3229] mb-1">
                Dashboard Ready
              </h2>
              <p className="text-sm text-[#6B5D51] leading-relaxed">
                You are successfully logged in. Detailed dashboard modules, tile management tools, and statistics will be configured here.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Placeholder KPI / Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[#F0E8DF] shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-2">
              Catalog Items
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-serif font-bold text-[#3D3229]">12</span>
              <span className="text-xs text-[#2E7D32] font-semibold bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="text-xs text-[#A89885] mt-2">Tiles in collection</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#F0E8DF] shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-2">
              Session Status
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-serif font-bold text-[#3D3229]">Online</span>
              <span className="text-xs text-[#C2784A] font-semibold bg-[#F5EDE4] px-2.5 py-0.5 rounded-full">
                Authenticated
              </span>
            </div>
            <p className="text-xs text-[#A89885] mt-2">Protected route active</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#F0E8DF] shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A89885] block mb-2">
              Showroom Support
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-medium text-[#3D3229]">+1 (503) 555-0147</span>
            </div>
            <p className="text-xs text-[#A89885] mt-2">Direct assistance line</p>
          </div>
        </div>
      </div>
    </div>
  );
}
