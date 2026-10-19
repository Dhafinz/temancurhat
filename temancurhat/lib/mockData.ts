export interface BullyingSource {
  id: string;
  title: string;
  publisher: string;
  url: string;
  percentage: number;
  ageRange: string;
  menkoPmkQuote: string;
  summary: string;
  badge: string;
  date: string;
}

export interface CyberbullyingStat {
  name: string;
  value: number;
  percentage: number;
  fill: string;
  colorName: string;
  description: string;
}

export interface CoreValue {
  id: "iman" | "islam" | "ihsan";
  pillar: string;
  title: string;
  tagline: string;
  description: string;
  actionGuide: string[];
  reference: string;
  accent: {
    badgeBg: string;
    badgeText: string;
    border: string;
    gradient: string;
    iconBg: string;
  };
}

export interface DalilLandasan {
  surah: string;
  ayah: number;
  arabicText: string;
  translation: string;
  reflectionTitle: string;
  reflectionText: string;
  practicalTips: string[];
}

export interface VulnerableGroupFact {
  tag: string;
  title: string;
  headline: string;
  description: string;
  callout: string;
  impacts: string[];
}

// 1. Data Sumber Referensi Cyberbullying (Modular untuk penambahan sumber baru)
export const initialBullyingSources: BullyingSource[] = [
  {
    id: "detiknews-menko-pmk-45persen",
    title: "Menko PMK Soroti 45% Anak Usia 14-24 Tahun Jadi Korban Cyberbullying",
    publisher: "DetikNews",
    url: "https://news.detik.com/berita/d-6486000/menko-pmk-sebut-45-persen-anak-usia-14-24-tahun-jadi-korban-cyberbullying",
    percentage: 45,
    ageRange: "14 – 24 Tahun",
    menkoPmkQuote:
      "Perundungan di ruang digital telah menyentuh angka yang sangat memprihatinkan. Sekitar 45 persen anak dan remaja kita usia 14-24 tahun pernah mengalami cyberbullying. Ini alarm keras bagi kita semua untuk menjaga etika dan saling melindungi generasi muda di dunia maya.",
    summary:
      "Kutipan resmi Menko Pembangunan Manusia dan Kebudayaan (PMK) yang menyoroti tingginya paparan kekerasan siber di kalangan pelajar dan mahasiswa Indonesia. Laporan ini juga menggarisbawahi kerentanan khusus pada kelompok disabilitas yang kerap dijadikan bahan ejekan warganet.",
    badge: "Data Nasional",
    date: "Rilis Publikasi Resmi",
  },
  {
    id: "unicef-u-report-indonesia",
    title: "Survei U-Report UNICEF Indonesia: Realita Perundungan Siber Remaja",
    publisher: "UNICEF Indonesia / U-Report",
    url: "https://www.unicef.org/indonesia/id/perlindungan-anak/cyberbullying",
    percentage: 45,
    ageRange: "14 – 24 Tahun",
    menkoPmkQuote:
      "Kita tidak boleh membiarkan layar gawai menjadi tempat intimidasi. Anak-anak yang rentan dan berbeda kondisi fisik sering kali menjadi sasaran empuk perundungan tanpa ampun.",
    summary:
      "Hasil riset mengonfirmasi bahwa 45% anak muda pernah mengalami perundungan siber melalui media sosial, aplikasi pesan singkat, dan platform game daring.",
    badge: "Studi Remaja",
    date: "Data Pelengkap",
  },
];

// 2. Data Statistik Visualisasi Recharts (Donut & Bar chart)
export const cyberbullyingStatsData: CyberbullyingStat[] = [
  {
    name: "Korban Cyberbullying",
    value: 45,
    percentage: 45,
    fill: "#10b981", // Emerald 500 segar
    colorName: "Emerald",
    description: "Pernah mengalami intimidasi, cemoohan, atau pelecehan daring (Usia 14-24 tahun)",
  },
  {
    name: "Lainnya / Belum Terdata",
    value: 55,
    percentage: 55,
    fill: "#cbd5e1", // Slate 300 pastel netral ramah
    colorName: "Slate Pastel",
    description: "Belum pernah mengalami atau tidak melaporkan pengalaman perundungan siber",
  },
];


