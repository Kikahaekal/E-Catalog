import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import './SpeciesSearchVisual.css';

const SpeciesSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanQuery = searchTerm.trim();
    if (cleanQuery) {
      navigate(`/search/results?name=${encodeURIComponent(cleanQuery)}`);
    }
  };

  return (
    <MainLayout>
      {/* Header Banner */}
      <section className="fish-search-hero relative flex min-h-[100svh] items-center px-6 py-24 sm:px-12 bg-gradient-to-b from-[#021426] via-[#052649] to-[#0B3B66] text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: "url('/assets/hero-ocean.jpg')" }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium tracking-wider text-sky-200">
            FIshKP IKHTIOLOGI KEPULAUAN RIAU
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

        </div>
      </section>
    </MainLayout>
  );
};

export default SpeciesSearchPage;
