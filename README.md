# Expo Starter - Production Ready Template

A production-ready Expo starter template with **glassmorphic UI design system**. Built with official Expo packages, React 19, and best practices.

## ✨ Features

### Core Stack

- ✅ **Expo SDK 54** - Latest version with React 19.1.0
- ✅ **Glassmorphic UI** - 13 custom glass components
- ✅ **NativeWind v4** - Tailwind CSS for React Native
- ✅ **Expo Router** - File-based routing like Next.js
- ✅ **React Native Reanimated** - 60fps animations
- ✅ **expo-blur** - Native blur effects for glass aesthetic
- ✅ **TypeScript** - Strict mode with full type safety

### Backend & Monetization

- ✅ **Supabase** - Authentication, database, and storage
- ✅ **RevenueCat** - In-app purchases and subscriptions
- ✅ **React Query** - Server state management
- ✅ **Zustand** - Client state management

### 13 Glass Components Included

1. **GlassCard** - Glassmorphic containers with 3 variants
2. **GlassButton** - Interactive buttons with loading states
3. **GlassInput** - Form inputs with floating labels
4. **GlassModal** - Full-screen modal dialogs
5. **GlassSwitch** - Animated toggle switches
6. **GlassSegmentedControl** - Tab selectors
7. **GlassSheet** - Draggable bottom sheets
8. **GlassAvatar** - Avatar with initials fallback and groups
9. **GlassBadge** - Notification badges with variants
10. **GlassSkeleton** - Shimmer loading states
11. **GlassEmptyState** - Empty state templates
12. **GlassLoadingSpinner** - Full-screen and inline loaders

## 🎯 Choose Your Variant

This template comes in **3 flavors** to suit different app requirements:

### ✅ **Full Stack** (Default - What You Cloned)

**Best for:** Most production apps, SaaS, social apps, multi-device apps

**Includes:**

- ✅ Supabase authentication & database
- ✅ RevenueCat subscriptions
- ✅ Multi-device sync
- ✅ Cloud storage

**Setup time:** 1-2 days

---

### ⚡ **Anonymous** (Simplest)

**Best for:** Games, utilities, tools, content apps that don't need user accounts

**Includes:**

- ✅ RevenueCat subscriptions (works without auth!)
- ✅ All 13 glass components
- ❌ No login/signup
- ❌ No cloud storage

**Pros:** Fastest to ship, no backend configuration, still fully monetizable

**Setup time:** < 1 day

📖 **[Anonymous Setup Guide](./docs/variants/ANONYMOUS.md)**

---

### 🔒 **Local Auth** (Privacy-First)

**Best for:** Privacy-focused apps, offline-first apps, regulated industries

**Includes:**

- ✅ RevenueCat subscriptions
- ✅ Local authentication (encrypted with SecureStore)
- ✅ SQLite database (all data on-device)
- ❌ No cloud sync

**Pros:** Maximum privacy, 100% offline, no backend costs, still fully monetizable

**Setup time:** 2-3 days

📖 **[Local Auth Setup Guide](./docs/variants/LOCAL_AUTH.md)**

---

**📊 [Complete Variant Comparison & Decision Guide](./docs/VARIANTS.md)**

## ⚠️ CRITICAL: Installation

This project uses **React 19.1.0** (required by Expo SDK 54). You **MUST** use `--legacy-peer-deps`:

```bash
# Clone the repository
git clone <repo-url>
cd Expo-Starter

# Install dependencies (CRITICAL: use --legacy-peer-deps)
npm install --legacy-peer-deps

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase and RevenueCat keys

# Start development server
npx expo start
```

**Why --legacy-peer-deps?**

- Expo 54 requires React 19.1.0 specifically
- React ecosystem is catching up to React 19
- Some packages show peer warnings but work correctly
- **NEVER downgrade to React 18** - it will break Expo 54

See [docs/13-troubleshooting.md](./docs/13-troubleshooting.md) for detailed installation troubleshooting.

Then press:

- `i` for iOS Simulator
- `a` for Android Emulator
- Scan QR code with Expo Go app

## 📱 What's Included

### Complete Authentication System

- ✅ **Sign-in screen** - Email/password + social login buttons
- ✅ **Sign-up screen** - Real-time validation with password strength indicator
- ✅ **Forgot password screen** - Email-based password reset flow
- ✅ **Protected routes** - Automatic redirection based on auth state
- ✅ **Session persistence** - AsyncStorage integration
- ✅ **Social login ready** - Google and Apple (requires OAuth config)
- ✅ **useAuth hook** - Complete Supabase integration with TypeScript

