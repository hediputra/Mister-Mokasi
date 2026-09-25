import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatNumber, formatDate } from '../../utils/formatters';
import {
  Users,
  Car,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  ShieldAlert,
  Building,
  Plus,
  Trash2,
  Check,
  Eye
} from 'lucide-react';
import { GradeBadge } from '../GradeBadge';
import { UserRole } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    vehicles,
    users,
    leads,
    transactions,
    approveVehicle,
    rejectVehicle,
    deleteVehicle,
    updateUser,
    addUser,
    setSelectedVehicleId,
    setActiveView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'approvals' | 'users' | 'inventory' | 'settings'>('approvals');
  const [newUserModalOpen, setNewUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserWa, setNewUserWa] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('agen');

  // Stats calculation
  const totalInventoryValue = vehicles.reduce((sum, v) => sum + v.harga_tunai, 0);
  const pendingApprovals = vehicles.filter(v => v.status === 'Menunggu Approval');
  const availableVehicles = vehicles.filter(v => v.status === 'Tersedia');
  const soldVehicles = vehicles.filter(v => v.status === 'Terjual');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    addUser({
      nama: newUserName,
      email: newUserEmail,
      no_wa: newUserWa,
      role: newUserRole,
      status: 'Aktif'
    });

    setNewUserName('');
    setNewUserEmail('');
    setNewUserWa('');
    setNewUserModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Global Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Nilai Inventory</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-950 font-mono tabular-nums">
            {formatRupiah(totalInventoryValue)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Total {vehicles.length} unit mobil & motor</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Unit Tersedia</span>
            <Car className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono tabular-nums">
            {availableVehicles.length} Unit
          </div>
          <p className="text-[11px] text-emerald-600 mt-1 font-semibold">{soldVehicles.length} unit terjual bulan ini</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Approval Tertunda</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-600 font-mono tabular-nums">
            {pendingApprovals.length} Unit
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Menunggu persetujuan admin</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total User & Tim</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono tabular-nums">
            {users.length} Akun
          </div>
          <p className="text-[11px] text-slate-400 mt-1">4 Role fungsional sistem</p>
        </div>
      </div>

      {/* 2. Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'approvals'
              ? 'bg-blue-950 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Listing Approval ({pendingApprovals.length})
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'inventory'
              ? 'bg-blue-950 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Semua Inventory ({vehicles.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'users'
              ? 'bg-blue-950 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Kelola Pengguna & Tim ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-blue-950 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Pengaturan Showroom
        </button>
      </div>

      {/* 3. Tab Contents */}

      {/* TAB A: Approvals */}
      {activeTab === 'approvals' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Daftar Antrean Listing Kendaraan Baru</h3>
              <p className="text-xs text-slate-500">Verifikasi kelengkapan foto & laporan inspeksi sebelum diterbitkan ke publik.</p>
            </div>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-70" />
              Tidak ada antrean approval saat ini. Semua listing kendaraan telah disetujui.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Kendaraan</th>
                    <th className="py-2.5 px-3">Grade</th>
                    <th className="py-2.5 px-3">Agen Penginput</th>
                    <th className="py-2.5 px-3">Harga Tunai</th>
                    <th className="py-2.5 px-3">Tanggal Input</th>
                    <th className="py-2.5 px-3 text-right">Aksi Approval</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingApprovals.map(veh => (
                    <tr key={veh.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={veh.fotos[0]?.url}
                            alt=""
                            className="w-12 h-9 rounded-lg object-cover"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{veh.merk} {veh.model}</span>
                            <span className="text-[10px] text-slate-500">{veh.nopol} · {veh.tahun}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <GradeBadge grade={veh.grade} size="sm" />
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700">
                        {veh.agen_nama || 'Agen Showroom'}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-blue-950 tabular-nums">
                        {formatRupiah(veh.harga_tunai)}
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {formatDate(veh.created_at)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedVehicleId(veh.id);
                              setActiveView('detail');
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                            title="Pratinjau detail"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => approveVehicle(veh.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => rejectVehicle(veh.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB B: Inventory Management */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Seluruh Data Kendaraan Showroom</h3>
              <p className="text-xs text-slate-500">Kelola status, inspeksi, dan harga jual kendaraan.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Unit Kendaraan</th>
                  <th className="py-2.5 px-3">Grade</th>
                  <th className="py-2.5 px-3">KM</th>
                  <th className="py-2.5 px-3">Harga Tunai</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Agen</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicles.map(veh => (
                  <tr key={veh.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={veh.fotos[0]?.url}
                          alt=""
                          className="w-10 h-7 rounded object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{veh.merk} {veh.model} ({veh.tahun})</p>
                          <p className="text-[10px] text-slate-400 font-mono">{veh.nopol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <GradeBadge grade={veh.grade} size="sm" />
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-slate-700">
                      {formatNumber(veh.km)} km
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-950 tabular-nums">
                      {formatRupiah(veh.harga_tunai)}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        veh.status === 'Tersedia'
                          ? 'bg-emerald-100 text-emerald-800'
                          : veh.status === 'Booking'
                          ? 'bg-amber-100 text-amber-800'
                          : veh.status === 'Terjual'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {veh.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {veh.agen_nama}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedVehicleId(veh.id);
                            setActiveView('detail');
                          }}
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                          title="Lihat detail"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteVehicle(veh.id)}
                          className="p-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-600"
                          title="Hapus unit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB C: User Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Manajemen Pengguna & Staf Showroom</h3>
              <p className="text-xs text-slate-500">Atur hak akses untuk 4 peran: Admin, Agen, Bendahara, Marketing.</p>
            </div>
            <button
              onClick={() => setNewUserModalOpen(true)}
              className="py-2 px-3 rounded-xl bg-blue-950 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Tambah User</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Nama Pengguna</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Role Sistem</th>
                  <th className="py-2.5 px-3">WhatsApp</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Ubah Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {u.nama}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                      {u.email}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] bg-blue-100 text-blue-900">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">
                      {u.no_wa}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-emerald-700 font-bold text-[11px]">Aktif</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => updateUser(u.id, { role: e.target.value as UserRole })}
                        className="py-1 px-2 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-medium"
                      >
                        <option value="admin">Admin</option>
                        <option value="agen">Agen</option>
                        <option value="bendahara">Bendahara</option>
                        <option value="marketing">Marketing</option>
                        <option value="customer">Customer</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB D: Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 max-w-2xl">
          <h3 className="font-bold text-base text-slate-900">Profil & Konfigurasi Showroom Mr. Mokas</h3>
          
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Nama Bisnis / Showroom</label>
              <input type="text" defaultValue="Mr. Mokas Showroom Mobil & Motor Bekas" className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Nomor WhatsApp Pusat (Official Care)</label>
              <input type="text" defaultValue="6281288889901" className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Alamat Head Showroom</label>
              <textarea rows={2} defaultValue="Jl. TB Simatupang No. 88, Cilandak, Jakarta Selatan 12430" className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Rekening Bank Resmi Tanda Jadi (DP)</label>
              <input type="text" defaultValue="BCA: 5410-888-999 a.n. PT Mokas Digital Indonesia" className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium" />
            </div>

            <button className="py-2.5 px-5 rounded-xl bg-blue-950 text-white font-bold text-xs shadow-sm">
              Simpan Perubahan Pengaturan
            </button>
          </div>
        </div>
      )}

      {/* Modal Add User */}
      {newUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-3">Tambah Staf / Pengguna Baru</h3>
            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Alamat Email</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Nomor WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={newUserWa}
                  onChange={(e) => setNewUserWa(e.target.value)}
                  placeholder="628123456789"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Peran / Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                >
                  <option value="agen">Agen Penjual</option>
                  <option value="marketing">Marketing Promosi</option>
                  <option value="bendahara">Bendahara Keuangan</option>
                  <option value="admin">Admin Showroom</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewUserModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-blue-950 text-white font-bold"
                >
                  Simpan User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
