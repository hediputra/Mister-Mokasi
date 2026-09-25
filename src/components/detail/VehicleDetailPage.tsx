import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GradeBadge } from '../GradeBadge';
import { formatRupiah, formatNumber, formatDate, createWhatsAppChatUrl, calculateCreditSimulation } from '../../utils/formatters';
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Gauge,
  Cog,
  Fuel,
  FileText,
  MapPin,
  Heart,
  GitCompare,
  MessageCircle,
  Share2,
  ArrowLeft,
  Award,
  AlertCircle,
  UserCheck,
  Printer,
  ChevronRight,
  Sparkles,
  Calculator,
  Lock
} from 'lucide-react';
import { VehicleCard } from '../VehicleCard';

interface VehicleDetailPageProps {
  vehicleId: string;
  onOpenBooking: (vehicleId: string) => void;
}

export const VehicleDetailPage: React.FC<VehicleDetailPageProps> = ({
  vehicleId,
  onOpenBooking
}) => {
  const {
    vehicles,
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

  const vehicle = vehicles.find(v => v.id === vehicleId) || vehicles[0];

  // Gallery state
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [photoFilter, setPhotoFilter] = useState<string>('semua');
  const [showShareToast, setShowShareToast] = useState(false);

  // Loan calculator state inside detail page
  const [calcDpPercent, setCalcDpPercent] = useState<number>(20);
  const [calcTenor, setCalcTenor] = useState<number>(3); // years

  const isFav = favorites.includes(vehicle.id);
  const isCompared = compareList.includes(vehicle.id);

  // Plat ganjil genap determination
  const platDigits = vehicle.nopol.match(/\d+/)?.[0] || '0';
  const isGanjil = parseInt(platDigits.slice(-1), 10) % 2 !== 0;

  // Filtered photos
  const filteredPhotos = photoFilter === 'semua'
    ? vehicle.fotos
    : vehicle.fotos.filter(f => f.kategori === photoFilter);

  const activePhoto = vehicle.fotos[activePhotoIdx] || vehicle.fotos[0];

  // Loan computation
  const creditDetails = calculateCreditSimulation(
    vehicle.harga_kredit || vehicle.harga_tunai,
    calcDpPercent,
    calcTenor,
    7.5
  );

  // Similar vehicles
  const similarVehicles = vehicles
    .filter(v => v.id !== vehicle.id && v.kategori === vehicle.kategori && v.status === 'Tersedia')
    .slice(0, 3);

  // WhatsApp click handler
  const handleWhatsAppChat = () => {
    createLead({
      kendaraan_id: vehicle.id,
      kendaraan_nama: `${vehicle.merk} ${vehicle.model} ${vehicle.tahun}`,
      nama: currentUser.role === 'customer' ? 'Calon Pembeli Web' : currentUser.nama,
      no_wa: currentUser.no_wa || '081234567890',
      pesan: `Tanya detail dan nego unit ${vehicle.merk} ${vehicle.model} nopol ${vehicle.nopol}`
    });

    const url = createWhatsAppChatUrl({
      phone: vehicle.agen_wa || '6281312345678',
      vehicleName: `${vehicle.merk} ${vehicle.model} (${vehicle.tahun})`,
      vehicleNopol: vehicle.nopol,
      price: vehicle.harga_tunai,
      agentName: vehicle.agen_nama || 'Agen Resmi Mr. Mokas'
    });

    window.open(url, '_blank');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }
  };

  const printInspectionCertificate = () => {
    window.print();
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* 1. Breadcrumbs & Top Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={() => setActiveView('catalog')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors text-xs flex items-center gap-1 font-medium"
              title="Salin tautan unit ini"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Bagikan</span>
            </button>

            <button
              onClick={() => {
                if (!isCompared) {
                  addToCompare(vehicle.id);
                }
                setIsCompareDrawerOpen(true);
              }}
              className={`p-2 rounded-xl transition-colors text-xs flex items-center gap-1 font-medium cursor-pointer ${
                isCompared ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300' : 'hover:bg-slate-100 text-slate-600'
              }`}
              title="Bandingkan unit dalam komparasi"
            >
              <GitCompare className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">{isCompared ? 'Lihat Komparasi' : 'Bandingkan'}</span>
            </button>

            <button
              onClick={() => toggleFavorite(vehicle.id)}
              className={`p-2 rounded-xl transition-colors text-xs flex items-center gap-1 font-medium ${
                isFav ? 'bg-rose-50 text-rose-600 font-bold' : 'hover:bg-slate-100 text-slate-600'
              }`}
              title="Simpan favorit"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-current text-rose-500' : ''}`} />
              <span className="hidden sm:inline">Favorit</span>
            </button>

            <button
              onClick={printInspectionCertificate}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors text-xs flex items-center gap-1 font-medium"
              title="Cetak Sertifikat Inspeksi Kendaraan"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak Sertifikat</span>
            </button>
          </div>
        </div>
      </div>

      {showShareToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2 rounded-xl shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-top-4">
          Tautan link unit berhasil disalin ke clipboard!
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="printable-document">
        
        {/* Title Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <GradeBadge grade={vehicle.grade} size="lg" showLabel />
              {vehicle.promo && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider">
                  Promo Showroom
                </span>
              )}
              <span className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 font-semibold text-xs uppercase">
                {vehicle.kategori} · {vehicle.tahun}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
              {vehicle.merk} {vehicle.model}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              {vehicle.varian}
            </p>
          </div>

          <div className="text-left md:text-right">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-600 block">
              Harga Tunai
            </span>
            <span className="text-2xl sm:text-4xl font-black text-blue-950 font-mono tracking-tight tabular-nums">
              {formatRupiah(vehicle.harga_tunai)}
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Harga kredit: <strong className="text-blue-900 font-mono tabular-nums">{formatRupiah(vehicle.harga_kredit)}</strong> (hemat Rp {formatNumber(vehicle.harga_tunai - vehicle.harga_kredit)})
            </p>
          </div>
        </div>

        {/* 2-Column Grid: Left Media & Detailed Inspection / Right Sticky Purchase Module */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Gallery, Specs, Inspection Report, Guarantees (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Main Photo Gallery */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs overflow-hidden">
              {/* Active Image */}
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 mb-3 group">
                <img
                  src={activePhoto?.url || vehicle.fotos[0]?.url}
                  alt={activePhoto?.caption || vehicle.model}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                
                {/* Overlay Caption & Counter */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md font-medium">
                    {activePhoto?.caption || `Foto Sudut ${activePhoto?.kategori}`}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md font-mono tabular-nums">
                    {activePhotoIdx + 1} / {vehicle.fotos.length} Foto
                  </span>
                </div>
              </div>

              {/* Photo Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
                {['semua', 'eksterior', 'interior', 'mesin', 'ban', 'dokumen', 'dashboard'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setPhotoFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap capitalize transition-colors ${
                      photoFilter === cat
                        ? 'bg-blue-950 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Thumbnails Row */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2">
                {filteredPhotos.map((photo, idx) => {
                  const globalIdx = vehicle.fotos.findIndex(f => f.id === photo.id);
                  const isSelected = activePhotoIdx === globalIdx;
                  return (
                    <button
                      key={photo.id}
                      onClick={() => setActivePhotoIdx(globalIdx >= 0 ? globalIdx : idx)}
                      className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${
                        isSelected ? 'border-blue-950 ring-2 ring-blue-950/20' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption || ''}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Official Vehicle Identification Specs Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
              <h2 className="text-lg font-bold text-blue-950 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <span>Identitas & Spesifikasi Resmi Kendaraan</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-xs">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-slate-500 block">Nomor Polisi (Plat)</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono font-bold text-slate-900 text-sm">{vehicle.nopol}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isGanjil ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'}`}>
                      {isGanjil ? 'Plat Ganjil' : 'Plat Genap'}
                    </span>
                  </div>
                </div>

                <div className="border-b border-slate-100 pb-2">
                  <span className="text-slate-500 block">Tahun Pembuatan</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{vehicle.tahun}</span>
                </div>

                <div className="border-b border-slate-100 pb-2">
                  <span className="text-slate-500 block">Kilometer (Odometer)</span>
                  <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block tabular-nums">
                    {formatNumber(vehicle.km)} km (Asli Record)
                  </span>
                </div>

                <div className="border-b border-slate-100 pb-2">
                  <span className="text-slate-500 block">Transmisi</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{vehicle.transmisi}</span>
                </div>

                <div className="border-b border-slate-100 pb-2">
                  <span className="text-slate-500 block">Bahan Bakar & Kapasitas</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{vehicle.bahan_bakar} · {vehicle.cc} cc</span>
                </div>

                <div className="border-b border-slate-100 pb-2">
                  <span className="text-slate-500 block">Warna Kendaraan</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{vehicle.warna}</span>
                </div>

                <div className="border-b border-slate-100 pb-2">
                  <span className="text-slate-500 block">Pajak Kendaraan</span>
                  <span className="font-semibold text-emerald-700 text-sm mt-0.5 block">
                    {vehicle.pajak_status} s.d. {formatDate(vehicle.pajak_berlaku)}
                  </span>
                </div>

                <div className="border-b border-slate-100 pb-2">
                  <span className="text-slate-500 block">Status Surat (STNK / BPKB)</span>
                  <span className="font-semibold text-slate-900 text-sm mt-0.5 block">
                    Lengkap, Asli, Tangan Pertama
                  </span>
                </div>

                <div className="border-b border-slate-100 pb-2">
                  <span className="text-slate-500 block">Nomor Rangka & Mesin</span>
                  <span className="font-mono text-slate-700 text-xs mt-0.5 block truncate" title={`Rangka: ${vehicle.no_rangka} | Mesin: ${vehicle.no_mesin}`}>
                    Rangka: {vehicle.no_rangka.slice(0, 8)}... (Terverifikasi)
                  </span>
                </div>
              </div>

              {/* Deskripsi */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Catatan Unit dari Agen:
                </span>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {vehicle.deskripsi}
                </p>
              </div>
            </div>

            {/* 3. HASIL INSPEKSI PROFESIONAL 150+ TITIK (PALING PENTING) */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-md mb-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Lolos Inspeksi Sertifikasi Mr. Mokas</span>
                  </div>
                  <h2 className="text-xl font-bold text-blue-950">
                    Hasil Laporan Inspeksi Profesional
                  </h2>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs text-slate-500">Inspektur Tersertifikasi:</div>
                  <div className="font-bold text-slate-900 text-xs">{vehicle.inspeksi.inspektur}</div>
                  <div className="text-[11px] text-slate-400">Tanggal: {formatDate(vehicle.inspeksi.tgl_inspeksi)}</div>
                </div>
              </div>

              {/* Quick Checklist (Banjir, Tabrak, Surat) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-950">Bebas Banjir 100%</p>
                    <p className="text-[11px] text-emerald-800">Tidak ada karat lumpur / korosi ECU</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-950">Bebas Tabrak Berat</p>
                    <p className="text-[11px] text-emerald-800">Sasis & pilar bodi utuh orisinil</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-950">Surat-Surat Asli & Sah</p>
                    <p className="text-[11px] text-emerald-800">Tembus Samsat & Bebas Sengketa</p>
                  </div>
                </div>
              </div>

              {/* 6 Category Inspection Scores Breakdown */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Rincian Skor Per Sektor Komponen (0 - 100)
                </h3>

                {/* Skor Mesin */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-bold text-slate-800">1. Kondisi Mesin & Transmisi</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm tabular-nums">
                      {vehicle.inspeksi.skor_mesin} / 100
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
                      style={{ width: `${vehicle.inspeksi.skor_mesin}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Suara mesin halus rata, bebas rembesan oli, kompresi presisi, perpindahan transmisi halus tanpa hentakan.
                  </p>
                </div>

                {/* Skor Eksterior */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-bold text-slate-800">2. Kondisi Eksterior & Body</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm tabular-nums">
                      {vehicle.inspeksi.skor_eksterior} / 100
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
                      style={{ width: `${vehicle.inspeksi.skor_eksterior}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Ketebalan cat orisinil diukur dengan digital coating thickness gauge, celah nat panel simetris rata.
                  </p>
                </div>

                {/* Skor Interior */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-bold text-slate-800">3. Kondisi Interior & Kabin</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm tabular-nums">
                      {vehicle.inspeksi.skor_interior} / 100
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
                      style={{ width: `${vehicle.inspeksi.skor_interior}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Jok kulit/fabric bersih tanpa robek atau bau rokok, plafon bersih, AC dingin digital bekerja optimal.
                  </p>
                </div>

                {/* Skor Kaki-kaki */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-bold text-slate-800">4. Suspensi & Kaki-kaki</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm tabular-nums">
                      {vehicle.inspeksi.skor_kaki} / 100
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
                      style={{ width: `${vehicle.inspeksi.skor_kaki}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Tie rod, ball joint, bushing arm kencang kedap suara, shockbreaker tidak bocor diuji di trek jalan bergelombang.
                  </p>
                </div>

                {/* Skor Kelistrikan */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-bold text-slate-800">5. Sistem Kelistrikan & Sensor Komputer (OBD-II)</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm tabular-nums">
                      {vehicle.inspeksi.skor_kelistrikan} / 100
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
                      style={{ width: `${vehicle.inspeksi.skor_kelistrikan}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Scan scanner OBD-II bersih dari error code engine / airbag / ABS. Aki dan alternator normal.
                  </p>
                </div>

                {/* Skor Ban */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-bold text-slate-800">6. Kondisi Ban & Rem</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm tabular-nums">
                      {vehicle.inspeksi.skor_ban} / 100
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
                      style={{ width: `${vehicle.inspeksi.skor_ban}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Ketebalan tapak ban di atas 80%, tahun produksi ban serasi dan tidak botak sebelah.
                  </p>
                </div>
              </div>

              {/* Inspector Summary Note */}
              <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block mb-1">
                  Catatan Khusus Inspektur:
                </span>
                <p className="text-xs text-amber-900 leading-relaxed italic">
                  "{vehicle.inspeksi.catatan}"
                </p>
              </div>
            </div>

            {/* 4. JAMINAN & 5 TITIK GARANSI MR. MOKAS */}
            <div className="bg-gradient-to-br from-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-6 h-6 text-amber-400" />
                <h2 className="text-xl font-bold tracking-tight">5 Titik Jaminan Garansi Resmi Mr. Mokas</h2>
              </div>
              <p className="text-xs text-slate-300 mb-6">
                Setiap pembelian unit di Mr. Mokas dilindungi garansi tertulis bermaterai dengan layanan darurat:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-white/10 border border-white/10">
                  <h4 className="font-bold text-amber-300 text-sm mb-1">1. Garansi Mesin & Transmisi 30 Hari</h4>
                  <p className="text-slate-300">Menanggung kerusakan mechanical komponen utama mesin & gearbox hingga 1.000 km.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/10 border border-white/10">
                  <h4 className="font-bold text-amber-300 text-sm mb-1">2. Garansi Bebas Banjir 100%</h4>
                  <p className="text-slate-300">Bukan unit bekas rendaman banjir Jakarta maupun daerah mana pun.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/10 border border-white/10">
                  <h4 className="font-bold text-amber-300 text-sm mb-1">3. Garansi Bebas Tabrak Parah</h4>
                  <p className="text-slate-300">Struktur rangka utama (apron, sasis tengah, pilar A/B/C) tidak pernah tertekuk.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/10 border border-white/10">
                  <h4 className="font-bold text-amber-300 text-sm mb-1">4. Garansi Dokumen Asli & Sah</h4>
                  <p className="text-slate-300">BPKB, STNK & Faktur terbukti keasliannya dan bebas blokir sengketa perdata/pidana.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 sm:col-span-2">
                  <h4 className="font-bold text-emerald-400 text-sm mb-1">5. Jaminan Uang Kembali 100% (Buyback Guarantee)</h4>
                  <p className="text-slate-300">Jika terbukti ada manipulasi odometer atau bekas banjir/tabrak yang lolos, uang Anda dikembalikan 100% tanpa potongan.</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Contiguous Purchase Module (Sticky on desktop) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            
            {/* Main Action Box */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xl space-y-5">
              
              {/* Pricing Header */}
              <div className="pb-4 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Harga Tunai Spesial
                </span>
                <div className="text-3xl font-black text-blue-950 font-mono tracking-tight tabular-nums mt-0.5">
                  {formatRupiah(vehicle.harga_tunai)}
                </div>

                <div className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200/80">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-amber-900">Harga Paket Kredit:</span>
                    <span className="font-bold text-amber-950 font-mono tabular-nums">{formatRupiah(vehicle.harga_kredit)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs mt-1">
                    <span className="text-slate-600">Cicilan mulai dari:</span>
                    <span className="font-bold text-blue-950 font-mono tabular-nums">{formatRupiah(vehicle.angsuran_mulai)}/bln</span>
                  </div>
                </div>
              </div>

              {/* Verified Agent Contact Badge */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-blue-950 text-white font-bold text-xs flex items-center justify-center">
                    {vehicle.agen_nama ? vehicle.agen_nama.charAt(0) : 'A'}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider block">
                      Agen Penjual Resmi:
                    </span>
                    <p className="text-xs font-bold text-slate-900">{vehicle.agen_nama || 'Hendra Wijaya'}</p>
                    <p className="text-[11px] text-emerald-700 font-medium">WhatsApp Aktif</p>
                  </div>
                </div>
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              </div>

              {/* Primary Call-to-Actions */}
              <div className="space-y-2.5">
                {/* 1. Chat WhatsApp Agen */}
                <button
                  type="button"
                  onClick={handleWhatsAppChat}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat WhatsApp Agen Sekarang</span>
                </button>

                {/* 2. Booking Online Simulator */}
                <button
                  type="button"
                  onClick={() => onOpenBooking(vehicle.id)}
                  className="w-full py-3 px-4 rounded-2xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Booking Unit (Tanda Jadi / DP Online)</span>
                </button>
              </div>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-slate-600">
                  Unit berada di: <strong className="text-slate-800">{vehicle.lokasi}</strong>
                </p>
              </div>

              {/* Embedded Loan Calculator in Purchase Module */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 font-bold text-xs text-blue-950 mb-3">
                  <Calculator className="w-4 h-4 text-amber-500" />
                  <span>Simulasi Angsuran Cepat</span>
                </div>

                {/* DP Selector */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Uang Muka (DP {calcDpPercent}%):</span>
                    <span className="font-bold font-mono text-slate-800 tabular-nums">
                      {formatRupiah(creditDetails.dpNominal)}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[15, 20, 30, 40].map(pct => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setCalcDpPercent(pct)}
                        className={`flex-1 py-1 rounded-lg text-xs font-semibold border ${
                          calcDpPercent === pct
                            ? 'bg-blue-950 text-white border-blue-950'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tenor Selector */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Tenor Pembiayaan:</span>
                    <span className="font-bold text-slate-800">{calcTenor} Tahun ({calcTenor * 12}x)</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(yr => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setCalcTenor(yr)}
                        className={`flex-1 py-1 rounded-lg text-xs font-semibold border ${
                          calcTenor === yr
                            ? 'bg-blue-950 text-white border-blue-950'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {yr} Th
                      </button>
                    ))}
                  </div>
                </div>

                {/* Monthly Output */}
                <div className="p-3 rounded-2xl bg-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Estimasi Angsuran</span>
                    <span className="text-base font-extrabold text-blue-950 font-mono tabular-nums">
                      {formatRupiah(creditDetails.monthlyInstallment)}
                    </span>
                    <span className="text-[10px] text-slate-500"> / bulan</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Bunga 7.5% p.a.</span>
                </div>
              </div>

            </div>

            {/* Need Trade-In / Inspection consultation */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Layanan Tukar Tambah (Trade-In)</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Punya mobil atau motor lama? Bawa ke showroom kami untuk diinspeksi gratis dan langsung potong DP untuk unit ini.
              </p>
            </div>

          </div>

        </div>

        {/* 3. SIMILAR VEHICLES SECTION */}
        {similarVehicles.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-200">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-blue-950">Rekomendasi Kendaraan Serupa</h3>
                <p className="text-xs text-slate-500 mt-1">Pilihan alternatif dengan grade tinggi dan spesifikasi berdekatan</p>
              </div>
              <button
                onClick={() => setActiveView('catalog')}
                className="text-xs font-bold text-blue-900 hover:text-blue-950 flex items-center gap-1"
              >
                <span>Lihat Semua Katalog</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarVehicles.map(veh => (
                <VehicleCard key={veh.id} vehicle={veh} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Sticky Mobile Purchase Bar (Complies with 15% Mobile Sticky Cap) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-3 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-600 block">Harga Tunai</span>
          <span className="text-base font-extrabold text-blue-950 font-mono tabular-nums leading-tight">
            {formatRupiah(vehicle.harga_tunai)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenBooking(vehicle.id)}
            className="py-2.5 px-3 rounded-xl bg-slate-900 text-white font-bold text-xs"
          >
            Booking DP
          </button>
          <button
            type="button"
            onClick={handleWhatsAppChat}
            className="py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WA Agen</span>
          </button>
        </div>
      </div>

    </div>
  );
};
