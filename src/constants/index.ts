import type { ExperienceItem, Project, SkillGroup } from '../types';

export const site = {
  name: 'Alfarizqi',
  handle: 'alrbughunt',
  title: 'IT Infrastructure · Linux System Administration · Network Engineering · Junior Cyber Security',
  location: 'Kabupaten Tasikmalaya, Jawa Barat',
  email: 'alfarizkiar123@gmail.com',
  whatsapp: 'https://wa.me/6285974707051',
  github: 'https://github.com/alrbughunt',
  linkedin: 'https://www.linkedin.com/in/alfarizqi-009673366/',
  cv: '/CV_Alfarizqi.pdf',
  portfolioPdf: '/Portfolio_Alfarizqi.pdf',
  photo: '/Foto-Alfarizqi.jpg',
  pageTitle: 'Alfarizqi | IT Infrastructure, Linux, Network & Cyber Security',
};

export const sceneVisual = {
  terminalTitle: 'NOC / LIVE SHELL',
  terminalCommands: ['ping -c 4 gateway.local', 'nmap -sV 192.168.1.0/24', 'wazuh-alert --severity high'],
  loaderMark: 'NOC',
  loaderTitle: 'INITIALIZING INFRASTRUCTURE',
  loaderLoading: 'BOOT SEQUENCE IN PROGRESS',
  loaderReady: 'SYSTEM ONLINE',
};

export const ui = {
  skipLink: 'Lewati ke konten utama',
  menuOpen: 'Buka navigasi',
  menuClose: 'Tutup navigasi',
  navContact: 'Kontak',
  profileLabel: 'PROFILE',
  focusArea: 'FOCUS AREA',
  systemCode: 'SYS / 01',
  projectMeta: 'PROJECT',
  technicalOverview: 'TECH STACK / OVERVIEW',
  skillsShowcaseTitle: 'Belajar dengan membangun, menguji, dan memantau.',
  skillsShowcaseDescription: 'Teknologi berikut dikelompokkan berdasarkan area praktik. Daftar tetap tersedia sebagai teks agar mudah dibaca, dicari, dan diakses tanpa visual 3D.',
  skillsShowcaseEyebrow: 'TECH STACK / OVERVIEW',
  focusAreaItems: ['Infrastructure', 'Network', 'Security'],
  techSphereLabels: ['MikroTik', 'Cisco', 'Linux', 'Ubuntu', 'Debian', 'Proxmox', 'Wazuh', 'Nginx'],
  githubActivity: 'Lihat aktivitas GitHub',
  timelineDateUnavailable: 'PERIODE BELUM DIISI',
  backToTop: 'Kembali ke bagian atas',
  brandHome: 'Kembali ke beranda Alfarizqi',
  scrollHint: 'Gulir untuk melihat lebih lanjut',
  externalLink: 'Membuka tautan eksternal di tab baru',
  downloadCv: 'Download CV',
  downloadPortfolio: 'Download Portfolio',
  viewProjects: 'Lihat Proyek',
  contactWhatsapp: 'Hubungi via WhatsApp',
  contactEmail: 'Kirim Email',
  viewGithub: 'GitHub',
  viewLinkedin: 'LinkedIn',
  openDemo: 'Demo',
  openRepository: 'Repositori',
  noProjectLinks: 'Tautan proyek belum tersedia.',
  projectLinksAria: 'Tautan proyek',
  skillListAria: 'Daftar kemampuan teknis',
  skillSelectHint: 'Pilih kategori untuk menyorot node dan melihat daftar skill.',
  skillPanelClose: 'Tutup detail kategori',
  skillSelectedLabel: 'Kategori terpilih',
  primaryNavigation: 'Navigasi utama',
  socialLinks: 'Tautan profesional',
  heroVisual: 'Ilustrasi 3D server rack dan terminal',
  skillsVisual: 'Ilustrasi 3D simpul jaringan',
  contactVisual: 'Ilustrasi 3D globe jaringan',
  footer: 'Dibangun dengan React, TypeScript, Three.js, dan perhatian pada aksesibilitas.',
  credit: 'Pola pengalaman 3D terinspirasi dari reactjs18-3d-portfolio oleh ladunjexa, berlisensi MIT. Scene 3D pada situs ini menggunakan geometri buatan sendiri, tanpa model 3D eksternal.',
  copyright: 'Hak cipta konten © Alfarizqi.',
};

