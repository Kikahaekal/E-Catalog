import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { getAllSpecies, Species } from '../services/species';

const SpeciesSearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const nameParam = searchParams.get('name')?.trim() || '';
  const [searchInput, setSearchInput] = useState(nameParam);
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setSearchInput(nameParam);
    if (!nameParam) {
      setSpecies([]);
      setLoading(false);
      setError('');
      return;
    }

    let active = true;
    setLoading(true);
    setError('');

    getAllSpecies(nameParam)
      .then((response) => {
        if (active) setSpecies(response.data || []);
      })
      .catch((requestError: any) => {
        if (active) {
          setError(requestError.response?.data?.error || 'Gagal memuat hasil pencarian.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [nameParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ name: searchInput.trim() });
    }
  };

  return (
    <MainLayout>
      {/* Header Banner */}
      <section className="relative pt-28 pb-12 px-6 sm:px-12 bg-gradient-to-b from-[#021426] via-[#052649] to-[#0A3258] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <Link to="/search" className="inline-flex items-center gap-1.5 text-sky-300 hover:text-white text-xs sm:text-sm font-medium mb-2 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Kembali ke Pencarian</span>
              </Link>
              <h1 className="font-marhey text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide">
                Hasil Pencarian
              </h1>
              {nameParam && (
                <p className="text-white/80 text-sm sm:text-base mt-1">
                  Menampilkan hasil untuk: <span className="font-semibold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">"{nameParam}"</span>
                </p>
              )}
            </div>

            {/* Quick Search Form */}
            <form onSubmit={handleSearchSubmit} className="w-full md:w-auto">
              <div className="relative flex items-center bg-white/15 border border-white/30 rounded-full pl-4 pr-1.5 py-1.5 backdrop-blur-md focus-within:ring-2 focus-within:ring-sky-400">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Cari kata kunci lain..."
                  className="bg-transparent text-white placeholder-white/60 text-sm focus:outline-none w-48 sm:w-64"
                />
                <button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors"
                >
                  Cari
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Main Results Container */}
      <section className="py-12 px-6 sm:px-12 bg-slate-50 min-h-[60vh]">
        <div className="max-w-6xl mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4" />
              <p className="text-base font-medium">Memuat data spesies ikan...</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3">
              <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Empty Query State */}
          {!loading && !error && !nameParam && (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-1">Ketik kata kunci untuk memulai pencarian</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                Anda dapat mencari berdasarkan nama ilmiah, nama lokal Kepri, atau daerah sebaran.
              </p>
            </div>
          )}

          {/* Not Found State */}
          {!loading && !error && nameParam && species.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-slate-800 mb-2">Spesies Tidak Ditemukan</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Belum ada data spesies yang cocok dengan kata kunci <strong>"{nameParam}"</strong>.
                Apakah Anda menemukan ikan ini di perairan Kepri? Anda dapat mengusulkannya kepada kurator kami!
              </p>
              <Link
                to="/tambah-ikan"
                className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-medium px-6 py-2.5 rounded-full text-sm shadow-md transition-colors"
              >
                <span>Usulkan Nama Ikan Ini</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          )}

          {/* Results Grid / Table */}
          {!loading && !error && species.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Ditemukan <strong>{species.length}</strong> spesies</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {species.map((item) => {
                  const localNamesList = item.localNames
                    ?.map((ln: any) => ln.name || ln.submittedName || (typeof ln.localName === 'string' ? ln.localName : ln.localName?.name))
                    .filter(Boolean) || [];

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-sky-300 transition-all flex flex-col group"
                    >
                      {/* Photo Thumbnail */}
                      <div className="h-44 bg-slate-100 relative overflow-hidden">
                        {item.photos && item.photos.length > 0 && item.photos[0]?.filePath ? (
                          <img
                            src={
                              item.photos[0].filePath.startsWith('http')
                                ? item.photos[0].filePath
                                : `http://localhost:3000${item.photos[0].filePath}`
                            }
                            alt={item.commonName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              // Fallback image if file not found
                              (e.target as HTMLImageElement).src = '/assets/school-fish.jpg';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                            <svg className="w-10 h-10 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs">Foto belum tersedia</span>
                          </div>
                        )}
                        {item.iucnStatus && (
                          <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/20">
                            {item.iucnStatus.code || item.iucnStatus.name}
                          </span>
                        )}
                      </div>

                      {/* Content Details */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 group-hover:text-sky-600 transition-colors">
                            {item.commonName}
                          </h3>
                          <p className="text-xs text-slate-500 italic font-serif">
                            {item.scientificName}
                          </p>

                          {/* Local Names Badges */}
                          <div className="mt-3">
                            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                              Sebutan Lokal:
                            </span>
                            {localNamesList.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {localNamesList.map((ln, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-block bg-sky-50 text-sky-700 text-xs px-2.5 py-0.5 rounded-md font-medium border border-sky-100"
                                  >
                                    {ln}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 italic">—</span>
                            )}
                          </div>
                        </div>

                        {/* View Details Action */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs text-slate-400">
                            {item.family ? `Famili: ${item.family}` : ''}
                          </span>
                          <Link
                            to={`/species/${item.id}?name=${encodeURIComponent(nameParam)}`}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 hover:text-sky-800 transition-colors"
                          >
                            <span>Lihat Detail</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default SpeciesSearchResultsPage;
