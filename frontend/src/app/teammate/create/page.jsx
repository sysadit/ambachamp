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
    if (posBersih.length === 0) return setErr('Isi minimal satu posisi.');

    setSaving(true);
    try {
      await teammateAPI.createPost({
        lomba_id: Number(lombaId),
        judul,
        deskripsi: kontak ? `${deskripsi}\n\nKontak: ${kontak}` : deskripsi,
        jumlah_anggota_max: Number(maxAnggota),
        posisi_dibutuhkan: JSON.stringify(posBersih),
      });
      setDone(true);
      setTimeout(() => router.push(`/teammate?lomba_id=${lombaId}`), 1300);
    } catch (e) {
      setErr(e.response?.data?.message || 'Gagal menyimpan lowongan.');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) return null;

  if (!lombaId) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="card p-10 text-center max-w-md">
            <Award className="h-11 w-11 text-gray-300 mx-auto mb-3" />
            <h2 className="font-bold text-gray-900 mb-1">Pilih lomba dulu</h2>
            <p className="text-sm text-gray-500 mb-5">Lowongan dibuat untuk satu lomba. Masuk ke detail lomba dulu.</p>
            <Link href="/lomba" className="btn-primary">Cari Lomba</Link>
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="card p-10 text-center max-w-md">
            <CircleCheck className="h-11 w-11 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">Lowongan dipublikasikan</h3>
            <p className="text-sm text-gray-500">Mengarahkan kembali...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="container-main py-8 flex-1">
        <Link href={`/teammate?lomba_id=${lombaId}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 mb-5">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>

        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Buat Lowongan Tim</h1>
          <p className="text-sm text-gray-500 mb-6">Buka lowongan untuk mengajak anggota tim di lomba ini.</p>

          <div className="card p-6">
            {err && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
                <TriangleAlert className="h-4 w-4 flex-shrink-0" /> {err}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lomba</label>
                <div className="input-base bg-gray-50 text-gray-700">
                  {lomba ? lomba.judul : 'Memuat...'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Judul Lowongan</label>
                <input value={judul} onChange={(e) => setJudul(e.target.value)}
                  placeholder="Misal: Butuh 2 orang buat tim hackathon" className="input-base" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
                <textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} rows={4}
                  placeholder="Jelaskan ide tim, target, dan kriteria anggota yang dicari..."
                  className="input-base resize-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Posisi yang Dibutuhkan</label>
                <div className="space-y-2">
                  {posisi.map((p, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={p} onChange={(e) => setPos(i, e.target.value)}
                        placeholder="Misal: Hipster / Hustler / Hacker" className="input-base" />
                      <button type="button" onClick={() => delPos(i)}
                        className="px-3 rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addPos}
                  className="mt-2 inline-flex items-center gap-1 text-sm text-brand-600 font-medium hover:text-brand-700">
                  <Plus className="h-4 w-4" /> Tambah posisi
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Maksimal Anggota</label>
                  <input type="number" min="1" max="10" value={maxAnggota}
                    onChange={(e) => setMaxAnggota(e.target.value)} className="input-base" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kontak (opsional)</label>
                  <input value={kontak} onChange={(e) => setKontak(e.target.value)}
                    placeholder="WA / Line / email" className="input-base" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={simpan} disabled={saving} className="btn-primary flex-1 py-3">
                  {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</> : 'Publikasikan Lowongan'}
                </button>
                <button onClick={() => router.back()} className="btn-secondary px-6">Batal</button>
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
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <FormBuatLowongan />
    </Suspense>
  );
}
