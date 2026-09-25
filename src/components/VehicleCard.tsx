import React from 'react';
import { Kendaraan } from '../types';
import { GradeBadge } from './GradeBadge';
import { formatRupiah, formatNumber, createWhatsAppChatUrl } from '../utils/formatters';
import { useApp } from '../context/AppContext';
import { ShieldCheck, MessageCircle, Heart, GitCompare, Gauge, Calendar, Cog, MapPin } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Kendaraan;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const {
    setSelectedVehicleId,
    setActiveView,
    toggleFavorite,
    favorites,
    addToCompare,
    compareList,
    setIsCompareDrawerOpen,
    createLead,
    currentUser
  } = useApp();

  const isFav = favorites.includes(vehicle.id);
  const isCompared = compareList.includes(vehicle.id);
  const primaryPhoto = vehicle.fotos[0]?.url || '/src/assets/images/car_innova_zenix_white_1790299475824.jpg';

  const handleOpenDetail = () => {
    setSelectedVehicleId(vehicle.id);
    setActiveView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppChat = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Auto-record lead in state
    createLead({
      kendaraan_id: vehicle.id,
      kendaraan_nama: `${vehicle.merk} ${vehicle.model} ${vehicle.tahun}`,
      nama: currentUser.role === 'customer' ? 'Calon Pembeli Web' : currentUser.nama,
      no_wa: currentUser.no_wa || '081234567890',
      pesan: `Konsultasi unit ${vehicle.merk} ${vehicle.model} ${vehicle.nopol} via tombol WA Agen`
    });

    const url = createWhatsAppChatUrl({
      phone: vehicle.agen_wa || '6281312345678',
      vehicleName: `${vehicle.merk} ${vehicle.model} (${vehicle.tahun})`,
      vehicleNopol: vehicle.nopol,
      price: vehicle.harga_tunai,
      agentName: vehicle.agen_nama || 'Agen Mr. Mokas'
    });

    window.open(url, '_blank');
  };

  return (
    <div
      onClick={handleOpenDetail}
      className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* 1. Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={primaryPhoto}
          alt={`${vehicle.merk} ${vehicle.model}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            // fallback
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80';
          }}
        />

        {/* Top Floating Controls */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Grade Badge */}
          <div className="pointer-events-auto shadow-md rounded-lg">
            <GradeBadge grade={vehicle.grade} size="md" />
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!isCompared) {
                  addToCompare(vehicle.id);
                }
                setIsCompareDrawerOpen(true);
              }}
              title={isCompared ? 'Lihat dalam komparasi' : 'Bandingkan unit'}
              className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-sm cursor-pointer ${
                isCompared
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-white/90 text-slate-700 hover:bg-white hover:text-amber-600'
              }`}
            >
              <GitCompare className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(vehicle.id);
              }}
              title={isFav ? 'Hapus dari favorit' : 'Simpan ke favorit'}
              className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-sm ${
                isFav
                  ? 'bg-rose-500 text-white hover:bg-rose-600'
                  : 'bg-white/90 text-slate-700 hover:bg-white hover:text-rose-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Status Pill if not available */}
        {vehicle.status !== 'Tersedia' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              vehicle.status === 'Booking' ? 'bg-amber-500 text-white' : 'bg-rose-600 text-white'
            }`}>
              Unit {vehicle.status}
            </span>
          </div>
        )}

        {/* Category tag */}
        <div className="absolute bottom-2 left-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-sm">
            {vehicle.kategori} · {vehicle.cc}cc
          </span>
        </div>
      </div>

      {/* 2. Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Model */}
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-blue-900 transition-colors line-clamp-1">
              {vehicle.merk} {vehicle.model}
            </h3>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded shrink-0">
              {vehicle.tahun}
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-3 line-clamp-1">
            {vehicle.varian}
          </p>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-2 py-2.5 px-3 bg-slate-50 rounded-xl text-xs text-slate-600 mb-3 border border-slate-100">
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-mono font-medium text-slate-700 tabular-nums">
                {formatNumber(vehicle.km)} km
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cog className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{vehicle.transmisi}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Pajak {vehicle.pajak_status}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{vehicle.lokasi.split('-')[1]?.trim() || vehicle.lokasi}</span>
            </div>
          </div>

          {/* Inspection Guarantee Markers */}
          <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-medium mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>100% Bebas Banjir & Tabrak</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-600">Garansi 30 Hari</span>
          </div>
        </div>

        {/* 3. Pricing & Actions */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 block">
                Harga Tunai
              </span>
              <span className="text-lg font-extrabold text-blue-950 font-mono tracking-tight tabular-nums">
                {formatRupiah(vehicle.harga_tunai)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 block">
                Cicilan Mulai
              </span>
              <span className="text-xs font-bold text-slate-700 font-mono tabular-nums">
                {formatRupiah(vehicle.angsuran_mulai)}/bln
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleOpenDetail}
              className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors text-center"
            >
              Cek Inspeksi
            </button>

            <button
              type="button"
              onClick={handleWhatsAppChat}
              className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat Agen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
