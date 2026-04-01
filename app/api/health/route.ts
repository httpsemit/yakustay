import { adminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await adminDb.listCollections();
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      firebase: "connected",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        firebase: "disconnected",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
