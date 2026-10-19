"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  UserCheck,
  MessageSquare,
  Calendar,
  Lock,
  ArrowLeft,
  X,
  SendHorizontal,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Smile,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  PhoneCall,
} from "lucide-react";
import {
  initialTeachersBK,
  APPOINTMENT_LOCATIONS,
  initialSampleAppointments,
  TeacherBK,
  InPersonAppointment,
  BKChatMessage,
} from "@/lib/mockData";

// Helper Anonymous Student ID
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
  return new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function KonselingBKContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "list";

  const studentId = useAnonymousSession();
  const [teachers] = useState<TeacherBK[]>(initialTeachersBK);

  // Modal States
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherBK>(initialTeachersBK[0]);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState<BKChatMessage[]>([]);
  const [inputChatMessage, setInputChatMessage] = useState("");
  const [isTeacherTyping, setIsTeacherTyping] = useState(false);

  // Appointment Form State
  const [appointmentLocation, setAppointmentLocation] = useState(APPOINTMENT_LOCATIONS[0]);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("10:00");
  const [appointmentSuccess, setAppointmentSuccess] = useState<InPersonAppointment | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Tangani URL param tab ('chat' atau 'appointment')
  useEffect(() => {
    if (initialTab === "chat") {
      setIsChatModalOpen(true);
    } else if (initialTab === "appointment") {
      setIsAppointmentModalOpen(true);
    }
  }, [initialTab]);

  // Muat riwayat live chat untuk guru terpilih dari localStorage
  useEffect(() => {
    if (selectedTeacher) {
      const storageKey = `temancurhat_bk_chat_${selectedTeacher.id}`;
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setChatMessages(parsed);
            return;
          }
        }
      } catch (e) {
        console.warn(e);
      }

      // Default welcome message dari Guru BK terpilih
      setChatMessages([
        {
          id: `greet-${selectedTeacher.id}`,
          sessionId: `session-${studentId}`,
          senderRole: "teacher",
          senderName: selectedTeacher.name,
          text: `Halo ananda (${studentId})! Saya ${selectedTeacher.name}. Ruang chat ini 100% anonim dan rahasia. Jangan sungkan menceritakan apa yang sedang kamu rasakan atau alami. Ibu/Bapak siap menemani dan mendengarkan.`,
          timestamp: getFormattedTime(),
        },
      ]);
    }
  }, [selectedTeacher, studentId]);

  // Simpan chat ke localStorage setiap berubah
  useEffect(() => {
    if (selectedTeacher && chatMessages.length > 0) {
      const storageKey = `temancurhat_bk_chat_${selectedTeacher.id}`;
      try {
        localStorage.setItem(storageKey, JSON.stringify(chatMessages));

        // Update juga ke all_sessions agar dashboard BK bisa memantau
        const allSessionsKey = "temancurhat_bk_all_sessions";
        const storedSessions = localStorage.getItem(allSessionsKey);
        let sessions = storedSessions ? JSON.parse(storedSessions) : [];
        const lastMsg = chatMessages[chatMessages.length - 1];

        const existingIndex = sessions.findIndex(
          (s: any) => s.teacherId === selectedTeacher.id && s.studentId === studentId
        );

        const sessionItem = {
          sessionId: `session-${studentId}`,
          studentId: studentId,
          teacherId: selectedTeacher.id,
          teacherName: selectedTeacher.name,
          lastMessage: lastMsg.text,
          lastUpdated: lastMsg.timestamp,
        };

        if (existingIndex >= 0) {
          sessions[existingIndex] = sessionItem;
        } else {
          sessions.unshift(sessionItem);
        }
        localStorage.setItem(allSessionsKey, JSON.stringify(sessions));
      } catch (e) {
        console.warn(e);
      }
    }
  }, [chatMessages, selectedTeacher, studentId]);

  // Kirim pesan chat murid ke guru BK
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputChatMessage.trim();
    if (!text || isTeacherTyping) return;

    const newMsg: BKChatMessage = {
      id: `std-${Date.now()}`,
      sessionId: `session-${studentId}`,
      senderRole: "student",
      senderName: studentId,
      text,
      timestamp: getFormattedTime(),
    };

    const updated = [...chatMessages, newMsg];
    setChatMessages(updated);
    setInputChatMessage("");
    setIsTeacherTyping(true);

    // Simulasi respons otomatis ramah dari Guru BK setelah 2.5 detik
    setTimeout(() => {
      const teacherResponses = [
        `Terima kasih ya sudah berani menceritakan hal ini ke ${selectedTeacher.name.includes("Siti") ? "Ibu" : "Bapak"}. Perasaan sedih atau tertekan yang kamu rasakan itu wajar, dan kamu sama sekali tidak bersalah. Coba tarik napas perlahan ya. Apa kamu punya bukti tangkapan layar ejekan tersebut?`,
        `Ibu/Bapak mengerti sekali betapa tidak nyamannya berada di posisi kamu saat ini. Ketahuilah bahwa kamu tidak sendirian. Kita bisa cari jalan keluar bersama secara bertahap tanpa membuatmu merasa tertekan di kelas.`,
        `Langkahmu untuk mencari bantuan hari ini adalah keputusan yang sangat bijak dan dewasa. Jangan biarkan komentar-komentar itu meragukan kebaikan dirimu. Kalau kamu merasa nyaman, kita juga bisa jadwalkan waktu untuk ngobrol santai langsung ya.`,
      ];

      const replyText =
        teacherResponses[Math.floor(Math.random() * teacherResponses.length)];

      const teacherReply: BKChatMessage = {
        id: `tch-${Date.now()}`,
        sessionId: `session-${studentId}`,
        senderRole: "teacher",
        senderName: selectedTeacher.name,
        text: replyText,
        timestamp: getFormattedTime(),
      };

      setChatMessages((prev) => [...prev, teacherReply]);
      setIsTeacherTyping(false);
    }, 2500);
  };

  // Submit Booking Tatap Muka
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!appointmentDate) {
      alert("Silakan pilih tanggal pertemuan terlebih dahulu.");
      return;
    }

    // Generate kode booking unik (misal: "BK-7892")
    const randomCodeNum = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `BK-${randomCodeNum}`;

    const newAppointment: InPersonAppointment = {
      id: `apt-${Date.now()}`,
      bookingCode,
      studentId,
      teacherId: selectedTeacher.id,
      teacherName: selectedTeacher.name,
      location: appointmentLocation,
      dateTime: `${appointmentDate} pk ${appointmentTime} WIB`,
      status: "Dikonfirmasi",
      createdAt: new Date().toLocaleString("id-ID"),
    };

    // Simpan ke localStorage
    try {
      const storedApts = localStorage.getItem("temancurhat_bk_appointments");
      const list: InPersonAppointment[] = storedApts
        ? JSON.parse(storedApts)
        : initialSampleAppointments;
      const updatedList = [newAppointment, ...list];
      localStorage.setItem("temancurhat_bk_appointments", JSON.stringify(updatedList));
    } catch (e) {
      console.warn(e);
    }

    setAppointmentSuccess(newAppointment);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50/60 via-white to-teal-50/30 text-slate-800 selection:bg-emerald-200 selection:text-emerald-900">
      {/* ========================================================= */}
      {/* NAVBAR */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/95 border-b border-emerald-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-slate-900">Konseling &amp; Sahabat BK</span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                  Layanan Resmi Sekolah
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Teman curhat profesional, aman, &amp; rahasia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Anonim Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{studentId}</span>
            </div>

            {/* Tombol Demo Panel Guru BK */}
            <Link
              href="/dashboard-bk"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Panel Guru BK (Demo)</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* HERO & PENJELASAN RAMAH */}
      {/* ========================================================= */}
      <section className="pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Smile className="w-4 h-4 text-emerald-600" />
            <span>Ruang Konseling &amp; Pendampingan Ramah Siswa</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Pintu Bimbingan Konseling{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Selalu Terbuka Untukmu
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Pilih bapak/ibu guru BK yang membuatmu paling nyaman untuk bercerita. Identitasmu tetap{" "}
            <strong className="text-emerald-700 font-bold">anonim</strong> dan dilindungi sepenuhnya
            oleh kode etik konseling sekolah.
          </p>

          {/* Quick Notice Banner */}
          <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-xs flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 max-w-xl mx-auto">
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4" /> 100% Rahasia
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-teal-700 font-bold">
              <MessageSquare className="w-4 h-4" /> Live Chat Online
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-slate-700 font-bold">
              <Calendar className="w-4 h-4 text-emerald-600" /> Janji Tatap Muka
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* DAFTAR KARTU GURU BK */}
      {/* ========================================================= */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-300 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header Kartu: Avatar & Status */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${teacher.avatarBg} text-white flex items-center justify-center text-lg font-black shadow-md shadow-emerald-500/15`}
                  >
                    {teacher.initials}
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{teacher.status}</span>
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1">
                      {teacher.experienceYears} Th Pengalaman
                    </span>
                  </div>
                </div>

                {/* Nama & Spesialisasi */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                  {teacher.name}
                </h3>
                <p className="text-xs font-semibold text-emerald-700 mt-0.5 mb-2">
                  {teacher.title}
                </p>

                <div className="inline-block px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium mb-4">
                  <strong className="text-slate-900 font-bold">Fokus:</strong> {teacher.specialization}
                </div>

                {/* Kutipan Kepedulian */}
                <p className="text-xs text-slate-600 italic leading-relaxed bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100/70 mb-5">
                  &quot;{teacher.caringQuote}&quot;
                </p>

                {/* Jadwal */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-6">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{teacher.availableDays}</span>
                </div>
              </div>

              {/* 2 Tombol Aksi Utama */}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                {/* Aksi 1: Chat Sekarang */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTeacher(teacher);
                    setIsChatModalOpen(true);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-emerald-500 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-xs hover:scale-[1.02] active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat Sekarang (Anonim)</span>
                </button>

                {/* Aksi 2: Janji Tatap Muka */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTeacher(teacher);
                    setAppointmentSuccess(null);
                    setIsAppointmentModalOpen(true);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-emerald-800 bg-white border-2 border-emerald-500 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                >
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Janji Tatap Muka</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* KOMPONEN 1: MODAL LIVE CHAT ANONIM (DUA ARAH) */}
      {/* ========================================================= */}
      {isChatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-emerald-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${selectedTeacher.avatarBg} text-white flex items-center justify-center font-bold text-base shadow-xs`}
                >
                  {selectedTeacher.initials}
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                    {selectedTeacher.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Aktif Konseling
                    </span>
                    <span>&bull;</span>
                    <span className="font-bold text-slate-700">{studentId}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsChatModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white transition-colors"
                aria-label="Tutup Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Area Pesan Chat */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gradient-to-b from-white to-emerald-50/20">
              {chatMessages.map((msg) => {
                const isStudent = msg.senderRole === "student";

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isStudent ? "items-end" : "items-start"}`}
                  >
                    <span className="text-[10px] font-semibold text-slate-400 mb-1 px-1">
                      {isStudent ? studentId : selectedTeacher.name} &bull; {msg.timestamp}
                    </span>
                    <div
                      className={`max-w-[85%] sm:max-w-md p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed rounded-2xl ${
                        isStudent
                          ? "bg-emerald-500 text-white rounded-tr-none shadow-xs font-medium"
                          : "bg-white border border-emerald-100 text-slate-800 rounded-tl-none shadow-xs"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                );
              })}

              {/* Indikator Guru Mengetik */}
              {isTeacherTyping && (
                <div className="flex flex-col items-start">
                  <span className="text-[10px] font-bold text-emerald-700 mb-1 px-1">
                    {selectedTeacher.name} sedang mengetik...
                  </span>
                  <div className="p-3 rounded-2xl rounded-tl-none bg-white border border-emerald-100 shadow-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Form Chat */}
            <form
              onSubmit={handleSendChatMessage}
              className="p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputChatMessage}
                onChange={(e) => setInputChatMessage(e.target.value)}
                placeholder={`Tulis pesanmu ke ${selectedTeacher.name.split(",")[0]}...`}
                disabled={isTeacherTyping}
                className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none text-slate-900 placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!inputChatMessage.trim() || isTeacherTyping}
                className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                <span className="hidden sm:inline text-xs">Kirim</span>
                <SendHorizontal className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* KOMPONEN 2: MODAL BOOKING TATAP MUKA (HANYA 2 INPUT UTAMA) */}
      {/* ========================================================= */}
      {isAppointmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-emerald-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Janji Tatap Muka Ramah</h4>
                  <p className="text-xs text-slate-500">
                    Dengan: <strong className="text-slate-800">{selectedTeacher.name}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAppointmentModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                aria-label="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              {!appointmentSuccess ? (
                <form onSubmit={handleBookingSubmit} className="space-y-5">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-slate-700 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>
                      Kamu tidak perlu mengisi nama aslimu. Cukup tentukan tempat dan waktu yang
                      paling nyaman bagimu.
                    </span>
                  </div>

                  {/* INPUT 1: PILIHAN LOKASI PERTEMUAN */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span>1. Pilihan Lokasi Pertemuan</span>
                    </label>
                    <select
                      value={appointmentLocation}
                      onChange={(e) => setAppointmentLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:border-emerald-500 outline-none"
                    >
                      {APPOINTMENT_LOCATIONS.map((loc, idx) => (
                        <option key={idx} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-400">
                      Pilih lokasi yang membuatmu paling rileks dan leluasa bercerita.
                    </p>
                  </div>

                  {/* INPUT 2: WAKTU PERTEMUAN (TANGGAL & JAM) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>2. Waktu Pertemuan</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="date"
                          value={appointmentDate}
                          onChange={(e) => setAppointmentDate(e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <select
                          value={appointmentTime}
                          onChange={(e) => setAppointmentTime(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:border-emerald-500 outline-none"
                        >
                          <option value="08:30">08:30 WIB (Pagi)</option>
                          <option value="10:00">10:00 WIB (Istirahat 1)</option>
                          <option value="12:30">12:30 WIB (Istirahat 2)</option>
                          <option value="14:00">14:00 WIB (Pulang Sekolah)</option>
                        </select>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Jadwal dapat disesuaikan saat jam istirahat agar tidak mengganggu jam pelajaran.
                    </p>
                  </div>

                  {/* Tombol Buat Janji */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.01]"
                    >
                      Konfirmasi Janji &amp; Dapatkan Kode Booking
                    </button>
                  </div>
                </form>
              ) : (
                /* KARTU KONFIRMASI KODE BOOKING */
                <div className="text-center space-y-5 py-2">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <h4 className="text-lg font-black text-slate-900">
                      Janji Temu Berhasil Terjadwal!
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                      Simpan kode berikut. Saat tiba waktunya, kamu cukup menunjukkan kode ini tanpa
                      harus menyebutkan nama aslimu.
                    </p>
                  </div>

                  {/* KODE BOX */}
                  <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 max-w-xs mx-auto">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                      Kode Booking Anonim
                    </span>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="text-3xl font-black text-emerald-700 tracking-wider font-mono">
                        {appointmentSuccess.bookingCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(appointmentSuccess.bookingCode)}
                        className="p-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                        title="Salin Kode"
                      >
                        {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    {copiedCode && (
                      <p className="text-[11px] text-emerald-600 font-bold mt-1">
                        Kode berhasil disalin!
                      </p>
                    )}
                  </div>

                  {/* Rincian Ringkas */}
                  <div className="text-left bg-slate-50 p-4 rounded-xl text-xs space-y-1.5 border border-slate-200">
                    <p className="text-slate-600">
                      <strong>Guru BK:</strong> {appointmentSuccess.teacherName}
                    </p>
                    <p className="text-slate-600">
                      <strong>Lokasi:</strong> {appointmentSuccess.location}
                    </p>
                    <p className="text-slate-600">
                      <strong>Waktu:</strong> {appointmentSuccess.dateTime}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAppointmentModalOpen(false);
                      setAppointmentSuccess(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                  >
                    Tutup &amp; Selesai
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER RINGKAS */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>
          Layanan Bimbingan Konseling Sekolah TemanCurhat &bull; Membantu generasi muda dengan empati
          dan integritas
        </p>
      </footer>
    </div>
  );
}

export default function KonselingBKPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 text-sm">
          Memuat halaman konseling...
        </div>
      }
    >
      <KonselingBKContent />
    </Suspense>
  );
}
