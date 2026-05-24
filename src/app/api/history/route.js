import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    const history = await db.getHistory(email);
    return NextResponse.json({ history }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch history" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, data } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Calculation data is required" },
        { status: 400 }
      );
    }

    const entry = await db.addHistoryEntry(email, data);
    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to save history entry" },
      { status: 500 }
    );
  }
}
