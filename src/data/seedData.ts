import { Kendaraan, User, Lead, Transaksi, Komisi } from '../types';

export const HERO_BANNER_IMG = '/src/assets/images/hero_showroom_cars_bikes_1790299462438.jpg';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    nama: 'Budi Hartono (Super Admin)',
    email: 'admin@mrmokas.id',
    role: 'admin',
    no_wa: '6281288889901',
    status: 'Aktif'
  },
  {
    id: 'usr-agen-1',
    nama: 'Hendra Wijaya',
    email: 'hendra.agen@mrmokas.id',
    role: 'agen',
    no_wa: '6281312345678',
    status: 'Aktif'
  },
  {
    id: 'usr-agen-2',
    nama: 'Siti Rahmawati',
    email: 'siti.agen@mrmokas.id',
    role: 'agen',
    no_wa: '6281987654321',
    status: 'Aktif'
  },
  {
    id: 'usr-bendahara-1',
    nama: 'Dewi Anggraini, S.E.',
    email: 'dewi.finance@mrmokas.id',
    role: 'bendahara',
    no_wa: '6285211223344',
    status: 'Aktif'
  },
  {
    id: 'usr-marketing-1',
    nama: 'Rizky Pratama',
    email: 'rizky.mkt@mrmokas.id',
    role: 'marketing',
    no_wa: '6287899887766',
    status: 'Aktif'
  }
];

