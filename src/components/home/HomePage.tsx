import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HeroSection } from './HeroSection';
import { VehicleCard } from '../VehicleCard';
import { ShieldCheck, Award, ArrowRight, MessageCircle, Star, CheckCircle2, ChevronRight } from 'lucide-react';
import { GradeBadge } from '../GradeBadge';

interface HomePageProps {
  onSearch: (filters: { kategori?: 'mobil' | 'motor' | 'all'; merk?: string; maxPrice?: number }) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSearch }) => {
  const { vehicles, setActiveView } = useApp();
  const [featuredTab, setFeaturedTab] = useState<'all' | 'mobil' | 'motor'>('all');

  // Featured units: Grade A+ and A
  const featuredUnits = vehicles
    .filter(v => (v.grade === 'A+' || v.grade === 'A') && v.status === 'Tersedia')
    .filter(v => (featuredTab === 'all' ? true : v.kategori === featuredTab));

  // Recent units
  const recentUnits = [...vehicles]
    .filter(v => v.status === 'Tersedia')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  // Testimonials data
  const testimonials = [
    {
      name: 'dr. Satrio Wibowo',
      city: 'Jakarta Selatan',
      bought: 'Toyota Innova Zenix Q HV (Grade A+)',
      text: 'Beli mobil bekas rasa mobil baru dari dealer. Hasil inspeksi 150 titik sangat transparan, bahkan baret halus 2 cm di bawah bemper dicatat dengan jujur. Surat-surat dan garansi 30 hari bikin tenang sekeluarga.',
      rating: 5
    },
    {
      name: 'Alifia Putri',
      city: 'Bandung',
      bought: 'Vespa Sprint S 150 (Grade A)',
      text: 'Prosesnya cepat dan aman banget! Mas Hendra agennya sangat ramah, saya bisa tes drive dulu di showroom dan seluruh cek fisik kelistrikan ditunjukkan langsung di depan mata.',
      rating: 5
    },
    {
      name: 'Rudi Hartawan',
      city: 'Tangerang Selatan',
      bought: 'Honda HR-V 1.5 SE (Grade A)',
      text: 'Kredit leasing via BCA Finance dibantu dari A sampai Z sama tim Mr. Mokas. 3 hari mobil sudah nangkring di garasi rumah. Garansi bebas banjirnya terbukti valid!',
      rating: 5
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Hero Section */}
      <HeroSection onSearch={onSearch} />

      {/* 2. Unit Unggulan (Grade A+ & A) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Pilihan Terbaik Bersertifikat</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
              Unit Unggulan (Grade A+ & A)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Kondisi mendekati baru, kilometer rendah, full orisinil, tanpa riwayat benturan dan banjir.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setFeaturedTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                featuredTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFeaturedTab('mobil')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                featuredTab === 'mobil' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mobil Unggulan
            </button>
            <button
              onClick={() => setFeaturedTab('motor')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                featuredTab === 'motor' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Motor Unggulan
            </button>
          </div>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredUnits.map(veh => (
            <VehicleCard key={veh.id} vehicle={veh} />
          ))}
        </div>
      </section>

      {/* 3. 5 Jaminan Garansi Highlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
              Jaminan Tertulis Bermaterai
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Kenapa Memilih Unit di Mr. Mokas?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Kami menghilangkan rasa cemas pembeli mobil dan motor bekas dengan 5 pilar jaminan pasti.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1.5">
              <h4 className="font-bold text-amber-300 text-sm">1. Garansi Mesin & Transmisi</h4>
              <p className="text-slate-300">Menanggung perlindungan mekanikal 30 hari atau 1.000 km pertama.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1.5">
              <h4 className="font-bold text-amber-300 text-sm">2. 100% Bebas Banjir</h4>
              <p className="text-slate-300">Dipastikan tidak ada karat lumpur atau korosi pada modul kelistrikan.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1.5">
              <h4 className="font-bold text-amber-300 text-sm">3. 100% Bebas Tabrak Parah</h4>
              <p className="text-slate-300">Pilar bodi, sasis depan-tengah-belakang diuji utuh orisinil.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1.5">
              <h4 className="font-bold text-amber-300 text-sm">4. Keabsahan Surat 100% Sah</h4>
              <p className="text-slate-300">Tembus cek fisik Samsat & Ditlantas Polri, bebas dari status blokir.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1.5 sm:col-span-2">
              <h4 className="font-bold text-emerald-400 text-sm">5. Jaminan Uang Kembali 100%</h4>
              <p className="text-slate-300">Uang kembali penuh jika fisik unit tidak cocok dengan lembar sertifikat inspeksi.</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-slate-300">
              Pelajari rincian 150+ titik inspeksi dan hak klaim garansi.
            </p>
            <button
              onClick={() => { setActiveView('warranty'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="py-2.5 px-5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <span>Lihat Detail Syarat & Garansi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Section Terbaru Ditambahkan */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-blue-950 tracking-tight">
              Unit Terbaru Masuk Showroom
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Kendaraan yang baru saja lolos inspeksi dan siap untuk test drive.
            </p>
          </div>

          <button
            onClick={() => { setActiveView('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-xs font-bold text-blue-950 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Semua Katalog</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentUnits.map(veh => (
            <VehicleCard key={veh.id} vehicle={veh} />
          ))}
        </div>
      </section>

      {/* 5. Testimoni Pembeli */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
            Ulasan Nyata Pelanggan
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
            Apa Kata Mereka yang Sudah Membeli di Mr. Mokas?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{item.text}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="font-bold text-xs text-slate-900">{item.name}</p>
                <p className="text-[11px] text-slate-400">{item.city} · Membeli {item.bought}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Floating CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-600 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-black">Mau Konsultasi atau Jadwalkan Test Drive?</h3>
            <p className="text-xs sm:text-sm text-emerald-100">Tim agen showroom kami siap melayani Anda melalui WhatsApp setiap hari.</p>
          </div>

          <a
            href="https://wa.me/6281288889901?text=Halo%20Admin%20Mr.%20Mokas,%20saya%20mau%20jadwal%20kunjungan%20dan%20test%20drive."
            target="_blank"
            rel="noreferrer"
            className="py-3 px-6 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-98 whitespace-nowrap shrink-0"
          >
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <span>Chat WhatsApp Showroom</span>
          </a>
        </div>
      </section>

    </div>
  );
};
