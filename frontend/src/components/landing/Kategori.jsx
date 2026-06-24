import { Monitor, Briefcase, Palette, FlaskConical, ArrowRight } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    title: "Teknologi & IT",
    count: "150+ Lomba Aktif",
    icon: Monitor,
    bg: "bg-surface-container",
    textCls: "text-secondary",
  },
  {
    title: "Bisnis & Manajemen",
    count: "120+ Lomba Aktif",
    icon: Briefcase,
    bg: "bg-surface-container",
    textCls: "text-primary",
  },
  {
    title: "Desain & Seni",
    count: "85+ Lomba Aktif",
    icon: Palette,
    bg: "bg-surface-container",
    textCls: "text-secondary",
  },
  {
    title: "Sains & Inovasi",
    count: "90+ Lomba Aktif",
    icon: FlaskConical,
    bg: "bg-surface-container",
    textCls: "text-primary",
  }
];

export default function PopularCategories() {
  return (
    <section id="kategori" className="font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-xl">
        <div className="max-w-2xl space-y-xs">
          <span className="text-secondary font-label-lg uppercase tracking-wider block">Kategori</span>
          <h2 className="font-display text-headline-lg text-primary">Kategori Terpopuler</h2>
          <p className="text-on-surface-variant text-body-md">Temukan lomba yang paling sesuai dengan passion dan keahlianmu. Ratusan kesempatan menunggu untuk ditaklukkan.</p>
        </div>
        <Link 
          href="/explore" 
          className="inline-flex items-center justify-center gap-2 border border-outline-variant bg-surface text-primary px-xl py-3.5 rounded-xl font-label-lg hover:bg-surface-container-low transition-all shrink-0"
        >
          Lihat Semua Kategori <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {categories.map((cat, i) => (
          <Link 
            href="/explore" 
            key={i} 
            className="group flex flex-col justify-between bg-surface-container-lowest p-lg rounded-[24px] border border-outline-variant shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden block"
          >
            <div className="flex justify-between items-start mb-xl">
              <div className={`h-14 w-14 rounded-xl ${cat.bg} ${cat.textCls} flex items-center justify-center`}>
                <cat.icon className="h-7 w-7" />
              </div>
              <div className="bg-surface-container p-2 rounded-full text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">arrow_outward</span>
              </div>
            </div>

            <div>
              <h3 className="font-display text-headline-sm text-primary mb-xs">{cat.title}</h3>
              <p className="text-body-sm text-on-surface-variant font-medium">{cat.count}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}