export const INITIAL_VEHICLES: Kendaraan[] = [
  // 1. MOBIL: Toyota Innova Zenix Q Hybrid 2023 (Grade A+)
  {
    id: 'car-innova-zenix-01',
    kategori: 'mobil',
    merk: 'Toyota',
    model: 'Innova Zenix',
    varian: '2.0 Q HV Modelista TSS (Panoramic Sunroof)',
    tahun: 2023,
    warna: 'Pearl White Metallic',
    nopol: 'B 1824 QZV',
    no_mesin: 'M20A-FXS88912',
    no_rangka: 'MHKXN21P8PJ002914',
    pajak_berlaku: '2027-08-15',
    pajak_status: 'Hidup',
    transmisi: 'CVT',
    bahan_bakar: 'Hybrid',
    cc: 1987,
    km: 14200,
    harga_tunai: 565000000,
    harga_kredit: 545000000,
    dp_min: 55000000,
    angsuran_mulai: 11200000,
    grade: 'A+',
    status: 'Tersedia',
    agen_id: 'usr-agen-1',
    agen_nama: 'Hendra Wijaya',
    agen_wa: '6281312345678',
    deskripsi: 'Unit istimewa grade tertinggi A+. Tangan pertama dari baru, service record resmi Auto2000 rutin tercatat. Cat 100% orisinil tanpa sisipan, interior wangi pabrik, panoramic roof mulus, ban tebal 95%. Dokumen BPKB, Faktur, NIK, kunci serep lengkap.',
    lokasi: 'Showroom Pusat - Jakarta Selatan',
    featured: true,
    promo: true,
    promo_text: 'Free Service & Garansi Mesin 1 Tahun',
    created_at: '2026-09-01T10:00:00Z',
    updated_at: '2026-09-20T12:00:00Z',
    fotos: [
      {
        id: 'f-zenix-1',
        kendaraan_id: 'car-innova-zenix-01',
        url: '/src/assets/images/car_innova_zenix_white_1790299475824.jpg',
        kategori: 'eksterior',
        urutan: 1,
        caption: 'Tampilan Depan Tiga Perempat'
      },
      {
        id: 'f-zenix-2',
        kendaraan_id: 'car-innova-zenix-01',
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
        kategori: 'interior',
        urutan: 2,
        caption: 'Kabin Baris Depan & Captain Seat'
      },
      {
        id: 'f-zenix-3',
        kendaraan_id: 'car-innova-zenix-01',
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
        kategori: 'dashboard',
        urutan: 3,
        caption: 'Cluster Meter & Head Unit Layar 10 Inci'
      },
      {
        id: 'f-zenix-4',
        kendaraan_id: 'car-innova-zenix-01',
        url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80',
        kategori: 'mesin',
        urutan: 4,
        caption: 'Ruang Mesin Kering Bersih Hybrid Synergy'
      },
      {
        id: 'f-zenix-5',
        kendaraan_id: 'car-innova-zenix-01',
        url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
        kategori: 'ban',
        urutan: 5,
        caption: 'Velg Alloy Modelista Ring 18 & Ban Tebal'
      },
      {
        id: 'f-zenix-6',
        kendaraan_id: 'car-innova-zenix-01',
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
        kategori: 'dokumen',
        urutan: 6,
        caption: 'STNK, BPKB Asli & Buku Manual Service Lengkap'
      }
    ],
    inspeksi: {
      id: 'insp-zenix-01',
      kendaraan_id: 'car-innova-zenix-01',
      skor_mesin: 98,
      skor_interior: 99,
      skor_eksterior: 97,
      skor_kaki: 98,
      skor_kelistrikan: 100,
      skor_ban: 94,
      catatan: 'Kondisi mendekati unit baru showroom. Bebas dari karat bawah bodi. Baterai hybrid 100% prima, sistem TSS radar aktif sempurna. Tidak ada bekas tabrak rangka ataupun indikasi banjir sekecil apapun.',
      inspektur: 'Ir. Agus Setyawan, Certified Master Inspector',
      tgl_inspeksi: '2026-09-18',
      bebas_banjir: true,
      bebas_tabrak: true,
      surat_lengkap: true
    }
  },

  // 2. MOBIL: Honda HR-V 1.5 SE CVT 2022 (Grade A)
  {
    id: 'car-hrv-se-02',
    kategori: 'mobil',
    merk: 'Honda',
    model: 'HR-V',
    varian: '1.5 SE CVT Honda Sensing',
    tahun: 2022,
    warna: 'Crystal Black Pearl',
    nopol: 'B 2291 TKL',
    no_mesin: 'L15ZF-3104921',
    no_rangka: 'MRHRV2880NP918231',
    pajak_berlaku: '2027-04-10',
    pajak_status: 'Hidup',
    transmisi: 'Matic',
    bahan_bakar: 'Bensin',
    cc: 1498,
    km: 26800,
    harga_tunai: 368000000,
    harga_kredit: 352000000,
    dp_min: 35000000,
    angsuran_mulai: 7950000,
    grade: 'A',
    status: 'Tersedia',
    agen_id: 'usr-agen-1',
    agen_nama: 'Hendra Wijaya',
    agen_wa: '6281312345678',
    deskripsi: 'Honda HR-V SE generasi terbaru warna favorit Crystal Black Pearl. Tangan pertama, pemakaian pribadi dalam kota. Dilengkapi fitur keselamatan canggih Honda Sensing, panoramic glass roof, remote engine start. Kondisi sangat terawat.',
    lokasi: 'Showroom Pusat - Jakarta Selatan',
    featured: true,
    promo: false,
    created_at: '2026-09-05T14:30:00Z',
    updated_at: '2026-09-21T09:15:00Z',
    fotos: [
      {
        id: 'f-hrv-1',
        kendaraan_id: 'car-hrv-se-02',
        url: '/src/assets/images/car_hrv_black_metallic_1790299487621.jpg',
        kategori: 'eksterior',
        urutan: 1,
        caption: 'Tampak Eksterior Depan Hitam Metalik'
      },
      {
        id: 'f-hrv-2',
        kendaraan_id: 'car-hrv-se-02',
        url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
        kategori: 'interior',
        urutan: 2,
        caption: 'Jok Kulit Hitam & Konsol Tengah Mewah'
      },
      {
        id: 'f-hrv-3',
        kendaraan_id: 'car-hrv-se-02',
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
        kategori: 'dashboard',
        urutan: 3,
        caption: 'Stir Multifungsi & Adaptive Cruise Control'
      },
      {
        id: 'f-hrv-4',
        kendaraan_id: 'car-hrv-se-02',
        url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80',
        kategori: 'mesin',
        urutan: 4,
        caption: 'Mesin 1.5 i-VTEC Halus Kering'
      },
      {
        id: 'f-hrv-5',
        kendaraan_id: 'car-hrv-se-02',
        url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
        kategori: 'ban',
        urutan: 5,
        caption: 'Ban Bridgestone Kondisi 88%'
      },
      {
        id: 'f-hrv-6',
        kendaraan_id: 'car-hrv-se-02',
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
        kategori: 'dokumen',
        urutan: 6,
        caption: 'BPKB, Faktur, Pajak Panjang'
      }
    ],
    inspeksi: {
      id: 'insp-hrv-02',
      kendaraan_id: 'car-hrv-se-02',
      skor_mesin: 95,
      skor_interior: 93,
      skor_eksterior: 91,
      skor_kaki: 92,
      skor_kelistrikan: 96,
      skor_ban: 88,
      catatan: 'Ada baret halus wajar di sudut bemper belakang bawah (sudah di-detailing profesional). Mesin sangat halus, transmisi responsif tanpa delay. Lolos 150 titik inspeksi ketat.',
      inspektur: 'Rian Firdaus, Senior Vehicle Inspector',
      tgl_inspeksi: '2026-09-17',
      bebas_banjir: true,
      bebas_tabrak: true,
      surat_lengkap: true
    }
  },

  // 3. MOBIL: Toyota Avanza 1.5 G CVT 2021 (Grade B+)
  {
    id: 'car-avanza-g-03',
    kategori: 'mobil',
    merk: 'Toyota',
    model: 'Avanza',
    varian: '1.5 G CVT All New',
    tahun: 2021,
    warna: 'Silver Mica Metallic',
    nopol: 'D 1748 SAC',
    no_mesin: '2NR-VE904128',
    no_rangka: 'MHFM455PJ0109283',
    pajak_berlaku: '2026-11-20',
    pajak_status: 'Hidup',
    transmisi: 'Matic',
    bahan_bakar: 'Bensin',
    cc: 1496,
    km: 48500,
    harga_tunai: 208000000,
    harga_kredit: 198000000,
    dp_min: 20000000,
    angsuran_mulai: 4800000,
    grade: 'B+',
    status: 'Tersedia',
    agen_id: 'usr-agen-2',
    agen_nama: 'Siti Rahmawati',
    agen_wa: '6281987654321',
    deskripsi: 'All New Avanza FWD generasi terbaru, kabin lega dengan konfigurasi sofa mode. Mesin 1.5 Dual VVT-i irit bertenaga. Sudah repaint bemper depan karena goresan parkir (cat rapih oven standard pabrik). Siap pakai jarak jauh bersama keluarga.',
    lokasi: 'Cabang Bandung - Pasteur',
    featured: false,
    promo: true,
    promo_text: 'Paket DP Ringan 20 Juta',
    created_at: '2026-09-10T11:00:00Z',
    updated_at: '2026-09-22T15:20:00Z',
    fotos: [
      {
        id: 'f-avanza-1',
        kendaraan_id: 'car-avanza-g-03',
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
        kategori: 'eksterior',
        urutan: 1,
        caption: 'Eksterior Samping Silver Metalik'
      },
      {
        id: 'f-avanza-2',
        kendaraan_id: 'car-avanza-g-03',
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
        kategori: 'interior',
        urutan: 2,
        caption: 'Kabin 7 Penumpang Bersih & Sofa Mode'
      },
      {
        id: 'f-avanza-3',
        kendaraan_id: 'car-avanza-g-03',
        url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80',
        kategori: 'mesin',
        urutan: 3,
        caption: 'Mesin Dual VVT-i Standar'
      },
      {
        id: 'f-avanza-4',
        kendaraan_id: 'car-avanza-g-03',
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
        kategori: 'dokumen',
        urutan: 4,
        caption: 'Kelengkapan Surat & Pajak'
      }
    ],
    inspeksi: {
      id: 'insp-avanza-03',
      kendaraan_id: 'car-avanza-g-03',
      skor_mesin: 88,
      skor_interior: 86,
      skor_eksterior: 84,
      skor_kaki: 85,
      skor_kelistrikan: 90,
      skor_ban: 82,
      catatan: 'Cat bemper depan pernah di-touch up rapi. Mesin kering tanpa rembesan oli. Kampas rem depan 75%. Shockbreaker belakang normal tidak bocor. Dokumen asli lengkap.',
      inspektur: 'Ir. Agus Setyawan, Certified Master Inspector',
      tgl_inspeksi: '2026-09-15',
      bebas_banjir: true,
      bebas_tabrak: true,
      surat_lengkap: true
    }
  },

  // 4. MOTOR: Honda PCX 160 ABS 2023 (Grade A+)
  {
    id: 'bike-pcx-160-04',
    kategori: 'motor',
    merk: 'Honda',
    model: 'PCX 160',
    varian: 'ABS Smart Key (Matte Blue Special)',
    tahun: 2023,
    warna: 'Matte Imperial Navy Blue',
    nopol: 'B 4102 BGH',
    no_mesin: 'KF41E-1092834',
    no_rangka: 'MH1KF4118PK923841',
    pajak_berlaku: '2027-06-25',
    pajak_status: 'Hidup',
    transmisi: 'Matic',
    bahan_bakar: 'Bensin',
    cc: 157,
    km: 6400,
    harga_tunai: 32500000,
    harga_kredit: 31000000,
    dp_min: 3500000,
    angsuran_mulai: 1150000,
    grade: 'A+',
    status: 'Tersedia',
    agen_id: 'usr-agen-1',
    agen_nama: 'Hendra Wijaya',
    agen_wa: '6281312345678',
    deskripsi: 'Kondisi 99% seperti motor baru dari dealer. Tangan pertama, KM sangat rendah 6.400 km. Full orisinil baut belum pernah kena kunci kecuali ganti oli rutin di AHASS. Smart key remote 2 pcs lengkap dengan barcode dan pin emergency. Ban masih ada garis pabrik.',
    lokasi: 'Showroom Pusat - Jakarta Selatan',
    featured: true,
    promo: true,
    promo_text: 'Bonus Helm Exclusive & Jaket Riding',
    created_at: '2026-09-08T08:00:00Z',
    updated_at: '2026-09-23T11:00:00Z',
    fotos: [
      {
        id: 'f-pcx-1',
        kendaraan_id: 'bike-pcx-160-04',
        url: '/src/assets/images/bike_pcx_scooter_matte_1790299496601.jpg',
        kategori: 'eksterior',
        urutan: 1,
        caption: 'Bodi Samping Matte Navy Blue Full Orisinil'
      },
      {
        id: 'f-pcx-2',
        kendaraan_id: 'bike-pcx-160-04',
        url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
        kategori: 'dashboard',
        urutan: 2,
        caption: 'Speedometer Digital & Smart Key System'
      },
      {
        id: 'f-pcx-3',
        kendaraan_id: 'bike-pcx-160-04',
        url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
        kategori: 'mesin',
        urutan: 3,
        caption: 'Mesin eSP+ 4 Katup Halus Bertenaga'
      },
      {
        id: 'f-pcx-4',
        kendaraan_id: 'bike-pcx-160-04',
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
        kategori: 'dokumen',
        urutan: 4,
        caption: 'BPKB, STNK & Buku Garansi AHASS'
      }
    ],
    inspeksi: {
      id: 'insp-pcx-04',
      kendaraan_id: 'bike-pcx-160-04',
      skor_mesin: 99,
      skor_interior: 98,
      skor_eksterior: 98,
      skor_kaki: 99,
      skor_kelistrikan: 100,
      skor_ban: 96,
      catatan: 'Unit super istimewa. CVT sangat halus tanpa gredek. Kompresi mesin padat, tarikan enteng. Seluruh panel plastik dan cat dove tanpa cacat.',
      inspektur: 'Bambang Sudiro, Motorcycle Inspection Specialist',
      tgl_inspeksi: '2026-09-20',
      bebas_banjir: true,
      bebas_tabrak: true,
      surat_lengkap: true
    }
  },

  // 5. MOTOR: Vespa Sprint S 150 i-Get ABS 2022 (Grade A)
  {
    id: 'bike-vespa-sprint-05',
    kategori: 'motor',
    merk: 'Vespa',
    model: 'Sprint S 150',
    varian: '150 i-Get ABS TFT Edition',
    tahun: 2022,
    warna: 'Titanium Grey Matte',
    nopol: 'B 3918 PKJ',
    no_mesin: 'MD31M-8192834',
    no_rangka: 'ZAPM91100NP182934',
    pajak_berlaku: '2027-02-14',
    pajak_status: 'Hidup',
    transmisi: 'Matic',
    bahan_bakar: 'Bensin',
    cc: 155,
    km: 11200,
    harga_tunai: 48500000,
    harga_kredit: 46000000,
    dp_min: 5000000,
    angsuran_mulai: 1650000,
    grade: 'A',
    status: 'Tersedia',
    agen_id: 'usr-agen-2',
    agen_nama: 'Siti Rahmawati',
    agen_wa: '6281987654321',
    deskripsi: 'Vespa Sprint S 150 i-Get edisi warna favorit Titanium Grey. Bodi plat baja mulus terlindungi Paint Protection Film (PPF). Kunci biru & coklat lengkap, spion orisinil, mesin halus kering tanpa getar berlebih. Siap nongkrong dan harian.',
    lokasi: 'Cabang BSD - Tangerang Selatan',
    featured: true,
    promo: false,
    created_at: '2026-09-12T09:40:00Z',
    updated_at: '2026-09-21T16:00:00Z',
    fotos: [
      {
        id: 'f-vespa-1',
        kendaraan_id: 'bike-vespa-sprint-05',
        url: '/src/assets/images/bike_vespa_sprint_grey_1790299507805.jpg',
        kategori: 'eksterior',
        urutan: 1,
        caption: 'Bodi Titanium Grey Matte Elegan'
      },
      {
        id: 'f-vespa-2',
        kendaraan_id: 'bike-vespa-sprint-05',
        url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
        kategori: 'interior',
        urutan: 2,
        caption: 'Jok Custom Kulit Coklat Elegan & Behel Hitam'
      },
      {
        id: 'f-vespa-3',
        kendaraan_id: 'bike-vespa-sprint-05',
        url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
        kategori: 'mesin',
        urutan: 3,
        caption: 'Mesin i-Get 150cc Bersih dan Responsif'
      },
      {
        id: 'f-vespa-4',
        kendaraan_id: 'bike-vespa-sprint-05',
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
        kategori: 'dokumen',
        urutan: 4,
        caption: 'Kunci Biru & Master Coklat Lengkap'
      }
    ],
    inspeksi: {
      id: 'insp-vespa-05',
      kendaraan_id: 'bike-vespa-sprint-05',
      skor_mesin: 94,
      skor_interior: 95,
      skor_eksterior: 92,
      skor_kaki: 93,
      skor_kelistrikan: 95,
      skor_ban: 90,
      catatan: 'Bodi monocoque bebas benturan dan karat. Peredam kejut single arm depan presisi dan stabil. Kampas kopling baru di-servis.',
      inspektur: 'Bambang Sudiro, Motorcycle Inspection Specialist',
      tgl_inspeksi: '2026-09-19',
      bebas_banjir: true,
      bebas_tabrak: true,
      surat_lengkap: true
    }
  },

  // 6. MOTOR: Yamaha NMAX 155 Connected 2021 (Grade B+)
  {
    id: 'bike-nmax-155-06',
    kategori: 'motor',
    merk: 'Yamaha',
    model: 'NMAX 155',
    varian: 'Connected Non ABS (Y-Connect)',
    tahun: 2021,
    warna: 'Matte Black Gold Wheels',
    nopol: 'D 3341 UBF',
    no_mesin: 'G3L8E-0192834',
    no_rangka: 'MH3SG5610MJ092819',
    pajak_berlaku: '2026-10-18',
    pajak_status: 'Hidup',
    transmisi: 'Matic',
    bahan_bakar: 'Bensin',
    cc: 155,
    km: 31200,
    harga_tunai: 24800000,
    harga_kredit: 23500000,
    dp_min: 2500000,
    angsuran_mulai: 920000,
    grade: 'B+',
    status: 'Tersedia',
    agen_id: 'usr-agen-1',
    agen_nama: 'Hendra Wijaya',
    agen_wa: '6281312345678',
    deskripsi: 'Yamaha All New NMAX 155 Connected velg emas orisinil pabrik. Fitur Y-Connect aktif terhubung smartphone. Pemakaian harian normal kerja. Mesin standar halus, tarikan VVA aktif bertenaga. Sudah ganti v-belt dan oli baru, tinggal gas siap pakai.',
    lokasi: 'Cabang Bandung - Pasteur',
    featured: false,
    promo: false,
    created_at: '2026-09-14T10:15:00Z',
    updated_at: '2026-09-22T08:00:00Z',
    fotos: [
      {
        id: 'f-nmax-1',
        kendaraan_id: 'bike-nmax-155-06',
        url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
        kategori: 'eksterior',
        urutan: 1,
        caption: 'Bodi Hitam Doff Velg Emas'
      },
      {
        id: 'f-nmax-2',
        kendaraan_id: 'bike-nmax-155-06',
        url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
        kategori: 'mesin',
        urutan: 2,
        caption: 'Mesin VVA 155cc Servis Berkala Yamaha'
      },
      {
        id: 'f-nmax-3',
        kendaraan_id: 'bike-nmax-155-06',
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
        kategori: 'dokumen',
        urutan: 3,
        caption: 'Surat BPKB, STNK dan Faktur Lengkap'
      }
    ],
    inspeksi: {
      id: 'insp-nmax-06',
      kendaraan_id: 'bike-nmax-155-06',
      skor_mesin: 87,
      skor_interior: 85,
      skor_eksterior: 83,
      skor_kaki: 86,
      skor_kelistrikan: 89,
      skor_ban: 80,
      catatan: 'Ada goresan halus di bordes kanan bawah. Mesin halus, kompresi normal. V-belt baru diganti ori Yamaha di KM 30.000.',
      inspektur: 'Bambang Sudiro, Motorcycle Inspection Specialist',
      tgl_inspeksi: '2026-09-19',
      bebas_banjir: true,
      bebas_tabrak: true,
      surat_lengkap: true
    }
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-001',
    kendaraan_id: 'car-innova-zenix-01',
    kendaraan_nama: 'Toyota Innova Zenix 2.0 Q HV 2023',
    nama: 'Bambang Prasetyo',
    no_wa: '628123450987',
    pesan: 'Halo mas Hendra, mau tanya ketersediaan Innova Zenix dan simulasi DP 100jt tenor 4 tahun.',
    marketing_id: 'usr-marketing-1',
    marketing_nama: 'Rizky Pratama',
    status: 'Jadwal Test Drive',
    created_at: '2026-09-22T08:30:00Z'
  },
  {
    id: 'lead-002',
    kendaraan_id: 'bike-pcx-160-04',
    kendaraan_nama: 'Honda PCX 160 ABS 2023',
    nama: 'Dimas Anggoro',
    no_wa: '6287711224455',
    pesan: 'Selamat siang, apakah PCX Matte Blue masih ready? Bisa nego tipis di lokasi?',
    marketing_id: 'usr-marketing-1',
    marketing_nama: 'Rizky Pratama',
    status: 'Follow Up',
    created_at: '2026-09-23T14:15:00Z'
  },
  {
    id: 'lead-003',
    kendaraan_id: 'car-hrv-se-02',
    kendaraan_nama: 'Honda HR-V 1.5 SE CVT 2022',
    nama: 'Ibu Ratna Juwita',
    no_wa: '6281899001122',
    pesan: 'Apakah HR-V hitam ini bisa tukar tambah dengan Yaris 2018 saya?',
    marketing_id: 'usr-marketing-1',
    marketing_nama: 'Rizky Pratama',
    status: 'Baru',
    created_at: '2026-09-24T09:00:00Z'
  }
];

