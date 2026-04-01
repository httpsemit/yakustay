# 🏨 Hotel Website — Product Requirements Document (PRD)
> Version 2.0 | Antigravity Workflow | Firebase + Next.js Stack | All Phases

---

## Document Info

| Field | Details |
|-------|---------|
| Project | Hotel Website |
| Document Type | Product Requirements Document (PRD) |
| Version | 2.0 — Firebase + Next.js Stack |
| Stack | Next.js + Firebase + Stripe + SendGrid |
| Hosting | Vercel + Firebase |
| Total Pages | 30 |
| Status | 🟡 Planning |

---

## Phase Roadmap Overview

| Phase | Focus | Status |
|-------|-------|--------|
| Phase 1 | Setup & Infrastructure | 🟡 In Progress |
| Phase 2 | Rooms, Booking & Payments | ⬜ Planned |
| Phase 3 | CRM, Admin, Loyalty & Referral | ⬜ Planned |
| Phase 4 | Multi-language, SEO & Launch | ⬜ Planned |

---

---

# PHASE 1 — Setup & Infrastructure

---

## P1.1 Overview

The goal of Phase 1 is to initialize the full project, connect all Firebase services, and verify that data flows correctly from Firestore to the browser — before any feature development begins.

---

## P1.2 Goals

- Initialize Next.js project with TypeScript and Tailwind CSS
- Set up Firebase project (Auth, Firestore, Storage, Cloud Functions)
- Connect Firebase SDK to Next.js frontend
- Configure Firebase Admin SDK for server-side API routes
- Set up Firestore security rules
- Deploy frontend to Vercel and verify live URL
- Establish folder structure and coding conventions

---

## P1.3 Out of Scope (Phase 1)

- Room booking and availability logic → Phase 2
- Stripe payment integration → Phase 2
- Guest CRM and admin dashboard → Phase 3
- Loyalty and referral program → Phase 3
- Multi-language support → Phase 4

---

## P1.4 Task Breakdown

### Frontend Setup

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 1 | Initialize Next.js 14 project with TypeScript | High | 1 hr |
| 2 | Configure Tailwind CSS | High | 30 min |
| 3 | Set up folder structure (app, components, lib, public) | High | 30 min |
| 4 | Configure `.env.local` with all Firebase variables | High | 20 min |
| 5 | Deploy to Vercel and verify live URL | High | 30 min |

### Firebase Setup

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 6 | Create Firebase project in console | High | 15 min |
| 7 | Enable Firebase Auth (email/password + Google) | High | 20 min |
| 8 | Initialize Firestore database | High | 15 min |
| 9 | Enable Firebase Storage for room images | High | 15 min |
| 10 | Install and configure Firebase SDK in Next.js (`lib/firebase.ts`) | High | 30 min |
| 11 | Install and configure Firebase Admin SDK (`lib/firebase-admin.ts`) | High | 30 min |
| 12 | Write initial Firestore security rules | High | 1 hr |
| 13 | Deploy Firestore security rules | High | 15 min |

### Auth Scaffolding

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 14 | Build login page (email/password + Google) | High | 1.5 hr |
| 15 | Build register page | High | 1 hr |
| 16 | Create auth context / hook (`useAuth`) | High | 1 hr |
| 17 | Protect routes — redirect if not logged in | High | 45 min |
| 18 | Test full auth flow (register, login, logout) | High | 30 min |

### API Route Setup

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 19 | Create `/api/health` endpoint to verify setup | High | 15 min |
| 20 | Set up Firebase token verification middleware for API routes | High | 45 min |

---

## P1.5 Dependencies & Risks

| Item | Type | Notes |
|------|------|-------|
| Firebase account | Dependency | Required — free Spark plan is sufficient |
| Vercel account | Dependency | Required for frontend hosting |
| Node.js 18+ | Dependency | Required for Next.js 14 |
| Firestore security rules | Risk | Wrong rules can expose data — test with Firebase Emulator |
| Firebase free tier limits | Risk | Upgrade to Blaze plan if functions are needed |

---

## P1.6 Definition of Done

