import React from 'react';
import { ShieldCheck, Award, CheckCircle2, AlertCircle, FileCheck, HelpCircle } from 'lucide-react';
import { GradeBadge } from '../GradeBadge';
import { GradeLevel } from '../../types';

export const WarrantyPage: React.FC = () => {
  const gradesInfo: { grade: GradeLevel; title: string; criteria: string; color: string }[] = [
    {
      grade: 'A+',
      title: 'Seperti Baru (Like New / Mint Condition)',
      criteria: 'Kondisi 98-100% sempurna seperti baru keluar dari dealer. Full orisinil cat & baut pabrik. Kilometer sangat rendah, rekam jejak servis bengkel resmi teratur, tanpa baret minor maupun bekas pemakaian kasar.',
      color: 'border-emerald-500'
    },
    {
      grade: 'A',
      title: 'Sangat Baik (Excellent Condition)',
      criteria: 'Kondisi 90-97%. Hanya pemakaian wajar sehari-hari. Cat 100% orisinil tanpa dempul. Mesin, transmisi, dan kelistrikan prima tanpa catatan perbaikan. Interior wangi orisinil dan bersih.',
      color: 'border-emerald-500'
    },
    {
      grade: 'B+',
      title: 'Baik Plus (Very Good Condition)',
      criteria: 'Kondisi 85-89%. Ada perbaikan kosmetik minor seperti touch-up cat bemper karena gesekan parkir (dikerjakan dengan standar oven resmi). Komponen mekanikal dan transmisi dalam kondisi prima.',
      color: 'border-blue-500'
    },
    {
      grade: 'B',
      title: 'Baik (Good Condition)',
      criteria: 'Kondisi 80-84%. Layak pakai prima. Ada pemakaian normal dan beberapa sentuhan kosmetik. Sasis, pilar bodi, dan mesin teruji aman bebas banjir maupun benturan.',
      color: 'border-blue-500'
    },
    {
      grade: 'C+',
      title: 'Cukup Plus (Fair Plus)',
      criteria: 'Kondisi 74-79%. Mesin dan transmisi normal, namun ada beberapa komponen aus pakai (fast-moving parts seperti kampas rem, ban, atau busi) yang disarankan diganti dalam kurun 3-6 bulan.',
      color: 'border-amber-500'
    },
    {
      grade: 'C',
      title: 'Cukup (Fair)',
      criteria: 'Kondisi 68-73%. Terdapat perbaikan sedang di sektor kosmetik dan kaki-kaki. Seluruh catatan kekurangan diungkapkan secara transparan di laporan inspeksi.',
      color: 'border-amber-500'
    },
    {
      grade: 'D',
      title: 'Perlu Perbaikan (Needs Repair)',
      criteria: 'Kondisi 55-67%. Memerlukan perbaikan signifikan pada sektor tertentu. Harga unit disesuaikan jauh lebih ekonomis untuk pembeli yang ingin merapikan sendiri.',
      color: 'border-orange-500'
    },
    {
      grade: 'E',
      title: 'Dijual Apa Adanya (As-Is / Restoration)',
      criteria: 'Kondisi di bawah 55%. Dijual apa adanya sebagai bahan restorasi atau modifikasi tanpa garansi showroom.',
      color: 'border-rose-500'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* 1. Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold mb-4">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Standar Mutu Showroom Terpercaya</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-blue-950 tracking-tight">
          Sistem Grading & 5 Jaminan Garansi Mr. Mokas
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed">
          Kami memecahkan keraguan terbesar saat membeli kendaraan bekas: kondisi tersembunyi. Setiap unit wajib lulus inspeksi 150+ titik dengan sertifikat grading transparan dan garansi tertulis.
        </p>
      </div>

      {/* 2. 5 Titik Garansi Utama */}
      <div className="bg-gradient-to-br from-blue-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-8 h-8 text-amber-400" />
          <div>
            <h2 className="text-2xl font-black">5 Titik Garansi Pasti Mr. Mokas</h2>
            <p className="text-xs text-slate-300">Garansi tertulis resmi bermaterai yang menyertai setiap faktur penjualan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="p-5 rounded-2xl bg-white/10 border border-white/10 space-y-2">
            <h3 className="font-bold text-base text-amber-300">1. Garansi 30 Hari Mesin & Transmisi</h3>
            <p className="text-slate-300 leading-relaxed">
              Melindungi komponen kritikal: cylinder head, blok mesin, camshaft, crankshaft, sistem pelumasan, gearbox matic/manual, torque converter, dan ECU mesin hingga 1.000 km pertama.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/10 border border-white/10 space-y-2">
            <h3 className="font-bold text-base text-amber-300">2. Garansi 100% Bebas Banjir</h3>
            <p className="text-slate-300 leading-relaxed">
              Diperiksa menyeluruh di balik karpet dasar, dashboard dalam, modul ECU, celah soket kabel, dan rongga lampu. Kami menjamin bebas endapan lumpur banjir.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/10 border border-white/10 space-y-2">
            <h3 className="font-bold text-base text-amber-300">3. Garansi 100% Bebas Tabrak Berat</h3>
            <p className="text-slate-300 leading-relaxed">
              Memastikan struktur sasis utama (apron depan, pilar A-B-C, lantai bagasi, dan rear quarter panel) dalam kondisi lurus orisinil tanpa potongan sambungan las aftermarket.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/10 border border-white/10 space-y-2">
            <h3 className="font-bold text-base text-amber-300">4. Garansi Keabsahan Dokumen Negara</h3>
            <p className="text-slate-300 leading-relaxed">
              BPKB, STNK, Faktur Pembelian, NIK, dan kuitansi jual beli terverifikasi langsung ke Samsat & Ditlantas Polri. Bebas dari sengketa leasing atau perdata.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/10 border border-white/15 md:col-span-2 space-y-2">
            <h3 className="font-bold text-base text-emerald-400">5. Jaminan Uang Kembali 100% (Buyback Guarantee)</h3>
            <p className="text-slate-300 leading-relaxed">
              Jika dalam 30 hari pertama terbukti ditemukan indikasi bekas banjir, tabrak parah sasis, atau manipulasi odometer yang lolos dari inspektur kami, showroom Mr. Mokas membeli kembali unit Anda 100% sesuai harga beli tanpa potongan sepeser pun.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Penjelasan Lengkap Grading A+ hingga E */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-blue-950">
            Penetapan Kualitas Grading Kendaraan (A+ hingga E)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Penilaian dihitung berdasarkan 6 sektor utama: Mesin (30%), Kaki-kaki (20%), Eksterior (15%), Interior (15%), Kelistrikan (10%), Ban (10%).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gradesInfo.map(item => (
            <div
              key={item.grade}
              className={`p-5 rounded-2xl bg-white border-l-4 ${item.color} border-slate-200 shadow-xs space-y-2`}
            >
              <div className="flex items-center justify-between">
                <GradeBadge grade={item.grade} size="md" />
                <span className="text-xs font-bold text-slate-800">{item.title}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.criteria}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 150+ Titik Inspeksi Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-blue-950">
          Prosedur 150+ Titik Cek Fisik Profesional Mr. Mokas
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-600">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 uppercase tracking-wider text-[11px]">
              Sektor Mesin & Transmisi
            </h4>
            <ul className="space-y-1 list-disc pl-4">
              <li>Kompresi silinder mesin</li>
              <li>Kebocoran gasket karter oli & silinder</li>
              <li>Kualitas oli & level pendingin radiator</li>
              <li>Perpindahan gigi matic/CVT/manual</li>
              <li>Kondisi belt kipas & timing belt/chain</li>
              <li>Sensitivitas pedal gas & respons throttle</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 uppercase tracking-wider text-[11px]">
              Sektor Eksterior & Sasis
            </h4>
            <ul className="space-y-1 list-disc pl-4">
              <li>Uji ketebalan cat dengan coating gauge</li>
              <li>Kelurusan celah nat kap mesin & pintu</li>
              <li>Pemeriksaan apron dan pilar keselamatan</li>
              <li>Kaca depan & jendela orisinil pabrik</li>
              <li>Bebas karat lantai bawah bodi mobil</li>
              <li>Lampu utama projector, LED & foglamp</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 uppercase tracking-wider text-[11px]">
              Kelistrikan & Komputer (OBD-II)
            </h4>
            <ul className="space-y-1 list-disc pl-4">
              <li>Scan DTC error code engine scanner</li>
              <li>Sistem ABS, EBD & airbag SRS check</li>
              <li>Tegangan aki & pengisian alternator</li>
              <li>AC pendingin & thermostat digital</li>
              <li>Power window, central lock & alarm</li>
              <li>Sistem kamera 360 & sensor parkir</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};
