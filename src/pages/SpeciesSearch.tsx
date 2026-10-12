import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import './SpeciesSearchVisual.css';

const SpeciesSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const quickTags = [
    'Ikan Kerapu',
    'Kakap Merah',
    'Ikan Tongkol',
    'Bawal Bintang',
    'Tenggiri',
    'Natuna',
    'Anambas',
  ];

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanQuery = searchTerm.trim();
    if (cleanQuery) {
      navigate(`/search/results?name=${encodeURIComponent(cleanQuery)}`);
    }
  };

  const handleTagClick = (tag: string) => {
    navigate(`/search/results?name=${encodeURIComponent(tag)}`);
  };

  return (
    <MainLayout>
      {/* Header Banner */}
      <section className="fish-search-hero relative pt-32 pb-20 px-6 sm:px-12 bg-gradient-to-b from-[#021426] via-[#052649] to-[#0B3B66] text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: "url('/assets/hero-ocean.jpg')" }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium tracking-wider text-sky-200">
            E-CATALOG IKHTIOLOGI KEPULAUAN RIAU
          </span>

          <h1 className="font-marhey text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide drop-shadow-md">
            Pencarian Spesies Ikan
          </h1>

          <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Temukan ragam ikan perairan Kepulauan Riau melalui nama lokal dialek daerah, nama umum, maupun klasifikasi ilmiah taksonomi.
          </p>

          {/* Search Box Capsule */}
          <form onSubmit={handleSearch} className="max-w-full mx-auto pt-4">
            <div className="fish-search-field relative flex items-center shadow-2xl rounded-full bg-white p-2 border border-white/30 focus-within:ring-4 focus-within:ring-sky-400/40 transition-all">
              <div className="pl-4 pr-2 text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ketik nama ikan lokal, nama latin, atau pulau..."
                className="w-full  bg-transparent text-slate-800 placeholder-slate-400 text-sm sm:text-base px-2 py-2 focus:outline-none"
                autoFocus
                aria-label="Cari spesies ikan"
              />

              <button
                type="submit"
                disabled={!searchTerm.trim()}
                className="fish-search-submit bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-full transition-colors flex items-center gap-1.5 shadow-sm text-sm sm:text-base shrink-0"
              >
                <span>Cari</span>
              </button>
            </div>
          </form>

          {/* Quick Suggestions */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
            <span className="text-white/60">Pencarian Populer:</span>
            {quickTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className="fish-search-tag px-3 py-1 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white/90 hover:text-white transition-all backdrop-blur-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Discovery Highlights */}
      <section className="fish-search-discovery py-16 px-6 sm:px-12 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-marhey text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Jelajahi Berdasarkan Kategori
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Akses informasi terstruktur keanekaragaman hayati bahari Kepri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="fish-search-card cursor-pointer bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-sky-300 hover:shadow-xl transition-all group text-left focus-within:ring-2 focus-within:ring-sky-500 focus-within:ring-offset-2">
              <button type="button" className="fish-search-card-action" aria-label="Cari ikan karang dan demersal" onClick={() => handleTagClick('Kerapu')} />
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-sky-600 transition-colors">
                Ikan Karang & Demersal
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Spesies terumbu karang bernilai ekonomis tinggi seperti Kerapu, Kakap, dan Baronang di perairan Kepri.
              </p>
            </div>

            <div className="fish-search-card cursor-pointer bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-sky-300 hover:shadow-xl transition-all group text-left focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2">
              <button type="button" className="fish-search-card-action" aria-label="Cari ikan pelagis" onClick={() => handleTagClick('Tongkol')} />
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-teal-600 transition-colors">
                Ikan Pelagis Besar & Kecil
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Ikan perenang cepat zona lepas pantai seperti Tongkol, Tenggiri, Layang, dan Selar di Laut Natuna.
              </p>
            </div>

            <div className="fish-search-card cursor-pointer bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-rose-300 hover:shadow-xl transition-all group text-left focus-within:ring-2 focus-within:ring-rose-500 focus-within:ring-offset-2">
              <button type="button" className="fish-search-card-action" aria-label="Cari spesies terancam" onClick={() => handleTagClick('Terancam')} />
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-rose-600 transition-colors">
                Spesies Dilindungi & Terancam
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Daftar biota laut berstatus konservasi rentan (Vulnerable) hingga terancam punah menurut IUCN & CITES.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default SpeciesSearchPage;
