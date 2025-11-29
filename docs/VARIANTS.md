# Template Variants Guide

This template comes in **3 flavors** to suit different app requirements. Choose the one that best fits your needs!

---

## 🎯 Which Variant Should I Use?

### ✅ **Full Stack** (Default - What You Cloned)

**Best for:** Most production apps, SaaS, social apps, multi-device apps

**Includes:**
- ✅ Supabase authentication & database
- ✅ RevenueCat subscriptions
- ✅ Multi-device sync
- ✅ Cloud storage
- ✅ All 13 glass components
- ✅ Onboarding flow
- ✅ Profile, Settings, Notifications screens

**Setup:** Configure Supabase and RevenueCat keys → Ready to ship!

📖 **[Full Setup Guide](./01-getting-started.md)**

---

### ⚡ **Anonymous** (Simplest)

**Best for:** Games, utilities, tools, content apps that don't need user accounts

**Includes:**
- ✅ RevenueCat subscriptions (works without auth!)
- ✅ All 13 glass components
- ✅ Onboarding flow
- ✅ Settings screen (simplified)
- ❌ No login/signup
- ❌ No user profiles
- ❌ No cloud storage

**Pros:**
- Fastest to ship
- No backend configuration
- Still fully monetizable
- Lower maintenance

**Cons:**
- No cross-device sync
- No user accounts
- Can't add social features later without refactoring

📖 **[Anonymous Setup Guide](./variants/ANONYMOUS.md)**

---

### 🔒 **Local Auth** (Privacy-First)

**Best for:** Privacy-focused apps, offline-first apps, regulated industries

**Includes:**
- ✅ RevenueCat subscriptions
- ✅ Local authentication (encrypted with SecureStore)
- ✅ SQLite database (all data on-device)
- ✅ All 13 glass components
- ✅ Onboarding flow
- ✅ Profile, Settings screens (local storage)
- ❌ No cloud sync
- ❌ No multi-device support

**Pros:**
- Maximum privacy (data never leaves device)
- Works 100% offline
- No backend costs
- Still fully monetizable

**Cons:**
- No cloud backup
- No cross-device sync
- User loses data if device is lost
- More complex data management

📖 **[Local Auth Setup Guide](./variants/LOCAL_AUTH.md)**

---

## 📊 Feature Comparison

| Feature | Full Stack | Anonymous | Local Auth |
|---------|-----------|-----------|------------|
| **RevenueCat Subscriptions** | ✅ | ✅ | ✅ |
| **Glass UI Components** | ✅ (13) | ✅ (13) | ✅ (13) |
| **Onboarding Flow** | ✅ | ✅ | ✅ |
| **User Authentication** | ✅ Cloud | ❌ None | ✅ Local |
| **User Profiles** | ✅ | ❌ | ✅ Local |
| **Cloud Storage** | ✅ | ❌ | ❌ |
| **Multi-Device Sync** | ✅ | ❌ | ❌ |
| **Offline Mode** | Partial | ✅ Full | ✅ Full |
| **Backend Required** | Supabase | None | None |
| **Privacy** | Good | Excellent | Excellent |
| **Complexity** | Medium | Low | Medium |
| **Time to Ship** | 1-2 days | < 1 day | 2-3 days |

---

## 🚀 Quick Start

### Option 1: Use Full Stack (Current Setup)

```bash
# You're already set up!
cp .env.example .env
# Add your Supabase + RevenueCat keys
npm start
```

### Option 2: Convert to Anonymous

```bash
# Follow the guide
docs/variants/ANONYMOUS.md
```

### Option 3: Convert to Local Auth

```bash
# Follow the guide
docs/variants/LOCAL_AUTH.md
```

---

## 🔄 Can I Switch Later?

**Anonymous → Full Stack:** ✅ Easy
Just add Supabase and auth screens back

**Anonymous → Local Auth:** ✅ Easy
Add SecureStore and SQLite

**Local Auth → Full Stack:** ⚠️ Moderate
Need to migrate local data to Supabase

**Full Stack → Anonymous:** ⚠️ Moderate
Remove Supabase, keep RevenueCat

**Full Stack → Local Auth:** ❌ Hard
Need to refactor all data layer

---

## 💡 Recommendations

### Choose **Full Stack** if:
- ✅ You need user accounts
- ✅ You want multi-device sync
- ✅ You're building a social app
- ✅ You need cloud backup
- ✅ You want real-time features

### Choose **Anonymous** if:
- ✅ Your app doesn't need accounts
- ✅ You want to ship FAST
- ✅ You're building a game or utility
- ✅ You want minimal maintenance
- ✅ Privacy is a selling point

### Choose **Local Auth** if:
- ✅ Privacy is critical
- ✅ You need offline-first
- ✅ You want user accounts but no cloud
- ✅ You're in a regulated industry
- ✅ You want to avoid backend costs

---

## 📖 Next Steps

1. **Decide which variant fits your app**
2. **Follow the setup guide for your chosen variant**
3. **Start building your app!**

---

**Questions?**
- 📖 [Full Documentation](../README.md)
- 🐛 [Report Issues](https://github.com/aydinfer/Expo-Starter/issues)
