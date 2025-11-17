# Getting Started

This is a production-ready Expo starter template built with official Expo packages and best practices.

## What's Inside

- **Expo SDK 54**: Latest stable Expo version with React Native 0.81.5
- **NativeWind v4**: Tailwind CSS for React Native (official styling solution)
- **Expo Router**: File-based routing (similar to Next.js)
- **React Native Reanimated**: 60fps animations
- **expo-blur**: Native blur effects
- **Supabase**: Backend and authentication
- **RevenueCat**: In-app purchases and subscriptions
- **React Query**: Data fetching and state management
- **Zustand**: Lightweight global state
- **TypeScript**: Full type safety

## Prerequisites

- Node.js 18+ installed
- iOS Simulator (Mac only) or Android Emulator
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (optional)

## Installation

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
```

Then fill in your credentials:
- Supabase URL and anon key
- RevenueCat API keys for iOS and Android

3. **Start the development server**:
```bash
npx expo start
```

4. **Run on a device**:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app

## Project Structure

```
/clean-build
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation group
│   │   ├── index.tsx      # Home tab
│   │   └── explore.tsx    # Explore tab
│   ├── (auth)/            # Auth screens group
│   │   ├── sign-in.tsx    # Sign in screen
│   │   └── sign-up.tsx    # Sign up screen
│   ├── _layout.tsx        # Root layout
│   └── +not-found.tsx     # 404 screen
├── lib/                   # Business logic
│   ├── supabase/          # Supabase client
│   ├── hooks/             # Custom React hooks
│   ├── store/             # Zustand stores
│   └── utils/             # Helper functions
├── components/            # Reusable components
├── assets/                # Images, fonts, etc.
├── docs/                  # Documentation
├── tailwind.config.js     # Design system
├── metro.config.js        # Metro bundler config
├── babel.config.js        # Babel config
└── global.css             # Tailwind directives
```

## Understanding NativeWind + Tailwind

**We use BOTH - they work together:**

- **Tailwind CSS**: The design system (defines colors, spacing, utilities)
- **NativeWind**: The translator (converts Tailwind classes to React Native styles)

**How it works:**
1. You define your design tokens in [tailwind.config.js](../tailwind.config.js)
2. You use Tailwind classes: `className="bg-primary-500 p-4 rounded-xl"`
3. NativeWind converts them to React Native styles at build time

**Example:**
```tsx
<View className="bg-primary-500 p-4 rounded-xl">
  <Text className="text-white font-bold">Hello</Text>
</View>
```

Becomes:
```tsx
<View style={{
  backgroundColor: '#3b82f6',
  padding: 16,
  borderRadius: 12
}}>
  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Hello</Text>
</View>
```

## Next Steps

1. Read [02-project-structure.md](./02-project-structure.md) to understand the codebase
2. Read [03-design-system.md](./03-design-system.md) to customize your theme
3. Read [06-supabase-setup.md](./06-supabase-setup.md) to set up authentication
4. Read [07-revenuecat-setup.md](./07-revenuecat-setup.md) to set up subscriptions

## Common Commands

```bash
# Start development server
npx expo start

# Start with cache cleared
npx expo start --clear

# Type check
npx tsc --noEmit

# Build for iOS
npx expo build:ios

# Build for Android
npx expo build:android
```

## Troubleshooting

**Metro bundler errors**: Clear cache with `npx expo start --clear`

**TypeScript errors**: Run `npx tsc --noEmit` to see all errors

**NativeWind not working**: Make sure global.css is imported in app/_layout.tsx

**Supabase errors**: Check your .env file has correct credentials
