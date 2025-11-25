# StampSnap - Product Requirements Document

> AI-Powered Stamp Collection & Marketplace App

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

**StampSnap** is a mobile app that lets stamp collectors:
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

### Tech Stack (Already Set Up)

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Expo 54 + React Native 0.81 | Cross-platform mobile |
| **Styling** | NativeWind (TailwindCSS) | Consistent design system |
| **Backend** | Supabase | Auth, Database, Storage |
| **Payments** | RevenueCat | Subscriptions |
| **State** | React Query + Zustand | Server + Client state |
| **Animations** | Reanimated | Smooth 60fps animations |
| **Design** | Glassmorphic UI System | Modern, premium feel |

### New Tech Required

| Technology | Purpose | Integration |
|------------|---------|-------------|
| **expo-camera** | Photo capture | Stamp scanning |
| **expo-image-picker** | Gallery access | Upload existing photos |
| **OpenAI Vision API** or **Google Cloud Vision** | AI identification | Stamp recognition |
| **Supabase Edge Functions** | AI processing | Secure API calls |
| **expo-file-system** | Local caching | Offline collection |

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
│                        SUPABASE                             │
│  ┌──────────────┐  ┌───────┴───────┐  ┌──────────────────┐ │
│  │     Auth     │  │   Database    │  │     Storage      │ │
│  │  (Users)     │  │  (Stamps,     │  │  (Images)        │ │
│  │              │  │   Collections)│  │                  │ │
│  └──────────────┘  └───────────────┘  └──────────────────┘ │
│                            │                                │
│  ┌─────────────────────────┴─────────────────────────────┐ │
│  │              Edge Functions (AI Processing)            │ │
│  └─────────────────────────┬─────────────────────────────┘ │
└─────────────────────────────┼───────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────┐
│                      AI SERVICES                            │
│  ┌──────────────────────────┴────────────────────────────┐ │
│  │         OpenAI Vision API / Google Cloud Vision        │ │
│  │         (Stamp Recognition & Value Estimation)         │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Data Models

```typescript
// Core Models

interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'premium' | 'pro';
  created_at: Date;
}

interface Stamp {
  id: string;
  user_id: string;

  // Identification
  name: string;
  country: string;
  year_issued: number;
  catalog_number?: string; // Scott/Stanley Gibbons number
  denomination: string;

  // Classification
  category: 'definitive' | 'commemorative' | 'airmail' | 'special' | 'other';
  theme?: string; // wildlife, historical, sports, etc.

  // Condition & Value
  condition: 'mint' | 'mint_hinged' | 'used' | 'damaged';
  condition_notes?: string;
  estimated_value_low: number;
  estimated_value_high: number;
  currency: string;

  // Images
  image_url: string;
  thumbnail_url: string;

  // AI Data
  ai_confidence: number; // 0-100
  ai_raw_response?: object;

  // Metadata
  notes?: string;
  is_favorite: boolean;
  created_at: Date;
  updated_at: Date;
}

interface Collection {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  cover_image_url?: string;
  stamp_count: number;
  total_value_estimate: number;
  is_public: boolean;
  created_at: Date;
}

interface StampCollection {
  stamp_id: string;
  collection_id: string;
  added_at: Date;
}

interface ScanHistory {
  id: string;
  user_id: string;
  image_url: string;
  result: object;
  was_saved: boolean;
  created_at: Date;
}
```

### Monetization Model

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | 5 scans/month, 50 stamps in collection |
| **Premium** | $4.99/mo or $29.99/yr | Unlimited scans, unlimited collection, value tracking |
| **Pro** | $9.99/mo or $59.99/yr | Everything + export, advanced analytics, priority support |

---

## Epics & Micro Tasks

### Overview

| Epic | Name | Priority | Complexity | Status |
|------|------|----------|------------|--------|
| 0 | Foundation (Existing) | - | - | ✅ Done |
| 1 | Project Setup & Branding | P0 | Low | ⏳ Pending |
| 2 | Authentication Flow | P0 | Medium | ⏳ Pending |
| 3 | Camera & Image Capture | P0 | Medium | ⏳ Pending |
| 4 | AI Stamp Identification | P0 | High | ⏳ Pending |
| 5 | Collection Management | P0 | High | ⏳ Pending |
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

