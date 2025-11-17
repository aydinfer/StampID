# Testing

Pragmatic testing approach: Test critical paths, not everything.

## Philosophy

**We follow pragmatic testing:**
- ✅ Test critical business logic
- ✅ Test authentication flows
- ✅ Test payment processing
- ✅ Test data mutations
- ❌ Don't test every component
- ❌ Don't test third-party libraries
- ❌ Don't test UI styling

**Goal:** Confidence without maintenance burden.

## Testing Stack

| Type | Library | Use For |
|------|---------|---------|
| **Unit** | Jest | Functions, hooks, utils |
| **Component** | React Native Testing Library | Component logic |
| **E2E** | Detox (optional) | Critical user flows |

## Setup

### Jest (Already Configured)

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Install Testing Library

```bash
npm install --save-dev @testing-library/react-native @testing-library/jest-native
```

## Unit Testing

### Testing Utilities

```typescript
// lib/utils/__tests__/helpers.test.ts
import { formatDate, formatCurrency, debounce } from '../helpers';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2025-11-17');
    expect(formatDate(date)).toBe('Nov 17, 2025');
  });

  it('handles invalid dates', () => {
    expect(formatDate(new Date('invalid'))).toBe('Invalid Date');
  });
});

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
});

describe('debounce', () => {
  jest.useFakeTimers();

  it('delays function execution', () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 500);

    debouncedFn();
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
```

### Testing Hooks

```typescript
// lib/hooks/__tests__/useAuth.test.ts
import { renderHook, waitFor } from '@testing-library/react-native';
import { useAuth } from '../useAuth';

// Mock Supabase
jest.mock('../../supabase/client', () => ({
  supabase: {
    auth: {
      signIn: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
  },
}));

describe('useAuth', () => {
  it('signs in user', async () => {
    const { result } = renderHook(() => useAuth());

    await result.current.signIn('test@example.com', 'password');

    await waitFor(() => {
      expect(result.current.user).toBeDefined();
    });
  });

  it('handles sign in error', async () => {
    const { result } = renderHook(() => useAuth());

    // Mock error
    supabase.auth.signIn.mockRejectedValueOnce(new Error('Invalid'));

    await result.current.signIn('wrong@example.com', 'wrong');

    await waitFor(() => {
      expect(result.current.error).toBe('Invalid');
    });
  });
});
```

## Component Testing

### Testing Glass Components

```typescript
// components/ui/glass/__tests__/GlassButton.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { GlassButton } from '../GlassButton';

describe('GlassButton', () => {
  it('renders title correctly', () => {
    const { getByText } = render(<GlassButton title="Click Me" />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <GlassButton title="Click Me" onPress={onPress} />
    );

    fireEvent.press(getByText('Click Me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading indicator', () => {
    const { getByTestId } = render(
      <GlassButton title="Submit" loading />
    );

    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('is disabled when loading', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <GlassButton title="Submit" loading onPress={onPress} />
    );

    fireEvent.press(getByText('Submit'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
```

### Testing Forms

```typescript
// components/auth/__tests__/LoginForm.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginForm } from '../LoginForm';

describe('LoginForm', () => {
  it('validates email format', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginForm />);

    const emailInput = getByPlaceholderText('Email');
    fireEvent.changeText(emailInput, 'invalid-email');

    const submitButton = getByText('Sign In');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('Invalid email address')).toBeTruthy();
    });
  });

  it('submits valid credentials', async () => {
    const onSubmit = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <LoginForm onSubmit={onSubmit} />
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');

    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
```

## Integration Testing

### Testing with React Query

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react-native';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const wrapper = ({ children }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('ProfileScreen', () => {
  it('fetches and displays profile', async () => {
    const { getByText } = render(<ProfileScreen />, { wrapper });

    await waitFor(() => {
      expect(getByText('John Doe')).toBeTruthy();
    });
  });
});
```

### Testing Navigation

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { render, fireEvent } from '@testing-library/react-native';

const renderWithNavigation = (component) => {
  return render(
    <NavigationContainer>
      {component}
    </NavigationContainer>
  );
};

describe('LoginScreen', () => {
  it('navigates to signup on button press', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = renderWithNavigation(
      <LoginScreen navigation={navigation} />
    );

    fireEvent.press(getByText('Create Account'));
    expect(navigation.navigate).toHaveBeenCalledWith('Signup');
  });
});
```

