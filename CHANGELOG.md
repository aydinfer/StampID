# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-17

### Added - Production Ready Release 🎉

#### Foundation & Utilities (EPIC 1)

- Animation presets using react-native-reanimated (fadeIn, slideIn, scale, bounce)
- ErrorBoundary component with retry functionality
- Comprehensive format utilities (currency, date, phone, numbers, time ago)
- Validation utilities (email, password, name, phone, username, URL, credit card)

#### Glassmorphic UI Components (EPIC 2)

- **13 Glass Components** with expo-blur:
  - GlassCard (3 variants: default, premium, subtle)
  - GlassButton (loading states, 3 variants, 3 sizes)
  - GlassInput (floating labels, error states)
  - GlassModal (full-screen animated modals)
  - GlassSwitch (animated toggles)
  - GlassSegmentedControl (tab selectors)
  - GlassSheet (draggable bottom sheets)
  - GlassAvatar (initials fallback, sizes, groups)
  - GlassBadge (notification counts, status indicators, variants)
  - GlassSkeleton (shimmer loading states, predefined layouts)
  - GlassEmptyState (templates for various scenarios)
  - GlassLoadingSpinner (full-screen and inline variants)

#### Authentication System (EPIC 3)

- **Sign-in screen** with email/password and social login buttons
- **Sign-up screen** with real-time validation and password strength indicator
- **Forgot password screen** with email confirmation flow
- **Enhanced useAuth hook** with:
  - signIn, signUp, signOut functions
  - updatePassword, updateProfile functions
  - signInWithProvider (OAuth support for Google, Apple)
  - refreshSession functionality
  - Complete TypeScript types

#### Onboarding Flow (EPIC 4)

- **Swipeable 3-screen carousel** (Welcome, Features, Get Started)
- Horizontal FlatList with pagination and smooth transitions
- Skip button accessible on all screens
- **useOnboarding hook** for AsyncStorage persistence
- **Smart routing (app/index.tsx)**: onboarding → auth → app
- Animated entrance with Reanimated (FadeInDown, FadeInUp)
- Pagination dots with active state indicator

#### Subscription & Monetization (EPIC 5)

- **Enhanced useSubscription hook** with complete RevenueCat integration:
  - purchasePackage, restorePurchases functions
  - refreshCustomerInfo, manageSubscription functions
  - getSubscriptionStatus with detailed info
  - hasActiveSubscription and isPro flags
  - Debug logging enabled in development
- **Subscription management screen**:
  - View current plan and status
  - Renewal/expiration dates
  - Manage subscription (links to App Store/Play Store)
  - Restore purchases functionality
  - Upgrade to Pro CTA for free users
  - Pro features list showcase

#### Core Application Screens (EPIC 6)

- **Production Settings screen** with TypeScript interfaces:
  - Account section (email, profile, subscription links)
  - Notifications toggles (push, email)
  - Dark mode toggle (Zustand theme integration)
  - Reset onboarding functionality
  - Clear cache with AsyncStorage
  - Sign out with confirmation dialog
  - Support links (help, privacy, terms)
- **Profile screen** with view and edit modes:
  - Display name, phone, bio fields
  - Form validation (validateName, validatePhone)
  - Save to Supabase via updateProfile()
  - GlassAvatar with initials generation
  - Account details (email, user ID, created date)
- **Notifications screen**:
  - TypeScript Notification interface
  - Mock data (ready for React Query integration)
  - Type badges (info, success, warning, error)
  - Read/unread status tracking
  - Mark as read and mark all as read functionality
  - Pull to refresh
  - Time ago formatting
  - Empty state handling

#### Technical Stack

- **Expo SDK 54** with React 19.1.0
- **NativeWind v4** for Tailwind CSS styling
- **expo-blur** for native blur effects
- **react-native-reanimated** for 60fps animations
- **Supabase** for authentication and database
- **RevenueCat** for in-app purchases
- **React Query** for server state management
- **Zustand** for client state management
- **TypeScript strict mode** throughout

#### Developer Experience

- Path aliases (`@/*` imports)
- Comprehensive documentation (17 docs files)
- Component demo screen
- Error boundaries
- Hot reload with Fast Refresh
- Type-safe routing with Expo Router

### Documentation

- Complete setup guides (installation, project structure, design system)
- Component API reference
- Glassmorphism guide
- Supabase and RevenueCat setup guides
- State management patterns
- Routing examples
- Troubleshooting guide
- Best practices
- CLAUDE.md for AI assistant guidance

### Notes

- **Installation requires `--legacy-peer-deps`** due to React 19.1.0
- Glassmorphic components limit BlurView to 2-3 per screen for performance
- RevenueCat PaywallView should be used for paywall UI (not custom built)
- All components use proper TypeScript types
- Social login prepared but requires Supabase OAuth configuration

---

## [Unreleased]

### Planned

- Image upload functionality for profile avatars
- Real-time notifications with Supabase subscriptions
- Dark mode full implementation
- Analytics integration (optional)
- Push notifications setup guide

---

## Versioning

- **Major version (X.0.0)**: Breaking changes
- **Minor version (0.X.0)**: New features, backwards compatible
- **Patch version (0.0.X)**: Bug fixes

---

**Last Updated**: 2025-11-17
