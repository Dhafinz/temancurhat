import { NextResponse } from "next/server";
import { BKChatMessage } from "@/lib/mockData";

export interface BKChatSession {
  sessionId: string;
  studentId: string;
  teacherId: string;
  teacherName: string;
  lastMessage: string;
  lastUpdated: string;
  unreadCountTeacher: number;
}

// In-memory store on the server so that messages sync reliably across tabs,
// browsers, and incognito sessions.
declare global {
  var __temancurhat_bk_chats__: Record<string, BKChatMessage[]> | undefined;
  var __temancurhat_bk_sessions__: Record<string, BKChatSession> | undefined;
}

if (!global.__temancurhat_bk_chats__) {
  global.__temancurhat_bk_chats__ = {};
}

if (!global.__temancurhat_bk_sessions__) {
  global.__temancurhat_bk_sessions__ = {};
}

const chatsStore = global.__temancurhat_bk_chats__;
const sessionsStore = global.__temancurhat_bk_sessions__;

// Helper to construct thread key
function getThreadKey(teacherId: string, studentId: string) {
  return `${teacherId}_${studentId}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const teacherId = searchParams.get("teacherId");
  const studentId = searchParams.get("studentId");
  const mode = searchParams.get("mode"); // "messages" | "sessions" | "all"

  // If requesting sessions list (for Dashboard BK)
  if (mode === "sessions") {
    const list = Object.values(sessionsStore);
    const filtered = teacherId
      ? list.filter((s) => s.teacherId === teacherId)
      : list;
    // Sort newest updated first
    filtered.sort((a, b) => (b.lastUpdated > a.lastUpdated ? 1 : -1));
    return NextResponse.json({ success: true, sessions: filtered });
  }

  // If requesting messages for a specific student & teacher
  if (teacherId && studentId) {
    const threadKey = getThreadKey(teacherId, studentId);
    const messages = chatsStore[threadKey] || [];
    return NextResponse.json({
      success: true,
      threadKey,
      messages,
      session: sessionsStore[threadKey] || null,
    });
  }

  // Fallback: if only teacherId provided, return all sessions + latest messages for teacher
  if (teacherId) {
    const teacherSessions = Object.values(sessionsStore).filter(
      (s) => s.teacherId === teacherId
    );
    return NextResponse.json({
      success: true,
      sessions: teacherSessions,
    });
  }

  return NextResponse.json({
    success: true,
    sessions: Object.values(sessionsStore),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      teacherId,
      teacherName,
      studentId,
      senderRole,
      senderName,
      text,
      timestamp,
    } = body;

    if (!teacherId || !studentId || !senderRole || !text?.trim()) {
      return NextResponse.json(
        { success: false, error: "Parameter pesan tidak lengkap" },
        { status: 400 }
      );
    }

    const threadKey = getThreadKey(teacherId, studentId);
    if (!chatsStore[threadKey]) {
      chatsStore[threadKey] = [];
    }

    const timeFormatted =
      timestamp ||
      new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });

    const newMessage: BKChatMessage = {
      id: `${senderRole === "teacher" ? "tch" : "std"}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 6)}`,
      sessionId: `session-${studentId}`,
      senderRole,
      senderName,
      text: text.trim(),
      timestamp: timeFormatted,
      isAutoReply: false,
    };

    chatsStore[threadKey].push(newMessage);

    // Update or create session metadata
    const existingSession = sessionsStore[threadKey];
    sessionsStore[threadKey] = {
      sessionId: `session-${studentId}`,
      studentId,
      teacherId,
      teacherName: teacherName || existingSession?.teacherName || "Guru BK",
      lastMessage: text.trim(),
      lastUpdated: timeFormatted,
      unreadCountTeacher:
        senderRole === "student"
          ? (existingSession?.unreadCountTeacher || 0) + 1
          : 0,
    };

    return NextResponse.json({
      success: true,
      message: newMessage,
      messages: chatsStore[threadKey],
      session: sessionsStore[threadKey],
    });
  } catch (error) {
    console.error("Error handling /api/bk-chat:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses pesan" },
      { status: 500 }
    );
  }
}
