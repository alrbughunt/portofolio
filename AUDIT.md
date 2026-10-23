# Audit Visual dan Performa Sebelum Revisi

1. **Hero:** server rack prosedural, enam unit server, terminal dengan canvas texture yang mengetik perintah, LED instanced, kabel ber-TubeGeometry, paket data bergerak, dan contact shadow. Rack hanya berotasi kecil dan melayang tipis; gerak utamanya datang dari LED, paket, terminal, kamera, dan grid shader.
2. **Latar:** tiga lapisan partikel instanced dengan garis jaringan statis; posisi layer mengikuti kamera. Grid holografik memakai shader vertex/fragment sederhana.
3. **Skills:** graph delapan kategori, node skill instanced, garis koneksi dan node kategori. Node kategori bereaksi terhadap state hover/selected dari kontrol HTML di section Skills.
4. **Projects:** scene tiga kartu teknis dekoratif bergerak sangat ringan. Enam kartu konten HTML menggunakan `react-parallax-tilt`, glare, stagger, dan layer visual.
5. **Experience:** jalur tube bercahaya, tujuh node yang menyala berdasarkan kedekatan kamera, ikon fiber-optic dan burst partikel untuk LKS.
6. **Achievements/Certifications:** 10 medali prosedural, hover mengubah skala, emissive, dan rotasi.
7. **Contact:** globe dot-matrix instanced, lima arc, titik tujuan, cincin pulsa, rotasi lambat yang melambat saat hover.
8. **Canvas:** satu Canvas fixed global; scene band ditampilkan sesuai posisi kamera/scroll. Kamera mengikuti anchor section dan parallax pointer.
9. **Libraries dari `package.json`:** React 18.2.0, Three.js 0.161.0, R3F 8.15.16, Drei 9.99.4, Framer Motion 9.0.7, `@react-three/postprocessing` 2.16.2, Tailwind 3.2.6, Vite 5.0.8, TypeScript 5.2.2. Versi dependency memakai rentang caret, bukan lockfile yang tervalidasi.
10. **Environment / Float / postprocessing:** `Environment` + tiga `Lightformer` digunakan; `Float` tidak digunakan. Bloom dan Vignette digunakan saat quality normal; `PerformanceMonitor` menurunkan kualitas.
11. **Kualitas visual:** material rack/globe sudah memakai metalness, roughness, clearcoat, dan emissive; tiga warna cahaya serta fog juga ada. Sebagian garis/partikel memakai material Basic sehingga tidak menerima pencahayaan, sesuai tujuan glow.
12. **Masalah konkret:** ventilasi rack dibuat sebagai 36 mesh terpisah; ini menambah draw call yang bisa dihindari. Pulsasi skill graph belum mengirim partikel di sepanjang koneksi. Gerak kamera mengikuti scroll, tetapi belum diukur pada browser nyata.
13. **Interaksi:** HTML category buttons mengubah state graph dan panel daftar skill; raycast pointer langsung pada canvas belum terbukti karena canvas global diberi `pointer-events: none`. Kontrol HTML tetap dapat digunakan dengan keyboard.
14. **Aset:** scene 3D utama dibuat dari geometri prosedural, tanpa GLTF eksternal. Berkas CV/foto/portfolio/Poc legacy tidak ditemukan di folder paket ini; skrip preservasi melaporkan tujuh file tidak ditemukan dan tidak membuat pengganti.
15. **Build baseline:** `npm run build` gagal pada `tsc --noEmit` karena `vite/client` tidak ditemukan. `node_modules` tidak ada. `npm install --ignore-scripts --no-audit --no-fund` timeout pada lingkungan ini.
16. **FPS / draw calls:** belum dapat diukur di Chrome/Playwright karena dependency belum terpasang dan browser test runtime tidak tersedia. Ada HUD dev yang dapat menampilkan FPS dan `gl.info.render.calls` setelah situs dijalankan.
17. **360 px / 1440 px / Lighthouse:** belum diverifikasi. Tidak ada angka yang dilaporkan sebagai hasil ukur.
18. **Kesimpulan audit:** fondasi visual NOC sudah ada dan bukan scene statis sederhana. Kekurangan utama yang terlihat dari kode adalah kebutuhan mengurangi draw calls, menambah pulsa bergerak pada graph skills, serta memvalidasi interaksi/performa di browser nyata.
