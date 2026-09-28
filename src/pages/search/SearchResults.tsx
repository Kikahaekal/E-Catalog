// ============================================================
// SearchResults.tsx — Halaman hasil pencarian ikan
// ============================================================
//
// Analogi sederhana:
// Bayangkan kamu ketik kata di Google, lalu muncul daftar hasil.
// Halaman ini melakukan hal yang sama untuk ikan:
//
//   1. Baca kata pencarian dari URL (bagian ?q=...)
//      Contoh: /search?q=selaya → kata = "selaya"
//
//   2. Minta "pustakawan" (speciesService) carikan ikan
//      yang cocok dengan kata tersebut.
//
//   3. Tampilkan hasilnya sebagai daftar kartu ikan.
//      Kalau tidak ada yang cocok, tampilkan pesan.
//
// Halaman ini dibungkus MainLayout supaya punya header dan
// footer yang sama dengan halaman Home.
// ============================================================

import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '../../layout/MainLayout';
import { cariSpesies } from '../../services/speciesService';
import SpeciesCard from '../../components/species/SpeciesCard';
import './SearchResults.css';

const SearchResults: React.FC = () => {
  // useSearchParams = alat dari React Router untuk membaca
  // bagian ?q=... di URL. Seperti membaca label di amplop surat.
  const [searchParams] = useSearchParams();
  const kata = searchParams.get('q') || '';

  // Minta pustakawan carikan ikan yang cocok
  const hasil = cariSpesies(kata);

  return (
    <MainLayout>
      {/* Header: judul berbeda tergantung ada kata pencarian atau tidak */}
      {kata ? (
        <div className="search-header">
          <h2>Hasil pencarian: &ldquo;{kata}&rdquo;</h2>
          <p className="search-count">{hasil.length} spesies ditemukan</p>
        </div>
      ) : (
        <div className="search-header">
          <h2>Semua Spesies</h2>
          <p className="search-count">{hasil.length} spesies tersedia</p>
        </div>
      )}

      {/* Daftar kartu ikan, atau pesan kalau tidak ditemukan */}
      {hasil.length > 0 ? (
        hasil.map((s) => <SpeciesCard key={s.id} species={s} />)
      ) : (
        <div className="tidak-ditemukan">
          <h2>🐟 Ikan tidak ditemukan</h2>
          <p>Coba kata kunci lain, misalnya nama lokal atau nama ilmiah.</p>
        </div>
      )}
    </MainLayout>
  );
};

export default SearchResults;
