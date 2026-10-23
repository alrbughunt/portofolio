# Laporan Revisi Visual 3D Alfarizqi

Tanggal: 22 Oktober 2026

## 1. Audit jujur sebelum revisi

1. **Hero:** rack prosedural enam unit server, panel dan LED instanced, tiga kabel Catmull-Rom dengan paket data bergerak, terminal CanvasTexture yang mengetik perintah, dan contact shadow. Rack berotasi kecil dan melayang tipis; gerak utama berasal dari LED, paket, terminal, kamera, dan shader grid.
2. **Latar:** tiga lapisan partikel instanced dengan garis jaringan statis. Layer partikel mengikuti kamera. Grid holografik menggunakan shader vertex/fragment.
3. **Skills:** graph delapan kategori, node skill instanced, garis koneksi, dan node kategori. Kontrol HTML aksesibel pada section Skills mengendalikan hover/selection dan panel daftar skill.
4. **Projects:** tiga kartu teknis dekoratif di scene global. Enam kartu HTML menggunakan tilt, glare, depth layers, scanline, orbit, dan stagger.
5. **Experience:** jalur TubeGeometry bercahaya, tujuh node yang menyala berdasarkan kedekatan kamera, ikon fiber-optic, dan burst partikel LKS sekali saat pertama terlihat.
6. **Achievements/Certifications:** medali prosedural metalik dengan emissive dan rotasi saat hover/focus.
7. **Contact:** globe dot-matrix instanced, lima arc, titik Tasikmalaya, target, cincin pulsa, dan rotasi lambat yang melambat saat hover.
8. **Canvas/kamera:** satu Canvas fixed global. Scene band mengikuti scroll melalui interpolasi anchor section; kamera juga merespons mouse.
9. **Dependency dari `package.json`:** React 18.2.0, Three.js 0.161.0, R3F 8.15.16, Drei 9.99.4, Framer Motion 9.0.7, `@react-three/postprocessing` 2.16.2, Tailwind 3.2.6, Vite 5.0.8, TypeScript 5.2.2. Versi memakai rentang caret dan tidak ada lockfile tervalidasi.
10. **Lighting/effects:** `Environment` dengan tiga `Lightformer`, fog, key/rim/fill lights, `ContactShadows`, Bloom dan Vignette tersedia. `Float` tidak digunakan.
11. **Kelemahan sebelum revisi:** 36 ventilasi rack dibuat sebagai mesh terpisah; skill graph belum memiliki paket cahaya yang bergerak sepanjang koneksi; grid shader tidak memperbarui posisi parallax setelah kamera bergerak.
12. **Interaksi:** canvas global diset `pointer-events: none`, jadi raycast langsung pada mesh bukan jalur interaksi yang dapat diandalkan. Kontrol HTML untuk kategori skill tetap menjadi input utama dan mendukung keyboard.
13. **Aset:** objek 3D utama menggunakan geometri prosedural. Logo teknologi sebagai tekstur belum dipasang karena sumber/lisensinya belum diverifikasi.
14. **Aset lama:** file CV, PDF portofolio, foto, dan file POC tidak tersedia dalam paket kerja ini. Skrip preservasi melaporkan tujuh file sumber tidak ditemukan dan tidak membuat pengganti.
15. **Build baseline:** `npm run build` gagal pada `tsc --noEmit` dengan `TS2688: Cannot find type definition file for 'vite/client'`. `node_modules` tidak tersedia.
16. **Instalasi:** `npm install --ignore-scripts --no-audit --no-fund` timeout pada lingkungan ini. Tidak ada `package-lock.json` yang dihasilkan.
17. **Performa/browser:** FPS, draw calls, console browser, 360 px, 1440 px, Lighthouse, dan ukuran bundle belum dapat diukur. HUD dev yang sudah ada dapat menampilkan FPS/draw calls ketika app berjalan.
18. **Kesimpulan audit:** dasar visual NOC sudah cukup kaya, tetapi perlu efisiensi draw calls dan gerak data yang lebih jelas pada graph/globe. Klaim performa belum bisa dibuat tanpa runtime.

