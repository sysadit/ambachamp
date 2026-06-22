import { Trophy, Users, Building2, CheckCircle2 } from "lucide-react";

const stats = [
  {
    icon: <Users className="w-6 h-6 text-indigo-600" />,
    value: "10K+",
    label: "Mahasiswa Aktif",
  },
  {
    icon: <Trophy className="w-6 h-6 text-yellow-500" />,
    value: "500+",
    label: "Lomba Tersedia",
  },
  {
    icon: <Building2 className="w-6 h-6 text-emerald-500" />,
    value: "150+",
    label: "Mitra Kampus",
  },
  {
    icon: <CheckCircle2 className="w-6 h-6 text-blue-500" />,
    value: "2000+",
    label: "Tim Terbentuk",
  },
];

// Mengubah menjadi export default
export default function Stats() {
  return (
    <div className="relative z-20 -mt-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center px-4 first:border-0 border-l border-slate-100 md:border-l">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                {stat.icon}
              </div>
              <h4 className="text-3xl font-extrabold text-slate-900 mb-1">{stat.value}</h4>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}