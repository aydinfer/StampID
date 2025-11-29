# Best Practices

Code standards, patterns, and conventions for this starter template.

## File Organization

### Folder Structure

```
clean-build/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigator group
│   ├── (auth)/            # Auth screens group
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── ui/               # UI components (buttons, inputs)
│   ├── auth/             # Auth-specific components
│   └── common/           # Shared components
├── lib/                   # Business logic
│   ├── hooks/            # Custom hooks
│   ├── store/            # Zustand stores
│   ├── supabase/         # Supabase client & helpers
│   └── utils/            # Utility functions
├── assets/               # Images, fonts
└── docs/                 # Documentation
```

### Naming Conventions

**Files:**

- Components: `PascalCase.tsx` (e.g., `GlassButton.tsx`)
- Hooks: `camelCase.ts` starting with `use` (e.g., `useAuth.ts`)
- Utils: `camelCase.ts` (e.g., `helpers.ts`)
- Screens: `kebab-case.tsx` or `PascalCase.tsx` (e.g., `user-profile.tsx`)

**Variables:**

- Components: `PascalCase` (e.g., `const GlassCard =`)
- Functions: `camelCase` (e.g., `const handlePress =`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `const API_URL =`)
- Private: Prefix with `_` (e.g., `const _internalHelper =`)

## Component Patterns

### Component Structure

```tsx
// 1. Imports (grouped)
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

// 2. Types/Interfaces
interface ProfileCardProps {
  user: User;
  onPress?: () => void;
}

// 3. Component
export function ProfileCard({ user, onPress }: ProfileCardProps) {
  // 3a. Hooks (useState, useEffect, custom hooks)
  const [isExpanded, setIsExpanded] = useState(false);

  // 3b. Derived state
  const fullName = `${user.firstName} ${user.lastName}`;

  // 3c. Event handlers
  const handlePress = () => {
    setIsExpanded(!isExpanded);
    onPress?.();
  };

  // 3d. Effects
  useEffect(() => {
    console.log('ProfileCard mounted');
  }, []);

  // 3e. Early returns
  if (!user) return null;

  // 3f. Render
  return (
    <Pressable onPress={handlePress}>
      <Text>{fullName}</Text>
    </Pressable>
  );
}
```

### Prop Types

```tsx
// ✅ Good - Explicit interface
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

// ❌ Bad - Inline types
function Button(props: {
  title: string;
  onPress: () => void;
  // ...
}) {}

// ✅ Good - Extend native props
interface GlassCardProps extends ViewProps {
  variant?: 'default' | 'premium';
  children: React.ReactNode;
}
```

### Default Props

```tsx
// ✅ Good - Destructure with defaults
function GlassCard({ variant = 'default', intensity = 60, children }: GlassCardProps) {
  // ...
}

// ❌ Avoid - defaultProps (deprecated in React 18)
GlassCard.defaultProps = {
  variant: 'default',
};
```

## TypeScript Standards

### Strict Mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

### No `any`

```tsx
// ❌ Bad
function processData(data: any) {
  return data.value;
}

// ✅ Good
interface Data {
  value: string;
}

function processData(data: Data) {
  return data.value;
}

// ✅ OK for truly dynamic data
function processJSON(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as Data).value;
  }
}
```

### Type vs Interface

```tsx
// ✅ Use interface for objects
interface User {
  id: string;
  name: string;
}

// ✅ Use type for unions/primitives
type Status = 'idle' | 'loading' | 'success' | 'error';
type ID = string | number;

// ✅ Use type for complex compositions
type ApiResponse<T> = {
  data: T;
  error?: string;
  status: Status;
};
```

## Styling Guidelines

### NativeWind First

```tsx
// ✅ Good - Use NativeWind classes
<View className="flex-1 bg-primary-500 p-4 rounded-xl">
  <Text className="text-white font-bold">Hello</Text>
</View>

// ❌ Bad - Inline styles
<View style={{ flex: 1, backgroundColor: '#3b82f6', padding: 16 }}>
  <Text style={{ color: 'white', fontWeight: 'bold' }}>Hello</Text>
</View>

// ✅ OK - Mix for dynamic styles
<View
  className="flex-1 p-4"
  style={{ backgroundColor: dynamicColor }}
>
```

### Design Tokens

```tsx
// ✅ Good - Use design tokens
<View className="bg-primary-500" />
<Text className="text-error-600" />

// ❌ Bad - Hardcoded colors
<View className="bg-[#3b82f6]" />
<Text style={{ color: '#dc2626' }} />

// ❌ Bad - Arbitrary values
<View className="mt-[17px]" />

// ✅ Good - Standard spacing
<View className="mt-4" />
```

### Component Variants

```tsx
// ✅ Good - Variant pattern
const variants = {
  primary: 'bg-primary-500 text-white',
  secondary: 'bg-white/10 text-white/70',
  ghost: 'bg-transparent text-primary-500',
};

<View className={variants[variant]} />

// ❌ Bad - Conditional mess
<View className={`
  ${variant === 'primary' ? 'bg-primary-500 text-white' : ''}
  ${variant === 'secondary' ? 'bg-white/10 text-white/70' : ''}
  ${variant === 'ghost' ? 'bg-transparent text-primary-500' : ''}
`} />
```