export const INITIAL_TRANSACTIONS: Transaksi[] = [
  {
    id: 'trx-001',
    no_invoice: 'INV/MOKAS/202609/0081',
    kendaraan_id: 'car-hrv-se-02',
    kendaraan_nama: 'Honda HR-V 1.5 SE CVT 2022',
    pembeli: 'Bapak Gunawan Santoso',
    pembeli_wa: '6281122334455',
    agen_id: 'usr-agen-1',
    agen_nama: 'Hendra Wijaya',
    marketing_id: 'usr-marketing-1',
    marketing_nama: 'Rizky Pratama',
    harga: 368000000,
    dp: 50000000,
    sisa_bayar: 318000000,
    metode: 'Kredit',
    status_bayar: 'DP Diterima',
    tgl_transaksi: '2026-09-21',
    catatan: 'Proses leasing via BCA Finance, approval credit keluar hari Jumat.'
  },
  {
    id: 'trx-002',
    no_invoice: 'INV/MOKAS/202609/0082',
    kendaraan_id: 'bike-vespa-sprint-05',
    kendaraan_nama: 'Vespa Sprint S 150 i-Get 2022',
    pembeli: 'Alifia Zahra',
    pembeli_wa: '628567890123',
    agen_id: 'usr-agen-2',
    agen_nama: 'Siti Rahmawati',
    marketing_id: 'usr-marketing-1',
    marketing_nama: 'Rizky Pratama',
    harga: 48500000,
    dp: 48500000,
    sisa_bayar: 0,
    metode: 'Transfer Bank',
    status_bayar: 'Lunas',
    tgl_transaksi: '2026-09-20',
    tgl_pelunasan: '2026-09-20',
    catatan: 'Pelunasan transfer Bank Mandiri. Unit sudah serah terima berikut STNK & BPKB.'
  }
];

