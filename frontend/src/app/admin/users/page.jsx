'use client';
// src/app/admin/users/page.jsx

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { adminAPI } from '@/lib/api';
import { Loader2, UserCheck, UserX, UserPlus, X, TriangleAlert } from 'lucide-react';

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('');
  const [modal,   setModal]   = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) router.push('/auth/login');
  }, [user, authLoading]);

  const fetchUsers = () => {
    setLoading(true);
    adminAPI.getAllUsers({ role: filter || undefined })
      .then(r => setUsers(r.data.data || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (user?.role === 'admin') fetchUsers(); }, [user, filter]);

  const handleToggle = async (id) => {
    await adminAPI.toggleUser(id);
    fetchUsers();
  };

  if (authLoading || !user) return null;

  const tabs = [
    { v: '', l: 'Semua' },
    { v: 'mahasiswa', l: 'Mahasiswa' },
    { v: 'penyelenggara', l: 'Penyelenggara' },
    { v: 'admin', l: 'Admin' },
  ];

  return (
    <DashboardLayout title="Kelola Pengguna">
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div className="flex gap-2">
          {tabs.map(opt => (
            <button key={opt.v} onClick={() => setFilter(opt.v)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition border ${
                filter === opt.v
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}>
              {opt.l}
            </button>
          ))}
        </div>
        <button onClick={() => setModal(true)} className="btn-primary text-sm">
          <UserPlus className="h-4 w-4" /> Tambah Akun
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-7 w-7 animate-spin text-brand-400" /></div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Nama & Email','Role','NIM / Jurusan','Status','Bergabung','Aksi'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{u.nama}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={u.role === 'admin' ? 'badge-red' : u.role === 'penyelenggara' ? 'badge-amber' : 'badge-blue'}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {u.nim && <p>{u.nim}</p>}
                    {u.jurusan && <p>{u.jurusan}</p>}
                    {!u.nim && !u.jurusan && '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={u.is_active ? 'badge-green' : 'badge-red'}>
                      {u.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(u.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-4 py-3">
                    {u.id !== user.id && (
                      <button onClick={() => handleToggle(u.id)}
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition ${
                          u.is_active
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}>
                        {u.is_active ? <><UserX className="h-3.5 w-3.5" /> Nonaktifkan</> : <><UserCheck className="h-3.5 w-3.5" /> Aktifkan</>}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-sm">Tidak ada pengguna ditemukan</div>
          )}
        </div>
      )}

      {modal && <TambahAkunModal onClose={() => setModal(false)} onSaved={() => { setModal(false); fetchUsers(); }} />}
    </DashboardLayout>
  );
}

function TambahAkunModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ nama: '', email: '', password: '', role: 'mahasiswa' });
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const onField = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const simpan = async () => {
    setErr('');
    if (!form.nama.trim() || !form.email.trim() || !form.password.trim()) {
      return setErr('Semua field wajib diisi.');
    }
    if (form.password.length < 6) return setErr('Password minimal 6 karakter.');

    setSaving(true);
    try {
      await adminAPI.createUser(form);
      onSaved();
    } catch (e) {
      setErr(e.response?.data?.message || 'Gagal membuat akun.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">Tambah Akun Baru</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
        </div>

        {err && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-xl mb-4">
            <TriangleAlert className="h-4 w-4 flex-shrink-0" /> {err}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Lengkap</label>
            <input name="nama" value={form.nama} onChange={onField} className="input-base" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
            <input name="email" type="email" value={form.email} onChange={onField} className="input-base" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
            <input name="password" type="password" value={form.password} onChange={onField} className="input-base" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
            <select name="role" value={form.role} onChange={onField} className="input-base">
              <option value="mahasiswa">Mahasiswa</option>
              <option value="penyelenggara">Penyelenggara</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={simpan} disabled={saving} className="btn-primary flex-1">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Buat Akun'}
            </button>
            <button onClick={onClose} className="btn-secondary px-5">Batal</button>
          </div>
        </div>
      </div>
    </div>
  );
}
