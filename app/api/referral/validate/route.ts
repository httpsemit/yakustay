import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ valid: false, error: "Code is required" }, { status: 400 });
    }

    const snapshot = await adminDb.collection("users").where("referralCode", "==", code).limit(1).get();

    if (snapshot.empty) {
      return NextResponse.json({ valid: false, error: "Invalid referral code" });
    }

    const referrer = snapshot.docs[0].data();

    return NextResponse.json({ 
      valid: true, 
      referrerName: `${referrer.firstName} ${referrer.lastName}`.trim() 
    });

  } catch (error) {
    console.error("Referral validation error:", error);
    return NextResponse.json({ valid: false, error: "Internal Server Error" }, { status: 500 });
  }
}