### EPIC 1: Project Setup & Branding

> **Goal**: Transform starter template into StampSnap brand

**Tasks:**

- [ ] **1.1** Update app.json with StampSnap branding
  - App name, slug, scheme
  - Bundle identifiers (iOS/Android)
  - Splash screen configuration

- [ ] **1.2** Create/add app icons
  - iOS icon (1024x1024)
  - Android adaptive icon
  - Favicon for web

- [ ] **1.3** Design and implement splash screen
  - StampSnap logo
  - Brand colors
  - Loading animation

- [ ] **1.4** Update color scheme in tailwind.config.js
  - Primary: Stamp-themed colors (deep blue, gold accents)
  - Semantic colors (success, warning, error)
  - Dark mode variants

- [ ] **1.5** Create app-wide constants
  - API endpoints
  - Feature flags
  - Limit constants (free tier limits, etc.)

- [ ] **1.6** Set up environment configuration
  - .env.local template
  - Environment-specific configs
  - Supabase keys placeholder

**Acceptance Criteria:**
- App displays "StampSnap" branding throughout
- Icons and splash screen match brand identity
- Color scheme is consistent and cohesive
- Environment config is properly structured

---

### EPIC 2: Authentication Flow

> **Goal**: Complete user authentication with Supabase

**Tasks:**

- [ ] **2.1** Create sign-in screen
  - Email/password form with validation
  - "Forgot password" link
  - "Sign up" link
  - Social login buttons (Apple, Google) - UI only initially

- [ ] **2.2** Create sign-up screen
  - Email/password with confirmation
  - Display name field
  - Terms of service checkbox
  - Real-time validation feedback

- [ ] **2.3** Create forgot password screen
  - Email input
  - Success confirmation state
  - "Back to sign in" link

- [ ] **2.4** Implement useAuth hook
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
- Users can sign up with email/password
- Users can sign in with existing account
- Users can reset password via email
- Auth state persists across app restarts
- Protected routes redirect appropriately

**Dependencies:** EPIC 1

---

### EPIC 3: Camera & Image Capture

> **Goal**: Capture stamp images for AI identification

**Tasks:**

- [ ] **3.1** Install and configure expo-camera
  - Camera permissions handling
  - iOS/Android configuration

- [ ] **3.2** Create camera screen
  - Full-screen camera preview
  - Capture button
  - Flash toggle
  - Camera flip (front/back)
  - Close/cancel button

- [ ] **3.3** Create image preview screen
  - Display captured image
  - Retake button
  - Use this photo button
  - Crop/rotate basic controls

- [ ] **3.4** Implement gallery picker
  - expo-image-picker integration
  - Select from photo library
  - Multiple image selection (for batch scanning - premium)

- [ ] **3.5** Create scan entry point component
  - Floating action button on home screen
  - Bottom sheet with camera/gallery options
  - Scan history quick access

- [ ] **3.6** Image optimization utility
  - Resize images for upload
  - Compress to reduce bandwidth
  - Generate thumbnails
  - Maintain aspect ratio

**Acceptance Criteria:**
- Camera opens with proper permissions
- Photos can be captured and previewed
- Images can be selected from gallery
- Images are optimized before upload
- Works on iOS, Android, and web (file picker fallback)

**Dependencies:** EPIC 1, EPIC 2 (for saving)

---

### EPIC 4: AI Stamp Identification

> **Goal**: Identify stamps from photos using AI

**Tasks:**

- [ ] **4.1** Set up Supabase Edge Function for AI
  - Create edge function project
  - Configure secrets (API keys)
  - Set up CORS and authentication

- [ ] **4.2** Implement OpenAI Vision integration
  - Craft stamp identification prompt
  - Parse structured response
  - Handle API errors gracefully
  - Rate limiting logic

- [ ] **4.3** Create stamp identification prompt engineering
  - Extract: country, year, catalog number, denomination
  - Extract: condition assessment
  - Extract: value estimate range
  - Extract: historical context/description
  - Confidence scoring

