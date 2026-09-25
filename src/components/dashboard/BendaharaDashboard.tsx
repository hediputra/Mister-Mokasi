import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatDate } from '../../utils/formatters';
import {
  Wallet,
  Receipt,
  CheckCircle2,
  Clock,
  Printer,
  FileSpreadsheet,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign
} from 'lucide-react';
import { Transaksi, PaymentStatus } from '../../types';

interface BendaharaDashboardProps {
  onOpenInvoice: (trx: Transaksi) => void;
}

export const BendaharaDashboard: React.FC<BendaharaDashboardProps> = ({ onOpenInvoice }) => {
  const {
    transactions,
    commissions,
    verifyTransaction,
    disburseCommission,
    vehicles,
    users
  } = useApp();

  const [activeTab, setActiveTab] = useState<'transaksi' | 'komisi' | 'laporan'>('transaksi');

  // Stats calculation
  const totalOmset = transactions.reduce((sum, t) => sum + t.harga, 0);
  const totalDpCollected = transactions.reduce((sum, t) => sum + t.dp, 0);
  const totalOutstanding = transactions.reduce((sum, t) => sum + t.sisa_bayar, 0);
  const totalCommissionsPaid = commissions
    .filter(c => c.status === 'Dicairkan')
    .reduce((sum, c) => sum + c.jumlah, 0);

  // CSV Export simulator
  const handleExportCSV = () => {
    const headers = ['No Invoice', 'Kendaraan', 'Pembeli', 'No WA', 'Harga', 'DP', 'Sisa', 'Metode', 'Status Bayar', 'Tanggal'];
    const rows = transactions.map(t => [
      t.no_invoice,
      `"${t.kendaraan_nama}"`,
      `"${t.pembeli}"`,
      t.pembeli_wa,
      t.harga,
      t.dp,
      t.sisa_bayar,
      t.metode,
      t.status_bayar,
      t.tgl_transaksi
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_keuangan_mrmokas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Finance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Nilai Penjualan</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-950 font-mono tabular-nums">
            {formatRupiah(totalOmset)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Total {transactions.length} transaksi berjalan</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total DP Masuk</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 font-mono tabular-nums">
            {formatRupiah(totalDpCollected)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Uang muka / Tanda jadi kas</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Sisa Tagihan / Pelunasan</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-600 font-mono tabular-nums">
            {formatRupiah(totalOutstanding)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Menunggu leasing / transfer bank</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Komisi Dicairkan</span>
            <Wallet className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-700 font-mono tabular-nums">
            {formatRupiah(totalCommissionsPaid)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Reward agen & marketing</p>
        </div>
      </div>

      {/* 2. Navigation Tabs & Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('transaksi')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'transaksi'
                ? 'bg-blue-950 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Verifikasi Transaksi & Invoice ({transactions.length})
          </button>

          <button
            onClick={() => setActiveTab('komisi')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'komisi'
                ? 'bg-blue-950 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Kelola Komisi Tim ({commissions.length})
          </button>

          <button
            onClick={() => setActiveTab('laporan')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'laporan'
                ? 'bg-blue-950 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Rekap Cashflow Showroom
          </button>
        </div>

        <button
          onClick={handleExportCSV}
          className="py-2 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Export Data ke CSV</span>
        </button>
      </div>

      {/* 3. TAB A: Verifikasi Transaksi */}
      {activeTab === 'transaksi' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Daftar Transaksi, DP & Verifikasi Pembayaran</h3>
              <p className="text-xs text-slate-500">Klik cetak kwitansi resmi untuk generate invoice bermaterai.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">No. Invoice</th>
                  <th className="py-2.5 px-3">Kendaraan</th>
                  <th className="py-2.5 px-3">Pembeli</th>
                  <th className="py-2.5 px-3">Harga</th>
                  <th className="py-2.5 px-3">DP Dibayar</th>
                  <th className="py-2.5 px-3">Sisa Tagihan</th>
                  <th className="py-2.5 px-3">Status Bayar</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map(trx => (
                  <tr key={trx.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-mono font-bold text-blue-950">
                      {trx.no_invoice}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {trx.kendaraan_nama}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900">{trx.pembeli}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{trx.pembeli_wa}</p>
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-slate-700">
                      {formatRupiah(trx.harga)}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-700 tabular-nums">
                      {formatRupiah(trx.dp)}
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-slate-600">
                      {formatRupiah(trx.sisa_bayar)}
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={trx.status_bayar}
                        onChange={(e) => verifyTransaction(trx.id, e.target.value as PaymentStatus)}
                        className={`py-1 px-2 rounded-lg font-bold text-[11px] border ${
                          trx.status_bayar === 'Lunas'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : trx.status_bayar === 'DP Diterima'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                        <option value="DP Diterima">DP Diterima</option>
                        <option value="Lunas">Lunas (Serah Terima Unit)</option>
                        <option value="Dibatalkan">Dibatalkan</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onOpenInvoice(trx)}
                        className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 ml-auto cursor-pointer"
                        title="Lihat & cetak kwitansi SPK resmi"
                      >
                        <Printer className="w-3.5 h-3.5 text-amber-400" />
                        <span>Kwitansi</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. TAB B: Kelola Komisi */}
      {activeTab === 'komisi' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Pencairan Komisi Agen & Marketing</h3>
              <p className="text-xs text-slate-500">Komisi dihitung otomatis per transaksi berhasil (~1.2% Agen, ~0.5% Marketing).</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Penerima Komisi</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Unit Kendaraan</th>
                  <th className="py-2.5 px-3">No. Invoice</th>
                  <th className="py-2.5 px-3">Jumlah Komisi</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Aksi Bendahara</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {commissions.map(kom => (
                  <tr key={kom.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {kom.user_nama}
                    </td>
                    <td className="py-3 px-3 uppercase text-[10px] font-bold text-slate-500">
                      {kom.user_role}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">
                      {kom.kendaraan_nama}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                      {kom.no_invoice}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-950 tabular-nums">
                      {formatRupiah(kom.jumlah)}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        kom.status === 'Dicairkan'
                          ? 'bg-emerald-100 text-emerald-800'
                          : kom.status === 'Disetujui'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {kom.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {kom.status !== 'Dicairkan' ? (
                        <button
                          onClick={() => disburseCommission(kom.id)}
                          className="py-1 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs"
                        >
                          Cairkan Transfer
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Tercairkan ({kom.tgl_cair})</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. TAB C: Rekap Cashflow */}
      {activeTab === 'laporan' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-900">Ringkasan Cashflow & Performa Finansial</h3>
            <p className="text-xs text-slate-500">Laporan pemasukan dan beban operasional komisi showroom Mr. Mokas.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-500 block mb-1">TOTAL PEMASUKAN REALISASI (DP + LUNAS)</span>
              <span className="text-xl font-bold font-mono text-emerald-700 tabular-nums">
                {formatRupiah(totalDpCollected)}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-500 block mb-1">TOTAL BEBAN KOMISI STAF</span>
              <span className="text-xl font-bold font-mono text-rose-600 tabular-nums">
                {formatRupiah(totalCommissionsPaid)}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-500 block mb-1">GROSS SURPLUS OPERASIONAL</span>
              <span className="text-xl font-bold font-mono text-blue-950 tabular-nums">
                {formatRupiah(totalDpCollected - totalCommissionsPaid)}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
