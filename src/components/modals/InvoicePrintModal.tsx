import React from 'react';
import { Transaksi, Kendaraan } from '../../types';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { X, Printer, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface InvoicePrintModalProps {
  transaction: Transaksi;
  onClose: () => void;
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({
  transaction,
  onClose
}) => {
  const { vehicles } = useApp();
  const vehicle = vehicles.find(v => v.id === transaction.kendaraan_id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pratinjau Dokumen:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              {transaction.status_bayar}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-2 px-4 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE INVOICE BODY */}
        <div id="printable-document" className="bg-white p-2 sm:p-4 text-slate-900 text-xs">
          
          {/* Header Kop Surat */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-950 text-amber-400 flex items-center justify-center font-black text-lg">
                  M
                </div>
                <div>
                  <h1 className="text-xl font-black text-blue-950 tracking-tight">MR. MOKAS SHOWROOM</h1>
                  <p className="text-[10px] text-slate-500 font-semibold tracking-wide">PT. MOKAS DIGITAL INDONESIA · KENDARAAN TERINSPEKSI & BERGARANSI</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Jl. TB Simatupang No. 88, Cilandak, Jakarta Selatan 12430<br />
                Hotline: (021) 7890-1234 · WA: +62 812-8888-9901 · Web: www.mrmokas.id
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Kwitansi & SPK Resmi</span>
              <p className="font-mono font-bold text-sm text-slate-900 mt-0.5">{transaction.no_invoice}</p>
              <p className="text-[11px] text-slate-500">Tanggal: {formatDate(transaction.tgl_transaksi)}</p>
            </div>
          </div>

          {/* Customer & Transaction Meta */}
          <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Data Pembeli:</span>
              <p className="font-bold text-slate-900 text-sm">{transaction.pembeli}</p>
              <p className="text-slate-600">Nomor WhatsApp: {transaction.pembeli_wa}</p>
              <p className="text-slate-600">Status Pembayaran: <strong className="text-emerald-700">{transaction.status_bayar}</strong></p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Detail Transaksi:</span>
              <p className="text-slate-600">Agen Penjual: <strong>{transaction.agen_nama}</strong></p>
              {transaction.marketing_nama && (
                <p className="text-slate-600">Marketing Referral: {transaction.marketing_nama}</p>
              )}
              <p className="text-slate-600">Metode: <strong>{transaction.metode}</strong></p>
            </div>
          </div>

          {/* Vehicle Item Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold text-[11px] uppercase tracking-wider border-b border-slate-200">
                  <th className="py-2.5 px-4">Deskripsi Kendaraan</th>
                  <th className="py-2.5 px-3">Grade</th>
                  <th className="py-2.5 px-3">No. Polisi</th>
                  <th className="py-2.5 px-3">Tahun/KM</th>
                  <th className="py-2.5 px-4 text-right">Harga Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{transaction.kendaraan_nama}</p>
                    {vehicle && (
                      <p className="text-[10px] text-slate-500 font-mono">
                        No Rangka: {vehicle.no_rangka} · No Mesin: {vehicle.no_mesin}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 text-[10px]">
                      {vehicle?.grade || 'A'}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">
                    {vehicle?.nopol || '-'}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {vehicle?.tahun || '-'} / {vehicle?.km?.toLocaleString('id-ID')} km
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-sm tabular-nums">
                    {formatRupiah(transaction.harga)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Summary */}
          <div className="flex justify-end mb-6">
            <div className="w-72 space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Total Harga Unit:</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">{formatRupiah(transaction.harga)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-700">
                <span className="font-semibold">Tanda Jadi / DP Dibayar:</span>
                <span className="font-mono font-bold tabular-nums">({formatRupiah(transaction.dp)})</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-slate-900 font-bold text-sm text-blue-950">
                <span>Sisa Pembayaran:</span>
                <span className="font-mono tabular-nums">{formatRupiah(transaction.sisa_bayar)}</span>
              </div>
            </div>
          </div>

          {/* Terms & Warranty Note */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500 space-y-1 mb-8">
            <p className="font-bold text-slate-700 uppercase">Ketentuan & Jaminan:</p>
            <p>1. Dokumen ini merupakan bukti sah tanda jadi pemesanan kendaraan (SPK) di Showroom Mr. Mokas.</p>
            <p>2. Kendaraan dilindungi garansi 30 hari mesin & transmisi serta sertifikat bebas banjir & tabrak.</p>
            <p>3. Pelunasan atau konfirmasi persetujuan kredit leasing diselesaikan maksimal 7 (tujuh) hari kerja sejak tanggal kwitansi ini diterbitkan.</p>
          </div>

          {/* Signature Sign-offs */}
          <div className="grid grid-cols-3 gap-6 text-center text-xs pt-4 border-t border-slate-200">
            <div>
              <p className="text-slate-500 mb-14">Tanda Tangan Pembeli,</p>
              <p className="font-bold text-slate-900 border-t border-slate-300 pt-1">({transaction.pembeli})</p>
            </div>
            <div>
              <p className="text-slate-500 mb-14">Agen Penjual,</p>
              <p className="font-bold text-slate-900 border-t border-slate-300 pt-1">({transaction.agen_nama})</p>
            </div>
            <div>
              <p className="text-slate-500 mb-14">Finance / Bendahara Showroom,</p>
              <p className="font-bold text-slate-900 border-t border-slate-300 pt-1">(Dewi Anggraini, S.E.)</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
