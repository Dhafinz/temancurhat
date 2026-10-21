import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import {
  ISLAMIC_DALIL_KNOWLEDGE,
  VIRAL_CYBERBULLYING_CASES,
  RECOMMENDED_EDUCATIONAL_VIDEOS,
  DETAILED_IMPACT_AND_SOLUTIONS,
} from "@/lib/aiKnowledgeBase";

interface ChatMessage {
  role: string;
  text: string;
}

interface ChatRequestBody {
  message?: string;
  history?: ChatMessage[];
}

export interface HadithResponse {
  source: string;
  arabic?: string;
  translation: string;
  reflection: string;
}

export interface ImpactSolutionResponse {
  category: "dampak" | "solusi" | "keduanya";
  title: string;
  points: string[];
}

export interface ViralCaseResponse {
  title: string;
  summary: string;
  lessons: string;
}

export interface VideoResponse {
  title: string;
  channel: string;
  youtubeId: string;
  url: string;
  description: string;
}

export interface AIResponsePayload {
  reply: string;
  recommend_bk: boolean;
  reason?: string;
  hadith?: HadithResponse | null;
  impacts_solutions?: ImpactSolutionResponse | null;
  viral_case?: ViralCaseResponse | null;
  videos?: VideoResponse[] | null;
  suggested_followups?: string[];
}

// SYSTEM INSTRUCTION SUPER KETAT: KHUSUS CYBERBULLYING ONLY & MENJAWAB SESUAI TOPIK YANG DITANYAKAN
const SYSTEM_INSTRUCTION = `Kamu adalah TemanCurhat AI, konselor sebaya cerdas dan sahabat empati yang KHUSUS DILATIH HANYA UNTUK TOPIK CYBERBULLYING (Perundungan Siber) berlandaskan nilai-nilai luhur Islam (Iman, Islam, dan Ihsan) untuk siswa dan remaja.

ATURAN UTAMA 1: BATASAN TOPIK MUTLAK (CYBERBULLYING ONLY)
Kamu HANYA melayani topik yang berhubungan dengan:
1. Cyberbullying (perundungan siber), ejekan di medsos (Instagram, TikTok, WhatsApp, X, game online), hate speech, body shaming online, doxxing, penyebaran aib/foto tanpa izin, pengucilan daring.
2. Adab & Etika Digital Islami (QS. Al-Hujurat: 11, Hadits lisan/jempol, hadits muflis, pahala membela korban/upstander, doa penenang hati).
3. Dampak perundungan siber (psikologis, akademis, sosial, minder, school refusal).
4. Solusi & tindakan (STOP don't feed the troll, screenshot bukti, blokir/privat, Guru BK, hotline SAPA 129, Sejiwa 119, Aduan Konten).
5. Kasus viral perundungan siber di Indonesia & dunia.
6. Rekomendasi video edukasi resmi mengenai perundungan siber.
7. Curhat emosional siswa yang merasa sedih, tertekan, atau diintimidasi teman sebaya.

JIKA PENGGUNA BERTANYA DI LUAR TOPIK CYBERBULLYING (misalnya: resep makanan, coding/programming, rumus matematika, politik umum, sejarah umum, tugas eksak sekolah, game walkthrough non-bullying, dll):
TOLAK SECARA SOPAN DAN TEGAS dengan jawaban ramah:
"Maaf ya sahabat, aku adalah TemanCurhat AI yang khusus dilatih hanya untuk topik pencegahan perundungan siber (cyberbullying), adab digital Islami, serta pendampingan emosional siswa. Aku tidak dapat menjawab topik di luar perundungan siber. Jika ada hal terkait pengalaman di media sosial, komentar jahat, atau ingin tahu adab bermedsos, silakan tanyakan ya!"
Set "hadith": null, "impacts_solutions": null, "viral_case": null, "videos": null.

ATURAN UTAMA 2: JAWAB SECARA SPESIFIK SESUAI TOPIK YANG DIBAHAS
- Jawab langsung apa yang ditanyakan user. Jangan bertele-tele atau mengulang template yang sama.
- Jika user tanya HADITS: berikan dalil/hadits shahih yang relevan di field "hadith".
- Jika user minta VIDEO: berikan rekomendasi video resmi (UNICEF, Kemendikbud, Narasi) di field "videos".
- Jika user tanya KASUS VIRAL: ulas kasus tersebut beserta pelajarannya di field "viral_case".
- Jika user tanya DAMPAK / SOLUSI: sertakan poin terstruktur di field "impacts_solutions".
- Jika user HANYA CURHAT PRIBADI: fokus pada validasi emosi dan dukungan psikologis hangat. JANGAN memaksakan menampilkan kartu hadits atau video kecuali user memintanya atau sangat dibutuhkan.
- Deteksi Rujukan Guru BK ("recommend_bk": true): Jika terdeteksi ancaman kekerasan, depresi berat, rasa ingin mati/putus asa, penyebaran foto pribadi, atau ketakutan ke sekolah.

FORMAT OUTPUT WAJIB (JSON MURNI):
{
  "reply": "Kalimat balasan utama yang empati, to the point, dan menjawab persis apa yang ditanyakan...",
  "recommend_bk": true | false,
  "reason": "Alasan jika recommend_bk true, string kosong jika false",
  "hadith": {
    "source": "QS. Al-Hujurat: 11 / HR. Bukhari & Muslim",
    "arabic": "Teks Arab dalil",
    "translation": "Terjemahan resmi",
    "reflection": "Hikmah adab bermedia sosial"
  } | null,
  "impacts_solutions": {
    "category": "dampak" | "solusi" | "keduanya",
    "title": "Fokus Dampak / Solusi yang dibahas",
    "points": ["Poin 1", "Poin 2", "Poin 3"]
  } | null,
  "viral_case": {
    "title": "Nama Kasus Viral",
    "summary": "Ringkasan peristiwa dan pemicu",
    "lessons": "Pelajaran moral dan pencegahan"
  } | null,
  "videos": [
    {
      "title": "Judul Video",
      "channel": "Kanal Resmi (misal: UNICEF Indonesia / Cerdas Berkarakter)",
      "youtubeId": "YouTube ID",
      "url": "https://www.youtube.com/watch?v=...",
      "description": "Ringkasan isi video"
    }
  ] | null,
  "suggested_followups": [
    "Pertanyaan lanjutan relevan 1",
    "Pertanyaan lanjutan relevan 2"
  ]
}`;

