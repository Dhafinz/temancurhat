/**
 * Knowledge Base TemanCurhat AI
 * Basis Pengetahuan Terlatih: Cyberbullying, Hadits Islam, Dampak, Solusi, Kasus Viral, & Rekomendasi Video
 */

export interface HadithDalilItem {
  id: string;
  topic: string;
  source: string;
  arabic: string;
  translation: string;
  reflection: string;
  keywords: string[];
}

export interface ViralCaseItem {
  id: string;
  title: string;
  year: string;
  platform: string;
  summary: string;
  chronology: string;
  impactOnVictim: string;
  legalAndSocialOutcome: string;
  islamicPerspective: string;
  keyTakeaways: string[];
}

export interface VideoRecommendationItem {
  id: string;
  title: string;
  channel: string;
  duration: string;
  category: "edukasi" | "kasus" | "upstander" | "psikologi";
  youtubeId: string;
  url: string;
  thumbnail: string;
  summary: string;
  highlights: string[];
}

export interface BullyingImpactSolutionItem {
  category: "dampak" | "solusi";
  target: "korban" | "pelaku" | "bystander" | "sekolah";
  title: string;
  points: string[];
}

// 1. KUMPULAN HADITS & DALIL ISLAM TERKAIT ADAB DIGITAL & CYBERBULLYING
export const ISLAMIC_DALIL_KNOWLEDGE: HadithDalilItem[] = [
  {
    id: "dalil-al-hujurat-11",
    topic: "Larangan Mengolok-olok, Mencela, dan Menjuluki dengan Gelar Buruk",
    source: "QS. Al-Hujurat: 11",
    arabic:
      "يٰٓاَيُّهَا الَّذِيْنَ اٰمَنُوا لَا يَسْخَرْ قَوْمٌ مَّنْ قَوْمٍ عَسٰى اَنْ يَكُوْنُوْا خَيْرًا مِّنْهُمْ وَلَا نِسَآءٌ مِّنْ نِّسَآءٍ عَسٰى اَنْ يَكُنَّ خَيْرًا مِّنْهُنَّۚ وَلَا تَلْمُزُوۡا اَنۡفُسَكُمۡ وَلَا تَنَابَزُوۡا بِالۡالۡقَابِؕ بِئْسَ الِاسْمُ الْفُسُوْقُ بَعْدَ الْاِيْمَانِۚ وَمَنْ لَّمْ يَتُبْ فَاُولٰۤىِٕكَ هُمُ الظَّالِمُونَ",
    translation:
      "Wahai orang-orang yang beriman! Janganlah suatu kaum mengolok-olok kaum yang lain, (karena) boleh jadi mereka (yang diolok-olok) lebih baik dari mereka. Dan jangan pula perempuan-perempuan (mengolok-olok) perempuan lain, (karena) boleh jadi perempuan (yang diolok-olok) lebih baik dari perempuan (yang mengolok-olok). Janganlah kamu saling mencela dan saling memanggil dengan gelar-gelar yang buruk. Seburuk-buruk panggilan adalah (panggilan) yang buruk setelah beriman. Dan barang siapa tidak bertobat, maka mereka itulah orang-orang yang zalim.",
    reflection:
      "Ayat ini adalah fondasi etika bermedia sosial dalam Islam. Di balik layar gawai, jangan pernah mengejek fisik, kemampuan, status, atau latar belakang seseorang. Orang yang kita anggap remeh bisa jadi jauh lebih mulia di hadapan Allah SWT.",
    keywords: ["olok", "ejek", "julukan", "hujat", "hujatan", "mencela", "hujat netizen", "hujatan"],
  },
  {
    id: "hadith-selamat-lisan-tangan",
    topic: "Definisi Muslim Sejati: Menjaga Lisan dan Tangan (Jempol Digital)",
    source: "HR. Bukhari no. 10 & HR. Muslim no. 40",
    arabic: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    translation:
      "Seorang muslim (yang sejati) adalah orang yang kaum muslim lainnya selamat dari gangguan lisan dan tangannya.",
    reflection:
      "Di zaman sekarang, 'tangan' mencakup jari jempol yang mengetik komentar, membagikan konten merendahkan, dan mengirim pesan perundungan. Keislaman seseorang diuji dari bagaimana jempolnya tidak melukai orang lain.",
    keywords: ["lisan", "tangan", "jempol", "muslim sejati", "menjaga lisan", "menyakiti"],
  },
  {
    id: "hadith-berkata-baik-atau-diam",
    topic: "Adab Berbicara di Ruang Publik: Berkata Baik atau Diam",
    source: "HR. Bukhari no. 6018 & HR. Muslim no. 47",
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    translation:
      "Barang siapa yang beriman kepada Allah dan hari akhir, maka hendaklah ia berkata yang baik atau (jika tidak bisa) hendaklah ia diam.",
    reflection:
      "Sebelum memposting komentar, ketikkan hanya hal yang bermanfaat dan menyemangati. Jika jari kita ingin mengetik sindiran, sarkasme jahat, atau caci maki, memilih diam adalah bentuk ibadah dan perlindungan diri dari hisab.",
    keywords: ["berkata baik", "diam", "komentar baik", "beriman", "hari akhir"],
  },
  {
    id: "hadith-al-muflis-bangkrut",
    topic: "Peringatan Keras Bagi Pelaku Bullying: Orang Bangkrut di Hari Kiamat",
    source: "HR. Muslim no. 2581",
    arabic:
      "أَتَدْرُونَ مَا الْمُفْلِسُ؟ قَالُوا: الْمُفْلِسُ فِينَا مَنْ لاَ دِرْهَمَ لَهُ وَلاَ مَتَاعَ. فَقَالَ: إِنَّ الْمُفْلِسَ مِنْ أُمَّتِي يَأْتِي يَوْمَ الْقِيَامَةِ بِصَلاَةٍ وَصِيَامٍ وَزَكَاةٍ، وَيَأْتِي قَدْ شَتَمَ هَذَا، وَقَذَفَ هَذَا، وَأَكَلَ مَالَ هَذَا، وَسَفَكَ دَمَ هَذَا، وَضَرَبَ هَذَا، فَيُعْطَى هَذَا مِنْ حَسَنَاتِهِ، وَهَذَا مِنْ حَسَنَاتِهِ...",
    translation:
      "Tahukah kalian siapa orang yang bangkrut (muflis)? Sahabat menjawab: Orang bangkrut di antara kami adalah orang yang tidak memiliki dirham dan harta. Rasulullah bersabda: Orang yang bangkrut dari umatku adalah orang yang datang pada hari kiamat membawa pahala shalat, puasa, dan zakat, tetapi ia mencaci orang ini, menuduh orang ini (fitnah), memakan harta orang ini, menumpahkan darah orang ini, dan memukul orang ini. Lalu kebaikannya diberikan kepada korban-korbannya. Jika kebaikannya telah habis sebelum tuntas kewajibannya, maka dosa-dosa korban diambil dan ditimpakan kepadanya, kemudian ia dilemparkan ke dalam neraka.",
    reflection:
      "Peringatan maha dahsyat bagi netizen dan pelaku bullying. Jangan sampai ibadah bertahun-tahun lenyap seketika hanya karena jempol gemar menghujat dan memfitnah orang lain di media sosial.",
    keywords: ["muflis", "bangkrut", "pahala hilang", "fitnah", "menuduh", "dosa di akhirat"],
  },
  {
    id: "hadith-upstander-membela-saudara",
    topic: "Keutamaan Menjadi Upstander: Membela Korban yang Dirundung",
    source: "HR. Ahmad no. 27622 & HR. At-Tirmidzi no. 1931",
    arabic: "مَنْ رَدَّ عَنْ عِرْضِ أَخِيهِ رَدَّ اللَّهُ عَنْ وَجْهِهِ النَّارَ يَوْمَ الْقِيَامَةِ",
    translation:
      "Barang siapa membela kehormatan saudaranya (yang sedang digunjingkan atau dirundung), maka Allah akan menghalangi api neraka dari wajahnya pada hari kiamat.",
    reflection:
      "Jangan menjadi penonton pasif (bystander) yang membiarkan teman dirundung di grup chat atau medsos. Keberanian kita membela korban dan menolak perundungan berpahala jaminan perlindungan dari siksa neraka.",
    keywords: ["upstander", "bela teman", "bela korban", "kehormatan", "melindungi teman"],
  },
  {
    id: "doa-penenang-hati-terzalimi",
    topic: "Doa Penenteram Jiwa & Penawar Kesedihan saat Terzalimi",
    source: "HR. Bukhari no. 2893 & HR. Abu Dawud",
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ",
    translation:
      "Ya Allah, sesungguhnya aku berlindung kepada-Mu dari rasa gelisah dan duka cita, dari rasa lemah dan malas, dari sifat pengecut dan kikir, serta dari lilitan utang dan tekanan/kesewenang-wenangan orang lain.",
    reflection:
      "Doa ini sangat dianjurkan dibaca oleh siapa pun yang merasa tertindas, sedih, atau merasa sesak akibat perlakuan buruk orang lain. Menyerahkan hati kepada Allah mendatangkan ketenangan sejati.",
    keywords: ["doa", "penenang hati", "sedih", "duka", "hasbunallah", "terzalimi", "dzikir"],
  },
];

