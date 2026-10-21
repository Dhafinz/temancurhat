"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  MessageCircleHeart,
  ShieldCheck,
  SendHorizontal,
  Trash2,
  Calendar,
  ArrowLeft,
  Lock,
  Sparkles,
  HelpCircle,
  MessageSquare,
  Smile,
  AlertCircle,
  BookOpen,
  Play,
  Film,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  X,
  HeartHandshake,
  ChevronRight,
} from "lucide-react";

interface HadithData {
  source: string;
  arabic?: string;
  translation: string;
  reflection: string;
}

interface ImpactSolutionData {
  category: "dampak" | "solusi" | "keduanya";
  title: string;
  points: string[];
}

interface ViralCaseData {
  title: string;
  summary: string;
  lessons: string;
}

interface VideoData {
  title: string;
  channel: string;
  youtubeId: string;
  url: string;
  description: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  recommend_bk?: boolean;
  reason?: string;
  hadith?: HadithData | null;
  impacts_solutions?: ImpactSolutionData | null;
  viral_case?: ViralCaseData | null;
  videos?: VideoData[] | null;
  suggested_followups?: string[];
}

type PromptCategory = "semua" | "hadist" | "dampak_solusi" | "kasus_viral" | "video" | "curhat";

const CATEGORY_PROMPTS: Record<
  PromptCategory,
  { label: string; icon: string; prompts: string[] }
> = {
  semua: {
    label: "Semua Topik",
    icon: "🌟",
    prompts: [
      "Apa hadist tentang adab bermedia sosial?",
      "Dampak dan solusi menghadapi cyberbullying",
      "Contoh kasus cyberbullying yang viral di Indonesia",
      "Rekomendasikan video edukasi dari UNICEF & Kemdikbud",
      "Aku merasa cemas karena dihujat di kolom komentar",
    ],
  },
  hadist: {
    label: "Hadist & Dalil",
    icon: "📖",
    prompts: [
      "Apa dalil QS. Al-Hujurat: 11 tentang larangan mencela sesama?",
      "Apa hadist tentang orang yang bangkrut di akhirat (Muflis)?",
      "Hadist tentang menjaga lisan dan tangan (jempol ketikan)",
      "Apa hadist tentang membela kehormatan teman yang dirundung?",
      "Apa doa penenang hati saat terzalimi dan difitnah?",
    ],
  },
  dampak_solusi: {
    label: "Dampak & Solusi",
    icon: "⚠️",
    prompts: [
      "Apa saja dampak psikologis dan akademis cyberbullying?",
      "Bagaimana solusi langkah awal jika dihujat netizen?",
      "Bagaimana cara screenshot bukti perundungan yang sah?",
      "Nomor hotline darurat apa saja untuk korban perundungan?",
      "Dampak bullying terhadap korban disabilitas",
    ],
  },
  kasus_viral: {
    label: "Kasus Viral",
    icon: "🌐",
    prompts: [
      "Ceritakan kasus viral perundungan mahasiswa disabilitas di kampus",
      "Pelajaran dari kasus perundungan siswa SMP Cilacap yang viral",
      "Kasus perundungan geng SMA Serpong dan sanksi hukumnya",
      "Mengapa cancel culture dan body shaming massal berbahaya?",
    ],
  },
  video: {
    label: "Rekomendasi Video",
    icon: "🎬",
    prompts: [
      "Tampilkan video edukasi cyberbullying dari Cerdas Berkarakter Kemdikbud",
      "Rekomendasi video perundungan siber dari UNICEF Indonesia",
      "Video investigasi jurnalisme kasus bullying dari Narasi",
      "Bantu carikan video pencegahan bullying untuk bahan presentasi",
    ],
  },
  curhat: {
    label: "Curhat Pribadi",
    icon: "💬",
    prompts: [
      "Aku sedang dihujat di kolom komentar medsos",
      "Ada yang menyebarkan fotoku tanpa izin",
      "Aku merasa minder dan diejek teman sekelas",
      "Komentar orang-orang membuatku takut membuka ponsel",
    ],
  },
};

