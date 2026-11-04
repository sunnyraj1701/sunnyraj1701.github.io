import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export const runtime = "nodejs";

const maxRequestBytes = 10_000;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let payload: unknown;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > maxRequestBytes) {
      return NextResponse.json({ error: "Message is too large." }, { status: 413 });
    }
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const fields = payload as Record<string, unknown>;
  const name = typeof fields.name === "string" ? fields.name.trim() : "";
  const email = typeof fields.email === "string" ? fields.email.trim() : "";
  const message = typeof fields.message === "string" ? fields.message.trim() : "";
  const website = typeof fields.website === "string" ? fields.website.trim() : "";

  if (website) {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json(
      { error: "Name must be between 2 and 80 characters." },
      { status: 400 },
    );
  }
  if (email.length > 254 || !emailPattern.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (message.length < 10 || message.length > 5000) {
    return NextResponse.json(
      { error: "Message must be between 10 and 5000 characters." },
      { status: 400 },
    );
  }

  try {
    getDatabase()
      .prepare("INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)")
      .run(name, email, message);
  } catch (error) {
    console.error("Could not save contact message:", error);
    return NextResponse.json(
      { error: "Message could not be saved right now. Please try again later." },
      { status: 503 },
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
