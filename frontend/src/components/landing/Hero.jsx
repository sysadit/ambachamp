import Link from 'next/link';
import { Trophy, ChevronRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative rounded-3xl bg-indigo-600 overflow-hidden text-white shadow-2xl">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
      <div className="relative z-10 px-6 py-20 sm:py-32 lg:px-16 flex flex-col items-center text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/30 border border-indigo-400/30 backdrop-blur-sm mb-8">
          <Trophy className="h-4 w-4 text-yellow-300" />
          <span className="text-sm font-semibold text-indigo-50">Temukan panggung juaramu</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight max-w-4xl">
          Satu Platform Untuk <br className="hidden md:block"/> Segala Prestasimu.
        </h1>
        
        <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mb-10 leading-relaxed">
          AmbaChamp mempermudah kamu mencari lomba valid, menemukan rekan tim yang tepat, dan mengelola portofolio prestasimu dalam satu tempat.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/explore" className="inline-flex justify-center items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all hover:scale-105 shadow-lg">
            Cari Lomba Sekarang <ChevronRight className="h-5 w-5" />
          </Link>
          <Link href="/teammates" className="inline-flex justify-center items-center gap-2 bg-indigo-700 text-white border border-indigo-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-800 transition-all">
            Cari Tim
          </Link>
        </div>
        
      </div>
    </section>
  );
}