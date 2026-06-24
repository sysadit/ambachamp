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
        const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:5000/uploads';
        if (d.foto_profil) setPreview(`${uploadUrl}/posters/${d.foto_profil}`);
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
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 flex-grow">
        <div className="mb-8">
          <h1 className="font-display text-display-md text-primary mb-1">Profil Saya</h1>
          <p className="font-sans text-body-lg text-on-surface-variant">Atur data diri dan rekam jejak prestasimu.</p>
        </div>

        {err && (
          <div className="flex items-center gap-3 bg-error-container/30 border border-error/20 text-error text-body-sm px-5 py-4 rounded-2xl mb-6">
            <TriangleAlert className="h-5 w-5 flex-shrink-0" /> {err}
          </div>
        )}
        {ok && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-body-sm px-5 py-4 rounded-2xl mb-6">
            <CircleCheck className="h-5 w-5 flex-shrink-0" /> {ok}
          </div>
        )}

        {loading ? (
          <div className="bg-white p-24 rounded-3xl border border-outline-variant/60 shadow-sm flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-secondary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Summary & Wishlist */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Profile Card */}
              <div className="bg-white p-6 rounded-3xl border border-outline-variant/60 shadow-sm flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-28 h-28 rounded-full border-4 border-surface-container bg-surface-container overflow-hidden flex items-center justify-center shadow-inner">
                    {preview ? (
                      <img src={preview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-display font-bold text-secondary">{form.nama?.charAt(0).toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary hover:opacity-90 flex items-center justify-center cursor-pointer transition-all shadow-md">
                    <Camera className="h-4 w-4 text-white" />
                    <input type="file" accept="image/*" className="hidden" onChange={onFoto} />
                  </label>
                </div>
                
                <h2 className="font-display text-headline-sm text-primary mb-1">{form.nama || 'Belum ada nama'}</h2>
                <p className="font-sans text-body-sm text-on-surface-variant mb-4">{form.jurusan || 'Jurusan belum diisi'}</p>
                <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-surface-container text-secondary-container capitalize">
                  {user.role}
                </span>
              </div>

              {/* Wishlist Lomba */}
              {user.role === 'mahasiswa' && (
                <div className="bg-white p-6 rounded-3xl border border-outline-variant/60 shadow-sm">
                  <h2 className="font-display font-semibold text-body-lg text-primary mb-4 flex items-center gap-2">
                    <Bookmark className="h-5 w-5 text-secondary" /> 
                    <span>Wishlist Lomba</span>
                    <span className="font-sans text-xs text-on-surface-variant font-normal">({wishlist.length})</span>
                  </h2>
                  {wishlist.length === 0 ? (
                    <div className="text-center py-8">
                      <Bookmark className="h-10 w-10 text-on-surface-variant/20 mx-auto mb-2" />
                      <p className="font-sans text-body-sm text-on-surface-variant mb-4">Belum ada lomba yang disimpan.</p>
                      <Link href="/lomba" className="font-label-lg text-secondary hover:underline">Cari lomba →</Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {wishlist.map((l) => (
                        <Link key={l.id} href={`/lomba/${l.id}`}
                          className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-outline-variant/30 hover:border-secondary/40 hover:bg-surface transition-all">
                          <div className="min-w-0">
                            <p className="font-display font-semibold text-primary text-body-sm truncate">{l.judul}</p>
                            {l.deadline_pendaftaran && (
                              <p className="font-sans text-xs text-on-surface-variant flex items-center gap-1 mt-1">
                                <Calendar className="h-3.5 w-3.5 shrink-0" />
                                <span>{new Date(l.deadline_pendaftaran).toLocaleDateString('id-ID')}</span>
                              </p>
                            )}
                          </div>
                          <span className="px-2.5 py-1 rounded bg-surface-container text-primary font-semibold text-[10px] uppercase tracking-wider flex-shrink-0">{l.tingkat}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Profile Edit Forms & Achievements */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Form Data Diri */}
              <div className="bg-white p-6 rounded-3xl border border-outline-variant/60 shadow-sm">
                <h2 className="font-display font-semibold text-headline-sm text-primary mb-6 flex items-center gap-2">
                  <UserCircle className="h-5 w-5 text-secondary" /> Data Diri
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Nama Lengkap</label>
                    <input name="nama" value={form.nama} onChange={onField} className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-primary font-sans text-body-sm shadow-sm focus:border-secondary focus:ring-secondary focus:bg-white transition-colors outline-none" />
                  </div>
                  {user.role === 'mahasiswa' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">NIM</label>
                        <input name="nim" value={form.nim} onChange={onField} className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-primary font-sans text-body-sm shadow-sm focus:border-secondary focus:ring-secondary focus:bg-white transition-colors outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Jurusan</label>
                        <input name="jurusan" value={form.jurusan} onChange={onField} className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-primary font-sans text-body-sm shadow-sm focus:border-secondary focus:ring-secondary focus:bg-white transition-colors outline-none" />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <AtSign className="h-3.5 w-3.5 text-on-surface-variant/70" /> Email Address
                    </label>
                    <input name="email" type="email" value={form.email} onChange={onField} className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-primary font-sans text-body-sm shadow-sm focus:border-secondary focus:ring-secondary focus:bg-white transition-colors outline-none" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-on-surface-variant/70" /> No. Telepon
                      </label>
                      <input name="phone" value={form.phone} onChange={onField} placeholder="08xxxxxxxxxx" className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-primary font-sans text-body-sm shadow-sm focus:border-secondary focus:ring-secondary focus:bg-white transition-colors outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <MessageCircle className="h-3.5 w-3.5 text-on-surface-variant/70" /> WhatsApp Number
                      </label>
                      <input name="whatsapp" value={form.whatsapp} onChange={onField} placeholder="08xxxxxxxxxx" className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-primary font-sans text-body-sm shadow-sm focus:border-secondary focus:ring-secondary focus:bg-white transition-colors outline-none" />
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1 leading-normal">
                    * No. WhatsApp & email hanya akan diperlihatkan kepada rekan tim yang lamarannya Anda setujui.
                  </p>
                </div>
              </div>

              {/* Form Rekam Jejak Prestasi */}
              {user.role === 'mahasiswa' && (
                <div className="bg-white p-6 rounded-3xl border border-outline-variant/60 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display font-semibold text-headline-sm text-primary flex items-center gap-2">
                      <Medal className="h-5 w-5 text-secondary" /> Rekam Jejak Prestasi
                    </h2>
                    <button onClick={addPrestasi} className="inline-flex items-center gap-1.5 text-sm text-secondary font-semibold hover:opacity-80 transition-all bg-surface-container px-3 py-1.5 rounded-lg">
                      <Plus className="h-4 w-4" /> Tambah
                    </button>
                  </div>
                  {prestasi.length === 0 ? (
                    <div className="text-center py-8 bg-surface rounded-2xl border border-dashed border-outline-variant/60">
                      <Medal className="h-10 w-10 text-on-surface-variant/20 mx-auto mb-2" />
                      <p className="font-sans text-body-sm text-on-surface-variant">Belum ada prestasi yang ditambahkan.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
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

              {/* Save Button */}
              <button onClick={simpan} disabled={saving} className="w-full py-4 rounded-2xl bg-primary text-on-primary font-label-lg hover:opacity-90 active:scale-95 shadow-md transition-all flex items-center justify-center gap-2">
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
