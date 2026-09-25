import React, { createContext, useContext, useState, useEffect } from 'react';
import { Kendaraan, User, UserRole, Lead, Transaksi, Komisi, VehicleStatus, PaymentStatus } from '../types';
import { INITIAL_USERS, INITIAL_VEHICLES, INITIAL_LEADS, INITIAL_TRANSACTIONS, INITIAL_COMMISSIONS } from '../data/seedData';

interface AppContextType {
  currentUser: User;
  users: User[];
  vehicles: Kendaraan[];
  leads: Lead[];
  transactions: Transaksi[];
  commissions: Komisi[];
  favorites: string[];
  compareList: string[];
  activeView: 'home' | 'catalog' | 'detail' | 'warranty' | 'calculator' | 'about' | 'contact' | 'dashboard' | 'docs';
  selectedVehicleId: string | null;
  selectedInvoice: Transaksi | null;
  isCompareDrawerOpen: boolean;

  // View Navigation
  setActiveView: (view: 'home' | 'catalog' | 'detail' | 'warranty' | 'calculator' | 'about' | 'contact' | 'dashboard' | 'docs') => void;
  setSelectedVehicleId: (id: string | null) => void;
  setSelectedInvoice: (trx: Transaksi | null) => void;
  setIsCompareDrawerOpen: (open: boolean) => void;

  // Role Management
  switchRole: (role: UserRole) => void;
  updateUser: (userId: string, data: Partial<User>) => void;
  addUser: (userData: Omit<User, 'id'>) => void;

  // Vehicle Management
  addVehicle: (data: Omit<Kendaraan, 'id' | 'created_at' | 'updated_at'>) => Kendaraan;
  updateVehicle: (id: string, data: Partial<Kendaraan>) => void;
  updateVehicleStatus: (id: string, status: VehicleStatus) => void;
  approveVehicle: (id: string) => void;
  rejectVehicle: (id: string) => void;
  deleteVehicle: (id: string) => void;

  // Favorites & Compare
  toggleFavorite: (id: string) => void;
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;

  // Leads
  createLead: (lead: { kendaraan_id: string; kendaraan_nama: string; nama: string; no_wa: string; pesan: string; marketing_id?: string }) => void;
  updateLeadStatus: (id: string, status: Lead['status']) => void;

  // Transactions & Commissions
  createBooking: (payload: {
    kendaraan_id: string;
    pembeli: string;
    pembeli_wa: string;
    dp: number;
    metode: Transaksi['metode'];
    catatan?: string;
  }) => Transaksi;
  verifyTransaction: (id: string, status: PaymentStatus) => void;
  disburseCommission: (komisiId: string) => void;

