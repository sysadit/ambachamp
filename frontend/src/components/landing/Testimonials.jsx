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
    <section className="py-10">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-indigo-600 font-semibold tracking-wider uppercase text-sm mb-2 block">Testimoni</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Cerita Sukses Para Juara</h2>
        <p className="text-slate-600 text-lg">Ribuan mahasiswa telah menemukan peluang emas mereka di AmbaChamp. Kini giliranmu untuk bersinar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testi, i) => (
          <div key={i} className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 transition-transform duration-300 relative flex flex-col h-full">
            
            {/* Quote Icon Background */}
            <div className="absolute top-8 right-8 text-slate-100">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.017 21L16.417 14.591C17.067 12.836 17.653 11.238 18.176 9.797H14.521V3H24V9.894C24 13.972 22.84 17.674 20.52 21H14.017ZM3.517 21L5.917 14.591C6.567 12.836 7.153 11.238 7.676 9.797H4.021V3H13.5V9.894C13.5 13.972 12.34 17.674 10.02 21H3.517Z" />
              </svg>
            </div>
            
            <div className="flex gap-1 mb-8">
              {[...Array(testi.stars)].map((_, idx) => (
                <Star key={idx} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            
            <p className="text-slate-700 text-lg leading-relaxed mb-10 relative z-10 flex-grow">
              "{testi.quote}"
            </p>
            
            <div className="flex items-center gap-4 mt-auto border-t border-slate-100 pt-6">
              {/* 2. Mengganti ImageWithFallback dengan tag <img> standar */}
              <img 
                src={testi.image} 
                alt={testi.name} 
                className="w-14 h-14 rounded-full object-cover shadow-sm" 
              />
              <div>
                <h4 className="font-bold text-slate-900">{testi.name}</h4>
                <p className="text-sm text-slate-500 font-medium">{testi.role}</p>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </section>
  );
}