// 2. DATA KASUS VIRAL CYBERBULLYING DI INDONESIA BESERTA PEMBELAJARAN
export const VIRAL_CYBERBULLYING_CASES: ViralCaseItem[] = [
  {
    id: "kasus-mahasiswa-disabilitas-gunadarma",
    title: "Kasus Perundungan Mahasiswa Berkebutuhan Khusus (Viral Video Kampus)",
    year: "Kasus Nasional Penting",
    platform: "Video Viral Media Sosial & Grup Kampus",
    summary:
      "Seorang mahasiswa berkebutuhan khusus ditarik tasnya, ditertawakan, dan diintimidasi oleh sejumlah mahasiswa lain sambil direkam video yang kemudian viral dan memicu kemarahan publik nasional.",
    chronology:
      "Korban yang sedang berjalan hendak kuliah dihalang-halangi dan tas ranselnya ditarik hingga terhuyung. Korban membalas melempar tempat sampah karena tertekan, namun pelaku justru menertawakan dan menyebarkan rekamannya di media sosial sebagai lelucon.",
    impactOnVictim:
      "Korban mengalami trauma emosional, merasa cemas saat berada di keramaian kampus, dan keluarganya sempat mempertimbangkan menghentikan studi korban.",
    legalAndSocialOutcome:
      "Pihak kampus memberikan sanksi skorsing keras hingga 12 bulan kepada pelaku utama, dan kasus ini menjadi tonggak reformasi perlindungan mahasiswa disabilitas serta pembentukan unit layanan disabilitas di kampus.",
    islamicPerspective:
      "Merendahkan kekurangan fisik atau sensorik sesama manusia adalah penghinaan terhadap ciptaan Allah SWT (QS. At-Tin: 4). Islam memerintahkan kita memuliakan kaum yang lemah (dhuafa/mustadh'afin), bukan menjadikannya bahan lelucon.",
    keyTakeaways: [
      "Kekurangan orang lain bukan bahan konten atau lelucon virtual.",
      "Merekam dan menertawakan penderitaan orang lain melipatgandakan dampak luka emosional korban.",
      "Siswa dan mahasiswa wajib menjadi perisai bagi teman penyandang disabilitas.",
    ],
  },
  {
    id: "kasus-perundungan-smp-cilacap",
    title: "Kasus Perundungan Siswa SMP di Cilacap (Viral Video Kekerasan)",
    year: "Kasus Viral Nasional",
    platform: "WhatsApp & TikTok / X",
    summary:
      "Aksi perundungan fisik dan verbal oleh seorang siswa terhadap adik kelasnya yang direkam oleh teman-temannya lalu tersebar luas di berbagai platform media sosial hingga menuai kecaman jutaan warganet.",
    chronology:
      "Awalnya bermula dari salah paham dan klaim kelompok pertemanan. Korban dipukuli dan ditendang di depan teman-teman lainnya yang hanya menonton dan merekam tanpa ada yang berani melerai (bystander effect).",
    impactOnVictim:
      "Korban mengalami luka fisik cukup berat, memar tulang rusuk, serta trauma psikologis mendalam yang membutuhkan pendampingan konseling intensif dari tim psikolog dan KemenPPPA.",
    legalAndSocialOutcome:
      "Pelaku diproses melalui Sistem Peradilan Pidana Anak (UU SPPA), divonis hukuman pembinaan di Lembaga Penyelenggaraan Kesejahteraan Sosial (LPKS), dan sekolah mereformasi satgas anti-kekerasan.",
    islamicPerspective:
      "Rasulullah SAW bersabda: 'Bukan termasuk golongan kami orang yang tidak menyayangi yang lebih muda dan tidak menghormati yang lebih tua' (HR. Tirmidzi). Menindas orang yang lebih lemah adalah tanda kehampaan iman.",
    keyTakeaways: [
      "Bystander effect: Sikap diam saat melihat perundungan sama halnya membiarkan kezaliman terus berlangsung.",
      "Perundungan fisik hampir selalu berawal dari ejekan verbal dan provokasi di ruang obrolan digital.",
      "Pentingnya deteksi dini oleh Guru BK dan sekolah sebelum konflik membesar.",
    ],
  },
  {
    id: "kasus-perundungan-geng-sma-serpong",
    title: "Kasus Kekerasan & Cyber Harassment Geng Sekolah SMA Swasta Serpong",
    year: "Kasus Viral Nasional",
    platform: "X (Twitter), Instagram, & Grup Pesan Terenkripsi",
    summary:
      "Praktek ospek liar dan perundungan oleh geng senior sekolah swasta elite yang melibatkan ancaman kekerasan, perekaman video, serta doxxing di media sosial yang menyeret anak figur publik.",
    chronology:
      "Korban diintimidasi, disundut rokok, dan dipaksa mematuhi perintah tak wajar senior sebagai syarat bergabung dalam kelompok. Rekaman aksi tersebut diunggah dan disebarluaskan, memicu kemarahan warganet secara masif.",
    impactOnVictim:
      "Korban dirawat di rumah sakit karena luka bakar dan cedera fisik, mengalami depresi berat, serta ketakutan ekstrem untuk kembali bersekolah.",
    legalAndSocialOutcome:
      "Belasan siswa yang terlibat dijatuhi sanksi drop out (dikeluarkan dari sekolah) dan diproses hukum oleh kepolisian dengan pasal kekerasan terhadap anak di bawah umur.",
    islamicPerspective:
      "Islam mengharamkan segala bentuk kezaliman dan penindasan atas dasar senioritas. Rasulullah SAW mengingatkan bahwa kezaliman adalah kegelapan pada hari kiamat (HR. Bukhari & Muslim).",
    keyTakeaways: [
      "Jejak digital kekerasan tidak akan hilang dan menghancurkan masa depan pendidikan serta karir pelaku.",
      "Senioritas beracun (toxic hierarchy) harus dilawan dengan nilai Ihsan dan kasih sayang.",
      "Sekolah harus memiliki mekanisme pelaporan rahasia seperti TemanCurhat.",
    ],
  },
  {
    id: "kasus-cancel-culture-body-shaming-remaja",
    title: "Fenomena Cyber Mobbing & Body Shaming Massal Remaja di TikTok / Instagram",
    year: "Fenomena Berulang",
    platform: "TikTok, Kolom Komentar Instagram, & X",
    summary:
      "Banyak pelajar dan remaja yang mengunggah karya atau konten kreatif, namun tiba-tiba diserang oleh ribuan komentar menghina fisik (body shaming), pakaian, atau latar belakang keluarga oleh warganet anonim.",
    chronology:
      "Satu komentar sinis dari akun provokator sering kali memicu ratusan akun lain untuk ikut-ikutan menertawakan (efek bola salju hujatan), hingga kolom komentar dibanjiri puluhan ribu ujaran kebencian dalam hitungan jam.",
    impactOnVictim:
      "Korban mengalami gangguan kecemasan (cyber-anxiety), mogok sekolah karena malu bertemu teman sebaya, menghapus seluruh jejak akun, hingga timbul ide menyakiti diri sendiri.",
    legalAndSocialOutcome:
      "Beberapa kasus berujung laporan ke Siber Polri dengan jeratan UU ITE Pasal 27A tentang pencemaran nama baik dan penyerangan kehormatan di ruang digital.",
    islamicPerspective:
      "Mencela fisik seseorang pada hakikatnya mencela Sang Pencipta yang menciptakan manusia dalam bentuk sebaik-baiknya. Allah berfirman: 'Dan sungguh telah Kami ciptakan manusia dalam bentuk yang sebaik-baiknya' (QS. At-Tin: 4).",
    keyTakeaways: [
      "Jangan pernah ikut-ikutan berkomentar jahat meskipun ratusan orang sudah melakukannya.",
      "Satu ketikan jempol bisa menjadi peluru yang menghancurkan mental seseorang yang tidak kita kenal.",
      "Kirim pesan dukungan (DM privat) kepada korban untuk membuktikan bahwa tidak semua orang jahat.",
    ],
  },
];

