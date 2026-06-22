import { Calendar, Users, MapPin, ArrowRight, Bookmark } from "lucide-react";
import Link from "next/link"; // Menggunakan Link Next.js

const competitions = [
  {
    title: "Nasional UI/UX Hackathon 2024",
    organizer: "Kementerian Komunikasi dan Informatika",
    date: "15 - 20 Agustus 2024",
    location: "Online",
    category: "Design",
    image: "https://images.unsplash.com/photo-1638029202288-451a89e0d55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWNrYXRob24lMjBjb2RpbmclMjBldmVudHxlbnwxfHx8fDE3ODIwODQ0NTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    status: "Pendaftaran Dibuka",
    statusColor: "bg-emerald-100 text-emerald-700",
    tagColor: "bg-blue-100 text-blue-700",
    participants: "120 tim mendaftar",
    fee: "Gratis",
  },
  {
    title: "Olimpiade Sains Mahasiswa Tingkat Nasional",
    organizer: "Universitas Indonesia",
    date: "10 September 2024",
    location: "Jakarta, Indonesia",
    category: "Olimpiade",
    image: "https://images.unsplash.com/photo-1760574735049-4ecb7b90f724?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwb2x5bXBpYWQlMjBzdHVkZW50c3xlbnwxfHx8fDE3ODIwODQ0NTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    status: "Pendaftaran Dibuka",
    statusColor: "bg-emerald-100 text-emerald-700",
    tagColor: "bg-purple-100 text-purple-700",
    participants: "85 peserta mendaftar",
    fee: "Rp 50.000",
  },
  {
    title: "Global Business Plan Competition",
    organizer: "Tech Startup Academy",
    date: "5 - 7 Oktober 2024",
    location: "Bandung, Indonesia",
    category: "Business",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbXBldGl0aW9uJTIwcHJlc2VudGF0aW9ufGVufDF8fHx8MTc4MjA4NDQ1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    status: "Segera Hadir",
    statusColor: "bg-amber-100 text-amber-700",
    tagColor: "bg-orange-100 text-orange-700",
    participants: "Menunggu pembukaan",
    fee: "Rp 100.000",
  }
];

// Menggunakan export default
export default function RecommendedLomba() {
  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <span className="text-indigo-600 font-semibold tracking-wider uppercase text-sm mb-2 block">Pilihan Terbaik</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">Rekomendasi Lomba</h2>
          <p className="text-slate-600 text-lg">Kompetisi bergengsi pilihan kami yang paling sesuai dengan tren saat ini. Jangan lewatkan kesempatanmu!</p>
        </div>
        {/* Mengganti NavLink menjadi Link dan to menjadi href */}
        <Link href="/explore" className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shrink-0 shadow-md hover:shadow-lg">
          Lihat Semua Lomba <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {competitions.map((comp, i) => (
          <div key={i} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 group flex flex-col">
            <div className="relative h-56 overflow-hidden">
              {/* Mengganti ImageWithFallback menjadi tag img biasa */}
              <img src={comp.image} alt={comp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${comp.statusColor}`}>
                  {comp.status}
                </span>
              </div>
              <button className="absolute top-4 right-4 h-10 w-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white transition-colors shadow-sm">
                <Bookmark className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-3">
                <span className={`px-3 py-1 rounded-md text-xs font-bold ${comp.tagColor}`}>
                  {comp.category}
                </span>
                <span className="text-indigo-700 font-bold text-sm bg-indigo-50 px-2 py-1 rounded-md">
                  {comp.fee}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                {comp.title}
              </h3>
              <p className="text-slate-500 text-sm mb-5 font-medium">
                Oleh {comp.organizer}
              </p>
              
              <div className="space-y-3 mb-6 mt-auto">
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>{comp.date}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>{comp.location}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                  <Users className="h-4 w-4 text-slate-400" />
                  <span>{comp.participants}</span>
                </div>
              </div>
              
              {/* Mengganti NavLink menjadi Link dan to menjadi href */}
              <Link href={`/explore`} className="block w-full text-center py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                Detail Lomba
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}