export const INITIAL_COMMISSIONS: Komisi[] = [
  {
    id: 'kom-001',
    transaksi_id: 'trx-002',
    no_invoice: 'INV/MOKAS/202609/0082',
    kendaraan_nama: 'Vespa Sprint S 150 i-Get 2022',
    user_id: 'usr-agen-2',
    user_nama: 'Siti Rahmawati',
    user_role: 'agen',
    jumlah: 1500000,
    status: 'Disetujui',
    tgl_cair: '2026-09-22'
  },
  {
    id: 'kom-002',
    transaksi_id: 'trx-002',
    no_invoice: 'INV/MOKAS/202609/0082',
    kendaraan_nama: 'Vespa Sprint S 150 i-Get 2022',
    user_id: 'usr-marketing-1',
    user_nama: 'Rizky Pratama',
    user_role: 'marketing',
    jumlah: 750000,
    status: 'Disetujui',
    tgl_cair: '2026-09-22'
  },
  {
    id: 'kom-003',
    transaksi_id: 'trx-001',
    no_invoice: 'INV/MOKAS/202609/0081',
    kendaraan_nama: 'Honda HR-V 1.5 SE CVT 2022',
    user_id: 'usr-agen-1',
    user_nama: 'Hendra Wijaya',
    user_role: 'agen',
    jumlah: 4000000,
    status: 'Menunggu'
  }
];
