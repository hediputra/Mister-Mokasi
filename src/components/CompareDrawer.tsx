import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatNumber, createWhatsAppChatUrl } from '../utils/formatters';
import {
  X,
  GitCompare,
  Trash2,
  Plus,
  Check,
  Search,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Gauge,
  Calendar,
  Layers,
  Sparkles,
  Filter,
  Eye,
  Award,
  SlidersHorizontal,
  ChevronDown,
  Info
} from 'lucide-react';
import { GradeBadge } from './GradeBadge';
import { Kendaraan, VehicleCategory } from '../types';

export const CompareDrawer: React.FC = () => {
  const {
    compareList,
    vehicles,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isCompareDrawerOpen,
    setIsCompareDrawerOpen,
    setSelectedVehicleId,
    setActiveView,
    createLead,
    currentUser
  } = useApp();

  // State inside Compare Drawer
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerCategory, setPickerCategory] = useState<'all' | 'mobil' | 'motor'>('all');
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [activeCategorySection, setActiveCategorySection] = useState<'all' | 'inspeksi' | 'harga' | 'teknis'>('all');

  if (!isCompareDrawerOpen) return null;

  // The vehicles currently selected for comparison
  const comparedVehicles: Kendaraan[] = compareList
    .map(id => vehicles.find(v => v.id === id))
    .filter((v): v is Kendaraan => v !== undefined);

  // Available vehicles that can be added to comparison
  const availableToAdd = vehicles.filter(v => !compareList.includes(v.id) && v.status !== 'Menunggu Approval');

  // Filtered available vehicles in the picker
  const filteredPickerVehicles = availableToAdd.filter(v => {
    if (pickerCategory !== 'all' && v.kategori !== pickerCategory) return false;
    if (pickerSearch.trim()) {
      const q = pickerSearch.toLowerCase();
      const match =
        v.merk.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.varian.toLowerCase().includes(q) ||
        v.nopol.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Quick preset suggestions
  const handleLoadPreset = (category: VehicleCategory) => {
    const matched = vehicles.filter(v => v.kategori === category && v.status === 'Tersedia').slice(0, 3);
    clearCompare();
    matched.forEach(v => addToCompare(v.id));
  };

  const handleOpenDetail = (id: string) => {
    setSelectedVehicleId(id);
    setActiveView('detail');
    setIsCompareDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppChat = (vehicle: Kendaraan) => {
    createLead({
      kendaraan_id: vehicle.id,
      kendaraan_nama: `${vehicle.merk} ${vehicle.model} ${vehicle.tahun}`,
      nama: currentUser.role === 'customer' ? 'Calon Pembeli Web' : currentUser.nama,
      no_wa: currentUser.no_wa || '081234567890',
      pesan: `Konsultasi komparasi unit ${vehicle.merk} ${vehicle.model} (${vehicle.nopol})`
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

  // Helper function to check if row values differ
  const checkIsDifferent = (values: (string | number | boolean)[]) => {
    if (values.length <= 1) return false;
    return new Set(values).size > 1;
  };

  // Best value identifiers
  const lowestPrice = comparedVehicles.length > 0
    ? Math.min(...comparedVehicles.map(v => v.harga_tunai))
    : 0;

  const lowestKm = comparedVehicles.length > 0
    ? Math.min(...comparedVehicles.map(v => v.km))
    : 0;

  const highestScore = comparedVehicles.length > 0
    ? Math.max(...comparedVehicles.map(v => v.inspeksi.skor_mesin))
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 lg:p-6 overflow-y-auto">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-6xl w-full h-[95vh] sm:h-auto sm:max-h-[92vh] shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-200">
        
        {/* ===================== TOP HEADER BAR ===================== */}
        <div className="p-4 sm:px-6 sm:py-4 bg-slate-900 text-white flex items-center justify-between gap-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
              <GitCompare className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                  Komparasi Kendaraan Side-by-Side
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {comparedVehicles.length} / 4 Unit
                </span>
              </div>
              <p className="text-xs text-slate-300 hidden sm:block">
                Bandingkan spesifikasi teknis, harga tunai/kredit, dan laporan 150+ titik inspeksi secara berdampingan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Add Vehicle Button */}
            {comparedVehicles.length < 4 && (
              <button
                type="button"
                onClick={() => setIsPickerOpen(true)}
                className="py-2 px-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-slate-950" />
                <span className="hidden sm:inline">Tambah Kendaraan</span>
                <span className="sm:hidden">Tambah</span>
              </button>
            )}

            {/* Clear All */}
            {comparedVehicles.length > 0 && (
              <button
                type="button"
                onClick={clearCompare}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                title="Kosongkan semua komparasi"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden md:inline">Reset</span>
              </button>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsCompareDrawerOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Tutup drawer komparasi"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ===================== CONTROLS & FILTER BAR ===================== */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          {/* Section Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mr-1 hidden sm:inline">
              Fokus:
            </span>
            <button
              type="button"
              onClick={() => setActiveCategorySection('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                activeCategorySection === 'all'
                  ? 'bg-blue-950 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Semua Parameter
            </button>
            <button
              type="button"
              onClick={() => setActiveCategorySection('inspeksi')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                activeCategorySection === 'inspeksi'
                  ? 'bg-blue-950 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Inspeksi & Grade
            </button>
            <button
              type="button"
              onClick={() => setActiveCategorySection('harga')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                activeCategorySection === 'harga'
                  ? 'bg-blue-950 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Harga & Kredit
            </button>
            <button
              type="button"
              onClick={() => setActiveCategorySection('teknis')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                activeCategorySection === 'teknis'
                  ? 'bg-blue-950 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Spesifikasi Teknis
            </button>
          </div>

          {/* Differences Highlight Toggle */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={highlightDifferences}
                onChange={(e) => setHighlightDifferences(e.target.checked)}
                className="w-4 h-4 text-blue-950 rounded border-slate-300 focus:ring-blue-600 accent-blue-950"
              />
              <span className="font-semibold text-xs">Sorot Perbedaan Nilai</span>
            </label>
          </div>
        </div>

        {/* ===================== MAIN COMPARISON TABLE BODY ===================== */}
        <div className="flex-1 overflow-auto bg-white p-4 sm:p-6">
          {comparedVehicles.length === 0 ? (
            /* EMPTY STATE: 0 Vehicles in Compare */
            <div className="py-16 px-4 text-center max-w-lg mx-auto flex flex-col items-center">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-950 flex items-center justify-center mb-4 border border-blue-100">
                <GitCompare className="w-8 h-8 text-amber-500" />
              </div>
              <h4 className="text-lg font-bold text-blue-950 mb-1">
                Belum Ada Kendaraan Dipilih
              </h4>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Pilih hingga 4 unit mobil atau motor untuk membandingkan harga, transmisi, hasil uji inspeksi 150 titik, dan garansi secara berdampingan.
              </p>

              <button
                type="button"
                onClick={() => setIsPickerOpen(true)}
                className="py-3 px-6 rounded-2xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer mb-6"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Pilih Kendaraan Sekarang</span>
              </button>

              {/* Quick Presets */}
              <div className="w-full pt-6 border-t border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Atau Coba Rekomendasi Komparasi:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleLoadPreset('mobil')}
                    className="py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    🚗 Bandingkan Mobil Pilihan (Zenix vs HR-V vs Avanza)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadPreset('motor')}
                    className="py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    🛵 Bandingkan Motor Skutik (PCX vs Vespa vs NMAX)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* COMPARISON TABLE WITH RESPONSIVE HORIZONTAL SCROLL & STICKY FIRST COLUMN */
            <div className="relative min-w-[700px] border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full border-collapse text-left text-xs">
                {/* 1. VEHICLE HEADER CARDS ROW (Sticky Top) */}
                <thead className="sticky top-0 z-20 bg-white shadow-xs">
                  <tr className="border-b-2 border-slate-200 bg-slate-50/90 backdrop-blur-md">
                    {/* Fixed Spec Label Column */}
                    <th className="w-48 sm:w-56 p-4 align-top sticky left-0 z-30 bg-slate-100/95 backdrop-blur-md border-r border-slate-200">
                      <div className="h-full flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                            Fitur Komparasi
                          </span>
                          <h4 className="font-extrabold text-blue-950 text-sm">
                            Parameter & Spesifikasi
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {comparedVehicles.length} Unit Dibandingkan
                          </p>
                        </div>

                        {comparedVehicles.length < 4 && (
                          <button
                            type="button"
                            onClick={() => setIsPickerOpen(true)}
                            className="mt-4 py-2 px-3 rounded-xl border border-dashed border-blue-900/40 hover:border-blue-900 bg-blue-50/50 hover:bg-blue-50 text-blue-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 text-amber-600" />
                            <span>+ Tambah Unit</span>
                          </button>
                        )}
                      </div>
                    </th>

                    {/* Dynamic Vehicle Columns */}
                    {comparedVehicles.map(veh => (
                      <th
                        key={veh.id}
                        className="w-64 sm:w-72 p-4 align-top border-r border-slate-200 last:border-r-0 bg-white"
                      >
                        <div className="relative flex flex-col space-y-3">
                          {/* Close / Remove button */}
                          <button
                            type="button"
                            onClick={() => removeFromCompare(veh.id)}
                            className="absolute -top-1 -right-1 p-1.5 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors shadow-2xs z-10 cursor-pointer"
                            title="Hapus unit dari komparasi"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          {/* Vehicle Photo */}
                          <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs">
                            <img
                              src={veh.fotos[0]?.url}
                              alt={veh.model}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 shadow-sm">
                              <GradeBadge grade={veh.grade} size="sm" />
                            </div>
                            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white uppercase backdrop-blur-sm">
                              {veh.kategori}
                            </span>
                          </div>

                          {/* Brand, Model, Year */}
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-1">
                              {veh.merk} {veh.model}
                            </h4>
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {veh.varian} ({veh.tahun})
                            </p>
                          </div>

                          {/* Price Tag */}
                          <div className="pt-2 border-t border-slate-100">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              Harga Tunai
                            </span>
                            <div className="text-base sm:text-lg font-black text-blue-950 font-mono tracking-tight tabular-nums">
                              {formatRupiah(veh.harga_tunai)}
                            </div>
                            <span className="text-[11px] text-slate-500 font-medium block">
                              Cicilan mulai {formatRupiah(veh.angsuran_mulai)}/bln
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => handleOpenDetail(veh.id)}
                              className="py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Detail</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleWhatsAppChat(veh)}
                              className="py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                              title="Tanya ketersediaan ke Agen"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WA Agen</span>
                            </button>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* 2. TABLE BODY (SPECIFICATION ROWS) */}
                <tbody className="divide-y divide-slate-100">
                  
                  {/* ================= SECTION: HARGA & PEMBIAYAAN ================= */}
                  {(activeCategorySection === 'all' || activeCategorySection === 'harga') && (
                    <>
                      <tr className="bg-slate-100/90 font-bold text-slate-900 text-xs uppercase tracking-wider">
                        <td colSpan={comparedVehicles.length + 1} className="py-2 px-4 sticky left-0 z-10 bg-slate-100 text-blue-950">
                          💰 Skema Harga & Pembiayaan
                        </td>
                      </tr>

                      {/* Harga Tunai Row */}
                      <tr className={`hover:bg-slate-50 ${highlightDifferences && checkIsDifferent(comparedVehicles.map(v => v.harga_tunai)) ? 'bg-amber-50/50' : ''}`}>
                        <td className="py-2.5 px-4 font-bold text-slate-700 sticky left-0 z-10 bg-white border-r border-slate-200">
                          Harga Tunai OTR
                        </td>
                        {comparedVehicles.map(v => {
                          const isLowest = v.harga_tunai === lowestPrice && comparedVehicles.length > 1;
                          return (
                            <td key={v.id} className="py-2.5 px-4 border-r border-slate-200 last:border-r-0">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-sm text-blue-950 tabular-nums">
                                  {formatRupiah(v.harga_tunai)}
                                </span>
                                {isLowest && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                    Termurah
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>

                      {/* Harga Kredit Row */}
                      <tr className={`hover:bg-slate-50 ${highlightDifferences && checkIsDifferent(comparedVehicles.map(v => v.harga_kredit)) ? 'bg-amber-50/50' : ''}`}>
                        <td className="py-2.5 px-4 font-bold text-slate-700 sticky left-0 z-10 bg-white border-r border-slate-200">
                          Harga Paket Kredit
                        </td>
                        {comparedVehicles.map(v => (
                          <td key={v.id} className="py-2.5 px-4 border-r border-slate-200 last:border-r-0 font-mono text-slate-800 tabular-nums">
                            {formatRupiah(v.harga_kredit)}
                          </td>
                        ))}
                      </tr>

                      {/* DP Minimal Row */}
                      <tr className={`hover:bg-slate-50 ${highlightDifferences && checkIsDifferent(comparedVehicles.map(v => v.dp_min)) ? 'bg-amber-50/50' : ''}`}>
                        <td className="py-2.5 px-4 font-bold text-slate-700 sticky left-0 z-10 bg-white border-r border-slate-200">
                          DP Minimal
                        </td>
                        {comparedVehicles.map(v => (
                          <td key={v.id} className="py-2.5 px-4 border-r border-slate-200 last:border-r-0 font-mono font-semibold text-slate-700 tabular-nums">
                            {formatRupiah(v.dp_min)}
                          </td>
                        ))}
                      </tr>

                      {/* Angsuran Mulai Row */}
                      <tr className={`hover:bg-slate-50 ${highlightDifferences && checkIsDifferent(comparedVehicles.map(v => v.angsuran_mulai)) ? 'bg-amber-50/50' : ''}`}>
                        <td className="py-2.5 px-4 font-bold text-slate-700 sticky left-0 z-10 bg-white border-r border-slate-200">
                          Estimasi Angsuran / Bulan
                        </td>
                        {comparedVehicles.map(v => (
                          <td key={v.id} className="py-2.5 px-4 border-r border-slate-200 last:border-r-0 font-mono font-bold text-emerald-700 tabular-nums">
                            {formatRupiah(v.angsuran_mulai)} / bln
                          </td>
                        ))}
                      </tr>
                    </>
                  )}

                  {/* ================= SECTION: INSPEKSI & GRADE ================= */}
                  {(activeCategorySection === 'all' || activeCategorySection === 'inspeksi') && (
                    <>
                      <tr className="bg-slate-100/90 font-bold text-slate-900 text-xs uppercase tracking-wider">
                        <td colSpan={comparedVehicles.length + 1} className="py-2 px-4 sticky left-0 z-10 bg-slate-100 text-blue-950">
                          🛡️ Hasil Inspeksi 150+ Titik & Grade
                        </td>
                      </tr>

                      {/* Grade Badge Row */}
                      <tr className={`hover:bg-slate-50 ${highlightDifferences && checkIsDifferent(comparedVehicles.map(v => v.grade)) ? 'bg-amber-50/50' : ''}`}>
                        <td className="py-2.5 px-4 font-bold text-slate-700 sticky left-0 z-10 bg-white border-r border-slate-200">
                          Grade Kualitas Inspeksi
                        </td>
                        {comparedVehicles.map(v => (
                          <td key={v.id} className="py-2.5 px-4 border-r border-slate-200 last:border-r-0">
                            <GradeBadge grade={v.grade} size="sm" showLabel />
                          </td>
                        ))}
                      </tr>

                      {/* Skor Mesin Row */}
                      <tr className={`hover:bg-slate-50 ${highlightDifferences && checkIsDifferent(comparedVehicles.map(v => v.inspeksi.skor_mesin)) ? 'bg-amber-50/50' : ''}`}>
                        <td className="py-2.5 px-4 font-bold text-slate-700 sticky left-0 z-10 bg-white border-r border-slate-200">
                          Skor Mesin & Transmisi
                        </td>
                        {comparedVehicles.map(v => {
                          const isHighest = v.inspeksi.skor_mesin === highestScore && comparedVehicles.length > 1;
                          return (
                            <td key={v.id} className="py-2.5 px-4 border-r border-slate-200 last:border-r-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="font-mono font-bold text-emerald-700">
                                  {v.inspeksi.skor_mesin} / 100
                                </span>
                                {isHighest && (
                                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                                    Tertinggi
                                  </span>
                                )}
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500 rounded-full"
                                  style={{ width: `${v.inspeksi.skor_mesin}%` }}
                                />
                              </div>
                            </td>
                          );
                        })}
                      </tr>

                      {/* Skor Eksterior Row */}
                      <tr className={`hover:bg-slate-50 ${highlightDifferences && checkIsDifferent(comparedVehicles.map(v => v.inspeksi.skor_eksterior)) ? 'bg-amber-50/50' : ''}`}>
                        <td className="py-2.5 px-4 font-bold text-slate-700 sticky left-0 z-10 bg-white border-r border-slate-200">
                          Skor Eksterior & Body
                        </td>
                        {comparedVehicles.map(v => (
                          <td key={v.id} className="py-2.5 px-4 border-r border-slate-200 last:border-r-0">
                            <span className="font-mono font-bold text-emerald-700">
                              {v.inspeksi.skor_eksterior} / 100
                            </span>
                          </td>
                        ))}
                      </tr>

                      {/* Skor Interior Row */}
                      <tr className={`hover:bg-slate-50 ${highlightDifferences && checkIsDifferent(comparedVehicles.map(v => v.inspeksi.skor_interior)) ? 'bg-amber-50/50' : ''}`}>
                        <td className="py-2.5 px-4 font-bold text-slate-700 sticky left-0 z-10 bg-white border-r border-slate-200">
                          Skor Interior & Kabin
                        </td>
                        {comparedVehicles.map(v => (
                          <td key={v.id} className="py-2.5 px-4 border-r border-slate-200 last:border-r-0">
                            <span className="font-mono font-bold text-emerald-700">
                              {v.inspeksi.skor_interior} / 100
                            </span>
                          </td>
                        ))}
                      </tr>

                      {/* Skor Kaki-kaki Row */}
                      <tr className={`hover:bg-slate-50 ${highlightDifferences && checkIsDifferent(comparedVehicles.map(v => v.inspeksi.skor_kaki)) ? 'bg-amber-50/50' : ''}`}>
                        <td className="py-2.5 px-4 font-bold text-slate-700 sticky left-0 z-10 bg-white border-r border-slate-200">
                          Skor Kaki-kaki & Suspensi
                        </td>
                        {comparedVehicles.map(v => (
                          <td key={v.id} className="py-2.5 px-4 border-r border-slate-200 last:border-r-0">
                            <span className="font-mono font-bold text-emerald-700">
                              {v.inspeksi.skor_kaki} / 100
                            </span>
                          </td>
                        ))}
                      </tr>

                      {/* Bebas Banjir Row */}
                      <tr className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-bold text-slate-700 sticky left-0 z-10 bg-white border-r border-slate-200">
                          Jaminan Bebas Banjir
                        </td>
                        {comparedVehicles.map(v => (
                          <td key={v.id} className="py-2.5 px-4 border-r border-slate-200 last:border-r-0">
                            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>100% Bebas Banjir</span>
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* Bebas Tabrak Row */}
                      <tr className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-bold text-slate-700 sticky left-0 z-10 bg-white border-r border-slate-200">
                          Jaminan Bebas Tabrak Sasis
                        </td>
                        {comparedVehicles.map(v => (
                          <td key={v.id} className="py-2.5 px-4 border-r border-slate-200 last:border-r-0">
                            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>100% Bebas Tabrak</span>
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* Catatan Inspeksi Row */}
                      <tr className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-bold text-slate-700 sticky left-0 z-10 bg-white border-r border-slate-200">
                          Catatan Khusus Inspektur
                        </td>
                        {comparedVehicles.map(v => (
                          <td key={v.id} className="py-2.5 px-4 border-r border-slate-200 last:border-r-0 text-slate-600 italic leading-relaxed text-[11px]">
                            "{v.inspeksi.catatan}"
                          </td>
                        ))}
                      </tr>
                    </>
                  )}

                  {/* ================= SECTION: SPESIFIKASI TEKNIS ================= */}
                  {(activeCategorySection === 'all' || activeCategorySection === 'teknis') && (
                    <>
                      <tr className="bg-slate-100/90 font-bold text-slate-900 text-xs uppercase tracking-wider">
                        <td colSpan={comparedVehicles.length + 1} className="py-2 px-4 sticky left-0 z-10 bg-slate-100 text-blue-950">
                          ⚙️ Identitas & Spesifikasi Teknis
                        </td>
                      </tr>

                      {/* Tahun Row */}
                      <tr className={`hover:bg-slate-50 ${highlightDifferences && checkIsDifferent(comparedVehicles.map(v => v.tahun)) ? 'bg-amber-50/50' : ''}`}>
                        <td className="py-2.5 px-4 font-bold text-slate-700 sticky left-0 z-10 bg-white border-r border-slate-200">
                          Tahun Pembuatan
                        </td>
                        {comparedVehicles.map(v => (
                          <td key={v.id} className="py-2.5 px-4 border-r border-slate-200 last:border-r-0 font-semibold text-slate-800">
                            {v.tahun}
                          </td>
                        ))}
                      </tr>

                      {/* KM Row */}
                      <tr className={`hover:bg-slate-50 ${highlightDifferences && checkIsDifferent(comparedVehicles.map(v => v.km)) ? 'bg-amber-50/50' : ''}`}>
                        <td className="py-2.5 px-4 font-bold text-slate-700 sticky left-0 z-10 bg-white border-r border-slate-200">
                          Odometer (KM Asli)
                        </td>
                        {comparedVehicles.map(v => {
                          const isLowest = v.km === lowestKm && comparedVehicles.length > 1;
                          return (
                            <td key={v.id} className="py-2.5 px-4 border-r border-slate-200 last:border-r-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-slate-800 tabular-nums">
                                  {formatNumber(v.km)} km
                                </span>
                                {isLowest && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                                    KM Terendah
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>

                      {/* Transmisi Row */}
                      <tr className={`hover:bg-slate-50 ${highlightDifferences && checkIsDifferent(comparedVehicles.map(v => v.transmisi)) ? 'bg-amber-50/50' : ''}`}>
                        <td className="py-2.5 px-4 font-bold text-slate-700 sticky left-0 z-10 bg-white border-r border-slate-200">
                          Transmisi
                        </td>
                        {comparedVehicles.map(v => (
                          <td key={v.id} className="py-2.5 px-4 border-r border-slate-200 last:border-r-0 font-semibold text-slate-800">
                            {v.transmisi}
                          </td>
                        ))}
                      </tr>

                      {/* Kapasitas Mesin Row */}
                      <tr className={`hover:bg-slate-50 ${highlightDifferences && checkIsDifferent(comparedVehicles.map(v => v.cc)) ? 'bg-amber-50/50' : ''}`}>
                        <td className="py-2.5 px-4 font-bold text-slate-700 sticky left-0 z-10 bg-white border-r border-slate-200">
                          Kapasitas Mesin (CC)
                        </td>
                        {comparedVehicles.map(v => (
                          <td key={v.id} className="py-2.5 px-4 border-r border-slate-200 last:border-r-0 text-slate-800">
                            {v.cc} cc ({v.bahan_bakar})
                          </td>
                        ))}
                      </tr>

                      {/* Warna Row */}
                      <tr className={`hover:bg-slate-50 ${highlightDifferences && checkIsDifferent(comparedVehicles.map(v => v.warna)) ? 'bg-amber-50/50' : ''}`}>
                        <td className="py-2.5 px-4 font-bold text-slate-700 sticky left-0 z-10 bg-white border-r border-slate-200">
                          Warna Bodi
                        </td>
                        {comparedVehicles.map(v => (
                          <td key={v.id} className="py-2.5 px-4 border-r border-slate-200 last:border-r-0 text-slate-800">
                            {v.warna}
                          </td>
                        ))}
                      </tr>

                      {/* Plat Nomor & Ganjil/Genap */}
                      <tr className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-bold text-slate-700 sticky left-0 z-10 bg-white border-r border-slate-200">
                          Nomor Polisi (Plat)
                        </td>
                        {comparedVehicles.map(v => {
                          const digits = v.nopol.match(/\d+/)?.[0] || '0';
                          const isGanjil = parseInt(digits.slice(-1), 10) % 2 !== 0;
                          return (
                            <td key={v.id} className="py-2.5 px-4 border-r border-slate-200 last:border-r-0">
                              <span className="font-mono font-bold text-slate-900 block">
                                {v.nopol}
                              </span>
                              <span className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                isGanjil ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {isGanjil ? 'Ganjil' : 'Genap'}
                              </span>
                            </td>
                          );
                        })}
                      </tr>

                      {/* Pajak Kendaraan Row */}
                      <tr className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-bold text-slate-700 sticky left-0 z-10 bg-white border-r border-slate-200">
                          Status Pajak
                        </td>
                        {comparedVehicles.map(v => (
                          <td key={v.id} className="py-2.5 px-4 border-r border-slate-200 last:border-r-0 font-medium text-emerald-700">
                            {v.pajak_status} ({v.pajak_berlaku})
                          </td>
                        ))}
                      </tr>

                      {/* Lokasi Showroom */}
                      <tr className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-bold text-slate-700 sticky left-0 z-10 bg-white border-r border-slate-200">
                          Lokasi Unit Showroom
                        </td>
                        {comparedVehicles.map(v => (
                          <td key={v.id} className="py-2.5 px-4 border-r border-slate-200 last:border-r-0 text-slate-700">
                            {v.lokasi}
                          </td>
                        ))}
                      </tr>
                    </>
                  )}

                  {/* ================= BOTTOM ACTION ROW ================= */}
                  <tr className="bg-slate-50/80">
                    <td className="py-4 px-4 font-bold text-slate-700 sticky left-0 z-10 bg-slate-50 border-r border-slate-200">
                      Tindakan
                    </td>
                    {comparedVehicles.map(v => (
                      <td key={v.id} className="py-4 px-4 border-r border-slate-200 last:border-r-0">
                        <div className="space-y-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(v.id)}
                            className="w-full py-2 px-3 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>Buka Halaman Unit</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleWhatsAppChat(v)}
                            className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Chat Agen {v.agen_nama?.split(' ')[0]}</span>
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>

                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ===================== BOTTOM FOOTER BAR ===================== */}
        <div className="p-3.5 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Semua kendaraan telah diuji 150+ titik inspeksi dan dilindungi garansi tertulis Mr. Mokas.</span>
          </div>

          <div className="flex items-center gap-2">
            {comparedVehicles.length < 4 && (
              <button
                type="button"
                onClick={() => setIsPickerOpen(true)}
                className="py-1.5 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Unit Lain</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsCompareDrawerOpen(false)}
              className="py-1.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
            >
              Tutup Komparasi
            </button>
          </div>
        </div>

      </div>

      {/* ===================== INLINE VEHICLE PICKER MODAL ===================== */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[85vh]">
            
            {/* Picker Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-extrabold text-blue-950 text-base">
                  Pilih Kendaraan untuk Dibandingkan
                </h4>
                <p className="text-xs text-slate-500">
                  Pilih unit dari inventory showroom Mr. Mokas (maksimal 4 unit).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Picker Search & Category Filters */}
            <div className="py-3 space-y-2 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari merk, tipe, atau plat nomor..."
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setPickerCategory('all')}
                  className={`px-3 py-1 rounded-lg font-bold ${pickerCategory === 'all' ? 'bg-blue-950 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  Semua
                </button>
                <button
                  type="button"
                  onClick={() => setPickerCategory('mobil')}
                  className={`px-3 py-1 rounded-lg font-bold ${pickerCategory === 'mobil' ? 'bg-blue-950 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  Mobil
                </button>
                <button
                  type="button"
                  onClick={() => setPickerCategory('motor')}
                  className={`px-3 py-1 rounded-lg font-bold ${pickerCategory === 'motor' ? 'bg-blue-950 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  Motor
                </button>
              </div>
            </div>

            {/* Picker Vehicle List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2 divide-y divide-slate-100">
              {filteredPickerVehicles.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Tidak ada kendaraan yang cocok atau semua unit sudah masuk dalam komparasi.
                </div>
              ) : (
                filteredPickerVehicles.map(veh => (
                  <div
                    key={veh.id}
                    onClick={() => {
                      addToCompare(veh.id);
                      setIsPickerOpen(false);
                    }}
                    className="p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between gap-3 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={veh.fotos[0]?.url}
                        alt={veh.model}
                        className="w-16 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <GradeBadge grade={veh.grade} size="sm" />
                          <span className="text-[10px] font-bold uppercase text-slate-400">
                            {veh.kategori} · {veh.tahun}
                          </span>
                        </div>
                        <h5 className="font-bold text-slate-900 text-xs truncate group-hover:text-blue-900">
                          {veh.merk} {veh.model}
                        </h5>
                        <p className="text-[11px] text-slate-500 truncate">
                          {veh.varian} · {formatNumber(veh.km)} km
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-black font-mono text-blue-950 tabular-nums">
                        {formatRupiah(veh.harga_tunai)}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 group-hover:text-blue-950 mt-1">
                        <span>+ Pilih Unit</span>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Picker Footer */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="py-2 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Selesai
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
