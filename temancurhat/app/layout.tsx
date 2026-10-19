import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TemanCurhat - Sebelum Jempolmu Beraksi, Ingat Allah Melihatmu",
  description:
    "Platform edukasi pencegahan cyberbullying berlandaskan nilai Islam. Curhat anonim dengan AI dan layanan konseling guru BK.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800 selection:bg-emerald-200 selection:text-emerald-900">
        {children}
      </body>
    </html>
  );
}


