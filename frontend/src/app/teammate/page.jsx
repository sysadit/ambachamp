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
    <div className="bg-white p-6 rounded-3xl border border-outline-variant/60 shadow-sm hover:border-secondary/40 hover:shadow-md transition-all duration-300">
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
        <div className="flex-1 space-y-3 w-full">
          <div className="flex items-center gap-2 flex-wrap">
            {posisiList.map((p, i) => (
              <span key={i} className="bg-surface-container text-secondary-container px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-2xs">
                {p}
              </span>
            ))}
          </div>
          <div>
            <h3 className="font-display font-semibold text-xl text-primary">{post.judul}</h3>
            <p className="text-xs text-on-surface-variant mt-0.5 font-medium">untuk {post.judul_lomba}</p>
            <p className="font-sans text-body-sm text-on-surface-variant mt-2 leading-relaxed">{post.deskripsi}</p>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-on-surface-variant font-medium pt-1">
            <div className="h-7 w-7 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant/30">
              <Users className="h-3.5 w-3.5 text-secondary" />
            </div>
            Diposting oleh <span className="text-primary font-semibold">{post.nama_pembuat}</span>
          </div>
        </div>

        {!isOwner && (
          applied ? (
            <span className="shrink-0 inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-600 px-6 py-3 rounded-xl font-bold text-sm">
              <CircleCheck className="h-4 w-4" /> Terkirim
            </span>
          ) : (
            <button onClick={() => setExpand(!expand)}
              className="w-full sm:w-auto shrink-0 bg-surface-container hover:bg-secondary hover:text-on-primary text-secondary px-8 py-3.5 rounded-xl font-label-lg transition-all duration-200 shadow-2xs">
              Minta untuk Bergabung
            </button>
          )
        )}
      </div>

      {expand && !isOwner && (
        <div className="mt-5 pt-5 border-t border-outline-variant/20 space-y-4">
          {err && (
            <div className="flex items-center gap-2 bg-error-container/30 border border-error/20 text-error text-sm px-4 py-2.5 rounded-xl">
              <TriangleAlert className="h-4 w-4 flex-shrink-0" /> {err}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Posisi yang dilamar</label>
            <select value={posisi} onChange={(e) => setPosisi(e.target.value)}
              className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-primary font-sans text-body-sm shadow-sm focus:border-secondary focus:ring-secondary focus:bg-white transition-all outline-none">
              <option value="">Pilih posisi</option>
              {posisiList.map((p, i) => <option key={i} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Pesan (opsional)</label>
            <textarea value={pesan} onChange={(e) => setPesan(e.target.value)} rows={2}
              placeholder="Kenalkan dirimu dan kenapa cocok untuk posisi ini..."
              className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-primary font-sans text-body-sm shadow-sm focus:border-secondary focus:ring-secondary focus:bg-white transition-all outline-none resize-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={lamar} disabled={busy}
              className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-lg hover:opacity-90 transition flex-1 inline-flex items-center justify-center gap-2">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> Kirim Lamaran</>}
            </button>
            <button onClick={() => setExpand(false)} className="px-6 py-3 rounded-xl border border-outline-variant text-primary font-label-lg hover:bg-surface transition-all">
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
      <div className="bg-white p-8 rounded-3xl border border-outline-variant/60 shadow-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center mx-auto mb-4">
          <Plus className="h-7 w-7 text-secondary" />
        </div>
        <h3 className="font-display font-semibold text-lg text-primary mb-1">Buka Lowongan Tim Baru</h3>
        <p className="font-sans text-body-sm text-on-surface-variant mb-5 max-w-sm mx-auto">
          Cari anggota untuk timmu di lomba ini. Isi posisi yang dibutuhkan dan tunggu pelamar masuk.
        </p>
        <Link href={`/teammate/create?lomba_id=${lombaId}`}
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3.5 rounded-xl font-label-lg hover:opacity-90 active:scale-95 transition-all shadow-md">
          <Plus className="h-5 w-5" /> Buat Lowongan Tim
        </Link>
      </div>

      {myPosts.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-primary text-body-lg mb-4">Kelola Pelamar</h3>
          <div className="space-y-4">
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
    <div className="bg-white rounded-3xl border border-outline-variant/60 p-6">
      <button onClick={toggle} className="w-full flex items-center justify-between">
        <span className="font-display font-semibold text-primary text-body-sm text-left">{post.judul}</span>
        <span className="text-xs text-secondary font-semibold">{open ? 'Tutup' : 'Lihat Pelamar'}</span>
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          {loading ? (
            <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-secondary" /></div>
          ) : apps.length === 0 ? (
            <p className="text-sm text-on-surface-variant text-center py-3">Belum ada pelamar.</p>
          ) : (
            apps.map(ap => (
              <div key={ap.id} className="p-4 rounded-2xl bg-surface border border-outline-variant/40">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-primary">{ap.nama_pelamar}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5 font-medium">{ap.posisi}{ap.jurusan ? ` · ${ap.jurusan}` : ''}</p>
                    {ap.pesan && <p className="text-xs text-on-surface-variant/80 mt-2 bg-white px-3 py-2 rounded-lg border border-outline-variant/20 italic">"{ap.pesan}"</p>}
                  </div>
                  {ap.status === 'pending' ? (
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button onClick={() => decide(ap.id, 'diterima')} disabled={busyId === ap.id}
                        className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-colors">
                        <CircleCheck className="h-4 w-4" />
                      </button>
                      <button onClick={() => decide(ap.id, 'ditolak')} disabled={busyId === ap.id}
                        className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 hover:bg-red-100 transition-colors">
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
                    className="mt-3 w-full text-xs rounded-xl border border-outline-variant/60 bg-white py-2.5 px-3 outline-none focus:border-secondary focus:ring-secondary transition-all"
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
      <div className="bg-white rounded-3xl border border-outline-variant/60 p-12 text-center">
        <Inbox className="h-12 w-12 text-on-surface-variant/20 mx-auto mb-3" />
        <p className="font-semibold text-primary mb-1">Belum ada lamaran</p>
        <p className="text-sm text-on-surface-variant">Lamaran yang kamu kirim akan muncul di sini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {apps.map(a => {
        const c = cfg[a.status] || cfg.pending;
        const Icon = c.Icon;
        return (
          <div key={a.id} className="bg-white rounded-3xl border border-outline-variant/60 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="font-display font-semibold text-primary text-body-lg">{a.judul_lomba}</h3>
                <p className="text-xs text-on-surface-variant mt-1 font-medium">
                  Posisi: <span className="font-semibold text-primary">{a.posisi}</span> · Tim {a.nama_pembuat}
                </p>
              </div>
              <span className={`${c.cls} flex items-center gap-1 text-2xs`}><Icon className="h-3 w-3" /> {c.label}</span>
            </div>

            {a.status === 'diterima' && a.link_telegram && (
              <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100/50">
                <p className="text-xs font-semibold text-emerald-800 mb-3 flex items-center gap-1">
                  Selamat, kamu diterima! Silakan gabung ke grup tim:
                </p>
                <a href={a.link_telegram} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-700 shadow-sm transition-all duration-200">
                  <MessageCircle className="h-4 w-4" /> Join Grup Telegram
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
      <div className="min-h-screen bg-surface flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-outline-variant/60 p-10 text-center max-w-md shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center mx-auto mb-4">
              <Users className="h-7 w-7 text-secondary" />
            </div>
            <h2 className="font-display font-semibold text-xl text-primary mb-2">Pilih Lomba Dulu</h2>
            <p className="font-sans text-body-sm text-on-surface-variant mb-6 leading-relaxed">
              Pusat Kolaborasi dipakai per lomba. Masuk ke detail lomba yang ingin kamu ikuti, lalu cari atau buka lowongan tim dari sana.
            </p>
            <Link href="/explore" className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3.5 rounded-xl font-label-lg hover:opacity-90 transition-all shadow-md">
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
    <div className="min-h-screen bg-surface text-primary flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow w-full py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Banner */}
          <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 sm:p-10 text-white shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary-container rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <Link href={`/lomba/${lombaId}`} className="inline-flex items-center gap-1.5 text-sm text-surface-variant hover:text-white mb-3 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Kembali ke detail lomba
              </Link>
              <h1 className="font-display text-display-md text-white mb-2 leading-tight">Pusat Kolaborasi</h1>
              {lombaInfo && <p className="font-sans text-body-lg text-surface-variant">Untuk lomba: <span className="font-semibold text-white">{lombaInfo.judul}</span></p>}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-outline-variant/30 overflow-x-auto">
            {[
              { v: 'buat', l: 'Buat Lowongan' },
              { v: 'cari-tim', l: 'Cari Tim' },
              { v: 'status', l: 'Status Gabung' },
            ].map(t => (
              <button key={t.v} onClick={() => setTab(t.v)}
                className={`px-6 py-4 font-label-lg whitespace-nowrap transition-all border-b-2 ${
                  tab === t.v ? 'border-secondary text-secondary font-bold' : 'border-transparent text-on-surface-variant hover:text-primary'
                }`}>
                {t.l}
                {t.v === 'status' && myApps.length > 0 && (
                  <span className="ml-1.5 text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold">{myApps.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* Konten tab */}
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-secondary" /></div>
          ) : tab === 'buat' ? (
            <TabBuatLowongan lombaId={lombaId} myPosts={myPosts} onReload={() => { loadPosts(); loadMyApps(); }} />
          ) : tab === 'cari-tim' ? (
            posts.filter(p => p.pembuat_id !== user?.id).length === 0 ? (
              <div className="bg-white rounded-3xl border border-outline-variant/60 p-12 text-center shadow-sm">
                <Users className="h-12 w-12 text-on-surface-variant/20 mx-auto mb-3" />
                <p className="font-semibold text-primary">Belum ada lowongan tim di lomba ini</p>
                <p className="text-sm text-on-surface-variant mt-1">Jadi yang pertama buka lowongan lewat tab "Buat Lowongan".</p>
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
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <TeammateContent />
    </Suspense>
  );
}
