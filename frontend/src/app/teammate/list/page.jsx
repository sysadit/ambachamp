'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { teammateAPI } from '@/lib/api';
import Link from 'next/link';
import {
  Users, Loader2, Inbox, Hourglass, CircleCheck, CircleX,
  TriangleAlert, MessageCircle, ChevronDown, ChevronUp, Mail, Phone, ExternalLink, Calendar, Info
} from 'lucide-react';

export default function TeammateListPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('buat'); // 'buat' = Lowongan Tim Saya, 'lamar' = Tim yang Dilamar
  const [myPosts, setMyPosts] = useState([]);
  const [myApps, setMyApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
    if (!authLoading && user && user.role !== 'mahasiswa') router.push('/');
  }, [user, authLoading]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [postsRes, appsRes] = await Promise.all([
        teammateAPI.getMyPosts().catch(() => ({ data: { data: [] } })),
        teammateAPI.getMyApplications().catch(() => ({ data: { data: [] } })),
      ]);
      setMyPosts(postsRes.data.data || []);
      setMyApps(appsRes.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'mahasiswa') {
      loadData();
    }
  }, [user]);

  if (authLoading || !user) return null;

  return (
    <DashboardLayout title="Kelola Tim List">
      <div className="mb-6">
        <p className="text-sm text-slate-500">Kelola postingan tim yang kamu buka serta pantau status pendaftaran tim yang kamu lamar.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 mb-6 overflow-x-auto">
        <button
          onClick={() => setTab('buat')}
          className={`px-6 py-3 font-bold whitespace-nowrap transition-colors border-b-2 flex items-center gap-2 ${
            tab === 'buat'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="h-4 w-4" />
          Lowongan Tim Saya
          {myPosts.length > 0 && (
            <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">{myPosts.length}</span>
          )}
        </button>
        <button
          onClick={() => setTab('lamar')}
          className={`px-6 py-3 font-bold whitespace-nowrap transition-colors border-b-2 flex items-center gap-2 ${
            tab === 'lamar'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Inbox className="h-4 w-4" />
          Tim yang Dilamar
          {myApps.length > 0 && (
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{myApps.length}</span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand-400" /></div>
      ) : tab === 'buat' ? (
        <TabLowonganSaya posts={myPosts} onReload={loadData} />
      ) : (
        <TabLamarSaya apps={myApps} />
      )}
    </DashboardLayout>
  );
}

// ─── TAB 1: LOWONGAN SAYA ────────────────────────────────────────────────────
function TabLowonganSaya({ posts, onReload }) {
  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
        <Users className="h-12 w-12 text-slate-200 mx-auto mb-3" />
        <p className="font-semibold text-slate-600 mb-1">Belum ada tim yang dibuat</p>
        <p className="text-sm text-slate-400 max-w-sm mx-auto mb-5">
          Buka postingan lowongan tim dari halaman detail lomba yang ingin kamu ikuti.
        </p>
        <Link href="/lomba" className="btn-primary inline-flex py-2.5 px-5">
          Cari Lomba & Buat Tim
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(p => (
        <PostCardKelola key={p.id} post={p} onReload={onReload} />
      ))}
    </div>
  );
}

