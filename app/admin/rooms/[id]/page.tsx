import { getRoomById } from "@/lib/firestore";
import { notFound } from "next/navigation";
import RoomForm from "../RoomForm";

export const dynamic = "force-dynamic";

export default async function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const room = await getRoomById(id);

  if (!room) {
    notFound();
  }

  return (
    <div>
      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontFamily: "'Noto Serif', serif", fontSize: "2.5rem", fontWeight: 300, color: "#061b0e", marginBottom: 8 }}>
          Edit Room
        </h1>
        <p style={{ color: "#50606f" }}>Update details or completely remove this room.</p>
      </div>
      <RoomForm initialData={room} />
    </div>
  );
}
