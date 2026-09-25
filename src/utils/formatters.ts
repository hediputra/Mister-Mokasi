import { GradeLevel } from '../types';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
}

export function calculateGrade(scores: {
  skor_mesin: number;
  skor_interior: number;
  skor_eksterior: number;
  skor_kaki: number;
  skor_kelistrikan: number;
  skor_ban: number;
}): GradeLevel {
  const avg = (
    scores.skor_mesin * 0.3 +
    scores.skor_kaki * 0.2 +
    scores.skor_eksterior * 0.15 +
    scores.skor_interior * 0.15 +
    scores.skor_kelistrikan * 0.1 +
    scores.skor_ban * 0.1
  );

  if (avg >= 96) return 'A+';
  if (avg >= 90) return 'A';
  if (avg >= 85) return 'B+';
  if (avg >= 80) return 'B';
  if (avg >= 74) return 'C+';
  if (avg >= 68) return 'C';
  if (avg >= 55) return 'D';
  return 'E';
}

export interface GradeMeta {
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  description: string;
  dotColor: string;
}

export function getGradeMeta(grade: GradeLevel): GradeMeta {
  switch (grade) {
    case 'A+':
      return {
        label: 'Grade A+ (Seperti Baru)',
        badgeBg: 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300',
        badgeText: 'text-emerald-700',
        badgeBorder: 'border-emerald-600/30',
        dotColor: 'bg-emerald-500',
        description: 'Kondisi seperti baru dari dealer, KM sangat rendah, full orisinil pabrik, servis rutin resmi.'
      };
    case 'A':
      return {
        label: 'Grade A (Sangat Baik)',
        badgeBg: 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300',
        badgeText: 'text-emerald-700',
        badgeBorder: 'border-emerald-600/30',
        dotColor: 'bg-emerald-500',
        description: 'Sangat baik, hanya pemakaian wajar, bodi mulus tanpa cat ulang, mesin & kaki-kaki prima.'
      };
    case 'B+':
      return {
        label: 'Grade B+ (Baik Plus)',
        badgeBg: 'bg-blue-500/10 text-blue-800 dark:text-blue-300',
        badgeText: 'text-blue-700',
        badgeBorder: 'border-blue-600/30',
        dotColor: 'bg-blue-500',
        description: 'Baik, ada sentuhan kosmetik minor wajar, performa mesin & suspensi terawat siap pakai.'
      };
    case 'B':
      return {
        label: 'Grade B (Baik)',
        badgeBg: 'bg-blue-500/10 text-blue-800 dark:text-blue-300',
        badgeText: 'text-blue-700',
        badgeBorder: 'border-blue-600/30',
        dotColor: 'bg-blue-500',
        description: 'Kondisi baik layak pakai, ada perbaikan minor kosmetik, dokumen lengkap terjamin.'
      };
    case 'C+':
      return {
        label: 'Grade C+ (Cukup Plus)',
        badgeBg: 'bg-amber-500/10 text-amber-800 dark:text-amber-300',
        badgeText: 'text-amber-700',
        badgeBorder: 'border-amber-600/30',
        dotColor: 'bg-amber-500',
        description: 'Kondisi cukup, membutuhkan penggantian sparepart fast-moving dalam waktu dekat.'
      };
    case 'C':
      return {
        label: 'Grade C (Cukup)',
        badgeBg: 'bg-amber-500/10 text-amber-800 dark:text-amber-300',
        badgeText: 'text-amber-700',
        badgeBorder: 'border-amber-600/30',
        dotColor: 'bg-amber-500',
        description: 'Kondisi sedang, ada perbaikan kosmetik dan kaki-kaki yang perlu diperhatikan.'
      };
    case 'D':
      return {
        label: 'Grade D (Perlu Perbaikan)',
        badgeBg: 'bg-orange-500/10 text-orange-800 dark:text-orange-300',
        badgeText: 'text-orange-700',
        badgeBorder: 'border-orange-600/30',
        dotColor: 'bg-orange-500',
        description: 'Perlu perbaikan signifikan di beberapa sektor teknis, harga ekonomis.'
      };
    case 'E':
    default:
      return {
        label: 'Grade E (Dijual Apa Adanya)',
        badgeBg: 'bg-rose-500/10 text-rose-800 dark:text-rose-300',
        badgeText: 'text-rose-700',
        badgeBorder: 'border-rose-600/30',
        dotColor: 'bg-rose-500',
        description: 'Kondisi rusak atau bahan restorasi, dijual apa adanya tanpa garansi showroom.'
      };
  }
}

export function createWhatsAppChatUrl(options: {
  phone: string;
  vehicleName: string;
  vehicleNopol?: string;
  price?: number;
  agentName?: string;
  referralCode?: string;
  customMessage?: string;
}): string {
  const cleanPhone = options.phone.replace(/[^0-9]/g, '');
  let text = '';

  if (options.customMessage) {
    text = options.customMessage;
  } else {
    text = `Halo ${options.agentName || 'Mr. Mokas'}, saya tertarik dengan unit yang diiklankan di website Mr. Mokas:\n\n` +
      `🚗 Unit: ${options.vehicleName}\n` +
      (options.vehicleNopol ? `📋 Plat: ${options.vehicleNopol}\n` : '') +
      (options.price ? `💰 Harga: ${formatRupiah(options.price)}\n` : '') +
      (options.referralCode ? `🔗 Ref: ${options.referralCode}\n\n` : '\n') +
      `Apakah unit ini masih tersedia? Kapan saya bisa test drive dan cek fisik di showroom? Terima kasih.`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function calculateCreditSimulation(
  price: number,
  dpPercent: number = 20,
  tenorYears: number = 3,
  annualInterestRate: number = 7.5
) {
  const dpNominal = Math.round((price * dpPercent) / 100);
  const loanPrincipal = price - dpNominal;
  const totalMonths = tenorYears * 12;
  const totalInterest = loanPrincipal * (annualInterestRate / 100) * tenorYears;
  const totalRepayment = loanPrincipal + totalInterest;
  const monthlyInstallment = Math.round(totalRepayment / totalMonths);
  const adminFee = 2500000;
  const insuranceEst = Math.round(price * 0.025);
  const firstPaymentTotal = dpNominal + adminFee + insuranceEst + monthlyInstallment;

  return {
    dpNominal,
    loanPrincipal,
    monthlyInstallment,
    firstPaymentTotal,
    totalMonths,
    annualInterestRate,
    adminFee,
    insuranceEst
  };
}