## 2. Revisi kode pada tahap ini

- Mengganti 36 mesh ventilasi rack dengan satu `InstancedMesh` (`VentBank`). Secara nominal mengurangi 35 draw calls untuk ventilasi saat scene rack dirender; angka total draw calls tetap harus diukur pada browser.
- Menambahkan partikel cahaya instanced yang bergerak sepanjang garis koneksi skill graph. Warna berubah saat kategori dipilih atau di-hover.
- Menambahkan paket cahaya instanced yang bergerak sepanjang arc globe.
- Memperbaiki shader grid agar posisi X/Y mengikuti kamera pada setiap frame. Sebelumnya posisi hanya diambil saat React render, sehingga tidak benar-benar mengikuti pergerakan kamera.
- Memperkuat pergeseran kamera saat kategori skill dipilih.
- Mempertahankan data konten dan file teks yang ada; tidak menambahkan tanggal pengalaman atau link proyek fiktif.

## 3. Ringkasan per section

| Section | Efek 3D/animasi yang ditambahkan atau dipertahankan | File terkait | Cara memicunya | Status |
|---|---|---|---|---|
| Global background | Tiga lapisan partikel, garis koneksi, shader grid yang mengikuti kamera, fog tint, kamera berbasis scroll dan parallax | `src/components/canvas/GlobalScene.tsx`, `src/styles.css` | Scroll dan gerakan mouse | Source diperbarui; belum diverifikasi di browser |
| Hero | Rack prosedural enam unit, LED boot sequence, paket data pada kabel, terminal typing, intro kamera 1,75 detik, headline per huruf | `GlobalScene.tsx`, `Hero.tsx`, `src/constants/index.ts` | Saat halaman dimuat, mouse, scroll | Source ada; runtime belum diuji |
| About | Empat kartu HTML dengan hover/focus; background scene mengikuti scroll | `About.tsx`, `GlobalScene.tsx`, `styles.css` | Hover/focus dan scroll | Dipertahankan; belum diuji |
| Skills | Graph delapan kategori, node kecil instanced, garis bercahaya dan paket pulsa berjalan; panel daftar teks aksesibel | `GlobalScene.tsx`, `Skills.tsx`, `App.tsx`, `styles.css` | Hover/focus/klik kontrol kategori; Escape/tombol tutup | Source diperbarui; interaksi langsung di browser belum diuji |
| Projects | Enam kartu tilt/glare dengan kedalaman, scanline, orbit, stagger | `Projects.tsx`, `styles.css` | Hover dan masuk viewport | Dipertahankan; belum diuji |
| Experience | Jalur kabel, node proximity, mark fiber-optic, burst partikel Juara 1 | `GlobalScene.tsx`, `Experience.tsx`, `App.tsx` | Scroll, hover/focus timeline | Dipertahankan; belum diuji |
| Achievements | Medali prosedural metalik yang merespons hover/focus | `GlobalScene.tsx`, `Achievements.tsx`, `styles.css` | Hover/focus kartu | Dipertahankan; belum diuji |
| Certifications | Koin 3D yang menyala dan berubah orientasi saat baris aktif | `GlobalScene.tsx`, `Certifications.tsx`, `styles.css` | Hover/focus baris | Dipertahankan; belum diuji |
| Contact | Globe dot-matrix, arc, paket cahaya berjalan, titik Tasikmalaya, ring pulsa, rotasi yang melambat saat hover | `GlobalScene.tsx`, `Contact.tsx`, `App.tsx` | Hover/focus globe | Source diperbarui; belum diuji |
| Loader/quality | Loader boot, `useProgress`, `PerformanceMonitor`, mode kualitas rendah, HUD development | `GlobalScene.tsx`, `styles.css`, `package.json` | Load scene / penurunan performa | Implementasi ada; belum diuji runtime |
| Fallback | Konten HTML tetap tersedia; visual statis saat WebGL tidak tersedia, reduced motion aktif, atau perangkat terdeteksi rendah daya | `useCanvasCapability.ts`, `Hero.tsx`, `Skills.tsx`, `Contact.tsx`, `GlobalScene.tsx` | Kondisi browser/perangkat | Implementasi ada; belum diuji runtime |

