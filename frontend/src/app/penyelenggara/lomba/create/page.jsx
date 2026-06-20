'use client';
// src/app/penyelenggara/lomba/create/page.jsx

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { lombaAPI } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { Loader2, AlertCircle, CheckCircle, Upload } from 'lucide-react';

export default function CreateLombaPage() {
  const { user } = useAuth();
  const router   = useRouter();
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== '') fd.append(k, v); });
      if (data.poster?.[0]) fd.append('poster', data.poster[0]);

      await lombaAPI.create(fd);
      setSuccess(true);
      setTimeout(() => router.push('/penyelenggara/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal upload lomba. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <DashboardLayout title="Upload Lomba">
      <div className="card p-10 text-center max-w-md mx-auto">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
        <h3 className="font-semibold text-slate-800 mb-1">Lomba Berhasil Diunggah!</h3>
        <p className="text-sm text-slate-500">Lomba sedang menunggu verifikasi admin. Kamu akan diredirect ke dashboard...</p>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title="Upload Lomba Baru">
      <div className="max-w-2xl">
        <div className="card p-6 mb-4 bg-amber-50 border-amber-200">
          <p className="text-sm text-amber-800">
            ℹ️ Lomba yang kamu unggah akan melalui proses verifikasi admin sebelum tampil di platform.
            Pastikan semua informasi akurat dan dapat dipertanggungjawabkan.
          </p>
        </div>

        <div className="card p-6">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-5 border border-red-200">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />{error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Judul Lomba *</label>
              <input type="text" placeholder="Nama resmi lomba/kompetisi"
                className={`input-base ${errors.judul ? 'border-red-400' : ''}`}
                {...register('judul', { required: 'Judul wajib diisi.' })} />
              {errors.judul && <p className="text-red-500 text-xs mt-1">{errors.judul.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Deskripsi Lomba *</label>
              <textarea rows={4} placeholder="Jelaskan detail lomba, syarat, dan ketentuan..."
                className={`input-base resize-none ${errors.deskripsi ? 'border-red-400' : ''}`}
                {...register('deskripsi', { required: 'Deskripsi wajib diisi.' })} />
              {errors.deskripsi && <p className="text-red-500 text-xs mt-1">{errors.deskripsi.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Kategori *</label>
                <select className={`input-base ${errors.kategori ? 'border-red-400' : ''}`}
                  {...register('kategori', { required: 'Kategori wajib dipilih.' })}>
                  <option value="">Pilih kategori</option>
                  <option value="teknologi_digital">Teknologi & Digital</option>
                  <option value="sains_riset">Sains & Riset</option>
                  <option value="olahraga">Olahraga</option>
                  <option value="seni_kreatif">Seni & Kreatif</option>
                </select>
                {errors.kategori && <p className="text-red-500 text-xs mt-1">{errors.kategori.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tingkat *</label>
                <select className={`input-base ${errors.tingkat ? 'border-red-400' : ''}`}
                  {...register('tingkat', { required: 'Tingkat wajib dipilih.' })}>
                  <option value="">Pilih tingkat</option>
                  <option value="kampus">Kampus</option>
                  <option value="nasional">Nasional</option>
                  <option value="internasional">Internasional</option>
                </select>
                {errors.tingkat && <p className="text-red-500 text-xs mt-1">{errors.tingkat.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Deadline Pendaftaran *</label>
                <input type="date" className={`input-base ${errors.deadline_pendaftaran ? 'border-red-400' : ''}`}
                  {...register('deadline_pendaftaran', { required: 'Deadline wajib diisi.' })} />
                {errors.deadline_pendaftaran && <p className="text-red-500 text-xs mt-1">{errors.deadline_pendaftaran.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tanggal Pelaksanaan</label>
                <input type="date" className="input-base" {...register('tanggal_pelaksanaan')} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Biaya Pendaftaran (Rp)</label>
                <input type="number" min="0" placeholder="0 = Gratis"
                  className="input-base" {...register('biaya_pendaftaran')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Link Pendaftaran</label>
                <input type="url" placeholder="https://..."
                  className="input-base" {...register('link_pendaftaran')} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Link Media Sosial / Poster</label>
                <input type="url" placeholder="https://instagram.com/..."
                  className="input-base" {...register('link_sosmed')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Contact Person</label>
                <input type="text" placeholder="Nama - 08xxxxxxxxxx"
                  className="input-base" {...register('contact_person')} />
              </div>
            </div>

            {/* Upload poster */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Poster Lomba (opsional)</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-brand-400 transition">
                {preview ? (
                  <img src={preview} alt="Preview" className="h-40 object-contain mx-auto rounded-lg mb-2" />
                ) : (
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                )}
                <input type="file" accept="image/*" className="hidden" id="poster-upload"
                  {...register('poster')} onChange={onFileChange} />
                <label htmlFor="poster-upload"
                  className="cursor-pointer text-sm text-brand-600 font-medium hover:text-brand-700">
                  {preview ? 'Ganti Poster' : 'Upload Poster'} (JPG/PNG, maks 5MB)
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center py-3">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Mengupload...</> : 'Upload Lomba'}
              </button>
              <button type="button" onClick={() => router.back()} className="btn-secondary px-6">Batal</button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
