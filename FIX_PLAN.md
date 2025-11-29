# Code Quality Fix Plan

## ✅ STATUS: COMPLETED

All fixes have been successfully applied and verified. See summary below.

## Overview

This plan addressed all ESLint errors, TypeScript errors, and code quality issues identified in the StampID codebase. Fixes were applied systematically, tested after each step, and are ready for commit.

---

## 🎉 Completion Summary

**Date Completed:** 2025-11-29

### Results

- ✅ **0 TypeScript errors** (was 1)
- ✅ **0 ESLint errors** (was 3)
- ✅ **0 ESLint warnings** (was 119)
- ✅ **All files Prettier-formatted** (49 files)

### Files Modified: 16 total

- 8 Glass components
- 3 App/utility files
- 5 Documentation files
- All files auto-formatted

---

## Issue Summary

### Critical Issues (Must Fix - Breaks Code)

- **3 ESLint Errors** - React Hooks violations in GlassBadge.tsx
- **1 TypeScript Error** - Type mismatch in GlassSkeleton.tsx

### High Priority Issues

- **6 React Hooks Warnings** - Missing useEffect dependencies
- **5 Unused Variables** - Clean code violations

### Medium Priority Issues

- **105 Prettier Warnings** - Auto-fixable formatting issues
- **1 Array Type Warning** - Style preference

### Low Priority Issues

- **1 ESLint Config** - Migration to ESLint v9 flat config

**Total:** 3 errors, 119 warnings across 49 files

---

## Fix Strategy

### Phase 1: Critical Fixes (Breaks Functionality)

#### 1.1 Fix GlassBadge.tsx - React Hooks Violations ⚠️ CRITICAL

**File:** `components/ui/glass/GlassBadge.tsx`
**Lines:** 138-157
**Issue:** Hooks called conditionally inside component

**Current Code (WRONG):**

```typescript
export function GlassBadge({ pulse, ... }: GlassBadgeProps) {
  // ... other code ...

  const scale = useSharedValue(1);  // ❌ Always called

  React.useEffect(() => {
    if (pulse) {  // ❌ Effect logic is conditional
      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        false
      );
    }
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Used conditionally later
  return (
    <Animated.View style={pulse ? animatedStyle : undefined}>
```

**ESLint Error:** Lines 138, 140, 153 show hooks being called but the logic depends on the `pulse` prop.

**Fix:**

```typescript
export function GlassBadge({ pulse, ... }: GlassBadgeProps) {
  // ✅ Always call hooks unconditionally
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (pulse) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        false
      );
    } else {
      // Reset to default when pulse is disabled
      scale.value = withTiming(1, { duration: 300 });
    }
  }, [pulse, scale]); // ✅ Add scale dependency

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  }, [scale]); // ✅ Add scale dependency

  // Rest stays the same
  return (
    <Animated.View style={pulse ? animatedStyle : undefined}>
```

**Testing:**

```bash
# After fix:
npx tsc --noEmit
ESLINT_USE_FLAT_CONFIG=false npx eslint components/ui/glass/GlassBadge.tsx
```

---

#### 1.2 Fix GlassSkeleton.tsx - TypeScript Type Error

**File:** `components/ui/glass/GlassSkeleton.tsx`
**Lines:** 109-110
**Issue:** `number | string` props assigned to React Native View style (only accepts `number`)

**Current Code (WRONG):**

```typescript
export interface GlassSkeletonProps {
  width?: number | string;  // ❌ Includes string
  height?: number | string; // ❌ Includes string
}

export function GlassSkeleton({ width = '100%', height = 20, ... }) {
  const widthStyle = typeof width === 'number' ? { width } : { width };  // ❌ No-op ternary
  const heightStyle = typeof height === 'number' ? { height } : { height }; // ❌ No-op ternary

  return (
    <View style={[widthStyle, heightStyle]}>  {/* ❌ Type error: string not compatible */}
```

**Fix Approach (Recommended):** Change props to only accept `number`, use NativeWind classes for percentages