- [ ] **4.4** Build identification results screen
  - Display identified stamp details
  - Confidence indicator
  - Value estimate range
  - "Save to collection" button
  - "Scan another" button
  - Edit/correct details option

- [ ] **4.5** Create useStampIdentification hook
  - Upload image to Supabase Storage
  - Call edge function
  - Handle loading/error states
  - Cache results

- [ ] **4.6** Implement scan limits (free tier)
  - Track scans per user per month
  - Show remaining scans
  - Upgrade prompt when limit reached

- [ ] **4.7** Create identification history
  - Store all scan attempts
  - View past scans
  - Re-save unsaved scans

**Acceptance Criteria:**
- AI identifies stamp with >80% accuracy on common stamps
- Results display within 5-10 seconds
- Free users limited to 5 scans/month
- Scan history is preserved
- Errors handled gracefully with retry option

**Dependencies:** EPIC 3

---

### EPIC 5: Collection Management

> **Goal**: Organize stamps into digital collections

**Tasks:**

- [ ] **5.1** Set up Supabase database schema
  - Create stamps table
  - Create collections table
  - Create stamp_collections junction table
  - Create scan_history table
  - Set up Row Level Security (RLS)

- [ ] **5.2** Create collection list screen
  - Grid/list view of collections
  - Collection card with cover image, name, count
  - "Create collection" button
  - Sort options (name, date, value)

- [ ] **5.3** Create collection detail screen
  - Collection header with stats
  - Stamp grid within collection
  - Edit collection button
  - Add stamps button
  - Total value display

- [ ] **5.4** Create "My Stamps" screen (all stamps)
  - Full stamp grid/list
  - Filter by collection
  - Filter by country/year/value
  - Search functionality
  - Bulk select mode

- [ ] **5.5** Implement create/edit collection modal
  - Collection name input
  - Description textarea
  - Cover image selection
  - Public/private toggle

- [ ] **5.6** Create stamp grid component
  - Thumbnail display
  - Value badge
  - Favorite indicator
  - Selection checkbox (bulk mode)
  - Empty state

- [ ] **5.7** Implement useCollection hooks
  - useCollections (list all)
  - useCollection (single with stamps)
  - useCreateCollection
  - useUpdateCollection
  - useDeleteCollection
  - useAddStampToCollection
  - useRemoveStampFromCollection

- [ ] **5.8** Implement useStamps hooks
  - useStamps (all user stamps)
  - useStamp (single stamp)
  - useCreateStamp (from AI result)
  - useUpdateStamp
  - useDeleteStamp
  - useFavoriteStamp

**Acceptance Criteria:**
- Users can create multiple collections
- Stamps can belong to multiple collections
- Collection total value auto-calculates
- Grid displays thumbnails performantly
- RLS ensures users only see their data

**Dependencies:** EPIC 4

---

### EPIC 6: Stamp Detail & Editing

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

### EPIC 7: Search & Filtering

> **Goal**: Find stamps quickly in large collections

**Tasks:**

- [ ] **7.1** Create search bar component
  - Text input with search icon
  - Clear button
  - Recent searches (local storage)
  - Search suggestions

- [ ] **7.2** Implement full-text search
  - Search by name, country, catalog number
  - Supabase full-text search setup
  - Debounced search

- [ ] **7.3** Create filter panel
  - Country filter (multi-select)
  - Year range filter
  - Value range filter
  - Condition filter
  - Category filter
  - Collection filter

- [ ] **7.4** Build sort options
  - Sort by date added
  - Sort by value (high/low)
  - Sort by year
  - Sort by country
  - Sort by name

- [ ] **7.5** Implement filter chips display
  - Active filters shown as chips
  - Tap to remove filter
  - "Clear all" option

- [ ] **7.6** Create advanced search screen
  - Combined search + all filters
  - Save search as preset
  - Search within results

**Acceptance Criteria:**
- Search finds stamps within 500ms
- Multiple filters can be combined
- Active filters are clearly visible
- Sort persists across sessions
- Empty search state is helpful

**Dependencies:** EPIC 5

---

### EPIC 8: Subscription & Paywall

> **Goal**: Monetize with RevenueCat subscriptions

**Tasks:**

