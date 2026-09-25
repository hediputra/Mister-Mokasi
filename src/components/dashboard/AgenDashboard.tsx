import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatNumber, formatDate, calculateGrade } from '../../utils/formatters';
import {
  Car,
  Plus,
  MessageCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileCheck,
  ShieldCheck,
  Upload,
  Eye,
  Trash2,
  X
} from 'lucide-react';
import { GradeBadge } from '../GradeBadge';
import { Kendaraan, VehicleStatus, VehicleCategory, Transmission, FuelType, GradeLevel } from '../../types';

export const AgenDashboard: React.FC = () => {
  const {
    vehicles,
    currentUser,
    leads,
    addVehicle,
    updateVehicleStatus,
    setSelectedVehicleId,
    setActiveView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'listings' | 'new-listing' | 'leads'>('listings');

  // Filter only vehicles belonging to this agent (or show all if admin viewing)
  const myVehicles = vehicles.filter(v => v.agen_id === currentUser.id || currentUser.role === 'admin');
  const myLeads = leads.filter(l => myVehicles.some(v => v.id === l.kendaraan_id));

  // --- Form State for New Vehicle Listing ---
  const [kategori, setKategori] = useState<VehicleCategory>('mobil');
  const [merk, setMerk] = useState('');
  const [model, setModel] = useState('');
  const [varian, setVarian] = useState('');
  const [tahun, setTahun] = useState<number>(2023);
  const [warna, setWarna] = useState('');
  const [nopol, setNopol] = useState('');
  const [noMesin, setNoMesin] = useState('');
  const [noRangka, setNoRangka] = useState('');
  const [transmisi, setTransmisi] = useState<Transmission>('Matic');
  const [bahanBakar, setBahanBakar] = useState<FuelType>('Bensin');
  const [cc, setCc] = useState<number>(1500);
  const [km, setKm] = useState<number>(25000);
  const [hargaTunai, setHargaTunai] = useState<number>(250000000);
  const [hargaKredit, setHargaKredit] = useState<number>(240000000);
  const [dpMin, setDpMin] = useState<number>(25000000);
  const [angsuranMulai, setAngsuranMulai] = useState<number>(5500000);
  const [lokasi, setLokasi] = useState('Showroom Pusat - Jakarta Selatan');
  const [deskripsi, setDeskripsi] = useState('');

  // 6 Inspection Scores
  const [skorMesin, setSkorMesin] = useState<number>(95);
  const [skorInterior, setSkorInterior] = useState<number>(92);
  const [skorEksterior, setSkorEksterior] = useState<number>(94);
  const [skorKaki, setSkorKaki] = useState<number>(90);
  const [skorKelistrikan, setSkorKelistrikan] = useState<number>(95);
  const [skorBan, setSkorBan] = useState<number>(88);
  const [catatanInspeksi, setCatatanInspeksi] = useState('Kondisi sangat baik, servis berkala tercatat, bebas banjir dan benturan rangka.');
  const [inspektur, setInspektur] = useState('Ir. Agus Setyawan, Certified Master Inspector');

  // Photo URLs
  const [photoUrl, setPhotoUrl] = useState('');
  const [photosList, setPhotosList] = useState<{ url: string; kategori: any; caption: string }[]>([
    {
      url: '/src/assets/images/car_innova_zenix_white_1790299475824.jpg',
      kategori: 'eksterior',
      caption: 'Tampak Depan'
    }
  ]);

  // Calculate recommended grade in real-time
  const calculatedGrade = calculateGrade({
    skor_mesin: skorMesin,
    skor_interior: skorInterior,
    skor_eksterior: skorEksterior,
    skor_kaki: skorKaki,
    skor_kelistrikan: skorKelistrikan,
    skor_ban: skorBan
  });

  const handleAddPhoto = () => {
    if (!photoUrl.trim()) return;
    setPhotosList(prev => [
      ...prev,
      {
        url: photoUrl.trim(),
        kategori: 'eksterior',
        caption: `Foto Tambahan ${prev.length + 1}`
      }
    ]);
    setPhotoUrl('');
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotosList(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merk || !model || !nopol) {
      alert('Mohon lengkapi merk, model, dan nomor polisi!');
      return;
    }

    const newVehicleData: Omit<Kendaraan, 'id' | 'created_at' | 'updated_at'> = {
      kategori,
      merk,
      model,
      varian,
      tahun,
      warna: warna || 'Hitam Metalik',
      nopol: nopol.toUpperCase(),
      no_mesin: noMesin || 'M15A-882910',
      no_rangka: noRangka || 'MHK9182390192',
      pajak_berlaku: '2027-05-20',
      pajak_status: 'Hidup',
      transmisi,
      bahan_bakar: bahanBakar,
      cc,
      km,
      harga_tunai: hargaTunai,
      harga_kredit: hargaKredit,
      dp_min: dpMin,
      angsuran_mulai: angsuranMulai,
      grade: calculatedGrade,
      status: 'Tersedia', // auto approve for agen demo
      agen_id: currentUser.id,
      agen_nama: currentUser.nama,
      agen_wa: currentUser.no_wa,
      deskripsi: deskripsi || 'Unit terawat tangan pertama, garansi inspeksi profesional 150 titik.',
      lokasi,
      featured: false,
      promo: false,
      fotos: photosList.map((p, idx) => ({
        id: `photo-${Date.now()}-${idx}`,
        kendaraan_id: '',
        url: p.url,
        kategori: p.kategori,
        urutan: idx + 1,
        caption: p.caption
      })),
      inspeksi: {
        id: `insp-${Date.now()}`,
        kendaraan_id: '',
        skor_mesin: skorMesin,
        skor_interior: skorInterior,
        skor_eksterior: skorEksterior,
        skor_kaki: skorKaki,
        skor_kelistrikan: skorKelistrikan,
        skor_ban: skorBan,
        catatan: catatanInspeksi,
        inspektur,
        tgl_inspeksi: new Date().toISOString().split('T')[0],
        bebas_banjir: true,
        bebas_tabrak: true,
        surat_lengkap: true
      }
    };

    addVehicle(newVehicleData);
    setActiveTab('listings');
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Profile & Metrics */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
            Dashboard Penjualan Agen
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-blue-950">
            {currentUser.nama}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            WhatsApp Terintegrasi: <strong className="font-mono text-slate-800 font-bold">+{currentUser.no_wa}</strong> (Muncul di semua listing Anda)
          </p>
        </div>

        <button
          onClick={() => setActiveTab('new-listing')}
          className="py-2.5 px-4 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-2 shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Input Listing Baru</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase">Listing Saya</span>
          <p className="text-2xl font-black text-blue-950 font-mono mt-1">{myVehicles.length} Unit</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase">Tersedia</span>
          <p className="text-2xl font-black text-emerald-700 font-mono mt-1">
            {myVehicles.filter(v => v.status === 'Tersedia').length} Unit
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase">Booking / Terjual</span>
          <p className="text-2xl font-black text-amber-600 font-mono mt-1">
            {myVehicles.filter(v => v.status !== 'Tersedia').length} Unit
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase">Leads Calon Pembeli</span>
          <p className="text-2xl font-black text-purple-700 font-mono mt-1">{myLeads.length} Pesan</p>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'listings'
              ? 'bg-blue-950 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Listing Kendaraan Saya ({myVehicles.length})
        </button>

        <button
          onClick={() => setActiveTab('new-listing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'new-listing'
              ? 'bg-blue-950 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          + Formulir Input Unit & Inspeksi
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'leads'
              ? 'bg-blue-950 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Leads Pembeli Masuk ({myLeads.length})
        </button>
      </div>

      {/* 3. Tab: Listing Table */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Kelola Status Unit Kendaraan Anda</h3>
              <p className="text-xs text-slate-500">Ubah status ketersediaan secara langsung (Tersedia, Booking, Terjual).</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Kendaraan</th>
                  <th className="py-2.5 px-3">Grade</th>
                  <th className="py-2.5 px-3">Plat / KM</th>
                  <th className="py-2.5 px-3">Harga Tunai</th>
                  <th className="py-2.5 px-3">Status Unit</th>
                  <th className="py-2.5 px-3 text-right">Ubah Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myVehicles.map(veh => (
                  <tr key={veh.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={veh.fotos[0]?.url}
                          alt=""
                          className="w-12 h-9 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{veh.merk} {veh.model} ({veh.tahun})</p>
                          <p className="text-[10px] text-slate-500 line-clamp-1">{veh.varian}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <GradeBadge grade={veh.grade} size="sm" />
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-mono font-bold text-slate-800">{veh.nopol}</p>
                      <p className="text-[10px] text-slate-500 font-mono tabular-nums">{formatNumber(veh.km)} km</p>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-950 tabular-nums">
                      {formatRupiah(veh.harga_tunai)}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        veh.status === 'Tersedia'
                          ? 'bg-emerald-100 text-emerald-800'
                          : veh.status === 'Booking'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {veh.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <select
                        value={veh.status}
                        onChange={(e) => updateVehicleStatus(veh.id, e.target.value as VehicleStatus)}
                        className="py-1 px-2 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-medium"
                      >
                        <option value="Tersedia">Tersedia</option>
                        <option value="Booking">Booking</option>
                        <option value="Terjual">Terjual</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Tab: Leads */}
      {activeTab === 'leads' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 mb-1">Pesan Masuk dari Calon Pembeli</h3>
          <p className="text-xs text-slate-500 mb-4">Pengunjung yang klik tombol WhatsApp atau kirim form konsultasi.</p>

          <div className="space-y-3">
            {myLeads.map(lead => (
              <div key={lead.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-xs">{lead.nama}</span>
                    <span className="text-[10px] font-mono text-slate-500">+{lead.no_wa}</span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-blue-100 text-blue-800">{lead.status}</span>
                  </div>
                  <p className="text-xs text-slate-700 font-semibold">{lead.kendaraan_nama}</p>
                  <p className="text-xs text-slate-500 italic mt-0.5">"{lead.pesan}"</p>
                </div>

                <a
                  href={`https://wa.me/${lead.no_wa.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(lead.nama)},%20saya%20${encodeURIComponent(currentUser.nama)}%20dari%20Mr.%20Mokas.`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Balas di WhatsApp</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Tab: Form Input Listing Baru + Inspeksi Lengkap */}
      {activeTab === 'new-listing' && (
        <form onSubmit={handleCreateVehicle} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Standardisasi Showroom Mr. Mokas</span>
            </div>
            <h3 className="text-xl font-extrabold text-blue-950">
              Formulir Input Listing Kendaraan & Data Inspeksi
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Data yang Anda input akan langsung memunculkan nomor WhatsApp Anda (+{currentUser.no_wa}) pada listing.
            </p>
          </div>

          {/* Section 1: Informasi Dasar */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100 mb-4">
              1. Informasi Identitas Kendaraan
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori Kendaraan</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setKategori('mobil')}
                    className={`flex-1 py-2 rounded-xl font-bold border ${kategori === 'mobil' ? 'bg-blue-950 text-white' : 'bg-slate-50'}`}
                  >
                    Mobil
                  </button>
                  <button
                    type="button"
                    onClick={() => setKategori('motor')}
                    className={`flex-1 py-2 rounded-xl font-bold border ${kategori === 'motor' ? 'bg-blue-950 text-white' : 'bg-slate-50'}`}
                  >
                    Motor
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Merk Kendaraan</label>
                <input
                  type="text"
                  required
                  placeholder="Toyota / Honda / Yamaha / Vespa..."
                  value={merk}
                  onChange={(e) => setMerk(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Model / Tipe</label>
                <input
                  type="text"
                  required
                  placeholder="Innova / HR-V / PCX / NMAX..."
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Varian Lengkap</label>
                <input
                  type="text"
                  placeholder="2.0 Q Hybrid TSS Modelista / 1.5 SE CVT Sensing..."
                  value={varian}
                  onChange={(e) => setVarian(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tahun Pembuatan</label>
                <input
                  type="number"
                  value={tahun}
                  onChange={(e) => setTahun(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nomor Polisi (Plat)</label>
                <input
                  type="text"
                  required
                  placeholder="B 1234 ABC"
                  value={nopol}
                  onChange={(e) => setNopol(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Transmisi</label>
                <select
                  value={transmisi}
                  onChange={(e) => setTransmisi(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                >
                  <option value="Matic">Matic / Otomatis</option>
                  <option value="Manual">Manual</option>
                  <option value="CVT">CVT</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Odometer (KM)</label>
                <input
                  type="number"
                  value={km}
                  onChange={(e) => setKm(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Harga & Skema Kredit */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100 mb-4">
              2. Harga Jual & Simulasi Kredit
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Harga Tunai (Rp)</label>
                <input
                  type="number"
                  step={1000000}
                  value={hargaTunai}
                  onChange={(e) => setHargaTunai(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Harga Kredit (Rp)</label>
                <input
                  type="number"
                  step={1000000}
                  value={hargaKredit}
                  onChange={(e) => setHargaKredit(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">DP Minimal (Rp)</label>
                <input
                  type="number"
                  step={1000000}
                  value={dpMin}
                  onChange={(e) => setDpMin(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Angsuran Mulai /bln</label>
                <input
                  type="number"
                  step={100000}
                  value={angsuranMulai}
                  onChange={(e) => setAngsuranMulai(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: HASIL INSPEKSI & KALKULATOR GRADE OTOMATIS */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  3. Input Hasil Inspeksi Profesional (Kalkulasi Grade Otomatis)
                </h4>
                <p className="text-xs text-slate-500">
                  Geser skor tiap sektor (0-100) untuk mendapatkan rekomendasi grading resmi.
                </p>
              </div>

              {/* Real-time Grade Pill */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-bold uppercase">Rekomendasi Grade:</span>
                <GradeBadge grade={calculatedGrade} size="lg" showLabel />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Skor Mesin & Transmisi</span>
                  <span className="text-emerald-700 font-mono">{skorMesin}/100</span>
                </label>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={skorMesin}
                  onChange={(e) => setSkorMesin(Number(e.target.value))}
                  className="w-full accent-blue-950"
                />
              </div>

              <div>
                <label className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Skor Eksterior & Bodi</span>
                  <span className="text-emerald-700 font-mono">{skorEksterior}/100</span>
                </label>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={skorEksterior}
                  onChange={(e) => setSkorEksterior(Number(e.target.value))}
                  className="w-full accent-blue-950"
                />
              </div>

              <div>
                <label className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Skor Interior / Kabin</span>
                  <span className="text-emerald-700 font-mono">{skorInterior}/100</span>
                </label>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={skorInterior}
                  onChange={(e) => setSkorInterior(Number(e.target.value))}
                  className="w-full accent-blue-950"
                />
              </div>

              <div>
                <label className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Skor Kaki-kaki & Suspensi</span>
                  <span className="text-emerald-700 font-mono">{skorKaki}/100</span>
                </label>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={skorKaki}
                  onChange={(e) => setSkorKaki(Number(e.target.value))}
                  className="w-full accent-blue-950"
                />
              </div>

              <div>
                <label className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Skor Kelistrikan & OBD-II</span>
                  <span className="text-emerald-700 font-mono">{skorKelistrikan}/100</span>
                </label>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={skorKelistrikan}
                  onChange={(e) => setSkorKelistrikan(Number(e.target.value))}
                  className="w-full accent-blue-950"
                />
              </div>

              <div>
                <label className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Skor Ban & Pengereman</span>
                  <span className="text-emerald-700 font-mono">{skorBan}/100</span>
                </label>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={skorBan}
                  onChange={(e) => setSkorBan(Number(e.target.value))}
                  className="w-full accent-blue-950"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block font-bold text-slate-700 text-xs mb-1">Catatan Hasil Uji Inspeksi</label>
              <textarea
                rows={2}
                value={catatanInspeksi}
                onChange={(e) => setCatatanInspeksi(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          {/* Section 4: Galeri Foto Kendaraan */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100 mb-3">
              4. Foto-Foto Kendaraan (Eksterior, Interior, Mesin)
            </h4>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Masukkan URL foto atau gunakan foto template..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
              <button
                type="button"
                onClick={handleAddPhoto}
                className="py-2 px-4 rounded-xl bg-slate-800 text-white font-bold text-xs"
              >
                + Tambah Foto
              </button>
            </div>

            {/* Photos Preview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {photosList.map((photo, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={photo.url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(i)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <span className="absolute bottom-1 left-1 px-2 py-0.5 rounded bg-black/60 text-white text-[10px]">
                    {photo.caption}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('listings')}
              className="py-3 px-5 rounded-xl border border-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="py-3 px-8 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-md transition-transform active:scale-98"
            >
              Simpan & Terbitkan Listing Unit
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
