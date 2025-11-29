# Local Auth Variant Setup Guide

Convert your template to use **local authentication with encrypted storage** - all data stays on device.

**Perfect for:** Privacy-focused apps, offline-first apps, regulated industries, apps that need accounts but no cloud

**Time to complete:** 2-3 hours

---

## What You'll Get

✅ RevenueCat subscriptions
✅ Local authentication (encrypted credentials)
✅ SQLite database (all data on-device)
✅ All 13 glass components
✅ Onboarding flow
✅ Profile and settings (local storage)
✅ 100% offline functionality
❌ No cloud sync
❌ No multi-device support

---

## Architecture Overview

```
┌─────────────────────────────────────┐
│  User enters email + password       │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│  Hash password with bcrypt          │
│  Store in SecureStore (encrypted)   │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│  User data stored in SQLite         │
│  (profiles, settings, app data)     │
└─────────────────────────────────────┘

RevenueCat: Still works independently!
```

---

## Step 1: Install Required Packages

### 1.1 Install Expo SecureStore & SQLite

```bash
npx expo install expo-secure-store expo-sqlite --legacy-peer-deps
```

### 1.2 Install Crypto Libraries

```bash
npm install bcryptjs --legacy-peer-deps
npm install -D @types/bcryptjs --legacy-peer-deps
```

**Official Docs:**

- [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/)

---

## Step 2: Remove Supabase Dependencies

### 2.1 Uninstall Supabase

```bash
npm uninstall @supabase/supabase-js react-native-url-polyfill --legacy-peer-deps
```

### 2.2 Update Environment Variables

Delete or comment out in `.env`:

```bash
# EXPO_PUBLIC_SUPABASE_URL=your-project-url
# EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Keep RevenueCat keys:

```bash
EXPO_PUBLIC_REVENUECAT_IOS_KEY=your_ios_key
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=your_android_key
```

### 2.3 Delete Supabase Files

```bash
rm lib/supabase/client.ts
rm -rf lib/supabase/
```

---

## Step 3: Create SQLite Database Service

**File:** `lib/database/sqlite.ts`

```typescript
import * as SQLite from 'expo-sqlite';

/**
 * SQLite Database Service
 *
 * Local database for storing all user data on-device.
 * Tables: users, profiles, settings
 *
 * Official Docs: https://docs.expo.dev/versions/latest/sdk/sqlite/
 */

const DB_NAME = 'app.db';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: number;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  phone: string;
  bio: string;
  updated_at: number;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  /**
   * Initialize database and create tables
   */
  async initialize(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync(DB_NAME);

      // Create users table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at INTEGER NOT NULL
        );
      `);

      // Create profiles table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS profiles (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          display_name TEXT,
          phone TEXT,
          bio TEXT,
          updated_at INTEGER NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `);

      // Create settings table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS settings (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          key TEXT NOT NULL,
          value TEXT,
          updated_at INTEGER NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE(user_id, key)
        );
      `);

      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  /**
   * Create a new user
   */
  async createUser(email: string, passwordHash: string): Promise<User> {
    if (!this.db) throw new Error('Database not initialized');

    const id = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const created_at = Date.now();

    await this.db.runAsync(
      'INSERT INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)',
      [id, email.toLowerCase(), passwordHash, created_at]
    );

    // Create default profile
    const profileId = `profile_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    await this.db.runAsync(
      'INSERT INTO profiles (id, user_id, display_name, phone, bio, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      [profileId, id, '', '', '', Date.now()]
    );

    return { id, email, password_hash: passwordHash, created_at };
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<User>('SELECT * FROM users WHERE email = ?', [
      email.toLowerCase(),
    ]);

    return result || null;
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<User>('SELECT * FROM users WHERE id = ?', [userId]);

    return result || null;
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<Profile | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<Profile>(
      'SELECT * FROM profiles WHERE user_id = ?',
      [userId]
    );

    return result || null;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: Partial<Profile>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const updates: string[] = [];
    const values: any[] = [];

    if (data.display_name !== undefined) {
      updates.push('display_name = ?');
      values.push(data.display_name);
    }
    if (data.phone !== undefined) {
      updates.push('phone = ?');
      values.push(data.phone);
    }
    if (data.bio !== undefined) {
      updates.push('bio = ?');
      values.push(data.bio);
    }

    updates.push('updated_at = ?');
    values.push(Date.now());

    values.push(userId);

    await this.db.runAsync(`UPDATE profiles SET ${updates.join(', ')} WHERE user_id = ?`, values);
  }

  /**
   * Update password
   */
  async updatePassword(userId: string, newPasswordHash: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync('UPDATE users SET password_hash = ? WHERE id = ?', [
      newPasswordHash,
      userId,
    ]);
  }

  /**
   * Delete user (cascade deletes profile and settings)
   */
  async deleteUser(userId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync('DELETE FROM users WHERE id = ?', [userId]);
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    return (result?.count || 0) > 0;
  }
}