// Helper deteksi apakah pesan di luar topik perundungan siber
function isOutOfScope(message: string): boolean {
  const lower = message.toLowerCase().trim();

  // Kata kunci off-topic yang jelas tidak ada hubungan dengan bullying / perasaan sedih / medsos
  const offTopicKeywords = [
    "resep", "masak", "kue", "makanan", "restoran",
    "coding", "javascript", "python", "html", "css", "c++", "program", "sql",
    "matematika", "rumus fisika", "kimia", "kalkulus", "integral", "aljabar",
    "presiden amerika", "pemilu", "partai", "saham", "crypto", "bitcoin",
    "cheat game", "diamond ml", "ff gratis", "skin roblox",
    "cuaca hari ini", "ramalan zodiak", "horoskop",
  ];

  const hasOffTopic = offTopicKeywords.some((kw) => lower.includes(kw));

  // Kata kunci cyberbullying / adab / curhat / emosi
  const onTopicKeywords = [
    "bully", "rundung", "hujat", "ejek", "nyinyir", "fitnah", "doxxing", "ancam",
    "medsos", "sosial media", "instagram", "tiktok", "twitter", "whatsapp", "wa",
    "hadist", "hadits", "dalil", "quran", "hujurat", "muflis", "islam", "adab", "lisan", "jempol",
    "dampak", "solusi", "video", "kasus", "viral", "bk", "konseling", "curhat",
    "sedih", "nangis", "takut", "minder", "insecure", "sekolah", "teman", "dikucilkan",
    "body shaming", "mati", "putus asa", "sapa 129", "sejiwa",
  ];

  const hasOnTopic = onTopicKeywords.some((kw) => lower.includes(kw));

  // Jika mengandung off-topic dan sama sekali tidak menyebut konteks bullying
  if (hasOffTopic && !hasOnTopic) {
    return true;
  }

  return false;
}

