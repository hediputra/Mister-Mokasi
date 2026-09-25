/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/home/HomePage';
import { CatalogPage } from './components/catalog/CatalogPage';
import { VehicleDetailPage } from './components/detail/VehicleDetailPage';
import { WarrantyPage } from './components/pages/WarrantyPage';
import { CalculatorPage } from './components/pages/CalculatorPage';
import { DocsPage } from './components/pages/DocsPage';
import { DashboardShell } from './components/dashboard/DashboardShell';
import { CompareDrawer } from './components/CompareDrawer';
import { BookingModal } from './components/modals/BookingModal';
import { InvoicePrintModal } from './components/modals/InvoicePrintModal';
import { Transaksi } from './types';
import { MessageCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeView,
    selectedVehicleId,
    selectedInvoice,
    setSelectedInvoice
  } = useApp();

  // Search parameters passed from hero to catalog
  const [catalogFilters, setCatalogFilters] = useState<{
    kategori?: 'mobil' | 'motor' | 'all';
    merk?: string;
    maxPrice?: number;
  }>({});

  // Booking modal state
  const [bookingVehicleId, setBookingVehicleId] = useState<string | null>(null);

  const handleHeroSearch = (filters: { kategori?: 'mobil' | 'motor' | 'all'; merk?: string; maxPrice?: number }) => {
    setCatalogFilters(filters);
  };

  const handleOpenBooking = (vehicleId: string) => {
    setBookingVehicleId(vehicleId);
  };

  const handleBookingSuccess = (newTrx: Transaksi) => {
    setBookingVehicleId(null);
    setSelectedInvoice(newTrx);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-amber-100 selection:text-amber-900">
      
      {/* 1. Top Bar Navigation (Top Bar Contract) */}
      <Navbar />

      {/* 2. Main Page Views */}
      <main className="flex-1">
        {activeView === 'home' && <HomePage onSearch={handleHeroSearch} />}
        {activeView === 'catalog' && (
          <CatalogPage
            initialKategori={catalogFilters.kategori}
            initialMerk={catalogFilters.merk}
            initialMaxPrice={catalogFilters.maxPrice}
          />
        )}
        {activeView === 'detail' && selectedVehicleId && (
          <VehicleDetailPage
            vehicleId={selectedVehicleId}
            onOpenBooking={handleOpenBooking}
          />
        )}
        {activeView === 'warranty' && <WarrantyPage />}
        {activeView === 'calculator' && <CalculatorPage />}
        {activeView === 'docs' && <DocsPage />}
        {activeView === 'dashboard' && (
          <DashboardShell onOpenInvoice={(trx) => setSelectedInvoice(trx)} />
        )}
      </main>

      {/* 3. Global Modals & Drawers */}
      <CompareDrawer />

      {bookingVehicleId && (
        <BookingModal
          vehicleId={bookingVehicleId}
          onClose={() => setBookingVehicleId(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {selectedInvoice && (
        <InvoicePrintModal
          transaction={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {/* 4. Floating WhatsApp Action Button */}
      <a
        href="https://wa.me/6281288889901?text=Halo%20Admin%20Mr.%20Mokas,%20saya%20tertarik%20konsultasi%20kendaraan%20bekas%20bergaransi."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-95 flex items-center justify-center group"
        title="Hubungi WhatsApp Showroom"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold font-sans pl-0 group-hover:pl-2">
          Chat Showroom
        </span>
      </a>

      {/* 5. Footer */}
      <Footer />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
