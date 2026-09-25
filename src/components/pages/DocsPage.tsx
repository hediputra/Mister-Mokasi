import React, { useState } from 'react';
import { Database, Code2, Server, Globe, Copy, Check, Terminal, Layers } from 'lucide-react';

export const DocsPage: React.FC = () => {
  const [copiedSql, setCopiedSql] = useState(false);

  const sqlSchemaText = `-- ============================================================================
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
    kategori VARCHAR(30) NOT NULL,
    urutan INT DEFAULT 1,
    caption VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. LEADS TABLE
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

-- 9. KOMISI TABLE
CREATE TABLE IF NOT EXISTS public.komisi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaksi_id UUID NOT NULL REFERENCES public.transaksi(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id),
    user_role VARCHAR(20) NOT NULL,
    jumlah BIGINT NOT NULL,
    status VARCHAR(30) DEFAULT 'Menunggu',
    tgl_cair DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. ROW LEVEL SECURITY
ALTER TABLE public.kendaraan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Kendaraan" ON public.kendaraan FOR SELECT USING (status IN ('Tersedia', 'Booking', 'Terjual'));
`;

  const copySql = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(sqlSchemaText);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold mb-2">
          <Terminal className="w-3.5 h-3.5 text-amber-500" />
          <span>Arsitektur Sistem & Dokumentasi Lengkap</span>
        </div>
        <h1 className="text-3xl font-extrabold text-blue-950 tracking-tight">
          Panduan Setup, Deploy & Skema Database Supabase
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Spesifikasi teknis arsitektur Next.js 14 App Router / React SPA, PostgreSQL, dan Supabase Auth & Storage.
        </p>
      </div>

      {/* 1. Struktur Folder & File */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-950" />
          <h2 className="text-lg font-bold text-blue-950">1. Struktur Folder & File Project</h2>
        </div>

        <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
{`mr-mokas/
├── src/
│   ├── assets/images/        # High-res image assets (showroom hero, cars, scooters)
│   ├── components/
│   │   ├── catalog/          # CatalogPage, filters sidebar, sorting
│   │   ├── dashboard/        # 4 Role Dashboards (Admin, Agen, Bendahara, Marketing)
│   │   ├── detail/           # VehicleDetailPage (150-Point Inspection, Photos, Specs)
│   │   ├── home/             # HeroSection, FeaturedUnits, TrustHighlights
│   │   ├── modals/           # BookingModal (DP simulator), InvoicePrintModal (PDF)
│   │   ├── pages/            # WarrantyPage, CalculatorPage, DocsPage
│   │   ├── CompareDrawer.tsx # Side-by-side vehicle comparison drawer
│   │   ├── GradeBadge.tsx    # A+ to E dynamic colored grade badges
│   │   ├── Navbar.tsx        # Top Bar Contract (3 zones, role demo switcher)
│   │   ├── Footer.tsx        # Showroom contacts, branches, links
│   │   └── VehicleCard.tsx   # Lead card with cash/credit prices & WhatsApp link
│   ├── context/
│   │   └── AppContext.tsx    # State store with localStorage persistence & CRUD actions
│   ├── data/
│   │   └── seedData.ts       # Initial seed (min. 6 units: 3 cars, 3 motorbikes, users)
│   ├── db/
│   │   └── schema.sql        # PostgreSQL Supabase migration schema with RLS
│   ├── types/
│   │   └── index.ts          # Comprehensive TypeScript interfaces & enums
│   └── utils/
│       └── formatters.ts     # formatRupiah, calculateGrade, WhatsApp URL generator
├── index.html                # SEO meta tags, OpenGraph, Plus Jakarta Sans font
└── metadata.json             # Applet capabilities & metadata`}
        </pre>
      </div>

      {/* 2. SQL Migration */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-blue-950">2. Skema Database PostgreSQL (Supabase Migration)</h2>
          </div>

          <button
            onClick={copySql}
            className="py-1.5 px-3.5 rounded-xl bg-blue-950 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-blue-900 transition-colors"
          >
            {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSql ? 'Tersalin!' : 'Salin SQL'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
          {sqlSchemaText}
        </pre>
      </div>

      {/* 3. Setup & Deployment Guide */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-blue-950">3. Panduan Setup & Deploy ke Supabase & Vercel</h2>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900">Langkah 1: Setup Supabase Database & Storage</h4>
            <p className="text-xs text-slate-600">
              1. Buka console Supabase di <code>supabase.com</code> dan buat project baru.<br />
              2. Buka menu <strong>SQL Editor</strong>, paste isi file <code>src/db/schema.sql</code> di atas, lalu jalankan (Run).<br />
              3. Buka menu <strong>Storage</strong>, buat bucket publik bernama <code>kendaraan</code> untuk foto bodi dan dokumen.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900">Langkah 2: Konfigurasi Environment Variables</h4>
            <p className="text-xs text-slate-600">
              Buat file <code>.env.local</code> di root project:
            </p>
            <pre className="p-3 rounded-lg bg-slate-900 text-slate-200 text-xs font-mono">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}
            </pre>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900">Langkah 3: Deploy ke Vercel</h4>
            <p className="text-xs text-slate-600">
              1. Push repository ke GitHub.<br />
              2. Buka dashboard Vercel, pilih <strong>Import Git Repository</strong>.<br />
              3. Masukkan Environment Variables <code>NEXT_PUBLIC_SUPABASE_URL</code> dan <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.<br />
              4. Klik <strong>Deploy</strong>. Website Mr. Mokas siap digunakan secara live!
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