  // Reset
  resetDataToSeed: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'mr_mokas_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initial State from localStorage or Seeds
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    return users.find(u => u.role === 'admin') || users[0];
  });

  const [vehicles, setVehicles] = useState<Kendaraan[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}vehicles`);
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}leads`);
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [transactions, setTransactions] = useState<Transaksi[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}transactions`);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [commissions, setCommissions] = useState<Komisi[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}commissions`);
    return saved ? JSON.parse(saved) : INITIAL_COMMISSIONS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}favorites`);
    return saved ? JSON.parse(saved) : [];
  });

  const [compareList, setCompareList] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<AppContextType['activeView']>('home');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Transaksi | null>(null);
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}vehicles`, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}leads`, JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}transactions`, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}commissions`, JSON.stringify(commissions));
  }, [commissions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}favorites`, JSON.stringify(favorites));
  }, [favorites]);

  // Role Switcher
  const switchRole = (role: UserRole) => {
    if (role === 'customer') {
      setCurrentUser({
        id: 'usr-customer-guest',
        nama: 'Pengunjung Publik',
        email: 'tamu@gmail.com',
        role: 'customer',
        no_wa: '081234567890',
        status: 'Aktif'
      });
      return;
    }

    const matched = users.find(u => u.role === role);
    if (matched) {
      setCurrentUser(matched);
    }
  };

  const updateUser = (userId: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...data }));
    }
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`
    };
    setUsers(prev => [...prev, newUser]);
  };

  // Vehicles
  const addVehicle = (data: Omit<Kendaraan, 'id' | 'created_at' | 'updated_at'>): Kendaraan => {
    const newVehicle: Kendaraan = {
      ...data,
      id: `veh-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setVehicles(prev => [newVehicle, ...prev]);
    return newVehicle;
  };

  const updateVehicle = (id: string, data: Partial<Kendaraan>) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...data, updated_at: new Date().toISOString() } : v));
  };

  const updateVehicleStatus = (id: string, status: VehicleStatus) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, status, updated_at: new Date().toISOString() } : v));
  };

  const approveVehicle = (id: string) => {
    updateVehicleStatus(id, 'Tersedia');
  };

  const rejectVehicle = (id: string) => {
    updateVehicleStatus(id, 'Ditolak');
  };

  const deleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  // Favorites
  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      return [...prev, id];
    });
  };

  // Compare
  const addToCompare = (id: string) => {
    if (compareList.includes(id)) return;
    if (compareList.length >= 4) {
      // keep max 4
      setCompareList(prev => [...prev.slice(1), id]);
    } else {
      setCompareList(prev => [...prev, id]);
    }
    setIsCompareDrawerOpen(true);
  };

  const removeFromCompare = (id: string) => {
    setCompareList(prev => prev.filter(item => item !== id));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  // Leads
  const createLead = (leadData: {
    kendaraan_id: string;
    kendaraan_nama: string;
    nama: string;
    no_wa: string;
    pesan: string;
    marketing_id?: string;
  }) => {
    const defaultMkt = users.find(u => u.role === 'marketing');
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      ...leadData,
      marketing_id: leadData.marketing_id || defaultMkt?.id,
      marketing_nama: defaultMkt?.nama || 'Marketing Officer',
      status: 'Baru',
      created_at: new Date().toISOString()
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  // Booking & Transactions
  const createBooking = (payload: {
    kendaraan_id: string;
    pembeli: string;
    pembeli_wa: string;
    dp: number;
    metode: Transaksi['metode'];
    catatan?: string;
  }): Transaksi => {
    const targetVeh = vehicles.find(v => v.id === payload.kendaraan_id);
    const agent = users.find(u => u.id === targetVeh?.agen_id) || users.find(u => u.role === 'agen') || users[1];
    const marketing = users.find(u => u.role === 'marketing') || users[4];

    const invoiceNum = `INV/MOKAS/${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}/${Math.floor(1000 + Math.random() * 9000)}`;
    const finalPrice = targetVeh ? targetVeh.harga_tunai : 100000000;
    const sisa = Math.max(0, finalPrice - payload.dp);

    const newTrx: Transaksi = {
      id: `trx-${Date.now()}`,
      no_invoice: invoiceNum,
      kendaraan_id: payload.kendaraan_id,
      kendaraan_nama: targetVeh ? `${targetVeh.merk} ${targetVeh.model} ${targetVeh.tahun}` : 'Unit Kendaraan',
      pembeli: payload.pembeli,
      pembeli_wa: payload.pembeli_wa,
      agen_id: agent.id,
      agen_nama: agent.nama,
      marketing_id: marketing?.id,
      marketing_nama: marketing?.nama,
      harga: finalPrice,
      dp: payload.dp,
      sisa_bayar: sisa,
      metode: payload.metode,
      status_bayar: payload.dp >= finalPrice ? 'Lunas' : 'DP Diterima',
      tgl_transaksi: new Date().toISOString().split('T')[0],
      catatan: payload.catatan || 'Booking via web Mr. Mokas'
    };

    setTransactions(prev => [newTrx, ...prev]);

    // Update vehicle status to 'Booking'
    updateVehicleStatus(payload.kendaraan_id, payload.dp >= finalPrice ? 'Terjual' : 'Booking');

    // Generate commission stubs for Agent and Marketing
    const agentKomisiAmount = Math.round(finalPrice * 0.012); // ~1.2%
    const mktKomisiAmount = Math.round(finalPrice * 0.005); // ~0.5%

    const newCommissions: Komisi[] = [
      {
        id: `kom-${Date.now()}-1`,
        transaksi_id: newTrx.id,
        no_invoice: newTrx.no_invoice,
        kendaraan_nama: newTrx.kendaraan_nama,
        user_id: agent.id,
        user_nama: agent.nama,
        user_role: 'agen',
        jumlah: agentKomisiAmount,
        status: 'Menunggu'
      },
      {
        id: `kom-${Date.now()}-2`,
        transaksi_id: newTrx.id,
        no_invoice: newTrx.no_invoice,
        kendaraan_nama: newTrx.kendaraan_nama,
        user_id: marketing.id,
        user_nama: marketing.nama,
        user_role: 'marketing',
        jumlah: mktKomisiAmount,
        status: 'Menunggu'
      }
    ];

    setCommissions(prev => [...newCommissions, ...prev]);

    return newTrx;
  };

  const verifyTransaction = (id: string, status: PaymentStatus) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        const isLunas = status === 'Lunas';
        if (isLunas) {
          updateVehicleStatus(t.kendaraan_id, 'Terjual');
        }
        return {
          ...t,
          status_bayar: status,
          tgl_pelunasan: isLunas ? new Date().toISOString().split('T')[0] : t.tgl_pelunasan
        };
      }
      return t;
    }));
  };

  const disburseCommission = (komisiId: string) => {
    setCommissions(prev => prev.map(k => {
      if (k.id === komisiId) {
        return {
          ...k,
          status: 'Dicairkan',
          tgl_cair: new Date().toISOString().split('T')[0]
        };
      }
      return k;
    }));
  };

  const resetDataToSeed = () => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}users`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}vehicles`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}leads`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}transactions`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}commissions`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}favorites`);

    setUsers(INITIAL_USERS);
    setVehicles(INITIAL_VEHICLES);
    setLeads(INITIAL_LEADS);
    setTransactions(INITIAL_TRANSACTIONS);
    setCommissions(INITIAL_COMMISSIONS);
    setFavorites([]);
    setCompareList([]);
    setCurrentUser(INITIAL_USERS[0]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        vehicles,
        leads,
        transactions,
        commissions,
        favorites,
        compareList,
        activeView,
        selectedVehicleId,
        selectedInvoice,
        isCompareDrawerOpen,
        setActiveView,
        setSelectedVehicleId,
        setSelectedInvoice,
        setIsCompareDrawerOpen,
        switchRole,
        updateUser,
        addUser,
        addVehicle,
        updateVehicle,
        updateVehicleStatus,
        approveVehicle,
        rejectVehicle,
        deleteVehicle,
        toggleFavorite,
        addToCompare,
        removeFromCompare,
        clearCompare,
        createLead,
        updateLeadStatus,
        createBooking,
        verifyTransaction,
        disburseCommission,
        resetDataToSeed
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
