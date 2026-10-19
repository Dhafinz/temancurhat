import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface ChatMessage {
  role: string;
  text: string;
}

interface ChatRequestBody {
  message?: string;
  history?: ChatMessage[];
}

interface AIResponseData {
  reply: string;
  recommend_bk: boolean;
  reason?: string;
}

const SYSTEM_INSTRUCTION = `Kamu adalah TemanCurhat AI, teman sebaya yang hangat, ramah, penuh perhatian, dan empati bagi siswa sekolah yang sedang sedih, cemas, atau menghadapi perundungan siber (cyberbullying).

Panduan Karakter & Komunikasi (Wajib & Ketat):
1. Karakter: Teman sebaya yang pengertian, pendengar yang baik, tidak menghakimi, dan selalu memvalidasi perasaan siswa.
2. Bahasa: Santai, ramah, menenangkan, mudah dipahami anak dan remaja ("aku" dan "kamu"). Jangan kaku, dingin, atau menggurui.
3. ATURAN PENTING & MUTLAK: JANGAN PERNAH menyisipkan dalil Al-Qur'an, hadits, atau nasihat bernuansa ceramah agama dalam obrolan ini. Fokus murni pada:
   - Pertolongan pertama emosional (validasi bahwa perasaan mereka wajar dan mereka tidak sendirian).
   - Penguatan rasa percaya diri (ingatkan bahwa ejekan netizen/teman sama sekali bukan salah mereka).
   - Langkah praktis: jangan membalas ejekan (jangan beri makan troll), segera simpan tangkapan layar (screenshot) sebagai bukti, blokir/laporkan akun pelaku, dan cerita ke orang yang dipercaya.
4. Deteksi Rujukan Guru BK:
   - Analisis pesan siswa secara mendalam.
   - Jika terdeteksi tanda-tanda stres berat, keputusasaan mendalam, perundungan verbal/fisik yang parah, ancaman kekerasan, penyebaran foto pribadi tanpa izin, atau rasa takut datang ke sekolah, tetapkan "recommend_bk": true dan berikan alasan singkat di field "reason".
   - Jika curhat masih taraf ringan atau umum, tetapkan "recommend_bk": false.
5. Format Output JSON:
   Wajib menghasilkan format JSON murni dengan skema:
   {
     "reply": "Kalimat balasan AI yang empati, hangat, dan menguatkan...",
     "recommend_bk": true | false,
     "reason": "Alasan singkat mengapa disarankan ke Guru BK (opsional, string kosong jika false)"
   }`;

// Fallback rule-based analysis jika API Key belum dipasang / quota habis
function generateFallbackResponse(message: string): AIResponseData {
  const lowerMsg = message.toLowerCase();

  // Indikasi stres berat, keputusasaan, ancaman, atau takut sekolah
  const severeKeywords = [
    "mati",
    "bunuh diri",
    "putus asa",
    "ga kuat",
    "gak kuat",
    "takut ke sekolah",
    "takut sekolah",
    "gamau sekolah",
    "nggak mau sekolah",
    "foto pribadi",
    "foto tanpa izin",
    "disebarin",
    "disebar",
    "diancam",
    "ancaman",
    "dipukul",
    "labrak",
    "dikeroyok",
    "menghilang",
    "nangis terus",
    "trauma",
    "hancur",
  ];

  const needsBK = severeKeywords.some((keyword) => lowerMsg.includes(keyword));

  if (needsBK) {
    return {
      reply:
        "Aku dengar dan aku benar-benar paham betapa beratnya apa yang kamu rasakan sekarang. Kamu hebat banget sudah berani cerita ke aku. Ingat ya, kamu sama sekali nggak salah dan kamu nggak boleh menghadapi ini sendirian. Langkah pertama sekarang: tarik napas perlahan, simpan tangkapan layar (screenshot) semua bukti ejekan itu, lalu jangan balas komentar mereka. Aku sangat menyarankan kamu ngobrol juga dengan Guru BK di sekolah—mereka ramah dan bisa bantu lindungi kamu secara langsung.",
      recommend_bk: true,
      reason:
        "Terdeteksi indikasi tekanan emosional berat, rasa takut, atau perundungan yang membutuhkan perlindungan langsung dari Guru BK.",
    };
  }

  if (
    lowerMsg.includes("hujat") ||
    lowerMsg.includes("ejek") ||
    lowerMsg.includes("komentar") ||
    lowerMsg.includes("netizen")
  ) {
    return {
      reply:
        "Sakit banget rasanya saat kolom komentar dipenuhi kata-kata jahat, dan wajar banget kalau kamu merasa sedih atau kesal. Tapi ingat ya, ketikan mereka itu mencerminkan buruknya perilaku mereka sendiri, bukan nilai dirimu. Jangan dibalas ya, langsung screenshot buat bukti, lalu blokir akun-akun yang jahat itu. Istirahat dulu dari medsos beberapa saat, lakukan hal yang kamu suka, oke?",
      recommend_bk: false,
      reason: "",
    };
  }

  if (lowerMsg.includes("minder") || lowerMsg.includes("insecure") || lowerMsg.includes("jelek")) {
    return {
      reply:
        "Peluk hangat dari aku ya. Jangan pernah biarkan ejekan orang lain membuatmu meragukan kelebihanmu sendiri. Setiap orang punya keunikan dan kebaikan yang belum tentu orang lain punya. Kalau ada yang sengaja mengejek di medsos atau grup chat, jangan kasih panggung. Kamu berharga apa adanya!",
      recommend_bk: false,
      reason: "",
    };
  }

  return {
    reply:
      "Terima kasih sudah mau cerita ke aku. Aku di sini mendengarkan kamu tanpa menghakimi. Ceritain aja lebih banyak tentang apa yang bikin hatimu ganjal atau sedih saat ini, aku siap temani kamu langkah demi langkah.",
    recommend_bk: false,
    reason: "",
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

    // Ambil API key dari process.env (fallback ke empty string)
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      "";

    // Jika API Key tidak ada, gunakan intelligent fallback engine yang ramah
    if (!apiKey) {
      const fallbackResult = generateFallbackResponse(userMessage);
      return NextResponse.json(fallbackResult);
    }

    // Panggil SDK resmi @google/genai
    try {
      const ai = new GoogleGenAI({ apiKey });

      // Susun histori chat untuk konteks percakapan
      const contents = history.map((h) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.text }],
      }));

      // Tambahkan pesan terkini
      contents.push({
        role: "user",
        parts: [{ text: userMessage }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const rawText = response.text || "";

      // Bersihkan jika ada format markdown triple backticks
      const cleanJson = rawText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const parsed: AIResponseData = JSON.parse(cleanJson);

      return NextResponse.json({
        reply: parsed.reply || "Aku di sini mendengarkanmu, ceritakan lagi ya...",
        recommend_bk: Boolean(parsed.recommend_bk),
        reason: parsed.reason || "",
      });
    } catch (apiError) {
      console.warn("Gemini API call failed, using graceful fallback:", apiError);
      const fallback = generateFallbackResponse(userMessage);
      return NextResponse.json(fallback);
    }
  } catch (error) {
    console.error("Error in chat-ai route:", error);
    return NextResponse.json(
      {
        reply:
          "Maaf ya, koneksiku sempat terganggu sebentar. Tapi tenang, aku tetap di sini. Boleh ulangi pesanmu sekali lagi?",
        recommend_bk: false,
        reason: "",
      },
      { status: 200 }
    );
  }
}
