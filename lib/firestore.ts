import { adminDb } from "@/lib/firebase-admin";
import { areIntervalsOverlapping, parseISO } from "date-fns";
import { Timestamp } from "firebase-admin/firestore";

// ── Types ──────────────────────────────────────────────────────────────────

export interface Room {
  id:            string;
  name:          string;
  description:   string;
  pricePerNight: number;
  capacity:      number;
  amenities:     string[];
  isAvailable:   boolean;
  images:        string[];
  primaryImage:  string;
  createdAt:     string;
}

export interface User {
  id:           string;
  uid:          string;
  firstName:    string;
  lastName:     string;
  email:        string;
  phone:        string;
  role:         "guest" | "admin";
  referralCode: string;
  appliedReferralCode?: string;
  referralRewarded?: boolean;
  createdAt:    Timestamp;
  updatedAt:    Timestamp;
}


export interface Booking {
  id:              string;
  roomId:          string;
  guestId:         string;
  guestName:       string;
  guestEmail:      string;
  guestPhone:      string;
  checkIn:         string;  // "YYYY-MM-DD"
  checkOut:        string;  // "YYYY-MM-DD"
  nights:          number;
  totalPrice:      number;
  pointsEarned:    number;
  pointsRedeemed:  number;
  status:          "pending" | "confirmed" | "cancelled";
  paymentMethod:   string;
  stripeSessionId: string;
  notes:           string;
  createdAt:       string;
  updatedAt:       string;
}

export interface CreateBookingInput {
  roomId:        string;
  guestId:       string;
  guestName:     string;
  guestEmail:    string;
  guestPhone:    string;
  checkIn:       string;
  checkOut:      string;
  nights:        number;
  totalPrice:    number;
  notes?:        string;
}

export interface LoyaltyProfile {
  id:             string;      // same as userId
  userId:         string;
  pointsBalance:  number;
  lifetimePoints: number;
  tier:           "Silver" | "Gold" | "Platinum";
}

export interface PointTransaction {
  id:          string;
  userId:      string;
  amount:      number;
  type:        "earned" | "redeemed";
  description: string;
  createdAt:   string;
}


// ── Helpers ────────────────────────────────────────────────────────────────

// ── Room queries ───────────────────────────────────────────────────────────

export const MOCK_ROOMS: Room[] = [
  {
    id: "mock-1",
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
    id: "mock-2",
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
    id: "mock-3",
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
    id: "mock-4",
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
    id: "mock-5",
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

export async function getRooms(): Promise<Room[]> {
  const snap = await adminDb
    .collection("rooms")
    .where("isAvailable", "==", true)
    .orderBy("pricePerNight", "asc")
    .get();

  if (snap.empty) return MOCK_ROOMS;
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Room));
}

export async function getAllRooms(): Promise<Room[]> {
  const snap = await adminDb.collection("rooms").get();
  if (snap.empty) return MOCK_ROOMS;
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Room));
}

export async function getRoomById(id: string): Promise<Room | null> {
  if (id.startsWith("mock-")) {
    return MOCK_ROOMS.find((r) => r.id === id) || null;
  }
  
  const doc = await adminDb.collection("rooms").doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Room;
}

// ── User queries ───────────────────────────────────────────────────────────

export async function getUserById(id: string): Promise<User | null> {
  const doc = await adminDb.collection("users").doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as User;
}

export async function getAllUsers(): Promise<User[]> {
  const snap = await adminDb.collection("users").orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as User));
}

export async function updateUser(id: string, data: Partial<User>): Promise<void> {
  await adminDb.collection("users").doc(id).set(data, { merge: true });
}


// ── Booking queries ────────────────────────────────────────────────────────

export async function getBookingsForRoom(roomId: string): Promise<Booking[]> {
  const snap = await adminDb
    .collection("bookings")
    .where("roomId", "==", roomId)
    .where("status", "in", ["pending", "confirmed"])
    .get();

  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
}

// ── Loyalty queries ────────────────────────────────────────────────────────

export async function getLoyaltyProfile(userId: string): Promise<LoyaltyProfile | null> {
  const doc = await adminDb.collection("loyalty").doc(userId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as LoyaltyProfile;
}

export async function getPointTransactions(userId: string): Promise<PointTransaction[]> {
  const snap = await adminDb
    .collection("pointTransactions")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PointTransaction));
}

export async function getBookingsForGuest(guestId: string): Promise<Booking[]> {
  const snap = await adminDb
    .collection("bookings")
    .where("guestId", "==", guestId)
    .orderBy("createdAt", "desc")
    .get();

  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
}

export async function getAllBookings(): Promise<Booking[]> {
  const snap = await adminDb.collection("bookings").orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
}

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  const doc = await adminDb.collection("bookings").doc(bookingId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Booking;
}

// ── Availability ───────────────────────────────────────────────────────────

