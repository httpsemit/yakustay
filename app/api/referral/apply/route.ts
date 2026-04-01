import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(authHeader.split("Bearer ")[1]);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "Code is required" }, { status: 400 });

  // Check if user already applied a referral code
  const userDoc = await adminDb.collection("users").doc(uid).get();
  const userData = userDoc.data() as any;
  if (userData?.appliedReferralCode) {
    return NextResponse.json({ error: "You've already applied a referral code." }, { status: 409 });
  }

  // Make sure code is not their own
  if (userData?.referralCode === code) {
    return NextResponse.json({ error: "You cannot use your own referral code." }, { status: 400 });
  }

  // Verify the code exists
  const snap = await adminDb.collection("users").where("referralCode", "==", code).limit(1).get();
  if (snap.empty) {
    return NextResponse.json({ error: "Referral code not found." }, { status: 404 });
  }

  // Save it — reward triggers when they complete their first booking (via webhook)
  await adminDb.collection("users").doc(uid).update({ appliedReferralCode: code });

  return NextResponse.json({ success: true });
}
