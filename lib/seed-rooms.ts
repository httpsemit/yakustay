/**
 * Seed script — run once to populate Firestore with 5 rooms.
 * Usage: npx ts-node --project tsconfig.json lib/seed-rooms.ts
 * Requires FIREBASE_ADMIN_PRIVATE_KEY, FIREBASE_ADMIN_CLIENT_EMAIL,
 * and NEXT_PUBLIC_FIREBASE_PROJECT_ID in your environment.
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore }                  from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId:   process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

const rooms = [
  {
    id:            "deluxe-king",
    name:          "Deluxe King Room",
    description:   "A spacious room with a plush king-size bed, framed by panoramic valley views. Warm earthy tones and natural textures create a restful sanctuary.",
    pricePerNight: 4999,
    capacity:      2,
    amenities:     ["Free WiFi", "Air Conditioning", "Smart TV", "Mini Bar", "Room Service", "En-suite Bathroom"],
    isAvailable:   true,
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80",
    ],
    primaryImage: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80",
    createdAt: new Date().toISOString(),
  },
  {
    id:            "mountain-suite",
    name:          "Mountain View Suite",
    description:   "Wake up to mist-cloaked peaks from your private balcony. This suite blends colonial charm with modern luxury — a curated retreat for the discerning traveller.",
    pricePerNight: 7499,
    capacity:      2,
    amenities:     ["Free WiFi", "Air Conditioning", "Smart TV", "Mini Bar", "Private Balcony", "Bathtub", "Room Service", "Nespresso Machine"],
    isAvailable:   true,
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80",
    ],
    primaryImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
    createdAt: new Date().toISOString(),
  },
  {
    id:            "forest-cottage",
    name:          "Forest Cottage",
    description:   "Tucked into the treeline, this standalone cottage offers absolute privacy. A fireplace, handwoven rugs, and floor-to-ceiling windows bring the forest inside.",
    pricePerNight: 5999,
    capacity:      3,
    amenities:     ["Free WiFi", "Fireplace", "Smart TV", "Kitchenette", "Private Garden", "Outdoor Shower", "Room Service"],
    isAvailable:   true,
    images: [
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=1200&q=80",
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200&q=80",
    ],
    primaryImage: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=1200&q=80",
    createdAt: new Date().toISOString(),
  },
  {
    id:            "heritage-family",
    name:          "Heritage Family Room",
    description:   "A generously proportioned room for families, with two queen beds, a sitting alcove, and curated regional artefacts. History meets hospitality.",
    pricePerNight: 8999,
    capacity:      4,
    amenities:     ["Free WiFi", "Air Conditioning", "Smart TV", "Mini Bar", "Two Queen Beds", "Sitting Area", "Room Service", "Children's Amenities"],
    isAvailable:   true,
    images: [
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80",
    ],
    primaryImage: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=1200&q=80",
    createdAt: new Date().toISOString(),
  },
  {
    id:            "canopy-loft",
    name:          "Canopy Loft",
    description:   "A compact loft for the solo traveller — elevated above the canopy, with a reading nook, rainfall shower, and a telescope for clear-sky nights.",
    pricePerNight: 3999,
    capacity:      1,
    amenities:     ["Free WiFi", "Air Conditioning", "Smart TV", "Reading Nook", "Rainfall Shower", "Telescope", "Room Service"],
    isAvailable:   true,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
    ],
    primaryImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    createdAt: new Date().toISOString(),
  },
];

async function seed() {
  console.log("Seeding rooms...");
  for (const room of rooms) {
    const { id, ...data } = room;
    await db.collection("rooms").doc(id).set(data, { merge: true });
    console.log(`  ✓ ${room.name}`);
  }
  console.log("Done.");
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
