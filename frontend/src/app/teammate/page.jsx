'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { teammateAPI, lombaAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  Plus, Loader2, UsersRound, Clock, TriangleAlert, CircleCheck,
  Search, ArrowLeft, Mail, MessageCircle, CircleX, Hourglass, Send, Inbox
} from 'lucide-react';

const POSISI_COLOR = [
  'bg-violet-100 text-violet-700',
  'bg-sky-100 text-sky-700',
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-700',
];

function timeAgo(date) {
  const h = Math.floor((Date.now() - new Date(date)) / 3600000);
  if (h < 1) return 'Baru saja';
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

// ── kartu lowongan di tab "Cari Tim" (sisi pelamar) ──
function LowonganCard({ post, onApplied }) {
  const { user } = useAuth();
  const [expand, setExpand] = useState(false);
  const [posisi, setPosisi] = useState('');
  const [pesan, setPesan] = useState('');
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');

  let posisiArr = [];
  try { posisiArr = JSON.parse(post.posisi_dibutuhkan); } catch {}

  const mainPosisi = posisiArr[0]
    ? (typeof posisiArr[0] === 'object' ? posisiArr[0].posisi : posisiArr[0])
    : 'Anggota Tim';

  const handleApply = async () => {
    if (!posisi) { setError('Pilih posisi dulu.'); return; }
    setLoading(true); setError('');
    try {
      await teammateAPI.apply(post.id, { posisi, pesan });
      setApplied(true); setExpand(false);
      onApplied?.();
    } catch (err) {
      setError(err?.response?.data?.message || 'Gagal mengirim permintaan.');
    }
    setLoading(false);
  };

  const isOwn = post.pembuat_id === user?.id;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${POSISI_COLOR[(post.id || 0) % POSISI_COLOR.length]}`}>
          {mainPosisi}
        </span>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <Clock className="h-3 w-3" /> {timeAgo(post.created_at)}
        </span>
      </div>

      <h3 className="font-bold text-gray-900 text-sm mb-1">{post.judul}</h3>
      <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">{post.deskripsi}</p>

      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold flex-shrink-0">
          {post.nama_pembuat?.charAt(0) || 'U'}
        </div>
        <span className="text-xs text-gray-400">oleh <span className="font-medium text-gray-600">{post.nama_pembuat}</span></span>
      </div>

      {isOwn ? (
        <p className="text-xs text-gray-400 italic">Ini lowongan buatanmu.</p>
      ) : applied ? (
        <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
          <CircleCheck className="h-4 w-4" /> Permintaan terkirim!
        </div>
      ) : user?.role === 'mahasiswa' && post.status === 'open' ? (
        !expand ? (
          <button onClick={() => setExpand(true)} className="btn-outline text-sm py-2 w-full">
            Minta untuk Bergabung
          </button>
        ) : (
          <div className="space-y-3 pt-2 border-t border-gray-100">
            {error && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <TriangleAlert className="h-3.5 w-3.5" /> {error}
              </p>
            )}
            <select value={posisi} onChange={(e) => setPosisi(e.target.value)} className="input-base text-sm py-2">
              <option value="">Pilih posisi yang diminati</option>
              {posisiArr.map((p, i) => {
                const label = typeof p === 'object' ? p.posisi : p;
                return <option key={i} value={label}>{label}</option>;
              })}
            </select>
            <textarea value={pesan} onChange={(e) => setPesan(e.target.value)}
              placeholder="Perkenalkan diri dan alasan kamu cocok..." rows={2}
              className="input-base text-sm resize-none" />
            <div className="flex gap-2">
              <button onClick={handleApply} disabled={loading} className="btn-primary text-xs py-2 flex-1">
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Kirim Permintaan'}
              </button>
              <button onClick={() => setExpand(false)} className="btn-secondary text-xs py-2 flex-1">Batal</button>
            </div>
          </div>
        )
      ) : null}
    </div>
  );
}

// ── kelola pelamar (sisi pembuat lowongan / Adit) ──
function KelolaPelamar({ post }) {
  const [open, setOpen] = useState(false);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    teammateAPI.getById(post.id)
      .then((r) => setApps(r.data.data?.applications || []))
      .catch(() => setApps([]))
      .finally(() => setLoading(false));
  };

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) load();
  };

  const decide = async (appId, status) => {
    setBusyId(appId);
    try {
      await teammateAPI.updateApp(appId, { status });
      load();
    } catch {}
    setBusyId(null);
  };

  const pendingCount = post.jumlah_pelamar || 0;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-gray-900 text-sm">{post.judul}</h3>
        <span className="text-xs text-gray-400">{timeAgo(post.created_at)}</span>
      </div>
      <p className="text-sm text-gray-500 mb-3 line-clamp-1">{post.deskripsi}</p>

      <button onClick={toggle} className="btn-secondary text-sm py-2 w-full">
        <Inbox className="h-4 w-4" /> {open ? 'Tutup Pelamar' : 'Kelola Pelamar'}
        {!open && pendingCount > 0 && (
          <span className="ml-1 text-xs bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded-full">{pendingCount}</span>
        )}
      </button>

      {open && (
        <div className="mt-3 space-y-2">
          {loading ? (
            <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-brand-400" /></div>
          ) : apps.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-3">Belum ada yang minta bergabung.</p>
          ) : (
            apps.map((ap) => (
              <div key={ap.id} className="flex items-center justify-between gap-2 p-3 rounded-xl bg-gray-50">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800">{ap.nama_pelamar}</p>
                  <p className="text-xs text-gray-500">{ap.posisi}{ap.jurusan ? ` · ${ap.jurusan}` : ''}</p>
                  {ap.pesan && <p className="text-xs text-gray-400 mt-0.5 truncate">"{ap.pesan}"</p>}
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
                  <span className={`badge flex-shrink-0 ${ap.status === 'diterima' ? 'badge-green' : 'badge-red'}`}>
                    {ap.status === 'diterima' ? 'Diterima' : 'Ditolak'}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ── tab "Status Gabung" (sisi pelamar memantau hasil) ──
function StatusGabung({ apps }) {
  if (apps.length === 0) {
    return (
      <div className="card p-16 text-center">
        <Hourglass className="h-12 w-12 text-gray-200 mx-auto mb-3" />
        <p className="font-semibold text-gray-500 mb-1">Belum ada permintaan</p>
        <p className="text-sm text-gray-400">Permintaan gabung yang kamu kirim akan muncul di sini.</p>
      </div>
    );
  }

  const cfg = {
    pending:  { label: 'Menunggu', cls: 'badge-amber', Icon: Hourglass },
    diterima: { label: 'Diterima', cls: 'badge-green', Icon: CircleCheck },
    ditolak:  { label: 'Ditolak',  cls: 'badge-red',   Icon: CircleX },
  };

  return (
    <div className="space-y-3 max-w-3xl">
      {apps.map((a) => {
        const c = cfg[a.status] || cfg.pending;
        const Icon = c.Icon;
        return (
          <div key={a.id} className="card p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{a.judul_lomba}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Posisi: <span className="font-medium text-gray-700">{a.posisi}</span> · Tim {a.nama_pembuat}
                </p>
              </div>
              <span className={c.cls}><Icon className="h-3 w-3" /> {c.label}</span>
            </div>

            {a.status === 'diterima' && (a.kontak_whatsapp || a.kontak_email) && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <p className="text-xs font-semibold text-emerald-700 mb-2">
                  Diterima! Hubungi {a.nama_pembuat} lewat:
                </p>
                <div className="flex flex-wrap gap-2">
                  {a.kontak_whatsapp && (
                    <a href={`https://wa.me/${a.kontak_whatsapp.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium bg-white border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-100">
                      <MessageCircle className="h-3.5 w-3.5" /> {a.kontak_whatsapp}
                    </a>
                  )}
                  {a.kontak_email && (
                    <a href={`mailto:${a.kontak_email}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium bg-white border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-100">
                      <Mail className="h-3.5 w-3.5" /> {a.kontak_email}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function KolaborasiContent() {
  const searchParams = useSearchParams();
  const lombaParam = searchParams.get('lomba_id');
  const { user } = useAuth();

  const [tab, setTab] = useState('cari'); // 'buat' | 'cari' | 'status'
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [myApps, setMyApps] = useState([]);
  const [lombaInfo, setLombaInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMyApps = () => {
    if (user?.role !== 'mahasiswa') return;
    teammateAPI.getMyApplications()
      .then((r) => setMyApps(r.data.data || []))
      .catch(() => setMyApps([]));
  };

  useEffect(() => {
    if (!lombaParam) { setLoading(false); return; }
    Promise.all([
      teammateAPI.getAll({ lomba_id: lombaParam }),
      lombaAPI.getById(lombaParam),
    ])
      .then(([postRes, lombaRes]) => {
        const all = postRes.data.data || [];
        setPosts(all);
        setMyPosts(all.filter((p) => p.pembuat_id === user?.id));
        setLombaInfo(lombaRes.data.data || null);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [lombaParam, user]);

  useEffect(() => { loadMyApps(); }, [user]);

  // belum pilih lomba -> minta pilih dulu
  if (!lombaParam) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="card p-10 text-center max-w-md">
            <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
              <UsersRound className="h-7 w-7 text-brand-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Pilih Lomba Dulu</h2>
            <p className="text-sm text-gray-500 mb-6">
              Pusat Kolaborasi bekerja per lomba. Masuk ke detail lomba yang ingin kamu ikuti dulu, lalu cari atau buka lowongan rekan tim dari sana.
            </p>
            <Link href="/lomba" className="btn-primary">
              <Search className="h-4 w-4" /> Cari Lomba Sekarang
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'buat',   label: 'Buat Lowongan' },
    { id: 'cari',   label: 'Cari Tim' },
    { id: 'status', label: 'Status Gabung' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="bg-brand-gradient px-6 py-8">
        <div className="container-main">
          <Link href={`/lomba/${lombaParam}`} className="inline-flex items-center gap-1.5 text-sm text-brand-100 hover:text-white mb-3">
            <ArrowLeft className="h-4 w-4" /> Kembali ke detail lomba
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1">Pusat Kolaborasi</h1>
          {lombaInfo && (
            <p className="text-brand-100 text-sm">
              Untuk lomba: <span className="font-semibold text-white">{lombaInfo.judul}</span>
            </p>
          )}
          <p className="text-brand-200 text-sm max-w-lg mt-1">
            Bentuk tim impianmu di sini. Buka lowongan, cari tim yang cocok, dan pantau status gabungmu.
          </p>
        </div>
      </div>

      <div className="container-main py-6 flex-1 w-full">
        {/* tabs */}
        <div className="flex border-b border-gray-200 mb-6 gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition -mb-px whitespace-nowrap ${
                tab === t.id ? 'border-brand-600 text-brand-700' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {t.label}
              {t.id === 'status' && myApps.length > 0 && (
                <span className="ml-1.5 text-xs bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded-full">{myApps.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* konten per tab */}
        {tab === 'buat' && (
          <div className="max-w-3xl">
            <Link href={`/teammate/create?lomba_id=${lombaParam}`}
              className="btn-primary mb-6 inline-flex">
              <Plus className="h-4 w-4" /> Buat Lowongan Tim Baru
            </Link>

            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Inbox className="h-4 w-4 text-brand-600" /> Kelola Pelamar
            </h3>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-brand-400" /></div>
            ) : myPosts.length === 0 ? (
              <div className="card p-10 text-center">
                <p className="text-sm text-gray-400">Kamu belum punya lowongan untuk lomba ini.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myPosts.map((p) => <KelolaPelamar key={p.id} post={p} />)}
              </div>
            )}
          </div>
        )}

        {tab === 'cari' && (
          loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand-400" /></div>
          ) : posts.length === 0 ? (
            <div className="card p-16 text-center max-w-3xl">
              <UsersRound className="h-12 w-12 text-gray-200 mx-auto mb-3" />
              <p className="font-semibold text-gray-500 mb-1">Belum ada lowongan tim</p>
              <p className="text-sm text-gray-400">Jadi yang pertama buka lowongan lewat tab "Buat Lowongan".</p>
            </div>
          ) : (
            <div className="space-y-3 max-w-3xl">
              {posts.map((p) => <LowonganCard key={p.id} post={p} onApplied={loadMyApps} />)}
            </div>
          )
        )}

        {tab === 'status' && <StatusGabung apps={myApps} />}
      </div>

      <footer className="border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        © 2026 AMBAchamp. Platform Penyedia Informasi Lomba & Kolaborasi.
      </footer>
    </div>
  );
}

export default function PusatKolaborasiPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <KolaborasiContent />
    </Suspense>
  );
}