- [ ] Next.js app is live on Vercel and loads without errors
- [ ] Firebase Auth works — guest can register, login, and logout
- [ ] Firestore is connected and security rules are deployed
- [ ] Firebase Storage is enabled
- [ ] Firebase Admin SDK works in Next.js API routes
- [ ] `/api/health` endpoint returns 200 OK
- [ ] All environment variables documented in `.env.example`
- [ ] Folder structure matches TRD v2.0

---

---

# PHASE 2 — Rooms, Booking & Payments

---

## P2.1 Overview

Phase 2 builds the core hotel functionality. By the end of this phase, a guest can browse rooms, check availability, complete a booking, and pay online via Stripe.

---

## P2.2 Goals

- Create and manage room data in Firestore
- Build availability checker using Firestore queries
- Create a full booking flow: room → form → payment → confirmation
- Integrate Stripe for online payments
- Store room images in Firebase Storage
- Send confirmation emails via SendGrid

---

## P2.3 Out of Scope (Phase 2)

- Guest CRM and profile management → Phase 3
- Admin dashboard → Phase 3
- Loyalty and referral program → Phase 3
- Multi-language support → Phase 4

---

## P2.4 Task Breakdown

### Firestore — Rooms

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 1 | Define `rooms` collection schema in Firestore | High | 30 min |
| 2 | Upload room images to Firebase Storage | High | 30 min |
| 3 | Seed Firestore with 3–5 sample rooms | High | 45 min |
| 4 | Build `getRooms()` and `getRoomById()` Firestore helpers | High | 45 min |

### Availability

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 5 | Define `bookings` collection schema in Firestore | High | 30 min |
| 6 | Build availability checker (Firestore query — no overlapping dates) | High | 1.5 hr |
| 7 | Use Firestore transaction to prevent double-booking | High | 1 hr |

### Booking Flow

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 8 | Build booking form UI (dates, guest info, room) | High | 2 hr |
| 9 | Connect booking form to Firestore | High | 1 hr |
| 10 | Build booking summary / review page | High | 1 hr |
| 11 | Build booking confirmation page (post-payment) | High | 45 min |

### Payments — Stripe

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 12 | Set up Stripe account and add keys to `.env.local` | High | 30 min |
| 13 | Build `/api/payments/create-checkout` route | High | 1.5 hr |
| 14 | Build `/api/payments/webhook` route | High | 1 hr |
| 15 | Update Firestore booking status on payment success | High | 45 min |
| 16 | Handle payment failure flow | High | 45 min |

### Email — SendGrid

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 17 | Set up SendGrid account and add API key | High | 20 min |
| 18 | Build `/api/email/booking-confirmation` route | High | 1 hr |
| 19 | Trigger confirmation email after Stripe webhook success | High | 30 min |

### Frontend Pages

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 20 | Homepage (hero, search, room highlights) | High | 2 hr |
| 21 | Rooms listing page | High | 1.5 hr |
| 22 | Room detail page (images, description, price, book button) | High | 1.5 hr |
| 23 | Booking form page | High | 2 hr |
| 24 | Booking summary page | High | 1 hr |
| 25 | Payment success page | High | 30 min |
| 26 | Payment failed page | Medium | 30 min |

---

## P2.5 Dependencies & Risks

| Item | Type | Notes |
|------|------|-------|
| Phase 1 complete | Dependency | Firebase + auth must be working |
| Stripe account | Dependency | Test mode works without business verification |
| SendGrid account | Dependency | Free tier: 100 emails/day |
| react-datepicker | Dependency | Install for date selection UI |
| Double-booking | Risk | Use Firestore transactions — not regular writes |
| Stripe webhook | Risk | Must verify webhook signature on every request |

---

## P2.6 Firestore Collections Used

- `rooms` — read
- `bookings` — read + write
- `payments` — write (via API route after webhook)

---

## P2.7 Definition of Done

- [ ] Rooms visible in Firestore and displayed on the frontend
- [ ] Availability checker blocks already-booked dates
- [ ] Guest can select a room, pick dates, and fill the booking form
- [ ] Stripe processes a test payment successfully
- [ ] Booking status updates to `confirmed` in Firestore after payment
- [ ] Confirmation email sent to guest via SendGrid
- [ ] Double-booking prevented via Firestore transaction
- [ ] All pages responsive on mobile

---

---

# PHASE 3 — CRM, Admin, Loyalty & Referral

---

## P3.1 Overview

