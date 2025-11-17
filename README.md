# Expo Starter - Production Ready Template

A production-ready Expo starter template built with official Expo packages and best practices.

## Features

- ✅ **Expo SDK 54** - Latest stable version with React Native 0.81.5
- ✅ **NativeWind v4** - Tailwind CSS for React Native
- ✅ **Expo Router** - File-based routing like Next.js
- ✅ **React Native Reanimated** - 60fps animations
- ✅ **expo-blur** - Native blur effects
- ✅ **Supabase** - Backend, auth, and database
- ✅ **RevenueCat** - In-app purchases and subscriptions
- ✅ **React Query** - Data fetching and caching
- ✅ **Zustand** - Lightweight global state
- ✅ **TypeScript** - Full type safety with strict mode

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase and RevenueCat keys

# Start development server
npx expo start
```

Then press:
- `i` for iOS Simulator
- `a` for Android Emulator
- Scan QR code with Expo Go app

## Documentation

📚 **[Complete Documentation](./docs/README.md)**

### Quick Links

- [Getting Started](./docs/01-getting-started.md) - Installation and setup
- [Project Structure](./docs/02-project-structure.md) - Understanding the codebase
- [Design System](./docs/03-design-system.md) - Customizing theme and colors
- [Supabase Setup](./docs/06-supabase-setup.md) - Authentication and database
- [RevenueCat Setup](./docs/07-revenuecat-setup.md) - In-app purchases

## Project Structure

```
clean-build/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation
│   ├── (auth)/            # Auth screens
│   └── _layout.tsx        # Root layout
├── lib/                   # Business logic
│   ├── supabase/          # Supabase client
│   ├── hooks/             # Custom React hooks
│   ├── store/             # Zustand stores
│   └── utils/             # Helpers and utilities
├── components/            # Reusable UI components
├── docs/                  # Documentation
├── assets/                # Images, fonts
└── tailwind.config.js     # Design system
```

## What's Included

### Authentication
- Sign in / Sign up screens
- Email/password authentication
- Password reset flow
- Session persistence
- Protected routes

### Styling
- NativeWind (Tailwind CSS) integration
- Design token system
- Dark mode support
- Responsive utilities
- Custom color palette

### Data Management
- React Query for server state
- Zustand for client state
- Example CRUD operations
- Real-time subscriptions ready

### Monetization
- RevenueCat SDK integrated
- Subscription management
- Purchase restoration
- Example paywall

### Developer Experience
- TypeScript with strict mode
- Path aliases (`@/` imports)
- Hot reload with Fast Refresh
- Type-safe routing

## Available Scripts

```bash
npm start              # Start development server
npm run ios            # Run on iOS simulator
npm run android        # Run on Android emulator
npm run web            # Run in web browser
npm run start:clear    # Clear cache and start
```

## Environment Variables

Required variables in `.env`:

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=

# RevenueCat
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=
EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID=
```

See [.env.example](./.env.example) for template.

## Building for Production

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

## Design System

This starter uses Tailwind CSS via NativeWind. All design tokens are in `tailwind.config.js`.

### Example Usage

```tsx
// Using NativeWind classes
<View className="bg-primary-500 p-4 rounded-xl">
  <Text className="text-white font-bold">Hello World</Text>
</View>

// For native components
import { colors } from '@/lib/utils/colors';

<Tabs screenOptions={{
  tabBarActiveTintColor: colors.primary[600]
}} />
```

Read the [Design System Guide](./docs/03-design-system.md) for more.

## Tech Stack

### Core
- [Expo](https://expo.dev/) - React Native framework
- [React Native](https://reactnative.dev/) - Mobile framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety

### UI & Styling
- [NativeWind](https://www.nativewind.dev/) - Tailwind CSS for RN
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) - Animations
- [expo-blur](https://docs.expo.dev/versions/latest/sdk/blur-view/) - Blur effects

### Backend & Data
- [Supabase](https://supabase.com/) - Backend as a service
- [React Query](https://tanstack.com/query/) - Data fetching
- [Zustand](https://zustand-demo.pmnd.rs/) - State management

### Monetization
- [RevenueCat](https://www.revenuecat.com/) - In-app purchases

### Routing
- [Expo Router](https://docs.expo.dev/router/introduction/) - File-based routing

## Contributing

This is a starter template. Feel free to:
- Fork and customize for your needs
- Submit issues for bugs
- Suggest improvements

## Best Practices

This starter follows:
- ✅ Official Expo documentation
- ✅ Official NativeWind setup
- ✅ TypeScript strict mode
- ✅ Proper separation of concerns
- ✅ Single source of truth for design tokens
- ✅ Row Level Security for database
- ✅ Secure environment variable handling

## Support

- 📖 [Documentation](./docs/README.md)
- 🐛 [Report Issues](https://github.com/aydinfer/Expo-Starter/issues)
- 💬 [Expo Docs](https://docs.expo.dev/)
- 💬 [NativeWind Docs](https://www.nativewind.dev/)

## License

MIT License - feel free to use for personal or commercial projects.

---

Built with ❤️ using official Expo packages and best practices.