## 4. Kriteria penerimaan

| # | Kriteria | Status dan alasan |
|---:|---|---|
| 1 | Lima gerakan/interaksi berbeda dalam lima detik hero | **Belum diverifikasi visual.** Source mencakup intro kamera, LED, paket data, terminal typing, parallax, headline per huruf. |
| 2 | Scroll kontinu tanpa lompatan | **Belum diverifikasi.** Kamera menginterpolasi anchor DOM; harus diuji saat scrolling di browser. |
| 3 | Tiap section punya interaksi visual | **Source tersedia; belum diuji.** Skills memakai kontrol HTML sebagai jalur interaksi utama, bukan raycast mesh global. |
| 4 | Bukan hanya objek berputar | **Source memenuhi secara mekanisme.** Ada paket data, LED, typing, node proximity, scanline, pulsa graph/globe, shader dan scroll rig. Runtime belum dicek. |
| 5 | Bloom dan lighting tanpa merusak kontras AA | **Belum diverifikasi.** Efek tersedia di source; pengukuran kontras dan visual belum dilakukan. |
| 6 | FPS ≥55 laptop, ≥30 mobile, draw calls <150 | **Belum terukur, belum dapat dinyatakan lolos.** HUD dev tersedia; VentBank mengurangi nominal 35 draw calls. |
| 7 | Reduced-motion dan no-WebGL fallback | **Implementasi ada, belum diuji.** Perlu uji browser aktual dengan preference dan WebGL dimatikan. |
| 8 | Build sukses dan bundle size sebelum/sesudah | **Gagal / terblokir.** `npm run build` gagal karena `vite/client` tidak ditemukan; npm install timeout. Ukuran bundle belum ada. |

## 5. Pemeriksaan yang berhasil

- Pemeriksaan sintaks TypeScript/TSX melalui TypeScript `transpileModule`: **20 file, 0 diagnostic sintaks**. Ini bukan pengganti typecheck penuh.
- Arsip ZIP sebelumnya lolos pemeriksaan integritas saat dibuat. ZIP baru perlu dibuat ulang dari source revisi ini.
- Build produksi belum berhasil, sehingga tidak ada klaim bahwa proyek siap deploy.

## 6. Keterbatasan saat ini

- Dependency belum terpasang dan `npm run build` belum lolos.
- Browser runtime tidak tersedia, jadi console, screenshot 360 px/1440 px, FPS, draw calls, bundle size, dan Lighthouse belum dapat dilaporkan sebagai hasil pengukuran.
- Git checkout tidak ada pada folder kerja ini. Branch `3d-portfolio`, commits per fase, dan pull request belum dibuat.
- GitHub perlu tersambung agar perubahan dapat diterapkan ke repositori asli. File asli CV, portfolio PDF, foto, dan file POC harus dipastikan tersedia dari repo tersebut sebelum deployment.
- Logo teknologi tidak dibuat sebagai tekstur tanpa sumber dan lisensi yang dapat diverifikasi.

## 7. Tiga peningkatan berikutnya

1. Sambungkan GitHub, checkout repositori asli, buat branch `3d-portfolio`, lalu terapkan patch tanpa menghapus CV, PDF, foto, dan file POC.
2. Pasang dependency di lingkungan dengan akses npm, jalankan `npm run build`, perbaiki type error, dan lakukan smoke test browser sebelum merge.
3. Rekam FPS/draw calls pada laptop dan mobile, ukur Lighthouse mobile dan bundle size, lalu validasi scroll, keyboard, reduced motion, no-WebGL, serta kontras WCAG AA.
