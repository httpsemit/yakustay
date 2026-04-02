import RoomForm from "../RoomForm";

export const dynamic = "force-dynamic";

export default function NewRoomPage() {
  return (
    <div>
      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontFamily: "'Noto Serif', serif", fontSize: "2.5rem", fontWeight: 300, color: "#061b0e", marginBottom: 8 }}>
          Add Room
        </h1>
        <p style={{ color: "#50606f" }}>Create a new room for guests to book.</p>
      </div>
      <RoomForm />
    </div>
  );
}
