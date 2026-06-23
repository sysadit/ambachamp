'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { authAPI, wishlistAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import {
  Camera, Plus, X, Loader2, TriangleAlert, CircleCheck,
  UserCircle, AtSign, Phone, MessageCircle, Medal, Save, Bookmark, Calendar
} from 'lucide-react';

export default function ProfilPage() {
  const { user, loading: authLoading, updateUser } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    nama: '', email: '', phone: '', whatsapp: '', nim: '', jurusan: '', bio: '',
  });
  const [prestasi, setPrestasi] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
    if (!authLoading && user && user.role === 'admin') router.push('/admin/dashboard');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    authAPI.getMe()
      .then((r) => {
        const d = r.data.data;
        setForm({
          nama: d.nama || '', email: d.email || '', phone: d.phone || '',
          whatsapp: d.whatsapp || '', nim: d.nim || '', jurusan: d.jurusan || '', bio: d.bio || '',
        });
        if (d.foto_profil) setPreview(`${process.env.NEXT_PUBLIC_UPLOAD_URL}/posters/${d.foto_profil}`);
        try {
          const p = d.prestasi ? JSON.parse(d.prestasi) : [];
          setPrestasi(Array.isArray(p) ? p : []);
        } catch { setPrestasi([]); }
      })
      .catch(() => setErr('Gagal memuat profil.'))
      .finally(() => setLoading(false));

    // ambil wishlist khusus mahasiswa
    if (user.role === 'mahasiswa') {
      wishlistAPI.getAll()
        .then((r) => setWishlist(r.data.data || []))
        .catch(() => setWishlist([]));
    }
  }, [user]);

  const onField = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onFoto = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFoto(f);
    setPreview(URL.createObjectURL(f));
  };

  const addPrestasi = () => setPrestasi([...prestasi, { judul: '', tahun: '' }]);
  const delPrestasi = (i) => setPrestasi(prestasi.filter((_, x) => x !== i));
  const setPrestasiVal = (i, k, v) => {
    const a = [...prestasi]; a[i] = { ...a[i], [k]: v }; setPrestasi(a);
  };

  const simpan = async () => {
    setErr(''); setOk('');
    if (!form.nama.trim()) return setErr('Nama tidak boleh kosong.');

    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      const pBersih = prestasi
        .map((p) => ({ judul: (p.judul || '').trim(), tahun: (p.tahun || '').trim() }))
        .filter((p) => p.judul);
      fd.append('prestasi', JSON.stringify(pBersih));
      if (foto) fd.append('foto_profil', foto);

      await authAPI.updateProfile(fd);
      updateUser({ nama: form.nama });
      setOk('Profil tersimpan.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setErr(e.response?.data?.message || 'Gagal menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="container-main py-8 flex-1">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Profil Saya</h1>
          <p className="text-sm text-gray-500 mb-6">Atur data diri dan rekam jejak prestasimu.</p>

          {err && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
              <TriangleAlert className="h-4 w-4 flex-shrink-0" /> {err}
            </div>
          )}
          {ok && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-5">
              <CircleCheck className="h-4 w-4 flex-shrink-0" /> {ok}
            </div>
          )}

          {loading ? (
            <div className="card p-16 text-center"><Loader2 className="h-7 w-7 animate-spin text-brand-400 mx-auto" /></div>
          ) : (
            <div className="space-y-5">
              <div className="card p-6 flex items-center gap-5">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-brand-100 overflow-hidden flex items-center justify-center">
                    {preview ? (
                      <img src={preview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-brand-600">{form.nama?.charAt(0).toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center cursor-pointer hover:bg-brand-700">
                    <Camera className="h-3.5 w-3.5 text-white" />
                    <input type="file" accept="image/*" className="hidden" onChange={onFoto} />
                  </label>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{form.nama || 'Belum ada nama'}</p>
                  <p className="text-sm text-gray-400">{form.jurusan || 'Jurusan belum diisi'}</p>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-brand-600" /> Data Diri
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
                    <input name="nama" value={form.nama} onChange={onField} className="input-base" />
                  </div>
                  {user.role === 'mahasiswa' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">NIM</label>
                        <input name="nim" value={form.nim} onChange={onField} className="input-base" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jurusan</label>
                        <input name="jurusan" value={form.jurusan} onChange={onField} className="input-base" />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <AtSign className="h-3.5 w-3.5 text-gray-400" /> Email
                    </label>
                    <input name="email" type="email" value={form.email} onChange={onField} className="input-base" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-gray-400" /> No. Telepon
                      </label>
                      <input name="phone" value={form.phone} onChange={onField} placeholder="08xxxxxxxxxx" className="input-base" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <MessageCircle className="h-3.5 w-3.5 text-gray-400" /> WhatsApp
                      </label>
                      <input name="whatsapp" value={form.whatsapp} onChange={onField} placeholder="08xxxxxxxxxx" className="input-base" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">No. WhatsApp & email cuma dibuka ke rekan tim yang lamarannya kamu terima.</p>
                </div>
              </div>

              {user.role === 'mahasiswa' && (
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Medal className="h-4 w-4 text-brand-600" /> Rekam Jejak Prestasi
                    </h2>
                    <button onClick={addPrestasi} className="inline-flex items-center gap-1 text-sm text-brand-600 font-medium hover:text-brand-700">
                      <Plus className="h-4 w-4" /> Tambah
                    </button>
                  </div>
                  {prestasi.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">Belum ada prestasi.</p>
                  ) : (
                    <div className="space-y-2">
                      {prestasi.map((p, i) => (
                        <div key={i} className="flex gap-2">
                          <input value={p.judul} onChange={(e) => setPrestasiVal(i, 'judul', e.target.value)}
                            placeholder="Judul prestasi" className="input-base flex-1" />
                          <input value={p.tahun} onChange={(e) => setPrestasiVal(i, 'tahun', e.target.value)}
                            placeholder="Tahun" className="input-base w-24" />
                          <button onClick={() => delPrestasi(i)}
                            className="px-3 rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button onClick={simpan} disabled={saving} className="btn-primary w-full py-3">
                {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</> : <><Save className="h-4 w-4" /> Simpan Perubahan</>}
              </button>

              {/* Wishlist (khusus mahasiswa) */}
              {user.role === 'mahasiswa' && (
                <div className="card p-6">
                  <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-brand-600" /> Wishlist Lomba
                    <span className="text-xs text-gray-400 font-normal">({wishlist.length})</span>
                  </h2>
                  {wishlist.length === 0 ? (
                    <div className="text-center py-6">
                      <Bookmark className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                      <p className="text-sm text-gray-400 mb-3">Belum ada lomba yang disimpan.</p>
                      <Link href="/lomba" className="text-sm text-brand-600 font-medium hover:text-brand-700">Cari lomba →</Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {wishlist.map((l) => (
                        <Link key={l.id} href={`/lomba/${l.id}`}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50/40 transition">
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 text-sm truncate">{l.judul}</p>
                            {l.deadline_pendaftaran && (
                              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <Calendar className="h-3 w-3" />
                                {new Date(l.deadline_pendaftaran).toLocaleDateString('id-ID')}
                              </p>
                            )}
                          </div>
                          <span className="badge-gray capitalize flex-shrink-0">{l.tingkat}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
