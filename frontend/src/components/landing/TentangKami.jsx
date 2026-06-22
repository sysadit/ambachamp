import { Github, Linkedin, Instagram } from "lucide-react";

const teamMembers = [
  {
    name: "Rois Azzam Shiddiq",
    nim: "0110224156",
    role: "Project Manager",
    image: "https://images.unsplash.com/photo-1544168190-79c17527004f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbGUlMjBkZXZlbG9wZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3ODIxMzkyOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    instagram: "https://instagram.com/"
  },
  {
    name: "Sayed Muhammad Qadri",
    nim: "0110224190",
    role: "Scrum Master",
    image: "https://images.unsplash.com/photo-1616325629936-99a9013c29c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZlbWFsZSUyMGRlc2lnbmVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzgyMTM5MjkyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    instagram: "https://instagram.com/"
  },
  {
    name: "Riza Alfira Nasution",
    nim: "0110224126",
    role: "Media & Creative",
    image: "https://images.unsplash.com/photo-1634402153378-16bd852cd046?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGFzaWFuJTIwbWFuJTIwc21pbGluZyUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc4MjEzOTI5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    instagram: "https://instagram.com/"
  },
  {
    name: "Muhamad Imadudin",
    nim: "0110224196",
    role: "Media & Creative",
    image: "https://images.unsplash.com/photo-1573496800808-56566a492b63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZlbWFsZSUyMHN0dWRlbnQlMjBnbGFzc2VzJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzgyMTM5MjkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    instagram: "https://instagram.com/"
  },
  {
    name: "Adit Hermansyah",
    nim: "0110224092",
    role: "Designer & Developer",
    image: "https://images.unsplash.com/photo-1681097561932-36d0df02b379?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbGUlMjBjcmVhdGl2ZSUyMHBvcnRyYWl0JTIwYXNpYW58ZW58MXx8fHwxNzgyMTM5MjkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    instagram: "https://instagram.com/"
  },
  {
    name: "Muhamad Bilal Fatiha",
    nim: "0110224182",
    role: "Designer & Developer",
    image: "https://images.unsplash.com/photo-1758600587683-d86675a2f6e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGFzaWFuJTIwd29tYW4lMjBiZWF1dGlmdWwlMjBzbWlsZSUyMHBvcnRyYWl0fGVufDF8fHx8MTc4MjEzOTI5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    instagram: "https://instagram.com/"
  },
  {
    name: "Muhamad Aditia",
    nim: "0110224213",
    role: "Designer & Developer",
    image: "https://images.unsplash.com/photo-1758600432264-b8d2a0fd7d83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMGhlYWRzaG90JTIwc3R1ZGlvfGVufDF8fHx8MTc4MjEzOTMwOHww&ixlib=rb-4.1.0&q=80&w=1080",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    instagram: "https://instagram.com/"
  },
  {
    name: "Achmad Raihan",
    nim: "0110224132",
    role: "Designer & Developer",
    image: "https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwd29tYW4lMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3ODIxMzkyOTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    instagram: "https://instagram.com/"
  }
];

export default function TentangKami() {
  return (
    <section className="py-10" id="tentang-kami">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-indigo-600 font-semibold tracking-wider uppercase text-sm mb-2 block">Tentang Kami</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Tim di Balik AmbaChamp</h2>
        <p className="text-slate-600 text-lg">Berkenalan dengan talenta kreatif yang berdedikasi membangun platform terbaik untuk membantu mahasiswa meraih prestasi bersama.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member, i) => (
          <div key={i} className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 text-center flex flex-col items-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-indigo-600 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300 transform scale-110"></div>
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md relative z-10" 
              />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
            {/* NIM ditambahkan di sini dengan desain badge/teks kecil agar rapi */}
            <p className="text-sm font-mono text-slate-500 bg-slate-50 px-3 py-1 rounded-full mb-3">{member.nim}</p>
            <p className="text-indigo-600 font-medium mb-4">{member.role}</p>
            
            <div className="flex gap-3 justify-center mt-auto opacity-70 group-hover:opacity-100 transition-opacity">
              <a href={member.github || "#"} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href={member.linkedin || "#"} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href={member.instagram || "#"} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-pink-50 hover:text-pink-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}