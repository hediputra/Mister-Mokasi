import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { GitCompare, Shield, User, ChevronDown, Check, Sparkles, Database } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    currentUser,
    switchRole,
    compareList,
    setIsCompareDrawerOpen,
    users
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const rolesList: { role: UserRole; label: string; desc: string }[] = [
    { role: 'admin', label: 'Admin Showroom', desc: 'Kelola user, master data, approve listing' },
    { role: 'agen', label: 'Agen Penjual', desc: 'Input unit baru, inspeksi, kelola leads' },
    { role: 'bendahara', label: 'Bendahara Keuangan', desc: 'Verifikasi bayar, invoice, cashflow' },
    { role: 'marketing', label: 'Marketing Promosi', desc: 'Link referral, tracking leads, broadcast' },
    { role: 'customer', label: 'Pengunjung Publik', desc: 'Beli mobil/motor, simulasi kredit' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single element brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-950 to-blue-800 flex items-center justify-center text-amber-400 font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform">
              M
            </div>
            <div>
              <span className="text-xl font-extrabold text-blue-950 tracking-tight block">
                Mr. Mokas<span className="text-amber-500">.</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1 block">
                Mobil & Motor Bekas
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links (single line) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveView('home')}
            className={`transition-colors hover:text-blue-900 cursor-pointer ${
              activeView === 'home' ? 'text-blue-900 font-bold' : ''
            }`}
          >
            Beranda
          </button>

          <button
            onClick={() => setActiveView('catalog')}
            className={`transition-colors hover:text-blue-900 cursor-pointer ${
              activeView === 'catalog' ? 'text-blue-900 font-bold' : ''
            }`}
          >
            Katalog Kendaraan
          </button>

          <button
            onClick={() => setActiveView('warranty')}
            className={`transition-colors hover:text-blue-900 cursor-pointer ${
              activeView === 'warranty' ? 'text-blue-900 font-bold' : ''
            }`}
          >
            Inspeksi & Garansi
          </button>

          <button
            onClick={() => setActiveView('calculator')}
            className={`transition-colors hover:text-blue-900 cursor-pointer ${
              activeView === 'calculator' ? 'text-blue-900 font-bold' : ''
            }`}
          >
            Simulasi Kredit
          </button>

          <button
            onClick={() => setActiveView('docs')}
            className={`flex items-center gap-1 transition-colors hover:text-blue-900 cursor-pointer ${
              activeView === 'docs' ? 'text-blue-900 font-bold' : ''
            }`}
          >
            <Database className="w-3.5 h-3.5 text-amber-500" />
            <span>Skema SQL & Panduan</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Compare Button */}
          <button
            onClick={() => setIsCompareDrawerOpen(true)}
            className={`relative p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              compareList.length > 0
                ? 'bg-amber-50 text-amber-900 hover:bg-amber-100 border-amber-300 shadow-2xs'
                : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100 border-slate-200'
            }`}
            title="Bandingkan spesifikasi, harga & hasil inspeksi kendaraan"
          >
            <GitCompare className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Komparasi</span>
            {compareList.length > 0 ? (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                {compareList.length}
              </span>
            ) : (
              <span className="hidden md:inline text-[10px] text-slate-500 font-normal">
                (Multi)
              </span>
            )}
          </button>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-medium flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-left">
                <span className="text-[10px] text-slate-600 block uppercase font-bold -mb-0.5">Role Demo:</span>
                <span className="font-semibold text-blue-950 capitalize truncate max-w-[100px] sm:max-w-none block">
                  {currentUser.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
            </button>

            {/* Role Dropdown */}
            {roleMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setRoleMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-40 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">Ubah Peran / Demo Role</p>
                    <p className="text-[11px] text-slate-500">Uji coba akses fitur lengkap sesuai 4 role sistem</p>
                  </div>

                  <div className="p-1 space-y-1">
                    {rolesList.map(item => {
                      const isCurrent = currentUser.role === item.role;
                      return (
                        <button
                          key={item.role}
                          onClick={() => {
                            switchRole(item.role);
                            setRoleMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                            isCurrent
                              ? 'bg-blue-50 text-blue-900 font-semibold'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div>
                            <p className="font-bold">{item.label}</p>
                            <p className="text-[10px] text-slate-500 font-normal">{item.desc}</p>
                          </div>
                          {isCurrent && <Check className="w-4 h-4 text-blue-700" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="px-3 pt-2 mt-1 border-t border-slate-100 text-[10px] text-slate-400">
                    User aktif: <strong className="text-slate-700">{currentUser.nama}</strong>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Dashboard Button */}
          {currentUser.role !== 'customer' ? (
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm cursor-pointer whitespace-nowrap ${
                activeView === 'dashboard'
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                  : 'bg-blue-950 hover:bg-blue-900'
              }`}
            >
              Dashboard {currentUser.role}
            </button>
          ) : (
            <button
              onClick={() => setActiveView('catalog')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-950 hover:bg-blue-900 text-white transition-all shadow-sm cursor-pointer whitespace-nowrap"
            >
              Cari Kendaraan
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
