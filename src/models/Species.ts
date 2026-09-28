// ============================================================
// Species.ts — Tipe data untuk satu jenis ikan
// ============================================================
//
// Analogi sederhana:
// Bayangkan "Species" itu seperti KTP untuk satu jenis ikan.
// Di KTP ada nama lengkap, alamat, foto, dll.
// Nah, di Species juga ada nama ilmiah, family, foto, dll.
//
// "StatusTangkap" itu seperti stiker warna di KTP ikan:
//   🟢 hijau    = aman ditangkap di perairan Kepri
//   🟡 kuning   = belum ditentukan artinya (pilihan tersedia)
//   🔴 merah    = tidak boleh / rawan ditangkap di Kepri
//   ⚪ belum-ada = belum ada data status tangkap
//
// Bedanya statusIUCN dan statusTangkap:
//   - statusIUCN  = penilaian GLOBAL dari organisasi IUCN
//                    (contoh: "LC" artinya Least Concern / tidak terancam secara global)
//   - statusTangkap = status LOKAL khusus Kepulauan Riau
//                    (contoh: ikan bisa LC secara global tapi "merah" di Kepri
//                     karena populasinya sudah sedikit di sana)
// ============================================================

/**
 * Status penangkapan ikan di wilayah Kepulauan Riau.
 *
 * - "hijau"     : aman ditangkap
 * - "kuning"    : belum ditentukan artinya
 * - "merah"     : tidak boleh / rawan ditangkap
 * - "belum-ada" : belum ada data
 */
export type StatusTangkap = "hijau" | "kuning" | "merah" | "belum-ada";

/**
 * Data lengkap satu jenis ikan (seperti KTP ikan).
 *
 * Contoh:
 *   {
 *     id: 1,
 *     namaIlmiah: "Lethrinus lentjan",
 *     family: "Lethrinidae",
 *     genus: "Lethrinus",
 *     spesies: "lentjan",
 *     namaUmum: "Pink ear emperor",
 *     statusIUCN: "LC",
 *     statusTangkap: "belum-ada",
 *     wpp: [],
 *     foto: []
 *   }
 */
export interface Species {
  /** Nomor unik untuk membedakan satu ikan dari yang lain */
  id: number;

  /** Nama ilmiah lengkap, contoh: "Lethrinus lentjan" */
  namaIlmiah: string;

  /** Nama family (suku), contoh: "Lethrinidae" */
  family: string;

  /** Nama genus (marga), contoh: "Lethrinus" */
  genus: string;

  /** Nama spesies (jenis), huruf kecil, contoh: "lentjan" */
  spesies: string;

  /** Nama umum dalam bahasa Inggris/Indonesia, contoh: "Pink ear emperor" */
  namaUmum: string;

  /** Status konservasi global dari IUCN, contoh: "LC", "NT", "VU", "EN", "CR" */
  statusIUCN: string;

  /** Status penangkapan LOKAL di Kepulauan Riau */
  statusTangkap: StatusTangkap;

  /** Daftar Wilayah Pengelolaan Perikanan (WPP), contoh: ["711", "718"] */
  wpp: string[];

  /** Daftar URL/path foto ikan */
  foto: string[];
}
