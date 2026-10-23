import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const publicDir = resolve(root, 'public');
const protectedFiles = [
  'CV_Alfarizqi.pdf',
  'Portfolio_Alfarizqi.pdf',
  'Foto-Alfarizqi.jpg',
  'poc.html',
  'poc1.html',
  'poc2.html',
  'download-test.html',
];

mkdirSync(publicDir, { recursive: true });
let copied = 0;
let missing = 0;

for (const filename of protectedFiles) {
  const source = resolve(root, filename);
  const destination = resolve(publicDir, filename);

  if (!existsSync(source)) {
    if (!existsSync(destination)) {
      missing += 1;
      console.warn(`[preserve:assets] Belum ditemukan: ${filename}. Tidak membuat file pengganti.`);
    }
    continue;
  }

  if (existsSync(destination)) {
    const sourceBytes = readFileSync(source);
    const destinationBytes = readFileSync(destination);
    if (!sourceBytes.equals(destinationBytes)) {
      console.warn(`[preserve:assets] Konflik ${filename}: file di public/ dipertahankan dan tidak ditimpa.`);
    }
    continue;
  }

  copyFileSync(source, destination);
  copied += 1;
  console.log(`[preserve:assets] Disalin tanpa mengubah sumber: ${filename} -> public/${filename}`);
}

console.log(`[preserve:assets] Selesai. Disalin: ${copied}. Belum ditemukan: ${missing}. File sumber tidak dihapus atau diubah.`);
