// daftar kategori lomba, dipakai di filter mahasiswa & form penyelenggara
// biar konsisten satu sumber

export const KATEGORI = [
  {
    value: 'teknologi_digital',
    label: 'Teknologi & Digital',
    cakupan: 'Coding, Software Development, Data Science, Cyber Security, AI',
  },
  {
    value: 'sains_riset',
    label: 'Sains & Riset',
    cakupan: 'Paper Competition (KTI), Inovasi Teknologi, Olimpiade Sains',
  },
  {
    value: 'olahraga',
    label: 'Olahraga',
    cakupan: 'Semua cabang olahraga',
  },
  {
    value: 'seni_kreatif',
    label: 'Seni & Kreatif',
    cakupan: 'Desain Grafis, Fotografi, Videografi, Penulisan Kreatif',
  },
];

// buat nampilin label dari value yang tersimpan di db
export const kategoriLabel = (value) => {
  const found = KATEGORI.find((k) => k.value === value);
  return found ? found.label : value;
};