## State Management

### When to Use What

```tsx
// ✅ Component state - Local UI state
const [isOpen, setIsOpen] = useState(false);

// ✅ Zustand - Global UI state
const theme = useAppStore((state) => state.theme);

// ✅ React Query - Server state
const { data: user } = useQuery({
  queryKey: ['user'],
  queryFn: fetchUser,
});

// ❌ Don't use Zustand for server data
const user = useAppStore((state) => state.user); // Bad!
```

### State Colocation

```tsx
// ✅ Good - State close to where it's used
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <Input value={email} onChangeText={setEmail} />
      <Input value={password} onChangeText={setPassword} />
    </>
  );
}

// ❌ Bad - Unnecessary global state
const useFormStore = create((set) => ({
  email: '',
  password: '',
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
}));
```

## Performance Best Practices

### Memoization

```tsx
// ✅ Good - Memo expensive components
const ExpensiveList = React.memo(({ items }) => {
  return items.map((item) => <Item key={item.id} item={item} />);
});

// ✅ Good - useMemo for calculations
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);

// ❌ Bad - Unnecessary memo
const SimpleText = React.memo(({ text }) => <Text>{text}</Text>);
```

### Callbacks

```tsx
// ✅ Good - useCallback for child props
const handlePress = useCallback(() => {
  doSomething(id);
}, [id]);

<MemoizedChild onPress={handlePress} />

// ❌ Bad - New function every render
<MemoizedChild onPress={() => doSomething(id)} />
```

## Error Handling

### Try-Catch Pattern

```tsx
// ✅ Good - Handle errors gracefully
async function fetchData() {
  try {
    const data = await api.fetch();
    return { data, error: null };
  } catch (error) {
    console.error('Fetch failed:', error);
    return { data: null, error: error.message };
  }
}

// Usage
const { data, error } = await fetchData();
if (error) {
  showToast(error);
  return;
}
```

### Error Boundaries

```tsx
// components/common/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorScreen />;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>;
```

## Security Best Practices

### Environment Variables

```env
# ✅ Good - Public prefix for client-side vars
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co

# ❌ Bad - Secrets without prefix (won't work in Expo)
SUPABASE_SERVICE_KEY=secret-key
```

### API Keys

```tsx
// ✅ Good - Use environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;

// ❌ Bad - Hardcoded keys
const supabaseUrl = 'https://xxx.supabase.co';
```

### Input Validation

```tsx
// ✅ Good - Validate and sanitize
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const email = userInput.trim().toLowerCase();
if (!validateEmail(email)) {
  throw new Error('Invalid email');
}
```

## Code Quality

### DRY (Don't Repeat Yourself)

```tsx
// ❌ Bad - Repeated code
function handleLoginPress() {
  setLoading(true);
  try {
    await login();
  } finally {
    setLoading(false);
  }
}

function handleSignupPress() {
  setLoading(true);
  try {
    await signup();
  } finally {
    setLoading(false);
  }
}

// ✅ Good - Extract common pattern
async function withLoading(fn: () => Promise<void>) {
  setLoading(true);
  try {
    await fn();
  } finally {
    setLoading(false);
  }
}

const handleLoginPress = () => withLoading(login);
const handleSignupPress = () => withLoading(signup);
```

### YAGNI (You Aren't Gonna Need It)

```tsx
// ❌ Bad - Overengineered
interface ButtonConfig {
  variant: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape: 'rounded' | 'pill' | 'square';
  shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  // ... 20 more options
}

// ✅ Good - Start simple
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

// Add options when actually needed!
```

### KISS (Keep It Simple, Stupid)

```tsx
// ❌ Bad - Overcomplicated
const isValid = useMemo(() => {
  return compose(pipe(validate, normalize), filter(isNotEmpty), map(transform))(data);
}, [data]);

// ✅ Good - Clear and simple
const isValid = useMemo(() => {
  return data
    .filter((item) => item !== '')
    .map((item) => item.trim())
    .every((item) => item.length > 0);
}, [data]);
```

## Testing Standards

```tsx
// ✅ Good - Test behavior, not implementation
it('shows error when email is invalid', async () => {
  const { getByPlaceholderText, getByText } = render(<LoginForm />);

  fireEvent.changeText(getByPlaceholderText('Email'), 'invalid');
  fireEvent.press(getByText('Submit'));

  await waitFor(() => {
    expect(getByText('Invalid email')).toBeTruthy();
  });
});

// ❌ Bad - Testing implementation details
it('updates email state', () => {
  const { result } = renderHook(() => useLoginForm());
  result.current.setEmail('test@example.com');
  expect(result.current.email).toBe('test@example.com');
});
```

## Git Workflow

### Commit Messages

```bash
# ✅ Good - Conventional commits
feat(auth): add password reset flow
fix(ui): resolve button alignment issue
docs: update supabase setup guide
refactor(hooks): extract validation logic

# ❌ Bad - Vague messages
git commit -m "fix bug"
git commit -m "update stuff"
git commit -m "WIP"
```

### Branch Names

```bash
# ✅ Good
feature/user-profile
fix/login-error
refactor/state-management

# ❌ Bad
my-branch
test
updates
```

## Resources

- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Expo Best Practices](https://docs.expo.dev/guides/best-practices/)
