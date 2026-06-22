'use client';

import { useState, useEffect } from "react";
import { Calendar, ArrowRight, Bookmark } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

const formatFee = (fee) => {
  if (fee === 0 || !fee) return 'Gratis';
  return `Rp ${fee.toLocaleString('id-ID')}`;
};

const getTagColor = (category) => {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('teknologi')) return 'bg-blue-100 text-blue-700';
  if (cat.includes('sains')) return 'bg-purple-100 text-purple-700';
  if (cat.includes('olahraga')) return 'bg-orange-100 text-orange-700';
  if (cat.includes('seni')) return 'bg-rose-100 text-rose-700';
  return 'bg-indigo-100 text-indigo-700'; 
};

export default function RecommendedLomba() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await api.get('/lomba?limit=3'); 
        setCompetitions(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data lomba:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <span className="text-indigo-600 font-semibold tracking-wider uppercase text-sm mb-2 block">Pilihan Terbaik</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">Rekomendasi Lomba</h2>
          <p className="text-slate-600 text-lg">Kompetisi bergengsi pilihan kami yang paling sesuai dengan tren saat ini. Jangan lewatkan kesempatanmu!</p>
        </div>
        <Link href="/explore" className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shrink-0 shadow-md hover:shadow-lg">
          Lihat Semua Lomba <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      {/* Menampilkan animasi loading saat menarik data */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : competitions.length === 0 ? (
        <div className="text-center text-slate-500 py-12 bg-slate-50 rounded-3xl border border-slate-100">
          Belum ada lomba yang terverifikasi saat ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {competitions.map((comp) => (
            <div key={comp.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 group flex flex-col">
              <div className="relative h-56 overflow-hidden bg-slate-100">
                {/* Fallback image jika poster dari database kosong/null */}
                <img 
                  src={comp.poster || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1080"} 
                  alt={comp.judul} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700 uppercase">
                    {comp.tingkat}
                  </span>
                </div>
                <button className="absolute top-4 right-4 h-10 w-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white transition-colors shadow-sm">
                  <Bookmark className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-3 py-1 rounded-md text-xs font-bold ${getTagColor(comp.kategori)} uppercase`}>
                    {/* Mengganti underscore dengan spasi (teknologi_digital -> teknologi digital) */}
                    {comp.kategori.replace('_', ' ')}
                  </span>
                  <span className="text-indigo-700 font-bold text-sm bg-indigo-50 px-2 py-1 rounded-md">
                    {formatFee(comp.biaya_pendaftaran)}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {comp.judul}
                </h3>
                <p className="text-slate-500 text-sm mb-5 font-medium">
                  Oleh {comp.nama_penyelenggara}
                </p>
                
                <div className="space-y-3 mb-6 mt-auto">
                  <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>Daftar s.d. {new Date(comp.deadline_pendaftaran).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric'})}</span>
                  </div>
                </div>
                
                <Link href={`/explore/${comp.id}`} className="block w-full text-center py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                  Detail Lomba
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}