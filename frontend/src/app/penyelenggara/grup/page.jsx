'use client';
// src/app/penyelenggara/grup/page.jsx — CRUD grup tim penyelenggara

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { teammateAPI, lombaAPI } from '@/lib/api';
import {
  Loader2, Users, FolderKanban, Plus, Edit, Trash2, X,
  ChevronDown, ChevronUp, Mail, Phone, MessageCircle, Info, BookOpen
} from 'lucide-react';

export default function GrupPesertaPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [grup, setGrup] = useState([]);
  const [lombaList, setLombaList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form States (Add)
  const [newLombaId, setNewLombaId] = useState('');
  const [newJudul, setNewJudul] = useState('');
  const [newDeskripsi, setNewDeskripsi] = useState('');
  const [newPosisi, setNewPosisi] = useState(['']);
  const [newMaxAnggota, setNewMaxAnggota] = useState(3);
  const [newLinkTelegram, setNewLinkTelegram] = useState('');

  // Form States (Edit)
  const [editId, setEditId] = useState('');
  const [editJudul, setEditJudul] = useState('');
  const [editDeskripsi, setEditDeskripsi] = useState('');
  const [editPosisi, setEditPosisi] = useState(['']);
  const [editMaxAnggota, setEditMaxAnggota] = useState(3);
  const [editStatus, setEditStatus] = useState('open');
  const [editLinkTelegram, setEditLinkTelegram] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'penyelenggara')) router.push('/auth/login');
  }, [user, authLoading]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [grupRes, lombaRes] = await Promise.all([
        teammateAPI.getGrupPenyelenggara().catch(() => ({ data: { data: [] } })),
        lombaAPI.getMyLomba().catch(() => ({ data: { data: [] } })),
      ]);
      setGrup(grupRes.data.data || []);
      setLombaList(lombaRes.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'penyelenggara') {
      loadData();
    }
  }, [user]);

  if (authLoading || !user) return null;

  // Kelompokkan per lomba (bawa metadata lomba)
  const perLomba = grup.reduce((acc, g) => {
    const key = g.lomba_id;
    if (!acc[key]) {
      acc[key] = {
        lomba_id: g.lomba_id,
        judul_lomba: g.judul_lomba,
        deskripsi_lomba: g.deskripsi_lomba,
        kategori_lomba: g.kategori_lomba,
        list: [],
      };
    }
    acc[key].list.push(g);
    return acc;
  }, {});

  // Add Posisi Handlers (Add Form)
  const setNewPos = (i, v) => { const a = [...newPosisi]; a[i] = v; setNewPosisi(a); };
  const addNewPos = () => setNewPosisi([...newPosisi, '']);
  const delNewPos = (i) => { if (newPosisi.length > 1) setNewPosisi(newPosisi.filter((_, x) => x !== i)); };

  // Edit Posisi Handlers (Edit Form)
  const setEditPos = (i, v) => { const a = [...editPosisi]; a[i] = v; setEditPosisi(a); };
  const addEditPos = () => setEditPosisi([...editPosisi, '']);
  const delEditPos = (i) => { if (editPosisi.length > 1) setEditPosisi(editPosisi.filter((_, x) => x !== i)); };

  // CREATE team handler
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    const pos = newPosisi.map(p => p.trim()).filter(Boolean);
    if (!newLombaId) return alert('Pilih lomba terlebih dahulu.');
    if (!newJudul.trim()) return alert('Nama tim wajib diisi.');
    if (!newDeskripsi.trim()) return alert('Deskripsi tim wajib diisi.');
    if (!newLinkTelegram.trim()) return alert('Link grup Telegram wajib diisi.');
    if (pos.length === 0) return alert('Isi minimal satu posisi.');

    setSaving(true);
    try {
      await teammateAPI.createPost({
        lomba_id: Number(newLombaId),
        judul: newJudul,
        deskripsi: newDeskripsi,
        jumlah_anggota_max: Number(newMaxAnggota),
        posisi_dibutuhkan: pos,
        link_telegram: newLinkTelegram,
      });
      setShowAddModal(false);
      // Reset form
      setNewLombaId('');
      setNewJudul('');
      setNewDeskripsi('');
      setNewPosisi(['']);
      setNewMaxAnggota(3);
      setNewLinkTelegram('');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal membuat tim.');
    } finally {
      setSaving(false);
    }
  };

  // OPEN Edit Modal
  const openEditModal = (team) => {
    setEditId(team.id);
    setEditJudul(team.judul);
    setEditDeskripsi(team.deskripsi);
    setEditMaxAnggota(team.shadow_max || team.jumlah_anggota_max);
    setEditStatus(team.status);
    setEditLinkTelegram(team.link_telegram || '');
    let parsedPos = [''];
    try {
      parsedPos = JSON.parse(team.posisi_dibutuhkan || '[]');
      if (parsedPos.length === 0) parsedPos = [''];
    } catch {
      parsedPos = [team.posisi_dibutuhkan || ''];
    }
    setEditPosisi(parsedPos);
    setShowEditModal(true);
  };

  // UPDATE team handler
  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    const pos = editPosisi.map(p => p.trim()).filter(Boolean);
    if (!editJudul.trim()) return alert('Nama tim wajib diisi.');
    if (!editDeskripsi.trim()) return alert('Deskripsi tim wajib diisi.');
    if (!editLinkTelegram.trim()) return alert('Link grup Telegram wajib diisi.');
    if (pos.length === 0) return alert('Isi minimal satu posisi.');

    setSaving(true);
    try {
      await teammateAPI.updatePost(editId, {
        judul: editJudul,
        deskripsi: editDeskripsi,
        jumlah_anggota_max: Number(editMaxAnggota),
        posisi_dibutuhkan: pos,
        status: editStatus,
        link_telegram: editLinkTelegram,
      });
      setShowEditModal(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal memperbarui tim.');
    } finally {
      setSaving(false);
    }
  };

  // DELETE team handler
  const handleDeleteTeam = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus tim ini? Semua lamaran anggota di dalamnya akan terhapus.')) return;
    try {
      await teammateAPI.deletePost(id);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus tim.');
    }
  };

  return (
    <DashboardLayout title="Grup Tim Peserta">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <p className="text-sm text-slate-500">Kelola tim, kuota anggota, posisi, dan status pendaftaran tim di lomba yang kamu selenggarakan.</p>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl shrink-0"
        >
          <Plus className="h-4.5 w-4.5" /> Tambah Tim Baru
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-brand-400" /></div>
      ) : grup.length === 0 ? (
        <div className="card p-12 text-center">
          <FolderKanban className="h-12 w-12 text-slate-200 mx-auto mb-3" />
          <p className="font-semibold text-slate-500 mb-1">Belum ada tim terbentuk</p>
          <p className="text-sm text-slate-400 mb-4">Tim akan muncul saat mahasiswa mendaftar atau Anda membuat tim baru.</p>
          <button onClick={() => setShowAddModal(true)} className="btn-secondary text-xs px-4 py-2 font-bold">
            Buat Tim Pertama
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.values(perLomba).map(({ lomba_id, judul_lomba, deskripsi_lomba, kategori_lomba, list }) => (
            <div key={lomba_id} className="space-y-4">
              {/* Header Lomba */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-brand-500" />
                  <h3 className="font-extrabold text-slate-800 text-lg">{judul_lomba}</h3>
                  <span className="text-xs text-slate-400 font-normal">({list.length} tim)</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">
                  <BookOpen className="h-3.5 w-3.5" />
                  Kategori: {kategori_lomba?.replace('_', ' ')}
                </div>
                {deskripsi_lomba && (
                  <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed">
                    <strong>Deskripsi Kompetisi:</strong> {deskripsi_lomba}
                  </p>
                )}
              </div>

              {/* Grid Tim */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {list.map(g => (
                  <TeamCard
                    key={g.id}
                    team={g}
                    onEdit={() => openEditModal(g)}
                    onDelete={() => handleDeleteTeam(g.id)}
                    onReload={loadData}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ADD MODAL ──────────────────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-lg">Buat Tim Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTeam} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Pilih Lomba</label>
                <select
                  required
                  value={newLombaId}
                  onChange={(e) => setNewLombaId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3 text-slate-700 text-sm outline-none focus:border-brand-500"
                >
                  <option value="">Pilih Lomba</option>
                  {lombaList.map(l => (
                    <option key={l.id} value={l.id}>{l.judul}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Nama Tim</label>
                <input
                  required
                  type="text"
                  placeholder="Misal: Tim Pegasus"
                  value={newJudul}
                  onChange={(e) => setNewJudul(e.target.value)}
                  className="input-base text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Deskripsi Tim</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Deskripsikan fokus tim atau proyek yang dikerjakan..."
                  value={newDeskripsi}
                  onChange={(e) => setNewDeskripsi(e.target.value)}
                  className="input-base text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Link Telegram Grup</label>
                <input
                  required
                  type="text"
                  placeholder="https://t.me/..."
                  value={newLinkTelegram}
                  onChange={(e) => setNewLinkTelegram(e.target.value)}
                  className="input-base text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Posisi yang Dibutuhkan</label>
                <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                  {newPosisi.map((p, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        required
                        type="text"
                        placeholder="Misal: UI Designer / Backend Dev"
                        value={p}
                        onChange={(e) => setNewPos(idx, e.target.value)}
                        className="input-base text-xs flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => delNewPos(idx)}
                        className="p-2 border border-slate-200 text-slate-400 hover:text-red-500 rounded-xl"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addNewPos}
                  className="mt-2 text-xs text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Tambah Posisi
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Maks Anggota</label>
                  <input
                    required
                    type="number"
                    min="1"
                    max="10"
                    value={newMaxAnggota}
                    onChange={(e) => setNewMaxAnggota(e.target.value)}
                    className="input-base text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan Tim'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary px-5 py-3 text-sm"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ─────────────────────────────────────────────────────── */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-lg">Edit Detail Tim</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateTeam} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Nama Tim</label>
                <input
                  required
                  type="text"
                  value={editJudul}
                  onChange={(e) => setEditJudul(e.target.value)}
                  className="input-base text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Deskripsi Tim</label>
                <textarea
                  required
                  rows={3}
                  value={editDeskripsi}
                  onChange={(e) => setEditDeskripsi(e.target.value)}
                  className="input-base text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Link Telegram Grup</label>
                <input
                  required
                  type="text"
                  value={editLinkTelegram}
                  onChange={(e) => setEditLinkTelegram(e.target.value)}
                  className="input-base text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Posisi yang Dibutuhkan</label>
                <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                  {editPosisi.map((p, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        required
                        type="text"
                        value={p}
                        onChange={(e) => setEditPos(idx, e.target.value)}
                        className="input-base text-xs flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => delEditPos(idx)}
                        className="p-2 border border-slate-200 text-slate-400 hover:text-red-500 rounded-xl"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addEditPos}
                  className="mt-2 text-xs text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Tambah Posisi
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Maks Anggota</label>
                  <input
                    required
                    type="number"
                    min="1"
                    max="10"
                    value={editMaxAnggota}
                    onChange={(e) => setEditMaxAnggota(e.target.value)}
                    className="input-base text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Status Pendaftaran</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3 text-slate-700 text-sm outline-none focus:border-brand-500"
                  >
                    <option value="open">Terbuka (Open)</option>
                    <option value="closed">Ditutup (Closed)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Perbarui Tim'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary px-5 py-3 text-sm"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

// ─── TEAM CARD COMPONENT WITH INTEGRATED APPLICATION MANAGEMENT ──────────────
function TeamCard({ team, onEdit, onDelete, onReload }) {
  const [open, setOpen] = useState(false);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);

  let posisiList = [];
  try {
    posisiList = JSON.parse(team.posisi_dibutuhkan || '[]');
  } catch {
    posisiList = [];
  }

  const loadApplicants = () => {
    setLoading(true);
    teammateAPI.getPostById(team.id)
      .then(r => setApps(r.data.data?.applications || []))
      .catch(() => setApps([]))
      .finally(() => setLoading(false));
  };

  const toggle = () => {
    const nextState = !open;
    setOpen(nextState);
    if (nextState) {
      loadApplicants();
    }
  };

  const handleDecision = async (appId, status) => {
    setBusyId(appId);
    try {
      const body = { status };
      await teammateAPI.updateApplication(appId, body);
      loadApplicants();
      onReload?.();
    } catch (e) {
      alert(e.response?.data?.message || 'Gagal memperbarui status pendaftaran.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden hover:shadow-sm hover:border-slate-300 transition">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h4 className="font-extrabold text-slate-800 text-base">{team.judul}</h4>
          <span className={team.status === 'open' ? 'badge-green' : 'badge-gray'}>
            {team.status === 'open' ? 'Terbuka' : 'Ditutup'}
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-3 leading-relaxed">{team.deskripsi}</p>
        
        {team.link_telegram && (
          <div className="mb-3 text-xs bg-slate-50 border border-slate-100 p-2.5 rounded-2xl flex items-center gap-2 max-w-full overflow-hidden">
            <MessageCircle className="h-4 w-4 text-emerald-500 shrink-0" />
            <span className="text-slate-500 font-medium shrink-0">Link Telegram:</span>
            <a href={team.link_telegram} target="_blank" rel="noopener noreferrer" className="text-brand-600 font-semibold hover:underline truncate">
              {team.link_telegram}
            </a>
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap text-2xs text-slate-500 mb-3">
          <span>Posisi:</span>
          {posisiList.map((p, i) => (
            <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">{p}</span>
          ))}
        </div>

        <div className="flex items-center justify-between text-2xs text-slate-500 pt-3 border-t border-slate-50">
          <div className="flex items-center gap-3">
            <span>Ketua: <span className="font-bold text-slate-700">{team.nama_pembuat}</span></span>
            <span className="flex items-center gap-1 font-semibold text-brand-600">
              <Users className="h-3 w-3" />
              {team.jumlah_anggota}/{team.jumlah_anggota_max}
            </span>
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={onEdit}
              className="p-2 border border-slate-200 hover:border-brand-500 hover:text-brand-600 text-slate-400 rounded-xl transition"
              title="Edit Tim"
            >
              <Edit className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 border border-slate-200 hover:border-red-500 hover:text-red-600 text-slate-400 rounded-xl transition"
              title="Hapus Tim"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={toggle}
              className="px-3 text-2xs font-extrabold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition flex items-center gap-1"
            >
              {open ? 'Tutup' : 'Pelamar'} {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="bg-slate-50/50 border-t border-slate-100 p-4 space-y-3">
          <h5 className="text-2xs font-bold text-slate-500 uppercase tracking-wider">
            Pengajuan Anggota Tim
          </h5>

          {loading ? (
            <div className="flex justify-center py-4"><Loader2 className="h-4 w-4 animate-spin text-brand-400" /></div>
          ) : apps.length === 0 ? (
            <p className="text-2xs text-slate-400 text-center py-2">Belum ada mahasiswa yang melamar.</p>
          ) : (
            <div className="space-y-2">
              {apps.map(ap => (
                <div key={ap.id} className="p-3 bg-white border border-slate-100 rounded-2xl flex flex-col gap-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="bg-purple-100 text-purple-700 text-3xs font-bold px-1.5 py-0.5 rounded-md">
                        {ap.posisi}
                      </span>
                      <p className="text-xs font-bold text-slate-800 mt-1">{ap.nama_pelamar}</p>
                      <p className="text-3xs text-slate-400">NIM: {ap.nim} · {ap.jurusan}</p>
                      {ap.pesan && <p className="text-3xs text-slate-500 italic mt-1 bg-slate-50 p-2 rounded-md border border-slate-100">"{ap.pesan}"</p>}
                    </div>

                    <div className="shrink-0 flex items-center gap-1">
                      {ap.status !== 'pending' ? (
                        <span className={ap.status === 'diterima' ? 'badge-green text-3xs' : 'badge-red text-3xs'}>
                          {ap.status === 'diterima' ? 'Diterima' : 'Ditolak'}
                        </span>
                      ) : (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleDecision(ap.id, 'ditolak')}
                            disabled={busyId === ap.id}
                            className="bg-red-50 hover:bg-red-100 text-red-600 px-2.5 py-1 rounded-lg text-3xs font-bold transition border border-red-200"
                          >
                            Tolak
                          </button>
                          <button
                            onClick={() => handleDecision(ap.id, 'diterima')}
                            disabled={busyId === ap.id}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-3xs font-bold transition shadow-xs"
                          >
                            Terima
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Kontak info pelamar */}
                  <div className="flex items-center gap-3 text-3xs text-slate-400 pt-1 flex-wrap border-t border-slate-50">
                    {ap.email && <span className="flex items-center gap-0.5"><Mail className="h-2.5 w-2.5" /> {ap.email}</span>}
                    {ap.phone && <span className="flex items-center gap-0.5"><Phone className="h-2.5 w-2.5" /> {ap.phone}</span>}
                    {ap.whatsapp && (
                      <a href={`https://wa.me/${ap.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-0.5 text-emerald-600 hover:underline">
                        <MessageCircle className="h-2.5 w-2.5" /> WA: {ap.whatsapp}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
