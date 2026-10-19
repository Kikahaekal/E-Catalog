# Review redesign form — Tahap 07.6

## Inventaris dan cakupan

| Form | Lokasi | Tindakan |
| --- | --- | --- |
| Tambah/edit IUCN | `src/pages/Admin/master/Iucn/Iucn.tsx` | Dua modal diselaraskan |
| Tambah/edit Zona WPP | `src/pages/Admin/master/WppZone/WppZone.tsx` | Dua modal diselaraskan |
| Tambah/edit Referensi | `src/pages/Admin/master/Reference/Reference.tsx` | Dua modal; seluruh lima field dipertahankan |
| Tambah/edit Spesies | `src/pages/Admin/master/Species/Species.tsx` | Dua modal lebar, field kompleks/relasi tetap tersedia |
| Tambah/edit Kabupaten/Kota | `src/pages/Admin/master/Regency/Regency.tsx` | Dua modal diselaraskan |
| Usulan nama ikan publik | `src/pages/FishSubmission.tsx`, `FishSubmissionVisual.css` | Diaudit; sudah memiliki input terang, label/helper/required dan styling publik. Tidak diubah |
| Detail master dan moderasi | `AdminRecordDetails.tsx`, `FishSubmissions.tsx` | Bukan form create; tidak diubah |
| Login dan pencarian publik | `Login.tsx`, `SpeciesSearch.tsx`, `SpeciesSearchResults.tsx` | Bukan form tambah data; tidak diubah |

Pencarian seluruh `src` tidak menemukan form create Admin lain. Form Spesies menggunakan URL/path foto dan baris relasi dinamis, bukan upload file baru. Upload file tetap berada pada form usulan publik.

## Implementasi

Styling reusable berada di `src/components/admin/AdminFormModal.css`, diimpor langsung oleh kelima halaman master. Semua selector dibatasi class overlay `admin-form-modal` atau `admin-form-select-alert`. Tidak mengubah theme, layout, sidebar, header halaman, autentikasi atau service API. Modal select Ionic di luar pohon modal diberi class khusus melalui `interfaceOptions`.

- Permukaan putih eksplisit dan `color-scheme: light`, warna navy/border mengikuti Admin existing, Inter, radius 30px desktop dan 22px layar kecil.
- Lebar pendek maksimal 560px; Spesies maksimal 880px. Tinggi mengikuti isi dan dibatasi viewport dinamis. Header dan footer tetap terjangkau; hanya area field yang scroll pada form panjang.
- Konten form menggunakan div/flex lokal menggantikan IonContent modal agar tinggi dapat mengikuti isi tanpa viewport kosong. IonModal, focus trap, Escape dan lifecycle Ionic tetap digunakan.
- Label eksplisit untuk input/select dan judul aksesibel dialog; close memiliki label. Required indicator mengikuti atribut existing, ditambah indikator IUCN Spesies yang memang sudah diwajibkan handler. Tidak menambahkan aturan validasi baru.
- Input/select berborder dengan radius dan focus outline; tombol Simpan navy, Batal outline; state loading/disabled dan label tombol existing dipertahankan.
- Form Spesies mempertahankan semua kelompok dan baris relasi, dengan baris relasi lebar penuh dalam kelompok agar field kompleks tetap terbaca.

## Perlindungan fungsi

Perbandingan snapshot sebelum/sesudah menunjukkan seluruh blok state, effect, fetch dan handler sebelum return JSX identik pada kelima halaman. Jumlah kontrol tetap: IUCN 4 input, WPP 4, Referensi 10, Daerah 4, Spesies 76 input + 14 select + 20 deklarasi option (jumlah mencakup tambah/edit dan template baris dinamis). Tidak ada perubahan service, nama field payload, ID, relasi, endpoint, Bearer token atau proses upload. Seluruh request tulis pada browser test diblokir; unit test CRUD memakai mock.

## Pengujian dan batas

Hasil final: TypeScript PASS (`npx tsc --noEmit`), ESLint PASS (`npm run lint`), unit test 161/161 PASS pada 16 file (`npm run test.unit -- --run`), production build PASS (`npm run build`), dan `git diff --check` PASS. Browser Cypress/Electron: 33/33 test form + 8/8 regresi existing PASS, total 41. Build masih memiliki warning CSS Ionic host-context dan ukuran chunk existing; unit harness App masih mengeluarkan warning Ionic/React Router/act yang sudah tercatat pada handoff sebelumnya.

Spec baru `cypress/e2e/adminForms.cy.js` menggunakan komponen Ionic asli dengan renderer presentasi terisolasi dan fixture API; tidak membuat sesi palsu atau menonaktifkan guard aplikasi. Pemeriksaan snapshot juga memastikan atribut kontrol existing, value, event handler, required, tipe dan batas input tetap identik setelah mengabaikan tambahan atribut ARIA serta class popup.

Jalankan Vite, lalu `npm run test.e2e -- --spec cypress/e2e/adminForms.cy.js --browser electron --config baseUrl=http://127.0.0.1:5173,video=false`. Sesuaikan port; petunjuk environment Windows Cypress ada pada `SETUP_GUIDE.md`. Eksekusi verifikasi lokal menggunakan Cypress SDK dengan konfigurasi sementara untuk ukuran jendela Electron dan lokasi artefak di TEMP.

Cakupan browser: lima halaman pada lebar 320, 360, 375, 768, 1440px; modal pendek dan panjang, overflow area field, footer terlihat, tambah/edit, pembatalan, dark system preference, select Ionic, nama aksesibel, focus containment, Escape dan pengembalian fokus setelah aktivasi tombol melalui fokus keyboard. Regresi publik/guard berada pada spec handoff existing.

Screenshot lokal tersimpan di TEMP `ecatalog-form-review/screenshots/adminForms.cy.js/`, termasuk `wpp-create-375.png`, `wpp-create-1440.png`, `regency-create-375.png`, `species-create-375.png` dan halaman lain. Tidak ikut commit; hasil fixture tidak membuktikan integrasi API nyata.

NOT TESTED: create/update/upload pada backend nyata (tidak diizinkan), screen reader lengkap, Safari/Firefox, virtual keyboard perangkat fisik, dan seluruh alur Tab/Shift+Tab dengan event keyboard native. Focus trap diuji melalui upaya memindahkan fokus keluar modal, Escape diuji lewat event keyboard; pemeriksaan perangkat nyata tetap diperlukan.

BLOCKED BY BACKEND existing tetap tercatat dalam `FRONTEND_HANDOFF.md`/`TROUBLESHOOTING.md`: presisi parser ID Referensi, keamanan path foto dan konsistensi transaksi moderasi. Redesign ini tidak memperbaiki atau mengubah backend.