// 3. Fakta Tambahan: Kelompok Rentan & Disabilitas
export const vulnerableGroupFact: VulnerableGroupFact = {
  tag: "Sorotan Fakta Kritis",
  title: "Penyandang Disabilitas Kerap Jadi Bahan Olok-Olok",
  headline: "Perbedaan Fisik & Sensorik Bukan Bahan Candaan Virtual",
  description:
    "Catatan data dari berbagai lembaga perlindungan anak dan pemantauan media sosial menunjukkan fenomena memilukan: remaja penyandang disabilitas (fisik, intelektual, maupun sensorik) berisiko 2 hingga 3 kali lebih sering menjadi objek ejekan, pembuatan meme bernada menghina, serta persekusi komentar di media sosial.",
  callout:
    "Merendahkan ciptaan Allah dan mempermalukan kekurangan fisik sesama manusia merupakan bentuk kezaliman nyata yang dilarang keras dalam syariat.",
  impacts: [
    "Menyebabkan trauma psikologis mendalam dan isolasi sosial.",
    "Mengikis rasa percaya diri untuk berinteraksi di ruang publik.",
    "Membuat korban takut mengakses internet untuk kebutuhan belajar.",
  ],
};

// 4. Landasan Agama: QS. Al-Hujurat Ayat 11
export const dalilAlHujurat11: DalilLandasan = {
  surah: "QS. Al-Hujurat",
  ayah: 11,
  arabicText:
    "يٰٓاَيُّهَا الَّذِيْنَ اٰمَنُوا لَا يَسْخَرْ قَوْمٌ مَّنْ قَوْمٍ عَسٰى اَنْ يَكُوْنُوْا خَيْرًا مِّنْهُمْ وَلَا نِسَآءٌ مِّنْ نِّسَآءٍ عَسٰى اَنْ يَكُنَّ خَيْرًا مِّنْهُنَّۚ وَلَا تَلْمُزُوۡا اَنۡفُسَكُمۡ وَلَا تَنَابَزُوۡا بِالۡالۡقَابِؕ بِئْسَ الِاسْمُ الْفُسُوْقُ بَعْدَ الْاِيْمَانِۚ وَمَنْ لَّمْ يَتُبْ فَاُولٰۤىِٕكَ هُمُ الظَّالِمُونَ",
  translation:
    "\"Wahai orang-orang yang beriman! Janganlah suatu kaum mengolok-olok kaum yang lain, (karena) boleh jadi mereka (yang diolok-olok) lebih baik dari mereka. Dan jangan pula perempuan-perempuan (mengolok-olok) perempuan lain, (karena) boleh jadi perempuan yang (diolok-olok) lebih baik dari perempuan yang (mengolok-olok). Janganlah kamu saling mencela dan saling memanggil dengan gelar-gelar yang buruk...\" (QS. Al-Hujurat: 11)",
  reflectionTitle: "Kotak Refleksi: Adab Islam di Era Ketikan Digital",
  reflectionText:
    "Islam secara tegas melarang segala bentuk olok-olok, perendahan martabat, dan pemberian julukan yang menyakitkan hati sesama manusia. Larangan ini berlaku mutlak, baik diucapkan langsung secara lisan maupun diketik di balik layar anonim media sosial. Boleh jadi orang yang kita rendahkan memiliki kedudukan yang jauh lebih mulia di hadapan Allah SWT.",
  practicalTips: [
    "Hapus komentar sinis sebelum menekan tombol kirim.",
    "Jangan ikut menertawakan atau membagikan video yang mempermalukan aib orang lain.",
    "Panggil teman dengan nama terbaik dan sebutan yang mereka sukai.",
  ],
};

