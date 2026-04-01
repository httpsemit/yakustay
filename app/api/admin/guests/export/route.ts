import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { getAllUsers, getUserById } from "@/lib/firestore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("session")?.value;
    if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(sessionCookie);
    const currentUser = await getUserById(decoded.uid);

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await getAllUsers();
    const guestUsers = users.filter((u) => u.role === "guest");

    // Build CSV
    const headers = ["ID", "First Name", "Last Name", "Email", "Phone", "Referral Code", "Joined At"];
    const rows = guestUsers.map((u) => {
      const dateVal = u.createdAt?.toDate ? u.createdAt.toDate().toISOString() : u.createdAt ? new Date(u.createdAt).toISOString() : "";
      return [
        u.id,
        `"${u.firstName}"`,
        `"${u.lastName}"`,
        `"${u.email}"`,
        `"${u.phone}"`,
        `"${u.referralCode}"`,
        `"${dateVal}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    const res = new NextResponse(csvContent);
    res.headers.set("Content-Type", "text/csv");
    res.headers.set("Content-Disposition", `attachment; filename="hotel_guests_${new Date().getTime()}.csv"`);
    return res;

  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
