# Building & Deployment

Learn how to build and deploy your app to iOS App Store and Google Play Store using EAS Build.

## EAS Build Overview

EAS (Expo Application Services) Build compiles your React Native app in the cloud.

**Benefits:**

- No need for Xcode or Android Studio locally
- Build iOS apps from Windows/Linux
- Consistent build environment
- CI/CD integration
- Over-the-air updates

## Initial Setup

### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

### 2. Login to Expo

```bash
eas login
```

### 3. Configure Your Project

```bash
eas build:configure
```

This creates `eas.json` (already in this starter):

```json
{
  "cli": {
    "version": ">= 13.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

## Build Profiles

### Development Build

For testing with development features:

```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

### Preview Build

For internal testing (TestFlight, internal distribution):

```bash
eas build --profile preview --platform ios
eas build --profile preview --platform android
```

### Production Build

For app store submission:

```bash
eas build --profile production --platform ios
eas build --profile production --platform android
```

### Build Both Platforms

```bash
eas build --profile production --platform all
```

## Environment Variables

### Local Development (.env)

```env
# .env (not committed)
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=your-ios-key
EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID=your-android-key
```

### Production Secrets

Store secrets in EAS:

```bash
eas secret:create --scope project --name SUPABASE_URL --value https://xxx.supabase.co
eas secret:create --scope project --name SUPABASE_ANON_KEY --value your-key
```

### Using Secrets in eas.json

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "$SUPABASE_URL",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "$SUPABASE_ANON_KEY"
      }
    }
  }
}
```

## iOS Deployment

### Prerequisites

1. Apple Developer Account ($99/year)
2. App Store Connect access

### App Identifiers

```json
// app.json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp",
      "buildNumber": "1"
    }
  }
}
```

### Build for iOS

```bash
# First build (creates identifier automatically)
eas build --platform ios --profile production

# Subsequent builds
eas build --platform ios --profile production --auto-submit
```

### Submit to App Store

```bash
eas submit --platform ios
```

Or configure auto-submit in `eas.json`:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your@email.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCD123456"
      }
    }
  }
}
```

## Android Deployment

### Prerequisites

1. Google Play Console account ($25 one-time)
2. Keystore for signing (EAS creates automatically)

### App Identifiers

```json
// app.json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.yourapp",
      "versionCode": 1
    }
  }
}
```

### Build for Android

```bash
# First build
eas build --platform android --profile production

# With auto-submit
eas build --platform android --profile production --auto-submit
```

### Submit to Google Play

```bash
eas submit --platform android
```

## Version Management

### iOS Version Numbers

```json
{
  "expo": {
    "version": "1.0.0", // User-facing version
    "ios": {
      "buildNumber": "1" // Increment for each build
    }
  }
}
```

### Android Version Numbers

```json
{
  "expo": {
    "version": "1.0.0", // User-facing version
    "android": {
      "versionCode": 1 // Increment for each build
    }
  }
}
```

### Auto-Increment Script

```json
// package.json
{
  "scripts": {
    "version:ios": "node scripts/increment-ios-build.js",
    "version:android": "node scripts/increment-android-version.js"
  }
}
```

## Over-the-Air Updates (OTA)

### Install EAS Update

```bash
npx expo install expo-updates
```

### Configure Updates

```json
// app.json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/[your-project-id]",
      "enabled": true,
      "fallbackToCacheTimeout": 0
    },
    "runtimeVersion": {
      "policy": "sdkVersion"
    }
  }
}
```

### Publish Update

```bash
eas update --branch production --message "Fix login bug"
```

### Update Channels

```bash
# Production
eas update --branch production

# Staging
eas update --branch staging

# Development
eas update --branch development
```

## Pre-Build Checklist

### App Configuration

- [ ] Update `name` and `slug` in app.json
- [ ] Set correct `bundleIdentifier` (iOS) and `package` (Android)
- [ ] Increment `buildNumber` (iOS) and `versionCode` (Android)
- [ ] Add app icon (1024x1024 PNG)
- [ ] Add splash screen
- [ ] Set `privacy` policy if needed

### Code Quality

- [ ] Run TypeScript check: `npx tsc --noEmit`
- [ ] Run linter: `npm run lint`
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Test on real devices

### Environment

- [ ] Set production environment variables
- [ ] Verify Supabase URL and keys
- [ ] Verify RevenueCat API keys
- [ ] Remove console.logs (or use logger)
- [ ] Check `.gitignore` excludes `.env`

### App Store Requirements

- [ ] Privacy policy URL
- [ ] Terms of service URL
- [ ] Support email
- [ ] App screenshots (required sizes)
- [ ] App description
- [ ] Keywords (iOS)
- [ ] Age rating

## CI/CD with GitHub Actions

```yaml
# .github/workflows/build.yml
name: EAS Build

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - run: npm ci

      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - run: eas build --platform all --profile production --non-interactive
```

## Build Status & Logs

### Check Build Status

```bash
eas build:list
```

### View Build Logs

```bash
eas build:view [build-id]
```

### Download Build

Builds are available in your Expo dashboard:
https://expo.dev/accounts/[your-account]/projects/[your-project]/builds

## Common Issues

### iOS Build Fails - Missing Credentials

**Solution:** EAS creates credentials automatically. Accept prompts during first build.

### Android Build Fails - Keystore

**Solution:** EAS creates keystore automatically. Store it securely:

```bash
eas credentials
```

### OTA Update Not Applying

**Solution:** Ensure `runtimeVersion` matches:

```json
{
  "expo": {
    "runtimeVersion": "1.0.0"
  }
}
```

Increment `runtimeVersion` when native code changes (new SDK, native modules).

### Build Timeout

**Solution:** Upgrade to EAS paid plan for faster builds, or optimize build:

```json
{
  "build": {
    "production": {
      "cache": {
        "key": "v1"
      }
    }
  }
}
```

## Beta Testing

### iOS TestFlight

Automatic when you submit to App Store Connect:

```bash
eas submit --platform ios
```

Users download via TestFlight app.

### Android Internal Testing

Upload APK to Google Play Console → Internal Testing track.

### EAS Build Internal Distribution

For team testing without app stores:

```bash
eas build --profile preview --platform ios
```

Share generated URL with testers (no TestFlight needed for first 100 devices).

## Production Deployment Workflow

```bash
# 1. Prepare release
git checkout -b release/1.0.0

# 2. Update version numbers
# Edit app.json: version, buildNumber, versionCode

# 3. Run checks
npx tsc --noEmit
npm run lint

# 4. Build for production
eas build --profile production --platform all

# 5. Wait for builds to complete
eas build:list

# 6. Submit to stores
eas submit --platform ios
eas submit --platform android

# 7. Merge release
git checkout main
git merge release/1.0.0
git tag v1.0.0
git push --tags
```

## Resources

- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [EAS Submit Docs](https://docs.expo.dev/submit/introduction/)
- [EAS Update Docs](https://docs.expo.dev/eas-update/introduction/)
- [App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Play Store Guidelines](https://play.google.com/console/about/guides/policy/)