// 5. 3 Kartu Nilai Utama: Iman, Islam, Ihsan
export const coreValuesData: CoreValue[] = [
  {
    id: "iman",
    pillar: "Pilar Iman",
    title: "Yakin Allah Maha Melihat",
    tagline: "Muraqabatullah di Ruang Digital",
    description:
      "Keyakinan mendalam bahwa Allah SWT Maha Mengawasi (Al-Bashir) dan Maha Mendengar (As-Sami') setiap huruf yang kita ketik, setiap komentar yang kita unggah, serta setiap pesan rahasia yang kita kirimkan. Tidak ada yang luput dari catatan malaikat Raqib dan Atid.",
    actionGuide: [
      "Menyadari setiap jejak digital akan dipertanggungjawabkan di Yaumul Hisab.",
      "Mengingat bahwa tabir anonimitas tidak bisa menyembunyikan perbuatan kita dari pandangan Allah.",
      "Menjadikan rasa takut dan cinta kepada Allah sebagai rem utama jempol kita.",
    ],
    reference: "QS. Al-Hadid: 4 & QS. Qaf: 18",
    accent: {
      badgeBg: "bg-emerald-100",
      badgeText: "text-emerald-800",
      border: "border-emerald-200",
      gradient: "from-emerald-50 via-white to-transparent",
      iconBg: "bg-emerald-100 text-emerald-700",
    },
  },
  {
    id: "islam",
    pillar: "Pilar Islam",
    title: "Adab Bertutur & Menjaga Jari",
    tagline: "Menjalankan Syariat dalam Berkomunikasi",
    description:
      "Wujud keislaman yang sejati tercermin dari keselamatan orang lain dari gangguan lisan, tulisan, dan tangan kita. Menjalankan syariat dengan pantang mencela, pantang menyebarkan aib sesama, serta senantiasa berkata baik atau memilih diam.",
    actionGuide: [
      "Mengamalkan hadits Nabi: 'Barang siapa beriman kepada Allah dan hari akhir, hendaklah berkata baik atau diam.'",
      "Tidak ikut menghujat (cyber mobbing) atau menyebarkan gosip/hoaks tanpa tabayyun.",
      "Menjaga kehormatan saudara seiman sebagaimana menjaga kehormatan diri sendiri.",
    ],
    reference: "HR. Bukhari & Muslim | QS. Al-Hujurat: 11-12",
    accent: {
      badgeBg: "bg-teal-100",
      badgeText: "text-teal-800",
      border: "border-teal-200",
      gradient: "from-teal-50 via-white to-transparent",
      iconBg: "bg-teal-100 text-teal-700",
    },
  },
  {
    id: "ihsan",
    pillar: "Pilar Ihsan",
    title: "Berbuat Baik Walau Anonim",
    tagline: "Kebaikan Melampaui Pengakuan Manusia",
    description:
      "Tingkatan akhlak tertinggi di mana kita beribadah dan bermedia sosial seolah-olah melihat Allah. Kesadaran untuk selalu santun, menebarkan energi positif, dan berani menjadi pelindung bagi teman yang dirundung walau akun kita tidak dikenal publik.",
    actionGuide: [
      "Mengirimkan pesan penguat secara privat (DM) kepada teman yang sedang diserang komentar jahat.",
      "Menjadi 'Upstander' yang berani menegur komentar keji secara bijak dan santun.",
      "Menggunakan media sosial murni sebagai ladang amal jariyah dan dakwah kebaikan.",
    ],
    reference: "Hadits Jibril tentang Ihsan | HR. Muslim",
    accent: {
      badgeBg: "bg-sky-100",
      badgeText: "text-sky-800",
      border: "border-sky-200",
      gradient: "from-sky-50 via-white to-transparent",
      iconBg: "bg-sky-100 text-sky-700",
    },
  },
];

// 6. Data Guru BK & Konseling
export interface TeacherBK {
  id: string;
  name: string;
  title: string;
  specialization: string;
  status: "Online" | "Offline";
  caringQuote: string;
  initials: string;
  experienceYears: number;
  availableDays: string;
  avatarBg: string;
}