function PostCardKelola({ post, onReload }) {
  const [open, setOpen] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [telegramInputs, setTelegramInputs] = useState({});
  const [closing, setClosing] = useState(false);

  let posisiList = [];
  try {
    posisiList = JSON.parse(post.posisi_dibutuhkan || '[]');
  } catch (e) {
    posisiList = [];
  }

  const loadApplicants = async () => {
    setLoading(true);
    try {
      const res = await teammateAPI.getPostById(post.id);
      setApplicants(res.data.data?.applications || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => {
    const nextState = !open;
    setOpen(nextState);
    if (nextState) {
      loadApplicants();
    }
  };

  const handleDecision = async (appId, status) => {
    setBusyId(appId);
    try {
      const body = { status };
      await teammateAPI.updateApplication(appId, body);
      loadApplicants();
      onReload?.();
    } catch (e) {
      alert(e.response?.data?.message || 'Gagal mengubah status pendaftaran.');
    } finally {
      setBusyId(null);
    }
  };

  const handleClosePost = async () => {
    if (!confirm('Apakah kamu yakin ingin menutup lowongan tim ini? Tindakan ini tidak bisa dibatalkan.')) return;
    setClosing(true);
    try {
      await teammateAPI.closePost(post.id);
      onReload?.();
    } catch (e) {
      alert(e.response?.data?.message || 'Gagal menutup lowongan.');
    } finally {
      setClosing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:border-slate-300 transition">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {post.judul_lomba}
              </span>
              <span className={post.status === 'open' ? 'badge-green' : 'badge-gray'}>
                {post.status === 'open' ? 'Terbuka' : 'Ditutup'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-800">{post.judul}</h3>
            {post.deskripsi_lomba && (
              <div className="flex items-start gap-1.5 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl max-w-2xl border border-slate-100">
                <Info className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                <p className="line-clamp-2"><strong>Deskripsi Lomba:</strong> {post.deskripsi_lomba}</p>
              </div>
            )}
            <p className="text-sm text-slate-600 pt-1 leading-relaxed">{post.deskripsi}</p>
            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 pt-2 font-medium">
              <span>Posisi Dibutuhkan:</span>
              {posisiList.map((pos, idx) => (
                <span key={idx} className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg">
                  {pos}
                </span>
              ))}
            </div>
          </div>

          <div className="flex md:flex-col gap-2 shrink-0 md:items-end">
            {post.status === 'open' && (
              <button
                onClick={handleClosePost}
                disabled={closing}
                className="btn-secondary text-xs px-4 py-2 font-bold hover:text-red-600 hover:bg-red-50 border-slate-200"
              >
                Tutup Lowongan
              </button>
            )}
            <button
              onClick={toggle}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 px-4 py-2.5 rounded-xl transition"
            >
              {open ? (
                <>Tutup Pelamar <ChevronUp className="h-4 w-4" /></>
              ) : (
                <>Lihat Pelamar <ChevronDown className="h-4 w-4" /></>
              )}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="bg-slate-50/50 border-t border-slate-100 p-6 space-y-4">
          <h4 className="font-bold text-sm text-slate-700 flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-400" />
            Daftar Pelamar ({applicants.length})
          </h4>

          {loading ? (
            <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-brand-400" /></div>
          ) : applicants.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">Belum ada pelamar untuk lowongan tim ini.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {applicants.map(app => (
                <div key={app.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div>
                      <span className="bg-indigo-100 text-indigo-700 text-2xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        Melamar: {app.posisi}
                      </span>
                      <h5 className="font-bold text-slate-800 text-base mt-1">{app.nama_pelamar}</h5>
                      <p className="text-xs text-slate-400 font-medium">NIM: {app.nim} · Jurusan: {app.jurusan}</p>
                    </div>

                    {app.pesan && (
                      <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        "{app.pesan}"
                      </p>
                    )}

                    {/* Kontak Detail */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                      {app.email && (
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3 shrink-0" /> {app.email}</span>
                      )}
                      {app.phone && (
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3 shrink-0" /> {app.phone}</span>
                      )}
                      {app.whatsapp && (
                        <a href={`https://wa.me/${app.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium">
                          <MessageCircle className="h-3 w-3 shrink-0" /> WA: {app.whatsapp} <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {app.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDecision(app.id, 'ditolak')}
                          disabled={busyId === app.id}
                          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                        >
                          <CircleX className="h-3.5 w-3.5" /> Tolak
                        </button>
                        <button
                          onClick={() => handleDecision(app.id, 'diterima')}
                          disabled={busyId === app.id}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-sm"
                        >
                          {busyId === app.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <CircleCheck className="h-3.5 w-3.5" />
                          )}
                          Terima
                        </button>
                      </div>
                    ) : (
                      <span className={app.status === 'diterima' ? 'badge-green' : 'badge-red'}>
                        {app.status === 'diterima' ? 'Diterima' : 'Ditolak'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── TAB 2: TIM YANG DILAMAR ────────────────────────────────────────────────
function TabLamarSaya({ apps }) {
  if (apps.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
        <Inbox className="h-12 w-12 text-slate-200 mx-auto mb-3" />
        <p className="font-semibold text-slate-600 mb-1">Belum melamar tim manapun</p>
        <p className="text-sm text-slate-400 max-w-sm mx-auto mb-5">
          Cari tim di kompetisi yang ingin kamu ikuti dan klik "Minta untuk Bergabung".
        </p>
        <Link href="/lomba" className="btn-primary inline-flex py-2.5 px-5">
          Cari Lowongan Tim Lomba
        </Link>
      </div>
    );
  }

  const badgeConfig = {
    pending:  { label: 'Menunggu', cls: 'badge-amber', Icon: Hourglass },
    diterima: { label: 'Diterima', cls: 'badge-green', Icon: CircleCheck },
    ditolak:  { label: 'Ditolak',  cls: 'badge-red',   Icon: CircleX },
  };

  return (
    <div className="space-y-4">
      {apps.map(a => {
        const conf = badgeConfig[a.status] || badgeConfig.pending;
        const StatusIcon = conf.Icon;

        return (
          <div key={a.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-brand-50 text-brand-700 text-xs font-semibold px-2.5 py-0.5 rounded-lg">
                  {a.judul_lomba}
                </span>
                <span className={conf.cls + " flex items-center gap-1 text-2xs"}>
                  <StatusIcon className="h-3 w-3" /> {conf.label}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-lg">{a.judul_post}</h3>
              <p className="text-sm text-slate-500">
                Posisi dilamar: <span className="font-semibold text-slate-700">{a.posisi}</span> · Ketua: <span className="font-medium text-slate-600">{a.nama_pembuat}</span>
              </p>
              {a.pesan && (
                <p className="text-xs text-slate-400 italic mt-1 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 max-w-lg">
                  "{a.pesan}"
                </p>
              )}
            </div>

            <div className="shrink-0">
              {a.status === 'diterima' && a.link_telegram ? (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-center space-y-2.5">
                  <p className="text-2xs font-bold text-emerald-700 uppercase tracking-wider">
                    Selamat, lamaran diterima!
                  </p>
                  <a
                    href={a.link_telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-sm transition"
                  >
                    <MessageCircle className="h-4 w-4" /> Gabung Grup Telegram
                  </a>
                </div>
              ) : a.status === 'diterima' ? (
                <span className="text-xs text-slate-400 italic">Menunggu link Telegram dari ketua tim</span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
