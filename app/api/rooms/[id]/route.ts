import { NextRequest, NextResponse } from "next/server";
import { getRoomById } from "@/lib/firestore";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const room = await getRoomById(params.id);
  if (!room) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(room);
}