Phase 3 adds the management and retention layer. Hotel staff get a full admin dashboard. Guests get a self-service profile, loyalty points, and a referral program.

---

## P3.2 Goals

- Build guest profile and booking history pages
- Build admin dashboard with full room, booking, and guest management
- Implement loyalty points system with tier levels
- Implement referral program with unique codes and rewards
- Allow guests to cancel bookings and receive Stripe refunds
- Export guest data as CSV

---

## P3.3 Out of Scope (Phase 3)

- Multi-language support → Phase 4
- SEO optimizations → Phase 4
- Reviews and ratings → Future

---

## P3.4 Task Breakdown

### Guest Profile

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 1 | Build guest profile page (name, email, phone) | High | 1.5 hr |
| 2 | Allow guest to update profile in Firestore | High | 1 hr |
| 3 | Build "My Bookings" page (upcoming + past) | High | 1.5 hr |
| 4 | Allow guest to cancel upcoming booking | High | 1 hr |
| 5 | Build `/api/payments/refund` route (Stripe refund) | High | 1.5 hr |
| 6 | Update Firestore booking status to `cancelled` + `refunded` | High | 30 min |
| 7 | Send cancellation email via SendGrid | Medium | 45 min |

### Admin Dashboard

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 8 | Build admin dashboard home (occupancy, revenue, check-ins) | High | 2 hr |
| 9 | Build `/api/admin/stats` route | High | 1 hr |
| 10 | Build rooms management page (add, edit, delete) | High | 2 hr |
| 11 | Build bookings management page (list, filter, confirm, cancel) | High | 2 hr |
| 12 | Allow admin to issue manual Stripe refund | High | 1 hr |
| 13 | Build guests management page (list, search, view profile) | High | 1.5 hr |
| 14 | Allow admin to add notes to guest Firestore document | Medium | 1 hr |
| 15 | Build `/api/admin/guests/export` CSV export route | Medium | 1 hr |

### Loyalty Program

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 16 | Create `loyalty/{userId}` document on first booking | High | 45 min |
| 17 | Credit points to guest after confirmed booking | High | 1 hr |
| 18 | Build loyalty dashboard page (balance, tier, history) | High | 1.5 hr |
| 19 | Build points redemption page | High | 1.5 hr |
| 20 | Build `/api/loyalty/redeem` route | High | 1 hr |
| 21 | Apply points discount in Stripe checkout | High | 1 hr |
| 22 | Auto-upgrade guest tier based on lifetime points | Medium | 45 min |
| 23 | Add birthday bonus points via Cloud Function | Medium | 1 hr |

### Referral Program

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 24 | Generate unique referral code on user registration | High | 45 min |
| 25 | Build referral page (link, history, rewards earned) | High | 1.5 hr |
| 26 | Build `/api/referral/validate` route | High | 1 hr |
| 27 | Apply 10% discount to referee's first booking | High | 1 hr |
| 28 | Credit 500 points to referrer after referee's first booking | High | 1 hr |
| 29 | Send referral reward email to referrer via SendGrid | Medium | 45 min |

---

## P3.5 Loyalty Program Rules

| Action | Points Earned |
|--------|--------------|
| Complete a booking | 1 point per $1 spent |
| Write a review | 50 points |
| Refer a friend (first booking) | 500 points |
| Birthday bonus | 200 points |

### Tier System

| Tier | Requirement | Benefit |
|------|-------------|---------|
| Silver | 0–999 pts | 5% discount |
| Gold | 1,000–4,999 pts | 10% discount + free breakfast |
| Platinum | 5,000+ pts | 15% discount + room upgrade |

### Redemption Rules
- 100 points = $1 discount
- Minimum: 500 points
- Maximum per booking: 30% of total price

---

## P3.6 Referral Program Rules

- Unique referral code generated at registration
- Referrer earns 500 points on referee's first completed booking
- Referee gets 10% off their first booking
- One reward per unique referee
- Code applied at registration, tracked in `referrals` collection

---

## P3.7 Cancellation Policy

| Scenario | Refund |
|----------|--------|
| Cancelled 48+ hrs before check-in | 100% refund |
| Cancelled 24–48 hrs before check-in | 50% refund |
| Cancelled < 24 hrs before check-in | No refund |
| Cancelled by admin (any time) | 100% refund |

---