// 3. DAFTAR REKOMENDASI VIDEO RESMI & TERUJI (YOUTUBE EDUKASI & KASUS)
export const RECOMMENDED_EDUCATIONAL_VIDEOS: VideoRecommendationItem[] = [
  {
    id: "video-cerdas-berkarakter-cyberbullying",
    title: "Perundungan Dunia Maya (Cyberbullying)",
    channel: "Cerdas Berkarakter Kemendikdasmen RI",
    duration: "4:15",
    category: "edukasi",
    youtubeId: "R5v6a9lW8s4",
    url: "https://www.youtube.com/watch?v=R5v6a9lW8s4",
    thumbnail: "https://img.youtube.com/vi/R5v6a9lW8s4/hqdefault.jpg",
    summary:
      "Video edukasi resmi Kementerian Pendidikan mengenai bagaimana perundungan siber terjadi, dampaknya terhadap fokus belajar dan kesehatan mental pelajar, serta etika menjaga jejak digital positif.",
    highlights: [
      "Mengenal bentuk-bentuk ejekan digital",
      "Dampak stres dan cemas pada siswa",
      "Pentingnya saring sebelum sharing",
    ],
  },
  {
    id: "video-unicef-bahaya-perundungan",
    title: "Berteman dan Bahaya Perundungan (Bullying)",
    channel: "UNICEF Indonesia",
    duration: "5:30",
    category: "edukasi",
    youtubeId: "hWfBqG1VfXQ",
    url: "https://www.youtube.com/watch?v=hWfBqG1VfXQ",
    thumbnail: "https://img.youtube.com/vi/hWfBqG1VfXQ/hqdefault.jpg",
    summary:
      "Panduan mendalam dari UNICEF Indonesia mengenai batas antara candaan dan perundungan, dampak isolasi sosial pada anak, serta kemana harus mencari pertolongan resmi saat menghadapi perundungan.",
    highlights: [
      "Perbedaan bercanda vs merundung",
      "Layanan bantuan SAPA 129 & TEPSA",
      "Membangun lingkungan pertemanan sehat",
    ],
  },
  {
    id: "video-unicef-iqbaal-cyberbullying",
    title: "Perundungan Siber (Cyberbullying) & Stigma di Media Sosial",
    channel: "UNICEF Indonesia & Iqbaal Ramadhan",
    duration: "6:48",
    category: "upstander",
    youtubeId: "9yHkL2XkE3k",
    url: "https://www.youtube.com/watch?v=9yHkL2XkE3k",
    thumbnail: "https://img.youtube.com/vi/9yHkL2XkE3k/hqdefault.jpg",
    summary:
      "Dialog edukatif bersama figur publik remaja mengenai pengalaman menghadapi komentar jahat di media sosial, cara mengelola kesehatan mental saat diserang warganet, dan pentingnya saling menguatkan.",
    highlights: [
      "Strategi digital detoks saat diserang",
      "Menolak budaya hate speech di medsos",
      "Pesan penguatan bagi korban perundungan",
    ],
  },
  {
    id: "video-roots-sekolah-bebas-bullying",
    title: "Melangkah Menuju Sekolah Bebas Perundungan (Program Roots)",
    channel: "Puspeka Kemendikbud & UNICEF Indonesia",
    duration: "7:12",
    category: "edukasi",
    youtubeId: "8rP3vQZLm9s",
    url: "https://www.youtube.com/watch?v=8rP3vQZLm9s",
    thumbnail: "https://img.youtube.com/vi/8rP3vQZLm9s/hqdefault.jpg",
    summary:
      "Dokumentasi program Roots Indonesia yang melatih siswa-siswi terpilih menjadi 'Agen Perubahan' untuk menyebarkan virus kebaikan dan merangkul teman-teman yang terkucilkan di sekolah.",
    highlights: [
      "Peran siswa sebagai Agen Perubahan",
      "Mekanisme pelaporan ramah anak di sekolah",
      "Mengubah iklim sekolah menjadi aman dan ramah",
    ],
  },
  {
    id: "video-narasi-lingkaran-kekerasan",
    title: "Jejak Gelap Bullying: Dari Medsos ke Sekolah",
    channel: "Narasi Newsroom / Liputan Khusus Investigasi",
    duration: "11:20",
    category: "kasus",
    youtubeId: "kJ7mQ2R9x3F",
    url: "https://www.youtube.com/watch?v=kJ7mQ2R9x3F",
    thumbnail: "https://img.youtube.com/vi/kJ7mQ2R9x3F/hqdefault.jpg",
    summary:
      "Liputan jurnalisme investigatif mengenai sederet kasus perundungan viral di Indonesia, wawancara mendalam bersama korban dan psikolog klinis, serta ancaman hukum bagi pelaku di bawah umur.",
    highlights: [
      "Analisis mengapa video kekerasan bisa viral",
      "Jeratan hukum UU ITE dan UU Perlindungan Anak",
      "Suara hati korban dan proses pemulihan trauma",
    ],
  },
];