- [ ] **8.1** Configure RevenueCat products
  - Set up offerings in RevenueCat dashboard
  - Premium monthly/yearly
  - Pro monthly/yearly
  - Configure entitlements

- [ ] **8.2** Implement useSubscription hook
  - Get current subscription status
  - Get available packages
  - Purchase subscription
  - Restore purchases
  - Listen for subscription changes

- [ ] **8.3** Create paywall screen
  - Feature comparison table
  - Pricing display
  - Purchase buttons
  - Restore purchases link
  - Terms and privacy links
  - RevenueCat PaywallView integration

- [ ] **8.4** Implement feature gating
  - Check subscription before premium features
  - Scan limit enforcement
  - Collection size limit (free)
  - Export feature (pro only)

- [ ] **8.5** Create upgrade prompts
  - Contextual upgrade modals
  - "You've used 5/5 scans" prompt
  - Feature teaser with upgrade CTA

- [ ] **8.6** Build subscription management screen
  - Current plan display
  - Next billing date
  - Cancel subscription link (to app store)
  - Upgrade/downgrade options
  - Receipt history

**Acceptance Criteria:**
- Subscriptions can be purchased on iOS/Android
- Subscription status syncs across devices
- Free tier limits are enforced
- Restore purchases works correctly
- Upgrade prompts are non-intrusive but effective

**Dependencies:** EPIC 4, EPIC 5

---

### EPIC 9: User Profile & Settings

> **Goal**: User account management and app preferences

**Tasks:**

- [ ] **9.1** Create profile screen
  - Avatar display/edit
  - Display name
  - Email (read-only)
  - Member since date
  - Subscription status
  - Collection stats summary

- [ ] **9.2** Implement avatar upload
  - Image picker for avatar
  - Crop to square
  - Upload to Supabase Storage
  - Update profile

- [ ] **9.3** Create settings screen
  - Appearance (theme toggle)
  - Notifications preferences
  - Currency preference
  - Default collection
  - Privacy settings

- [ ] **9.4** Build account section
  - Change password
  - Delete account
  - Export my data
  - Sign out

- [ ] **9.5** Implement settings persistence
  - Zustand store for settings
  - AsyncStorage persistence
  - Sync to Supabase (cloud backup)

- [ ] **9.6** Create about/help section
  - App version
  - Terms of service
  - Privacy policy
  - Contact support
  - Rate the app link
  - Social media links

**Acceptance Criteria:**
- Users can update their profile
- Avatar uploads work correctly
- Settings persist across sessions
- Account deletion properly cleans up data
- Legal links are accessible

**Dependencies:** EPIC 2

---

### EPIC 10: Onboarding Flow

> **Goal**: First-time user experience

**Tasks:**

- [ ] **10.1** Create onboarding screen 1: Welcome
  - App logo and name
  - Tagline: "Your stamps, identified & organized"
  - Get started button
  - Skip option

- [ ] **10.2** Create onboarding screen 2: How It Works
  - Step 1: Take a photo
  - Step 2: AI identifies your stamp
  - Step 3: Build your collection
  - Animated illustrations

- [ ] **10.3** Create onboarding screen 3: Features
  - Instant identification
  - Value estimation
  - Digital collection
  - Animation showcasing features

- [ ] **10.4** Create onboarding screen 4: Get Started
  - Free tier explanation
  - Premium teaser
  - Sign up CTA
  - Continue as guest option

- [ ] **10.5** Implement onboarding navigation
  - Horizontal swipe between screens
  - Pagination dots
  - Skip button on all screens
  - Animated transitions

- [ ] **10.6** Track onboarding completion
  - Store completion in AsyncStorage
  - Only show once per install
  - Option to replay from settings

**Acceptance Criteria:**
- Onboarding shows on first launch only
- Smooth transitions between screens
- Skip option available
- Completion prevents re-showing
- Sets positive first impression

**Dependencies:** EPIC 1

---

### EPIC 11: Analytics & Value Tracking

> **Goal**: Track collection value over time (Premium feature)

**Tasks:**

- [ ] **11.1** Create collection analytics screen
  - Total collection value
  - Value by country chart
  - Value by decade chart
  - Growth over time (if applicable)