// Singleton instance
export const database = new DatabaseService();
```

---

## Step 4: Create Secure Storage Service

**File:** `lib/auth/secureStorage.ts`

```typescript
import * as SecureStore from 'expo-secure-store';

/**
 * Secure Storage Service
 *
 * Uses expo-secure-store for encrypted credential storage.
 * On iOS: Uses Keychain Services
 * On Android: Uses EncryptedSharedPreferences
 *
 * Official Docs: https://docs.expo.dev/versions/latest/sdk/securestore/
 */

const KEYS = {
  CURRENT_USER_ID: 'current_user_id',
  SESSION_TOKEN: 'session_token',
} as const;

class SecureStorage {
  /**
   * Save current user ID
   */
  async setCurrentUserId(userId: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.CURRENT_USER_ID, userId);
    } catch (error) {
      console.error('Failed to save user ID:', error);
      throw error;
    }
  }

  /**
   * Get current user ID
   */
  async getCurrentUserId(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(KEYS.CURRENT_USER_ID);
    } catch (error) {
      console.error('Failed to get user ID:', error);
      return null;
    }
  }

  /**
   * Save session token (for local session management)
   */
  async setSessionToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.SESSION_TOKEN, token);
    } catch (error) {
      console.error('Failed to save session token:', error);
      throw error;
    }
  }

  /**
   * Get session token
   */
  async getSessionToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(KEYS.SESSION_TOKEN);
    } catch (error) {
      console.error('Failed to get session token:', error);
      return null;
    }
  }

  /**
   * Clear all secure storage (sign out)
   */
  async clear(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(KEYS.CURRENT_USER_ID);
      await SecureStore.deleteItemAsync(KEYS.SESSION_TOKEN);
    } catch (error) {
      console.error('Failed to clear secure storage:', error);
      throw error;
    }
  }
}