## E2E Testing (Optional)

### Install Detox

```bash
npm install --save-dev detox jest-circus
```

### Configure Detox

```json
// .detoxrc.js
module.exports = {
  testRunner: {
    args: {
      '$0': 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/YourApp.app',
      build: 'xcodebuild -workspace ios/YourApp.xcworkspace -scheme YourApp -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 15',
      },
    },
  },
  configurations: {
    'ios.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
  },
};
```

### E2E Test Example

```typescript
// e2e/login.e2e.ts
describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should login successfully', async () => {
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();

    await expect(element(by.text('Welcome'))).toBeVisible();
  });

  it('should show error for invalid credentials', async () => {
    await element(by.id('email-input')).typeText('wrong@example.com');
    await element(by.id('password-input')).typeText('wrong');
    await element(by.id('login-button')).tap();

    await expect(element(by.text('Invalid credentials'))).toBeVisible();
  });
});
```

## Mocking

### Mock Supabase

```typescript
// __mocks__/supabase.ts
export const supabase = {
  auth: {
    signIn: jest.fn(),
    signOut: jest.fn(),
    signUp: jest.fn(),
    onAuthStateChange: jest.fn(() => ({
      data: { subscription: { unsubscribe: jest.fn() } },
    })),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  })),
};
```

### Mock RevenueCat

```typescript
// __mocks__/react-native-purchases.ts
export default {
  configure: jest.fn(),
  getOfferings: jest.fn(() =>
    Promise.resolve({
      current: {
        availablePackages: [
          { identifier: 'monthly', product: { price: 9.99 } },
        ],
      },
    })
  ),
  purchasePackage: jest.fn(() =>
    Promise.resolve({
      customerInfo: { activeSubscriptions: ['monthly'] },
    })
  ),
};
```

### Mock AsyncStorage

```typescript
// __mocks__/@react-native-async-storage/async-storage.ts
export default {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
```

## Coverage Reports

```bash
npm run test:coverage
```

**Target coverage:**
- Critical paths: 90%+
- Utilities: 80%+
- Components: 60%+
- Overall: 70%+

**Don't aim for 100%** - diminishing returns.

## Best Practices

1. **Test behavior, not implementation**
   ```typescript
   // ❌ Bad
   expect(component.state.isLoading).toBe(true);

   // ✅ Good
   expect(getByTestId('loading-indicator')).toBeTruthy();
   ```

2. **Use descriptive test names**
   ```typescript
   // ❌ Bad
   it('works', () => {});

   // ✅ Good
   it('shows error message when email is invalid', () => {});
   ```

3. **Arrange, Act, Assert**
   ```typescript
   it('increments counter', () => {
     // Arrange
     const { getByTestId } = render(<Counter />);

     // Act
     fireEvent.press(getByTestId('increment-button'));

     // Assert
     expect(getByTestId('counter-value')).toHaveTextContent('1');
   });
   ```

4. **Don't test implementation details**
   ```typescript
   // ❌ Bad - testing hook internals
   expect(result.current.internalState).toBe('something');

   // ✅ Good - testing public API
   expect(result.current.data).toEqual(expectedData);
   ```

5. **Use `testID` for E2E tests**
   ```tsx
   <GlassButton testID="login-button" title="Sign In" />
   ```

## What to Test

### ✅ Always Test
- Authentication flows
- Payment processing
- Data mutations (create, update, delete)
- Form validation
- Critical business logic
- Error handling

### ⚠️ Sometimes Test
- Complex components
- Custom hooks
- Utility functions
- Navigation flows

### ❌ Don't Test
- Third-party libraries
- React Native components
- Styling (use visual regression instead)
- Simple presentational components

## CI Integration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

## Resources

- [Jest Docs](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Detox Docs](https://wix.github.io/Detox/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