// 4. STRUKTUR DAMPAK & SOLUSI LENGKAP
export const DETAILED_IMPACT_AND_SOLUTIONS = {
  dampak: {
    psikologis: [
      "Kecemasan berlebih (cyber-anxiety) dan rasa takut setiap kali mendengar denting notifikasi gawai.",
      "Depresi klinis, perasaan putus asa, dan penurunan drastis rasa keberhargaan diri (low self-worth).",
      "Trauma emosional mendalam (PTSD) yang memicu mimpi buruk dan ketakutan berada di keramaian.",
      "Timbulnya dorongan untuk melukai diri sendiri (self-harm) atau pikiran putus asa jika tidak segera didampingi.",
    ],
    akademis: [
      "Penolakan datang ke sekolah (school refusal / phobia) karena takut berpapasan dengan pelaku atau merasa malu.",
      "Sulit berkonsentrasi saat guru menjelaskan materi, berujung penurunan nilai ujian secara signifikan.",
      "Kehilangan motivasi untuk mengerjakan tugas, berorganisasi, atau meraih prestasi ekstrakurikuler.",
    ],
    sosial: [
      "Menarik diri dari lingkungan pertemanan (isolasi sosial) dan mengunci diri di kamar.",
      "Krisis kepercayaan (trust issue) akut—merasa semua orang membicarakan dan menertawakan dirinya.",
      "Kehilangan rasa aman di ruang digital maupun di kehidupan nyata sehari-hari.",
    ],
    terhadapDisabilitas: [
      "Luka emosional ganda karena keterbatasan yang tidak bisa diubah justru dijadikan bahan komedi warganet.",
      "Merasa kehadirannya menjadi beban bagi orang sekitar akibat ejekan netizen.",
      "Kehilangan hak belajar yang inklusif dan takut menggunakan teknologi informasi.",
    ],
    bagiPelaku: [
      "Tercorengnya jejak digital permanen yang menyulitkan kelulusan, mencari beasiswa, atau pekerjaan di masa depan.",
      "Jeratan pidana UU ITE (Pasal 27A/28 ayat 2) dan UU Perlindungan Anak dengan ancaman kurungan dan denda ratusan juta.",
      "Sanksi sosial berupa pengucilan dari masyarakat dan rasa bersalah seumur hidup.",
      "Beban dosa kezaliman di akhirat yang menghanguskan seluruh pahala ibadah (Hadits Muflis).",
    ],
  },
  solusi: {
    pertolonganPertama: [
      "1. Tarik Napas & Tenangkan Diri: Ingat bahwa ketikan jahat orang lain adalah cermin buruknya hati mereka, BUKAN nilai dirimu.",
      "2. STOP (Don't Feed The Troll): Jangan pernah membalas hujatan dengan emosi. Pelaku mengharapkan reaksimu untuk memperpanjang keributan.",
      "3. Simpan Bukti Digital: Tangkap layar (screenshot) seluruh komentar, pesan, profil akun pelaku, tautan (URL), serta tanggal/waktu sebelum dihapus.",
      "4. Amankan Akun Pribadi: Segera blokir akun pelaku, ubah pengaturan akun menjadi Privat, dan batasi izin direct message (DM) hanya untuk teman dekat.",
      "5. Bicarakan ke Orang Terpercaya: Ceritakan apa yang kamu alami kepada orang tua, sahabat karib, atau Guru BK sekolah.",
    ],
    saluranPengaduanDanBantuan: [
      "Guru BK Sekolah: Gunakan fitur Live Chat atau Jadwal Janji Temu Tatap Muka di TemanCurhat untuk pendampingan langsung dan rahasia.",
      "Hotline SAPA 129 (KemenPPPA): Telepon 129 atau WhatsApp resmi 08111-129-129 untuk laporan kekerasan anak dan perempuan 24/7.",
      "Layanan Sejiwa 119 Ext 8: Layanan pertolongan pertama kesehatan mental dan konseling psikologis darurat bebas pulsa oleh Kemenkes.",
      "Aduan Konten Kominfo: Melalui website aduankonten.id atau WhatsApp 0811-9224-545 untuk pemblokiran dan penghapusan konten cyberbullying.",
      "Patroli Siber Polri (patrolisiber.id): Untuk penanganan kasus yang mengandung pemerasan, ancaman pembunuhan, atau penyebaran data intim.",
    ],
    sudutPandangIslam: [
      "Muraqabatullah: Sadari bahwa Allah Maha Mengawasi. Kezaliman mereka tercatat oleh malaikat Raqib dan Atid.",
      "Doa Orang Terzalimi: Doa orang yang dizalimi tidak memiliki penghalang antara dirinya dan Allah (HR. Tirmidzi). Doakan kebaikan atau mohonkan perlindungan kepada-Nya.",
      "Muhasabah & Dzikir: Perbanyak membaca 'Hasbunallahu wa ni'mal wakil' untuk menenangkan goncangan batin.",
      "Prinsip Keadilan Ilahi: Yakinlah tidak ada perbuatan jahat sekecil biji zarrah pun yang luput dari pengadilan Allah (QS. Az-Zalzalah: 7-8).",
    ],
  },
};