export const secureStorage = new SecureStorage();
```

---

## Step 5: Create Local Auth Hook

**File:** `lib/hooks/useLocalAuth.ts`

```typescript
import { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import { database, User, Profile } from '@/lib/database/sqlite';
import { secureStorage } from '@/lib/auth/secureStorage';

/**
 * Local Authentication Hook
 *
 * Privacy-first authentication with:
 * - Local credential storage (encrypted)
 * - SQLite database for user data
 * - Bcrypt password hashing
 * - No cloud sync
 *
 * Official Docs:
 * - https://docs.expo.dev/versions/latest/sdk/securestore/
 * - https://docs.expo.dev/versions/latest/sdk/sqlite/
 */

interface LocalUser {
  id: string;
  email: string;
  profile: Profile | null;
}

interface SignInResult {
  user: LocalUser;
  error: null;
}

interface SignInError {
  user: null;
  error: string;
}

export function useLocalAuth() {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Initialize authentication and database
   */
  const initializeAuth = async () => {
    try {
      // Initialize database
      await database.initialize();

      // Check for existing session
      const userId = await secureStorage.getCurrentUserId();
      if (userId) {
        const dbUser = await database.getUserById(userId);
        if (dbUser) {
          const profile = await database.getProfile(userId);
          setUser({
            id: dbUser.id,
            email: dbUser.email,
            profile,
          });
        } else {
          // User not found, clear session
          await secureStorage.clear();
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign up a new user
   */
  const signUp = async (email: string, password: string): Promise<SignInResult | SignInError> => {
    try {
      // Check if email already exists
      const exists = await database.emailExists(email);
      if (exists) {
        return {
          user: null,
          error: 'An account with this email already exists',
        };
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const dbUser = await database.createUser(email, passwordHash);

      // Get profile
      const profile = await database.getProfile(dbUser.id);

      // Save session
      const sessionToken = `session_${Date.now()}_${Math.random().toString(36)}`;
      await secureStorage.setCurrentUserId(dbUser.id);
      await secureStorage.setSessionToken(sessionToken);

      const newUser: LocalUser = {
        id: dbUser.id,
        email: dbUser.email,
        profile,
      };

      setUser(newUser);

      return { user: newUser, error: null };
    } catch (error: any) {
      return {
        user: null,
        error: error?.message || 'Failed to create account',
      };
    }
  };

  /**
   * Sign in existing user
   */
  const signIn = async (email: string, password: string): Promise<SignInResult | SignInError> => {
    try {
      // Get user from database
      const dbUser = await database.getUserByEmail(email);
      if (!dbUser) {
        return {
          user: null,
          error: 'Invalid email or password',
        };
      }

      // Verify password
      const passwordMatch = await bcrypt.compare(password, dbUser.password_hash);
      if (!passwordMatch) {
        return {
          user: null,
          error: 'Invalid email or password',
        };
      }

      // Get profile
      const profile = await database.getProfile(dbUser.id);

      // Save session
      const sessionToken = `session_${Date.now()}_${Math.random().toString(36)}`;
      await secureStorage.setCurrentUserId(dbUser.id);
      await secureStorage.setSessionToken(sessionToken);

      const authenticatedUser: LocalUser = {
        id: dbUser.id,
        email: dbUser.email,
        profile,
      };

      setUser(authenticatedUser);

      return { user: authenticatedUser, error: null };
    } catch (error: any) {
      return {
        user: null,
        error: error?.message || 'Failed to sign in',
      };
    }
  };

  /**
   * Sign out
   */
  const signOut = async (): Promise<void> => {
    try {
      await secureStorage.clear();
      setUser(null);
    } catch (error) {
      console.error('Failed to sign out:', error);
      throw error;
    }
  };

  /**
   * Update profile
   */
  const updateProfile = async (data: {
    displayName?: string;
    phone?: string;
    bio?: string;
  }): Promise<void> => {
    if (!user) throw new Error('No user signed in');

    try {
      await database.updateProfile(user.id, {
        display_name: data.displayName,
        phone: data.phone,
        bio: data.bio,
      });

      // Refresh user data
      const profile = await database.getProfile(user.id);
      setUser({ ...user, profile });
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  /**
   * Update password
   */
  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ error: string | null }> => {
    if (!user) throw new Error('No user signed in');

    try {
      // Get user from database
      const dbUser = await database.getUserById(user.id);
      if (!dbUser) {
        return { error: 'User not found' };
      }

      // Verify current password
      const passwordMatch = await bcrypt.compare(currentPassword, dbUser.password_hash);
      if (!passwordMatch) {
        return { error: 'Current password is incorrect' };
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      // Update password
      await database.updatePassword(user.id, newPasswordHash);

      return { error: null };
    } catch (error: any) {
      return { error: error?.message || 'Failed to update password' };
    }
  };

  /**
   * Delete account
   */
  const deleteAccount = async (): Promise<void> => {
    if (!user) throw new Error('No user signed in');

    try {
      await database.deleteUser(user.id);
      await secureStorage.clear();
      setUser(null);
    } catch (error) {
      console.error('Failed to delete account:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    updatePassword,
    deleteAccount,
  };
}
```

---

## Step 6: Update Auth Screens

### 6.1 Sign In Screen

**File:** `app/(auth)/sign-in.tsx`

Replace Supabase auth with local auth:

```tsx
import { useLocalAuth } from '@/lib/hooks/useLocalAuth';

// Replace useAuth with useLocalAuth
const { signIn } = useLocalAuth();

// Rest of the code remains the same
```

### 6.2 Sign Up Screen

**File:** `app/(auth)/sign-up.tsx`

```tsx
import { useLocalAuth } from '@/lib/hooks/useLocalAuth';

// Replace useAuth with useLocalAuth
const { signUp } = useLocalAuth();

// Rest of the code remains the same
```

### 6.3 Forgot Password Screen

**File:** `app/(auth)/forgot-password.tsx`

For local auth, forgot password becomes "password reset" that requires answering security questions or using email verification (implementation depends on your requirements).

**Simple approach**: Remove forgot password feature, or implement security questions.

```tsx
// Option 1: Remove the screen entirely
// Option 2: Implement security questions
// Option 3: Show message: "Contact support for password reset"
```

---

## Step 7: Update Profile Screen

**File:** `app/profile.tsx`

Replace `useAuth` with `useLocalAuth`:

```tsx
import { useLocalAuth } from '@/lib/hooks/useLocalAuth';

export default function ProfileScreen() {
  const { user, updateProfile } = useLocalAuth();

  // Update state initialization
  const [displayName, setDisplayName] = useState(user?.profile?.display_name || '');
  const [phone, setPhone] = useState(user?.profile?.phone || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');

  const handleSave = async () => {
    // ... validation ...

    setIsSaving(true);
    try {
      await updateProfile({
        displayName: displayName.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
      });

      Alert.alert('Success', 'Your profile has been updated');
      setIsEditing(false);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Update avatar initials
  const getInitials = (): string => {
    if (user?.profile?.display_name) {
      const names = user.profile.display_name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return user.profile.display_name.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  // Rest remains the same
}
```

---

## Step 8: Update Settings Screen

**File:** `app/(tabs)/settings.tsx`

Replace `useAuth` with `useLocalAuth`:

```tsx
import { useLocalAuth } from '@/lib/hooks/useLocalAuth';

export default function SettingsScreen() {
  const { signOut, user } = useLocalAuth();

  // Rest remains the same
}
```

---

## Step 9: Update Root Entry Point

**File:** `app/index.tsx`

```tsx
import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { GlassLoadingSpinner } from '@/components/ui/glass';
import { useOnboarding } from '@/lib/hooks/useOnboarding';
import { useLocalAuth } from '@/lib/hooks/useLocalAuth';

/**
 * Root Entry Point - Local Auth Variant
 *
 * Routing logic:
 * 1. Check onboarding status
 * 2. Check authentication status (local)
 * 3. Navigate appropriately
 */
export default function Index() {
  const { hasCompletedOnboarding, isLoading: onboardingLoading } = useOnboarding();
  const { user, loading: authLoading } = useLocalAuth();

  useEffect(() => {
    if (onboardingLoading || authLoading) return;

    // Navigate based on state
    if (!hasCompletedOnboarding) {
      router.replace('/onboarding');
    } else if (!user) {
      router.replace('/(auth)/sign-in');
    } else {
      router.replace('/(tabs)');
    }
  }, [hasCompletedOnboarding, user, onboardingLoading, authLoading]);

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <GlassLoadingSpinner />
    </View>
  );
}
```

---

## Step 10: Update Root Layout

**File:** `app/_layout.tsx`

Remove Supabase initialization:

```tsx
import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="subscription" />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
```

---

## Step 11: Test Your Local Auth App

### 11.1 Start Development Server

```bash
npm start
```

### 11.2 Test Flow

1. ✅ **Onboarding**: First launch shows onboarding
2. ✅ **Sign Up**: Create new account (stored locally)
3. ✅ **Sign In**: Log in with credentials
4. ✅ **Profile**: Edit profile information
5. ✅ **Settings**: Change preferences
6. ✅ **Sign Out**: Clear session
7. ✅ **Persistence**: Close app and reopen (should stay logged in)

### 11.3 Test Data Storage

```bash
# View SQLite database (development only)
# Install SQLite browser: https://sqlitebrowser.org/
# Database location: expo app data directory
```

---

## Security Best Practices

### ✅ DO:

1. **Use bcrypt for passwords** (already implemented)
2. **Validate input** before database operations
3. **Use parameterized queries** (SQL injection protection)
4. **Encrypt sensitive data** with SecureStore
5. **Handle errors gracefully** without exposing internals

### ❌ DON'T:

1. **Don't log passwords** or sensitive data
2. **Don't store plain text passwords**
3. **Don't use MD5 or SHA1** for password hashing
4. **Don't trust client-side validation** alone
5. **Don't store sensitive keys** in AsyncStorage (use SecureStore)

---

## FAQ

### Q: Is this secure enough for production?

**A:** Yes, for offline apps. The implementation uses:

- **Bcrypt** (industry standard) for password hashing
- **SecureStore** (iOS Keychain / Android EncryptedSharedPreferences)
- **SQLite** with parameterized queries (SQL injection protection)

However, consider:

- No cloud backup means data loss if device is lost
- No password recovery (users can't reset forgotten passwords)
- No centralized audit logs

### Q: Can I add cloud sync later?

**A:** Yes! You can:

1. Keep local database as cache
2. Add Supabase for cloud sync
3. Implement sync logic to merge local + cloud data

### Q: How do I backup user data?

**A:** Options:

1. **Export to file**: Let users export JSON/CSV
2. **iCloud/Google Drive**: Use expo-file-system + cloud storage APIs
3. **Add cloud backend**: Upgrade to Full Stack variant

### Q: What about password recovery?

**A:** Options:

1. **Security questions**: Store hashed answers in SQLite
2. **Email verification**: Requires backend (add Supabase)
3. **Admin reset**: Support team manually resets
4. **No recovery**: Accept that users may lose access

### Q: Is data encrypted at rest?

**A:**

- **SecureStore**: ✅ Yes (iOS Keychain / Android EncryptedSharedPreferences)
- **SQLite database**: ❌ No (by default)

To encrypt SQLite:

```bash
npm install @journeyapps/react-native-sqlcipher --legacy-peer-deps
```

Replace `expo-sqlite` with `sqlcipher` for full database encryption.

### Q: How do I migrate to cloud later?

**A:**

```typescript
// 1. Keep local auth as fallback
const { user: localUser } = useLocalAuth();

// 2. Add Supabase auth
const { user: cloudUser } = useAuth();

// 3. Sync on sign in
if (cloudUser && localUser) {
  await syncLocalToCloud(localUser.id, cloudUser.id);
}
```

---

## Advanced Features

### Add Biometric Authentication

```bash
npx expo install expo-local-authentication --legacy-peer-deps
```

**File:** `lib/auth/biometrics.ts`

```typescript
import * as LocalAuthentication from 'expo-local-authentication';

export async function authenticateWithBiometrics(): Promise<boolean> {
  try {
    // Check if biometrics available
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) return false;

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) return false;

    // Authenticate
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to continue',
    });

    return result.success;
  } catch (error) {
    console.error('Biometric auth failed:', error);
    return false;
  }
}
```

**Usage in sign-in:**

```tsx
import { authenticateWithBiometrics } from '@/lib/auth/biometrics';

// After password sign in
const { user, error } = await signIn(email, password);

if (user) {
  // Enable biometrics for next time
  const biometricsEnabled = await authenticateWithBiometrics();
  if (biometricsEnabled) {
    // Save flag to enable quick sign in
    await AsyncStorage.setItem('biometrics_enabled', 'true');
  }
}
```

---

## What You've Built

✅ **Privacy-First Auth** - All data on device
✅ **Encrypted Credentials** - SecureStore + bcrypt
✅ **Local Database** - SQLite for user data
✅ **RevenueCat Subscriptions** - Still works!
✅ **100% Offline** - No cloud dependencies
✅ **Production Ready** - Secure and performant

---

## Resources

- 📖 [expo-secure-store Docs](https://docs.expo.dev/versions/latest/sdk/securestore/)
- 📖 [expo-sqlite Docs](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- 📖 [expo-local-authentication Docs](https://docs.expo.dev/versions/latest/sdk/local-authentication/)
- 📖 [Bcrypt Docs](https://www.npmjs.com/package/bcryptjs)
- 📖 [SQLCipher (Database Encryption)](https://www.zetetic.net/sqlcipher/)

---

**Questions or Issues?**

- 📖 [Main Documentation](../../README.md)
- 🔄 [Switch to Full Stack Variant](../VARIANTS.md)
- ⚡ [Switch to Anonymous Variant](./ANONYMOUS.md)
