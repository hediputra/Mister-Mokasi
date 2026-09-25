export type UserRole = 'admin' | 'agen' | 'bendahara' | 'marketing' | 'customer';

export type VehicleCategory = 'mobil' | 'motor';

export type Transmission = 'Manual' | 'Matic' | 'CVT' | 'Kopling Manual';

export type FuelType = 'Bensin' | 'Diesel' | 'Hybrid' | 'Listrik';

export type GradeLevel = 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'E';

export type VehicleStatus = 'Tersedia' | 'Booking' | 'Terjual' | 'Menunggu Approval' | 'Ditolak';

export type PaymentStatus = 'Menunggu Verifikasi' | 'DP Diterima' | 'Lunas' | 'Cicilan Aktif' | 'Dibatalkan';

export interface User {
  id: string;
  nama: string;
  email: string;
  role: UserRole;
  no_wa: string;
  foto?: string;
  status: 'Aktif' | 'Nonaktif';
}

export interface InspectionPhoto {
  id: string;
  kendaraan_id: string;
  url: string;
  kategori: 'eksterior' | 'interior' | 'mesin' | 'dokumen' | 'ban' | 'dashboard';
  urutan: number;
  caption?: string;
}

export interface InspectionData {
  id: string;
  kendaraan_id: string;
  skor_mesin: number; // 0 - 100
  skor_interior: number; // 0 - 100
  skor_eksterior: number; // 0 - 100
  skor_kaki: number; // 0 - 100
  skor_kelistrikan: number; // 0 - 100
  skor_ban: number; // 0 - 100
  catatan: string;
  inspektur: string;
  tgl_inspeksi: string;
  bebas_banjir: boolean;
  bebas_tabrak: boolean;
  surat_lengkap: boolean;
}

export interface Kendaraan {
  id: string;
  kategori: VehicleCategory;
  merk: string;
  model: string;
  varian: string;
  tahun: number;
  warna: string;
  nopol: string;
  no_mesin: string;
  no_rangka: string;
  pajak_berlaku: string;
  pajak_status: 'Hidup' | 'Mati' | 'Perpanjangan';
  transmisi: Transmission;
  bahan_bakar: FuelType;
  cc: number;
  km: number;
  harga_tunai: number;
  harga_kredit: number;
  dp_min: number;
  angsuran_mulai: number;
  grade: GradeLevel;
  status: VehicleStatus;
  agen_id: string;
  agen_nama?: string;
  agen_wa?: string;
  deskripsi: string;
  lokasi: string;
  featured?: boolean;
  promo?: boolean;
  promo_text?: string;
  created_at: string;
  updated_at: string;
  fotos: InspectionPhoto[];
  inspeksi: InspectionData;
}

export interface Lead {
  id: string;
  kendaraan_id: string;
  kendaraan_nama: string;
  nama: string;
  no_wa: string;
  pesan: string;
  marketing_id?: string;
  marketing_nama?: string;
  status: 'Baru' | 'Follow Up' | 'Jadwal Test Drive' | 'Closing' | 'Batal';
  created_at: string;
}

export interface Transaksi {
  id: string;
  no_invoice: string;
  kendaraan_id: string;
  kendaraan_nama: string;
  pembeli: string;
  pembeli_wa: string;
  agen_id: string;
  agen_nama: string;
  marketing_id?: string;
  marketing_nama?: string;
  harga: number;
  dp: number;
  sisa_bayar: number;
  metode: 'Tunai' | 'Kredit' | 'Transfer Bank' | 'Cicilan Showroom';
  status_bayar: PaymentStatus;
  tgl_transaksi: string;
  tgl_pelunasan?: string;
  catatan?: string;
}

export interface Komisi {
  id: string;
  transaksi_id: string;
  no_invoice: string;
  kendaraan_nama: string;
  user_id: string;
  user_nama: string;
  user_role: 'agen' | 'marketing';
  jumlah: number;
  status: 'Menunggu' | 'Disetujui' | 'Dicairkan';
  tgl_cair?: string;
}

export interface GaransiItem {
  id: string;
  kendaraan_id: string;
  jenis: string;
  durasi: string;
  syarat: string;
}