```typescript
export interface GlassSkeletonProps {
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
  /** Width className override (e.g., 'w-full', 'w-1/2') */
  widthClass?: string;
  /** Height className override (e.g., 'h-20', 'h-full') */
  heightClass?: string;
}

export function GlassSkeleton({
  width,
  height = 20,
  widthClass = 'w-full',
  heightClass,
  borderRadius = 'md',
  ...
}: GlassSkeletonProps) {
  const sizeStyle = {
    ...(width && { width }),
    ...(height && { height }),
  };

  const classNames = [
    'overflow-hidden',
    borderRadiusConfig[borderRadius],
    !width ? widthClass : '',
    !height ? heightClass : '',
  ].filter(Boolean).join(' ');

  return (
    <View className={classNames} style={sizeStyle}>
```

**Update all usages:**

```typescript
// Before
<GlassSkeleton width="100%" height={200} />

// After
<GlassSkeleton widthClass="w-full" height={200} />
```

**Files to update:**

- `components/ui/glass/GlassSkeleton.tsx` (lines 76-240)
- Check for any imports/usages across codebase

**Testing:**

```bash
npx tsc --noEmit
ESLINT_USE_FLAT_CONFIG=false npx eslint components/ui/glass/GlassSkeleton.tsx
```

---

### Phase 2: High Priority Fixes (Code Quality)

#### 2.1 Fix React Hooks Dependency Warnings (6 files)

**Pattern:** Add missing dependencies or use refs if intentional

| File                        | Line | Missing Dependency                          | Fix                       |
| --------------------------- | ---- | ------------------------------------------- | ------------------------- |
| `GlassBadge.tsx`            | 151  | `scale`                                     | Add `scale` to deps array |
| `GlassLoadingSpinner.tsx`   | 144  | `rotation`                                  | Add `rotation` to deps    |
| `GlassLoadingSpinner.tsx`   | 219  | `dot1, dot2, dot3`                          | Add all to deps           |
| `GlassSegmentedControl.tsx` | 40   | `position`                                  | Add `position` to deps    |
| `GlassSheet.tsx`            | 60   | `initialSnapPoint, snapPoints, snapToPoint` | Add all to deps           |
| `GlassSkeleton.tsx`         | 95   | `progress`                                  | Add `progress` to deps    |
| `GlassSwitch.tsx`           | 41   | `progress`                                  | Add `progress` to deps    |

**Example Fix:**

```typescript
// Before
React.useEffect(() => {
  progress.value = withRepeat(...);
}, [noAnimation]);

// After
React.useEffect(() => {
  progress.value = withRepeat(...);
}, [noAnimation, progress]);
```

---

#### 2.2 Remove Unused Variables (5 instances)

| File                  | Line                  | Variable                | Fix                     |
| --------------------- | --------------------- | ----------------------- | ----------------------- |
| `components-demo.tsx` | 2                     | `Pressable`             | Remove from import      |
| `GlassSwitch.tsx`     | 3                     | `BlurView`              | Remove from import      |
| `format.ts`           | 59, 93, 140, 191, 220 | `error` in catch blocks | Remove or use: `_error` |

**Fix:**

```typescript
// Before
try {
  // ...
} catch (error) {
  // ❌ unused
  return 'Invalid';
}

// After (Option 1: Use it)
try {
  // ...
} catch (error) {
  console.error('Format error:', error);
  return 'Invalid';
}

// After (Option 2: Ignore)
try {
  // ...
} catch {
  return 'Invalid';
}
```

---

#### 2.3 Fix Array Type Warning

**File:** `app/example-settings.tsx`
**Line:** 49

```typescript
// Before
const sections: Array<SettingSection> = [...]

// After
const sections: SettingSection[] = [...]
```

---

### Phase 3: Medium Priority Fixes (Formatting)

#### 3.1 Auto-fix Prettier Issues (105 warnings, 49 files)

**Command:**

```bash
npx prettier --write .
```

**Affected Files:**

- App screens: `app/(tabs)/*.tsx`, `app/*.tsx`
- Glass components: `components/ui/glass/*.tsx`
- Utilities: `lib/**/*.ts`
- Docs: `docs/**/*.md`, `*.md`
- Config: `babel.config.js`, `tailwind.config.js`, `app.json`

**Verification:**

```bash
npx prettier --check .
```

---

### Phase 4: Low Priority Fixes (Optional)

#### 4.1 Migrate ESLint to v9 Flat Config

**Create:** `eslint.config.js`

```javascript
import expo from 'eslint-config-expo';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    ignores: ['node_modules/**', '.expo/**', 'dist/**', 'build/**'],
  },
  expo,
  prettier,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'warn',
    },
  },
];
```

