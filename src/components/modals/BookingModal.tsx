import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { X, Lock, CheckCircle2, ShieldCheck, FileCheck } from 'lucide-react';
import { Transaksi } from '../../types';

interface BookingModalProps {
  vehicleId: string;
  onClose: () => void;
  onBookingSuccess: (trx: Transaksi) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  vehicleId,
  onClose,
  onBookingSuccess
}) => {
  const { vehicles, createBooking, currentUser } = useApp();
  const vehicle = vehicles.find(v => v.id === vehicleId);

  const [pembeli, setPembeli] = useState(currentUser.role === 'customer' ? 'Bambang Sudarmono' : currentUser.nama);
  const [pembeliWa, setPembeliWa] = useState(currentUser.no_wa || '081234567890');
  const [dpAmount, setDpAmount] = useState<number>(2000000); // Standard booking fee 2jt
  const [metode, setMetode] = useState<Transaksi['metode']>('Transfer Bank');
  const [catatan, setCatatan] = useState('Booking tanda jadi unit via web Mr. Mokas');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!vehicle) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newTrx = createBooking({
        kendaraan_id: vehicle.id,
        pembeli,
        pembeli_wa: pembeliWa,
        dp: dpAmount,
        metode,
        catatan
      });
      setIsSubmitting(false);
      onBookingSuccess(newTrx);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold mb-2">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Kunci & Amankan Unit Kendaraan</span>
          </div>
          <h2 className="text-xl font-extrabold text-blue-950">
            Formulir Tanda Jadi / Booking Fee
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Unit akan dikunci eksklusif (status: Booking) selama 3x24 jam untuk Anda.
          </p>
        </div>

        {/* Vehicle Summary Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6 flex items-center gap-3">
          <img
            src={vehicle.fotos[0]?.url}
            alt={vehicle.model}
            className="w-16 h-12 rounded-xl object-cover"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">
              {vehicle.merk} {vehicle.model} ({vehicle.tahun})
            </h4>
            <p className="text-[11px] text-slate-500 truncate">{vehicle.varian}</p>
            <span className="text-xs font-bold font-mono text-blue-950 tabular-nums">
              {formatRupiah(vehicle.harga_tunai)}
            </span>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nama Lengkap Pemesan (Sesuai KTP)
            </label>
            <input
              type="text"
              required
              value={pembeli}
              onChange={(e) => setPembeli(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nomor WhatsApp Aktif
            </label>
            <input
              type="tel"
              required
              value={pembeliWa}
              onChange={(e) => setPembeliWa(e.target.value)}
              placeholder="081234567890"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Besaran Tanda Jadi / Booking (Rp)
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[1000000, 2000000, 5000000].map(val => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setDpAmount(val)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-colors ${
                    dpAmount === val
                      ? 'bg-blue-950 text-white border-blue-950'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {formatRupiah(val)}
                </button>
              ))}
            </div>
            <input
              type="number"
              min={500000}
              step={500000}
              value={dpAmount}
              onChange={(e) => setDpAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Metode Pembayaran
            </label>
            <select
              value={metode}
              onChange={(e) => setMetode(e.target.value as any)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
            >
              <option value="Transfer Bank">Transfer Virtual Account / Bank BCA / Mandiri</option>
              <option value="Kredit">Pengajuan Kredit Leasing (DP Tanda Jadi)</option>
              <option value="Tunai">Bayar Tunai di Showroom</option>
            </select>
          </div>

          {/* Refund policy highlight */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Garansi Refund Tanda Jadi 100%:</strong> Jika pengajuan leasing ditolak atau kondisi fisik kendaraan tidak sesuai laporan inspeksi saat dicek di showroom, tanda jadi dikembalikan 100% tanpa potongan.
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-md transition-transform active:scale-98 disabled:opacity-50"
          >
            {isSubmitting ? 'Memproses Booking...' : `Konfirmasi Booking (${formatRupiah(dpAmount)})`}
          </button>
        </form>

      </div>
    </div>
  );
};
