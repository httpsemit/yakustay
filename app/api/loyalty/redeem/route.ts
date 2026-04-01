import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("session")?.value;
    if (!sessionCookie) return NextResponse.redirect(new URL("/login", req.url));

    const decoded = await adminAuth.verifyIdToken(sessionCookie);
    const formData = await req.formData();
    const pointsStr = formData.get("points") as string;
    const points = parseInt(pointsStr, 10);

    if (isNaN(points) || points < 100) {
      return NextResponse.redirect(new URL("/loyalty/redeem?error=invalid_amount", req.url));
    }

    const docRef = adminDb.collection("loyalty").doc(decoded.uid);
    
    await adminDb.runTransaction(async (tx) => {
      const doc = await tx.get(docRef);
      if (!doc.exists) throw new Error("Profile not found");
      const currentPoints = doc.data()?.pointsBalance || 0;
      
      if (currentPoints < points) {
        throw new Error("Insufficient points");
      }

      tx.update(docRef, {
        pointsBalance: currentPoints - points
      });

      const txRef = adminDb.collection("pointTransactions").doc();
      tx.set(txRef, {
        userId: decoded.uid,
        amount: points,
        type: "redeemed",
        description: `Redeemed ${points} points for ₹${Math.floor(points / 10)} discount`,
        createdAt: new Date().toISOString()
      });
    });

    console.log(`[STUB] Generated logic: User redeemed ${points} points.`);
    return NextResponse.redirect(new URL("/loyalty?success=redeemed", req.url));

  } catch (error) {
    console.error("Redeem error:", error);
    return NextResponse.redirect(new URL("/loyalty/redeem?error=server_error", req.url));
  }
}
