"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  UserCheck,
  MessageSquare,
  Calendar,
  SendHorizontal,
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  Users,
  Search,
  Filter,
  Check,
  Smile,
  ExternalLink,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import {
  initialTeachersBK,
  initialSampleAppointments,
  TeacherBK,
  InPersonAppointment,
  BKChatMessage,
} from "@/lib/mockData";

export default function DashboardBKPage() {
  const [teachers] = useState<TeacherBK[]>(initialTeachersBK);
  const [activeTeacher, setActiveTeacher] = useState<TeacherBK>(initialTeachersBK[0]);

  // Appointments State
  const [appointments, setAppointments] = useState<InPersonAppointment[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("Semua");

  // Chat Sessions State
  const [chatMessages, setChatMessages] = useState<BKChatMessage[]>([]);
  const [replyInput, setReplyInput] = useState("");
  const [studentIdLabel, setStudentIdLabel] = useState("Siswa #4821");

  // Muat data janji temu & chat dari localStorage
  const loadData = () => {
    try {
      // 1. Muat Appointments
      const storedApts = localStorage.getItem("temancurhat_bk_appointments");
      if (storedApts) {
        setAppointments(JSON.parse(storedApts));
      } else {
        setAppointments(initialSampleAppointments);
      }

      // 2. Muat Student ID
      const storedStudentId = localStorage.getItem("temancurhat_student_id") || "Siswa #4821";
      setStudentIdLabel(storedStudentId);

      // 3. Muat Chat Messages untuk Guru Aktif
      const storageKey = `temancurhat_bk_chat_${activeTeacher.id}`;
      const storedChat = localStorage.getItem(storageKey);
      if (storedChat) {
        setChatMessages(JSON.parse(storedChat));
      } else {
        setChatMessages([
          {
            id: "msg-default-1",
            sessionId: `session-${storedStudentId}`,
            senderRole: "student",
            senderName: storedStudentId,
            text: "Assalamualaikum Bu Siti, saya merasa takut ke sekolah karena ada akun anonim yang menyebarkan editan fotoku...",
            timestamp: "09:30",
          },
          {
            id: "msg-default-2",
            sessionId: `session-${storedStudentId}`,
            senderRole: "teacher",
            senderName: activeTeacher.name,
            text: "Wa'alaikumsalam ananda. Terima kasih sudah berani cerita ke ibu. Kamu aman bersama kami. Jangan dihapus dulu ya bukti screenshot-nya...",
            timestamp: "09:32",
          },
        ]);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTeacher]);

  // Kirim balasan langsung dari Guru BK ke Murid
  const handleSendTeacherReply = (e: React.FormEvent) => {
    e.preventDefault();
    const text = replyInput.trim();
    if (!text) return;

    const time = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newReply: BKChatMessage = {
      id: `tch-${Date.now()}`,
      sessionId: `session-${studentIdLabel}`,
      senderRole: "teacher",
      senderName: activeTeacher.name,
      text,
      timestamp: time,
    };

    const updated = [...chatMessages, newReply];
    setChatMessages(updated);
    setReplyInput("");

    // Simpan ke localStorage agar sinkron dengan tampilan murid
    try {
      const storageKey = `temancurhat_bk_chat_${activeTeacher.id}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));

      // Update session list juga
      const allSessionsKey = "temancurhat_bk_all_sessions";
      const storedSessions = localStorage.getItem(allSessionsKey);
      let sessions = storedSessions ? JSON.parse(storedSessions) : [];
      const sessionItem = {
        sessionId: `session-${studentIdLabel}`,
        studentId: studentIdLabel,
        teacherId: activeTeacher.id,
        teacherName: activeTeacher.name,
        lastMessage: text,
        lastUpdated: time,
      };
      const idx = sessions.findIndex(
        (s: any) => s.teacherId === activeTeacher.id && s.studentId === studentIdLabel
      );
      if (idx >= 0) sessions[idx] = sessionItem;
      else sessions.unshift(sessionItem);
      localStorage.setItem(allSessionsKey, JSON.stringify(sessions));
    } catch (e) {
      console.warn(e);
    }
  };

  // Ubah status Janji Temu
  const handleUpdateStatus = (id: string, newStatus: "Menunggu" | "Dikonfirmasi" | "Selesai") => {
    const updated = appointments.map((apt) =>
      apt.id === id ? { ...apt, status: newStatus } : apt
    );
    setAppointments(updated);
    try {
      localStorage.setItem("temancurhat_bk_appointments", JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  // Filter appointments
  const filteredAppointments = appointments.filter((apt) => {
    if (filterStatus === "Semua") return true;
    return apt.status === filterStatus;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50/50 via-white to-teal-50/30 text-slate-800 selection:bg-emerald-200 selection:text-emerald-900">
      {/* ========================================================= */}
      {/* NAVBAR PANEL DEMO */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/95 border-b border-emerald-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/konseling-bk"
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              title="Kembali ke Konseling Murid"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-slate-900">
                  Panel Guru BK &amp; Konselor
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200">
                  Mode Simulasi Demo
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Pusat monitoring sesi chat &amp; jadwal janji temu siswa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadData}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs flex items-center gap-1 font-semibold"
              title="Refresh Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              href="/konseling-bk"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs transition-all hover:scale-105"
            >
              <span>Buka Tampilan Murid</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* STATISTIK CEPAT */}
      {/* ========================================================= */}
      <section className="pt-8 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-emerald-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Sesi Chat Masuk
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                {chatMessages.length > 0 ? "3 Sesi Aktif" : "1 Sesi Aktif"}
              </h3>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Siswa Anonim Terlindungi
              </span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-teal-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Janji Tatap Muka
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                {appointments.length} Terjadwal
              </h3>
              <span className="text-[11px] text-teal-600 font-semibold">
                Ruang BK Privat &amp; Gazebo
              </span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-amber-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status Ruang BK
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">Siap &amp; Aman</h3>
              <span className="text-[11px] text-amber-800 font-semibold">
                Kerahasiaan 100% Terjaga
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* AREA UTAMA: INTERAKSI LIVE CHAT (SISI GURU BK) */}
      {/* ========================================================= */}
      <section className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Header Sub-Section */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50/80 to-teal-50/50 border-b border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Kotak Masuk Curhat Siswa Anonim
                </h3>
                <p className="text-xs text-slate-500">
                  Balas pesan siswa secara langsung — balasanmu akan langsung terbaca oleh murid di
                  jendela chat mereka.
                </p>
              </div>
            </div>

            {/* Pilihan Akun Guru yang Bertugas */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Login sebagai:</span>
              <select
                value={activeTeacher.id}
                onChange={(e) => {
                  const found = teachers.find((t) => t.id === e.target.value);
                  if (found) setActiveTeacher(found);
                }}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 outline-none"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name.split(",")[0]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chat Workspace (Sidebar Sesi + Main Thread) */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
            {/* Sidebar Daftar Sesi Siswa (4 Kolom) */}
            <div className="md:col-span-4 border-r border-slate-100 p-3 sm:p-4 bg-slate-50/50 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
                Sesi Percakapan Aktif
              </span>

              {/* Sesi Utama Siswa Terkini */}
              <div className="p-3.5 rounded-2xl bg-white border-2 border-emerald-500 shadow-xs cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {studentIdLabel}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Aktif</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1 italic">
                  {chatMessages[chatMessages.length - 1]?.text || "Memulai obrolan..."}
                </p>
              </div>

              {/* Sesi Dummy Tambahan untuk Keperluan Demo */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 opacity-80 cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    Siswa #1209
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">10:15</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1 italic">
                  &quot;Terima kasih ya bu sarannya kemarin, saya sudah blokir akunnya...&quot;
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 opacity-80 cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    Siswa #8920
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Kemarin</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1 italic">
                  &quot;Saya merasa lebih tenang setelah ngobrol di gazebo sekolah...&quot;
                </p>
              </div>
            </div>

            {/* Thread Chat (8 Kolom) */}
            <div className="md:col-span-8 flex flex-col justify-between p-4 sm:p-5 bg-gradient-to-b from-white to-emerald-50/10">
              <div className="space-y-3.5 max-h-[280px] overflow-y-auto pr-1">
                {chatMessages.map((msg) => {
                  const isTeacher = msg.senderRole === "teacher";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isTeacher ? "items-end" : "items-start"}`}
                    >
                      <span className="text-[10px] font-semibold text-slate-400 mb-0.5 px-1">
                        {msg.senderName} &bull; {msg.timestamp}
                      </span>
                      <div
                        className={`max-w-[90%] sm:max-w-lg p-3 sm:p-3.5 text-xs sm:text-sm leading-relaxed rounded-2xl ${
                          isTeacher
                            ? "bg-emerald-600 text-white rounded-tr-none font-medium shadow-xs"
                            : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/80"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Form Balas Pesan */}
              <form onSubmit={handleSendTeacherReply} className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  placeholder={`Ketik pesan balasan resmi sebagai ${activeTeacher.name.split(",")[0]}...`}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:border-emerald-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={!replyInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <span>Balas</span>
                  <SendHorizontal className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* TABEL JADWAL TATAP MUKA */}
      {/* ========================================================= */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-12">
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-teal-100 text-teal-700">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Jadwal Pertemuan Tatap Muka Siswa
                </h3>
                <p className="text-xs text-slate-500">
                  Daftar siswa yang telah membuat janji pertemuan anonim.
                </p>
              </div>
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs text-slate-500 font-semibold">Filter:</span>
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {["Semua", "Dikonfirmasi", "Menunggu", "Selesai"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      filterStatus === st
                        ? "bg-white text-emerald-800 font-bold shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tabel Responsif */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Kode Booking</th>
                  <th className="py-3 px-3">Siswa Anonim</th>
                  <th className="py-3 px-3">Guru BK Tujuan</th>
                  <th className="py-3 px-3">Pilihan Lokasi</th>
                  <th className="py-3 px-3">Waktu Pertemuan</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-emerald-700 text-sm">
                        {apt.bookingCode}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-800">
                        {apt.studentId}
                      </td>
                      <td className="py-3.5 px-3 text-slate-700 font-medium">
                        {apt.teacherName}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{apt.location}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-700 font-medium">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{apt.dateTime}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            apt.status === "Dikonfirmasi"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : apt.status === "Menunggu"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {apt.status === "Dikonfirmasi" && <Check className="w-3 h-3" />}
                          <span>{apt.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {apt.status !== "Selesai" ? (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(apt.id, "Selesai")}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 text-[11px] font-semibold transition-colors"
                          >
                            Tandai Selesai
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">Telah Selesai</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      Tidak ada janji temu dengan status &quot;{filterStatus}&quot;.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>Panel Manajemen Konseling Guru BK &bull; TemanCurhat Prototype</p>
      </footer>
    </div>
  );
}
