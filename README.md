# Alfarizqi | Network Operations Center Portfolio

Portofolio personal berbahasa Indonesia untuk Alfarizqi. Konten profil, pengalaman, proyek, skill, pencapaian, sertifikasi, dan kontak tetap berasal dari `src/constants/index.ts`. Revisi visual ini menyatukan pengalaman 3D ke satu Canvas global yang mengikuti scroll, tanpa model GLTF eksternal.

## Menjalankan lokal

Persyaratan: Node.js 20+ dan npm.

```bash
npm install
npm run dev
```

Pemeriksaan produksi:

```bash
npm run typecheck
npm run build
npm run preview
```

`npm run build` menjalankan preservasi aset, pemeriksaan TypeScript, lalu build Vite. Instalasi dependensi membutuhkan akses ke npm registry. Lingkungan yang menghasilkan paket revisi ini tidak memiliki akses jaringan ke registry, jadi build produksi belum dapat dinyatakan lulus.

## Arsitektur scene

- `src/components/canvas/GlobalScene.tsx`: satu Canvas global, rig kamera berbasis posisi section, tiga lapisan partikel, garis jaringan, shader grid, server rack prosedural, LED instanced, paket data pada kurva, terminal CanvasTexture, graph skill, jalur pengalaman, medali, globe bertitik, adaptive quality, dan postprocessing.
- `src/components/sections/Hero.tsx`: headline bertahap per huruf, CTA, dan ilustrasi server statis untuk fallback.
- `src/components/sections/Skills.tsx`: delapan kontrol kategori yang menghubungkan interaksi HTML yang aksesibel dengan graph 3D. Detail skill tersedia sebagai teks dan dapat ditutup dengan tombol atau Escape.
- `src/components/sections/Projects.tsx`: enam kartu dengan tilt, glare, layer kedalaman, dan animasi stagger. Efek tilt dimatikan pada pointer sentuh atau reduced motion.
- `src/components/sections/Experience.tsx`: timeline HTML yang menyorot node 3D terkait saat hover/focus.
- `src/components/sections/Achievements.tsx` dan `Certifications.tsx`: kartu aksesibel yang menyorot medali 3D terkait.
- `src/components/sections/Contact.tsx`: kontak tetap berupa HTML dan mengendalikan kecepatan rotasi globe ketika area globe di-hover/fokus.
- `src/components/layout/CursorGlow.tsx`: kursor dekoratif untuk perangkat pointer presisi. Tidak menggantikan cursor bawaan.
- `src/utils/useCanvasCapability.ts`: fallback jika WebGL tidak tersedia, reduced motion aktif, atau perangkat sangat rendah daya.
- `src/constants/index.ts`: satu sumber konten portofolio dan string UI scene.

Scene menggunakan geometri prosedural, material metal/roughness/emissive, `Environment` dengan Lightformer buatan sendiri, tiga titik cahaya, ContactShadows, Bloom, Vignette, serta shader grid ringan. `PerformanceMonitor` menurunkan kualitas render ketika performa turun. Di development, HUD menampilkan FPS dan draw calls agar angka aktual dapat direkam di browser.

## Konten dan data

Ubah teks di `src/constants/index.ts`. Data proyek tidak diberi link demo/repository palsu. Tambahkan `demo` atau `repository` hanya setelah URL tersedia. Tanggal pengalaman yang belum dikonfirmasi tetap kosong. Tidak ada testimoni atau pencapaian baru yang dibuat untuk revisi visual ini.

## Aset lama dan file POC

Jalankan `npm run preserve:assets` saat folder ini diterapkan di checkout repositori lama. Skrip menyalin file sumber yang ditemukan tanpa menghapus atau mengubah file asli:

- `CV_Alfarizqi.pdf`
- `Portfolio_Alfarizqi.pdf`
- `Foto-Alfarizqi.jpg`
- `poc.html`, `poc1.html`, `poc2.html`, dan `download-test.html`

