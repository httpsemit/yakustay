import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const rooms = [
      {
        name: "The Haven Suite",
        description: "Our signature suite featuring panoramic forest views, a private soaking tub, and understated luxury that invites complete relaxation. Every detail is crafted for your peace.",
        pricePerNight: 12500,
        capacity: 2,
        primaryImage: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        images: [],
        amenities: ["King Bed", "Forest View", "Soaking Tub", "In-Room Dining"],
        isAvailable: true,
        createdAt: new Date().toISOString(),
      },
      {
        name: "The Courtyard Room",
        description: "A tranquil space opening directly onto our stone courtyard. Features natural textures, raw silk accents, and morning sunlight to start your day beautifully.",
        pricePerNight: 8500,
        capacity: 2,
        primaryImage: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        images: [],
        amenities: ["Queen Bed", "Courtyard Access", "Rain Shower", "Mini Bar"],
        isAvailable: true,
        createdAt: new Date().toISOString(),
      },
      {
        name: "The Grove Loft",
        description: "An elevated space nestled among the trees. The Grove Loft offers a secluded balcony and a spacious, airy interior for those seeking perspective.",
        pricePerNight: 15000,
        capacity: 3,
        primaryImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        images: [],
        amenities: ["King Bed", "Balcony", "Private Dining", "Soaking Tub"],
        isAvailable: true,
        createdAt: new Date().toISOString(),
      },
      {
        name: "The Family Retreat",
        description: "Spacious and adaptable, designed for families or small groups seeking comfort without compromising on elegance and style.",
        pricePerNight: 18000,
        capacity: 4,
        primaryImage: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        images: [],
        amenities: ["Two Double Beds", "Lounge Area", "Twin Basins", "Board Games"],
        isAvailable: true,
        createdAt: new Date().toISOString(),
      },
      {
        name: "The Solstice Room",
        description: "Intimate and deeply comforting, designed with dark wood finishes and soft ambient lighting for the perfect restorative stay away from the noise.",
        pricePerNight: 7500,
        capacity: 2,
        primaryImage: "https://images.unsplash.com/photo-1598928506311-c55dd5802427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        images: [],
        amenities: ["Queen Bed", "Ambient Lighting", "Record Player", "Library curated selection"],
        isAvailable: true,
        createdAt: new Date().toISOString(),
      }
    ];

    const batch = adminDb.batch();
    const roomsRef = adminDb.collection("rooms");

    // Check if empty first
    const snapshot = await roomsRef.limit(1).get();
    if (!snapshot.empty) {
      return NextResponse.json({ message: "Database already seeded." });
    }

    rooms.forEach((room) => {
      const docRef = roomsRef.doc();
      batch.set(docRef, room);
    });

    await batch.commit();

    return NextResponse.json({ message: "Successfully seeded 5 rooms!" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
