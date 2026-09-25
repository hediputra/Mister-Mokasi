import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminDashboard } from './AdminDashboard';
import { AgenDashboard } from './AgenDashboard';
import { BendaharaDashboard } from './BendaharaDashboard';
import { MarketingDashboard } from './MarketingDashboard';
import { Transaksi, UserRole } from '../../types';
import { ArrowLeft, Shield, User, Wallet, Megaphone, RotateCcw } from 'lucide-react';

interface DashboardShellProps {
  onOpenInvoice: (trx: Transaksi) => void;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ onOpenInvoice }) => {
  const { currentUser, switchRole, setActiveView, resetDataToSeed } = useApp();

  const roleTabs: { role: UserRole; label: string; icon: React.ReactNode }[] = [
    { role: 'admin', label: 'Admin Showroom', icon: <Shield className="w-4 h-4" /> },
    { role: 'agen', label: 'Agen Penjual', icon: <User className="w-4 h-4" /> },
    { role: 'bendahara', label: 'Bendahara Keuangan', icon: <Wallet className="w-4 h-4" /> },
    { role: 'marketing', label: 'Marketing Promosi', icon: <Megaphone className="w-4 h-4" /> }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <button
          onClick={() => setActiveView('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Publik Showroom</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={resetDataToSeed}
            className="py-1.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            title="Reset data lokal ke data awal (seed)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Role Switcher Navigation Bar in Dashboard */}
      <div className="p-2 rounded-2xl bg-slate-100 border border-slate-200 flex flex-wrap gap-2">
        {roleTabs.map(tab => {
          const isActive = currentUser.role === tab.role;
          return (
            <button
              key={tab.role}
              onClick={() => switchRole(tab.role)}
              className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active Role Dashboard */}
      {currentUser.role === 'admin' && <AdminDashboard />}
      {currentUser.role === 'agen' && <AgenDashboard />}
      {currentUser.role === 'bendahara' && <BendaharaDashboard onOpenInvoice={onOpenInvoice} />}
      {currentUser.role === 'marketing' && <MarketingDashboard />}

    </div>
  );
};