### Onboarding Flow

- ✅ **3-screen swipeable carousel** - Welcome, Features, Get Started
- ✅ **Pagination dots** - Active state indicators
- ✅ **Skip functionality** - Available on all screens
- ✅ **AsyncStorage tracking** - Only shows once per install
- ✅ **Animated entrance** - Smooth Reanimated animations
- ✅ **Smart routing** - Onboarding → Auth → App flow

### Subscription & Monetization

- ✅ **RevenueCat integration** - Complete subscription management
- ✅ **Subscription screen** - View plan, renewal dates, manage subscription
- ✅ **Restore purchases** - Cross-device subscription restoration
- ✅ **Entitlement checking** - isPro, hasActiveSubscription flags
- ✅ **App Store/Play Store links** - Direct to subscription management
- ✅ **useSubscription hook** - Full RevenueCat SDK integration

### Core Application Screens

- ✅ **Settings screen** - Account, notifications, preferences, app info
  - Dark mode toggle (Zustand integration)
  - Push and email notification toggles
  - Reset onboarding and clear cache
  - Sign out with confirmation
  - Support links (help, privacy, terms)
- ✅ **Profile screen** - View and edit user profile
  - Display name, phone, bio fields
  - Form validation with real-time feedback
  - Save to Supabase
  - Avatar with initials generation
  - Account details display
- ✅ **Notifications screen** - User notifications list
  - Type badges (info, success, warning, error)
  - Read/unread status tracking
  - Mark as read functionality
  - Pull to refresh
  - Empty state handling

### Design System

- ✅ **NativeWind integration** - Tailwind CSS for React Native
- ✅ **Design tokens** - All colors in tailwind.config.js
- ✅ **Dark mode support** - Ready for full implementation
- ✅ **Responsive utilities** - Mobile-first approach
- ✅ **Custom color palette** - Primary, success, warning, error scales

### Data Management

- ✅ **React Query** - Server state with automatic caching
- ✅ **Zustand** - Client state (theme, preferences)
- ✅ **AsyncStorage** - Persistent local storage
- ✅ **Example CRUD** - Ready-to-use patterns
- ✅ **Real-time ready** - Supabase subscriptions setup

### Developer Experience

- ✅ **TypeScript strict mode** - Full type safety
- ✅ **Path aliases** - `@/` imports throughout
- ✅ **Hot reload** - Fast Refresh enabled
- ✅ **Type-safe routing** - Expo Router integration
- ✅ **Error boundaries** - Graceful error handling
- ✅ **Comprehensive docs** - 17 documentation files
- ✅ **Component demos** - Interactive showcase screen

## 📚 Documentation

**[Complete Documentation](./docs/README.md)**

### Quick Links

- [Getting Started](./docs/01-getting-started.md) - Installation and setup
- [**Template Variants**](./docs/VARIANTS.md) - Choose Full Stack, Anonymous, or Local Auth
- [Project Structure](./docs/02-project-structure.md) - Understanding the codebase
- [Design System](./docs/03-design-system.md) - Customizing theme and colors
- [Components](./docs/04-components.md) - Component API reference
- [Animations](./docs/05-animations.md) - Animation patterns
- [Glassmorphism](./docs/06-glassmorphism.md) - Glass UI guide
- [Supabase Setup](./docs/06-supabase-setup.md) - Authentication and database
- [RevenueCat Setup](./docs/07-revenuecat-setup.md) - In-app purchases
- [State Management](./docs/08-state-management.md) - React Query + Zustand
- [Routing](./docs/09-routing.md) - Expo Router guide
- [Deployment](./docs/10-deployment.md) - Building for production
- [Troubleshooting](./docs/13-troubleshooting.md) - Common issues

## 📁 Project Structure

