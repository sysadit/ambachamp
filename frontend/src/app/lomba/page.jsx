'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LombaCard from '@/components/lomba/LombaCard';
import { lombaAPI, wishlistAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Search, Filter, Loader2, ArrowLeft } from 'lucide-react';

const KATEGORI_OPTS = [
  { value: 'Semua', label: 'Semua Kategori' },
  { value: 'teknologi_digital', label: 'Teknologi & Digital' },
  { value: 'sains_riset', label: 'Sains & Riset' },
  { value: 'olahraga', label: 'Olahraga' },
  { value: 'seni_kreatif', label: 'Seni & Kreatif' },
];

const TINGKAT_OPTS = [
  { value: 'Semua', label: 'Semua Tingkat' },
  { value: 'internasional', label: 'Internasional' },
  { value: 'nasional', label: 'Nasional' },
  { value: 'kampus', label: 'Mahasiswa/Kampus' },
];

export default function LombaPage() {
  const { user } = useAuth();
  const [lombaList, setLombaList] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState('');
  const [keyword, setKeyword] = useState('');
  const [activeKategori, setActiveKategori] = useState('Semua');
  const [activeTingkat, setActiveTingkat] = useState('Semua');
  const [activeBiaya, setActiveBiaya] = useState('Semua');

  // Fetch wishlist untuk mengetahui status bookmark masing-masing lomba
  const fetchWishlist = useCallback(async () => {
    if (!user || user.role !== 'mahasiswa') {
      setWishlistIds([]);
      return;
    }
    try {
      const res = await wishlistAPI.getAll();
      const list = res.data?.data || [];
      setWishlistIds(list.map(w => w.id));
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  }, [user]);

  // Fetch lomba dari backend dengan filter
  const fetchLomba = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        keyword: keyword || undefined,
        kategori: activeKategori !== 'Semua' ? activeKategori : undefined,
        tingkat: activeTingkat !== 'Semua' ? activeTingkat : undefined,
        gratis: activeBiaya === 'Gratis' ? '1' : undefined,
        limit: 100
      };

      const res = await lombaAPI.getAll(params);
      let data = res.data?.data || [];

      // Filter client-side untuk berbayar
      if (activeBiaya === 'Berbayar') {
        data = data.filter(l => l.biaya_pendaftaran > 0);
      }

      setLombaList(data);
    } catch (err) {
      console.error('Error fetching lomba:', err);
      setLombaList([]);
    } finally {
      setLoading(false);
    }
  }, [keyword, activeKategori, activeTingkat, activeBiaya]);

  useEffect(() => {
    fetchLomba();
  }, [fetchLomba]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    setKeyword(searchVal);
  };

  const resetFilters = () => {
    setActiveKategori('Semua');
    setActiveTingkat('Semua');
    setActiveBiaya('Semua');
    setSearchVal('');
    setKeyword('');
  };

  return (
    <div className="min-h-screen bg-surface text-primary font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10">
        <div className="mb-8">
          <h1 className="font-display text-display-md text-primary">Mencari Lomba</h1>
          <p className="font-sans text-body-lg text-on-surface-variant mt-2">Temukan kompetisi yang tepat untuk mengasah potensimu.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-outline-variant/60 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6 text-primary">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-secondary" />
                  <h2 className="font-display font-semibold text-body-lg text-primary">Filter Pencarian</h2>
                </div>
                {(activeKategori !== 'Semua' || activeTingkat !== 'Semua' || activeBiaya !== 'Semua' || keyword) && (
                  <button onClick={resetFilters} className="text-xs text-error hover:opacity-80 font-semibold transition-colors">
                    Reset
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Filter Kategori */}
                <div>
                  <label className="block text-sm font-bold text-primary mb-3">Kategori</label>
                  <div className="space-y-3">
                    {KATEGORI_OPTS.map(cat => (
                      <label key={cat.value} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={activeKategori === cat.value}
                          onChange={() => setActiveKategori(cat.value)}
                          className="w-4 h-4 rounded border-outline-variant/60 text-secondary focus:ring-secondary transition-colors cursor-pointer accent-secondary"
                        />
                        <span className={`font-medium transition-colors ${activeKategori === cat.value ? 'text-secondary font-bold' : 'text-on-surface-variant group-hover:text-primary'}`}>
                          {cat.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filter Tingkat */}
                <div className="pt-6 border-t border-outline-variant/30">
                  <label className="block text-sm font-bold text-primary mb-3">Tingkat Wilayah</label>
                  <div className="space-y-3">
                    {TINGKAT_OPTS.map(level => (
                      <label key={level.value} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={activeTingkat === level.value}
                          onChange={() => setActiveTingkat(level.value)}
                          className="w-4 h-4 rounded border-outline-variant/60 text-secondary focus:ring-secondary transition-colors cursor-pointer accent-secondary"
                        />
                        <span className={`font-medium transition-colors ${activeTingkat === level.value ? 'text-secondary font-bold' : 'text-on-surface-variant group-hover:text-primary'}`}>
                          {level.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filter Biaya */}
                <div className="pt-6 border-t border-outline-variant/30">
                  <label className="block text-sm font-bold text-primary mb-3">Biaya Pendaftaran</label>
                  <select
                    value={activeBiaya}
                    onChange={e => setActiveBiaya(e.target.value)}
                    className="w-full rounded-xl border border-outline-variant/60 bg-surface py-2.5 px-3 text-primary font-medium shadow-sm focus:border-secondary focus:ring-secondary focus:bg-white transition-colors cursor-pointer outline-none"
                  >
                    <option value="Semua">Semua Biaya</option>
                    <option value="Gratis">Gratis</option>
                    <option value="Berbayar">Berbayar</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-1.5 text-sm font-bold text-primary hover:text-secondary transition-all bg-white hover:bg-surface border border-outline-variant/60 px-6 py-4 rounded-2xl shrink-0 shadow-sm w-full sm:w-auto h-[56px]">
                <ArrowLeft className="h-5 w-5 shrink-0" /> Kembali
              </Link>
              <div className="relative flex-1 w-full">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant/70" />
                <input
                  type="text"
                  placeholder="Cari nama lomba atau penyelenggara..."
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 rounded-2xl border border-outline-variant/60 shadow-sm focus:border-secondary focus:ring-secondary text-primary font-medium bg-white transition-colors outline-none h-[56px]"
                />
              </div>
              <button
                type="submit"
                className="bg-primary hover:opacity-90 active:scale-95 text-on-primary px-8 py-4 rounded-2xl font-label-lg transition-all shadow-md w-full sm:w-auto h-[56px] flex items-center justify-center"
              >
                Cari
              </button>
            </form>

            {/* Grid Lomba */}
            {loading ? (
              <div className="flex justify-center items-center py-24 bg-white rounded-[2rem] border border-outline-variant/60 shadow-sm">
                <Loader2 className="h-10 w-10 animate-spin text-secondary" />
              </div>
            ) : lombaList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2rem] border border-outline-variant/60 shadow-sm px-6 text-center">
                <img src="/images/logo-ambachamp.png" alt="AMBAChamp" className="h-16 w-auto object-contain opacity-20 grayscale mb-4" />
                <h3 className="font-display text-headline-sm text-primary">Lomba tidak ditemukan</h3>
                <p className="font-sans text-body-sm text-on-surface-variant mt-2 max-w-sm">
                  Tidak ada kompetisi aktif yang sesuai dengan filter atau kata kunci pencarian Anda. Coba ubah pencarian Anda.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-6 px-5 py-2.5 bg-surface-container text-secondary font-semibold rounded-xl hover:bg-surface-container-high/60 transition-colors"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div>
                <p className="font-sans text-body-sm text-on-surface-variant mb-4">{lombaList.length} lomba ditemukan</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {lombaList.map(lomba => (
                    <LombaCard
                      key={lomba.id}
                      lomba={lomba}
                      inWishlist={wishlistIds.includes(lomba.id)}
                      onWishlistChange={fetchWishlist}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
