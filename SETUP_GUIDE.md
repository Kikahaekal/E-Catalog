# Menjalankan frontend E-Catalog UMRAH

Target aplikasi adalah website React 19, TypeScript, Ionic React 9 dan Vite 8. Backend dikelola pada repository terpisah. Tidak diperlukan build Android/iOS.

## Instalasi

Gunakan Node.js 22 LTS versi 22.12 atau lebih baru dan npm. Vite terpasang mensyaratkan Node ^20.19 atau >=22.12; pemeriksaan final dilakukan menggunakan Node 24.15.0.

```powershell
npm ci
Copy-Item .env.example .env.local
```

Edit `.env.local`: isi `VITE_API_URL` dengan origin backend yang diberikan tim, tanpa akhiran `/api`, misalnya origin HTTPS staging tim. Nilai dalam `.env.example` hanyalah contoh dan harus diganti. `.env.local` diabaikan Git dan mengungguli `.env` existing. Jangan menimpa konfigurasi anggota tim.

Semua variabel `VITE_*` bersifat publik dan masuk bundle browser. Jangan menaruh password, JWT_SECRET, database URL, atau token di dalamnya. Repository saat ini melacak `.env`; file tersebut tidak diubah dalam finalisasi ini. Tim perlu meninjau kebijakan environment sebelum commit/deployment.

```powershell
npm run dev
```

Buka alamat yang dicetak Vite. Backend harus berjalan terpisah dengan CORS mengizinkan origin frontend dan static `/uploads` dapat diakses. Perubahan environment membutuhkan restart Vite.

## Pemeriksaan

```powershell
npx tsc --noEmit
npm run lint
npm run test.unit -- --run
npm run build
```

Unit test menggunakan mock. Untuk browser test, jalankan Vite pada terminal pertama lalu:

```powershell
npm run test.e2e -- --browser electron --config baseUrl=http://127.0.0.1:5173,video=false
```

Sesuaikan port dengan Vite. Cypress memerlukan binary browser/cache dan izin menjalankan proses. Spec handoff mencegat API memakai fixture; tidak memerlukan akun maupun penulisan database. Pada Windows jika loader Cypress gagal menemukan TypeScript:

```powershell
$env:TS_NODE_COMPILER = Join-Path (Get-Location) 'node_modules/typescript/lib/typescript.js'
$env:NODE_PATH = Join-Path (Get-Location) 'node_modules'
```

## Deployment

Tetapkan `VITE_API_URL` pada lingkungan build sebelum `npm run build`; perubahan environment server setelah build tidak memperbarui bundle. Publikasikan isi `dist/`. `npm run preview` hanya untuk pemeriksaan build lokal.

Hosting harus melakukan SPA fallback ke `index.html` untuk route frontend seperti `/admin`, `/spesies`, dan URL tak dikenal. Jangan rewrite request API atau file upload menjadi HTML. Gunakan HTTPS frontend dan backend agar tidak terkena mixed content. Backend harus mengatur CORS, JWT, dan akses upload; frontend tidak menyediakan secret server. Uji refresh deep link, Login nyata dan sesi expired pada staging sebelum deployment disetujui.
