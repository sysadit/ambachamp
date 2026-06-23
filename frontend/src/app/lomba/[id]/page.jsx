'use client';
// src/app/lomba/[id]/page.jsx

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { lombaAPI, wishlistAPI } from '@/lib/api';
import {
  Calendar, ExternalLink, Bookmark, BookmarkCheck,
  ArrowLeft, Loader2, Users, Tag, Globe, Banknote, ShieldCheck,
  Link2, Contact, Building2
} from 'lucide-react';

export default function LombaDetailPage() {
  const { id }      = useParams();
  const router      = useRouter();
  const { user }    = useAuth();
  const [lomba,     setLomba]     = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [saved,     setSaved]     = useState(false);
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    lombaAPI.getById(id)
      .then(res => setLomba(res.data.data))
      .catch(() => router.push('/lomba'))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleWishlist = async () => {
    setSaving(true);
    try {
      if (saved) { await wishlistAPI.remove(id); setSaved(false); }
      else       { await wishlistAPI.add(id);    setSaved(true); }
    } catch {}
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
        </div>
      </div>
    );
  }

  if (!lomba) return null;

  const deadline  = new Date(lomba.deadline_pendaftaran);
  const today     = new Date();
  const daysLeft  = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft < 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container-main py-8 flex-1">
        {/* Back */}
        <Link href="/lomba" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 mb-6 transition">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Lomba
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Poster */}
            <div className="card overflow-hidden">
              {lomba.poster ? (
                <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/posters/${lomba.poster}`}
                  alt={lomba.judul} className="w-full h-64 object-cover" />
              ) : (
                <div className="h-48 bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                  <span className="text-6xl">🏆</span>
                </div>
              )}
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="badge-blue">{lomba.kategori?.replace('_',' ')}</span>
                  <span className="badge-gray capitalize">{lomba.tingkat}</span>
                  {lomba.biaya_pendaftaran === 0 && <span className="badge-green">Gratis</span>}
                  <span className="badge-green flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Terverifikasi</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">{lomba.judul}</h1>
                <p className="text-sm text-slate-500">oleh <span className="font-medium text-slate-700">{lomba.nama_penyelenggara}</span></p>
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="font-semibold text-slate-800 mb-3">Deskripsi Lomba</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{lomba.deskripsi}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick info */}
            <div className="card p-5 space-y-4">
              <h3 className="font-semibold text-slate-800">Informasi Lomba</h3>

              <div className="flex items-start gap-3">
                <Calendar className={`h-5 w-5 flex-shrink-0 mt-0.5 ${isExpired ? 'text-red-500' : daysLeft <= 7 ? 'text-amber-500' : 'text-brand-500'}`} />
                <div>
                  <p className="text-xs text-slate-400">Deadline Pendaftaran</p>
                  <p className={`text-sm font-medium ${isExpired ? 'text-red-600' : 'text-slate-800'}`}>
                    {deadline.toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })}
                  </p>
                  <p className={`text-xs mt-0.5 ${isExpired ? 'text-red-500' : daysLeft <= 7 ? 'text-amber-600' : 'text-slate-500'}`}>
                    {isExpired ? '⚠️ Pendaftaran sudah ditutup' : `${daysLeft} hari lagi`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Banknote className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-500" />
                <div>
                  <p className="text-xs text-slate-400">Biaya Pendaftaran</p>
                  <p className="text-sm font-medium text-slate-800">
                    {lomba.biaya_pendaftaran === 0 ? 'Gratis' : `Rp ${parseInt(lomba.biaya_pendaftaran).toLocaleString('id-ID')}`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-500" />
                <div>
                  <p className="text-xs text-slate-400">Tingkat</p>
                  <p className="text-sm font-medium text-slate-800 capitalize">{lomba.tingkat}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-purple-500" />
                <div>
                  <p className="text-xs text-slate-400">Penyelenggara</p>
                  <p className="text-sm font-medium text-slate-800">{lomba.nama_penyelenggara}</p>
                </div>
              </div>

              {lomba.contact_person && (
                <div className="flex items-start gap-3">
                  <Contact className="h-5 w-5 flex-shrink-0 mt-0.5 text-amber-500" />
                  <div>
                    <p className="text-xs text-slate-400">Contact Person</p>
                    <p className="text-sm font-medium text-slate-800">{lomba.contact_person}</p>
                  </div>
                </div>
              )}

              {lomba.link_sosmed && (
                <div className="flex items-start gap-3">
                  <Link2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-sky-500" />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Media Sosial / Info Poster</p>
                    <a href={lomba.link_sosmed} target="_blank" rel="noopener noreferrer"
                      className="text-sm font-medium text-brand-600 hover:underline break-all">
                      {lomba.link_sosmed}
                    </a>
                  </div>
                </div>
              )}
              <div className="pt-2 space-y-2">
                {lomba.link_pendaftaran && !isExpired && (
                  <a href={lomba.link_pendaftaran} target="_blank" rel="noopener noreferrer"
                    className="w-full justify-center inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-5 py-3 rounded-xl hover:bg-blue-700 transition shadow-sm">
                    Daftar Sekarang <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                {user?.role === 'mahasiswa' && (
                  <button onClick={toggleWishlist} disabled={saving}
                    className={`w-full justify-center ${saved ? 'btn-secondary text-brand-600 border-brand-200' : 'btn-secondary'}`}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" />
                      : saved ? <><BookmarkCheck className="h-4 w-4" /> Tersimpan di Wishlist</>
                      : <><Bookmark className="h-4 w-4" /> Simpan ke Wishlist</>
                    }
                  </button>
                )}
              </div>
            </div>

            {/* Cari Tim */}
            <div className="card p-5 bg-brand-50 border-brand-200">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-brand-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-brand-800 text-sm mb-1">Butuh Rekan Tim?</p>
                  <p className="text-xs text-brand-600 mb-3">Gunakan fitur Teammate Finder untuk cari anggota tim lomba ini.</p>
                  <Link href={`/teammate?lomba_id=${lomba.id}`} className="btn-primary text-xs py-2 px-3">
                    Cari / Buat Tim <Users className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