```
Expo-Starter/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Home screen
│   │   └── settings.tsx   # Settings screen
│   ├── (auth)/            # Auth screens
│   │   ├── sign-in.tsx    # Sign in
│   │   ├── sign-up.tsx    # Sign up
│   │   └── forgot-password.tsx
│   ├── index.tsx          # Root entry with smart routing
│   ├── onboarding.tsx     # Onboarding carousel
│   ├── profile.tsx        # User profile
│   ├── subscription.tsx   # Subscription management
│   └── notifications.tsx  # Notifications list
├── lib/                   # Business logic
│   ├── supabase/          # Supabase client
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.ts     # Authentication
│   │   ├── useSubscription.ts  # RevenueCat
│   │   ├── useOnboarding.ts    # Onboarding state
│   │   └── useData.ts     # React Query hooks
│   ├── store/             # Zustand stores
│   │   └── appStore.ts    # App state (theme, etc.)
│   ├── utils/             # Helper functions
│   │   ├── format.ts      # Date, currency, etc.
│   │   ├── validation.ts  # Form validation
│   │   └── colors.ts      # Color utilities
│   └── animations/        # Reanimated presets
├── components/            # Reusable UI components
│   ├── ui/glass/          # 13 glass components
│   └── ErrorBoundary.tsx  # Error handling
├── docs/                  # Documentation
├── assets/                # Images, fonts
└── tailwind.config.js     # Design system tokens
```

## 🚀 Available Scripts

```bash
npm start              # Start development server
npm run ios            # Run on iOS simulator
npm run android        # Run on Android emulator
npm run web            # Run in web browser
```

## 🔧 Environment Variables

Required variables in `.env`:

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# RevenueCat
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=your_ios_api_key
EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID=your_android_api_key
```

See [.env.example](./.env.example) for template.

## 📦 Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production
```

See [docs/10-deployment.md](./docs/10-deployment.md) for complete guide.

## 🎨 Design System

This starter uses Tailwind CSS via NativeWind. All design tokens are in `tailwind.config.js`.

### Example Usage

```tsx
// Using NativeWind classes
<View className="bg-primary-500 p-4 rounded-xl">
  <Text className="text-white font-bold">Hello World</Text>
</View>;

// For native components
import { colors } from '@/lib/utils/colors';

<Tabs
  screenOptions={{
    tabBarActiveTintColor: colors.primary[600],
  }}
/>;
```

Read the [Design System Guide](./docs/03-design-system.md) for more.

## 🧩 Tech Stack

### Core

- [Expo](https://docs.expo.dev/) - React Native framework
- [React Native](https://reactnative.dev/) - Mobile framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety

### UI & Styling

- [NativeWind](https://www.nativewind.dev/) - Tailwind CSS for RN
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) - Animations
- [expo-blur](https://docs.expo.dev/versions/latest/sdk/blur-view/) - Blur effects

### Backend & Data

- [Supabase](https://supabase.com/docs) - Backend as a service
- [React Query](https://tanstack.com/query/latest/docs/react/overview) - Data fetching
- [Zustand](https://zustand-demo.pmnd.rs/) - State management

### Monetization

- [RevenueCat](https://www.revenuecat.com/docs) - In-app purchases

### Routing

- [Expo Router](https://docs.expo.dev/router/introduction/) - File-based routing

## 📝 Best Practices

This starter follows:

- ✅ Official Expo documentation
- ✅ Official NativeWind setup
- ✅ TypeScript strict mode
- ✅ Proper separation of concerns (UI vs logic)
- ✅ Single source of truth for design tokens
- ✅ Secure environment variable handling
- ✅ Performance optimization (BlurView limits)

## 🆘 Support

- 📖 [Documentation](./docs/README.md)
- 🐛 [Report Issues](https://github.com/aydinfer/Expo-Starter/issues)
- 💬 [Expo Docs](https://docs.expo.dev/)
- 💬 [NativeWind Docs](https://www.nativewind.dev/)

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🎯 What Makes This Different?

Unlike other starters, this template provides:

1. **Production-ready, not just a skeleton** - 70% of the work done
2. **Complete authentication flow** - Sign-in, sign-up, password reset
3. **Real subscription management** - Not just placeholder code
4. **Glassmorphic design system** - 13 pre-built components
5. **Onboarding flow** - With persistence and smart routing
6. **TypeScript throughout** - Full type safety
7. **Comprehensive documentation** - 17 detailed guides
8. **Modern stack** - Expo SDK 54, React 19, latest packages

## 🚀 Get Started Now

```bash
git clone https://github.com/aydinfer/Expo-Starter.git
cd Expo-Starter
npm install --legacy-peer-deps
cp .env.example .env
# Add your Supabase and RevenueCat keys
npm start
```

---

Built with ❤️ using official Expo packages and best practices.

**Version 1.0.0** | [Changelog](./CHANGELOG.md) | [Documentation](./docs/README.md)