export const navigation = [
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Experience', href: '#experience', id: 'experience' },
  { label: 'Achievement', href: '#achievement', id: 'achievement' },
  { label: 'Certification', href: '#certification', id: 'certification' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

export const hero = {
  eyebrow: 'PORTOFOLIO PERSONAL / 2026',
  greeting: 'Halo, saya',
  name: 'Alfarizqi',
  role: 'IT Infrastructure & Network Enthusiast',
  description: 'Fresh graduate SMK TJKT yang membangun pengalaman lewat praktik NOC & FOC di ISP, administrasi Linux Server, monitoring Wazuh SIEM/Cacti, konfigurasi MikroTik/Cisco, FTTH, dan kompetisi Cyber Security.',
  highlights: [
    'PKL ISP: NOC & FOC PT Bonanzanet',
    'Juara 1 LKS Cyber Security Kabupaten',
    'Homelab: Linux · Proxmox · Wazuh',
  ],
  statusLabel: 'Terbuka untuk peluang entry-level',
  captionLabel: 'FOCUS AREA',
};

export const about = {
  eyebrow: 'PERKENALAN',
  title: 'Membangun sistem. Memahami jaringan. Menjaga keamanan.',
  description: 'Lulusan SMK Teknik Jaringan Komputer dan Telekomunikasi yang membangun kemampuan lewat praktik laboratorium, homelab, kompetisi Cyber Security, dan PKL di lingkungan ISP. Fokus: Linux Server, Network Engineering, IT Infrastructure, NOC operation, monitoring, dan Cyber Security dasar. Terbiasa membangun lab, menguji konfigurasi, membaca log, troubleshooting, lalu mendokumentasikan hasilnya.',
  cards: [
    { number: '01', title: 'Linux & Infrastructure', description: 'Administrasi Linux Server, layanan web, hardening dasar, dan virtualisasi.' },
    { number: '02', title: 'Network Engineering', description: 'MikroTik, Cisco, VLAN, routing, firewall, failover, dan FTTH.' },
    { number: '03', title: 'Monitoring', description: 'Monitoring keamanan dan infrastruktur menggunakan Wazuh SIEM serta Cacti.' },
    { number: '04', title: 'Cyber Security', description: 'CTF, web exploitation, vulnerability assessment, dan responsible disclosure.' },
  ],
};

export const skills: SkillGroup[] = [
  { id: 'networking', title: 'Networking', summary: 'Perancangan, konfigurasi, dan troubleshooting jaringan.', mark: 'NET', items: ['MikroTik', 'Cisco', 'VLAN', 'Inter-VLAN', 'DHCP', 'NAT', 'RIP', 'OSPF', 'BGP', 'Firewall', 'Load Balancing', 'Failover'] },
  { id: 'linux', title: 'Linux', summary: 'Administrasi server Linux dan layanan pendukung.', mark: 'LIN', items: ['Ubuntu Server', 'Debian', 'CentOS (hardening)', 'SSH', 'Samba', 'ProFTPD', 'aaPanel'] },
  { id: 'infrastructure', title: 'Infrastructure', summary: 'Komponen jaringan akses dan layanan server.', mark: 'INF', items: ['FTTH', 'OLT', 'ONT', 'ODP', 'Apache', 'Nginx', 'MariaDB', 'MySQL'] },
  { id: 'cyber-security', title: 'Cyber Security', summary: 'Praktik pengamanan host dan analisis dasar keamanan.', mark: 'SEC', items: ['Linux Hardening', 'SSH Hardening', 'Suricata', 'Snort', 'Fail2ban', 'Auditd', 'Nmap', 'Wireshark', 'Burp Suite'] },
  { id: 'monitoring', title: 'Monitoring', summary: 'Pemantauan event, log, dan performa infrastruktur.', mark: 'MON', items: ['Wazuh SIEM', 'Cacti', 'Log Analysis', 'Rule Tuning'] },
  { id: 'virtualization', title: 'Virtualization', summary: 'Lingkungan virtual untuk lab dan simulasi layanan.', mark: 'VRT', items: ['Proxmox VE', 'VM Ubuntu Server', 'Windows Server basic', 'Moodle', 'FlyExam'] },
  { id: 'fiber-optic', title: 'Fiber Optic', summary: 'Pekerjaan dasar instalasi dan pengujian jaringan fiber.', mark: 'FOC', items: ['FTTH Installation', 'Fusion Splicing', 'OPM', 'OLS', 'Analisis dasar OTDR'] },
  { id: 'web-cms', title: 'Web & CMS', summary: 'Pengelolaan situs dan konfigurasi hosting.', mark: 'WEB', items: ['WordPress', 'Hosting Configuration', 'Theme', 'Plugin', 'Content Management'] },
];

export const projects: Project[] = [
  { number: '01', title: 'Linux Hardening', description: 'Pengamanan akses dan layanan Linux dengan konfigurasi SSH hardening, firewall, Fail2ban, Auditd, dan OpenVPN.', tags: ['SSH', 'Fail2ban', 'Auditd', 'OpenVPN'], visual: 'shield' },
  { number: '02', title: 'Linux Server', description: 'Instalasi dan konfigurasi layanan Linux Server untuk simulasi produksi dan pembelajaran administrasi sistem.', tags: ['Ubuntu', 'Debian', 'CentOS', 'Apache', 'Nginx'], visual: 'terminal' },
  { number: '03', title: 'Proxmox VE Homelab', description: 'Lab virtual untuk Ubuntu Server, Windows Server basic, Wazuh, Moodle, dan FlyExam.', tags: ['Proxmox VE', 'VM', 'Wazuh', 'Moodle'], visual: 'server' },
  { number: '04', title: 'Wazuh SIEM', description: 'Praktik monitoring keamanan server, analisis log, dan penyesuaian rule untuk kebutuhan lab.', tags: ['Wazuh', 'Cacti', 'Log Analysis', 'Monitoring'], visual: 'monitor' },
  { number: '05', title: 'Company Website', description: 'Pembuatan website perusahaan menggunakan WordPress, termasuk instalasi CMS, hosting, database, tema, plugin, dan konten.', tags: ['WordPress', 'Apache', 'Nginx', 'MariaDB'], visual: 'web' },
  { number: '06', title: 'Network Lab', description: 'Simulasi MikroTik dan Cisco untuk latihan VLAN, routing, NAT, firewall, load balancing, dan failover.', tags: ['MikroTik', 'Cisco', 'VLAN', 'OSPF', 'BGP'], visual: 'network' },
];

export const experience: ExperienceItem[] = [
  { organization: 'SMK YPC Tasikmalaya', role: 'Siswa TJKT', description: 'Membangun fondasi jaringan komputer, Linux Server, dan infrastruktur IT.', date: '', kind: 'education' },
  { organization: 'Homelab & Praktik Laboratorium', role: 'Praktik Infrastruktur dan Jaringan', description: 'Praktik Proxmox VE, Ubuntu Server, Debian, CentOS, Wazuh SIEM, Cacti, MikroTik, dan Cisco.', date: '', kind: 'practice' },
  { organization: 'PT Bonanzanet', role: 'PKL · NOC & FOC', description: 'Monitoring jaringan ISP, troubleshooting awal pelanggan, koordinasi teknisi, dokumentasi gangguan, FTTH, OPM/OLS, dan analisis dasar OTDR.', date: '', kind: 'work' },
  { organization: 'LKS Kabupaten Tasikmalaya', role: 'Juara 1 · Cyber Security', description: 'Meraih juara pertama pada LKS tingkat kabupaten bidang Cyber Security.', date: '', kind: 'award' },
  { organization: 'LKS Provinsi Jawa Barat', role: 'Peserta · Cyber Security', description: 'Mengikuti LKS tingkat provinsi Jawa Barat bidang Cyber Security.', date: '2026', kind: 'award' },
  { organization: 'Hall of Fame & Vulnerability Disclosure', role: 'Responsible Disclosure', description: 'Mendapat pengakuan dari beberapa CSIRT daerah serta pengakuan kerentanan dari BRI dan CIMB Niaga.', date: '', kind: 'research' },
  { organization: 'Ekstrakurikuler Cyber Security', role: 'Ketua', description: 'Membimbing anggota dalam Linux Server, jaringan, hardening Linux, dan praktik keamanan dasar.', date: '', kind: 'community' },
];

export const experienceKindLabels: Record<ExperienceItem['kind'], string> = {
  education: 'PENDIDIKAN',
  practice: 'PRAKTIK',
  work: 'PENGALAMAN',
  award: 'KOMPETISI',
  community: 'KOMUNITAS',
  research: 'DISCLOSURE',
};

export const achievements = [
  { title: 'Juara 1 LKS Kabupaten Tasikmalaya', detail: 'Bidang Cyber Security', type: 'COMPETITION' },
  { title: 'Peserta LKS Provinsi Jawa Barat', detail: 'Bidang Cyber Security · 2026', type: 'COMPETITION' },
  { title: 'Hall of Fame CSIRT daerah', detail: 'Pengakuan dari beberapa CSIRT daerah', type: 'RECOGNITION' },
  { title: 'Pengakuan kerentanan BRI', detail: 'Vulnerability disclosure', type: 'DISCLOSURE' },
  { title: 'Pengakuan kerentanan CIMB Niaga', detail: 'Vulnerability disclosure', type: 'DISCLOSURE' },
  { title: 'Aktif mengikuti CTF', detail: 'Latihan pemecahan tantangan keamanan', type: 'PRACTICE' },
];

export const certifications = [
  { title: 'BNSP Junior Network Administrator', provider: 'BNSP' },
  { title: 'Cyber Security Bootcamp', provider: 'IDN · 3 bulan' },
  { title: 'Practical Web Pentesting', provider: 'CodeLamp Batch 1 · Predikat A+' },
  { title: 'TOEFL / EPT', provider: 'Skor 537' },
];

export const contact = {
  eyebrow: 'KONTAK',
  title: 'Terbuka untuk peluang IT Infrastructure, Network, Linux, NOC, dan Junior Cyber Security.',
  description: 'Hubungi saya untuk peluang kerja entry-level, diskusi teknis, atau kolaborasi yang relevan dengan bidang infrastruktur dan keamanan IT.',
  locationLabel: 'Lokasi',
  emailLabel: 'Email',
  whatsappLabel: 'WhatsApp',
  secondaryLabel: 'Profil & dokumen',
};

export const sections = {
  about: { eyebrow: '01 / ABOUT', title: 'Fokus pada sistem yang berjalan, jaringan yang stabil, dan keamanan dasar.' },
  skills: { eyebrow: '02 / SKILLS', title: 'Area teknis yang saya pelajari dan praktikkan.', description: 'Daftar kemampuan berikut merangkum teknologi yang pernah digunakan dalam pembelajaran, homelab, dan praktik.' },
  projects: { eyebrow: '03 / PROJECTS', title: 'Praktik dan proyek teknis.', description: 'Kumpulan praktik infrastruktur, jaringan, monitoring, dan keamanan. Tautan demo atau repositori akan ditampilkan setelah tersedia.' },
  experience: { eyebrow: '04 / EXPERIENCE', title: 'Pendidikan, praktik, dan pengalaman.', description: 'Urutan mengikuti data yang tersedia. Periode yang belum terkonfirmasi sengaja dikosongkan.' },
  achievement: { eyebrow: '05 / ACHIEVEMENT', title: 'Pencapaian dan pengakuan.', description: 'Daftar ini memuat kompetisi, pengakuan, dan aktivitas yang diberikan dalam data portofolio.' },
  certification: { eyebrow: '06 / CERTIFICATION', title: 'Sertifikasi dan pelatihan.', description: 'Kredensial yang tercantum berdasarkan informasi yang tersedia.' },
};
