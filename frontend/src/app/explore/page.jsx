import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Search, Filter, Bookmark, ShieldCheck, MapPin, Tag } from "lucide-react";

const mockCompetitions = [
  { id: 1, title: "Nasional Hackathon 2026", org: "Kementerian Kominfo", category: "Teknologi", level: "Nasional", fee: "Gratis", date: "24 Okt 2026", verified: true, image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800" },
  { id: 2, title: "Business Plan Competition UGM", org: "BEM FEB UGM", category: "Bisnis", level: "Mahasiswa", fee: "Rp 50.000", date: "12 Nov 2026", verified: true, image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800" },
  { id: 3, title: "UI/UX Design UI Connect", org: "Fasilkom UI", category: "Desain", level: "Nasional", fee: "Rp 35.000", date: "5 Des 2026", verified: true, image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800" },
  { id: 4, title: "Debat Bahasa Inggris Internasional", org: "English Society", category: "Bahasa", level: "Internasional", fee: "Rp 150.000", date: "20 Des 2026", verified: false, image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800" },
];

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Navbar />

      {/* Main Container dengan batas lebar agar sejajar dengan Navbar & Hero */}
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
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-3">Kategori</label>
                  <div className="space-y-3">
                    {["Semua", "Teknologi", "Bisnis", "Desain", "Sains", "Bahasa"].map(cat => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 transition-colors" defaultChecked={cat === "Semua"} />
                        <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <label className="block text-sm font-bold text-slate-800 mb-3">Tingkat Wilayah</label>
                  <div className="space-y-3">
                    {["Internasional", "Nasional", "Provinsi", "Mahasiswa/Universitas"].map(level => (
                      <label key={level} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 transition-colors" />
                        <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <label className="block text-sm font-bold text-slate-800 mb-3">Biaya Pendaftaran</label>
                  <select className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 px-3 text-slate-700 font-medium shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:bg-white transition-colors cursor-pointer outline-none">
                    <option>Semua Biaya</option>
                    <option>Gratis</option>
                    <option>Berbayar</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content (Pencarian & Daftar Lomba) */}
          <div className="flex-1 space-y-8">
            
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cari nama lomba atau penyelenggara..." 
                  className="w-full pl-14 pr-4 py-4 rounded-2xl border border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-slate-900 font-medium bg-white transition-colors outline-none"
                />
              </div>
              <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95 w-full sm:w-auto">
                Cari
              </button>
            </div>

            {/* Grid Lomba */}
            <div className="grid md:grid-cols-2 gap-6">
              {mockCompetitions.map(comp => (
                <div key={comp.id} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
                  <div className="h-52 overflow-hidden relative">
                    <img src={comp.image} alt={comp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-white/95 backdrop-blur text-indigo-700 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm">
                        {comp.category}
                      </span>
                      {comp.verified && (
                        <span className="bg-emerald-500/95 backdrop-blur text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                          <ShieldCheck className="h-3.5 w-3.5" /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-xl text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">{comp.title}</h3>
                    <p className="text-slate-500 text-sm font-medium mb-5">{comp.org}</p>
                    
                    <div className="space-y-2.5 mb-6 flex-1">
                      <div className="flex items-center gap-2.5 text-sm font-medium text-slate-600 bg-slate-50 w-fit px-3 py-1.5 rounded-lg">
                        <MapPin className="h-4 w-4 text-indigo-500" /> {comp.level}
                      </div>
                      <div className="flex items-center gap-2.5 text-sm font-medium text-slate-600 bg-slate-50 w-fit px-3 py-1.5 rounded-lg">
                        <Tag className="h-4 w-4 text-indigo-500" /> {comp.fee}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-100">
                      <div className="text-sm font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg">
                        Batas: {comp.date}
                      </div>
                      <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors relative" title="Simpan Lomba">
                        <Bookmark className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}