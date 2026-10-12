import React, { useState } from 'react';
import { isAxiosError } from 'axios';
import { MainLayout } from '../layout/MainLayout';
import { submitFishName } from '../services/fish';
import './FishSubmissionVisual.css';

const FishSubmissionPage: React.FC = () => {
  const [submittedName, setSubmittedName] = useState('');
  const [locationNote, setLocationNote] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setPhoto(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!submittedName.trim() || !locationNote.trim() || !photo) {
      setError('Nama lokal, lokasi penemuan, dan foto ikan wajib diisi.');
      return;
    }

    const formData = new FormData();
    formData.append('submittedName', submittedName.trim());
    formData.append('locationNote', locationNote.trim());
    formData.append('photoFilePath', photo);

    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      await submitFishName(formData);
      setSubmittedName('');
      setLocationNote('');
      setPhoto(null);
      setPhotoPreview(null);
      const fileInput = document.getElementById('fish-submission-photo') as HTMLInputElement | null;
      if (fileInput) fileInput.value = '';
      setSuccessMessage('Usulan nama ikan berhasil dikirim ke kurator kami. Terima kasih atas partisipasi Anda dalam melestarikan etno-ikhtiologi Kepri!');
    } catch (requestError: unknown) {
      if (isAxiosError<{ error?: string; message?: string }>(requestError)) {
        const responseMessage = requestError.response?.data?.error || requestError.response?.data?.message;
        setError(
          responseMessage ||
          (requestError.response
            ? `Gagal mengirim usulan (HTTP ${requestError.response.status}).`
            : `${requestError.message}. Periksa koneksi ke server.`)
        );
      } else {
        setError('Gagal mengirim usulan nama ikan.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      {/* Header Banner */}
      <section className="relative pt-32 pb-20 px-6 sm:px-12 bg-gradient-to-b from-[#021426] via-[#052649] to-[#0A3258] text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
          style={{ backgroundImage: "url('/assets/hero-ocean.jpg')" }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          <span className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium tracking-wider text-sky-200">
            CITIZEN SCIENCE & ETNO-IKHTIOLOGI
          </span>
          <h1 className="font-marhey text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide drop-shadow-md">
            Usulkan Nama Lokal Ikan
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Menemukan sebutan atau ikan khas di pulau Anda? Bagikan nama lokal, lokasi, serta fotonya untuk ditinjau dan diverifikasi oleh kurator ahli.
          </p>
        </div>
      </section>

      {/* Form Container */}
      <section className="py-16 px-6 sm:px-12 bg-slate-50 min-h-[60vh]">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Tahapan pengajuan usulan">
            {[
              ['1', 'Isi nama lokal'],
              ['2', 'Tambahkan lokasi'],
              ['3', 'Unggah foto'],
            ].map(([step, label]) => (
              <div key={step} className="flex items-center gap-3 rounded-2xl border border-sky-100 bg-white/80 px-4 py-3 shadow-sm">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">{step}</span>
                <span className="text-xs font-semibold text-slate-600">{label}</span>
              </div>
            ))}
          </div>
          {/* Success Notification Alert */}
          {successMessage && (
            <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-4 shadow-sm animate-fade-in">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-emerald-900 text-base mb-1">Berhasil Dikirim!</h4>
                <p className="text-emerald-700 text-sm leading-relaxed">{successMessage}</p>
                <button
                  type="button"
                  onClick={() => setSuccessMessage('')}
                  className="mt-3 text-xs font-semibold text-emerald-800 underline hover:text-emerald-950"
                >
                  Tutup Notifikasi
                </button>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="fish-submission-form space-y-6">
              {/* Field 1: Nama Lokal */}
              <div>
                <label htmlFor="submittedName" className="block text-sm font-semibold text-slate-800 mb-2">
                  Nama Sebutan Lokal Ikan <span className="text-rose-500">*</span>
                </label>
                <input
                  id="submittedName"
                  type="text"
                  value={submittedName}
                  onChange={(e) => setSubmittedName(e.target.value)}
                  placeholder="Contoh: Ikan Todak, Ikan Mengkaruk, Ikan Ketambak..."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all placeholder:text-slate-400 bg-slate-50/50 hover:bg-slate-50"
                  aria-describedby="submitted-name-help"
                />
                <p id="submitted-name-help" className="text-xs text-slate-500 mt-1.5">
                  Tuliskan nama ikan sebagaimana biasa disebut oleh masyarakat di daerah Anda.
                </p>
              </div>

              {/* Field 2: Lokasi Ditemukan */}
              <div>
                <label htmlFor="locationNote" className="block text-sm font-semibold text-slate-800 mb-2">
                  Lokasi / Pulau Ditemukan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="locationNote"
                  rows={3}
                  value={locationNote}
                  onChange={(e) => setLocationNote(e.target.value)}
                  placeholder="Contoh: Perairan Desa Cemaga, Natuna / Sekitar Pulau Bintan..."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all placeholder:text-slate-400 bg-slate-50/50 hover:bg-slate-50"
                  aria-describedby="location-note-help"
                />
                <p id="location-note-help" className="text-xs text-slate-500 mt-1.5">
                  Sebutkan nama pulau, desa nelayan, atau perairan tempat ikan tersebut ditemukan/ditangkap.
                </p>
              </div>

              {/* Field 3: Upload Foto */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Foto Dokumentasi Ikan <span className="text-rose-500">*</span>
                </label>

                {photoPreview ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-sky-200 bg-slate-50 p-2">
                    <img
                      src={photoPreview}
                      alt="Pratinjau foto usulan"
                      className="w-full h-56 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhoto(null);
                        setPhotoPreview(null);
                        const fileInput = document.getElementById('fish-submission-photo') as HTMLInputElement | null;
                        if (fileInput) fileInput.value = '';
                      }}
                      className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-colors"
                      title="Hapus foto"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <p className="text-center text-xs text-slate-500 mt-2 font-medium">
                      {photo?.name} ({Math.round((photo?.size || 0) / 1024)} KB)
                    </p>
                  </div>
                ) : (
                  <label
                    htmlFor="fish-submission-photo"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-sky-500 hover:bg-sky-50/30 rounded-2xl p-8 cursor-pointer transition-all group"
                  >
                    <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-sky-600">
                      Klik untuk mengunggah foto ikan
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      Format PNG, JPG, atau WebP (Maksimal 5MB)
                    </span>
                    <input
                      id="fish-submission-photo"
                      name="photoFilePath"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center gap-2.5">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-sky-600 hover:bg-sky-700 active:bg-sky-800 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:opacity-50 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 text-base cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Mengirimkan Usulan...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirimkan Usulan Ikan</span>
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default FishSubmissionPage;
