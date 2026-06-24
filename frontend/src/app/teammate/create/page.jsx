'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { lombaAPI, teammateAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { Plus, X, Loader2, TriangleAlert, CircleCheck, ArrowLeft, Award } from 'lucide-react';

function FormBuatLowongan() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const lombaId = params.get('lomba_id');

  const [lomba, setLomba] = useState(null);
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [maxAnggota, setMaxAnggota] = useState(3);
  const [kontak, setKontak] = useState('');
  const [linkTelegram, setLinkTelegram] = useState('');
  const [posisi, setPosisi] = useState(['']);

  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
    if (!authLoading && user && user.role !== 'mahasiswa') router.push('/');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!lombaId) return;
    lombaAPI.getById(lombaId)
      .then((r) => setLomba(r.data.data))
      .catch(() => setLomba(null));
  }, [lombaId]);

  const setPos = (i, v) => { const a = [...posisi]; a[i] = v; setPosisi(a); };
  const addPos = () => setPosisi([...posisi, '']);
  const delPos = (i) => { if (posisi.length > 1) setPosisi(posisi.filter((_, x) => x !== i)); };

  const simpan = async () => {
    setErr('');
    const posBersih = posisi.map((p) => p.trim()).filter(Boolean);
    if (!judul.trim())     return setErr('Judul lowongan wajib diisi.');
    if (!deskripsi.trim()) return setErr('Deskripsi wajib diisi.');
    if (!linkTelegram.trim()) return setErr('Link grup Telegram wajib diisi.');
    if (posBersih.length === 0) return setErr('Isi minimal satu posisi.');

    setSaving(true);
    try {
      await teammateAPI.createPost({
        lomba_id: Number(lombaId),
        judul,
        deskripsi: kontak ? `${deskripsi}\n\nKontak: ${kontak}` : deskripsi,
        jumlah_anggota_max: Number(maxAnggota),
        posisi_dibutuhkan: JSON.stringify(posBersih),
        link_telegram: linkTelegram,
      });
      setDone(true);
      setTimeout(() => router.push(`/teammate?lomba_id=${lombaId}`), 1300);
    } catch (e) {
      setErr(e.response?.data?.message || 'Gagal menyimpan lowongan.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-primary font-sans text-body-sm shadow-sm focus:border-secondary focus:ring-secondary focus:bg-white transition-all outline-none";

  if (authLoading || !user) return null;

  if (!lombaId) {
    return (
      <div className="min-h-screen bg-surface flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-outline-variant/60 p-10 text-center max-w-md shadow-sm">
            <Award className="h-11 w-11 text-on-surface-variant/20 mx-auto mb-3" />
            <h2 className="font-display font-semibold text-xl text-primary mb-1">Pilih lomba dulu</h2>
            <p className="text-sm text-on-surface-variant mb-5">Lowongan dibuat untuk satu lomba. Masuk ke detail lomba dulu.</p>
            <Link href="/lomba" className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-label-lg hover:opacity-90 transition-all shadow-md">Cari Lomba</Link>
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen bg-surface flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-outline-variant/60 p-10 text-center max-w-md shadow-sm">
            <CircleCheck className="h-11 w-11 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-display font-semibold text-xl text-primary mb-1">Lowongan dipublikasikan</h3>
            <p className="text-sm text-on-surface-variant">Mengarahkan kembali...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      <Navbar />
      <div className="container-main py-8 flex-grow max-w-3xl mx-auto px-4 w-full">
        <Link href={`/teammate?lomba_id=${lombaId}`} className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-secondary mb-5 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>

        <div className="w-full">
          <h1 className="font-display text-display-md text-primary mb-1">Buat Lowongan Tim</h1>
          <p className="font-sans text-body-md text-on-surface-variant mb-6">Buka lowongan untuk mengajak anggota tim di lomba ini.</p>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/60 shadow-sm">
            {err && (
              <div className="flex items-center gap-3 bg-error-container/30 border border-error/20 text-error text-sm px-5 py-4 rounded-xl mb-6">
                <TriangleAlert className="h-4 w-4 flex-shrink-0" /> {err}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Lomba</label>
                <div className="w-full rounded-xl border border-outline-variant/40 bg-surface px-4 py-3 text-on-surface-variant font-medium select-none">
                  {lomba ? lomba.judul : 'Memuat...'}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Nama Tim / Judul Lowongan</label>
                <input value={judul} onChange={(e) => setJudul(e.target.value)}
                  placeholder="Misal: Tim Falcon / Butuh 2 developer frontend" className={inputCls} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Deskripsi</label>
                <textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} rows={4}
                  placeholder="Jelaskan ide tim, target, dan kriteria anggota yang dicari..."
                  className={inputCls + " resize-none"} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Posisi yang Dibutuhkan</label>
                <div className="space-y-2">
                  {posisi.map((p, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={p} onChange={(e) => setPos(i, e.target.value)}
                        placeholder="Misal: Hipster / Hustler / Hacker" className={inputCls} />
                      <button type="button" onClick={() => delPos(i)}
                        className="px-3.5 rounded-xl border border-outline-variant/60 text-on-surface-variant hover:text-error hover:border-error/30 transition-all shrink-0">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addPos}
                  className="mt-2.5 inline-flex items-center gap-1 text-sm text-secondary font-semibold hover:opacity-85 transition-all bg-surface-container px-3 py-1.5 rounded-lg">
                  <Plus className="h-4 w-4" /> Tambah posisi
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Link Telegram Grup (Wajib)</label>
                <input value={linkTelegram} onChange={(e) => setLinkTelegram(e.target.value)}
                  placeholder="https://t.me/joinchat/... atau https://t.me/..." className={inputCls} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Maksimal Anggota</label>
                  <input type="number" min="1" max="10" value={maxAnggota}
                    onChange={(e) => setMaxAnggota(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Kontak (opsional)</label>
                  <input value={kontak} onChange={(e) => setKontak(e.target.value)}
                    placeholder="WA / Line / email" className={inputCls} />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button onClick={simpan} disabled={saving} className="bg-primary text-on-primary px-6 py-3.5 rounded-xl font-label-lg hover:opacity-90 active:scale-95 shadow-md transition-all flex-grow flex items-center justify-center gap-2">
                  {saving ? <><Loader2 className="h-5 w-5 animate-spin" /> Menyimpan...</> : 'Publikasikan Lowongan'}
                </button>
                <button onClick={() => router.back()} className="border border-outline-variant text-primary font-label-lg py-3 px-6 rounded-xl hover:bg-surface transition-all">Batal</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuatLowonganPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <FormBuatLowongan />
    </Suspense>
  );
}
