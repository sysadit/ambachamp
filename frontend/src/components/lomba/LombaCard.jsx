'use client';
// src/components/lomba/LombaCard.jsx

import Link from 'next/link';
import { MapPin, Clock, DollarSign, Bookmark, BookmarkCheck, ShieldCheck, Trophy } from 'lucide-react';
import { useState } from 'react';
import { wishlistAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const KATEGORI_CFG = {
  teknologi_digital: { label: 'Teknologi & Digital', cls: 'bg-surface-container text-secondary-container font-semibold' },
  sains_riset:       { label: 'Sains & Riset',       cls: 'bg-tertiary-fixed/30 text-on-tertiary-fixed-variant font-semibold' },
  olahraga:          { label: 'Olahraga',            cls: 'bg-amber-100 text-amber-800 font-semibold' },
  seni_kreatif:      { label: 'Seni & Kreatif',      cls: 'bg-pink-100 text-pink-800 font-semibold' },
};

const TINGKAT_ICON = {
  kampus:        '🏫',
  nasional:      '🇮🇩',
  internasional: '🌍',
};

export default function LombaCard({ lomba, inWishlist = false, onWishlistChange }) {
  const { user }      = useAuth();
  const [saved, setSaved]     = useState(inWishlist);
  const [savingWL, setSaving] = useState(false);

  const kat      = KATEGORI_CFG[lomba.kategori] || { label: 'Lainnya', cls: 'bg-surface-container text-on-surface-variant font-semibold' };
  const deadline = new Date(lomba.deadline_pendaftaran);
  const today    = new Date();
  const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  const expired  = daysLeft < 0;

  const hasPoster = !!lomba.poster;
  const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:5000/uploads';
  const imgSrc    = hasPoster ? `${uploadUrl}/posters/${lomba.poster}` : null;

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || user.role !== 'mahasiswa') return;
    setSaving(true);
    try {
      if (saved) { await wishlistAPI.remove(lomba.id); setSaved(false); }
      else       { await wishlistAPI.add(lomba.id);    setSaved(true); }
      onWishlistChange?.();
    } catch {}
    setSaving(false);
  };

  return (
    <Link href={`/lomba/${lomba.id}`}
      className="bg-white rounded-3xl border border-outline-variant/60 overflow-hidden shadow-sm hover:shadow-xl hover:border-secondary/40 transition-all duration-300 group flex flex-col">

      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-surface-container">
        {hasPoster ? (
          <img src={imgSrc} alt={lomba.judul}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-container-high/30 p-6">
            <img src="/images/logo-ambachamp.png" alt="AMBAChamp" className="h-14 w-auto object-contain opacity-25 grayscale" />
          </div>
        )}

        {/* Category badge top-left */}
        <span className={`absolute top-3 left-3 text-xs px-3 py-1 rounded-lg shadow-sm ${kat.cls}`}>
          {kat.label}
        </span>

        {/* Verified badge */}
        <span className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-secondary text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm">
          <ShieldCheck className="h-3.5 w-3.5" />
          Verified
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-display text-body-md font-semibold text-primary leading-snug mb-1 line-clamp-2 group-hover:text-secondary transition-colors">
          {lomba.judul}
        </h3>
        <p className="font-sans text-xs text-on-surface-variant mb-4">Oleh {lomba.nama_penyelenggara}</p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant mb-4 mt-auto">
          <span className="flex items-center gap-1 bg-surface px-2.5 py-1 rounded-md border border-outline-variant/30">
            <span className="shrink-0">{TINGKAT_ICON[lomba.tingkat]}</span>
            <span>{lomba.tingkat?.charAt(0).toUpperCase() + lomba.tingkat?.slice(1)}</span>
          </span>
          <span className="flex items-center gap-1 bg-surface px-2.5 py-1 rounded-md border border-outline-variant/30 text-secondary font-bold">
            <DollarSign className="h-3 w-3 shrink-0" />
            <span>{lomba.biaya_pendaftaran === 0 ? 'Gratis' : `Rp ${parseInt(lomba.biaya_pendaftaran).toLocaleString('id-ID')}`}</span>
          </span>
        </div>

        {/* Deadline + Bookmark */}
        <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20">
          <span className={`font-sans text-xs font-semibold flex items-center gap-1 ${expired ? 'text-error' : daysLeft <= 7 ? 'text-error' : 'text-on-surface-variant'}`}>
            <Clock className="h-3.5 w-3.5" />
            <span>Batas: {deadline.toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}</span>
          </span>

          {/* Bookmark button */}
          {user?.role === 'mahasiswa' && (
            <button onClick={toggleWishlist} disabled={savingWL}
              className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-secondary transition-all">
              {saved
                ? <BookmarkCheck className="h-4 w-4 text-secondary" />
                : <Bookmark className="h-4 w-4" />
              }
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
