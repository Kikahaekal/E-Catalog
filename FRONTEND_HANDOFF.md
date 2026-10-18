# Handoff frontend E-Catalog UMRAH

Tanggal review: 18 Oktober 2026. Scope finalisasi: frontend saja; perubahan Task 01–07.2 yang belum di-commit dipertahankan. Tidak ada dependency baru, perubahan backend/database/secret, operasi API tulis nyata, commit atau push.

## Halaman dan integrasi

| Route | Fitur | Endpoint utama |
| --- | --- | --- |
| `/`, `/home` | Beranda; root redirect | Tidak memerlukan API |
| `/search` | Form pencarian | Navigasi ke hasil |
| `/search/results` | Filter daftar, foto/fallback, tautan detail | GET `/api/species` dengan parameter name |
| `/species/:speciesId` | Detail spesies dan relasi | GET `/api/species/:speciesId` |
| `/tambah-ikan` | Form usulan dan upload | POST `/api/fish/submit` multipart |
| `/login` | Email/password, toggle, redirect role | POST `/api/auth/login` `{ email, password }` |
| `/admin` | Dua statistik dari jumlah item array | GET `/api/species`, `/api/fish/submissions` |
| `/spesies` | Cari, detail, tambah/edit/hapus, relasi | `/api/species`; lookup empat master di bawah |
| `/iucn` | CRUD kode/nama | `/api/iucn` |
| `/wpp` | CRUD kode/deskripsi | `/api/wpp` |
| `/referensi` | CRUD seluruh field referensi existing | `/api/reference` |
| `/daerah` | CRUD nama/provinsi | `/api/regency` |
| `/permintaan-ikan` | Foto/detail, pemilihan spesies, approve/reject | GET `/api/fish/submissions`, POST `/api/fish/approve/:submissionId` `{ speciesId }`, DELETE `/api/fish/reject/:submissionId` |
| `*` | 404 dan tautan pemulihan ke beranda | Tidak memerlukan API |

CRUD master/spesies: GET/POST base route, GET/PUT/DELETE `/:id` sesuai service existing. Respons daftar/detail `{ message, data }`; error backend dapat `{ error }` atau `{ message }`. Logout memakai POST `/api/auth/logout`; sesi lokal tetap dibersihkan jika request logout gagal. Endpoint tulis Admin dan daftar usulan memakai Bearer token. GET master/species merupakan publik pada source backend yang diperiksa. Payload CRUD lengkap tetap di service/handler existing, tidak disederhanakan oleh finalisasi ini.

Semua route Admin dibungkus AdminRoute dengan token dan role ADMIN/SUPER_ADMIN. Otorisasi sesungguhnya tetap dilakukan backend. Event `admin-auth-changed`, penyimpanan sesi dan interceptor tetap dipertahankan. Tidak ada mock pada runtime aplikasi.

FAQ tidak ditemukan sebagai implementasi/menu/route/API pada repository yang diperiksa. Belum ada frame khusus terverifikasi. Tim perlu memutuskan scope dan kontraknya; tidak dibuat placeholder baru.

## Perubahan finalisasi

- `src/App.tsx`, `src/pages/NotFound.tsx`, `NotFound.test.tsx`: recovery 404 tanpa mengubah route existing.
- `src/components/ui/Navbar.tsx`: state ARIA, hubungan kontrol menu, inert pada menu tertutup, focus keyboard yang terlihat; layout dipertahankan.
- `src/components/ExploreContainer.tsx`: menghapus empty interface penyebab lint error, komponen tetap tersedia.
- `src/pages/Admin/master/Species/Species.tsx`, `src/services/species.ts`: tipe lookup dan foreign key mengganti any. Ekspresi pemetaan ID, handler dan payload tidak diubah; assertion tipe tidak melakukan konversi ID runtime.
- `cypress/e2e/test.cy.ts`: mengganti test template usang dengan regresi frontend berfixture, menolak request tulis tak terduga.
- `.env.example`, `SETUP_GUIDE.md`, `TROUBLESHOOTING.md`, dokumen ini: konfigurasi publik dan handoff. `.env` existing tidak diubah.

## Verifikasi

