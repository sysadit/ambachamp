'use client';
// src/app/admin/lomba/page.jsx — Sesuai desain gambar 6

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { adminAPI } from '@/lib/api';
import {
  ShieldCheck, CheckCircle, XCircle, ExternalLink, FileText,
  Loader2, Clock, ChevronDown
} from 'lucide-react';

export default function AdminLombaPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [lombaList,  setLombaList]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [pendingCt,  setPendingCt]  = useState(0);
  const [tab,        setTab]        = useState('pending');
  const [modal,      setModal]      = useState(null);
  const [alasan,     setAlasan]     = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) router.push('/auth/login');
  }, [user, authLoading]);

  const fetchLomba = async () => {
    setLoading(true);
    try {
      const [allRes, pendRes] = await Promise.all([
        adminAPI.getAllLomba({ status: tab }),
        adminAPI.getPendingLomba(),
      ]);
      setLombaList(allRes.data.data || []);
      setPendingCt(pendRes.data.count || 0);
    } catch { setLombaList([]); }
    setLoading(false);
  };

  useEffect(() => { if (user?.role === 'admin') fetchLomba(); }, [user, tab]);

  const handleApprove = async (lombaId) => {
    try {
      await adminAPI.verifyLomba(lombaId, { status: 'verified' });
      fetchLomba();
    } catch (err) {
      alert(err?.response?.data?.message || 'Gagal verifikasi lomba.');
    }
  };

  const handleVerify = async (status) => {
    setProcessing(true);
    try {
      await adminAPI.verifyLomba(modal.id, { status, alasan_penolakan: alasan || undefined });
      setModal(null); setAlasan('');
      fetchLomba();
    } catch {}
    setProcessing(false);
  };

  if (authLoading || !user) return null;

  return (
    <DashboardLayout title="Verifikasi Lomba">
      <div className="flex-1">
        {/* ── Dashboard Admin header card ── */}
        <div className="rounded-2xl p-6 mb-6 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #1a3a2a 0%, #0f2518 100%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Dashboard Admin</h1>
              <p className="text-white/50 text-sm">Verifikasi informasi lomba yang diunggah oleh penyelenggara agar aman digunakan.</p>
            </div>
          </div>
          {pendingCt > 0 && (
            <div className="bg-white/10 rounded-xl px-5 py-3 text-center flex-shrink-0">
              <p className="text-3xl font-bold text-white">{pendingCt}</p>
              <p className="text-white/60 text-xs">Menunggu<br />Verifikasi</p>
            </div>
          )}
        </div>

        {/* ── Tab filter ── */}
        <div className="flex gap-2 mb-5">
          {[
            { v:'pending',  l:'Pending' },
            { v:'verified', l:'Verified' },
            { v:'rejected', l:'Ditolak' },
          ].map(t => (
            <button key={t.v} onClick={() => setTab(t.v)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                tab === t.v ? 'bg-violet-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>
              {t.l}
              {t.v === 'pending' && pendingCt > 0 && (
                <span className={`ml-2 text-xs font-bold px-1.5 py-0.5 rounded-full ${tab === t.v ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>
                  {pendingCt}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Table ── */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-7 w-7 animate-spin text-brand-400" /></div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5 w-2/5">Informasi Lomba</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">Dokumen Pendukung</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lombaList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-16 text-gray-400 text-sm">
                      <CheckCircle className="h-8 w-8 text-green-300 mx-auto mb-2" />
                      Tidak ada lomba dengan status "{tab}"
                    </td>
                  </tr>
                ) : lombaList.map(lomba => (
                  <tr key={lomba.id} className="hover:bg-gray-50/80 transition">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900 text-sm mb-0.5">{lomba.judul}</p>
                      <p className="text-xs text-gray-400">
                        {lomba.nama_penyelenggara} · {new Date(lomba.created_at).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}
                      </p>
                      {lomba.alasan_penolakan && (
                        <p className="text-xs text-red-500 mt-1 bg-red-50 px-2 py-1 rounded-lg inline-block">
                          {lomba.alasan_penolakan}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1.5">
                        {lomba.poster && (
                          <a href={`${process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:5000/uploads'}/posters/${lomba.poster}`} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 hover:underline">
                            <FileText className="h-3.5 w-3.5" /> Poster
                          </a>
                        )}
                        {lomba.link_pendaftaran && (
                          <a href={lomba.link_pendaftaran} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 hover:underline">
                            <ExternalLink className="h-3.5 w-3.5" /> Link Asli
                          </a>
                        )}
                        {!lomba.poster && !lomba.link_pendaftaran && (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {lomba.status === 'pending'  && <span className="badge-pending text-xs"><Clock className="h-3 w-3" /> PENDING</span>}
                      {lomba.status === 'verified' && <span className="badge-green text-xs"><CheckCircle className="h-3 w-3" /> VERIFIED</span>}
                      {lomba.status === 'rejected' && <span className="badge-red text-xs"><XCircle className="h-3 w-3" /> DITOLAK</span>}
                    </td>
                    <td className="px-5 py-4">
                      {lomba.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          {/* Approve */}
                          <button
                            onClick={() => handleApprove(lomba.id)}
                            title="Verifikasi"
                            className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          {/* Reject → open modal */}
                          <button
                            title="Tolak"
                            onClick={() => setModal(lomba)}
                            className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 hover:bg-red-100 transition">
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Reject modal ── */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md p-6">
            <h3 className="font-bold text-gray-900 mb-1">Tolak Lomba</h3>
            <p className="text-sm text-gray-500 mb-4">
              Berikan alasan penolakan untuk <strong>"{modal.judul}"</strong>
            </p>
            <textarea value={alasan} onChange={e => setAlasan(e.target.value)}
              placeholder="Contoh: Informasi tidak lengkap, link tidak valid, dll."
              rows={3} className="input-base text-sm resize-none mb-4" />
            <div className="flex gap-2">
              <button onClick={() => handleVerify('rejected')} disabled={!alasan || processing}
                className="btn-danger flex-1 text-sm py-2.5">
                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Konfirmasi Tolak'}
              </button>
              <button onClick={() => { setModal(null); setAlasan(''); }}
                className="btn-secondary flex-1 text-sm py-2.5">Batal</button>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        © 2026 AmbaChamp. Platform Penyedia Informasi Lomba & Kolaborasi.
      </footer>
    </DashboardLayout>
  );
}
