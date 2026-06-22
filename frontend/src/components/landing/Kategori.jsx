import { Monitor, Briefcase, Palette, FlaskConical, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    title: "Teknologi & IT",
    count: "150+ Lomba Aktif",
    icon: Monitor,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    title: "Bisnis & Manajemen",
    count: "120+ Lomba Aktif",
    icon: Briefcase,
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  {
    title: "Desain & Seni",
    count: "85+ Lomba Aktif",
    icon: Palette,
    color: "text-rose-600",
    bg: "bg-rose-100",
  },
  {
    title: "Sains & Inovasi",
    count: "90+ Lomba Aktif",
    icon: FlaskConical,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  }
];

export default function PopularCategories() {
  return (
    <section id="kategori">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <span className="text-indigo-600 font-semibold tracking-wider uppercase text-sm mb-2 block">Eksplorasi</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">Kategori Terpopuler</h2>
          <p className="text-slate-600 text-lg">Temukan lomba yang paling sesuai dengan passion dan keahlianmu. Ratusan kesempatan menunggu untuk ditaklukkan.</p>
        </div>
        <Link href="/explore" className="inline-flex items-center justify-center gap-2 bg-white border-2 border-indigo-100 text-indigo-700 px-6 py-3.5 rounded-xl font-bold hover:bg-indigo-50 hover:border-indigo-200 transition-all shrink-0 shadow-sm">
          Lihat Semua Kategori <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, i) => (
          <Link href="/explore" key={i} className="group relative bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden block">
            {/* Decorative background shape */}
            <div className={`absolute -right-8 -top-8 w-40 h-40 rounded-full ${cat.bg} opacity-20 group-hover:scale-150 transition-transform duration-700 ease-out`}></div>
            
            <div className="relative z-10 flex justify-between items-start mb-10">
              <div className={`h-16 w-16 rounded-2xl ${cat.bg} ${cat.color} flex items-center justify-center shadow-inner`}>
                <cat.icon className="h-8 w-8" />
              </div>
              <div className="bg-slate-50 p-2 rounded-full text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                 <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{cat.title}</h3>
              <p className="text-slate-500 font-medium text-lg">{cat.count}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}