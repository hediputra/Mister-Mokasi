import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Kendaraan, VehicleCategory, GradeLevel } from '../../types';
import { VehicleCard } from '../VehicleCard';
import { Search, Filter, RotateCcw, LayoutGrid, List, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

interface CatalogPageProps {
  initialKategori?: 'all' | 'mobil' | 'motor';
  initialMerk?: string;
  initialMaxPrice?: number;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  initialKategori = 'all',
  initialMerk = '',
  initialMaxPrice
}) => {
  const { vehicles } = useApp();

  // Filters state
  const [search, setSearch] = useState(initialMerk);
  const [kategori, setKategori] = useState<'all' | 'mobil' | 'motor'>(initialKategori);
  const [selectedGrades, setSelectedGrades] = useState<GradeLevel[]>([]);
  const [selectedTransmission, setSelectedTransmission] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice || 600000000);
  const [maxKm, setMaxKm] = useState<number>(100000);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'terbaru' | 'harga-asc' | 'harga-desc' | 'km-asc' | 'grade'>('terbaru');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Available grades
  const allGrades: GradeLevel[] = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'E'];

  // Toggle grade filter
  const toggleGrade = (grade: GradeLevel) => {
    setSelectedGrades(prev =>
      prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]
    );
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearch('');
    setKategori('all');
    setSelectedGrades([]);
    setSelectedTransmission('all');
    setMaxPrice(600000000);
    setMaxKm(100000);
    setSelectedLocation('all');
    setSortBy('terbaru');
  };

  // Filter & Sort Logic
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      // 1. Status: only approved units
      if (v.status === 'Menunggu Approval' || v.status === 'Ditolak') return false;

      // 2. Category
      if (kategori !== 'all' && v.kategori !== kategori) return false;

      // 3. Search query (merk, model, varian, nopol)
      if (search.trim()) {
        const query = search.toLowerCase();
        const match =
          v.merk.toLowerCase().includes(query) ||
          v.model.toLowerCase().includes(query) ||
          v.varian.toLowerCase().includes(query) ||
          v.nopol.toLowerCase().includes(query);
        if (!match) return false;
      }

      // 4. Grades
      if (selectedGrades.length > 0 && !selectedGrades.includes(v.grade)) return false;

      // 5. Transmission
      if (selectedTransmission !== 'all' && v.transmisi !== selectedTransmission) return false;

      // 6. Max Price
      if (v.harga_tunai > maxPrice) return false;

      // 7. Max KM
      if (v.km > maxKm) return false;

      // 8. Location
      if (selectedLocation !== 'all' && !v.lokasi.toLowerCase().includes(selectedLocation.toLowerCase())) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'terbaru') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === 'harga-asc') {
        return a.harga_tunai - b.harga_tunai;
      }
      if (sortBy === 'harga-desc') {
        return b.harga_tunai - a.harga_tunai;
      }
      if (sortBy === 'km-asc') {
        return a.km - b.km;
      }
      if (sortBy === 'grade') {
        const gradeRank: Record<GradeLevel, number> = {
          'A+': 8, 'A': 7, 'B+': 6, 'B': 5, 'C+': 4, 'C': 3, 'D': 2, 'E': 1
        };
        return gradeRank[b.grade] - gradeRank[a.grade];
      }
      return 0;
    });
  }, [vehicles, kategori, search, selectedGrades, selectedTransmission, maxPrice, maxKm, selectedLocation, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
              Katalog Mobil & Motor Bekas Terinspeksi
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Menampilkan {filteredVehicles.length} unit terverifikasi dengan grading A+ hingga E
            </p>
          </div>

          {/* Quick Category Buttons */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setKategori('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                kategori === 'all'
                  ? 'bg-blue-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({vehicles.length})
            </button>
            <button
              onClick={() => setKategori('mobil')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                kategori === 'mobil'
                  ? 'bg-blue-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mobil ({vehicles.filter(v => v.kategori === 'mobil').length})
            </button>
            <button
              onClick={() => setKategori('motor')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                kategori === 'motor'
                  ? 'bg-blue-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Motor ({vehicles.filter(v => v.kategori === 'motor').length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout (Sidebar + Results) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs sticky top-20">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                <span>Filter Kendaraan</span>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-blue-900 hover:text-blue-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* 1. Search Box */}
            <div className="py-4 border-b border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Pencarian
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ketik merk, model, plat..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* 2. Grade Filter */}
            <div className="py-4 border-b border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Grade Kualitas Inspeksi
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {allGrades.map(g => {
                  const isChecked = selectedGrades.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGrade(g)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                        isChecked
                          ? 'bg-blue-950 text-white border-blue-950 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 mt-2">
                Grade A+ & A: Kondisi terbaik tanpa cacat & full orisinil.
              </p>
            </div>

            {/* 3. Transmission */}
            <div className="py-4 border-b border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Transmisi
              </label>
              <select
                value={selectedTransmission}
                onChange={(e) => setSelectedTransmission(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">Semua Transmisi</option>
                <option value="Matic">Matic / Otomatis</option>
                <option value="Manual">Manual</option>
                <option value="CVT">CVT</option>
              </select>
            </div>

            {/* 4. Price Slider */}
            <div className="py-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Maks. Harga
                </label>
                <span className="text-xs font-bold text-blue-950 font-mono tabular-nums">
                  {formatRupiah(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min={20000000}
                max={600000000}
                step={10000000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-950"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>20 Juta</span>
                <span>600 Juta</span>
              </div>
            </div>

            {/* 5. Max KM Slider */}
            <div className="py-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Maks. Odometer (KM)
                </label>
                <span className="text-xs font-bold text-blue-950 font-mono tabular-nums">
                  {maxKm.toLocaleString('id-ID')} km
                </span>
              </div>
              <input
                type="range"
                min={5000}
                max={100000}
                step={5000}
                value={maxKm}
                onChange={(e) => setMaxKm(Number(e.target.value))}
                className="w-full accent-blue-950"
              />
            </div>

            {/* 6. Lokasi */}
            <div className="pt-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Lokasi Showroom
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">Semua Cabang</option>
                <option value="Jakarta">Jakarta Selatan (Pusat)</option>
                <option value="Bandung">Bandung (Pasteur)</option>
                <option value="Tangerang">BSD (Tangerang Selatan)</option>
              </select>
            </div>

          </div>
        </aside>

        {/* Vehicle Results Column */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Controls Bar (Sort & View Toggle & Mobile Filter trigger) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:px-5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold flex items-center gap-1.5 text-slate-800"
            >
              <Filter className="w-3.5 h-3.5 text-amber-500" />
              <span>Filter ({selectedGrades.length > 0 ? selectedGrades.length : ''})</span>
            </button>

            {/* Results count text */}
            <div className="text-xs text-slate-500 font-medium">
              Menampilkan <span className="font-bold text-slate-900 font-mono tabular-nums">{filteredVehicles.length}</span> unit
            </div>

            {/* Sort & Grid/List view */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-1.5 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
              >
                <option value="terbaru">Terbaru Ditambahkan</option>
                <option value="harga-asc">Harga: Termurah</option>
                <option value="harga-desc">Harga: Termahal</option>
                <option value="km-asc">Kilometer: Terendah</option>
                <option value="grade">Grade: Tertinggi (A+ duluan)</option>
              </select>

              <div className="hidden sm:flex items-center p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filter Drawer / Collapse */}
          {isMobileFilterOpen && (
            <div className="lg:hidden p-4 bg-white rounded-2xl border border-slate-200 shadow-lg space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="font-bold text-xs uppercase text-slate-800">Filter Pencarian</span>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-blue-900 font-semibold"
                >
                  Reset Semua
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Cari Merk/Model</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ketik merk..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Pilih Grade</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {allGrades.map(g => (
                    <button
                      key={g}
                      onClick={() => toggleGrade(g)}
                      className={`py-1 rounded text-xs font-bold border ${selectedGrades.includes(g) ? 'bg-blue-950 text-white' : 'bg-slate-50'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-2 bg-blue-950 text-white text-xs font-bold rounded-xl"
              >
                Terapkan Filter ({filteredVehicles.length} Unit)
              </button>
            </div>
          )}

          {/* Results Grid / List */}
          {filteredVehicles.length > 0 ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredVehicles.map(veh => (
                <VehicleCard key={veh.id} vehicle={veh} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Tidak Ada Unit yang Sesuai
              </h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Kriteria filter Anda tidak menemukan kendaraan yang cocok. Coba ubah rentang harga atau reset filter grade inspeksi.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold shadow-sm transition-all"
              >
                Reset Semua Filter
              </button>
            </div>
          )}

          {/* Bottom Trust Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Tidak menemukan kendaraan yang Anda cari?</h4>
                <p className="text-xs text-slate-300">Tim kami bisa bantu carikan unit titip jual terinspeksi sesuai budget & spesifikasi Anda.</p>
              </div>
            </div>
            <a
              href="https://wa.me/6281288889901?text=Halo%20Admin%20Mr.%20Mokas,%20saya%20mencari%20unit%20mobil/motor%20dengan%20kriteria%20khusus."
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shrink-0 whitespace-nowrap shadow-sm"
            >
              Request Unit via WhatsApp
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