- [ ] **11.2** Implement value history tracking
  - Store value snapshots periodically
  - Track user-edited values
  - Calculate collection value changes

- [ ] **11.3** Build statistics dashboard
  - Total stamps count
  - Countries represented
  - Oldest/newest stamp
  - Most valuable stamp
  - Average stamp value

- [ ] **11.4** Create export functionality (Pro)
  - Export to CSV
  - Export to PDF
  - Export to JSON
  - Include images option

- [ ] **11.5** Build insights and suggestions
  - Collection gaps
  - "You might like" recommendations
  - Value alerts (significant changes)

**Acceptance Criteria:**
- Dashboard loads quickly with cached data
- Charts are interactive and readable
- Export generates valid files
- Premium features properly gated

**Dependencies:** EPIC 5, EPIC 8

---

### EPIC 12: Social & Sharing

> **Goal**: Share collection and connect with collectors

**Tasks:**

- [ ] **12.1** Create share stamp feature
  - Generate shareable image
  - Share to social media
  - Copy link to clipboard
  - Native share sheet

- [ ] **12.2** Build public collection view
  - Public URL for collections
  - Read-only view for non-owners
  - Collection owner info
  - Web-accessible link

- [ ] **12.3** Create stamp detail share card
  - Branded share image
  - Stamp photo + details
  - App download CTA
  - QR code to view in app

- [ ] **12.4** Implement collection privacy settings
  - Public/private toggle
  - Who can view options
  - Share settings per collection

**Acceptance Criteria:**
- Stamps can be shared to major platforms
- Public collections are web-accessible
- Share cards are visually appealing
- Privacy settings are respected

**Dependencies:** EPIC 5, EPIC 6

---

### EPIC 13: Polish & Performance

> **Goal**: Production-ready quality and performance

**Tasks:**

- [ ] **13.1** Implement offline support
  - Cache stamps locally
  - Queue actions when offline
  - Sync when back online
  - Offline indicator

- [ ] **13.2** Optimize image loading
  - Progressive image loading
  - Placeholder blur hash
  - Image caching
  - Lazy loading for grids

- [ ] **13.3** Add pull-to-refresh everywhere
  - Collection lists
  - Stamp grids
  - Profile screen
  - Consistent animation

- [ ] **13.4** Implement skeleton loading
  - Stamp grid skeletons
  - Detail screen skeletons
  - Profile skeletons
  - Use existing GlassSkeleton component

- [ ] **13.5** Add haptic feedback
  - Button presses
  - Successful actions
  - Errors
  - Pull to refresh

- [ ] **13.6** Performance optimization
  - React.memo where needed
  - FlatList optimization
  - Reduce re-renders
  - Bundle size analysis

- [ ] **13.7** Error handling polish
  - Consistent error messages
  - Retry options everywhere
  - Error tracking (optional: Sentry)
  - Graceful degradation

- [ ] **13.8** Accessibility audit
  - Screen reader labels
  - Touch target sizes
  - Color contrast
  - Font scaling support

**Acceptance Criteria:**
- App feels fast and responsive
- Offline mode works for viewing
- Loading states are smooth
- No accessibility violations
- Error messages are helpful

**Dependencies:** All previous EPICs

---

## Technical Architecture

### Folder Structure

