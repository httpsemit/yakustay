# 🏨 Hotel Website — Technical Requirements Document (TRD)
> Version 2.0 | Antigravity Workflow | Updated: Firebase + Next.js Stack

---

## Document Info

| Field | Details |
|-------|---------|
| Project | Hotel Website |
| Document Type | Technical Requirements Document (TRD) |
| Version | 2.0 (replaces v1.0 — Django/PostgreSQL stack) |
| Stack | Next.js + Firebase + Stripe |
| Hosting | Vercel + Firebase |
| Status | 🟡 Draft |

---

## Change Log

| Version | Change |
|---------|--------|
| v1.0 | Initial TRD — Next.js + Django REST + PostgreSQL + Railway |
| v2.0 | Replaced Django + PostgreSQL + Railway with Firebase (Auth, Firestore, Storage, Cloud Functions). Added loyalty program and referral program. |

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  GUEST / ADMIN                       │
└─────────────────────┬───────────────────────────────┘
                      │ HTTPS
┌─────────────────────▼───────────────────────────────┐
│           FRONTEND — Next.js (Vercel)                │
│  Pages, Components, Firebase SDK, i18next            │
└──────┬──────────────┬──────────────┬────────────────┘
       │              │              │
       │ Auth    Firestore     Storage
┌──────▼──────────────▼──────────────▼────────────────┐
│                  FIREBASE                            │
│  Auth │ Firestore DB │ Storage │ Cloud Functions     │
└──────────────────────┬──────────────────────────────┘
                       │
          ┌────────────┴──────────────┐
          │                           │
┌─────────▼──────────┐   ┌───────────▼───────────────┐
│  Stripe (Payments) │   │  SendGrid / Mailgun (Email)│
└────────────────────┘   └───────────────────────────┘
```

---

## 2. Tech Stack

### 2.1 Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14+ | React framework, SSR, routing, API routes |
| TypeScript | 5+ | Type safety |
| Tailwind CSS | 3+ | Styling |
| Firebase SDK | 10+ | Auth, Firestore, Storage client |
| i18next | 23+ | Multi-language support |
| react-datepicker | Latest | Date selection for bookings |
| Axios | Latest | HTTP client for external API calls |

### 2.2 Backend (Firebase + Next.js API Routes)

> No separate backend server — Firebase handles auth and data, Next.js API routes handle Stripe and email logic.

| Technology | Version | Purpose |
|------------|---------|---------|
| Firebase Admin SDK | Latest | Server-side Firestore + Auth access |
| Firebase Cloud Functions | Latest | Background tasks (email triggers, webhooks) |
| Next.js API Routes | 14+ | Stripe checkout, webhook handling, email sending |
| Stripe Node.js SDK | Latest | Payment processing |
| SendGrid / Mailgun SDK | Latest | Transactional emails |

### 2.3 Database — Firestore (NoSQL)

| Collection | Purpose |
|------------|---------|
| `users` | Guest and admin profiles |
| `rooms` | Room listings and details |
| `bookings` | All booking records |
| `payments` | Stripe payment records |
| `loyalty` | Points balance and tier per guest |
| `pointTransactions` | Points earned/redeemed history |
| `referrals` | Referral tracking records |
| `reviews` | Guest reviews (future) |

### 2.4 Firebase Services

| Service | Purpose |
|---------|---------|
| Firebase Auth | Email/password, Google login, session management |
| Firestore | Primary NoSQL database (real-time) |
| Firebase Storage | Room images and guest uploads |
| Cloud Functions | Webhooks, background email triggers |
| Firebase Hosting (optional) | Static assets CDN |

### 2.5 Infrastructure

| Service | Purpose | Tier |
|---------|---------|------|
| Vercel | Next.js frontend hosting | Free / Pro |
| Firebase | Auth + DB + Storage + Functions | Spark (free) → Blaze (pay-as-you-go) |
| Stripe | Payment processing | Test → Live |
| SendGrid / Mailgun | Transactional email | Free tier |

---

## 3. Firestore Data Models

> Firestore is NoSQL — data is stored as collections of documents, not SQL tables.

### 3.1 Collection Structure Overview

```
users/{userId}
rooms/{roomId}
  └── images/ (subcollection)