Ketujuh file itu tidak ada di paket kerja yang tersedia saat revisi dibuat. Skrip tidak membuat placeholder. Sebelum deploy, pastikan file asli masih berada di root checkout lama atau telah tersedia di `public/`, sehingga URL root lama tetap berfungsi.

## Aksesibilitas dan fallback

- Konten utama tetap HTML, bukan teks yang hanya dirender di Canvas.
- Skill dapat dipilih dengan keyboard, detail skill memiliki daftar teks, dan Escape menutup detail terpilih.
- Skip link, fokus keyboard, struktur heading, dan alt/label yang relevan tetap dipertahankan.
- Ketika WebGL tidak tersedia, `prefers-reduced-motion: reduce` aktif, atau perangkat terdeteksi sangat rendah daya, scene diganti ilustrasi statis. Pada mobile kelas menengah, scene tetap aktif dengan DPR dan jumlah partikel lebih rendah.
- Pengujian kontras WCAG AA dan screen reader tetap perlu dilakukan secara manual setelah build berjalan.

## Deploy GitHub Pages

Konfigurasi Vite menggunakan `base: '/'` untuk user site `alrbughunt.github.io`. Workflow berada di `.github/workflows/deploy.yml` dan menggunakan GitHub Actions Pages.

1. Terapkan perubahan pada branch baru `3d-portfolio` di checkout repositori asli.
2. Pastikan file CV, PDF, foto, dan file POC lama tetap ada dan tidak berubah.
3. Jalankan `npm install`, `npm run build`, lalu cek tampilan di 360 px dan 1440 px.
4. Push branch dan buat pull request. Jangan force-push atau menimpa riwayat Git.
5. Pada GitHub, buka **Settings → Pages → Build and deployment → Source**, lalu pilih **GitHub Actions**.
6. Merge/deploy hanya setelah build dan job GitHub Actions sukses.

Tidak ada branch atau pull request yang dibuat dari lingkungan ini karena folder kerja tidak memiliki metadata Git dan koneksi ke GitHub tidak tersedia.

## Kredit dan lisensi

Struktur pengalaman terinspirasi dari [ladunjexa/reactjs18-3d-portfolio](https://github.com/ladunjexa/reactjs18-3d-portfolio), yang menggunakan lisensi MIT. Atribusi dicantumkan pada footer dan `THIRD_PARTY_NOTICES.md`. Semua objek 3D pada revisi ini dibangun dari geometri Three.js dan CanvasTexture lokal. Tidak ada model GLTF atau tekstur eksternal yang dipaketkan.

## Data yang masih perlu dilengkapi pemilik

- Periode untuk pengalaman yang saat ini memiliki `date: ''`.
- URL demo atau repositori untuk enam proyek, jika tersedia.
- File CV, PDF portofolio, foto, dan file POC asli di checkout repo sebelum deploy.
- Logo vendor resmi jika label teks pada graph ingin diganti dengan logo berlisensi jelas.

## Status verifikasi

Pemeriksaan sintaks TS/TSX menggunakan TypeScript transpiler global lolos untuk 22 file. Namun, `npm run build` belum lolos karena dependensi lokal tidak terpasang dan akses npm registry timeout. Karena itu, FPS, draw calls, ukuran bundle produksi, konsol browser, screenshot 360/1440 px, dan skor Lighthouse belum memiliki angka terukur. Rincian status per kriteria ada di `IMPLEMENTATION_REPORT.md` dan `VALIDATION_STATUS.md`.

## Audit dan status revisi visual

Lihat [`AUDIT.md`](./AUDIT.md) untuk audit source sebelum revisi, [`IMPLEMENTATION_REPORT.md`](./IMPLEMENTATION_REPORT.md) untuk tabel section dan kriteria penerimaan, serta [`VALIDATION_STATUS.md`](./VALIDATION_STATUS.md) untuk status pengujian yang terukur. Build produksi, FPS, draw calls, Lighthouse, dan browser checks belum dapat dinyatakan lolos sampai dependency berhasil dipasang dan aplikasi diuji di browser.