Baseline: TypeScript PASS, build PASS, unit 160/160 PASS; lint FAIL dengan lima error existing. Sesudah perubahan: TypeScript PASS, lint PASS, build PASS, unit 161/161 PASS pada 16 file. Unit tests meliputi Login ADMIN/SUPER_ADMIN, guard/logout, sesi expired, status 401/403/500/network, master CRUD mock, validasi/modal, error/retry/empty, lookup parsial, BigInt referensi, pencarian dan foto, dashboard serta moderasi mock.

Browser regression repository: 8/8 PASS pada Cypress 13.17 / Electron 118. Meliputi guard tanpa sesi, toggle password, 404/pemulihan dan overflow pada 1440×810, 1024×768, 768×1024, 390×844, 320×740; navigasi mobile dengan state ARIA/inert; filter pencarian dan tautan ID besar. Ukuran layar tersebut diperiksa untuk halaman 404, bukan klaim seluruh halaman diuji ulang pada semua resolusi. Test fixture bukan bukti integrasi API nyata. Login nyata yang berhasil merupakan laporan pengguna; agent tidak memakai kredensial untuk mengulang Login. Penulisan CRUD/upload/approve/reject nyata: NOT TESTED, sengaja tidak dilakukan karena belum ada persetujuan data uji.

Warning tersisa: CSS Ionic host-context, ukuran chunk, React Router future flags dan warning harness App (IonMenu/act). Tidak dilakukan redesign atau refactoring arsitektur untuk menyembunyikannya. Aksesibilitas yang diperiksa bersifat dasar, belum audit screen reader/kontras menyeluruh. Tidak ada pembacaan Figma baru dalam finalisasi; desain existing dipertahankan.

Regresi browser fixture tambahan (harness sementara dari Task 07.2): 6/6 PASS untuk pesan Login gagal tanpa loop, WPP kosong/error/retry, lookup Spesies parsial desktop 1440×810 dan mobile 390×844, pemisahan error daftar utama serta proteksi route tanpa sesi. Harness presentasi Admin terisolasi tidak membuktikan navigasi dengan sesi backend nyata. Dua screenshot lookup-protected tersedia pada direktori TEMP `ecatalog-session-review/screenshots/session.cy.cjs/`; artefak ini lokal dan tidak ikut Git. Total eksekusi browser finalisasi: 14 PASS. `git diff --check` PASS; perbandingan hash baseline finalisasi menunjukkan hanya file yang disebut pada bagian perubahan, tanpa file existing dihapus.

## BLOCKED BY BACKEND / prasyarat deployment

1. **Prioritas keamanan:** tinjau penerimaan path foto dari body submit dan pembatasan direktori file reject. Risiko penghapusan file di luar upload harus diselesaikan pemilik backend sebelum publikasi.
2. Parser Reference ID berbasis Number perlu diganti backend agar presisi end-to-end terjamin.
3. Server-side search diperlukan bila API mulai paginated; filtering frontend saat ini mensyaratkan daftar lengkap.
4. Transaksi approve dan konsistensi penghapusan file/record reject memerlukan perbaikan backend.
5. Tim backend/deployment memverifikasi JWT proses staging, CORS, HTTPS, akses upload, dan format error. Jangan mengirim secret ke frontend.

## Checklist review dan deployment

- [x] Pemeriksaan statis, unit test, build; tidak ada dependency baru.
- [x] Guard, interceptor dan kontrak existing dipertahankan.
- [x] Panduan setup/environment dan troubleshooting tersedia.
- [ ] Review seluruh diff lokal Task 01–07.4 bersama pemilik perubahan sebelum commit manual.
- [ ] Selesaikan review keamanan backend dan presisi Reference.
- [ ] Jalankan Login/refresh/logout/expired session nyata pada staging dengan akun resmi tim.
- [ ] Uji CRUD/upload/moderasi nyata hanya dengan data development yang disetujui.
- [ ] Atur API origin build, HTTPS/CORS, SPA fallback dan cache hosting; smoke test build deployment.
- [ ] Review visual lintas browser, keyboard/screen reader dan koneksi lambat.

Frontend dapat diserahkan untuk code review. Kesiapan production belum dinyatakan; integrasi nyata dan prasyarat keamanan di atas masih memerlukan verifikasi tim.