## P3.8 Admin Dashboard Metrics

| Metric | Description |
|--------|-------------|
| Occupancy rate | % of rooms booked today |
| Total bookings | This month vs last month |
| Revenue | This month vs last month |
| Upcoming check-ins | Next 7 days |
| Upcoming check-outs | Next 7 days |
| Pending bookings | Awaiting confirmation |
| Active loyalty members | Guests with points balance |

---

## P3.9 Firestore Collections Used

- `users` — read + write
- `bookings` — read + write
- `payments` — read
- `loyalty` — read + write
- `pointTransactions` — write
- `referrals` — read + write

---

## P3.10 Definition of Done

- [ ] Guest can view and update their profile
- [ ] Guest can view all past and upcoming bookings
- [ ] Guest can cancel a booking and receive a refund per policy
- [ ] Admin dashboard shows all key metrics
- [ ] Admin can manage rooms, bookings, and guests
- [ ] Admin can add notes to guest profiles
- [ ] Guest list exportable as CSV
- [ ] Points credited after every confirmed booking
- [ ] Tier auto-upgrades based on lifetime points
- [ ] Guest can redeem points at checkout
- [ ] Referral code works — referee gets discount, referrer gets points
- [ ] All admin routes protected (Firebase custom claims — `role: admin`)

---

---

# PHASE 4 — Multi-language, SEO & Launch

---

## P4.1 Overview

Phase 4 polishes the product for launch. It adds multi-language support, SEO optimization, performance tuning, and a full production launch checklist.

---

## P4.2 Goals

- Add multi-language support (English + at least 1 local language)
- Optimize all pages for Google search (SEO)
- Improve performance (images, caching, lazy loading)
- Complete full QA across all 30 pages
- Go live on production

---

## P4.3 Out of Scope (Phase 4)

- Reviews and ratings system → Future
- Mobile app → Not in scope (removed earlier)
- Loyalty tier gift cards → Future

---

## P4.4 Task Breakdown

### Multi-language (i18next)

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 1 | Install and configure i18next with Next.js | High | 1 hr |
| 2 | Set up language files (`en.json`, `hi.json` or `as.json`) | High | 1 hr |
| 3 | Wrap all UI text with `t()` translation function | High | 3 hr |
| 4 | Add language switcher to navbar | High | 45 min |
| 5 | Test all pages in both languages | High | 1.5 hr |

### SEO

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 6 | Add meta title and description to every page | High | 1 hr |
| 7 | Add Open Graph tags (for social sharing previews) | High | 1 hr |
| 8 | Generate `sitemap.xml` dynamically | High | 45 min |
| 9 | Add `robots.txt` | High | 15 min |
| 10 | Add structured data (JSON-LD) for hotel and rooms | Medium | 1.5 hr |
| 11 | Verify Google Search Console setup | Medium | 30 min |

### Performance

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 12 | Optimize all room images with Next.js `<Image>` component | High | 1 hr |
| 13 | Lazy load below-the-fold components | High | 1 hr |
| 14 | Enable Vercel Edge caching for static pages | Medium | 30 min |
| 15 | Run Lighthouse audit and fix score below 85 | High | 2 hr |

### Static / Info Pages

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 16 | Build Contact page (form + info + map) | High | 1.5 hr |
| 17 | Build About page | Medium | 1 hr |
| 18 | Build FAQ page | Medium | 1 hr |
| 19 | Build Terms & Conditions page | High | 45 min |
| 20 | Build Privacy Policy page | High | 45 min |
| 21 | Build Cookie Policy page | Medium | 30 min |
| 22 | Build Cancellation Policy page | High | 30 min |
| 23 | Build Sitemap page | Low | 30 min |

### QA & Launch

| # | Task | Priority | Estimate |
|---|------|----------|----------|
| 24 | Full QA across all 30 pages on desktop and mobile | High | 4 hr |
| 25 | Test complete booking + payment flow end-to-end | High | 1 hr |
| 26 | Test loyalty points + referral flow end-to-end | High | 1 hr |
| 27 | Switch Stripe from test mode to live mode | High | 30 min |
| 28 | Switch SendGrid from sandbox to live mode | High | 15 min |
| 29 | Set up custom domain on Vercel | High | 30 min |
| 30 | Set up Firebase production environment | High | 30 min |
| 31 | Final Firestore security rules review | High | 1 hr |
| 32 | Go live | High | — |

