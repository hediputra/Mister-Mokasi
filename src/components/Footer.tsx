import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-900">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-900 text-amber-400 flex items-center justify-center font-black text-base">
                M
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                Mr. Mokas<span className="text-amber-500">.</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Platform showroom digital mobil dan motor bekas terverifikasi dengan hasil inspeksi terbuka 150+ titik dan grading transparan A+ hingga E.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Bebas Banjir & Bebas Tabrak</span>
            </div>
          </div>

          {/* Col 2: Navigasi Cepat */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Navigasi Utama</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => { setActiveView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Beranda Showroom
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveView('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Katalog Mobil & Motor
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveView('warranty'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Sistem Grading & 5 Garansi
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveView('calculator'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Simulasi Angsuran Kredit
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveView('docs'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Dokumentasi & Skema SQL
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Lokasi Cabang */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Cabang Showroom</h4>
            <div className="space-y-2.5">
              <div>
                <p className="font-semibold text-slate-300">Pusat Jakarta Selatan</p>
                <p className="text-[11px] text-slate-500">Jl. TB Simatupang No. 88, Cilandak</p>
              </div>
              <div>
                <p className="font-semibold text-slate-300">Cabang BSD Tangerang</p>
                <p className="text-[11px] text-slate-500">Bursa Otomotif BSD Blok B No. 12</p>
              </div>
              <div>
                <p className="font-semibold text-slate-300">Cabang Bandung</p>
                <p className="text-[11px] text-slate-500">Jl. Dr. Djunjunan (Pasteur) No. 155</p>
              </div>
            </div>
          </div>

          {/* Col 4: Kontak & Jam Buka */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Layanan Pelanggan</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Buka Setiap Hari: 08.30 - 18.00 WIB</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Hotline: (021) 7890-1234</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>WhatsApp: +62 812-8888-9901</span>
              </div>
            </div>

            <a
              href="https://wa.me/6281288889901?text=Halo%20Admin%20Mr.%20Mokas,%20saya%20ingin%20tanya%20jadwal%20kunjungan%20showroom."
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat CS Showroom</span>
            </a>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Mr. Mokas. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-4">
            <span>Privasi & Kebijakan</span>
            <span>·</span>
            <span>Syarat & Ketentuan Garansi</span>
            <span>·</span>
            <span>Sertifikasi Inspektur Otomotif</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
