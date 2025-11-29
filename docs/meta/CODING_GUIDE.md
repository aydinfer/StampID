# Coding Guide

Opinionated guide for building production-ready Expo apps with TypeScript, NativeWind, and best practices.

## Core Principles

1. **DRY (Don't Repeat Yourself)** - Extract reusable logic into hooks and utilities
2. **YAGNI (You Aren't Gonna Need It)** - Build what you need now, not what you might need
3. **KISS (Keep It Simple, Stupid)** - Simple code is maintainable code
4. **SOLID** - Especially Single Responsibility Principle
5. **Official First** - Always use official Expo/React Native solutions before third-party

## TypeScript Standards

### Use Strict Mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### Interfaces Over Types

```tsx
// ✅ Good - Interfaces are extensible
interface UserProps {
  id: string;
  name: string;
  email: string;
}

// ❌ Avoid - Types are less flexible
type UserProps = {
  id: string;
  name: string;
};
```

### No Any, Ever

```tsx
// ❌ Bad
function handleData(data: any) {}

// ✅ Good
function handleData(data: unknown) {
  if (typeof data === 'string') {
    // TypeScript knows data is string here
  }
}
```

### Functional Components with Props

```tsx
// ✅ Good
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  return (/* ... */);
}

// ❌ Avoid React.FC (deprecated pattern)
const Button: React.FC<ButtonProps> = ({ title }) => { };
```

## Component Structure

### Standard Component Order

```tsx
// 1. Imports (grouped logically)
import { View, Text, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { colors } from '@/lib/utils/colors';

// 2. Types and Interfaces
interface MyComponentProps {
  title: string;
  onComplete: () => void;
}

// 3. Component
export function MyComponent({ title, onComplete }: MyComponentProps) {
  // 4. Hooks (always at top)
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // 5. Effects
  useEffect(() => {
    // Side effects
  }, []);

  // 6. Event Handlers
  const handlePress = () => {
    setLoading(true);
    // Logic here
  };

  // 7. Early Returns
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <SignInPrompt />;
  }

  // 8. Main Render
  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <Text className="text-xl font-bold">{title}</Text>
      <Pressable onPress={handlePress}>
        <Text>Complete</Text>
      </Pressable>
    </View>
  );
}
```

### File Structure

```
components/ui/Button.tsx

// One component per file
export function Button({ ... }) { }

// Subcomponents in same file if tightly coupled
function ButtonIcon({ ... }) { }

// Don't export subcomponents unless needed elsewhere
```

## Naming Conventions

### Components: PascalCase

```tsx
UserProfile.tsx;
ChatScreen.tsx;
LoadingSpinner.tsx;
```

### Files: kebab-case or PascalCase

```
// Screens and Components
UserProfile.tsx ✅
user-profile.tsx ✅

// Utilities and hooks
useAuth.ts ✅
helpers.ts ✅
api-client.ts ✅
```

### Variables: camelCase with Auxiliary Verbs

```tsx
// ✅ Good - Clear intent
const isLoading = true;
const hasError = false;
const canSubmit = form.isValid;
const shouldShowModal = user && !dismissed;

// ❌ Bad - Unclear
const loading = true;
const error = false;
const submit = form.isValid;
```

### Functions: Verb + Noun

```tsx
// ✅ Good
function fetchUserData() {}
function handleButtonPress() {}
function validateEmail() {}
function calculateTotal() {}

// ❌ Bad
function user() {}
function button() {}
function email() {}
```

## State Management Rules

### 1. Server State → React Query

```tsx
// ✅ Good - React Query for server data
import { useQuery } from '@tanstack/react-query';

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => fetchProfile(userId),
  });
}

// ❌ Bad - Don't store server data in Zustand
const useStore = create((set) => ({
  profile: null,
  fetchProfile: async () => {},
}));
```

### 2. Client State → Zustand

```tsx
// ✅ Good - UI state in Zustand
export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  isOnboarded: false,
  setTheme: (theme) => set({ theme }),
}));

// ❌ Bad - Don't use Zustand for server data
const useStore = create((set) => ({
  users: [], // This should be React Query
}));
```

### 3. Local State → useState

```tsx
// ✅ Good - Component-specific state
const [isModalOpen, setIsModalOpen] = useState(false);
const [inputValue, setInputValue] = useState('');

// ❌ Bad - Don't lift state unnecessarily
// If only one component needs it, keep it local
```

## Performance Best Practices

### 1. Memoization

```tsx
// ✅ Good - Memoize expensive calculations
const sortedItems = useMemo(() => items.sort((a, b) => a.price - b.price), [items]);

// ✅ Good - Memoize callbacks passed to children
const handlePress = useCallback(() => {
  doSomething(id);
}, [id]);

// ❌ Bad - Unnecessary memoization
const name = useMemo(() => user.name, [user]); // Just use user.name
```

### 2. Component Memoization

```tsx
// ✅ Good - Memo for components that receive same props often
export const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  return (/* complex rendering */);
});

// ❌ Bad - Don't memo everything
export const SimpleText = memo(function SimpleText({ text }) {
  return <Text>{text}</Text>;  // Too simple to benefit
});
```

### 3. FlatList Optimization

```tsx
// ✅ Good
<FlatList
  data={items}
  renderItem={renderItem}  // Extract to useCallback
  keyExtractor={(item) => item.id}
  removeClippedSubviews
  maxToRenderPerBatch={10}
  windowSize={5}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>

// ❌ Bad - Anonymous function causes re-renders
<FlatList
  renderItem={(item) => <Item data={item} />}
/>
```

## Error Handling Patterns

### 1. Early Returns

```tsx
// ✅ Good - Handle errors first
function processUser(user: User | null) {
  if (!user) {
    return null;
  }

  if (!user.email) {
    throw new Error('Email required');
  }

  // Happy path at the bottom
  return user.email;
}

// ❌ Bad - Nested conditions
function processUser(user: User | null) {
  if (user) {
    if (user.email) {
      return user.email;
    } else {
      throw new Error('Email required');
    }
  }
  return null;
}
```

### 2. Try-Catch Boundaries

```tsx
// ✅ Good - Specific error handling
async function handleSubmit() {
  try {
    await saveData(formData);
    router.push('/success');
  } catch (error) {
    if (error instanceof ValidationError) {
      setFieldErrors(error.fields);
    } else if (error instanceof NetworkError) {
      showToast('Network error. Please try again.');
    } else {
      // Log to error tracking service
      logError(error);
      showToast('Something went wrong');
    }
  }
}

// ❌ Bad - Silent failures
async function handleSubmit() {
  try {
    await saveData(formData);
  } catch {
    // Nothing
  }
}
```

### 3. Error Boundaries

```tsx
// ✅ Good - Wrap risky components
<ErrorBoundary fallback={<ErrorScreen />}>
  <ComplexFeature />
</ErrorBoundary>

// Create error boundaries for major sections
<ErrorBoundary fallback={<TabErrorScreen />}>
  <TabNavigator />
</ErrorBoundary>
```

## Styling Guidelines

### 1. Use NativeWind Classes

```tsx
// ✅ Good - NativeWind for everything
<View className="flex-1 bg-white dark:bg-gray-900 p-4">
  <Text className="text-xl font-bold text-gray-900 dark:text-white">
    Title
  </Text>
</View>

// ❌ Bad - Inline styles
<View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
  <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Title</Text>
</View>
```

### 2. Design Tokens Only

```tsx
// ✅ Good - Use design tokens
className = 'bg-primary-500 text-white';

// ❌ Bad - Hardcoded values
className = 'bg-[#3b82f6] text-[#ffffff]';
```

### 3. Consistent Spacing

```tsx
// ✅ Good - Use spacing scale (4px increments)
className = 'p-4 mb-6 gap-2'; // 16px, 24px, 8px

// ❌ Bad - Arbitrary values
className = 'p-[13px] mb-[23px]';
```

## Testing Strategy (Pragmatic)

### What to Test

**✅ Critical Paths:**

- Authentication flows
- Payment processing
- Data mutations
- Business logic

**✅ Utilities:**

- Helper functions
- Validators
- Formatters

**⚠️ Components (selectively):**

- Complex state management
- Edge cases
- Accessibility

**❌ Don't Test:**

- Simple presentational components
- Third-party library behavior
- Obvious code

### Testing Patterns

```tsx
// Unit tests for utilities
describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
});

// Integration tests for critical features
describe('Sign In Flow', () => {
  it('signs in user with valid credentials', async () => {
    const { signIn } = renderHook(() => useAuth());
    await signIn('test@example.com', 'password');
    expect(mockRouter.push).toHaveBeenCalledWith('/home');
  });
});
```

## Code Review Checklist

Before submitting code:

**TypeScript:**

- [ ] No `any` types
- [ ] All props have interfaces
- [ ] Strict mode enabled

**Performance:**

- [ ] No unnecessary re-renders
- [ ] FlatList optimized
- [ ] Images optimized

**Styling:**

- [ ] NativeWind classes used
- [ ] Design tokens only
- [ ] Dark mode support

**Error Handling:**

- [ ] Try-catch for async operations
- [ ] User-friendly error messages
- [ ] Loading states shown

**Code Quality:**

- [ ] No code duplication
- [ ] Functions < 50 lines
- [ ] Components < 300 lines
- [ ] Clear variable names

## Anti-Patterns to Avoid

### 1. God Components

```tsx
// ❌ Bad - 800 line component
export function UserDashboard() {
  // Too much logic
  // Too much state
  // Too many responsibilities
}

// ✅ Good - Split into smaller components
export function UserDashboard() {
  return (
    <View>
      <DashboardHeader />
      <StatsSection />
      <ActivityFeed />
      <QuickActions />
    </View>
  );
}
```

### 2. Props Drilling

```tsx
// ❌ Bad - Passing props through many levels
<A user={user}>
  <B user={user}>
    <C user={user}>
      <D user={user} />
    </C>
  </B>
</A>;

// ✅ Good - Use context or state management
const { user } = useAuth();
```

### 3. Premature Optimization

```tsx
// ❌ Bad - Optimizing before measuring
const memoizedValue = useMemo(() => x + y, [x, y]);

// ✅ Good - Optimize when needed
// Profile first, then optimize
const sum = x + y; // Simple calculation doesn't need memo
```

## Git Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add user profile screen
fix: resolve crash on sign out
docs: update API documentation
refactor: extract validation logic to hooks
perf: optimize FlatList rendering
test: add tests for auth hook
chore: update dependencies
```

## When to Extract Code

**Extract to a function when:**

- Used more than once
- Logic is complex (> 10 lines)
- Needs testing independently

**Extract to a component when:**

- Used more than once
- Has its own state/logic
- File exceeds 300 lines

**Extract to a hook when:**

- Reusable logic with state
- Side effects (useEffect)
- Used across components

## Summary

**Key Takeaways:**

1. TypeScript strict mode, no exceptions
2. NativeWind for all styling
3. React Query for server state, Zustand for client state
4. Test critical paths, not everything
5. Keep it simple, extract when needed
6. Early returns, clear error handling
7. Memoize expensive operations only

**Remember:** The best code is code that:

- Works correctly
- Is easy to understand
- Is easy to change
- Performs well enough

Not necessarily code that is "clever" or over-engineered.
