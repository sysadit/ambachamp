'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { teammateAPI, lombaAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  Plus, Loader2, Users, Search, ArrowLeft, Send, Inbox,
  Hourglass, CircleCheck, CircleX, TriangleAlert, MessageCircle
} from 'lucide-react';

// ─── Kartu lowongan + lamar ──────────────────────────────────────────────────
function PostCard({ post, onApplied, currentUserId }) {
  const [expand, setExpand] = useState(false);
  const [posisi, setPosisi] = useState('');
  const [pesan, setPesan] = useState('');
  const [busy, setBusy] = useState(false);
  const [applied, setApplied] = useState(false);
  const [err, setErr] = useState('');

  let posisiList = [];
  try { posisiList = JSON.parse(post.posisi_dibutuhkan || '[]'); } catch { posisiList = []; }

  const isOwner = currentUserId === post.pembuat_id;

  const lamar = async () => {
    setErr('');
    if (!posisi) return setErr('Pilih posisi dulu.');
    setBusy(true);
    try {
      await teammateAPI.applyToPost(post.id, { posisi, pesan });
      setApplied(true);
      setExpand(false);
      onApplied?.();
    } catch (e) {
      setErr(e.response?.data?.message || 'Gagal mengirim lamaran.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
        <div className="flex-1 space-y-3 w-full">
          <div className="flex items-center gap-2 flex-wrap">
            {posisiList.map((p, i) => (
              <span key={i} className="bg-purple-100 text-purple-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                {p}
              </span>
            ))}
          </div>
          <div>
            <h3 className="font-bold text-xl text-slate-900">{post.judul}</h3>
            <p className="text-xs text-slate-400 mt-0.5">untuk {post.judul_lomba}</p>
            <p className="text-slate-600 mt-2 leading-relaxed">{post.deskripsi}</p>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-500 font-medium pt-1">
            <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
              <Users className="h-3.5 w-3.5 text-slate-400" />
            </div>
            Diposting oleh <span className="text-slate-700 font-semibold">{post.nama_pembuat}</span>
          </div>
        </div>

        {!isOwner && (
          applied ? (
            <span className="shrink-0 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-6 py-3 rounded-xl font-bold text-sm">
              <CircleCheck className="h-4 w-4" /> Terkirim
            </span>
          ) : (
            <button onClick={() => setExpand(!expand)}
              className="w-full sm:w-auto shrink-0 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white px-8 py-3.5 rounded-xl font-bold transition-colors">
              Minta untuk Bergabung
            </button>
          )
        )}
      </div>

      {expand && !isOwner && (
        <div className="mt-5 pt-5 border-t border-slate-100 space-y-3">
          {err && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-xl">
              <TriangleAlert className="h-4 w-4 flex-shrink-0" /> {err}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Posisi yang dilamar</label>
            <select value={posisi} onChange={(e) => setPosisi(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3 text-slate-700 outline-none focus:border-indigo-500">
              <option value="">Pilih posisi</option>
              {posisiList.map((p, i) => <option key={i} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pesan (opsional)</label>
            <textarea value={pesan} onChange={(e) => setPesan(e.target.value)} rows={2}
              placeholder="Kenalkan dirimu dan kenapa cocok untuk posisi ini..."
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3 text-slate-700 outline-none focus:border-indigo-500 resize-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={lamar} disabled={busy}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition flex-1 inline-flex items-center justify-center gap-2">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> Kirim Lamaran</>}
            </button>
            <button onClick={() => setExpand(false)} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50">
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab Buat Lowongan: tombol + kelola pelamar ──────────────────────────────
function TabBuatLowongan({ lombaId, myPosts, onReload }) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
          <Plus className="h-7 w-7 text-indigo-600" />
        </div>
        <h3 className="font-bold text-lg text-slate-900 mb-1">Buka Lowongan Tim Baru</h3>
        <p className="text-sm text-slate-500 mb-5 max-w-sm mx-auto">
          Cari anggota untuk timmu di lomba ini. Isi posisi yang dibutuhkan dan tunggu pelamar masuk.
        </p>
        <Link href={`/teammate/create?lomba_id=${lombaId}`}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
          <Plus className="h-5 w-5" /> Buat Lowongan Tim
        </Link>
      </div>

      {myPosts.length > 0 && (
        <div>
          <h3 className="font-bold text-slate-800 mb-3">Kelola Pelamar</h3>
          <div className="space-y-3">
            {myPosts.map(p => <KelolaPelamar key={p.id} post={p} onReload={onReload} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function KelolaPelamar({ post, onReload }) {
  const [open, setOpen] = useState(false);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [telegramInput, setTelegramInput] = useState({}); // appId -> link

  const load = () => {
    setLoading(true);
    teammateAPI.getPostById(post.id)
      .then(r => setApps(r.data.data?.applications || []))
      .catch(() => setApps([]))
      .finally(() => setLoading(false));
  };

  const toggle = () => { const n = !open; setOpen(n); if (n) load(); };

  const decide = async (appId, status) => {
    setBusyId(appId);
    try {
      const body = { status };
      if (status === 'diterima') {
        const link = (telegramInput[appId] || '').trim();
        if (!link) { setBusyId(null); alert('Isi link grup Telegram dulu sebelum menerima.'); return; }
        body.link_telegram = link;
      }
      await teammateAPI.updateApplication(appId, body);
      load();
      onReload?.();
    } catch (e) {
      alert(e.response?.data?.message || 'Gagal memproses lamaran.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <button onClick={toggle} className="w-full flex items-center justify-between">
        <span className="font-semibold text-slate-800 text-sm text-left">{post.judul}</span>
        <span className="text-xs text-indigo-600 font-medium">{open ? 'Tutup' : 'Lihat Pelamar'}</span>
      </button>

      {open && (
        <div className="mt-4 space-y-2">
          {loading ? (
            <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-indigo-400" /></div>
          ) : apps.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-3">Belum ada pelamar.</p>
          ) : (
            apps.map(ap => (
              <div key={ap.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800">{ap.nama_pelamar}</p>
                    <p className="text-xs text-slate-500">{ap.posisi}{ap.jurusan ? ` · ${ap.jurusan}` : ''}</p>
                    {ap.pesan && <p className="text-xs text-slate-400 mt-1 italic">"{ap.pesan}"</p>}
                  </div>
                  {ap.status === 'pending' ? (
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => decide(ap.id, 'diterima')} disabled={busyId === ap.id}
                        className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 hover:bg-emerald-100">
                        <CircleCheck className="h-4 w-4" />
                      </button>
                      <button onClick={() => decide(ap.id, 'ditolak')} disabled={busyId === ap.id}
                        className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600 hover:bg-red-100">
                        <CircleX className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <span className={ap.status === 'diterima' ? 'badge-green flex-shrink-0' : 'badge-red flex-shrink-0'}>
                      {ap.status === 'diterima' ? 'Diterima' : 'Ditolak'}
                    </span>
                  )}
                </div>
                {/* input link telegram, muncul saat masih pending */}
                {ap.status === 'pending' && (
                  <input
                    value={telegramInput[ap.id] || ''}
                    onChange={(e) => setTelegramInput({ ...telegramInput, [ap.id]: e.target.value })}
                    placeholder="Link grup Telegram (wajib diisi sebelum terima)"
                    className="mt-2 w-full text-xs rounded-lg border border-slate-200 bg-white py-2 px-3 outline-none focus:border-indigo-400"
                  />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Tab Status Gabung: lamaran milik user + link telegram kalau diterima ────
function TabStatusGabung({ apps }) {
  const cfg = {
    pending:  { label: 'Menunggu', cls: 'badge-amber', Icon: Hourglass },
    diterima: { label: 'Diterima', cls: 'badge-green', Icon: CircleCheck },
    ditolak:  { label: 'Ditolak',  cls: 'badge-red',   Icon: CircleX },
  };

  if (apps.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
        <Inbox className="h-12 w-12 text-slate-200 mx-auto mb-3" />
        <p className="font-semibold text-slate-500 mb-1">Belum ada lamaran</p>
        <p className="text-sm text-slate-400">Lamaran yang kamu kirim akan muncul di sini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {apps.map(a => {
        const c = cfg[a.status] || cfg.pending;
        const Icon = c.Icon;
        return (
          <div key={a.id} className="bg-white rounded-3xl border border-slate-200 p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">{a.judul_lomba}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Posisi: <span className="font-medium text-slate-700">{a.posisi}</span> · Tim {a.nama_pembuat}
                </p>
              </div>
              <span className={c.cls}><Icon className="h-3 w-3" /> {c.label}</span>
            </div>

            {a.status === 'diterima' && a.link_telegram && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <p className="text-xs font-semibold text-emerald-700 mb-2">
                  Selamat, kamu diterima! Gabung ke grup tim:
                </p>
                <a href={a.link_telegram} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-white border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-100">
                  <MessageCircle className="h-3.5 w-3.5" /> Join Grup Telegram
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Halaman utama ───────────────────────────────────────────────────────────
function TeammateContent() {
  const params = useSearchParams();
  const lombaId = params.get('lomba_id');
  const { user } = useAuth();

  const [tab, setTab] = useState('cari-tim');
  const [posts, setPosts] = useState([]);
  const [myApps, setMyApps] = useState([]);
  const [lombaInfo, setLombaInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPosts = () => {
    if (!lombaId) return;
    teammateAPI.getAllPosts({ lomba_id: lombaId })
      .then(r => setPosts(r.data.data || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  };

  const loadMyApps = () => {
    if (user?.role !== 'mahasiswa') return;
    teammateAPI.getMyApplications()
      .then(r => setMyApps(r.data.data || []))
      .catch(() => setMyApps([]));
  };

  useEffect(() => {
    if (!lombaId) { setLoading(false); return; }
    loadPosts();
    lombaAPI.getById(lombaId).then(r => setLombaInfo(r.data.data)).catch(() => {});
  }, [lombaId]);

  useEffect(() => { loadMyApps(); }, [user]);

  // tanpa pilih lomba dulu
  if (!lombaId) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center max-w-md shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
              <Users className="h-7 w-7 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Pilih Lomba Dulu</h2>
            <p className="text-sm text-slate-500 mb-6">
              Pusat Kolaborasi dipakai per lomba. Masuk ke detail lomba yang ingin kamu ikuti, lalu cari atau buka lowongan tim dari sana.
            </p>
            <Link href="/explore" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
              <Search className="h-4 w-4" /> Cari Lomba Sekarang
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const myPosts = posts.filter(p => p.pembuat_id === user?.id);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-grow w-full py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 sm:p-10 text-white shadow-lg">
            <Link href={`/lomba/${lombaId}`} className="inline-flex items-center gap-1.5 text-sm text-indigo-100 hover:text-white mb-3">
              <ArrowLeft className="h-4 w-4" /> Kembali ke detail lomba
            </Link>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Pusat Kolaborasi</h1>
            {lombaInfo && <p className="text-indigo-100 text-lg">Untuk lomba: <span className="font-bold text-white">{lombaInfo.judul}</span></p>}
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-slate-200 overflow-x-auto">
            {[
              { v: 'buat', l: 'Buat Lowongan' },
              { v: 'cari-tim', l: 'Cari Tim' },
              { v: 'status', l: 'Status Gabung' },
            ].map(t => (
              <button key={t.v} onClick={() => setTab(t.v)}
                className={`px-6 py-4 font-bold whitespace-nowrap transition-colors border-b-2 ${
                  tab === t.v ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}>
                {t.l}
                {t.v === 'status' && myApps.length > 0 && (
                  <span className="ml-1.5 text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">{myApps.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* Konten tab */}
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-indigo-400" /></div>
          ) : tab === 'buat' ? (
            <TabBuatLowongan lombaId={lombaId} myPosts={myPosts} onReload={() => { loadPosts(); loadMyApps(); }} />
          ) : tab === 'cari-tim' ? (
            posts.filter(p => p.pembuat_id !== user?.id).length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                <Users className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                <p className="font-semibold text-slate-500">Belum ada lowongan tim di lomba ini</p>
                <p className="text-sm text-slate-400 mt-1">Jadi yang pertama buka lowongan lewat tab "Buat Lowongan".</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.filter(p => p.pembuat_id !== user?.id).map(p => (
                  <PostCard key={p.id} post={p} currentUserId={user?.id} onApplied={loadMyApps} />
                ))}
              </div>
            )
          ) : (
            <TabStatusGabung apps={myApps} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function TeammatesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <TeammateContent />
    </Suspense>
  );
}
