"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import type { Room } from "@/lib/firestore";

interface Props {
  initialData?: Room;
}

export default function RoomForm({ initialData }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [pricePerNight, setPricePerNight] = useState(initialData?.pricePerNight?.toString() || "");
  const [capacity, setCapacity] = useState(initialData?.capacity?.toString() || "");
  const [amenities, setAmenities] = useState(initialData?.amenities?.join(", ") || "");
  const [isAvailable, setIsAvailable] = useState(initialData?.isAvailable ?? true);
  const [primaryImage, setPrimaryImage] = useState(initialData?.primaryImage || "");
  const [images, setImages] = useState(initialData?.images?.join(", ") || "");
  
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user) return;

    try {
      setUploadingImage(true);
      setError("");
      
      const token = await user.getIdToken();
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);

        const res = await fetch("/api/admin/rooms/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!res.ok) {
          const dat = await res.json();
          throw new Error(dat.error || "Failed to upload image.");
        }

        const data = await res.json();
        newUrls.push(data.url);
      }
      
      const existingLines = [primaryImage, ...images.split(",").map(i => i.trim()).filter(Boolean)].filter(Boolean);
      const updatedLines = [...existingLines, ...newUrls];
      setPrimaryImage(updatedLines[0] || "");
      setImages(updatedLines.slice(1).join(", "));
    } catch (err: any) {
      setError(err.message || "Failed to upload images.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      const token = await user.getIdToken();
      const payload = {
        name,
        description,
        pricePerNight: parseInt(pricePerNight, 10),
        capacity: parseInt(capacity, 10),
        amenities: amenities.split(",").map((a) => a.trim()).filter(Boolean),
        isAvailable,
        primaryImage,
        images: images.split(",").map((img) => img.trim()).filter(Boolean),
      };

      const url = initialData 
        ? `/api/admin/rooms/${initialData.id}` 
        : `/api/admin/rooms`;
        
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save room");
      }

      router.push("/admin/rooms");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData || !user) return;
    if (!confirm("Are you sure you want to delete this room?")) return;
    
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/admin/rooms/${initialData.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete room");
      }

      router.push("/admin/rooms");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 32, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
      {error && (
        <div style={{ background: "#fee2e2", color: "#991b1b", padding: "12px 16px", borderRadius: 6, marginBottom: 24, fontSize: "0.875rem" }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#50606f", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Room Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #e4e3d7", borderRadius: 6, fontSize: "0.9375rem" }}
            />
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#50606f", textTransform: "uppercase", letterSpacing: "0.05em" }}>Room Image URLs (1 per line)</label>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#1b3022", cursor: uploadingImage ? "not-allowed" : "pointer", background: "#d0e9d4", padding: "4px 8px", borderRadius: 4 }}>
                {uploadingImage ? "Uploading..." : "Upload Images"}
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploadingImage} style={{ display: "none" }} />
              </label>
            </div>
            <textarea
              required
              value={[primaryImage, ...images.split(",").map(i => i.trim()).filter(Boolean)].filter(Boolean).join("\n")}
              onChange={(e) => {
                const lines = e.target.value.split("\n").map(l => l.trim()).filter(Boolean);
                setPrimaryImage(lines[0] || "");
                setImages(lines.slice(1).join(", "));
              }}
              rows={5}
              placeholder="Primary image URL on first line...&#10;Additional images on subsequent lines..."
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #e4e3d7", borderRadius: 6, fontSize: "0.9375rem" }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#50606f", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #e4e3d7", borderRadius: 6, fontSize: "0.9375rem" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#50606f", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Price Per Night (₹)</label>
            <input
              required
              type="number"
              min="0"
              value={pricePerNight}
              onChange={(e) => setPricePerNight(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #e4e3d7", borderRadius: 6, fontSize: "0.9375rem" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#50606f", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Capacity</label>
            <input
              required
              type="number"
              min="1"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #e4e3d7", borderRadius: 6, fontSize: "0.9375rem" }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#50606f", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Amenities (comma separated)</label>
          <input
            value={amenities}
            onChange={(e) => setAmenities(e.target.value)}
            placeholder="King Bed, Forest View, Freestanding Tub..."
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #e4e3d7", borderRadius: 6, fontSize: "0.9375rem" }}
          />
        </div>

        <div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.9375rem", color: "#1b1c15", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            Available for booking
          </label>
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 16, borderTop: "1px solid #efeee3", paddingTop: 24 }}>
          <button
            type="submit"
            disabled={loading}
            style={{ background: "#061b0e", color: "#fff", border: "none", borderRadius: 6, padding: "12px 24px", fontSize: "0.9375rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Saving..." : initialData ? "Save Changes" : "Create Room"}
          </button>
          
          <button
            type="button"
            onClick={() => router.push("/admin/rooms")}
            disabled={loading}
            style={{ background: "transparent", color: "#50606f", border: "1px solid #c3c8c1", borderRadius: 6, padding: "12px 24px", fontSize: "0.9375rem", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer" }}
          >
            Cancel
          </button>

          {initialData && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              style={{ marginLeft: "auto", background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: 6, padding: "12px 24px", fontSize: "0.9375rem", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer" }}
            >
              Delete Room
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
