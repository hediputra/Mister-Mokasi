import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, ShieldCheck, CheckCircle2, Award, FileCheck, ArrowRight } from 'lucide-react';
import { HERO_BANNER_IMG } from '../../data/seedData';

interface HeroSectionProps {
  onSearch: (filters: { kategori?: 'mobil' | 'motor' | 'all'; merk?: string; maxPrice?: number }) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const { setActiveView } = useApp();
  const [kategori, setKategori] = useState<'all' | 'mobil' | 'motor'>('all');
  const [merk, setMerk] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      kategori,
      merk: merk.trim() || undefined,
      maxPrice: maxPrice > 0 ? maxPrice : undefined
    });
    setActiveView('catalog');
  };

  return (
    <section className="relative bg-slate-950 text-white overflow-hidden">
      {/* Background Image with Gradient Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BANNER_IMG}
          alt="Showroom Mr. Mokas Mobil dan Motor Bekas"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-35 scale-105 transform motion-safe:animate-subtle-zoom"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
        
        {/* Editorial Pill Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/60 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-6 backdrop-blur-md">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Showroom Mobil & Motor Bekas Standar Inspeksi 150+ Titik</span>
        </div>

        {/* Hero Title */}
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight text-balance mb-6">
            Beli Mobil & Motor Bekas <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">Tanpa Was-Was</span>.
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">
            Platform showroom digital pertama dengan sertifikat inspeksi lengkap, grading transparan <strong>A+ hingga E</strong>, serta garansi mesin dan transmisi 100% bebas banjir & tabrak.
          </p>
        </div>

        {/* Interactive Search Card */}
        <div className="max-w-4xl bg-white/95 text-slate-900 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl border border-white/20">
          
          {/* Quick Segmented Category Control */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mr-1">
              Kategori:
            </span>
            <div className="inline-flex p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setKategori('all')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  kategori === 'all'
                    ? 'bg-blue-950 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua Unit
              </button>
              <button
                type="button"
                onClick={() => setKategori('mobil')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  kategori === 'mobil'
                    ? 'bg-blue-950 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mobil Bekas
              </button>
              <button
                type="button"
                onClick={() => setKategori('motor')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  kategori === 'motor'
                    ? 'bg-blue-950 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Motor Bekas
              </button>
            </div>
          </div>

          {/* Search Inputs Grid */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Merk / Model
              </label>
              <input
                type="text"
                placeholder="Contoh: Innova, HR-V, PCX, Vespa..."
                value={merk}
                onChange={(e) => setMerk(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Budget Maksimal
              </label>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900"
              >
                <option value={0}>Semua Rentang Harga</option>
                <option value={35000000}>Di bawah 35 Juta (Motor)</option>
                <option value={50000000}>Di bawah 50 Juta (Motor Premium)</option>
                <option value={200000000}>Di bawah 200 Juta</option>
                <option value={350000000}>Di bawah 350 Juta</option>
                <option value={600000000}>Di bawah 600 Juta</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-6 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 cursor-pointer"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>Cari Kendaraan</span>
              </button>
            </div>
          </form>

          {/* Quick Filter Tags */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Paling Dicari:</span>
            <button
              type="button"
              onClick={() => { setMerk('Innova'); handleSubmit({ preventDefault: () => {} } as any); }}
              className="hover:text-blue-900 underline decoration-slate-300"
            >
              Innova Zenix
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => { setMerk('HR-V'); handleSubmit({ preventDefault: () => {} } as any); }}
              className="hover:text-blue-900 underline decoration-slate-300"
            >
              Honda HR-V
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => { setMerk('PCX'); handleSubmit({ preventDefault: () => {} } as any); }}
              className="hover:text-blue-900 underline decoration-slate-300"
            >
              Honda PCX 160
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => { setMerk('Vespa'); handleSubmit({ preventDefault: () => {} } as any); }}
              className="hover:text-blue-900 underline decoration-slate-300"
            >
              Vespa Sprint
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => { setMerk('Avanza'); handleSubmit({ preventDefault: () => {} } as any); }}
              className="hover:text-blue-900 underline decoration-slate-300"
            >
              Avanza 2021
            </button>
          </div>
        </div>

        {/* 4 Trust Highlights Below Search */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Inspeksi 150+ Titik</p>
              <p className="text-slate-400 text-[11px]">Sertifikat grading A+ hingga E</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-white">100% Bebas Banjir & Tabrak</p>
              <p className="text-slate-400 text-[11px]">Struktur sasis & kelistrikan aman</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <FileCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Garansi Keabsahan Surat</p>
              <p className="text-slate-400 text-[11px]">BPKB, STNK & Faktur terverifikasi</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <Award className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Garansi Uang Kembali 100%</p>
              <p className="text-slate-400 text-[11px]">Jika kondisi fisik tidak sesuai laporan</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
