# StampID - Product Requirements Document

> AI-Powered Voice-First Stamp Collection App

---

## Table of Contents

1. [What We're Building](#what-were-building)
2. [Why We're Building It](#why-were-building-it)
3. [How We're Building It](#how-were-building-it)
4. [Epics & Micro Tasks](#epics--micro-tasks)
5. [Technical Architecture](#technical-architecture)
6. [Success Metrics](#success-metrics)

---

## What We're Building

### Product Vision

**StampID** is a voice-first mobile app that lets stamp collectors:
1. **Identify stamps** instantly using AI-powered image recognition
2. **Build digital collections** with automatic organization and valuation
3. **Track collection value** over time with market insights
4. **Connect with collectors** (future: buy, sell, trade)

### Core Value Proposition

> "CoinSnap for Stamps" - Take a photo, know what you have, build your collection, understand its worth.

### Target Users

| User Type | Description | Pain Points |
|-----------|-------------|-------------|
| **Casual Collectors** | Inherited stamps, curious about value | Don't know what they have |
| **Hobbyist Collectors** | Active collectors, 100-1000+ stamps | Manual tracking, no digital catalog |
| **Serious Philatelists** | Expert collectors, rare items | Need authentication, marketplace access |
| **Sellers** | Want to liquidate collections | Don't know value, hard to find buyers |

### Product Phases

```
Phase 1 (MVP)          Phase 2                   Phase 3
─────────────────     ─────────────────        ─────────────────
• AI Identification   • Collection Analytics   • Marketplace
• Digital Collection  • Value Tracking         • Verified Sellers
• Basic Valuation     • Wishlist/Alerts        • Authentication
• User Accounts       • Social Features        • Escrow System
```

---

## Why We're Building It

### Market Opportunity

| Metric | Value | Source |
|--------|-------|--------|
| Global Market Size | **$3-8.5 billion** | Market Research Reports 2024 |
| Annual Growth Rate | **4.6-6.5% CAGR** | Through 2033 |
| North America Share | **40%** | Largest market |
| Key Trend | Digital platforms expanding reach globally |

### Competitive Gap

**CoinSnap Success (Benchmark):**
- 11M+ downloads, 90K+ reviews, 4.6 stars
- ~$1M/month revenue ($600K iOS + $400K Android)
- Launched August 2022

**Current Stamp Apps (Weak Competition):**

| App | Rating | Problem |
|-----|--------|---------|
| Colnect Stamp Identifier | 3.4★ | Basic, outdated UX |
| StampSnap (existing) | ~3★ | Crashes, ads, poor accuracy |
| Stamp Value Identifier | Mixed | "Paid $5.99 for nothing" |
| Stamp Identifier AI | ~3★ | Solo developer, accuracy issues |

**The Gap:** No one has built a quality "CoinSnap for Stamps" yet.

### Why Now?

1. **UPU Database**: Universal Postal Union just launched official global stamp database
2. **AI Maturity**: Image recognition tech is production-ready and affordable
3. **Market Ready**: Existing apps have proven demand but failed on execution
4. **Mobile-First**: Collectors want to catalog on-the-go

### Fraud Consideration (Opportunity, Not Risk)

Stamp fraud is a **$150M+ problem**. This creates opportunity:
- **Authentication as premium feature**
- **Verified seller marketplace** as competitive moat
- **Trust badges** for legitimate listings
- **AI-assisted authenticity checks**

---

## How We're Building It

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Expo 54 + React Native 0.81 | Cross-platform mobile |
| **Styling** | NativeWind (TailwindCSS) | Consistent design system |
| **Backend** | Supabase | Auth, Database, Storage |
| **AI Backend** | Vercel Edge Functions | Secure AI API calls |
| **AI Model** | OpenRouter (Gemini 2.5 Flash) | LLM router, change model in 2 lines |
| **Payments** | RevenueCat | Subscriptions |
| **State** | React Query + Zustand | Server + Client state |
| **Animations** | Reanimated | Smooth 60fps animations |
| **Design** | Glassmorphic UI System | Forest green + cream palette |

### Design System

| Element | Value | Notes |
|---------|-------|-------|
| **Primary Color** | Forest Green (#1B4332) | Deep, premium feel |
| **Background** | Cream (#FAF9F6) | Warm, paper-like |
| **Text** | Near-black (#1A1A1A) | High contrast |
| **UI Components** | Frosted glass | Glassmorphic cards |
| **Stamp Mask** | Perforated border | Classic stamp silhouette |

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        MOBILE APP                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Camera    │  │ Collection  │  │     Profile/        │ │
│  │   Scanner   │  │   Manager   │  │     Settings        │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
│         │                │                     │            │
│  ┌──────┴────────────────┴─────────────────────┴──────────┐│
│  │                    State Management                     ││
│  │              (React Query + Zustand)                    ││
│  └─────────────────────────┬───────────────────────────────┘│
└─────────────────────────────┼───────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────┐
│                    VERCEL BACKEND                           │
│  ┌─────────────────────────┴─────────────────────────────┐ │
│  │    Edge Function: /api/identify-stamp                  │ │
│  │    (Secure API key, calls OpenRouter)                  │ │
│  └─────────────────────────┬─────────────────────────────┘ │
└─────────────────────────────┼───────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────┐
│                        SUPABASE                             │
│  ┌──────────────┐  ┌───────┴───────┐  ┌──────────────────┐ │
│  │     Auth     │  │   Database    │  │     Storage      │ │
│  │  (Users)     │  │  (Stamps,     │  │  (Images)        │ │
│  │              │  │   Collections)│  │                  │ │
│  └──────────────┘  └───────────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────┐
│                      OPENROUTER                             │
│  ┌──────────────────────────┴────────────────────────────┐ │
│  │   Gemini 2.5 Flash (default) - Multi-stamp detection  │ │
│  │   300+ models available, change in 2 lines            │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Epics & Micro Tasks

### Overview

| Epic | Name | Priority | Complexity | Status |
|------|------|----------|------------|--------|
| 0 | Foundation (Existing) | - | - | ✅ Done |
| 1 | Project Setup & Branding | P0 | Low | 🟡 Partial |
| 2 | Authentication Flow | P0 | Medium | ✅ Done |
| 3 | Camera & Image Capture | P0 | Medium | ✅ Done |
| 4 | AI Stamp Identification | P0 | High | ✅ Done |
| 5 | Collection Management | P0 | High | 🟡 Partial |
| 6 | Stamp Detail & Editing | P1 | Medium | ⏳ Pending |
| 7 | Search & Filtering | P1 | Medium | ⏳ Pending |
| 8 | Subscription & Paywall | P1 | Medium | ⏳ Pending |
| 9 | User Profile & Settings | P1 | Low | ⏳ Pending |
| 10 | Onboarding Flow | P2 | Low | ⏳ Pending |
| 11 | Analytics & Value Tracking | P2 | Medium | ⏳ Pending |
| 12 | Social & Sharing | P2 | Medium | ⏳ Pending |
| 13 | Polish & Performance | P2 | Medium | ⏳ Pending |

---

### EPIC 0: Foundation (Already Complete) ✅

> Inherited from Expo Starter Template

**Completed:**
- [x] Expo 54 + React Native setup
- [x] NativeWind styling configuration
- [x] Supabase client setup
- [x] RevenueCat integration
- [x] React Query + Zustand state management
- [x] Glassmorphic UI component library
- [x] Animation presets
- [x] Error boundary
- [x] Format utilities

---

### EPIC 1: Project Setup & Branding 🟡

> **Goal**: Transform starter template into StampID brand

**Tasks:**

- [ ] **1.1** Update app.json with StampID branding
  - App name, slug, scheme
  - Bundle identifiers (iOS/Android)
  - Splash screen configuration

- [ ] **1.2** Create/add app icons
  - iOS icon (1024x1024)
  - Android adaptive icon
  - Favicon for web

- [ ] **1.3** Design and implement splash screen
  - StampID logo
  - Brand colors
  - Loading animation

- [x] **1.4** Update color scheme in tailwind.config.js
  - Primary: Forest Green (#1B4332)
  - Background: Cream (#FAF9F6)
  - Text: Near-black (#1A1A1A)
  - UI: Frosted glass effects

- [ ] **1.5** Create app-wide constants
  - API endpoints
  - Feature flags
  - Limit constants (free tier limits, etc.)

- [ ] **1.6** Set up environment configuration
  - .env.local template
  - Environment-specific configs
  - Supabase keys placeholder

**Acceptance Criteria:**
- App displays "StampID" branding throughout
- Icons and splash screen match brand identity
- Color scheme is consistent and cohesive
- Environment config is properly structured

---

### EPIC 2: Authentication Flow ✅

> **Goal**: Complete user authentication with Supabase

**Tasks:**

- [x] **2.1** Create sign-in screen
  - Email/password form with validation
  - "Forgot password" link
  - "Sign up" link
  - Social login buttons (Apple, Google) - UI only initially

- [x] **2.2** Create sign-up screen
  - Email/password with confirmation
  - Display name field
  - Terms of service checkbox
  - Real-time validation feedback

- [x] **2.3** Create forgot password screen
  - Email input
  - Success confirmation state
  - "Back to sign in" link

- [x] **2.4** Implement useAuth hook
  - Sign in with email/password
  - Sign up with email/password
  - Sign out
  - Password reset request
  - Session persistence
  - Auth state listener

- [ ] **2.5** Create auth layout and guards
  - Protected route wrapper
  - Redirect to sign-in if not authenticated
  - Redirect to home if already authenticated

- [ ] **2.6** Set up Supabase auth configuration
  - Email confirmation settings
  - Password requirements
  - Session configuration

**Acceptance Criteria:**
- ✅ Users can sign up with email/password
- ✅ Users can sign in with existing account
- ✅ Users can reset password via email
- Auth state persists across app restarts
- Protected routes redirect appropriately

**Dependencies:** EPIC 1

---

### EPIC 3: Camera & Image Capture ✅

> **Goal**: Capture stamp images for AI identification

**Tasks:**

- [x] **3.1** Install and configure expo-camera
  - Camera permissions handling
  - iOS/Android configuration

- [x] **3.2** Create camera screen
  - Full-screen camera preview
  - Capture button
  - Flash toggle
  - Camera flip (front/back)
  - Close/cancel button
  - **Stamp-shaped perforated mask overlay**

- [ ] **3.3** Create image preview screen
  - Display captured image
  - Retake button
  - Use this photo button
  - Crop/rotate basic controls

- [x] **3.4** Implement gallery picker
  - expo-image-picker integration
  - Select from photo library
  - Multiple image selection (for batch scanning - premium)

- [ ] **3.5** Create scan entry point component
  - Floating action button on home screen
  - Bottom sheet with camera/gallery options
  - Scan history quick access

- [x] **3.6** Image optimization utility
  - Resize images for upload (max 1024x1024)
  - Compress to reduce bandwidth (~75% quality)
  - Generate base64 for API upload
  - Log compressed size for monitoring

**Acceptance Criteria:**
- ✅ Camera opens with proper permissions
- ✅ Photos can be captured and previewed
- ✅ Images can be selected from gallery
- ✅ Images are optimized/compressed before upload
- Works on iOS, Android, and web (file picker fallback)

**Dependencies:** EPIC 1, EPIC 2 (for saving)

---

### EPIC 4: AI Stamp Identification ✅

> **Goal**: Identify stamps from photos using AI

**Tasks:**

- [x] **4.1** Set up backend for AI processing
  - ~~Supabase Edge Function~~ → Vercel Edge Function
  - Configure secrets (OPENROUTER_API_KEY)
  - Set up CORS and authentication

- [x] **4.2** Implement OpenRouter/Gemini integration
  - LLM router pattern (change model in 2 lines)
  - Default: Gemini 2.5 Flash (best price/performance)
  - Alternative: Gemini 2.0 Flash (free), Claude 3.5 Sonnet (premium)
  - Parse structured JSON response
  - Handle API errors gracefully

- [x] **4.3** Create stamp identification prompt engineering
  - Extract: country, year, catalog number, denomination
  - Extract: condition assessment
  - Extract: value estimate range
  - Extract: historical context/description
  - Confidence scoring
  - **Multi-stamp detection with bounding boxes**

- [x] **4.4** Build identification results screen
  - Display identified stamp details
  - Confidence indicator
  - Value estimate range
  - "Save to collection" button
  - "Scan another" button
  - **Multi-stamp selector (switch between detected stamps)**
  - **Collection summary with total value**

- [x] **4.5** Create useStampIdentification hook
  - Upload image with compression
  - Call backend API
  - Handle loading/error states
  - Return array of stamps (multi-stamp support)

- [ ] **4.6** Implement scan limits (free tier)
  - Track scans per user per month
  - Show remaining scans
  - Upgrade prompt when limit reached

- [ ] **4.7** Create identification history
  - Store all scan attempts
  - View past scans
  - Re-save unsaved scans

**Acceptance Criteria:**
- ✅ AI identifies stamps with good accuracy
- ✅ Results display within 5-10 seconds
- ✅ **Multiple stamps detected in one image**
- ✅ **Bounding boxes returned for each stamp**
- Free users limited to X scans/month (not yet enforced)
- Errors handled gracefully with retry option

**Dependencies:** EPIC 3

---

### EPIC 5: Collection Management 🟡

> **Goal**: Organize stamps into digital collections

**Tasks:**

- [x] **5.1** Set up Supabase database schema
  - Create stamps table
  - Create collections table
  - Create stamp_collections junction table
  - Create scan_history table
  - Set up Row Level Security (RLS)
  - Created: `supabase/migrations/001_initial_schema.sql`

- [x] **5.2** Create TypeScript types for database
  - Profile, Stamp, Collection, ScanHistory types
  - Created: `lib/supabase/types.ts`

- [ ] **5.3** Create collection list screen
  - Grid/list view of collections
  - Collection card with cover image, name, count
  - "Create collection" button
  - Sort options (name, date, value)

- [ ] **5.4** Create collection detail screen
  - Collection header with stats
  - Stamp grid within collection
  - Edit collection button
  - Add stamps button
  - Total value display

- [ ] **5.5** Create "My Stamps" screen (all stamps)
  - Full stamp grid/list
  - Filter by collection
  - Filter by country/year/value
  - Search functionality
  - Bulk select mode

- [ ] **5.6** Implement create/edit collection modal
  - Collection name input
  - Description textarea
  - Cover image selection
  - Public/private toggle

- [ ] **5.7** Create stamp grid component
  - Thumbnail display
  - Value badge
  - Favorite indicator
  - Selection checkbox (bulk mode)
  - Empty state

- [ ] **5.8** Implement useCollection hooks
  - useCollections (list all)
  - useCollection (single with stamps)
  - useCreateCollection
  - useUpdateCollection
  - useDeleteCollection
  - useAddStampToCollection
  - useRemoveStampFromCollection

- [ ] **5.9** Implement useStamps hooks
  - useStamps (all user stamps)
  - useStamp (single stamp)
  - useCreateStamp (from AI result)
  - useUpdateStamp
  - useDeleteStamp
  - useFavoriteStamp

**Acceptance Criteria:**
- ✅ Database schema created with RLS
- Users can create multiple collections
- Stamps can belong to multiple collections
- Collection total value auto-calculates
- Grid displays thumbnails performantly
- RLS ensures users only see their data

**Dependencies:** EPIC 4

---

### EPIC 6: Stamp Detail & Editing ⏳

> **Goal**: View and edit individual stamp details

**Tasks:**

- [ ] **6.1** Create stamp detail screen
  - Large image display with zoom
  - All identification data displayed
  - Value estimate with range
  - Confidence score
  - Collection membership list
  - Edit button
  - Delete button
  - Share button

- [ ] **6.2** Create stamp edit screen/modal
  - All fields editable
  - Country picker
  - Year picker
  - Condition selector
  - Value override
  - Notes textarea
  - Image replacement option

- [ ] **6.3** Build condition selector component
  - Visual condition scale
  - Mint, Mint Hinged, Used, Damaged
  - Condition guide/help

- [ ] **6.4** Implement image zoom viewer
  - Pinch to zoom
  - Pan to explore
  - Double tap to zoom
  - Full-screen mode

- [ ] **6.5** Add to collection flow
  - Collection selector modal
  - Create new collection inline
  - Multi-select collections

- [ ] **6.6** Delete confirmation flow
  - Confirmation modal
  - "Remove from collection" vs "Delete stamp"
  - Undo option (soft delete)

**Acceptance Criteria:**
- Stamp details are fully viewable
- All fields can be edited and saved
- Image can be zoomed for inspection
- Delete has confirmation to prevent accidents
- Changes sync to Supabase in real-time

**Dependencies:** EPIC 5

---

### EPIC 7: Search & Filtering ⏳

> **Goal**: Find stamps quickly in large collections

**Tasks:**

- [ ] **7.1** Create search bar component
- [ ] **7.2** Implement full-text search
- [ ] **7.3** Create filter panel
- [ ] **7.4** Build sort options
- [ ] **7.5** Implement filter chips display
- [ ] **7.6** Create advanced search screen

**Dependencies:** EPIC 5

---

### EPIC 8: Subscription & Paywall ⏳

> **Goal**: Monetize with RevenueCat subscriptions

**Tasks:**

- [ ] **8.1** Configure RevenueCat products
- [ ] **8.2** Implement useSubscription hook
- [ ] **8.3** Create paywall screen
- [ ] **8.4** Implement feature gating
- [ ] **8.5** Create upgrade prompts
- [ ] **8.6** Build subscription management screen

**Dependencies:** EPIC 4, EPIC 5

---

### EPIC 9: User Profile & Settings ⏳

> **Goal**: User account management and app preferences

**Tasks:**

- [ ] **9.1** Create profile screen
- [ ] **9.2** Implement avatar upload
- [ ] **9.3** Create settings screen
- [ ] **9.4** Build account section
- [ ] **9.5** Implement settings persistence
- [ ] **9.6** Create about/help section

**Dependencies:** EPIC 2

---

### EPIC 10: Onboarding Flow ⏳

> **Goal**: First-time user experience

**Tasks:**

- [ ] **10.1** Create onboarding screen 1: Welcome
- [ ] **10.2** Create onboarding screen 2: How It Works
- [ ] **10.3** Create onboarding screen 3: Features
- [ ] **10.4** Create onboarding screen 4: Get Started
- [ ] **10.5** Implement onboarding navigation
- [ ] **10.6** Track onboarding completion

**Dependencies:** EPIC 1

---

### EPIC 11: Analytics & Value Tracking ⏳

> **Goal**: Track collection value over time (Premium feature)

**Tasks:**

- [ ] **11.1** Create collection analytics screen
- [ ] **11.2** Implement value history tracking
- [ ] **11.3** Build statistics dashboard
- [ ] **11.4** Create export functionality (Pro)
- [ ] **11.5** Build insights and suggestions

**Dependencies:** EPIC 5, EPIC 8

---

### EPIC 12: Social & Sharing ⏳

> **Goal**: Share collection and connect with collectors

**Tasks:**

- [ ] **12.1** Create share stamp feature
- [ ] **12.2** Build public collection view
- [ ] **12.3** Create stamp detail share card
- [ ] **12.4** Implement collection privacy settings

**Dependencies:** EPIC 5, EPIC 6

---

### EPIC 13: Polish & Performance ⏳

> **Goal**: Production-ready quality and performance

**Tasks:**

- [ ] **13.1** Implement offline support
- [ ] **13.2** Optimize image loading
- [ ] **13.3** Add pull-to-refresh everywhere
- [ ] **13.4** Implement skeleton loading
- [ ] **13.5** Add haptic feedback
- [ ] **13.6** Performance optimization
- [ ] **13.7** Error handling polish
- [ ] **13.8** Accessibility audit

**Dependencies:** All previous EPICs

---

## Success Metrics

### Key Performance Indicators (KPIs)

| Metric | Target (Month 1) | Target (Month 6) |
|--------|------------------|------------------|
| Downloads | 1,000 | 50,000 |
| Daily Active Users | 100 | 5,000 |
| Scans per User | 3/week | 5/week |
| Conversion to Premium | 2% | 5% |
| App Store Rating | 4.0+ | 4.5+ |
| Retention (Day 7) | 20% | 35% |

### User Experience Metrics

| Metric | Target |
|--------|--------|
| Scan to Result Time | < 5 seconds |
| AI Accuracy (common stamps) | > 85% |
| Crash-free Sessions | > 99% |
| Cold Start Time | < 2 seconds |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-11-25 | AI Assistant | Initial PRD |
| 1.1 | 2024-11-26 | AI Assistant | Renamed to StampID, updated colors to forest+cream |
| 1.2 | 2024-11-26 | AI Assistant | Marked completed epics, added multi-stamp detection |

---

**Next Steps:**
1. Complete EPIC 5: Collection Management (hooks, screens)
2. Implement EPIC 6: Stamp Detail & Editing
3. Build EPIC 8: Subscription & Paywall
