"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  MessageCircleHeart,
  UserCheck,
  ExternalLink,
  AlertTriangle,
  HeartHandshake,
  Eye,
  BookOpen,
  Sparkles,
  ArrowRight,
  BarChart3,
  PieChart as PieChartIcon,
  Quote,
  CheckCircle2,
  Lock,
  Menu,
  X,
  Compass,
  Headphones,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  initialBullyingSources,
  cyberbullyingStatsData,
  vulnerableGroupFact,
  dalilAlHujurat11,
  coreValuesData,
} from "@/lib/mockData";

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeChartType, setActiveChartType] = useState<"donut" | "bar">("donut");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50/60 via-white to-teal-50/40 text-slate-800 selection:bg-emerald-200 selection:text-emerald-900">
      {/* ========================================================= */}
      {/* NAVBAR */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-emerald-100/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <MessageCircleHeart className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 bg-clip-text text-transparent">
                TemanCurhat
              </span>
              <span className="block text-[11px] font-semibold text-emerald-600 -mt-1 tracking-wider uppercase">
                Adab &amp; Curhat Bijak
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
            <a href="#hero" className="hover:text-emerald-600 transition-colors">
              Beranda
            </a>
            <a href="#fakta-data" className="hover:text-emerald-600 transition-colors">
              Data &amp; Fakta
            </a>
            <a href="#landasan-agama" className="hover:text-emerald-600 transition-colors">
              Landasan Dalil
            </a>
            <a href="#pilar-nilai" className="hover:text-emerald-600 transition-colors">
              Nilai Islam
            </a>
          </nav>

          {/* CTA Buttons Header */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/konseling-bk"
              className="px-4 py-2 text-sm font-bold text-emerald-700 bg-white border-2 border-emerald-500 hover:bg-emerald-50 rounded-xl transition-all shadow-xs"
            >
              Guru BK
            </Link>
            <Link
              href="/curhat-ai"
              prefetch={true}
              className="px-5 py-2 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-md shadow-emerald-500/25 transition-all hover:scale-[1.02]"
            >
              Curhat ke AI
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-slate-700 hover:text-emerald-700 transition-colors"
            aria-label="Buka menu navigasi"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/98 border-b border-emerald-100 px-4 py-5 space-y-4 shadow-xl">
            <div className="flex flex-col gap-3 font-semibold text-slate-700">
              <a
                href="#hero"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-emerald-600 py-1"
              >
                Beranda
              </a>
              <a
                href="#fakta-data"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-emerald-600 py-1"
              >
                Data &amp; Fakta Cyberbullying
              </a>
              <a
                href="#landasan-agama"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-emerald-600 py-1"
              >
                Landasan QS. Al-Hujurat 11
              </a>
              <a
                href="#pilar-nilai"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-emerald-600 py-1"
              >
                3 Kartu Nilai (Iman, Islam, Ihsan)
              </a>
            </div>
            <div className="pt-3 border-t border-emerald-100 flex flex-col gap-2">
              <Link
                href="/curhat-ai"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
              >
                Curhat Anonim ke AI
              </Link>
              <Link
                href="/konseling-bk"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl font-bold border-2 border-emerald-500 bg-white text-emerald-700 hover:bg-emerald-50"
              >
                Konsultasi Guru BK
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================= */}
      <section id="hero" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Soft Ambient Radiant Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-emerald-300/20 blur-[100px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 -right-20 w-[450px] h-[350px] bg-teal-200/25 blur-[110px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge Tagline Cerah & Ramah */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300/80 text-emerald-800 text-xs sm:text-sm font-semibold tracking-wide mb-8 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Platform Edukasi &amp; Ruang Aman Remaja Muslim</span>
          </div>

          {/* Slogan Utama */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.18] sm:leading-[1.18]">
            Sebelum Jempolmu Beraksi,{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              Ingat Allah Melihatmu.
            </span>
          </h1>

          {/* Subjudul / Pesan */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            Media sosial adalah ladang amal. Gunakan jarimu untuk kebaikan, bukan melukai, karena
            setiap ketikan dilihat dan dicatat oleh Allah.
          </p>

          {/* 2 Tombol CTA Utama */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
            {/* CTA 1: Curhat Anonim ke AI (Mencolok Emerald Cerah) */}
            <Link
              href="/curhat-ai"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-105 active:scale-95 group"
            >
              <MessageCircleHeart className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
              <span>Curhat Anonim ke AI</span>
              <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* CTA 2: Konsultasi Guru BK (Outline Sekunder Ramah) */}
            <Link
              href="/konseling-bk"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold text-emerald-700 bg-white border-2 border-emerald-500 hover:bg-emerald-50 shadow-xs transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <span>Konsultasi Guru BK</span>
            </Link>
          </div>

          {/* Trust Highlights Cards (Warm Light Badges) */}
          <div className="mt-14 pt-10 border-t border-emerald-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-4xl mx-auto">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/90 border border-emerald-100 shadow-xs">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">100% Anonim</p>
                <p className="text-[11px] text-slate-500">Identitas terlindungi</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/90 border border-emerald-100 shadow-xs">
              <div className="p-2.5 rounded-xl bg-teal-100 text-teal-700">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">AI Empati 24/7</p>
                <p className="text-[11px] text-slate-500">Teman cerita kapan pun</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/90 border border-emerald-100 shadow-xs">
              <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Guru BK Resmi</p>
                <p className="text-[11px] text-slate-500">Konseling profesional</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/90 border border-emerald-100 shadow-xs">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Nilai Qur&apos;ani</p>
                <p className="text-[11px] text-slate-500">Adab bermedia sosial</p>
              </div>
            </div>
          </div>

          {/* Trained AI Feature Callout Banner */}
          <div className="mt-8 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-200/80 shadow-xs max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-emerald-600 text-white shrink-0 shadow-md shadow-emerald-600/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-extrabold border border-emerald-200">
                  <span>Baru: TemanCurhat AI Terlatih</span>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">
                  Dilatih Khusus Mengenai Bullying, Hadits Islam, Dampak, Solusi &amp; Kasus Viral
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                  Tanyakan dalil adab medsos (QS. Al-Hujurat: 11, Hadits Muflis), analisis kasus viral di Indonesia, hingga tonton video edukasi resmi langsung di aplikasi.
                </p>
              </div>
            </div>

            <Link
              href="/curhat-ai"
              className="shrink-0 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>Coba AI Chatbot</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2 & 3. DASHBOARD DATA, SUMBER BULLYING & LANDASAN AGAMA */}
      {/* ========================================================= */}
      <section
        id="fakta-data"
        className="py-16 lg:py-24 bg-gradient-to-b from-white via-emerald-50/40 to-white relative border-t border-emerald-100/70"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section Data */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3 border border-emerald-200">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Realita Digital Indonesia</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Fakta &amp; Realita Cyberbullying di Sekitar Kita
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600">
              Bukan sekadar gurauan di kolom komentar. Perundungan siber nyata melukai perasaan dan
              kesehatan mental generasi muda kita.
            </p>
          </div>

          {/* Grid Layout: Visualisasi Statistik & Landasan Agama (Terpadu) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* KIRI (7 Kolom): Visualisasi Statistik Recharts */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                        Statistik Nasional (Usia 14–24 Tahun)
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                        45% Pernah Mengalami Perundungan Siber
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Perbandingan kelompok remaja korban vs kelompok lainnya di Indonesia
                      </p>
                    </div>

                    {/* Chart Mode Switcher */}
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setActiveChartType("donut")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                          activeChartType === "donut"
                            ? "bg-white text-emerald-700 shadow-xs font-bold"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <PieChartIcon className="w-3.5 h-3.5" />
                        <span>Donut</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveChartType("bar")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                          activeChartType === "bar"
                            ? "bg-white text-emerald-700 shadow-xs font-bold"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>Bar</span>
                      </button>
                    </div>
                  </div>

                  {/* Recharts Component Container */}
                  <div className="w-full h-72 sm:h-80 mt-6 relative flex items-center justify-center">
                    {isMounted ? (
                      activeChartType === "donut" ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload as (typeof cyberbullyingStatsData)[0];
                                  return (
                                    <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-lg text-xs space-y-1">
                                      <p className="font-bold text-slate-900 text-sm">{data.name}</p>
                                      <p className="text-emerald-600 font-black text-base">
                                        {data.value}%
                                      </p>
                                      <p className="text-slate-600 max-w-xs">{data.description}</p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Pie
                              data={cyberbullyingStatsData}
                              cx="50%"
                              cy="50%"
                              innerRadius={72}
                              outerRadius={105}
                              paddingAngle={4}
                              dataKey="value"
                              stroke="#ffffff"
                              strokeWidth={3}
                            >
                              {cyberbullyingStatsData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <Legend
                              verticalAlign="bottom"
                              height={36}
                              formatter={(value) => (
                                <span className="text-xs text-slate-700 font-semibold px-2">
                                  {value}
                                </span>
                              )}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={cyberbullyingStatsData}
                            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis
                              dataKey="name"
                              tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                              axisLine={{ stroke: "#e2e8f0" }}
                            />
                            <YAxis
                              tick={{ fill: "#64748b", fontSize: 12 }}
                              domain={[0, 100]}
                              unit="%"
                              axisLine={{ stroke: "#e2e8f0" }}
                            />
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload as (typeof cyberbullyingStatsData)[0];
                                  return (
                                    <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-lg text-xs space-y-1">
                                      <p className="font-bold text-slate-900 text-sm">{data.name}</p>
                                      <p className="text-emerald-600 font-black text-base">
                                        {data.value}%
                                      </p>
                                      <p className="text-slate-600 max-w-xs">{data.description}</p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                              {cyberbullyingStatsData.map((entry, index) => (
                                <Cell key={`bar-${index}`} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      )
                    ) : (
                      <div className="animate-pulse flex flex-col items-center gap-2 text-slate-400">
                        <BarChart3 className="w-10 h-10 animate-bounce text-emerald-400" />
                        <span className="text-xs">Memuat data statistik...</span>
                      </div>
                    )}

                    {/* Donut Chart Center Value Overlay */}
                    {activeChartType === "donut" && isMounted && (
                      <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                        <span className="text-3xl font-black text-slate-900 block">45%</span>
                        <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                          Korban
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Summary Cards inside Data Section */}
                <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-emerald-950">45% Korban Siber</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Merasakan intimidasi, ejekan nama, atau dikucilkan di media sosial.
                      </p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-slate-400 mt-1 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">55% Kelompok Lainnya</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Belum pernah menjadi korban langsung atau belum melaporkan kejadian.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fakta Tambahan Card: Sorotan Penyandang Disabilitas (Warm Amber) */}
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-50/90 via-white to-amber-50/50 border border-amber-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-amber-100 text-amber-800 shrink-0 border border-amber-200">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200">
                      <span>{vulnerableGroupFact.tag}</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">
                      {vulnerableGroupFact.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {vulnerableGroupFact.description}
                    </p>
                    <div className="pt-2">
                      <p className="text-xs font-semibold text-amber-900 italic bg-amber-100/70 p-3.5 rounded-xl border border-amber-200/80">
                        &quot;{vulnerableGroupFact.callout}&quot;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* KANAN (5 Kolom): Seksi Landasan Agama (QS. Al-Hujurat 11 Terpadu) */}
            <div
              id="landasan-agama"
              className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/40 border-2 border-emerald-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div>
                {/* Header Landasan Agama */}
                <div className="flex items-center justify-between pb-4 border-b border-emerald-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                        Landasan Al-Qur&apos;anul Karim
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">
                        {dalilAlHujurat11.surah} : Ayat {dalilAlHujurat11.ayah}
                      </h3>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Haram Mencela
                  </span>
                </div>

                {/* Teks Arab dengan Latar Hijau Pastel & Teks Hijau Tua */}
                <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-emerald-50/80 border border-emerald-200 shadow-xs">
                  <p
                    dir="rtl"
                    className="font-arabic text-xl sm:text-2xl text-emerald-950 text-right leading-[2.3] select-all font-medium"
                  >
                    {dalilAlHujurat11.arabicText}
                  </p>
                </div>

                {/* Terjemahan Resmi */}
                <div className="mt-5 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Terjemahan Resmi Kemenag RI:
                  </span>
                  <blockquote className="text-xs sm:text-sm text-slate-800 italic leading-relaxed pl-3.5 border-l-3 border-emerald-500">
                    {dalilAlHujurat11.translation}
                  </blockquote>
                </div>

                {/* Kotak Refleksi: Latar Halus & Teks Jelas */}
                <div className="mt-6 p-4.5 rounded-2xl bg-white border border-emerald-200 shadow-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs sm:text-sm mb-1.5">
                    <Eye className="w-4 h-4 text-emerald-600" />
                    <span>{dalilAlHujurat11.reflectionTitle}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {dalilAlHujurat11.reflectionText}
                  </p>
                </div>
              </div>

              {/* Checklist Aksi Nyata Berdasarkan Ayat */}
              <div className="mt-6 pt-4 border-t border-emerald-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Komitmen Jari Kita:
                </p>
                <div className="space-y-1.5">
                  {dalilAlHujurat11.practicalTips.map((tip, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* DAFTAR KARTU SUMBER REFERENSI (MODULAR) */}
          {/* ========================================================= */}
          <div className="mt-14">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Quote className="w-5 h-5 text-emerald-600" />
                  <span>Daftar Sumber Referensi &amp; Pernyataan Resmi</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Transparansi rujukan berita dan laporan survei cyberbullying anak muda di Indonesia.
                </p>
              </div>
              <span className="text-xs text-slate-500 font-medium self-start sm:self-auto">
                Desain Modular Siap Ekspansi
              </span>
            </div>

            {/* Grid Modular Kartu Sumber (Putih Bersih & Border Lembut) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {initialBullyingSources.map((source) => (
                <div
                  key={source.id}
                  className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-300 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold">
                          {source.badge}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {source.publisher}
                        </span>
                      </div>
                      <div className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                        Usia: <span className="text-emerald-700">{source.ageRange}</span>
                      </div>
                    </div>

                    {/* Judul Artikel */}
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {source.title}
                    </h4>

                    {/* Highlight Persentase & Kutipan Menko PMK */}
                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100/90 space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-emerald-700">
                          {source.percentage}%
                        </span>
                        <span className="text-xs font-semibold text-slate-700">
                          Generasi muda terdampak
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 italic leading-relaxed">
                        &quot;{source.menkoPmkQuote}&quot;
                      </p>
                    </div>

                    {/* Ringkasan Laporan */}
                    <p className="text-xs text-slate-600 leading-relaxed">{source.summary}</p>
                  </div>

                  {/* Tombol External Link Menuju Artikel Asli */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      Rujukan: {source.publisher}
                    </span>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-100/70 hover:bg-emerald-100 border border-emerald-200 transition-all hover:scale-105"
                      aria-label={`Buka artikel asli di ${source.publisher}`}
                    >
                      <span>Baca Sumber Asli</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. TIGA KARTU NILAI (IMAN, ISLAM, IHSAN) */}
      {/* ========================================================= */}
      <section id="pilar-nilai" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3 border border-emerald-200">
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            <span>Fondasi Karakter Digital Muslim</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Trilogi Nilai: Iman, Islam, dan Ihsan di Dunia Maya
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Tiga pilar agung yang menjadi kompas moral setiap sentuhan jempol kita di layar ponsel.
          </p>
        </div>

        {/* 3 Value Cards Grid (Cerah, Hangat & Lembut) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coreValuesData.map((val) => {
            return (
              <div
                key={val.id}
                className="rounded-3xl p-7 bg-white border border-slate-200/90 hover:border-emerald-300 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  {/* Badge & Icon Header */}
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        val.id === "iman"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                          : val.id === "islam"
                          ? "bg-teal-100 text-teal-800 border-teal-200"
                          : "bg-sky-100 text-sky-800 border-sky-200"
                      }`}
                    >
                      {val.pillar}
                    </span>

                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                        val.id === "iman"
                          ? "bg-emerald-100 text-emerald-700"
                          : val.id === "islam"
                          ? "bg-teal-100 text-teal-700"
                          : "bg-sky-100 text-sky-700"
                      }`}
                    >
                      {val.id === "iman" && <Eye className="w-5 h-5" />}
                      {val.id === "islam" && <BookOpen className="w-5 h-5" />}
                      {val.id === "ihsan" && <HeartHandshake className="w-5 h-5" />}
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {val.title}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-600 mt-0.5 mb-4">
                    {val.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {val.description}
                  </p>

                  {/* Action Guides */}
                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Pedoman Sikap Nyata:
                    </span>
                    <ul className="space-y-2">
                      {val.actionGuide.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Dalil Tag */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Rujukan Dalil:</span>
                  <span className="font-semibold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                    {val.reference}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. BANNER CALL TO ACTION (AJAKAN AKSI NYATA) */}
      {/* ========================================================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-500/15 border border-emerald-400/40 text-center">
          {/* Subtle light accents */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/10 blur-[90px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-10 left-1/4 w-80 h-80 bg-teal-300/15 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs sm:text-sm font-bold tracking-wide border border-white/30">
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Mari Jadi Bagian Solusi Kebaikan</span>
            </div>

            {/* Teks Tegas Aksi Nyata */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-xs">
              &quot;Pikir dulu sebelum posting, stop ikut menyebarkan, dukung korban, dan laporkan
              perundungan!&quot;
            </h2>

            <p className="text-sm sm:text-base text-emerald-50 max-w-2xl mx-auto leading-relaxed">
              Jika kamu merasa lelah, tersakiti oleh komentar jahat, atau ragu harus bertindak apa,
              kamu tidak sendirian. Ruang aman ini hadir untuk mendengarkan tanpa menghakimi.
            </p>

            {/* Tombol Cepat Menuju Curhat AI & Layanan Terkait */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/curhat-ai"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-emerald-900 bg-white hover:bg-emerald-50 shadow-lg shadow-black/10 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <MessageCircleHeart className="w-5 h-5 text-emerald-700" />
                <span>Mulai Bercerita di Ruang Curhat AI</span>
              </Link>
              <Link
                href="/konseling-bk"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-base font-semibold text-white border-2 border-white/40 bg-emerald-700/50 hover:bg-emerald-700/70 transition-all duration-200 hover:scale-105"
              >
                <Headphones className="w-5 h-5 text-emerald-200" />
                <span>Konsultasi Privat Guru BK</span>
              </Link>
            </div>

            {/* Helpline Bantuan Cepat */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-emerald-100">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-200" />
                Hotline Sahabat Perempuan &amp; Anak:{" "}
                <strong className="text-white">SAPA 129</strong>
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-emerald-200" />
                Layanan Dukungan Jiwa: <strong className="text-white">Sejiwa 119 Ext 8</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FOOTER */}
      {/* ========================================================= */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-12 text-slate-600 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-xs">
                <MessageCircleHeart className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-slate-900">TemanCurhat</span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Platform pendampingan sebaya berlandaskan adab Islam untuk menciptakan ruang digital
              yang aman, saling menguatkan, dan bebas dari cyberbullying.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Akses Cepat
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/curhat-ai" className="hover:text-emerald-600 transition-colors">
                  Ruang Curhat AI Anonim
                </Link>
              </li>
              <li>
                <Link href="/konseling-bk" className="hover:text-emerald-600 transition-colors">
                  Layanan Konseling Guru BK
                </Link>
              </li>
              <li>
                <a href="#fakta-data" className="hover:text-emerald-600 transition-colors">
                  Kajian &amp; Data Cyberbullying
                </a>
              </li>
              <li>
                <a href="#landasan-agama" className="hover:text-emerald-600 transition-colors">
                  Tafsir QS. Al-Hujurat: 11
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Nilai &amp; Adab
            </h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              &quot;Barang siapa beriman kepada Allah dan Hari Akhir, hendaklah ia berkata yang baik
              atau diam.&quot;
            </p>
            <span className="block mt-2 text-[11px] text-emerald-700 font-bold">
              HR. Bukhari &amp; Muslim
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 TemanCurhat. Dibuat untuk Generasi Muda Indonesia.</p>
          <p className="flex items-center gap-1 font-medium">
            <span>Ditegakkan dengan adab</span>
            <span className="text-emerald-600">✦</span>
            <span>Iman, Islam &amp; Ihsan</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
