"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  MessageCircleHeart,
  ShieldCheck,
  SendHorizontal,
  Trash2,
  UserCheck,
  Calendar,
  ArrowLeft,
  Lock,
  Sparkles,
  HelpCircle,
  MessageSquare,
  Smile,
  AlertCircle,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  recommend_bk?: boolean;
  reason?: string;
}

const QUICK_PROMPTS = [
  "Aku sedang dihujat di kolom komentar medsos",
  "Ada yang menyebarkan fotoku tanpa izin",
  "Aku merasa minder dan diejek teman sekelas",
  "Komentar orang-orang membuatku takut membuka ponsel",
];

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Inisialisasi pesan sambutan hangat
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem("temancurhat_chat_history");
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

    // Default pesan awal jika belum ada histori
    setMessages([
      {
        id: "msg-welcome",
        role: "assistant",
        text: "Halo sahabat! Aku TemanCurhat AI. Di sini kamu bisa cerita apa saja tentang perasaanmu, pengalaman di media sosial, atau hal yang bikin kamu sedih dan cemas. Ruang ini 100% anonim dan rahasia. Kamu tidak sendirian, aku siap mendengarkan.",
        timestamp: getFormattedTime(),
        recommend_bk: false,
      },
    ]);
  }, []);

  // Simpan pesan ke localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem("temancurhat_chat_history", JSON.stringify(messages));
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
          history: historyPayload.slice(-8), // Ambil 8 pesan terakhir
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
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: `ai-err-${Date.now()}`,
        role: "assistant",
        text: "Maaf ya, koneksiku sempat terganggu sebentar. Tapi tenang, aku tetap ada di sini untukmu. Boleh ulangi pesanmu sekali lagi?",
        timestamp: getFormattedTime(),
        recommend_bk: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm("Apakah kamu ingin membersihkan percakapan ini?")) {
      const resetMsg: Message = {
        id: `msg-reset-${Date.now()}`,
        role: "assistant",
        text: "Percakapan telah dibersihkan. Aku siap mendengarkan kembali kapan pun kamu ingin bercerita.",
        timestamp: getFormattedTime(),
        recommend_bk: false,
      };
      setMessages([resetMsg]);
      try {
        localStorage.removeItem("temancurhat_chat_history");
      } catch (e) {
        console.warn(e);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50/60 via-white to-teal-50/30 text-slate-800 selection:bg-emerald-200 selection:text-emerald-900">
      {/* ========================================================= */}
      {/* HEADER RUANG CURHAT AI */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 border-b border-emerald-100 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-3">
          {/* Sisi Kiri: Tombol Kembali & Judul */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
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
                  <span>Ruang Cerita TemanCurhat</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Teman curhat AI hangat &amp; empati 24/7
                </p>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: ID Anonim & Badge Privasi */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>100% Anonim &amp; Rahasia</span>
            </div>

            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
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

        {/* Mobile Privacy Sub-bar */}
        <div className="sm:hidden px-4 py-1.5 bg-emerald-50/70 border-t border-emerald-100/60 text-[11px] text-emerald-800 text-center font-medium flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Identitasmu Aman &bull; Percakapan ini tidak dibagikan ke siapa pun</span>
        </div>
      </header>

      {/* ========================================================= */}
      {/* AREA UTAMA CHAT */}
      {/* ========================================================= */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col justify-between">
        {/* Kontainer Percakapan */}
        <div className="space-y-5 pb-6">
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
                      <Sparkles className="w-3 h-3" />
                      TemanCurhat AI
                    </span>
                  )}
                  <span>&bull;</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Bubble Message */}
                <div
                  className={`max-w-[88%] sm:max-w-xl p-4 sm:p-5 text-sm leading-relaxed transition-all ${
                    isUser
                      ? "bg-emerald-500 text-white rounded-2xl rounded-tr-none shadow-xs font-medium"
                      : "bg-white border border-emerald-100 text-slate-800 rounded-2xl rounded-tl-none shadow-xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* KARTU RUJUKAN GURU BK (MUNCUL JIKA recommend_bk: true) */}
                {!isUser && msg.recommend_bk && (
                  <div className="mt-3.5 max-w-[88%] sm:max-w-xl w-full p-5 rounded-3xl bg-gradient-to-br from-amber-50/90 via-white to-teal-50/50 border-2 border-amber-200/90 shadow-sm">
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800 shrink-0 border border-amber-200">
                        <AlertCircle className="w-5 h-5 text-amber-700" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200">
                          <span>Saran Pendampingan Khusus</span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          Kamu tidak perlu menanggung ini sendirian, kami ada di sini untukmu.
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Ingin ngobrol santai dengan Guru BK yang ramah? Masalah ini bisa
                          diselesaikan bersama tanpa takut dimarahi atau bocor ke teman lain.
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
                            <span>Jadwalkan Ketemu Langsung</span>
                          </Link>
                        </div>
                      </div>
                    </div>
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
                <span>TemanCurhat AI sedang mengetik balasan...</span>
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
        {/* BAGIAN BAWAH: CHIPS PEMANTIK & FORM INPUT */}
        {/* ========================================================= */}
        <div className="sticky bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent pt-4 pb-2">
          {/* Quick Prompt Chips (Kapsul Pastel) */}
          <div className="mb-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bingung mulai dari mana? Pilih topik ini:</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isLoading}
                  className="shrink-0 text-xs font-semibold px-3.5 py-2 rounded-full bg-white hover:bg-emerald-50 border border-emerald-200/90 hover:border-emerald-400 text-slate-700 hover:text-emerald-800 transition-all shadow-2xs hover:scale-[1.02] disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

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
              placeholder="Ketik apa yang sedang kamu rasakan di sini... (tekan Enter)"
              disabled={isLoading}
              className="flex-1 px-3 py-2 text-sm bg-transparent outline-none text-slate-900 placeholder:text-slate-400 disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-xs disabled:shadow-none hover:scale-105 active:scale-95 disabled:scale-100"
              aria-label="Kirim Pesan"
            >
              <span className="hidden sm:inline text-xs">Kirim</span>
              <SendHorizontal className="w-4 h-4" />
            </button>
          </form>

          {/* Catatan Kaki Keamanan */}
          <p className="text-[11px] text-center text-slate-400 mt-2 font-medium">
            TemanCurhat AI memberikan dukungan emosional &bull; Jika dalam bahaya fisik, hubungi
            orang tua, guru, atau darurat 112.
          </p>
        </div>
      </main>
    </div>
  );
}