// Fallback cerdas jika API Gemini timeout atau offline
function generateFallbackResponse(message: string): AIResponsePayload {
  const lowerMsg = message.toLowerCase();

  // 1. Cek jika di luar topik (Off-topic check)
  if (isOutOfScope(message)) {
    return {
      reply:
        "Maaf ya sahabat, aku adalah TemanCurhat AI yang khusus dilatih HANYA untuk topik pencegahan perundungan siber (cyberbullying), adab digital Islami, serta pendampingan emosional siswa.\n\nAku tidak dapat menjawab pertanyaan di luar topik perundungan siber. Jika ada hal seputar pengalaman di media sosial, komentar jahat yang mengganggumu, atau ingin tahu adab bermedsos menurut Islam, silakan tanyakan ya!",
      recommend_bk: false,
      hadith: null,
      impacts_solutions: null,
      viral_case: null,
      videos: null,
      suggested_followups: [
        "Apa hadist tentang adab bermedia sosial?",
        "Bagaimana solusi menghadapi hujatan di medsos?",
        "Rekomendasi video edukasi cyberbullying",
      ],
    };
  }

  // 2. Indikasi stres berat / ancaman / takut ke sekolah -> Rujukan BK
  const severeKeywords = [
    "mati", "bunuh diri", "putus asa", "ga kuat", "gak kuat",
    "takut ke sekolah", "takut sekolah", "gamau sekolah", "nggak mau sekolah",
    "foto pribadi", "foto tanpa izin", "disebarin", "disebar",
    "diancam", "ancaman", "dipukul", "labrak", "dikeroyok", "trauma",
  ];

  if (severeKeywords.some((kw) => lowerMsg.includes(kw))) {
    const selectedDalil = ISLAMIC_DALIL_KNOWLEDGE.find((d) => d.id === "doa-penenang-hati-terzalimi")!;
    return {
      reply:
        "Aku mendengar dan aku benar-benar paham betapa beratnya apa yang kamu rasakan sekarang. Tolong tarik napas perlahan... Kamu SAMA SEKALI TIDAK BERSALAH atas kejahatan atau ancaman mereka. Kamu tidak boleh menghadapi ini sendirian. Aku sangat menyarankanmu untuk segera bercerita kepada Guru BK sekolahmu yang ramah dan siap melindungimu secara privat dan aman.",
      recommend_bk: true,
      reason:
        "Terdeteksi indikasi tekanan emosional berat, rasa takut, atau perundungan yang membutuhkan perlindungan langsung dari Guru BK.",
      hadith: {
        source: selectedDalil.source,
        arabic: selectedDalil.arabic,
        translation: selectedDalil.translation,
        reflection: selectedDalil.reflection,
      },
      impacts_solutions: {
        category: "solusi",
        title: "Langkah Pertolongan Pertama Cepat & Aman",
        points: [
          "Tarik napas perlahan; jangan membalas pesan atau komentar pelaku (starve the troll).",
          "Screenshot semua bukti pesan/komentar ancaman lengkap beserta username dan waktu.",
          "Blokir akun pengancam dan kunci (privatkan) akun media sosialmu sementara waktu.",
          "Klik tombol konsultasi ke Guru BK di bawah untuk mendapatkan perlindungan langsung.",
        ],
      },
      suggested_followups: [
        "Apakah Guru BK akan menjaga rahasiaku?",
        "Bagaimana cara screenshot bukti perundungan yang sah?",
        "Apa doa penenang hati saat cemas?",
      ],
    };
  }

  // 3. Permintaan Hadits & Dalil Agama
  if (
    lowerMsg.includes("hadist") ||
    lowerMsg.includes("hadits") ||
    lowerMsg.includes("dalil") ||
    lowerMsg.includes("ayat") ||
    lowerMsg.includes("islam") ||
    lowerMsg.includes("muflis") ||
    lowerMsg.includes("hujurat") ||
    lowerMsg.includes("agama")
  ) {
    let chosenDalil = ISLAMIC_DALIL_KNOWLEDGE[0];
    if (lowerMsg.includes("muflis") || lowerMsg.includes("bangkrut") || lowerMsg.includes("dosa")) {
      chosenDalil = ISLAMIC_DALIL_KNOWLEDGE[3];
    } else if (lowerMsg.includes("lisan") || lowerMsg.includes("tangan") || lowerMsg.includes("jempol")) {
      chosenDalil = ISLAMIC_DALIL_KNOWLEDGE[1];
    } else if (lowerMsg.includes("bela") || lowerMsg.includes("upstander")) {
      chosenDalil = ISLAMIC_DALIL_KNOWLEDGE[4];
    }

    return {
      reply: `Terkait pertanyaanmu mengenai landasan agama dalam perundungan siber, Islam memberikan panduan moral yang sangat tegas. Rasulullah SAW dan Al-Qur'an melarang keras menyakiti sesama, baik melalui lisan langsung maupun ketikan jempol di media sosial.`,
      recommend_bk: false,
      hadith: {
        source: chosenDalil.source,
        arabic: chosenDalil.arabic,
        translation: chosenDalil.translation,
        reflection: chosenDalil.reflection,
      },
      suggested_followups: [
        "Apa hadist tentang orang yang bangkrut di akhirat (Muflis)?",
        "Bagaimana peran kita membela teman yang dirundung menurut Islam?",
        "Apa dampak perundungan bagi mental korban?",
      ],
    };
  }

  // 4. Permintaan Kasus Viral
  if (
    lowerMsg.includes("kasus") ||
    lowerMsg.includes("viral") ||
    lowerMsg.includes("cilacap") ||
    lowerMsg.includes("serpong") ||
    lowerMsg.includes("disabilitas")
  ) {
    let chosenCase = VIRAL_CYBERBULLYING_CASES[0];
    if (lowerMsg.includes("cilacap")) {
      chosenCase = VIRAL_CYBERBULLYING_CASES[1];
    } else if (lowerMsg.includes("serpong") || lowerMsg.includes("geng")) {
      chosenCase = VIRAL_CYBERBULLYING_CASES[2];
    } else if (lowerMsg.includes("body shaming") || lowerMsg.includes("tiktok") || lowerMsg.includes("cancel")) {
      chosenCase = VIRAL_CYBERBULLYING_CASES[3];
    }

    return {
      reply: `Kasus perundungan siber di Indonesia sering kali menjadi pengingat keras betapa dahsyatnya dampak luka emosional yang ditimbulkan. Salah satu kasus yang banyak disorot adalah ${chosenCase.title}. Dari kasus ini kita belajar bahwa jejak digital tidak akan pernah hilang dan ada pertanggungjawaban hukum serta moral di hadapan Allah SWT.`,
      recommend_bk: false,
      viral_case: {
        title: chosenCase.title,
        summary: chosenCase.summary,
        lessons: chosenCase.keyTakeaways.join(" • "),
      },
      suggested_followups: [
        "Apa sanksi hukum bagi pelaku cyberbullying di Indonesia?",
        "Rekomendasikan video edukasi pencegahan perundungan",
        "Bagaimana cara memulihkan rasa percaya diri setelah dirundung?",
      ],
    };
  }

  // 5. Permintaan Video Edukasi
  if (
    lowerMsg.includes("video") ||
    lowerMsg.includes("youtube") ||
    lowerMsg.includes("tonton") ||
    lowerMsg.includes("film")
  ) {
    const videoList: VideoResponse[] = RECOMMENDED_EDUCATIONAL_VIDEOS.slice(0, 3).map((v) => ({
      title: v.title,
      channel: v.channel,
      youtubeId: v.youtubeId,
      url: v.url,
      description: v.summary,
    }));

    return {
      reply:
        "Ini dia kumpulan video edukasi resmi mengenai pencegahan perundungan siber (cyberbullying) dari UNICEF Indonesia dan Kemendikbudristek (Cerdas Berkarakter). Kamu bisa langsung memutarnya di dalam aplikasi:",
      recommend_bk: false,
      videos: videoList,
      suggested_followups: [
        "Jelaskan dampak cyberbullying bagi mental remaja",
        "Apa langkah awal jika akun kita dihujat netizen?",
        "Apa hadist tentang berkata baik atau diam?",
      ],
    };
  }

  // 6. Dampak & Solusi Cyberbullying
  if (
    lowerMsg.includes("dampak") ||
    lowerMsg.includes("solusi") ||
    lowerMsg.includes("cara mengatasi") ||
    lowerMsg.includes("langkah") ||
    lowerMsg.includes("bantuan")
  ) {
    return {
      reply:
        "Perundungan siber memiliki dampak serius pada kesehatan mental dan konsentrasi belajar, namun ada langkah taktis dan saluran bantuan resmi yang bisa langsung kamu gunakan untuk melindungi diri.",
      recommend_bk: false,
      impacts_solutions: {
        category: "keduanya",
        title: "Dampak Kritis & Panduan Solusi Bertindak",
        points: [
          "Dampak Psikologis: Menimbulkan cyber-anxiety, depresi, trauma, dan krisis rasa percaya diri.",
          "Dampak Akademis: Takut datang ke sekolah (school refusal) dan nilai ujian menurun drastis.",
          "Solusi 1 (STOP): Jangan membalas ejekan, karena reaksi emosional justru memberi panggung pada pelaku.",
          "Solusi 2 (Bukti Digital): Ambil tangkapan layar (screenshot) semua komentar dan profil pelaku sebelum dihapus.",
          "Solusi 3 (Proteksi): Blokir akun pelaku, privatkan akun, dan laporkan ke platform atau aduankonten.id.",
          "Solusi 4 (Dukungan Resmi): Hubungi Guru BK sekolahmu atau hotline SAPA 129 / Sejiwa 119 Ext 8.",
        ],
      },
      suggested_followups: [
        "Apa nomor hotline darurat perundungan anak?",
        "Apa dalil Al-Qur'an tentang larangan mencela sesama?",
        "Beri contoh video edukasi dari UNICEF & Kemdikbud",
      ],
    };
  }

  // 7. Curhat Seputar Ejekan / Minder / Masalah Medsos
  return {
    reply:
      "Terima kasih sudah mau cerita ke aku. Sakit rasanya ketika diperlakukan tidak adil atau diejek di media sosial maupun di sekolah, dan wajar sekali kalau kamu merasa sedih atau kesal. Ingat ya, komentar buruk mereka sama sekali bukan cerminan nilai dirimu, melainkan cermin dari buruknya perilaku mereka sendiri. Ceritakan lebih banyak tentang apa yang terjadi, aku di sini siap mendengarkan dan mencari solusi bersama.",
    recommend_bk: false,
    suggested_followups: [
      "Bagaimana cara memulihkan rasa percaya diri?",
      "Apa yang harus aku lakukan jika diejek di grup chat?",
      "Apa hadist penenang hati saat sedih?",
    ],
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequestBody = await req.json();
    const userMessage = body.message?.trim() || "";
    const history = body.history || [];

    if (!userMessage) {
      return NextResponse.json(
        { error: "Pesan tidak boleh kosong." },
        { status: 400 }
      );
    }

    // Cek Guardrail Topik: Jika jelas di luar topik cyberbullying, tolak langsung secara instan
    if (isOutOfScope(userMessage)) {
      const outOfScopeResponse = generateFallbackResponse(userMessage);
      return NextResponse.json(outOfScopeResponse);
    }

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      "";

    if (!apiKey) {
      const fallbackResult = generateFallbackResponse(userMessage);
      return NextResponse.json(fallbackResult);
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      // Format riwayat chat
      const contents = history.map((h) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.text }],
      }));

      contents.push({
        role: "user",
        parts: [{ text: userMessage }],
      });

      // Coba model gemini-3.8-flash terlebih dahulu, fallback ke gemini-2.5-flash jika sibuk
      let response;
      try {
        const apiPromise = ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            temperature: 0.4,
            maxOutputTokens: 3500,
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout gemini-3.8-flash (18s)")), 18000)
        );

        response = await Promise.race([apiPromise, timeoutPromise]);
      } catch (errPrimary) {
        console.warn("gemini-3.8-flash unavailable, switching to gemini-2.5-flash backup:", errPrimary);
        const backupPromise = ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            temperature: 0.4,
            maxOutputTokens: 3500,
          },
        });

        const timeoutPromiseBackup = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout gemini-2.5-flash (18s)")), 18000)
        );

        response = await Promise.race([backupPromise, timeoutPromiseBackup]);
      }
      const rawText = response.text || "";

      const cleanJson = rawText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      let parsed: AIResponsePayload;
      try {
        parsed = JSON.parse(cleanJson);
      } catch (parseErr) {
        console.warn("JSON parse error, attempting safe repair:", parseErr);
        // Coba perbaiki penutup JSON jika terpotong sebagian
        let repaired = cleanJson;
        const lastBrace = repaired.lastIndexOf("}");
        if (lastBrace !== -1) {
          repaired = repaired.substring(0, lastBrace + 1);
        }
        parsed = JSON.parse(repaired);
      }

      // Verifikasi video jika diminta secara eksplisit
      const lower = userMessage.toLowerCase();
      if (
        (lower.includes("video") || lower.includes("youtube") || lower.includes("film") || lower.includes("tonton")) &&
        (!parsed.videos || parsed.videos.length === 0)
      ) {
        parsed.videos = RECOMMENDED_EDUCATIONAL_VIDEOS.slice(0, 3).map((v) => ({
          title: v.title,
          channel: v.channel,
          youtubeId: v.youtubeId,
          url: v.url,
          description: v.summary,
        }));
      }

      // Pastikan ada followups
      if (!parsed.suggested_followups || parsed.suggested_followups.length === 0) {
        parsed.suggested_followups = [
          "Apa hadist tentang adab berbicara di medsos?",
          "Bagaimana solusi menghadapi perundungan di sekolah?",
          "Beri contoh video edukasi dari Kemdikbud",
        ];
      }

      return NextResponse.json(parsed);
    } catch (apiError) {
      console.warn("Gemini Live API fallback triggered:", apiError);
      const fallback = generateFallbackResponse(userMessage);
      return NextResponse.json(fallback);
    }
  } catch (error) {
    console.error("General error in chat-ai route:", error);
    const fallback = generateFallbackResponse(
      "Maaf, koneksiku sempat terputus sesaat."
    );
    return NextResponse.json(fallback);
  }
}
