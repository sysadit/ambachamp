import { Github, Linkedin, Instagram } from "lucide-react";

const teamMembers = [
  {
    name: "Rois Azzam Shiddiq",
    nim: "0110224156",
    role: "Project Manager",
    image: "/images/teams/Rois.jpeg",
    github: "https://github.com/Roisazzshid/",
    linkedin: "https://www.linkedin.com/in/rois-azzam-shiddiq-73a81735a?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    instagram: "https://www.instagram.com/issa.5_?igsh=MTg3b3d4d2M3MGwxYw=="
  },
  {
    name: "Sayed Muhammad Qadri",
    nim: "0110224190",
    role: "Scrum Master",
    image: "/images/teams/sayyid.jpeg",
    github: "https://github.com/Albouftaim",
    linkedin: "https://www.linkedin.com/in/sayed-muhammad-qadri-5b4193294/",
    instagram: "https://www.instagram.com/sayyid_albouftaim/"
  },
  {
    name: "Riza Alfira Nasution",
    nim: "0110224126",
    role: "Media & Creative",
    image: "/images/teams/riza.jpeg",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/in/riiza-alfiraa-78b45233b/",
    instagram: "https://www.instagram.com/riizanst?igsh=MWE4cG9lZHk4N3pxbQ=="
  },
  {
    name: "Muhamad Imadudin",
    nim: "0110224196",
    role: "Media & Creative",
    image: "/images/teams/ima.jpeg",
    github: "https://github.com/Imadudin6060",
    linkedin: "https://www.linkedin.com/in/muhamad-imadudin-73a93332b?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    instagram: "https://www.instagram.com/ima21_4?igsh=MTgydGowYTJtcjAxaA=="
  },
  {
    name: "Adit Hermansyah",
    nim: "0110224092",
    role: "Designer & Developer",
    image: "images/teams/Adit.jpeg",
    github: "https://github.com/sysadit",
    linkedin: "https://linkedin.com/Adit Hermansyah",
    instagram: "https://instagram.com/_syahadit"
  },
  {
    name: "Muhamad Bilal Fatiha",
    nim: "0110224182",
    role: "Designer & Developer",
    image: "images/teams/Bilal.jpeg",
    github: "https://github.com/Treesaken",
    linkedin: "https://linkedin.com/",
    instagram: "https://instagram.com/mhmdbilalfath"
  },
  {
    name: "Muhamad Aditia",
    nim: "0110224213",
    role: "Designer & Developer",
    image: "/images/teams/aditia.jpeg",
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
    <section className="py-xxl font-sans" id="tentang-kami">
      <div className="text-center max-w-3xl mx-auto mb-xl space-y-xs">
        <span className="text-secondary font-label-lg uppercase tracking-wider block">Tentang Kami</span>
        <h2 className="font-display text-headline-lg text-primary">Tim di Balik AmbaChamp</h2>
        <p className="text-on-surface-variant text-body-md">Berkenalan dengan talenta kreatif yang berdedikasi membangun platform terbaik untuk membantu mahasiswa meraih prestasi bersama.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {teamMembers.map((member, i) => (
          <div key={i} className="group bg-surface-container-lowest p-lg rounded-[24px] border border-outline-variant shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 text-center flex flex-col items-center">
            <div className="relative mb-md">
              <div className="absolute inset-0 bg-secondary rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform scale-110"></div>
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-32 h-32 rounded-full object-cover border-4 border-surface shadow-md relative z-10" 
              />
            </div>
            
            <h3 className="font-display text-headline-sm text-primary mb-1">{member.name}</h3>
            <p className="text-label-sm font-mono text-on-surface-variant bg-surface-container px-3 py-1 rounded-full mb-2">{member.nim}</p>
            <p className="text-secondary font-medium mb-md">{member.role}</p>
            
            <div className="flex gap-sm justify-center mt-auto opacity-80 group-hover:opacity-100 transition-opacity">
              <a href={member.github || "#"} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href={member.linkedin || "#"} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center hover:bg-secondary hover:text-on-secondary transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href={member.instagram || "#"} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center hover:bg-secondary hover:text-on-secondary transition-all">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}