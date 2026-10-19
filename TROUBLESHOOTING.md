# Troubleshooting frontend E-Catalog

## Login gagal atau JWT invalid

Periksa status dan pesan respons melalui Network tanpa membagikan token, password, atau Authorization header. HTTP 200 Login belum membuktikan request Admin berikutnya menerima token. Pengguna melaporkan Login lokal telah berhasil setelah konfigurasi JWT backend disesuaikan; finalisasi frontend tidak mengubah konfigurasi tersebut.

**BLOCKED BY BACKEND** apabila token hasil Login ditolak middleware: pemilik backend perlu memeriksa konsistensi secret penandatanganan/verifikasi, masa berlaku dan konfigurasi proses server. Jangan memasukkan JWT_SECRET ke VITE_*, membuat token sendiri, menghapus guard atau menonaktifkan interceptor.

Frontend mengenali ADMIN dan SUPER_ADMIN. Pada endpoint Admin terproteksi, 401 atau 403 dengan pesan kontrak persis `Token tidak valid atau kadaluwarsa.` membersihkan hanya token/role sesi terkait dan mengirim event `admin-auth-changed`; guard membawa pengguna ke Login. 403 izin biasa, 404, 500 dan network error tidak otomatis logout. Login gagal menampilkan pesan aman tanpa redirect loop.

## API tidak terhubung

Periksa `VITE_API_URL` di environment build, server backend, CORS, HTTPS/mixed content dan akses jaringan. Gunakan origin tanpa `/api`; service sudah menambahkan `/api/...`. Restart Vite atau rebuild sesudah mengubah environment. Jangan mengganti API dengan data dummy runtime. Pesan error 5xx sengaja memakai fallback aman, bukan detail internal server.

## Daftar kosong dan lookup Spesies

404 dengan `{ error: "Data wpp tidak ditemukan" }` dan `{ error: "Data IUCN tidak ditemukan" }` masing-masing diperlakukan sebagai daftar master kosong. 404 lain tetap error. Tombol retry mengulang GET. Kegagalan lookup pendukung Spesies menampilkan peringatan; tabel utama tetap dapat tampil jika GET spesies berhasil. Tambah/edit diblokir ketika lookup tidak lengkap agar relasi tidak tertimpa. Pulihkan API lookup lalu retry.

## Foto tidak muncul

Periksa path dari API, akses `/uploads`, HTTPS, dan origin API. Hasil pencarian menormalisasi separator relatif dan mendukung URL HTTP(S) absolut; foto kosong/rusak memakai fallback informatif. Backend bertanggung jawab pada penyimpanan dan publikasi file. Jangan mengganti origin deployment dengan localhost.

## Refresh deep link menghasilkan 404 server

Atur SPA fallback hosting ke `index.html` untuk route frontend. Halaman 404 aplikasi hanya dapat tampil setelah hosting mengirim aplikasi. API dan file statis harus dikecualikan dari rewrite.

## Warning pemeriksaan

Build masih memberi warning selector `host-context` dari CSS Ionic dan chunk >500 kB (entry modern sekitar 1.53 MB minified / 344 kB gzip). Build tetap lulus; code splitting/performance merupakan pekerjaan lanjutan yang perlu review, bukan alasan mematikan pemeriksaan. Unit test App existing mengeluarkan warning React Router future flags, IonMenu/content dan React act pada harness; hasil lulus tidak berarti seluruh warning telah diselesaikan. Cypress/Electron juga dapat mengeluarkan warning loader Node.

## Integrasi yang memerlukan backend

- Presisi Reference: parser ID controller masih menggunakan Number, sehingga ID melebihi MAX_SAFE_INTEGER belum aman end-to-end.
- Pencarian server belum memakai parameter nama; filter frontend hanya benar untuk daftar lengkap tanpa pagination.
- Moderasi: approve belum memakai transaksi eksplisit; reject menghapus file sebelum record. Kegagalan respons dapat terjadi setelah sebagian aksi berhasil. Jangan otomatis mengulang mutasi.
- Keamanan file: source submit menerima path body bila file tidak diunggah, sementara reject menggunakan stored path untuk unlink tanpa pembatasan direktori yang terlihat. Pemilik backend harus memvalidasi asal path dan membatasi direktori upload sebelum publikasi. Jangan menguji eksploit terhadap database/file asli.