---

## P4.5 Languages Supported

| Language | Code | Status |
|----------|------|--------|
| English | `en` | Primary |
| Hindi | `hi` | Phase 4 |
| Assamese (optional) | `as` | If needed |

---

## P4.6 SEO Checklist

- [ ] Every page has unique `<title>` and `<meta description>`
- [ ] Open Graph tags on homepage, rooms, and room detail pages
- [ ] `sitemap.xml` auto-generated and submitted to Google
- [ ] `robots.txt` allows all pages except `/admin`
- [ ] JSON-LD structured data on homepage and room detail pages
- [ ] All images have descriptive `alt` text
- [ ] Mobile-friendly (Lighthouse mobile score 85+)
- [ ] Page speed (LCP < 2.5 seconds)

---

## P4.7 Launch Checklist

- [ ] All 30 pages built and QA'd
- [ ] Stripe live mode enabled
- [ ] SendGrid live mode enabled
- [ ] Custom domain configured on Vercel
- [ ] Firebase production project configured (separate from dev)
- [ ] Firestore security rules reviewed and locked down
- [ ] Google Analytics or Vercel Analytics set up
- [ ] Error monitoring set up (Sentry or similar)
- [ ] Backup strategy for Firestore data documented
- [ ] 🚀 Go live!

---

## P4.8 Definition of Done

- [ ] All pages available in at least 2 languages
- [ ] Language switcher works correctly on all pages
- [ ] Lighthouse score 85+ on mobile and desktop
- [ ] All static/info pages are live
- [ ] SEO checklist 100% complete
- [ ] Stripe and SendGrid switched to live mode
- [ ] Custom domain live and HTTPS configured
- [ ] Zero critical bugs in QA

---

---

# All Phases — Summary

## Total Task Count

| Phase | Tasks | Est. Time |
|-------|-------|-----------|
| Phase 1 — Setup & Infrastructure | 20 tasks | ~12 hrs |
| Phase 2 — Rooms, Booking & Payments | 26 tasks | ~28 hrs |
| Phase 3 — CRM, Admin, Loyalty & Referral | 29 tasks | ~35 hrs |
| Phase 4 — Multi-language, SEO & Launch | 32 tasks | ~30 hrs |
| **Total** | **107 tasks** | **~105 hrs** |

## Full Page List (30 pages)

| # | Route | Phase |
|---|-------|-------|
| 1 | `/` — Homepage | 2 |
| 2 | `/rooms` — Room listing | 2 |
| 3 | `/rooms/[id]` — Room detail | 2 |
| 4 | `/book/[roomId]` — Booking form | 2 |
| 5 | `/book/confirm` — Booking summary | 2 |
| 6 | `/payment/success` — Payment success | 2 |
| 7 | `/payment/failed` — Payment failed | 2 |
| 8 | `/account` — Guest profile | 3 |
| 9 | `/account/bookings` — My bookings | 3 |
| 10 | `/login` — Login | 1 |
| 11 | `/register` — Register | 1 |
| 12 | `/loyalty` — Loyalty dashboard | 3 |
| 13 | `/loyalty/redeem` — Redeem points | 3 |
| 14 | `/referral` — Referral page | 3 |
| 15 | `/admin` — Admin dashboard | 3 |
| 16 | `/admin/rooms` — Manage rooms | 3 |
| 17 | `/admin/bookings` — Manage bookings | 3 |
| 18 | `/admin/guests` — Manage guests | 3 |
| 19 | `/contact` — Contact us | 4 |
| 20 | `/about` — About | 4 |
| 21 | `/faq` — FAQ | 4 |
| 22 | `/terms` — Terms & conditions | 4 |
| 23 | `/privacy` — Privacy policy | 4 |
| 24 | `/cookies` — Cookie policy | 4 |
| 25 | `/cancellation-policy` — Cancellation policy | 4 |
| 26 | `/sitemap` — Sitemap | 4 |
| 27 | `/loyalty/history` — Points history | 3 |
| 28 | `/admin/loyalty` — Admin loyalty overview | 3 |
| 29 | `/admin/referrals` — Admin referral overview | 3 |
| 30 | `/account/referral` — My referral code | 3 |