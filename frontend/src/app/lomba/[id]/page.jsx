'use client';

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

    if (user && user.role === 'mahasiswa') {
      wishlistAPI.getAll()
        .then(res => {
          const list = res.data?.data || [];
          const isSaved = list.some(w => w.id === Number(id));
          setSaved(isSaved);
        })
        .catch(() => {});
    }
  }, [id, user]);

  const getExternalLink = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

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
      <div className="min-h-screen bg-surface flex flex-col font-sans">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
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
    <div className="min-h-screen bg-surface text-primary flex flex-col font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 flex-grow">
        {/* Back */}
        <Link href="/lomba" className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-secondary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Lomba
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Poster */}
            <div className="bg-white rounded-3xl border border-outline-variant/60 overflow-hidden shadow-sm">
              {lomba.poster ? (
                <div className="relative h-96 overflow-hidden bg-surface-container">
                  <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:5000/uploads'}/posters/${lomba.poster}`}
                    alt={lomba.judul} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-primary to-secondary flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
                  </div>
                  <img src="/images/logo-ambachamp.png" alt="AMBAChamp" className="h-20 w-auto object-contain z-10 brightness-0 invert opacity-60" />
                </div>
              )}
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-surface-container text-secondary">{lomba.kategori?.replace('_',' ')}</span>
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-surface-container text-on-surface-variant capitalize">{lomba.tingkat}</span>
                  {lomba.biaya_pendaftaran === 0 && <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700">Gratis</span>}
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1 shadow-2xs"><ShieldCheck className="h-3.5 w-3.5" /> Terverifikasi</span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary mb-3 leading-snug">{lomba.judul}</h1>
                <p className="font-sans text-body-sm text-on-surface-variant">oleh <span className="font-semibold text-primary">{lomba.nama_penyelenggara}</span></p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/60 shadow-sm">
              <h2 className="font-display font-semibold text-headline-sm text-primary mb-4">Deskripsi Lomba</h2>
              <p className="font-sans text-body-md text-on-surface-variant leading-relaxed whitespace-pre-wrap">{lomba.deskripsi}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick info */}
            <div className="bg-white p-6 rounded-3xl border border-outline-variant/60 shadow-sm space-y-5">
              <h3 className="font-display font-semibold text-body-lg text-primary border-b border-outline-variant/20 pb-3">Informasi Lomba</h3>

              <div className="flex items-start gap-3">
                <Calendar className={`h-5 w-5 flex-shrink-0 mt-0.5 ${isExpired ? 'text-error' : daysLeft <= 7 ? 'text-amber-500' : 'text-secondary'}`} />
                <div>
                  <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Deadline Pendaftaran</p>
                  <p className={`text-sm font-semibold mt-0.5 ${isExpired ? 'text-error' : 'text-primary'}`}>
                    {deadline.toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })}
                  </p>
                  <p className={`text-xs mt-0.5 font-medium ${isExpired ? 'text-error' : daysLeft <= 7 ? 'text-amber-600' : 'text-on-surface-variant'}`}>
                    {isExpired ? '⚠️ Pendaftaran sudah ditutup' : `${daysLeft} hari lagi`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Banknote className="h-5 w-5 flex-shrink-0 mt-0.5 text-emerald-600" />
                <div>
                  <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Biaya Pendaftaran</p>
                  <p className="text-sm font-semibold text-primary mt-0.5">
                    {lomba.biaya_pendaftaran === 0 ? 'Gratis' : `Rp ${parseInt(lomba.biaya_pendaftaran).toLocaleString('id-ID')}`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 flex-shrink-0 mt-0.5 text-secondary" />
                <div>
                  <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Tingkat Wilayah</p>
                  <p className="text-sm font-semibold text-primary mt-0.5 capitalize">{lomba.tingkat}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-purple-600" />
                <div>
                  <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Penyelenggara</p>
                  <p className="text-sm font-semibold text-primary mt-0.5">{lomba.nama_penyelenggara}</p>
                </div>
              </div>

              {lomba.contact_person && (
                <div className="flex items-start gap-3">
                  <Contact className="h-5 w-5 flex-shrink-0 mt-0.5 text-amber-600" />
                  <div>
                    <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Contact Person</p>
                    <p className="text-sm font-semibold text-primary mt-0.5">{lomba.contact_person}</p>
                  </div>
                </div>
              )}

              {lomba.link_sosmed && (
                <div className="flex items-start gap-3">
                  <Link2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-secondary" />
                  <div className="min-w-0">
                    <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Media Sosial / Info Poster</p>
                    <a href={lomba.link_sosmed} target="_blank" rel="noopener noreferrer"
                      className="text-sm font-semibold text-secondary hover:underline break-all mt-0.5 block">
                      {lomba.link_sosmed}
                    </a>
                  </div>
                </div>
              )}

              <div className="pt-4 space-y-3">
                {lomba.link_pendaftaran && (
                  <a href={getExternalLink(lomba.link_pendaftaran)} target="_blank" rel="noopener noreferrer"
                    className={`w-full justify-center inline-flex items-center gap-2 font-label-lg px-6 py-4 rounded-xl transition-all shadow-md active:scale-95 ${
                      isExpired 
                        ? 'bg-surface-container text-on-surface-variant cursor-not-allowed pointer-events-none shadow-none' 
                        : 'bg-primary text-on-primary hover:opacity-90'
                    }`}>
                    {isExpired ? 'Pendaftaran Ditutup' : 'Daftar Sekarang'} <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                {user?.role === 'mahasiswa' && (
                  <button onClick={toggleWishlist} disabled={saving}
                    className={`w-full justify-center inline-flex items-center gap-2 font-label-lg px-6 py-3.5 rounded-xl transition-all border ${
                      saved 
                        ? 'bg-surface-container border-secondary/20 text-secondary hover:bg-surface-container-high/60' 
                        : 'border-outline-variant text-primary hover:bg-surface'
                    }`}>
                    {saving ? <Loader2 className="h-5 w-5 animate-spin" />
                      : saved ? <><BookmarkCheck className="h-5 w-5" /> Tersimpan di Wishlist</>
                      : <><Bookmark className="h-5 w-5" /> Simpan ke Wishlist</>
                    }
                  </button>
                )}
              </div>
            </div>

            {/* Cari Tim (Teammate finder promo banner) */}
            {user?.role === 'mahasiswa' && (
              <div className="bg-surface-container p-6 rounded-3xl border border-secondary/20 shadow-xs">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-secondary shrink-0">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-primary text-body-lg mb-1">Butuh Rekan Tim?</h4>
                    <p className="font-sans text-xs text-on-surface-variant mb-4 leading-normal">
                      Gunakan fitur Teammate Finder untuk mencari rekan tim yang cocok atau mendaftar ke tim bentukan orang lain.
                    </p>
                    <Link href={`/teammate?lomba_id=${lomba.id}`} className="bg-secondary hover:opacity-95 text-on-secondary px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md inline-flex items-center gap-1.5 active:scale-95">
                      Cari / Buat Tim <Users className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