**Remove:** `.eslintrc.js`

**Update package.json scripts:**

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

**Testing:**

```bash
npx eslint .
```

---

## Execution Order

### Step-by-Step Plan

```bash
# PHASE 1: CRITICAL FIXES

## Step 1: Fix GlassBadge.tsx React Hooks violations
1. Edit components/ui/glass/GlassBadge.tsx (lines 138-157)
2. Test: npx tsc --noEmit
3. Test: ESLINT_USE_FLAT_CONFIG=false npx eslint components/ui/glass/GlassBadge.tsx
4. Commit: "fix: resolve React Hooks violations in GlassBadge component"

## Step 2: Fix GlassSkeleton.tsx TypeScript error
1. Edit components/ui/glass/GlassSkeleton.tsx
   - Update interface (lines 19-30)
   - Update component logic (lines 76-116)
   - Update all predefined layouts (lines 180-239)
2. Search for all GlassSkeleton usages and update
3. Test: npx tsc --noEmit
4. Test: ESLINT_USE_FLAT_CONFIG=false npx eslint components/ui/glass/GlassSkeleton.tsx
5. Commit: "fix: correct TypeScript types in GlassSkeleton component"

# PHASE 2: HIGH PRIORITY FIXES

## Step 3: Fix React Hooks dependency warnings
1. Edit each file and add missing dependencies
2. Test each file: ESLINT_USE_FLAT_CONFIG=false npx eslint <file>
3. Commit: "fix: add missing dependencies to React Hooks across glass components"

## Step 4: Remove unused variables
1. Edit files to remove/use unused variables
2. Test: ESLINT_USE_FLAT_CONFIG=false npx eslint .
3. Commit: "chore: remove unused variables and imports"

## Step 5: Fix array type warning
1. Edit app/example-settings.tsx line 49
2. Test: ESLINT_USE_FLAT_CONFIG=false npx eslint app/example-settings.tsx
3. Commit: "style: use T[] array syntax instead of Array<T>"

# PHASE 3: MEDIUM PRIORITY FIXES

## Step 6: Auto-fix Prettier issues
1. Run: npx prettier --write .
2. Verify: npx prettier --check .
3. Commit: "style: apply Prettier formatting to all files"

# PHASE 4: LOW PRIORITY (OPTIONAL)

## Step 7: Migrate to ESLint v9 flat config
1. Create eslint.config.js
2. Delete .eslintrc.js
3. Update package.json scripts
4. Test: npx eslint .
5. Commit: "chore: migrate to ESLint v9 flat config format"

# FINAL VERIFICATION

## Step 8: Run full validation suite
npx tsc --noEmit                              # Should pass with 0 errors
npx eslint .                                  # Should pass with 0 errors, 0 warnings
npx prettier --check .                        # Should pass
npm start                                     # Should start without errors
```

---

## Success Criteria

✅ **Zero TypeScript errors**
✅ **Zero ESLint errors**
✅ **Zero ESLint warnings** (or only acceptable warnings)
✅ **Zero Prettier formatting issues**
✅ **All glass components function correctly**
✅ **App starts and runs without errors**

---

## Risk Assessment

### Low Risk

- Prettier auto-formatting (100% safe, reversible)
- Removing unused variables (no functional impact)
- Array type syntax change (no runtime impact)

### Medium Risk

- Adding hook dependencies (may cause re-renders)
  - **Mitigation:** Test each component individually
- GlassSkeleton API changes (breaks existing usage)
  - **Mitigation:** Search and update all usages before committing

### Higher Risk

- GlassBadge hooks refactor (changes animation behavior)
  - **Mitigation:** Test pulse animation thoroughly
  - **Fallback:** Keep original logic, just restructure hook calls

---

## Rollback Plan

Each commit is atomic and can be reverted independently:

```bash
# Revert last commit
git revert HEAD

# Revert specific commit
git revert <commit-hash>

# Reset to before all changes (nuclear option)
git reset --hard <commit-before-fixes>
```

---

## Notes

- All fixes maintain backward compatibility except GlassSkeleton API changes
- Prettier changes are cosmetic only, no functional impact
- ESLint v9 migration is optional and can be deferred
- Each phase can be executed independently
- Testing after each step ensures early error detection

---

**Created:** 2025-11-29
**Status:** Ready for execution
**Estimated Time:** ~2-3 hours total