// Helper untuk Anonymous Session
function useAnonymousSession() {
  const [studentId, setStudentId] = useState<string>("Siswa #4821");

  useEffect(() => {
    try {
      let stored = localStorage.getItem("temancurhat_student_id");
      if (!stored) {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        stored = `Siswa #${randomNum}`;
        localStorage.setItem("temancurhat_student_id", stored);
      }
      setStudentId(stored);
    } catch {
      setStudentId("Siswa #4821");
    }
  }, []);

  return studentId;
}

function getFormattedTime() {
  const now = new Date();
  return now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CurhatAIPage() {
  const studentId = useAnonymousSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<PromptCategory>("semua");
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Inisialisasi pesan sambutan terlatih
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem("temancurhat_chat_history_v2");
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch (e) {
      console.warn("Could not load chat history from localStorage", e);
    }

    // Default pesan awal dengan pengenalan kapabilitas terlatih
    setMessages([
      {
        id: "msg-welcome-v2",
        role: "assistant",
        text: `Assalamu'alaikum & Halo sahabat! Aku TemanCurhat AI.\n\nAku telah dilatih secara khusus untuk mendampingimu dalam topik Perundungan Siber (Cyberbullying), berlandaskan nilai-nilai luhur Islam (Iman, Islam, dan Ihsan).\n\nKamu bisa bertanya atau curhat mengenai:\n• 💬 Ruang aman curhat 100% anonim saat kamu merasa sedih, cemas, atau dihujat.\n• 📖 Dalil Al-Qur'an (QS. Al-Hujurat: 11) & Hadits Shahih tentang etika lisan, jempol, bahaya muflis (bangkrut akhirat), dan membela korban.\n• ⚠️ Dampak mendalam (mental, akademis, sosial) & Solusi praktis pertolongan pertama (screenshot, blokir, hotline darurat).\n• 🌐 Analisis kasus-kasus cyberbullying yang viral di Indonesia beserta pelajarannya.\n• 🎬 Rekomendasi video edukasi resmi (UNICEF, Kemendikbud, Narasi) yang bisa langsung kamu tonton di sini!\n\nApa yang sedang kamu pikirkan atau rasakan saat ini?`,
        timestamp: getFormattedTime(),
        recommend_bk: false,
        hadith: {
          source: "HR. Bukhari no. 10 & HR. Muslim no. 40",
          arabic: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
          translation:
            "Seorang muslim (yang sejati) adalah orang yang kaum muslim lainnya selamat dari gangguan lisan dan tangannya (jempol ketikannya).",
          reflection:
            "Jadikan media sosial sebagai ladang pahala, bukan tempat menyakiti sesama.",
        },
        suggested_followups: [
          "Apa hadist tentang larangan mengolok-olok di medsos?",
          "Dampak dan solusi menghadapi cyberbullying",
          "Ceritakan kasus cyberbullying yang viral di Indonesia",
          "Rekomendasikan video edukasi dari UNICEF & Kemdikbud",
        ],
      },
    ]);
  }, []);

  // Simpan pesan ke localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem("temancurhat_chat_history_v2", JSON.stringify(messages));
      } catch (e) {
        console.warn("Could not save chat history to localStorage", e);
      }
    }
  }, [messages]);

  // Auto-scroll ke bawah saat ada pesan baru
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleCopyText = (id: string, textToCopy: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? inputText).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
      timestamp: getFormattedTime(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText("");
    setIsLoading(true);

    try {
      // Susun ringkasan history untuk dikirim ke API
      const historyPayload = newMessages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch("/api/chat-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: historyPayload.slice(-8), // Ambil 8 riwayat pesan terakhir
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal menghubungi server");
      }

      const data = await res.json();

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        text: data.reply || "Aku di sini mendengarkanmu, ceritakan lagi ya...",
        timestamp: getFormattedTime(),
        recommend_bk: Boolean(data.recommend_bk),
        reason: data.reason || "",
        hadith: data.hadith || null,
        impacts_solutions: data.impacts_solutions || null,
        viral_case: data.viral_case || null,
        videos: Array.isArray(data.videos) && data.videos.length > 0 ? data.videos : null,
        suggested_followups:
          Array.isArray(data.suggested_followups) && data.suggested_followups.length > 0
            ? data.suggested_followups
            : undefined,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setLastFailedMessage(null);
    } catch (err) {
      console.error(err);
      setLastFailedMessage(text);
      const errorMessage: Message = {
        id: `ai-err-${Date.now()}`,
        role: "assistant",
        text: "Maaf ya sahabat, koneksiku sempat terganggu sesaat. Tapi jangan khawatir, aku tetap ada di sini untukmu. Kamu bisa klik tombol 'Coba Lagi' di bawah atau tanyakan kembali ya.",
        timestamp: getFormattedTime(),
        recommend_bk: false,
        suggested_followups: [
          "Apa hadist tentang adab bermedia sosial?",
          "Bagaimana solusi menghadapi hujatan di medsos?",
          "Tampilkan video edukasi cyberbullying",
        ],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm("Apakah kamu ingin membersihkan riwayat percakapan ini?")) {
      const resetMsg: Message = {
        id: `msg-reset-${Date.now()}`,
        role: "assistant",
        text: "Percakapan telah dibersihkan. Aku siap menemanimu kembali kapan pun kamu ingin bertanya atau bercerita.",
        timestamp: getFormattedTime(),
        recommend_bk: false,
        suggested_followups: [
          "Apa hadist tentang adab bermedia sosial?",
          "Dampak dan solusi menghadapi cyberbullying",
          "Rekomendasikan video edukasi",
        ],
      };
      setMessages([resetMsg]);
      try {
        localStorage.removeItem("temancurhat_chat_history_v2");
      } catch (e) {
        console.warn(e);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50/70 via-white to-teal-50/40 text-slate-800 selection:bg-emerald-200 selection:text-emerald-900">
      {/* ========================================================= */}
      {/* HEADER RUANG CURHAT AI */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 border-b border-emerald-100 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-3">
          {/* Sisi Kiri: Tombol Kembali & Judul */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors shadow-2xs"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Smile className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>TemanCurhat AI</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Terlatih: Bullying &amp; Hadits
                  </span>
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Pendampingan Emosional, Dalil Islam, Solusi, Kasus Viral &amp; Video 24/7
                </p>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: ID Anonim & Badge Privasi */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>100% Anonim</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>{studentId}</span>
            </div>

            <button
              type="button"
              onClick={handleClearChat}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors"
              title="Bersihkan Percakapan"
              aria-label="Bersihkan Percakapan"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Privacy & Training Sub-bar */}
        <div className="sm:hidden px-4 py-1.5 bg-emerald-50/80 border-t border-emerald-100/70 text-[11px] text-emerald-800 text-center font-medium flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Anonim &bull; Terlatih: Bullying, Hadits Islam, Dampak &amp; Video Edukasi</span>
        </div>
      </header>

      {/* ========================================================= */}
      {/* AREA UTAMA CHAT */}
      {/* ========================================================= */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col justify-between">
        {/* Banner Penegasan Ruang Lingkup Khusus Cyberbullying */}
        <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/90 flex items-center justify-between gap-3 text-xs text-emerald-900 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-emerald-600 text-white shrink-0 shadow-2xs">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span>
              <strong>Fokus Eksklusif:</strong> AI ini dilatih khusus seputar <strong>Perundungan Siber (Cyberbullying)</strong>, adab digital Islami, dampak &amp; solusi, kasus viral, serta video edukasi.
            </span>
          </div>
          <span className="hidden md:inline-block shrink-0 px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-[10px] font-bold text-emerald-800">
            Cyberbullying Only
          </span>
        </div>

        {/* Kontainer Percakapan */}
        <div className="space-y-6 pb-6">
          {messages.map((msg) => {
            const isUser = msg.role === "user";

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
              >
                {/* Header Bubble */}
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] font-semibold text-slate-500">
                  {isUser ? (
                    <span>{studentId}</span>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      TemanCurhat AI
                    </span>
                  )}
                  <span>&bull;</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Bubble Message Utama */}
                <div
                  className={`max-w-[92%] sm:max-w-2xl p-4 sm:p-5 text-sm leading-relaxed transition-all shadow-xs relative group ${
                    isUser
                      ? "bg-emerald-600 text-white rounded-2xl rounded-tr-none font-medium shadow-emerald-600/10"
                      : "bg-white border border-emerald-100 text-slate-800 rounded-2xl rounded-tl-none shadow-slate-200/50"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Tombol Salin Jawaban AI */}
                  {!isUser && (
                    <button
                      type="button"
                      onClick={() => handleCopyText(msg.id, msg.text)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-500 hover:text-emerald-700 text-xs flex items-center gap-1"
                      title="Salin Pesan"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-[10px] text-emerald-600 font-bold">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[10px] font-semibold">Salin</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* ===================================================== */}
                {/* 1. KARTU DALIL / HADITS ISLAM (JIKA ADA) */}
                {/* ===================================================== */}
                {!isUser && msg.hadith && (
                  <div className="mt-3.5 max-w-[92%] sm:max-w-2xl w-full p-5 rounded-3xl bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white border-2 border-emerald-200 shadow-xs">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-extrabold border border-emerald-200">
                            Landasan Syariat &amp; Adab Islam
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                            {msg.hadith.source}
                          </h4>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(
                            `hadith-${msg.id}`,
                            `${msg.hadith?.source}\n\n${msg.hadith?.arabic || ""}\n\n"${msg.hadith?.translation}"\n\nHikmah: ${msg.hadith?.reflection}`
                          )
                        }
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 flex items-center gap-1 transition-all"
                        title="Salin Dalil"
                      >
                        {copiedId === `hadith-${msg.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span className="text-[11px]">
                          {copiedId === `hadith-${msg.id}` ? "Tersalin" : "Salin Dalil"}
                        </span>
                      </button>
                    </div>

                    {/* Teks Arab (Jika ada) */}
                    {msg.hadith.arabic && (
                      <div className="my-3 p-3.5 rounded-2xl bg-white/90 border border-emerald-100 text-right">
                        <p
                          dir="rtl"
                          className="font-serif text-lg sm:text-xl font-medium text-emerald-950 leading-loose"
                        >
                          {msg.hadith.arabic}
                        </p>
                      </div>
                    )}

                    {/* Terjemahan */}
                    <div className="my-2.5 text-xs sm:text-sm text-slate-700 italic bg-white/60 p-3 rounded-xl border border-emerald-100/80">
                      &ldquo;{msg.hadith.translation}&rdquo;
                    </div>

                    {/* Refleksi / Hikmah */}
                    {msg.hadith.reflection && (
                      <div className="mt-3 pt-3 border-t border-emerald-100 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          <strong className="text-emerald-800">Mutiara Adab Medsos:</strong>{" "}
                          {msg.hadith.reflection}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ===================================================== */}
                {/* 2. KARTU DAMPAK & SOLUSI (JIKA ADA) */}
                {/* ===================================================== */}
                {!isUser && msg.impacts_solutions && (
                  <div className="mt-3.5 max-w-[92%] sm:max-w-2xl w-full p-5 rounded-3xl bg-white border-2 border-teal-200/90 shadow-xs">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="p-2 rounded-xl bg-teal-600 text-white shadow-xs">
                        {msg.impacts_solutions.category === "dampak" ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : (
                          <ShieldCheck className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                          {msg.impacts_solutions.category === "dampak"
                            ? "Sorotan Dampak Kritis"
                            : msg.impacts_solutions.category === "solusi"
                            ? "Langkah Solusi Bertindak"
                            : "Analisis Dampak & Panduan Solusi"}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                          {msg.impacts_solutions.title}
                        </h4>
                      </div>
                    </div>

                    <ul className="space-y-2.5 mt-3">
                      {msg.impacts_solutions.points.map((pt, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed"
                        >
                          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* ===================================================== */}
                {/* 3. KARTU KASUS VIRAL NYATA (JIKA ADA) */}
                {/* ===================================================== */}
                {!isUser && msg.viral_case && (
                  <div className="mt-3.5 max-w-[92%] sm:max-w-2xl w-full p-5 rounded-3xl bg-gradient-to-br from-slate-50 via-white to-amber-50/40 border-2 border-slate-200 shadow-xs">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="p-2 rounded-xl bg-slate-800 text-white shadow-xs">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                          Studi Kasus Cyberbullying Viral
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                          {msg.viral_case.title}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-3 rounded-2xl border border-slate-100 mt-2">
                      {msg.viral_case.summary}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                        Pelajaran Penting (Key Takeaways):
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {msg.viral_case.lessons}
                      </p>
                    </div>
                  </div>
                )}

                {/* ===================================================== */}
                {/* 4. KARTU REKOMENDASI VIDEO RESMI (JIKA ADA) */}
                {/* ===================================================== */}
                {!isUser && msg.videos && msg.videos.length > 0 && (
                  <div className="mt-3.5 max-w-[92%] sm:max-w-2xl w-full p-5 rounded-3xl bg-gradient-to-br from-rose-50/50 via-white to-emerald-50/40 border-2 border-rose-200/90 shadow-xs">
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-rose-600 text-white shadow-xs">
                          <Film className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[11px] font-extrabold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200">
                            Rekomendasi Video Terverifikasi
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                            Kanal Resmi: UNICEF, Kemendikbud &amp; Liputan Investigasi
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {msg.videos.map((vid, vIdx) => (
                        <div
                          key={vIdx}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-xs transition-all group"
                        >
                          {/* Thumbnail / Icon */}
                          <div
                            onClick={() => setSelectedVideo(vid)}
                            className="relative w-full sm:w-36 h-24 sm:h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 cursor-pointer group-hover:scale-102 transition-transform shadow-2xs"
                          >
                            <img
                              src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                              alt={vid.title}
                              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                              onError={(e) => {
                                // Fallback jika thumbnail tidak termuat
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                            <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                <Play className="w-4 h-4 fill-white translate-x-0.5" />
                              </div>
                            </div>
                          </div>

                          {/* Info Video */}
                          <div className="flex-1 min-w-0">
                            <span className="inline-block text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 mb-1">
                              {vid.channel}
                            </span>
                            <h5 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-emerald-700 transition-colors">
                              {vid.title}
                            </h5>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                              {vid.description}
                            </p>
                          </div>

                          {/* Aksi Tonton */}
                          <div className="flex sm:flex-col items-center gap-2 shrink-0 w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={() => setSelectedVideo(vid)}
                              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-all hover:scale-102"
                            >
                              <Play className="w-3.5 h-3.5 fill-white" />
                              <span>Tonton di Sini</span>
                            </button>

                            <a
                              href={vid.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] font-semibold border border-slate-200 transition-colors"
                              title="Buka langsung di YouTube"
                            >
                              <span>YouTube</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ===================================================== */}
                {/* 5. KARTU RUJUKAN GURU BK (MUNCUL JIKA recommend_bk: true) */}
                {/* ===================================================== */}
                {!isUser && msg.recommend_bk && (
                  <div className="mt-3.5 max-w-[92%] sm:max-w-2xl w-full p-5 rounded-3xl bg-gradient-to-br from-amber-50/90 via-white to-teal-50/50 border-2 border-amber-300 shadow-sm">
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800 shrink-0 border border-amber-200">
                        <AlertCircle className="w-5 h-5 text-amber-700" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200">
                          <span>Saran Pendampingan Khusus Guru BK</span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          Kamu tidak perlu menanggung ini sendirian, kami ada di sini untukmu.
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {msg.reason ||
                            "Masalah ini bisa diselesaikan bersama guru BK yang ramah tanpa takut bocor ke teman lain."}
                        </p>

                        {/* Dua Tombol Aksi Rujukan BK */}
                        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                          {/* Tombol 1: Chat Langsung */}
                          <Link
                            href="/konseling-bk?tab=chat"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all hover:scale-[1.02]"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>Chat Langsung dengan Guru BK</span>
                          </Link>

                          {/* Tombol 2: Jadwalkan Ketemu */}
                          <Link
                            href="/konseling-bk?tab=appointment"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border-2 border-emerald-500 hover:bg-emerald-50 text-emerald-800 text-xs font-bold transition-all hover:scale-[1.02]"
                          >
                            <Calendar className="w-4 h-4 text-emerald-600" />
                            <span>Jadwalkan Janji Temu Tatap Muka</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ===================================================== */}
                {/* 6. SUGGESTED FOLLOW-UP CHIPS DI BAWAH PESAN ASSISTANT */}
                {/* ===================================================== */}
                {!isUser && msg.suggested_followups && msg.suggested_followups.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 max-w-[92%] sm:max-w-2xl">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-500" />
                      Lanjutkan tanya:
                    </span>
                    {msg.suggested_followups.map((fPrompt, fIdx) => (
                      <button
                        key={fIdx}
                        type="button"
                        onClick={() => handleSendMessage(fPrompt)}
                        disabled={isLoading}
                        className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200/90 text-emerald-900 transition-all hover:scale-[1.02] disabled:opacity-50 text-left"
                      >
                        {fPrompt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Indikator Mengetik (Typing Animation) */}
          {isLoading && (
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1 mb-1 px-1 text-[11px] font-bold text-emerald-700">
                <Sparkles className="w-3 h-3" />
                <span>TemanCurhat AI sedang memproses jawaban terlatih...</span>
              </div>
              <div className="p-4 rounded-2xl rounded-tl-none bg-white border border-emerald-100 shadow-xs flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ========================================================= */}
        {/* BAGIAN BAWAH: KATEGORI, CHIPS PEMANTIK & FORM INPUT */}
        {/* ========================================================= */}
        <div className="sticky bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent pt-3 pb-2">
          {/* TAB KATEGORI TOPIK TERLATIH */}
          <div className="mb-2.5">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(
                [
                  "semua",
                  "hadist",
                  "dampak_solusi",
                  "kasus_viral",
                  "video",
                  "curhat",
                ] as PromptCategory[]
              ).map((catKey) => {
                const cat = CATEGORY_PROMPTS[catKey];
                const isActive = activeCategory === catKey;

                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setActiveCategory(catKey)}
                    className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                      isActive
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs scale-102"
                        : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Prompt Chips Sesuai Kategori Aktif */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1.5 pb-1 scrollbar-none">
              {CATEGORY_PROMPTS[activeCategory].prompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isLoading}
                  className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 border border-emerald-200/90 hover:border-emerald-400 text-slate-700 hover:text-emerald-900 transition-all shadow-2xs hover:scale-[1.02] disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Kotak Retry Jika Pesan Gagal Terkirim */}
          {lastFailedMessage && (
            <div className="mb-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-2 text-xs text-amber-900 shadow-2xs">
              <span className="truncate">Pesan sebelumnya belum terkirim. Ingin mencoba lagi?</span>
              <button
                type="button"
                onClick={() => handleSendMessage(lastFailedMessage)}
                className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all shrink-0 text-xs shadow-2xs"
              >
                Kirim Ulang
              </button>
            </div>
          )}

          {/* Form Input Pesan */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 p-2 rounded-2xl bg-white border-2 border-emerald-200/90 focus-within:border-emerald-500 shadow-sm transition-all"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tanya hadist, dampak, solusi, kasus viral, video, atau curhat cyberbullying... (Enter)"
              disabled={isLoading}
              className="flex-1 px-3 py-2 text-sm bg-transparent outline-none text-slate-900 placeholder:text-slate-400 disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-xs disabled:shadow-none hover:scale-105 active:scale-95 disabled:scale-100"
              aria-label="Kirim Pesan"
            >
              <span className="text-xs font-bold">Kirim</span>
              <SendHorizontal className="w-4 h-4" />
            </button>
          </form>

          {/* Catatan Kaki Keamanan & Etika */}
          <p className="text-[11px] text-center text-slate-400 mt-2 font-medium">
            TemanCurhat AI terlatih untuk edukasi &amp; pendampingan ramah &bull; Jika dalam bahaya
            fisik darurat, hubungi Guru BK, orang tua, atau Hotline SAPA 129 / Sejiwa 119.
          </p>
        </div>
      </main>

      {/* ========================================================= */}
      {/* MODAL PEMUTAR VIDEO YOUTUBE TERINTEGRASI */}
      {/* ========================================================= */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/70">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-rose-600 text-white shrink-0">
                  <Play className="w-4 h-4 fill-white" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                    {selectedVideo.channel}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                    {selectedVideo.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
                title="Tutup Pemutar"
                aria-label="Tutup Pemutar Video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player 16:9 Iframe */}
            <div className="relative w-full pb-[56.25%] bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                title={selectedVideo.title}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-100">
              <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                {selectedVideo.description}
              </p>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <a
                  href={selectedVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors w-full sm:w-auto"
                >
                  <span>Buka di YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedVideo(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
