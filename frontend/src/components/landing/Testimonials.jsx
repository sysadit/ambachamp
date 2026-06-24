import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Budi Santoso",
    role: "Juara 1 UI/UX Design Hackathon",
    image: "https://images.unsplash.com/photo-1544168190-79c17527004f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbGUlMjBzdHVkZW50JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzgyMDgzNzg3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    quote: "Berkat AmbaChamp, saya bisa menemukan rekan setim yang sefrekuensi dan akhirnya memenangkan hackathon nasional pertama saya. Fitur Teammate Finder-nya juara!",
    stars: 5,
  },
  {
    name: "Siti Nurhaliza",
    role: "Finalis Business Plan Competition",
    image: "https://images.unsplash.com/photo-1513097633097-329a3a64e0d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZlbWFsZSUyMHN0dWRlbnQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3ODIwODM3ODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    quote: "Sistem notifikasi deadline lombanya sangat membantu. Saya tidak pernah lagi kelewatan masa pendaftaran. Tampilannya juga bersih dan mudah digunakan.",
    stars: 5,
  },
  {
    name: "Andi Wijaya",
    role: "Pemenang Medali Emas Olimpiade Sains",
    image: "https://images.unsplash.com/photo-1611459293885-f8e692ab0356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGFzaWFuJTIwbWFuJTIwZ2xhc3NlcyUyMHBvcnRyYWl0fGVufDF8fHx8MTc4MjA4Mzc4N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    quote: "Informasi lomba di sini selalu up-to-date dan terverifikasi admin. Tidak khawatir lagi ikut lomba abal-abal karena semuanya sudah tersaring dengan baik.",
    stars: 5,
  }
];

// 1. Mengubah menjadi export default
export default function Testimonials() {
  return (
    <section className="py-xxl bg-surface-container-low font-sans rounded-3xl overflow-hidden px-gutter relative transition-all my-xxl">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 opacity-10">
        <span className="material-symbols-outlined text-[300px] leading-none">format_quote</span>
      </div>
      <div className="text-center max-w-3xl mx-auto mb-xl relative space-y-xs">
        <span className="text-secondary font-label-lg uppercase tracking-wider block">Testimoni</span>
        <h2 className="font-display text-headline-lg text-primary">Apa Kata Para Juara?</h2>
        <p className="text-on-surface-variant text-body-md">Kisah sukses dari mereka yang berhasil melampaui batas dan membangun karir melalui AMBAChamp.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-md relative z-10">
        {testimonials.map((testi, i) => (
          <div key={i} className="bg-surface-container-lowest p-lg rounded-[24px] border border-outline-variant shadow-sm flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <p className="text-body-md italic text-on-surface-variant mb-xl leading-relaxed">
              "{testi.quote}"
            </p>
            <div className="flex items-center gap-md pt-md border-t border-outline-variant">
              <img 
                src={testi.image} 
                alt={testi.name} 
                className="w-12 h-12 rounded-full object-cover shadow-sm bg-surface-variant" 
              />
              <div>
                <h4 className="font-display text-label-lg text-primary">{testi.name}</h4>
                <p className="text-label-sm text-on-surface-variant">{testi.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}