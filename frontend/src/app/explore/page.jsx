'use client';

import { useState, useEffect } from "react";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Search, Filter, Bookmark, ShieldCheck, MapPin, Tag } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

// Helper untuk format Rupiah
const formatFee = (fee) => {
  if (fee === 0 || !fee) return 'Gratis';
  return `Rp ${fee.toLocaleString('id-ID')}`;
};

export default function ExplorePage() {
  const [lombaList, setLombaList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk input pencarian (sebelum ditekan tombol Cari)
  const [searchInput, setSearchInput] = useState("");

  // State utama untuk semua filter yang akan dikirim ke API
  const [filters, setFilters] = useState({
    keyword: "",
    kategori: "Semua",
    tingkat: "Semua",
    biaya: "Semua Biaya"
  });

  // Fetch API setiap kali state 'filters' berubah
  useEffect(() => {
    const fetchLomba = async () => {
      setLoading(true);
      try {
        // Siapkan parameter query untuk dikirim ke backend
        const params = {};
        
        if (filters.keyword) params.keyword = filters.keyword;
        
        if (filters.kategori !== "Semua") {
          // Ubah "Teknologi Digital" menjadi "teknologi_digital" sesuai ENUM database
          params.kategori = filters.kategori.toLowerCase().replace(' ', '_');
        }
        
        if (filters.tingkat !== "Semua") {
          params.tingkat = filters.tingkat.toLowerCase();
        }
        
        if (filters.biaya === "Gratis") {
          params.gratis = '1';
        }

        const response = await api.get('/lomba', { params });
        setLombaList(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data lomba:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLomba();
  }, [filters]);

  // Fungsi untuk menangani klik tombol Cari
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Mencegah reload halaman
    setFilters(prev => ({ ...prev, keyword: searchInput }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10">
        
        {/* Header Halaman */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Eksplorasi Lomba</h1>
          <p className="text-slate-600 mt-2 text-lg">Temukan kompetisi yang tepat untuk mengasah potensimu dan bangun portofolio terbaikmu.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-slate-900">
                <Filter className="h-5 w-5" />
                <h2 className="font-bold text-lg">Filter Pencarian</h2>
              </div>
              
              <div className="space-y-6">
                {/* Filter Kategori */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-3">Kategori</label>
                  <div className="space-y-3">
                    {["Semua", "Teknologi Digital", "Sains Riset", "Olahraga", "Seni Kreatif"].map(cat => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="kategori"
                          value={cat}
                          checked={filters.kategori === cat}
                          onChange={(e) => setFilters(prev => ({ ...prev, kategori: e.target.value }))}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-600 transition-colors" 
                        />
                        <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filter Tingkat */}
                <div className="pt-6 border-t border-slate-100">
                  <label className="block text-sm font-bold text-slate-800 mb-3">Tingkat Wilayah</label>
                  <div className="space-y-3">
                    {["Semua", "Internasional", "Nasional", "Kampus"].map(level => (
                      <label key={level} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="tingkat"
                          value={level}
                          checked={filters.tingkat === level}
                          onChange={(e) => setFilters(prev => ({ ...prev, tingkat: e.target.value }))}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-600 transition-colors" 
                        />
                        <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filter Biaya */}
                <div className="pt-6 border-t border-slate-100">
                  <label className="block text-sm font-bold text-slate-800 mb-3">Biaya Pendaftaran</label>
                  <select 
                    value={filters.biaya}
                    onChange={(e) => setFilters(prev => ({ ...prev, biaya: e.target.value }))}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 px-3 text-slate-700 font-medium shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:bg-white transition-colors cursor-pointer outline-none"
                  >
                    <option value="Semua Biaya">Semua Biaya</option>
                    <option value="Gratis">Gratis Saja</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content (Pencarian & Daftar Lomba) */}
          <div className="flex-1 space-y-8">
            
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="text" 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Cari judul lomba atau deskripsi..." 
                  className="w-full pl-14 pr-4 py-4 rounded-2xl border border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-slate-900 font-medium bg-white transition-colors outline-none"
                />
              </div>
              <button type="submit" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95 w-full sm:w-auto">
                Cari
              </button>
            </form>

            {/* Area Grid Lomba */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : lombaList.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Lomba Tidak Ditemukan</h3>
                <p className="text-slate-500">Coba gunakan kata kunci lain atau ubah filter pencarian di samping.</p>
                <button 
                  onClick={() => {
                    setSearchInput('');
                    setFilters({ keyword: '', kategori: 'Semua', tingkat: 'Semua', biaya: 'Semua Biaya' });
                  }}
                  className="mt-6 text-indigo-600 font-bold hover:underline"
                >
                  Reset Semua Filter
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {lombaList.map(comp => (
                  <Link href={`/explore/${comp.id}`} key={comp.id} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col block">
                    <div className="h-52 overflow-hidden relative bg-slate-100">
                      <img 
                        src={comp.poster || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800"} 
                        alt={comp.judul} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-white/95 backdrop-blur text-indigo-700 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm uppercase">
                          {comp.kategori.replace('_', ' ')}
                        </span>
                        {/* Karena query mengambil where status='verified', otomatis semua ini verified */}
                        <span className="bg-emerald-500/95 backdrop-blur text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                          <ShieldCheck className="h-3.5 w-3.5" /> Verified
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-bold text-xl text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">{comp.judul}</h3>
                      <p className="text-slate-500 text-sm font-medium mb-5">{comp.nama_penyelenggara}</p>
                      
                      <div className="space-y-2.5 mb-6 flex-1">
                        <div className="flex items-center gap-2.5 text-sm font-medium text-slate-600 bg-slate-50 w-fit px-3 py-1.5 rounded-lg capitalize">
                          <MapPin className="h-4 w-4 text-indigo-500" /> {comp.tingkat}
                        </div>
                        <div className="flex items-center gap-2.5 text-sm font-medium text-slate-600 bg-slate-50 w-fit px-3 py-1.5 rounded-lg">
                          <Tag className="h-4 w-4 text-indigo-500" /> {formatFee(comp.biaya_pendaftaran)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-100">
                        <div className="text-sm font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg">
                          Batas: {new Date(comp.deadline_pendaftaran).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <button 
                          onClick={(e) => e.preventDefault()} // Mencegah pindah halaman saat tombol bookmark diklik
                          className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors relative" 
                          title="Simpan Lomba"
                        >
                          <Bookmark className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}