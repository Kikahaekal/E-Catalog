// ============================================================
// LocalName.ts — Tipe data untuk satu nama lokal ikan
// ============================================================
//
// Analogi sederhana:
// Kalau Species itu KTP ikan, maka LocalName itu "julukan"
// yang diberikan masyarakat setempat untuk ikan tersebut.
//
// Kenapa dipisah dari Species?
// Bayangkan kamu punya teman bernama "Budi" (nama asli = Species).
// Di kampung A, Budi dipanggil "Bud".
// Di kampung B, Budi dipanggil "Budi Ganteng".
// Di kampung C, ada orang lain yang juga dipanggil "Bud".
//
// Artinya:
//   - Satu Species bisa punya BANYAK LocalName (Budi → "Bud", "Budi Ganteng")
//   - Satu nama lokal bisa merujuk ke LEBIH DARI SATU Species
//     ("Bud" → Budi, orang lain)
//
// Dalam dunia ikan Kepri:
//   - Ikan "Lethrinus lentjan" dipanggil "Ketambak" di satu daerah
//     dan "Ponggu" di daerah lain.
//   - Nama "Tokak" mungkin dipakai untuk beberapa jenis ikan berbeda
//     di pulau yang berbeda.
//
// Makanya kita pakai "speciesId" untuk menghubungkan nama lokal
// ke Species yang tepat, seperti tag nama yang ditempelkan ke KTP.
// ============================================================

/**
 * Satu nama lokal (sebutan daerah) untuk seekor ikan.
 *
 * Contoh:
 *   {
 *     id: 1,
 *     speciesId: 5,
 *     nama: "Ketambak",
 *     daerah: "Tanjungpinang",
 *     asalUsul: "Dari bahasa Melayu pesisir"
 *   }
 */
export interface LocalName {
  /** Nomor unik untuk membedakan satu nama lokal dari yang lain */
  id: number;

  /** ID dari Species yang dimaksud (penghubung ke data ikan) */
  speciesId: number;

  /** Nama lokal / sebutan daerah, contoh: "Ketambak" */
  nama: string;

  /** Daerah asal nama ini dipakai, contoh: "Natuna", "Bintan" */
  daerah: string;

  /** Penjelasan asal-usul penamaan (boleh kosong kalau belum tahu) */
  asalUsul?: string;
}
