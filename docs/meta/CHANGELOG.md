# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-17

### Added

#### Core Stack

- Expo SDK 54 with React Native 0.81.5
- NativeWind v4 with Tailwind CSS v3 for styling
- Expo Router for file-based routing
- React Native Reanimated v4 for 60fps animations
- expo-blur for native blur effects
- TypeScript with strict mode enabled

#### Backend & Services

- Supabase integration (authentication, database, storage)
- RevenueCat SDK for in-app purchases and subscriptions
- React Query (@tanstack/react-query) for data fetching and caching
- Zustand for lightweight global state management

#### Authentication

- Complete auth hooks (sign in, sign up, sign out, password reset)
- Session persistence with AsyncStorage
- Email/password authentication
- Protected routes pattern
- Auth state management

#### UI & Design

- Design token system with single source of truth (tailwind.config.js)
- Proper color exports for React Native components (lib/utils/colors.ts)
- Dark mode support throughout
- Custom color palette (primary, success, warning, error, gray)
- Path aliases (@/) for clean imports
- Responsive layout utilities

#### Project Structure

- Proper separation: /app for UI, /lib for business logic
- Custom hooks: useAuth, useSubscription, useData
- Example components: Button, Card, Input, Loading, EmptyState
- Utility functions: helpers, API client, color tokens

#### Documentation

- Comprehensive docs/ folder with 15 guides
- Getting started guide
- Project structure explanation
- Design system guide (Tailwind + NativeWind)
- Supabase setup and usage
- RevenueCat setup and usage
- Components guide with examples
- Animations guide with Reanimated
- All docs under 300 lines for easy reading

#### Developer Experience

- Hot reload with Fast Refresh
- TypeScript path aliases configured
- ESLint and Prettier ready
- Git initialized and configured
- Environment variable template (.env.example)

### Technical Details

#### Installation Method

- All packages installed via official `npx expo install` commands
- Following official Expo and NativeWind documentation
- No manual package.json editing
- Proper peer dependency resolution

#### Design System

- Tailwind CSS v3.4.17 (peer dependency for NativeWind)
- NativeWind metro plugin configured
- Custom theme extensions in tailwind.config.js
- Color scales from 50 (lightest) to 950 (darkest)

#### Configuration Files

- babel.config.js - NativeWind + Reanimated setup
- metro.config.js - NativeWind metro plugin
- tailwind.config.js - Design tokens
- tsconfig.json - TypeScript with path aliases
- global.css - Tailwind directives

### Removed

- Tamagui (third-party UI library) - replaced with NativeWind
- @expo/ui (beta package) - replaced with custom components
- Sentry (optional error tracking) - kept as optional

### Security

- Row Level Security examples for Supabase
- Environment variables properly scoped with EXPO*PUBLIC* prefix
- No sensitive data in git repository
- .env in .gitignore

### Known Issues

- Metro bundler may require cache clearing on first run
- Some peer dependency warnings (non-breaking)

## Future Roadmap

### Planned for v1.1.0

- State management guide (08-state-management.md)
- Routing guide (09-routing.md)
- Building & deployment guide (10-deployment.md)
- Testing guide (11-testing.md)
- Performance guide (12-performance.md)
- Troubleshooting guide (13-troubleshooting.md)
- Best practices guide (14-best-practices.md)
- API reference (15-api-reference.md)

### Planned for v1.2.0

- Complete component library (Button, Input, Modal, etc.)
- Example authentication screens
- Example paywall screen
- Animation presets
- Form validation utilities
- Image upload helpers

### Planned for v2.0.0

- Expo SDK 55 upgrade
- Additional backend options (Firebase, AWS Amplify)
- Advanced animations library
- Component storybook
- E2E testing setup
- CI/CD templates

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/update documentation
5. Update CHANGELOG.md
6. Submit a pull request

## Support

- GitHub Issues: https://github.com/aydinfer/Expo-Starter/issues
- Documentation: /docs/README.md
- Expo Docs: https://docs.expo.dev/
- NativeWind Docs: https://www.nativewind.dev/
