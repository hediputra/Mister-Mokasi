import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatNumber } from '../../utils/formatters';
import {
  Megaphone,
  Link as LinkIcon,
  Copy,
  Check,
  Share2,
  TrendingUp,
  MessageCircle,
  Eye,
  Gift
} from 'lucide-react';
import { GradeBadge } from '../GradeBadge';

export const MarketingDashboard: React.FC = () => {
  const {
    vehicles,
    currentUser,
    leads,
    commissions
  } = useApp();

  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [selectedVehicleForPromo, setSelectedVehicleForPromo] = useState<string>(vehicles[0]?.id || '');
  const [copiedPromoText, setCopiedPromoText] = useState(false);

  // Marketing referral code
  const referralCode = `MKT-${currentUser.nama.split(' ')[0].toUpperCase()}-01`;

  // Marketing commissions
  const myCommissions = commissions.filter(c => c.user_id === currentUser.id);
  const totalEarned = myCommissions.reduce((sum, c) => sum + c.jumlah, 0);

  // Copy helper
  const copyToClipboard = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedLink(id);
      setTimeout(() => setCopiedLink(null), 2500);
    }
  };

  // Selected vehicle for broadcast text
  const currentPromoVehicle = vehicles.find(v => v.id === selectedVehicleForPromo) || vehicles[0];

  const generatedPromoMessage = currentPromoVehicle ? (
    `🔥 *UNIT ISTIMEWA MR. MOKAS - BERGARANSI 100%* 🔥\n\n` +
    `🚗 *${currentPromoVehicle.merk} ${currentPromoVehicle.model} (${currentPromoVehicle.tahun})*\n` +
    `✨ Varian: ${currentPromoVehicle.varian}\n` +
    `⭐ *GRADE INSPEKSI: ${currentPromoVehicle.grade}* (Lolos 150+ Titik Inspeksi)\n` +
    `🛣️ Odometer: ${formatNumber(currentPromoVehicle.km)} km (Asli Record)\n` +
    `🛡️ 100% Bebas Banjir & Bebas Tabrak Parah\n\n` +
    `💰 *Harga Spesial Tunai: ${formatRupiah(currentPromoVehicle.harga_tunai)}*\n` +
    `💳 Paket DP Mulai: ${formatRupiah(currentPromoVehicle.dp_min)} | Cicilan Rp ${formatNumber(currentPromoVehicle.angsuran_mulai)}/bln\n\n` +
    `📲 Cek foto lengkap & sertifikat inspeksi di link ini:\n` +
    `https://mrmokas.id/katalog?id=${currentPromoVehicle.id}&ref=${referralCode}\n\n` +
    `Hubungi kami sekarang sebelum keduluan!`
  ) : '';

  const handleCopyPromoMessage = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(generatedPromoMessage);
      setCopiedPromoText(true);
      setTimeout(() => setCopiedPromoText(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Profile & Referral Code Box */}
      <div className="bg-gradient-to-r from-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
            Dashboard Tim Marketing & Promosi
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {currentUser.nama}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Bagikan link referral Anda ke media sosial, forum, atau status WhatsApp. Setiap pembeli yang bertransaksi via link Anda menghasilkan komisi 0.5% - 1.0%!
          </p>
        </div>

        {/* Unique Referral Card */}
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md min-w-[280px]">
          <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block mb-1">
            Kode Referral Unik Anda:
          </span>
          <div className="flex items-center justify-between gap-2">
            <span className="text-base font-mono font-black tracking-wide text-white">
              {referralCode}
            </span>
            <button
              onClick={() => copyToClipboard(`https://mrmokas.id/katalog?ref=${referralCode}`, 'global')}
              className="py-1 px-3 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedLink === 'global' ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink === 'global' ? 'Tersalin!' : 'Salin Link'}</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-300 mt-2">
            Link: https://mrmokas.id/katalog?ref={referralCode}
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Leads Masuk</span>
          <p className="text-2xl font-black text-blue-950 font-mono mt-1">{leads.length} Leads</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase">Closing Penjualan</span>
          <p className="text-2xl font-black text-emerald-700 font-mono mt-1">{myCommissions.length} Unit</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Komisi Masuk</span>
          <p className="text-2xl font-black text-amber-600 font-mono mt-1">{formatRupiah(totalEarned)}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase">Unit Siap Promosi</span>
          <p className="text-2xl font-black text-slate-800 font-mono mt-1">
            {vehicles.filter(v => v.status === 'Tersedia').length} Unit
          </p>
        </div>
      </div>

      {/* 2. Broadcast Promo WhatsApp Generator */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Generator Broadcast Promo WhatsApp & Media Sosial
              </h3>
              <p className="text-xs text-slate-500">
                Pilih unit mobil/motor, salin teks format promosi profesional yang sudah dilengkapi link referral Anda.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-72">
            <select
              value={selectedVehicleForPromo}
              onChange={(e) => setSelectedVehicleForPromo(e.target.value)}
              className="w-full py-2 px-3 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50"
            >
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.merk} {v.model} ({v.tahun}) - {formatRupiah(v.harga_tunai)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Promo Text Box */}
        <div className="relative p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs whitespace-pre-wrap leading-relaxed border border-slate-800">
          {generatedPromoMessage}

          <div className="absolute top-4 right-4">
            <button
              onClick={handleCopyPromoMessage}
              className="py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
            >
              {copiedPromoText ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPromoText ? 'Tersalin!' : 'Salin Teks Broadcast'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Catalog with 1-Click Referral Link per Vehicle */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 mb-1">Generate Link Referral Khusus Per Unit</h3>
        <p className="text-xs text-slate-500 mb-4">Salin tautan langsung menuju halaman detail spesifik tiap kendaraan.</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Kendaraan</th>
                <th className="py-2.5 px-3">Grade</th>
                <th className="py-2.5 px-3">Harga Tunai</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Estimasi Komisi Marketing</th>
                <th className="py-2.5 px-3 text-right">Salin Link Referral</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicles.map(veh => {
                const link = `https://mrmokas.id/katalog?id=${veh.id}&ref=${referralCode}`;
                const isCopied = copiedLink === veh.id;
                const estKomisi = Math.round(veh.harga_tunai * 0.005); // 0.5%

                return (
                  <tr key={veh.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={veh.fotos[0]?.url}
                          alt=""
                          className="w-10 h-7 rounded object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{veh.merk} {veh.model} ({veh.tahun})</p>
                          <p className="text-[10px] text-slate-500">{veh.varian}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <GradeBadge grade={veh.grade} size="sm" />
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-950 tabular-nums">
                      {formatRupiah(veh.harga_tunai)}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        veh.status === 'Tersedia' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {veh.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-700 tabular-nums">
                      +{formatRupiah(estKomisi)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => copyToClipboard(link, veh.id)}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold inline-flex items-center gap-1 border transition-colors ${
                          isCopied
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Tersalin' : 'Salin Link'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