export async function checkAvailability(
  roomId: string,
  checkIn: string,
  checkOut: string
): Promise<boolean> {
  const bookings = await getBookingsForRoom(roomId);
  const newInterval = {
    start: parseISO(checkIn),
    end:   parseISO(checkOut),
  };

  for (const b of bookings) {
    const existingInterval = {
      start: parseISO(b.checkIn),
      end:   parseISO(b.checkOut),
    };
    if (areIntervalsOverlapping(newInterval, existingInterval, { inclusive: false })) {
      return false;
    }
  }
  return true;
}

// Return list of booked date strings for a room (for DateRangePicker excludeDates)
export async function getBookedDates(roomId: string): Promise<string[]> {
  const bookings = await getBookingsForRoom(roomId);
  const dates: string[] = [];
  for (const b of bookings) {
    let current = parseISO(b.checkIn);
    const end   = parseISO(b.checkOut);
    while (current < end) {
      dates.push(current.toISOString().split("T")[0]);
      current = new Date(current.getTime() + 86400000);
    }
  }
  return dates;
}

// ── Booking creation (Firestore transaction) ───────────────────────────────

export async function createBooking(input: CreateBookingInput): Promise<string> {
  const bookingRef = adminDb.collection("bookings").doc();

  await adminDb.runTransaction(async (tx) => {
    // Re-check availability inside transaction to prevent double-booking
    const snap = await tx.get(
      adminDb
        .collection("bookings")
        .where("roomId", "==", input.roomId)
        .where("status", "in", ["pending", "confirmed"])
    );

    const newInterval = {
      start: parseISO(input.checkIn),
      end:   parseISO(input.checkOut),
    };

    for (const doc of snap.docs) {
      const data = doc.data() as Booking;
      const existingInterval = {
        start: parseISO(data.checkIn),
        end:   parseISO(data.checkOut),
      };
      if (areIntervalsOverlapping(newInterval, existingInterval, { inclusive: false })) {
        throw new Error("DATES_UNAVAILABLE");
      }
    }

    const now = new Date().toISOString();
    tx.set(bookingRef, {
      roomId:          input.roomId,
      guestId:         input.guestId,
      guestName:       input.guestName,
      guestEmail:      input.guestEmail,
      guestPhone:      input.guestPhone,
      checkIn:         input.checkIn,
      checkOut:        input.checkOut,
      nights:          input.nights,
      totalPrice:      input.totalPrice,
      pointsEarned:    0,
      pointsRedeemed:  0,
      status:          "pending",
      paymentMethod:   "",
      stripeSessionId: "",
      notes:           input.notes ?? "",
      createdAt:       now,
      updatedAt:       now,
    });
  });

  return bookingRef.id;
}

// ── Webhook Fulfillments (Loyalty & Referrals) ─────────────────────────────

export async function processReferralReward(guestId: string) {
  // Check if guest used a referral code
  const userSnap = await adminDb.collection("users").doc(guestId).get();
  if (!userSnap.exists) return;
  const userData = userSnap.data() as User;
  const appliedCode = userData.appliedReferralCode;
  
  if (!appliedCode) return; // No referral code used

  // Make sure they haven't been rewarded yet (one-time reward)
  if (userData.referralRewarded) return;
  
  // Find the referrer
  const referrerSnap = await adminDb.collection("users").where("referralCode", "==", appliedCode).limit(1).get();
  if (referrerSnap.empty) return;
  
  const referrer = referrerSnap.docs[0];
  
  // Mark guest as rewarded
  await adminDb.collection("users").doc(guestId).update({ referralRewarded: true });

  // Give referrer 500 points (the person whose code was used)
  await creditLoyaltyPoints(referrer.id, 500, `Referral reward for inviting ${userData.firstName}`);

  // Give guest 250 points (the person who used the code)
  await creditLoyaltyPoints(guestId, 250, `Signed up using a referral code`);
}

export async function creditLoyaltyPoints(userId: string, points: number, description: string) {
  const profileRef = adminDb.collection("loyalty").doc(userId);
  const txRef = adminDb.collection("pointTransactions").doc();
  const isRedemption = points < 0;

  await adminDb.runTransaction(async (tx) => {
    const doc = await tx.get(profileRef);
    let newBalance = points;
    let newLifetime = isRedemption ? 0 : points; // lifetime never decreases

    if (doc.exists) {
      const data = doc.data() as LoyaltyProfile;
      newBalance  = data.pointsBalance + points;
      // Only increase lifetime on earning, not redemption
      newLifetime = isRedemption ? data.lifetimePoints : data.lifetimePoints + points;
    }

    // Clamp balance to 0 (can't go negative)
    newBalance = Math.max(0, newBalance);

    // Evaluate Tier Upgrades
    let tier = "Silver";
    if (newLifetime >= 1000) tier = "Gold";
    if (newLifetime >= 5000) tier = "Platinum";

    tx.set(profileRef, {
      userId,
      pointsBalance: newBalance,
      lifetimePoints: newLifetime,
      tier
    }, { merge: true });

    tx.set(txRef, {
      userId,
      amount: Math.abs(points),
      type: isRedemption ? "redeemed" : "earned",
      description,
      createdAt: new Date().toISOString()
    });
  });
}