export interface InPersonAppointment {
  id: string;
  bookingCode: string;
  studentId: string;
  teacherId: string;
  teacherName: string;
  location: string;
  dateTime: string;
  status: "Menunggu" | "Dikonfirmasi" | "Selesai";
  createdAt: string;
}

export interface BKChatMessage {
  id: string;
  sessionId: string;
  senderRole: "student" | "teacher";
  senderName: string;
  text: string;
  timestamp: string;
}

export const initialTeachersBK: TeacherBK[] = [
  {
    id: "guru-siti-rahmawati",
    name: "Dra. Hj. Siti Rahmawati, M.Pd., Kons.",
    title: "Koordinator Bimbingan Konseling",
    specialization: "Pencegahan Cyberbullying & Pemulihan Trauma Emosional",
    status: "Online",
    caringQuote:
      "Setiap anak berhak merasa aman saat belajar dan bersosialisasi. Ceritakan apa pun yang mengganjal hatimu, ibu siap mendengarkan tanpa menghakimi.",
    initials: "SR",
    experienceYears: 14,
    availableDays: "Senin – Jumat (08.00 - 15.00)",
    avatarBg: "from-emerald-400 to-teal-500",
  },
  {
    id: "guru-bambang-prakoso",
    name: "Bambang Prakoso, S.Psi., Gr.",
    title: "Guru BK & Konselor Remaja",
    specialization: "Kesehatan Mental Remaja & Manajemen Stres Media Sosial",
    status: "Online",
    caringQuote:
      "Kamu tidak lemah karena merasa sedih atau terluka oleh komentar orang lain. Mencari teman bicara adalah bukti keberanian terbesarmu.",
    initials: "BP",
    experienceYears: 8,
    availableDays: "Senin – Sabtu (08.30 - 14.30)",
    avatarBg: "from-teal-500 to-cyan-600",
  },
  {
    id: "guru-nurul-aisyah",
    name: "Nurul Aisyah, S.Pd., M.Si.",
    title: "Konselor Sebaya & Pengembangan Diri",
    specialization: "Resolusi Konflik Antarteman & Penguatan Rasa Percaya Diri",
    status: "Online",
    caringQuote:
      "Ruang BK bukan tempat siswa bersalah. Ruang BK adalah oasis hangat untuk saling menguatkan dan menemukan jalan keluar terbaik bersama.",
    initials: "NA",
    experienceYears: 10,
    availableDays: "Selasa – Jumat (09.00 - 15.00)",
    avatarBg: "from-emerald-500 to-green-600",
  },
];

export const APPOINTMENT_LOCATIONS = [
  "Ruang BK Privat (Lantai 2 - Tenang & Kedap Suara)",
  "Taman Sekolah / Gazebo Hijau (Terbuka & Santai)",
  "Perpustakaan Sudut Literasi Tenang",
  "Lainnya (Bisa disesuaikan demi kenyamananmu)",
];

export const initialSampleAppointments: InPersonAppointment[] = [
  {
    id: "apt-1",
    bookingCode: "BK-7892",
    studentId: "Siswa #4821",
    teacherId: "guru-siti-rahmawati",
    teacherName: "Dra. Hj. Siti Rahmawati, M.Pd., Kons.",
    location: "Ruang BK Privat (Lantai 2 - Tenang & Kedap Suara)",
    dateTime: "2026-10-21 pk 10:00 WIB",
    status: "Dikonfirmasi",
    createdAt: "2026-10-19 08:30",
  },
  {
    id: "apt-2",
    bookingCode: "BK-3410",
    studentId: "Siswa #1209",
    teacherId: "guru-bambang-prakoso",
    teacherName: "Bambang Prakoso, S.Psi., Gr.",
    location: "Taman Sekolah / Gazebo Hijau (Terbuka & Santai)",
    dateTime: "2026-10-22 pk 13:30 WIB",
    status: "Menunggu",
    createdAt: "2026-10-19 09:15",
  },
];