bookings/{bookingId}
payments/{paymentId}
loyalty/{userId}
pointTransactions/{transactionId}
referrals/{referralId}
```

### 3.2 Document Schemas

#### `users/{userId}`
```json
{
  "uid": "firebase-auth-uid",
  "email": "guest@example.com",
  "firstName": "Ravi",
  "lastName": "Sharma",
  "phone": "+91 98765 43210",
  "role": "guest",
  "referralCode": "RAVI2025",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### `rooms/{roomId}`
```json
{
  "name": "Deluxe King Room",
  "description": "Spacious room with king bed and city views",
  "pricePerNight": 149,
  "capacity": 2,
  "amenities": ["WiFi", "AC", "TV", "Mini bar"],
  "isAvailable": true,
  "images": ["https://storage.firebase.../room1.jpg"],
  "primaryImage": "https://storage.firebase.../room1.jpg",
  "createdAt": "timestamp"
}
```

#### `bookings/{bookingId}`
```json
{
  "roomId": "room-doc-id",
  "guestId": "user-doc-id",
  "checkIn": "2025-06-15",
  "checkOut": "2025-06-20",
  "nights": 5,
  "totalPrice": 745,
  "pointsEarned": 745,
  "pointsRedeemed": 0,
  "status": "confirmed",
  "stripeSessionId": "cs_test_...",
  "notes": "",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### `payments/{paymentId}`
```json
{
  "bookingId": "booking-doc-id",
  "guestId": "user-doc-id",
  "stripePaymentId": "pi_...",
  "amount": 745,
  "currency": "inr",
  "status": "succeeded",
  "paidAt": "timestamp",
  "createdAt": "timestamp"
}
```

#### `loyalty/{userId}`
```json
{
  "userId": "user-doc-id",
  "pointsBalance": 1250,
  "lifetimePoints": 3400,
  "totalStays": 4,
  "lifetimeSpend": 3400,
  "tier": "Gold",
  "updatedAt": "timestamp"
}
```

#### `pointTransactions/{transactionId}`
```json
{
  "userId": "user-doc-id",
  "bookingId": "booking-doc-id",
  "type": "earned",
  "points": 745,
  "description": "Stay at Deluxe King Room",
  "createdAt": "timestamp"
}
```

#### `referrals/{referralId}`
```json
{
  "referrerId": "user-doc-id",
  "refereeId": "user-doc-id",
  "referralCode": "RAVI2025",
  "status": "completed",
  "rewardGiven": true,
  "pointsAwarded": 500,
  "createdAt": "timestamp"
}
```

---

## 4. API Routes (Next.js)

> Firebase handles auth and data directly from the client SDK. Next.js API routes are used only for sensitive server-side operations.

### 4.1 Base URL
- **Development:** `http://localhost:3000/api/`
- **Production:** `https://your-hotel.vercel.app/api/`

### 4.2 Authentication
All protected API routes verify the Firebase ID token:
```
Authorization: Bearer <firebase-id-token>
```

### 4.3 Endpoints

#### Payments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/payments/create-checkout` | Guest | Create Stripe checkout session |
| POST | `/api/payments/webhook` | Stripe | Handle Stripe webhook events |
| POST | `/api/payments/refund` | Admin | Issue a refund via Stripe |

#### Emails

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/email/booking-confirmation` | Internal | Send booking confirmation email |
| POST | `/api/email/cancellation` | Internal | Send cancellation email |
| POST | `/api/email/referral-reward` | Internal | Send referral reward email |

#### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/stats` | Admin | Get dashboard stats |
| GET | `/api/admin/guests/export` | Admin | Export guest list as CSV |

#### Loyalty & Referral

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/loyalty/redeem` | Guest | Redeem points at checkout |
| POST | `/api/referral/validate` | Guest | Validate referral code on register |

---

## 5. Frontend Routes (30 pages)

### Guest-facing

| Route | Page | Auth |
|-------|------|------|
| `/` | Homepage | No |
| `/rooms` | Room listing | No |
| `/rooms/[id]` | Room detail | No |
| `/book/[roomId]` | Booking form | Yes |
| `/book/confirm` | Booking summary | Yes |
| `/payment/success` | Payment success | Yes |
| `/payment/failed` | Payment failed | No |
| `/account` | Guest profile | Yes |
| `/account/bookings` | My bookings | Yes |

### Auth

| Route | Page | Auth |
|-------|------|------|
| `/login` | Login | No |
| `/register` | Register | No |

### Loyalty & Referral

| Route | Page | Auth |
|-------|------|------|
| `/loyalty` | Loyalty dashboard (points, tier) | Yes |
| `/loyalty/redeem` | Redeem points | Yes |
| `/referral` | Referral page (unique link, history) | Yes |

### Admin

| Route | Page | Auth |
|-------|------|------|
| `/admin` | Admin dashboard | Admin |
| `/admin/rooms` | Manage rooms | Admin |
| `/admin/bookings` | Manage bookings | Admin |
| `/admin/guests` | Manage guests | Admin |

### Static / Info

| Route | Page | Auth |
|-------|------|------|
| `/contact` | Contact us | No |
| `/about` | About the hotel | No |
| `/faq` | FAQ | No |
| `/cancellation-policy` | Cancellation policy | No |
| `/terms` | Terms & conditions | No |
| `/privacy` | Privacy policy | No |
| `/cookies` | Cookie policy | No |
| `/sitemap` | Sitemap | No |

---

## 6. Loyalty Program Rules

| Action | Points Earned |
|--------|--------------|
| Complete a booking | 1 point per $1 spent |
| Write a review | 50 points |
| Refer a friend (on their first booking) | 500 points |
| Birthday bonus | 200 points |

### Tier System

| Tier | Requirement | Benefit |
|------|-------------|---------|
| Silver | 0–999 points | 5% discount on bookings |
| Gold | 1,000–4,999 points | 10% discount + free breakfast |
| Platinum | 5,000+ points | 15% discount + room upgrade |

### Redemption Rate
- 100 points = $1 discount
- Minimum redemption: 500 points
- Max redemption per booking: 30% of total price

---

## 7. Referral Program Rules

- Each guest gets a unique referral code on registration
- Referrer earns 500 points when referee completes their first booking
- Referee gets 10% off their first booking
- One referral reward per unique referee
- Referral code applied at registration — tracked via Firestore

---

## 8. Security Requirements

- All pages and API routes served over HTTPS only
- Firebase Auth handles all password hashing and session management
- Firebase ID tokens verified server-side on every protected API route
- Firestore security rules restrict read/write per user role
- Admin routes protected by custom claims in Firebase Auth (`role: admin`)
- Stripe webhook signatures verified on every webhook request
- Environment variables never committed to version control
- Firebase Storage rules restrict image uploads to authenticated users only

### Firestore Security Rules (summary)
```
users: read/write own document only; admin can read all
rooms: anyone can read; admin only can write
bookings: guest reads own; admin reads all; guest creates own
payments: admin only
loyalty: read/write own document only
referrals: guest reads own; system writes
```

---

## 9. Performance Requirements

| Metric | Target |
|--------|--------|
| Page load time (LCP) | < 2.5 seconds |
| Firestore query time | < 200ms |
| Availability uptime | 99.9%+ (Firebase SLA) |
| Mobile Lighthouse score | 85+ |
| Concurrent users supported | 500+ (Firebase scales automatically) |

---

## 10. Environment Variables

### `.env.local` (Next.js)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

SENDGRID_API_KEY=SG...
DEFAULT_FROM_EMAIL=noreply@yourhotel.com

NEXT_PUBLIC_APP_URL=https://your-hotel.vercel.app
```

---

## 11. Folder Structure

```
hotel-website/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (guest)/
│   │   ├── rooms/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── book/
│   │   │   ├── [roomId]/page.tsx
│   │   │   └── confirm/page.tsx
│   │   ├── payment/
│   │   │   ├── success/page.tsx
│   │   │   └── failed/page.tsx
│   │   ├── account/
│   │   │   ├── page.tsx
│   │   │   └── bookings/page.tsx
│   │   ├── loyalty/
│   │   │   ├── page.tsx
│   │   │   └── redeem/page.tsx
│   │   └── referral/page.tsx
│   ├── (static)/
│   │   ├── contact/page.tsx
│   │   ├── about/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── cookies/page.tsx
│   │   └── cancellation-policy/page.tsx
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── rooms/page.tsx
│   │   ├── bookings/page.tsx
│   │   └── guests/page.tsx
│   ├── api/
│   │   ├── payments/
│   │   │   ├── create-checkout/route.ts
│   │   │   ├── webhook/route.ts
│   │   │   └── refund/route.ts
│   │   ├── email/
│   │   │   ├── booking-confirmation/route.ts
│   │   │   └── cancellation/route.ts
│   │   ├── loyalty/
│   │   │   └── redeem/route.ts
│   │   ├── referral/
│   │   │   └── validate/route.ts
│   │   └── admin/
│   │       ├── stats/route.ts
│   │       └── guests/export/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── rooms/
│   ├── booking/
│   ├── loyalty/
│   ├── referral/
│   └── layout/
├── lib/
│   ├── firebase.ts          # Firebase client init
│   ├── firebase-admin.ts    # Firebase admin init
│   ├── firestore.ts         # Firestore helper functions
│   ├── stripe.ts            # Stripe helpers
│   ├── email.ts             # Email sending helpers
│   └── loyalty.ts           # Points calculation helpers
├── public/
├── styles/
└── .env.local
```

---

## 12. Testing Requirements

| Type | Tool | Coverage Target |
|------|------|----------------|
| Unit tests (frontend) | Jest + React Testing Library | 70%+ |
| Firestore rules tests | Firebase Emulator Suite | All rules |
| API route tests | Jest + Supertest | All endpoints |
| E2E tests | Playwright | Critical flows |

**Critical flows to test end-to-end:**
- Guest registers with referral code and gets discount
- Guest browses rooms and completes a booking with payment
- Points are credited after successful booking
- Guest redeems points at checkout
- Admin can manage rooms, bookings, and guests
- Double-booking is prevented via Firestore transaction

---

## 13. Deployment Pipeline

```
Developer pushes to GitHub
        │
        ▼
GitHub Actions CI runs tests
        │
   ┌────┴────┐
   │ Pass?   │
   └────┬────┘
        │ Yes
   ┌────▼──────────────────────────┐
   │  Auto-deploy to:              │
   │  Vercel (Next.js frontend)    │
   │  Firebase (Functions + Rules) │
   └───────────────────────────────┘
```

---

## 14. Phase Roadmap

| Phase | Focus | Status |
|-------|-------|--------|
| Phase 1 | Setup & Infrastructure (Next.js + Firebase) | 🟡 In Progress |
| Phase 2 | Rooms, Booking & Payments (Stripe) | ⬜ Planned |
| Phase 3 | CRM, Admin, Loyalty & Referral | ⬜ Planned |
| Phase 4 | Multi-language, SEO & Launch | ⬜ Planned |