// ============================================================
// speciesService.ts — "Pelayan data" untuk spesies ikan
// ============================================================
//
// Analogi sederhana:
// Bayangkan kamu di perpustakaan. Kamu minta tolong pustakawan:
//   - "Carikan buku tentang 'lencam'" → pustakawan cari di judul,
//     penulis, kategori, dan bahkan julukan buku.
//   - "Kasih tahu julukan buku nomor 5" → pustakawan lihat daftar.
//
// File ini adalah "pustakawan" untuk data ikan kita.
//   - cariSpesies(kata) = cari ikan berdasarkan kata kunci
//   - ambilNamaLokal(speciesId) = ambil semua nama lokal satu ikan
//
// Data dibaca dari file JSON (species.json dan localNames.json).
// Nanti kalau sudah ada backend/API, tinggal ganti sumber datanya
// di file ini saja — halaman lain tidak perlu berubah.
// ============================================================

import speciesData from '../data/species.json';
import localNamesData from '../data/localNames.json';
import { Species } from '../models/Species';
import { LocalName } from '../models/LocalName';

// "as Species[]" artinya: "percaya, data JSON ini bentuknya
// sesuai interface Species". Ini diperlukan karena TypeScript
// tidak bisa otomatis tahu bentuk data di file JSON.
const semuaSpesies = speciesData as Species[];
const semuaNamaLokal = localNamesData as LocalName[];

/**
 * Cari spesies berdasarkan kata kunci.
 *
 * Kata kunci dicocokkan ke: namaIlmiah, namaUmum, family,
 * genus, DAN nama lokal (dari localNames.json).
 * Tidak peduli huruf besar/kecil (case-insensitive).
 *
 * Kalau kata kosong (""), kembalikan SEMUA spesies.
 *
 * Contoh:
 *   cariSpesies("lencam")  → [Lethrinus lentjan]
 *   cariSpesies("labridae") → [Choerodon anchorago]
 *   cariSpesies("")         → semua 5 spesies
 */
export function cariSpesies(kata: string): Species[] {
  // Kalau kata kosong, kembalikan semua
  if (!kata || kata.trim() === '') {
    return semuaSpesies;
  }

  // Ubah ke huruf kecil supaya pencarian tidak peduli besar/kecil
  const kataKecil = kata.toLowerCase().trim();

  return semuaSpesies.filter((s) => {
    // Cek di field-field Species
    if (s.namaIlmiah.toLowerCase().includes(kataKecil)) return true;
    if (s.namaUmum.toLowerCase().includes(kataKecil)) return true;
    if (s.family.toLowerCase().includes(kataKecil)) return true;
    if (s.genus.toLowerCase().includes(kataKecil)) return true;

    // Cek di nama-nama lokal yang terhubung ke spesies ini
    const namaLokalIkan = semuaNamaLokal.filter(
      (nl) => nl.speciesId === s.id
    );
    return namaLokalIkan.some(
      (nl) => nl.nama.toLowerCase().includes(kataKecil)
    );
  });
}

/**
 * Ambil semua nama lokal untuk satu spesies.
 *
 * Contoh:
 *   ambilNamaLokal(5) → [{nama: "Ketambak"}, {nama: "Lencam"}]
 */
export function ambilNamaLokal(speciesId: number): LocalName[] {
  return semuaNamaLokal.filter((nl) => nl.speciesId === speciesId);
}