```
app/
├── _layout.tsx                    # Root layout
├── (auth)/
│   ├── _layout.tsx
│   ├── sign-in.tsx
│   ├── sign-up.tsx
│   └── forgot-password.tsx
├── (tabs)/
│   ├── _layout.tsx
│   ├── index.tsx                  # Home / Recent scans
│   ├── collection.tsx             # My collections
│   ├── scan.tsx                   # Camera entry point
│   └── profile.tsx                # Profile & settings
├── (onboarding)/
│   ├── _layout.tsx
│   └── [...index].tsx             # Onboarding screens
├── stamp/
│   └── [id].tsx                   # Stamp detail
├── collection/
│   └── [id].tsx                   # Collection detail
├── camera.tsx                     # Full-screen camera
├── scan-result.tsx                # AI identification result
├── subscription.tsx               # Paywall
└── settings.tsx                   # Full settings page

components/
├── ui/
│   └── glass/                     # Existing glass components
├── stamps/
│   ├── StampCard.tsx
│   ├── StampGrid.tsx
│   ├── StampDetail.tsx
│   └── ConditionSelector.tsx
├── collections/
│   ├── CollectionCard.tsx
│   ├── CollectionGrid.tsx
│   └── CollectionHeader.tsx
├── camera/
│   ├── CameraView.tsx
│   ├── CaptureButton.tsx
│   └── ImagePreview.tsx
├── scan/
│   ├── ScanButton.tsx
│   ├── ScanResult.tsx
│   └── ScanHistory.tsx
└── profile/
    ├── ProfileHeader.tsx
    ├── StatsSummary.tsx
    └── SettingsSection.tsx

lib/
├── supabase/
│   ├── client.ts                  # Existing
│   ├── types.ts                   # Generated types
│   └── storage.ts                 # Storage helpers
├── hooks/
│   ├── useAuth.ts                 # Auth hook
│   ├── useSubscription.ts         # RevenueCat hook
│   ├── useStamps.ts               # Stamp CRUD
│   ├── useCollections.ts          # Collection CRUD
│   ├── useStampIdentification.ts  # AI identification
│   └── useCamera.ts               # Camera utilities
├── store/
│   ├── appStore.ts                # App-wide state
│   └── settingsStore.ts           # Settings state
├── utils/
│   ├── format.ts                  # Existing
│   ├── image.ts                   # Image processing
│   ├── validation.ts              # Form validation
│   └── constants.ts               # App constants
└── animations/
    └── presets.ts                 # Existing

supabase/
├── migrations/
│   └── 001_initial_schema.sql
└── functions/
    └── identify-stamp/
        └── index.ts               # AI edge function
```

### Database Schema (Supabase)

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free',
  scan_count_this_month INTEGER DEFAULT 0,
  scan_reset_date TIMESTAMP WITH TIME ZONE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stamps table
CREATE TABLE public.stamps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Identification
  name TEXT NOT NULL,
  country TEXT,
  year_issued INTEGER,
  catalog_number TEXT,
  denomination TEXT,

  -- Classification
  category TEXT,
  theme TEXT,

  -- Condition & Value
  condition TEXT,
  condition_notes TEXT,
  estimated_value_low DECIMAL(10,2),
  estimated_value_high DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',

  -- Images
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,

  -- AI Data
  ai_confidence DECIMAL(5,2),
  ai_raw_response JSONB,

  -- Metadata
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collections table
CREATE TABLE public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table for stamps in collections
CREATE TABLE public.stamp_collections (
  stamp_id UUID REFERENCES public.stamps(id) ON DELETE CASCADE,
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (stamp_id, collection_id)
);

-- Scan history
CREATE TABLE public.scan_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  result JSONB,
  was_saved BOOLEAN DEFAULT FALSE,
  stamp_id UUID REFERENCES public.stamps(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stamp_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

-- Policies (users can only access their own data)
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view own stamps"
  ON public.stamps FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stamps"
  ON public.stamps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stamps"
  ON public.stamps FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stamps"
  ON public.stamps FOR DELETE
  USING (auth.uid() = user_id);

-- Similar policies for collections, stamp_collections, scan_history...
```

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

## Appendix

### Reference Apps for Inspiration

1. **CoinSnap** - UI/UX benchmark, monetization model
2. **Colnect** - Database comprehensiveness
3. **StampWorld** - Community features
4. **Delcampe** - Marketplace mechanics

### Useful APIs & Resources

- [UPU WNS Database](https://www.upu.int) - Official stamp database
- [Colnect API](https://colnect.com) - Stamp catalog data
- [OpenAI Vision API](https://platform.openai.com/docs/guides/vision) - Image recognition
- [Google Cloud Vision](https://cloud.google.com/vision) - Alternative AI

### Design Resources

- [Dribbble - Stamp App Designs](https://dribbble.com/search/stamp-collection-app)
- [Behance - Philately Apps](https://www.behance.net/search/projects?search=philately%20app)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-11-25 | AI Assistant | Initial PRD |

---

**Next Step:** Begin EPIC 1 - Project Setup & Branding
