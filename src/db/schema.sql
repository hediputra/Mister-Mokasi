-- ============================================================================
-- MR. MOKAS - SCHEMA DATABASE POSTGRESQL & SUPABASE MIGRATION
-- Showroom Mobil & Motor Bekas Bergaransi dengan Inspeksi Profesional
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'agen', 'bendahara', 'marketing', 'customer');
CREATE TYPE vehicle_category AS ENUM ('mobil', 'motor');
CREATE TYPE vehicle_grade AS ENUM ('A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'E');
CREATE TYPE vehicle_status AS ENUM ('Tersedia', 'Booking', 'Terjual', 'Menunggu Approval', 'Ditolak');
CREATE TYPE payment_status AS ENUM ('Menunggu Verifikasi', 'DP Diterima', 'Lunas', 'Cicilan Aktif', 'Dibatalkan');
CREATE TYPE lead_status AS ENUM ('Baru', 'Follow Up', 'Jadwal Test Drive', 'Closing', 'Batal');

-- 3. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'customer',
    no_wa VARCHAR(30) NOT NULL,
    foto TEXT,
    status VARCHAR(20) DEFAULT 'Aktif',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. KENDARAAN (VEHICLES) TABLE
CREATE TABLE IF NOT EXISTS public.kendaraan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kategori vehicle_category NOT NULL,
    merk VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    varian VARCHAR(150) NOT NULL,
    tahun INT NOT NULL,
    warna VARCHAR(60) NOT NULL,
    nopol VARCHAR(20) UNIQUE NOT NULL,
    no_mesin VARCHAR(60) NOT NULL,
    no_rangka VARCHAR(60) NOT NULL,
    pajak_berlaku DATE NOT NULL,
    pajak_status VARCHAR(30) DEFAULT 'Hidup',
    transmisi VARCHAR(30) NOT NULL,
    bahan_bakar VARCHAR(30) NOT NULL,
    cc INT NOT NULL,
    km INT NOT NULL,
    harga_tunai BIGINT NOT NULL,
    harga_kredit BIGINT NOT NULL,
    dp_min BIGINT NOT NULL,
    angsuran_mulai BIGINT NOT NULL,
    grade vehicle_grade NOT NULL,
    status vehicle_status DEFAULT 'Menunggu Approval',
    agen_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    deskripsi TEXT,
    lokasi VARCHAR(150) DEFAULT 'Jakarta',
    featured BOOLEAN DEFAULT false,
    promo BOOLEAN DEFAULT false,
    promo_text VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. INSPEKSI (INSPECTIONS) TABLE
CREATE TABLE IF NOT EXISTS public.inspeksi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kendaraan_id UUID NOT NULL REFERENCES public.kendaraan(id) ON DELETE CASCADE,
    skor_mesin INT NOT NULL CHECK (skor_mesin BETWEEN 0 AND 100),
    skor_interior INT NOT NULL CHECK (skor_interior BETWEEN 0 AND 100),
    skor_eksterior INT NOT NULL CHECK (skor_eksterior BETWEEN 0 AND 100),
    skor_kaki INT NOT NULL CHECK (skor_kaki BETWEEN 0 AND 100),
    skor_kelistrikan INT NOT NULL CHECK (skor_kelistrikan BETWEEN 0 AND 100),
    skor_ban INT NOT NULL CHECK (skor_ban BETWEEN 0 AND 100),
    catatan TEXT,
    inspektur VARCHAR(150) NOT NULL,
    tgl_inspeksi DATE NOT NULL DEFAULT CURRENT_DATE,
    bebas_banjir BOOLEAN DEFAULT true,
    bebas_tabrak BOOLEAN DEFAULT true,
    surat_lengkap BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. FOTO KENDARAAN (PHOTOS) TABLE
CREATE TABLE IF NOT EXISTS public.foto_kendaraan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kendaraan_id UUID NOT NULL REFERENCES public.kendaraan(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    kategori VARCHAR(30) NOT NULL, -- 'eksterior', 'interior', 'mesin', 'dokumen', 'ban', 'dashboard'
    urutan INT DEFAULT 1,
    caption VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. LEADS (CALON PEMBELI) TABLE
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kendaraan_id UUID REFERENCES public.kendaraan(id) ON DELETE SET NULL,
    nama VARCHAR(150) NOT NULL,
    no_wa VARCHAR(30) NOT NULL,
    pesan TEXT,
    marketing_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status lead_status DEFAULT 'Baru',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TRANSAKSI (SALES & DEPOSIT) TABLE
CREATE TABLE IF NOT EXISTS public.transaksi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    no_invoice VARCHAR(50) UNIQUE NOT NULL,
    kendaraan_id UUID NOT NULL REFERENCES public.kendaraan(id),
    pembeli VARCHAR(150) NOT NULL,
    pembeli_wa VARCHAR(30) NOT NULL,
    agen_id UUID NOT NULL REFERENCES public.users(id),
    marketing_id UUID REFERENCES public.users(id),
    harga BIGINT NOT NULL,
    dp BIGINT NOT NULL DEFAULT 0,
    sisa_bayar BIGINT NOT NULL DEFAULT 0,
    metode VARCHAR(50) NOT NULL,
    status_bayar payment_status DEFAULT 'Menunggu Verifikasi',
    tgl_transaksi DATE NOT NULL DEFAULT CURRENT_DATE,
    tgl_pelunasan DATE,
    catatan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. KOMISI (COMMISSION DISBURSEMENT) TABLE
CREATE TABLE IF NOT EXISTS public.komisi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaksi_id UUID NOT NULL REFERENCES public.transaksi(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id),
    user_role VARCHAR(20) NOT NULL,
    jumlah BIGINT NOT NULL,
    status VARCHAR(30) DEFAULT 'Menunggu', -- 'Menunggu', 'Disetujui', 'Dicairkan'
    tgl_cair DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. GARANSI (WARRANTY SPECS) TABLE
CREATE TABLE IF NOT EXISTS public.garansi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kendaraan_id UUID NOT NULL REFERENCES public.kendaraan(id) ON DELETE CASCADE,
    jenis VARCHAR(150) NOT NULL,
    durasi VARCHAR(100) NOT NULL,
    syarat TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_kendaraan_kategori ON public.kendaraan (kategori);
CREATE INDEX IF NOT EXISTS idx_kendaraan_grade ON public.kendaraan (grade);
CREATE INDEX IF NOT EXISTS idx_kendaraan_status ON public.kendaraan (status);
CREATE INDEX IF NOT EXISTS idx_kendaraan_harga ON public.kendaraan (harga_tunai);
CREATE INDEX IF NOT EXISTS idx_leads_kendaraan ON public.leads (kendaraan_id);
CREATE INDEX IF NOT EXISTS idx_transaksi_kendaraan ON public.transaksi (kendaraan_id);

-- 12. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.kendaraan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspeksi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foto_kendaraan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaksi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.komisi ENABLE ROW LEVEL SECURITY;

-- Public can read approved or available vehicles
CREATE POLICY "Public Read Kendaraan" 
ON public.kendaraan FOR SELECT 
USING (status IN ('Tersedia', 'Booking', 'Terjual'));

-- Public can read inspection reports
CREATE POLICY "Public Read Inspeksi" 
ON public.inspeksi FOR SELECT 
USING (true);

-- Public can read photos
CREATE POLICY "Public Read Foto" 
ON public.foto_kendaraan FOR SELECT 
USING (true);

-- Public can submit leads
CREATE POLICY "Public Insert Leads" 
ON public.leads FOR INSERT 
WITH CHECK (true);
