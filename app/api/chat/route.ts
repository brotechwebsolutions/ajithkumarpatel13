import { NextResponse } from "next/server";
import { systemPrompt } from "@/lib/data";

export const runtime = "nodejs";

type Msg = { role: "user" | "bot"; text: string };

const hits = new Map<string, number[]>();
const PER_MINUTE = 8;
const PER_DAY = 40;

function overLimit(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 86_400_000);
  const lastMinute = list.filter((t) => now - t < 60_000).length;
  if (lastMinute >= PER_MINUTE || list.length >= PER_DAY) { hits.set(ip, list); return true; }
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return false;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (overLimit(ip)) return NextResponse.json({ reply: "You have asked a lot of questions in a short time. Please try again later, or email me." }, { status: 429 });
  if (Number(req.headers.get("content-length") || 0) > 8000) return NextResponse.json({ reply: "That message is too long." }, { status: 413 });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ reply: "The assistant is not available right now. Please email me instead." }, { status: 500 });
  try {
    const { messages } = (await req.json()) as { messages: Msg[] };
    const contents = (messages || []).slice(-10).map((m) => ({
      role: m.role === "bot" ? "model" : "user",
      parts: [{ text: String(m.text).slice(0, 500) }],
    }));
    if (!contents.length || contents[contents.length - 1].role !== "user")
      return NextResponse.json({ reply: "Ask me anything about Ajith!" }, { status: 400 });
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { maxOutputTokens: 300, temperature: 0.4 },
      }),
    });
    if (!r.ok) {
      const status = r.status === 429 ? 429 : 502;
      return NextResponse.json({ reply: status === 429 ? "I'm getting a lot of questions right now. Please try again in a minute." : "Sorry, I couldn't answer that. Please try again." }, { status });
    }
    const data = await r.json();
    const reply = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("") || "I'm not sure. Please email Ajith directly.";
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: "Something went wrong. Please try again." }, { status: 500 });
  }
}
