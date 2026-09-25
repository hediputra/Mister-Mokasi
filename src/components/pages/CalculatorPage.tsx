import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, calculateCreditSimulation } from '../../utils/formatters';
import { Calculator, CheckCircle2, MessageCircle, HelpCircle } from 'lucide-react';

export const CalculatorPage: React.FC = () => {
  const { vehicles } = useApp();

  const [selectedVehId, setSelectedVehId] = useState<string>(vehicles[0]?.id || '');
  const [customPrice, setCustomPrice] = useState<number>(vehicles[0]?.harga_kredit || 350000000);
  const [dpPercent, setDpPercent] = useState<number>(20);
  const [tenorYears, setTenorYears] = useState<number>(3);
  const [interestRate, setInterestRate] = useState<number>(7.5);

  const handleSelectVehicle = (id: string) => {
    setSelectedVehId(id);
    const target = vehicles.find(v => v.id === id);
    if (target) {
      setCustomPrice(target.harga_kredit || target.harga_tunai);
    }
  };

  const simulation = calculateCreditSimulation(customPrice, dpPercent, tenorYears, interestRate);

  const selectedVehicle = vehicles.find(v => v.id === selectedVehId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold mb-3">
          <Calculator className="w-4 h-4 text-amber-500" />
          <span>Kalkulator Pembiayaan Syariah & Konvensional</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-blue-950 tracking-tight">
          Simulasi Kredit Mobil & Motor Bekas
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Hitung estimasi Total Pembayaran Pertama (TDP) dan angsuran bulanan sesuai kemampuan finansial Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* 1. Pilih dari Kendaraan Showroom */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Pilih Unit dari Showroom Mr. Mokas
            </label>
            <select
              value={selectedVehId}
              onChange={(e) => handleSelectVehicle(e.target.value)}
              className="w-full py-2.5 px-3.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600"
            >
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.kategori.toUpperCase()} - {v.merk} {v.model} ({v.tahun}) · {formatRupiah(v.harga_kredit || v.harga_tunai)}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Harga Unit Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Harga Kendaraan (OTR)
            </label>
            <input
              type="number"
              step={1000000}
              value={customPrice}
              onChange={(e) => setCustomPrice(Number(e.target.value))}
              className="w-full py-2.5 px-3.5 text-base font-bold font-mono text-blue-950 rounded-xl border border-slate-200"
            />
          </div>

          {/* 3. Uang Muka (DP) */}
          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-bold text-slate-700 uppercase tracking-wider">Uang Muka (DP {dpPercent}%)</span>
              <span className="font-mono font-bold text-blue-950 tabular-nums">
                {formatRupiah(simulation.dpNominal)}
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              step={5}
              value={dpPercent}
              onChange={(e) => setDpPercent(Number(e.target.value))}
              className="w-full accent-blue-950"
            />
            <div className="flex gap-2 mt-2">
              {[15, 20, 25, 30, 40].map(pct => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setDpPercent(pct)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    dpPercent === pct ? 'bg-blue-950 text-white border-blue-950' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* 4. Jangka Waktu (Tenor) */}
          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-bold text-slate-700 uppercase tracking-wider">Jangka Waktu Kredit</span>
              <span className="font-bold text-blue-950">{tenorYears} Tahun ({tenorYears * 12} Bulan)</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map(yr => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setTenorYears(yr)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    tenorYears === yr ? 'bg-blue-950 text-white border-blue-950 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {yr} Tahun
                </button>
              ))}
            </div>
          </div>

          {/* 5. Estimasi Bunga Flat / Tahun */}
          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-bold text-slate-700 uppercase tracking-wider">Estimasi Suku Bunga p.a.</span>
              <span className="font-mono font-bold text-blue-950">{interestRate}% / tahun</span>
            </div>
            <input
              type="range"
              min={5.5}
              max={11.0}
              step={0.5}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-blue-950"
            />
          </div>

        </div>

        {/* Right Output Card (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block mb-1">
              Rincian Hasil Perhitungan
            </span>
            <h3 className="text-xl font-bold">Ringkasan Angsuran</h3>
          </div>

          {/* Big Monthly Output */}
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
            <span className="text-xs text-slate-300 block">Estimasi Angsuran Per Bulan</span>
            <div className="text-3xl font-black font-mono tracking-tight text-amber-300 tabular-nums mt-1">
              {formatRupiah(simulation.monthlyInstallment)}
            </div>
            <span className="text-[11px] text-slate-300 mt-0.5 block">
              Tenor {simulation.totalMonths} bulan (Bunga {interestRate}%)
            </span>
          </div>

          {/* Breakdown Items */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-white/10">
              <span className="text-slate-300">Harga Kendaraan:</span>
              <span className="font-mono font-bold">{formatRupiah(customPrice)}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-white/10">
              <span className="text-slate-300">Uang Muka Murni (DP):</span>
              <span className="font-mono font-bold text-emerald-400">{formatRupiah(simulation.dpNominal)}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-white/10">
              <span className="text-slate-300">Pokok Hutang Pembiayaan:</span>
              <span className="font-mono font-bold">{formatRupiah(simulation.loanPrincipal)}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-white/10">
              <span className="text-slate-300">Estimasi Asuransi (All Risk/TLO):</span>
              <span className="font-mono">{formatRupiah(simulation.insuranceEst)}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-white/10">
              <span className="text-slate-300">Biaya Administrasi & Provisi:</span>
              <span className="font-mono">{formatRupiah(simulation.adminFee)}</span>
            </div>

            <div className="flex justify-between pt-2 text-sm font-bold text-white border-t-2 border-white/20">
              <span>Total Pembayaran Pertama (TDP):</span>
              <span className="font-mono text-amber-300 tabular-nums">{formatRupiah(simulation.firstPaymentTotal)}</span>
            </div>
          </div>

          {/* WhatsApp Leasing Action */}
          <a
            href={`https://wa.me/6281288889901?text=Halo%20Admin%20Mr.%20Mokas,%20saya%20tertarik%20mengajukan%20kredit%20untuk%20unit%20${encodeURIComponent(selectedVehicle?.model || 'kendaraan')}%20dengan%20DP%20${encodeURIComponent(formatRupiah(simulation.dpNominal))}%20tenor%20${tenorYears}%20tahun.`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Ajukan Kredit via WhatsApp Official</span>
          </a>

          <p className="text-[10px] text-slate-400 text-center leading-relaxed">
            *Perhitungan di atas merupakan simulasi indikatif. Suku bunga dan uang muka final ditentukan oleh persetujuan lembaga pembiayaan rekanan (BCA Finance, Mandiri Utama Finance, Adira, dll).
          </p>
        </div>

      </div>

    </div>
  );
};
